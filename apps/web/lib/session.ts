import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/env";

/** Name of the signed session cookie. Shared with `proxy.ts`. */
export const SESSION_COOKIE = "session";

/** How long a session stays valid, in seconds (7 days). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type Session = {
  email: string;
  /** Unix timestamp (seconds) at which the token expires. */
  exp: number;
};

/**
 * Authentication is opt-in: it only turns on when a session secret and an
 * admin credential are all configured. Without them the app stays open,
 * which keeps local development and CI working with no setup.
 */
export function isAuthEnabled(): boolean {
  return Boolean(env.SESSION_SECRET && env.ADMIN_EMAIL && env.ADMIN_PASSWORD);
}

function getSecret(): string {
  const secret = env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/** Creates a signed, tamper-evident session token. */
export function createSessionToken(email: string): string {
  const session: Session = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/**
 * Verifies a session token's signature and expiry. Returns `null` for any
 * malformed, tampered, or expired token.
 */
export function verifySessionToken(token: string | undefined): Session | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    provided.length !== expectedBuffer.length ||
    !timingSafeEqual(provided, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Session;
    if (typeof session.email !== "string" || typeof session.exp !== "number") {
      return null;
    }
    if (session.exp * 1000 <= Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Checks the submitted credentials against the configured admin account using
 * a constant-time comparison so login responses do not leak how much of a
 * value matched.
 */
export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return false;
  }

  const emailMatches = safeEqual(
    email.trim().toLowerCase(),
    adminEmail.trim().toLowerCase(),
  );
  const passwordMatches = safeEqual(password, adminPassword);
  return emailMatches && passwordMatches;
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}
