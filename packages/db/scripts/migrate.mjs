// Deploy-time migration runner. `drizzle-kit migrate` tracks applied
// migrations in a journal table, so this is safe to run on every deploy.
//
// Two guard rails keep it from surprising you:
//   1. DATABASE_URL is optional for the starter kit: skip cleanly when it is
//      unset instead of failing against the config's localhost fallback.
//   2. On Vercel, only production deployments migrate. Preview deployments
//      usually reuse the same DATABASE_URL, and a branch build should not
//      rewrite the production schema.
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set - skipping database migrations.");
  process.exit(0);
}

const vercelEnv = process.env.VERCEL_ENV;
if (vercelEnv && vercelEnv !== "production") {
  console.log(
    `VERCEL_ENV is "${vercelEnv}" - skipping migrations (production only).`,
  );
  process.exit(0);
}

const result = spawnSync("drizzle-kit", ["migrate"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
