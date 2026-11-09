import { desc, eq } from "drizzle-orm";

import type { Database } from "../client";
import {
  contactMessages,
  type ContactMessage,
  type NewContactMessage,
} from "../schema/contact-messages";

/**
 * Data-access functions for contact messages. Takes a `Database` so the same
 * repository works with the production and test clients.
 */
export function createContactRepository(db: Database) {
  return {
    async create(input: NewContactMessage): Promise<ContactMessage> {
      const rows = await db.insert(contactMessages).values(input).returning();

      const row = rows[0];
      if (!row) {
        throw new Error("Failed to insert contact message");
      }
      return row;
    },

    async list(limit = 50): Promise<ContactMessage[]> {
      return db
        .select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt))
        .limit(limit);
    },

    async findById(id: string): Promise<ContactMessage | null> {
      const rows = await db
        .select()
        .from(contactMessages)
        .where(eq(contactMessages.id, id))
        .limit(1);

      return rows[0] ?? null;
    },
  };
}

export type ContactRepository = ReturnType<typeof createContactRepository>;
