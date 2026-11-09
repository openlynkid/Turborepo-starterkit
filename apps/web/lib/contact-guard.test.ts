import { describe, expect, it } from "vitest";

import { guardContactSubmission } from "./contact-guard";

describe("guardContactSubmission", () => {
  it("allows submissions up to the configured limit", async () => {
    // Default RATE_LIMIT_MAX is 5; use a dedicated IP for isolation.
    for (let i = 0; i < 5; i += 1) {
      await expect(guardContactSubmission({ ip: "10.0.0.1" })).resolves.toEqual(
        { ok: true },
      );
    }
  });

  it("blocks submissions over the limit with a 429", async () => {
    const ip = "10.0.0.2";
    for (let i = 0; i < 5; i += 1) {
      await guardContactSubmission({ ip });
    }

    const result = await guardContactSubmission({ ip });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(429);
      expect(result.errors.form?.[0]).toMatch(/too many requests/i);
    }
  });
});
