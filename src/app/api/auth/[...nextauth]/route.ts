import { NextRequest, NextResponse } from "next/server";
import { handlers } from "@/auth";
import {
  authRateLimiter,
  credentialsRateLimiter,
  getClientIdentifier,
  rateLimitHeaders,
} from "@/lib/rate-limiter";

const stripMaxAgeFromSessionCookie = (res: Response) => {
  const setCookie = res.headers.getSetCookie();
  if (setCookie && setCookie.length > 0) {
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("set-cookie");

    setCookie.forEach((cookie) => {
      if (cookie.includes("authjs.session-token") || cookie.includes("next-auth.session-token")) {
        // Remove Max-Age and Expires to make it a browser session cookie
        let modifiedCookie = cookie.replace(/Max-Age=[0-9]+(?:;\s*)?/gi, "");
        modifiedCookie = modifiedCookie.replace(/Expires=[^;]+(?:;\s*)?/gi, "");
        newHeaders.append("set-cookie", modifiedCookie);
      } else {
        newHeaders.append("set-cookie", cookie);
      }
    });

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  }
  return res;
};

/**
 * Apply rate limiting to auth endpoints
 * - GET/POST to /api/auth/* : 10 requests per 15 min per IP
 * - POST to /api/auth/callback/credentials : 5 attempts per 15 min per IP
 */
async function withRateLimit(
  req: NextRequest,
  limiter: typeof authRateLimiter,
  handler: (req: NextRequest) => Promise<Response>
): Promise<Response> {
  const identifier = getClientIdentifier(req);
  const result = await limiter.limit(identifier);

  const headers = rateLimitHeaders(result);

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const res = await handler(req);

  // Add rate limit headers to successful responses
  const newHeaders = new Headers(res.headers);
  Object.entries(headers).forEach(([key, value]) => newHeaders.set(key, value));

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
}

export const GET = async (req: NextRequest) => {
  return withRateLimit(req, authRateLimiter, async (r) => {
    const res = await handlers.GET(r);
    return stripMaxAgeFromSessionCookie(res);
  });
};

export const POST = async (req: NextRequest) => {
  // Stricter rate limiting for credentials callback
  const isCredentialsCallback = req.nextUrl.pathname.includes("/callback/credentials");
  const limiter = isCredentialsCallback ? credentialsRateLimiter : authRateLimiter;

  return withRateLimit(req, limiter, async (r) => {
    const res = await handlers.POST(r);
    return stripMaxAgeFromSessionCookie(res);
  });
};
