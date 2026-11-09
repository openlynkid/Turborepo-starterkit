import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.TURNSTILE_SECRET_KEY = "turnstile-test-secret";
});

import { isTurnstileEnabled, verifyTurnstile } from "./turnstile";

describe("verifyTurnstile", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports the CAPTCHA as enabled when a secret is configured", () => {
    expect(isTurnstileEnabled()).toBe(true);
  });

  it("accepts a token the API marks as successful", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );

    await expect(verifyTurnstile("token", "1.2.3.4")).resolves.toBe(true);
  });

  it("rejects a token the API marks as failed", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 200 }),
    );

    await expect(verifyTurnstile("token")).resolves.toBe(false);
  });

  it("rejects a missing token without calling the API", async () => {
    await expect(verifyTurnstile(undefined)).resolves.toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed when the verification request errors", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    await expect(verifyTurnstile("token")).resolves.toBe(false);
  });
});
