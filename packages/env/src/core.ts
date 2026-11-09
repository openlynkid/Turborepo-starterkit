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
};

/**
 * Client-side environment variables. Only `NEXT_PUBLIC_`-prefixed values may
 * appear here because they are inlined into the browser bundle.
 */
export const clientSchema = {
  NEXT_PUBLIC_APP_URL: z
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
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
