import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Driver-agnostic database handle. Both the production (postgres.js) and test
 * (PGlite) clients are `PgDatabase` instances over the same schema, so
 * repositories accept either one.
 */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

export type DbClient = {
  db: Database;
  close: () => Promise<void>;
};

/**
 * Creates a production database client backed by postgres.js.
 *
 * `max: 1` and `prepare: false` keep the client safe behind serverless
 * connection poolers (e.g. Supabase, Neon).
 */
export function createDbClient(connectionString: string): DbClient {
  const client = postgres(connectionString, { max: 1, prepare: false });

  return {
    db: drizzle(client, { schema }),
    close: () => client.end({ timeout: 5 }),
  };
}

/** Runs a trivial query to check that the database is reachable. */
export async function pingDatabase(db: Database): Promise<boolean> {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}

export { schema };
