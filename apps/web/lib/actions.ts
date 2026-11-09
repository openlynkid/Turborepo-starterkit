"use server";

import { submitContact, type ContactResult } from "@/lib/contact";
import { getContactRepository } from "@/lib/db";

/**
 * Server action wrapper around {@link submitContact}. Safe to call from a
 * client component; input is validated on the server and persisted when a
 * database is configured.
 */
export async function submitContactAction(
  input: unknown,
): Promise<ContactResult> {
  return submitContact(input, { repository: getContactRepository() });
}
