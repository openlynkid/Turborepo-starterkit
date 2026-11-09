import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { pingDatabase } from "./client";
import { createTestDb, type TestDb } from "./testing";

describe("pingDatabase", () => {
  let testDb: TestDb;

  beforeEach(async () => {
    testDb = await createTestDb();
  });

  afterEach(async () => {
    await testDb.close();
  });

  it("returns true for a reachable database", async () => {
    await expect(pingDatabase(testDb.db)).resolves.toBe(true);
  });
});
