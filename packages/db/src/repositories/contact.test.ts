import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createContactRepository } from "./contact";
import { createTestDb, type TestDb } from "../testing";

describe("contactRepository", () => {
  let testDb: TestDb;
  let repo: ReturnType<typeof createContactRepository>;

  beforeEach(async () => {
    testDb = await createTestDb();
    repo = createContactRepository(testDb.db);
  });

  afterEach(async () => {
    await testDb.close();
  });

  it("creates a message and returns the persisted row", async () => {
    const created = await repo.create({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello from the test suite.",
    });

    expect(created.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(created.name).toBe("Ada Lovelace");
    expect(created.status).toBe("new");
    expect(created.createdAt).toBeInstanceOf(Date);
  });

  it("finds a message by id", async () => {
    const created = await repo.create({
      name: "Grace Hopper",
      email: "grace@example.com",
      message: "Looking forward to it.",
    });

    const found = await repo.findById(created.id);

    expect(found?.id).toBe(created.id);
    expect(found?.email).toBe("grace@example.com");
  });

  it("returns null for an unknown id", async () => {
    const found = await repo.findById("00000000-0000-0000-0000-000000000000");
    expect(found).toBeNull();
  });

  it("lists messages newest first and honours the limit", async () => {
    await repo.create({
      name: "Alan Turing",
      email: "alan@example.com",
      message: "First message.",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    await repo.create({
      name: "Katherine Johnson",
      email: "katherine@example.com",
      message: "Second message.",
      createdAt: new Date("2024-01-02T00:00:00.000Z"),
    });

    const all = await repo.list(1000);
    expect(all).toHaveLength(2);
    expect(all[0]?.name).toBe("Katherine Johnson");
    expect(all[1]?.name).toBe("Alan Turing");

    const limited = await repo.list(1);
    expect(limited).toHaveLength(1);
    expect(limited[0]?.name).toBe("Katherine Johnson");
  });
});
