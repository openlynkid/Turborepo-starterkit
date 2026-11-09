import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import type { Database } from "./client";
import { runMigrations } from "./migrate";
import * as schema from "./schema";

export type TestDb = {
  db: Database;
  close: () => Promise<void>;
};

/**
 * Spins up an in-memory Postgres (PGlite) and applies the real migrations, so
 * tests exercise the actual schema and SQL without a running server.
 */
export async function createTestDb(): Promise<TestDb> {
  const client = new PGlite();
  const db = drizzle(client, { schema }) as unknown as Database;

  await runMigrations(db);

  return {
    db,
    close: () => client.close(),
  };
}
