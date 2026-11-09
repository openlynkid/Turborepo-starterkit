import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Server-side environment variables. These are validated at runtime and must
 * never be exposed to the browser.
 */
export const serverSchema = {
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL").optional(),
  // Signs the session cookie. Required once you enable auth; set a long random
  // value (for example `openssl rand -base64 48`).
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters")
    .optional(),
  // Credentials for the built-in single-admin login. Leave unset for local
  // development without authentication; set both in production.
  ADMIN_EMAIL: z.email("ADMIN_EMAIL must be a valid email").optional(),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "ADMIN_PASSWORD must be at least 8 characters")
    .optional(),
  // Fixed-window rate limit for the public contact endpoint.
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  // Stricter fixed-window limit for login attempts, to blunt brute force.
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  LOGIN_RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60_000),
  // Cloudflare Turnstile secret. When set, the contact form requires a token.
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
};

/**
 * Client-side environment variables. Only `NEXT_PUBLIC_`-prefixed values may
 * appear here because they are inlined into the browser bundle.
 */
export const clientSchema = {
  NEXT_PUBLIC_APP_URL: z
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
};

type RuntimeEnv = Record<string, string | undefined>;

/**
 * Builds the validated server environment. Pass the runtime env explicitly so
 * the schema stays testable and independent of `process.env`.
 */
export function createServerEnv(runtimeEnv: RuntimeEnv = process.env) {
  return createEnv({
    server: serverSchema,
    runtimeEnv,
    emptyStringAsUndefined: true,
  });
}

/**
 * Builds the validated client environment. In a bundler (Next.js) the values
 * must be passed explicitly so they are statically inlined.
 */
export function createClientEnv(runtimeEnv: RuntimeEnv) {
  return createEnv({
    client: clientSchema,
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv,
    emptyStringAsUndefined: true,
  });
}

export type ServerEnv = ReturnType<typeof createServerEnv>;
export type ClientEnv = ReturnType<typeof createClientEnv>;
