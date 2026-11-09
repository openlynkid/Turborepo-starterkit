"use server";

import { submitContact, type ContactResult } from "@/lib/contact";

/**
 * Server action wrapper around {@link submitContact}. Safe to call from a
 * client component; input is validated on the server.
 */
export async function submitContactAction(
  input: unknown,
): Promise<ContactResult> {
  return submitContact(input);
}
