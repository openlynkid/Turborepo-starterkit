import { createServerEnv } from "@repo/env";

/**
 * Validated server environment. Import this anywhere on the server.
 *
 * @example
 * import { env } from "@/env";
 * const url = env.DATABASE_URL;
 */
export const env = createServerEnv();

/**
 * Validated client environment, re-exported for convenience. Client components
 * should import it from `@/client-env` directly so the server schema never
 * reaches the browser bundle.
 *
 * @example
 * import { clientEnv } from "@/client-env";
 * const url = clientEnv.NEXT_PUBLIC_APP_URL;
 */
export { clientEnv } from "./client-env";
