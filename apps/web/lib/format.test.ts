import { describe, expect, it } from "vitest";

import { formatDateTime } from "./format";

describe("formatDateTime", () => {
  it("formats a Date consistently", () => {
    const formatted = formatDateTime(new Date("2026-01-02T03:04:00.000Z"));

    expect(formatted).toContain("2026");
    expect(formatted).toMatch(/Jan/);
  });

  it("accepts ISO strings", () => {
    expect(formatDateTime("2026-01-02T03:04:00.000Z")).toBe(
      formatDateTime(new Date("2026-01-02T03:04:00.000Z")),
    );
  });

  it("falls back to a dash for invalid input", () => {
    expect(formatDateTime("not-a-date")).toBe("—");
  });
});
