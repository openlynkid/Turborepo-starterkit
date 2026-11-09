import { describe, expect, it } from "vitest";

import { emailSchema, idSchema, passwordSchema } from "./common";

describe("emailSchema", () => {
  it("normalizes case and whitespace", () => {
    expect(emailSchema.parse("  User@Example.COM ")).toBe("user@example.com");
  });

  it("rejects malformed emails", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("accepts a password within bounds", () => {
    expect(passwordSchema.safeParse("supersecret").success).toBe(true);
  });

  it("rejects short passwords", () => {
    expect(passwordSchema.safeParse("short").success).toBe(false);
  });

  it("rejects overly long passwords", () => {
    expect(passwordSchema.safeParse("a".repeat(73)).success).toBe(false);
  });
});

describe("idSchema", () => {
  it("accepts a uuid", () => {
    expect(
      idSchema.safeParse("123e4567-e89b-12d3-a456-426614174000").success,
    ).toBe(true);
  });

  it("rejects a non-uuid", () => {
    expect(idSchema.safeParse("123").success).toBe(false);
  });
});
