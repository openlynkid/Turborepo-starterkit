import { contactFormSchema } from "@repo/validators";

export type ContactResult =
  | { ok: true; data: { name: string; email: string; message: string } }
  | { ok: false; errors: Record<string, string[]> };

/**
 * Validates and "submits" a contact message. Shared by the route handler and
 * the server action so validation lives in one place.
 */
export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = contactFormSchema.safeParse(input);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (errors[key] ??= []).push(issue.message);
    }
    return { ok: false, errors };
  }

  // Replace with real work: send an email, write to a database, enqueue a job.
  return { ok: true, data: parsed.data };
}
