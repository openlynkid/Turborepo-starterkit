import { describe, expect, it } from "vitest";

import { contactFormSchema } from "./contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to know more about this starter kit.",
};

describe("contactFormSchema", () => {
  it("accepts valid input", () => {
    const result = contactFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims and lowercases the email", () => {
    const result = contactFormSchema.parse({
      ...valid,
      email: "  Ada@Example.COM  ",
    });
    expect(result.email).toBe("ada@example.com");
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["email"]);
    }
  });

  it("rejects a too-short name", () => {
    const result = contactFormSchema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short message", () => {
    const result = contactFormSchema.safeParse({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("reports every invalid field at once", () => {
    const result = contactFormSchema.safeParse({
      name: "",
      email: "bad",
      message: "x",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0]);
      expect(fields).toEqual(
        expect.arrayContaining(["name", "email", "message"]),
      );
    }
  });
});
