import { describe, expect, it } from "vitest";

import { submitContact } from "./contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to know more about this starter kit.",
};

describe("submitContact", () => {
  it("returns normalized data for valid input", async () => {
    const result = await submitContact({
      ...valid,
      email: "  Ada@Example.COM ",
    });

    expect(result).toEqual({
      ok: true,
      data: { ...valid, email: "ada@example.com" },
    });
  });

  it("groups validation errors by field", async () => {
    const result = await submitContact({
      name: "A",
      email: "bad",
      message: "x",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        "email",
        "message",
        "name",
      ]);
      expect(result.errors.email?.[0]).toBe("Invalid email address");
    }
  });

  it("rejects non-object input", async () => {
    const result = await submitContact("not an object");
    expect(result.ok).toBe(false);
  });
});
