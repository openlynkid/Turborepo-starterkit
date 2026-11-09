import { beforeEach, describe, expect, it, vi } from "vitest";

// Set the auth env before `@/env` is evaluated (imports are hoisted).
vi.hoisted(() => {
  process.env.SESSION_SECRET = "test-secret-value-that-is-long-enough-1234";
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.ADMIN_PASSWORD = "correct horse battery";
});

import {
  createSessionToken,
  isAuthEnabled,
  SESSION_MAX_AGE,
  verifyCredentials,
  verifySessionToken,
} from "./session";

describe("session tokens", () => {
  it("round-trips a signed token", () => {
    const token = createSessionToken("admin@example.com");
    const session = verifySessionToken(token);

    expect(session?.email).toBe("admin@example.com");
  });

  it("rejects a tampered payload", () => {
    const token = createSessionToken("admin@example.com");
    const [, signature] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({ email: "attacker@example.com", exp: 9_999_999_999 }),
    ).toString("base64url");

    expect(verifySessionToken(`${forged}.${signature}`)).toBeNull();
  });

  it("rejects a missing or malformed token", () => {
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("not-a-token")).toBeNull();
  });

  it("rejects an expired token", () => {
    vi.useFakeTimers();
    try {
      const token = createSessionToken("admin@example.com");
      vi.advanceTimersByTime((SESSION_MAX_AGE + 1) * 1000);
      expect(verifySessionToken(token)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("isAuthEnabled", () => {
  it("is enabled when the secret and admin credentials are set", () => {
    expect(isAuthEnabled()).toBe(true);
  });
});

describe("verifyCredentials", () => {
  it("accepts the configured credentials case-insensitively", () => {
    expect(
      verifyCredentials("  ADMIN@Example.com ", "correct horse battery"),
    ).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(verifyCredentials("admin@example.com", "wrong")).toBe(false);
  });

  it("rejects an unknown email", () => {
    expect(
      verifyCredentials("someone@example.com", "correct horse battery"),
    ).toBe(false);
  });
});
