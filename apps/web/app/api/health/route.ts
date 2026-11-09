import { NextResponse } from "next/server";

import { pingDatabase } from "@repo/db";

import { getDb } from "@/lib/db";

// Health must reflect the live database, not a build-time snapshot.
export const dynamic = "force-dynamic";

/**
 * Liveness/readiness probe. Reports `ok` when the app is up and, if a database
 * is configured, reachable. Returns 503 when the database is configured but
 * unreachable so orchestrators can pull the instance out of rotation.
 */
export async function GET() {
  const db = getDb();
  let database: "ok" | "error" | "not-configured" = "not-configured";

  if (db) {
    database = (await pingDatabase(db.db)) ? "ok" : "error";
  }

  const ok = database !== "error";

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      database,
      uptimeSeconds: Math.round(process.uptime()),
    },
    { status: ok ? 200 : 503 },
  );
}
