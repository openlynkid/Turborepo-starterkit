import { env } from "@/env";

export type RateLimitResult = {
  ok: boolean;
  /** Requests still allowed in the current window. */
  remaining: number;
  /** Seconds until the window resets (0 when a request is allowed). */
  retryAfterSeconds: number;
};

export type RateLimiterOptions = {
  max: number;
  windowMs: number;
  now?: () => number;
};

/**
 * Fixed-window rate limiter. State lives in process memory, so it protects a
 * single server instance — enough for local use and a small single-node
 * deployment. Behind multiple instances (serverless, several containers) put
 * a shared limit at the edge (for example Vercel Firewall) as well.
 */
export function createRateLimiter({
  max,
  windowMs,
  now = Date.now,
}: RateLimiterOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  // Above this many tracked keys, sweep expired entries so a long-lived process
  // does not grow without bound under many distinct client IPs.
  const pruneThreshold = 10_000;

  function prune(): void {
    const current = now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= current) {
        hits.delete(key);
      }
    }
  }

  return {
    check(key: string): RateLimitResult {
      const current = now();
      const entry = hits.get(key);

      if (!entry || entry.resetAt <= current) {
        if (hits.size >= pruneThreshold) {
          prune();
        }
        hits.set(key, { count: 1, resetAt: current + windowMs });
        return { ok: true, remaining: max - 1, retryAfterSeconds: 0 };
      }

      if (entry.count >= max) {
        return {
          ok: false,
          remaining: 0,
          retryAfterSeconds: Math.ceil((entry.resetAt - current) / 1000),
        };
      }

      entry.count += 1;
      return { ok: true, remaining: max - entry.count, retryAfterSeconds: 0 };
    },

    prune,
  };
}

export const contactRateLimiter = createRateLimiter({
  max: env.RATE_LIMIT_MAX,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
});

/**
 * Separate, stricter limiter for login attempts. A fixed window per client IP
 * blunts online password guessing against the single admin account.
 */
export const loginRateLimiter = createRateLimiter({
  max: env.LOGIN_RATE_LIMIT_MAX,
  windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MS,
});

/**
 * Best-effort client IP from proxy headers. Falls back to a shared bucket so
 * a missing header still hits a limit instead of bypassing it.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  return headers.get("x-real-ip") ?? "unknown";
}
