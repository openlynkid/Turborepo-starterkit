import { describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.SESSION_SECRET = "test-secret-value-that-is-long-enough-1234";
  process.env.ADMIN_EMAIL = "admin@example.com";
  process.env.ADMIN_PASSWORD = "correct horse battery";
});

import { NextRequest } from "next/server";

import { createSessionToken } from "@/lib/session";

import { proxy } from "./proxy";

function request(path: string, cookie?: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"), {
    headers: cookie ? { cookie } : {},
  });
}

describe("proxy", () => {
  it("redirects an unauthenticated request to /login", () => {
    const response = proxy(request("/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("lets an authenticated request through", () => {
    const token = createSessionToken("admin@example.com");
    const response = proxy(request("/dashboard", `session=${token}`));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("rejects a tampered cookie", () => {
    const response = proxy(request("/messages", "session=forged.token"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });
});
