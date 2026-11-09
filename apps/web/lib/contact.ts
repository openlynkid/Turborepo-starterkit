import type { ContactRepository } from "@repo/db";
import { contactFormSchema } from "@repo/validators";

export type ContactResult =
  | {
      ok: true;
      data: { name: string; email: string; message: string };
      id?: string;
    }
  | { ok: false; errors: Record<string, string[]> };

export type SubmitContactOptions = {
  /** When provided, the validated message is persisted. */
  repository?: ContactRepository | null;
};

/**
 * Validates a contact message and, when a repository is available, persists it.
 * Shared by the route handler and the server action so validation and
 * persistence live in one place.
 */
export async function submitContact(
  input: unknown,
  options: SubmitContactOptions = {},
): Promise<ContactResult> {
  const parsed = contactFormSchema.safeParse(input);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (errors[key] ??= []).push(issue.message);
    }
    return { ok: false, errors };
  }

  const { repository } = options;
  if (!repository) {
    return { ok: true, data: parsed.data };
  }

  const saved = await repository.create(parsed.data);
  return { ok: true, data: parsed.data, id: saved.id };
}
