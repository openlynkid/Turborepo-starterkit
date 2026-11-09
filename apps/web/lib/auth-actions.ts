"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getClientIp, loginRateLimiter } from "@/lib/rate-limit";
import {
  createSessionToken,
  isAuthEnabled,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifyCredentials,
} from "@/lib/session";

export type LoginState = { error?: string };

/**
 * Validates the submitted credentials and, on success, sets a signed session
 * cookie. Returns a user-safe error otherwise. Failed attempts are rate-limited
 * per client IP so online password guessing against the admin account is
 * throttled.
 */
export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAuthEnabled()) {
    return { error: "Authentication is not configured on this deployment." };
  }

  const requestHeaders = await headers();
  const limit = loginRateLimiter.check(getClientIp(requestHeaders));
  if (!limit.ok) {
    return {
      error: `Too many attempts. Please try again in ${limit.retryAfterSeconds}s.`,
    };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(email, password)) {
    return { error: "Invalid email or password." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(email.trim().toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/dashboard");
}

/** Clears the session cookie and returns to the login screen. */
export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
