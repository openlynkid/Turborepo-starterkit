import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy values", () => {
    expect(cn("px-2", false && "hidden", undefined, null, "py-1")).toBe(
      "px-2 py-1",
    );
  });

  it("supports conditional objects", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });
});
