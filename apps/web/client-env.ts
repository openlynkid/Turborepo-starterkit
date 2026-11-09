import { createClientEnv } from "@repo/env";

/**
 * Validated client environment. Kept in its own module so client components
 * only bundle the `NEXT_PUBLIC_*` schema — importing `@/env` would pull the
 * server schema into the browser bundle.
 *
 * `NEXT_PUBLIC_*` values must be referenced statically so the bundler can
 * inline them.
 */
export const clientEnv = createClientEnv({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
});
