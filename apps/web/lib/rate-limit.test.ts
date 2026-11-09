import { describe, expect, it } from "vitest";

import { createRateLimiter } from "./rate-limit";

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
