import { env } from "@/env";

/** True when a Turnstile secret is configured, so the contact form needs a token. */
export function isTurnstileEnabled(): boolean {
  return Boolean(env.TURNSTILE_SECRET_KEY);
}

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifies a Cloudflare Turnstile token. When no secret is configured the
 * check is skipped and the function resolves `true`, so CAPTCHA stays opt-in.
 * Fails closed: any network or parsing error is treated as a failed check.
 */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return true;
  }
  if (!token) {
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body });
    if (!response.ok) {
      return false;
    }
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
