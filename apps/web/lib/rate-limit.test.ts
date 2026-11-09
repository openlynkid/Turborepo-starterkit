import { describe, expect, it } from "vitest";

import { createRateLimiter, getClientIp, loginRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows requests up to the limit and blocks the next one", () => {
    const limiter = createRateLimiter({ max: 2, windowMs: 1000, now: () => 0 });

    expect(limiter.check("ip").ok).toBe(true);
    expect(limiter.check("ip").ok).toBe(true);

    const blocked = limiter.check("ip");
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBe(1);
  });

  it("tracks each key independently", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 1000, now: () => 0 });

    expect(limiter.check("a").ok).toBe(true);
    expect(limiter.check("b").ok).toBe(true);
    expect(limiter.check("a").ok).toBe(false);
  });

  it("resets once the window elapses", () => {
    let now = 0;
    const limiter = createRateLimiter({
      max: 1,
      windowMs: 1000,
      now: () => now,
    });

    expect(limiter.check("ip").ok).toBe(true);
    expect(limiter.check("ip").ok).toBe(false);

    now = 1001;
    expect(limiter.check("ip").ok).toBe(true);
  });

  it("prunes expired entries", () => {
    let now = 0;
    const limiter = createRateLimiter({
      max: 1,
      windowMs: 1000,
      now: () => now,
    });

    limiter.check("ip");
    now = 2000;
    limiter.prune();

    expect(limiter.check("ip").ok).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.7, 10.0.0.1",
    });
    expect(getClientIp(headers)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "198.51.100.4" }))).toBe(
      "198.51.100.4",
    );
  });

  it("falls back to a shared bucket when no header is present", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});

describe("loginRateLimiter", () => {
  it("blocks after the configured number of attempts from one IP", () => {
    const ip = "203.0.113.99";
    const max = Number(process.env.LOGIN_RATE_LIMIT_MAX ?? 10);

    for (let i = 0; i < max; i += 1) {
      expect(loginRateLimiter.check(ip).ok).toBe(true);
    }
    expect(loginRateLimiter.check(ip).ok).toBe(false);
  });
});
