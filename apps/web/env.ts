import { createClientEnv, createServerEnv } from "@repo/env";

/**
 * Validated server environment. Import this anywhere on the server.
 *
 * @example
 * import { env } from "@/env";
 * const url = env.DATABASE_URL;
 */
export const env = createServerEnv();

/**
 * Validated client environment. The `NEXT_PUBLIC_*` values must be referenced
 * statically so the bundler can inline them.
 *
 * @example
 * import { clientEnv } from "@/env";
 * const url = clientEnv.NEXT_PUBLIC_APP_URL;
 */
export const clientEnv = createClientEnv({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
