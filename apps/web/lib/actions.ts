"use server";

import { headers } from "next/headers";

import { submitContact, type ContactResult } from "@/lib/contact";
import { guardContactSubmission } from "@/lib/contact-guard";
import { getContactRepository } from "@/lib/db";
import { getClientIp } from "@/lib/rate-limit";

/**
 * Server action wrapper around {@link submitContact}. Safe to call from a
 * client component; input is validated on the server, rate-limited per client
 * IP, and persisted when a database is configured.
 */
export async function submitContactAction(
  input: unknown,
): Promise<ContactResult> {
  const requestHeaders = await headers();
  const turnstileToken = readTurnstileToken(input);

  const guard = await guardContactSubmission({
    ip: getClientIp(requestHeaders),
    turnstileToken,
  });
  if (!guard.ok) {
    return { ok: false, errors: guard.errors };
  }

  return submitContact(input, {
    repository: getContactRepository(),
  });
}

function readTurnstileToken(input: unknown): string | undefined {
  if (input && typeof input === "object" && "turnstileToken" in input) {
    const token = (input as { turnstileToken?: unknown }).turnstileToken;
    return typeof token === "string" ? token : undefined;
  }
  return undefined;
}
