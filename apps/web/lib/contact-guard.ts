import { contactRateLimiter } from "@/lib/rate-limit";
import { isTurnstileEnabled, verifyTurnstile } from "@/lib/turnstile";

export type GuardResult =
  | { ok: true }
  | { ok: false; status: number; errors: Record<string, string[]> };

export type GuardInput = {
  ip: string;
  turnstileToken?: string;
};

/**
 * Applies abuse protections to a contact submission: a fixed-window rate limit
 * per client IP and, when configured, CAPTCHA verification. Shared by the
 * route handler and the server action so both paths are protected equally.
 */
export async function guardContactSubmission({
  ip,
  turnstileToken,
}: GuardInput): Promise<GuardResult> {
  const limit = contactRateLimiter.check(ip);
  if (!limit.ok) {
    return {
      ok: false,
      status: 429,
      errors: {
        form: [
          `Too many requests. Please try again in ${limit.retryAfterSeconds}s.`,
        ],
      },
    };
  }

  if (isTurnstileEnabled()) {
    const valid = await verifyTurnstile(turnstileToken, ip);
    if (!valid) {
      return {
        ok: false,
        status: 422,
        errors: {
          form: ["CAPTCHA verification failed. Please try again."],
        },
      };
    }
  }

  return { ok: true };
}
