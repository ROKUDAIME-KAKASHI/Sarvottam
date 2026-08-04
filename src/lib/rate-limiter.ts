/**
 * Simple in-memory rate limiter for auth endpoints
 * In production, replace with Redis-based implementation (e.g., @upstash/ratelimit)
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix?: string; // Prefix for rate limit keys
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  total: number;
}

// In-memory store (use Redis in production)
const store = new Map<string, { count: number; resetTime: number }>();

// Cleanup interval to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyPrefix = "rl" } = config;

  return {
    /**
     * Check and consume a rate limit slot
     */
    async limit(identifier: string): Promise<RateLimitResult> {
      const key = `${keyPrefix}:${identifier}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Get current entry or create new
      let entry = store.get(key);

      // Reset if window expired
      if (!entry || entry.resetTime < now) {
        entry = { count: 0, resetTime: now + windowMs };
      }

      // Increment and store
      entry.count += 1;
      store.set(key, entry);

      const remaining = Math.max(0, maxRequests - entry.count);
      const success = entry.count <= maxRequests;

      return {
        success,
        remaining,
        resetTime: entry.resetTime,
        total: maxRequests,
      };
    },

    /**
     * Get current rate limit status without consuming
     */
    async get(identifier: string): Promise<RateLimitResult | null> {
      const key = `${keyPrefix}:${identifier}`;
      const entry = store.get(key);
      const now = Date.now();

      if (!entry || entry.resetTime < now) {
        return null;
      }

      return {
        success: entry.count < maxRequests,
        remaining: Math.max(0, maxRequests - entry.count),
        resetTime: entry.resetTime,
        total: maxRequests,
      };
    },

    /**
     * Reset rate limit for an identifier
     */
    async reset(identifier: string): Promise<void> {
      const key = `${keyPrefix}:${identifier}`;
      store.delete(key);
    },
  };
}

// Pre-configured limiters for common use cases
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 attempts per 15 min
  keyPrefix: "auth",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  keyPrefix: "api",
});

export const credentialsRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 min
  keyPrefix: "credentials",
});

/**
 * Extract client identifier from request
 * Uses IP + User-Agent for better identification
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  // Simple hash to avoid storing full UA
  const uaHash = simpleHash(userAgent).toString(36);
  return `${ip}:${uaHash}`;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Rate limit response headers
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.total.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  };
}
