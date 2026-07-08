import { NextRequest } from "next/server";
import { handlers } from "@/auth";

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

export const GET = async (req: NextRequest) => {
  const res = await handlers.GET(req);
  return stripMaxAgeFromSessionCookie(res);
};

export const POST = async (req: NextRequest) => {
  const res = await handlers.POST(req);
  return stripMaxAgeFromSessionCookie(res);
};
