import { createTestDb, type TestDb } from "@repo/db/testing";
import { createContactRepository } from "@repo/db/repositories/contact";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { submitContact } from "./contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to know more about this starter kit.",
};

describe("submitContact persistence", () => {
  let testDb: TestDb;
  let repository: ReturnType<typeof createContactRepository>;

  beforeEach(async () => {
    testDb = await createTestDb();
    repository = createContactRepository(testDb.db);
  });

  afterEach(async () => {
    await testDb.close();
  });

  it("writes a validated message to the database and returns its id", async () => {
    const result = await submitContact(valid, { repository });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.id).toBeDefined();
    }

    const rows = await repository.list();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.email).toBe("ada@example.com");
    expect(rows[0]?.id).toBe(result.ok ? result.id : undefined);
  });

  it("does not touch the database when input is invalid", async () => {
    const result = await submitContact(
      { name: "A", email: "bad", message: "x" },
      { repository },
    );

    expect(result.ok).toBe(false);
    await expect(repository.list()).resolves.toHaveLength(0);
  });

  it("skips persistence when no repository is provided", async () => {
    const result = await submitContact(valid);
    expect(result).toEqual({ ok: true, data: valid });
  });
});
