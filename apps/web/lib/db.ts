import {
  createContactRepository,
  createDbClient,
  type ContactRepository,
  type DbClient,
} from "@repo/db";

import { env } from "@/env";

let cached: DbClient | null = null;

/**
 * Returns the shared database client, or `null` when `DATABASE_URL` is not
 * configured. Callers can then degrade gracefully instead of crashing, which
 * keeps local development and CI working without a database.
 */
export function getDb(): DbClient | null {
  if (!env.DATABASE_URL) {
    return null;
  }

  cached ??= createDbClient(env.DATABASE_URL);
  return cached;
}

export function getContactRepository(): ContactRepository | null {
  const client = getDb();
  return client ? createContactRepository(client.db) : null;
}
