import { NextResponse } from "next/server";

import { submitContact } from "@/lib/contact";
import { guardContactSubmission } from "@/lib/contact-guard";
import { getContactRepository } from "@/lib/db";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: ["Invalid JSON body"] } },
      { status: 400 },
    );
  }

  const guard = await guardContactSubmission({
    ip: getClientIp(request.headers),
    turnstileToken: readTurnstileToken(body),
  });
  if (!guard.ok) {
    return NextResponse.json(
      { ok: false, errors: guard.errors },
      { status: guard.status },
    );
  }

  const result = await submitContact(body, {
    repository: getContactRepository(),
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 422 });
  }

  return NextResponse.json(result, { status: 200 });
}

function readTurnstileToken(body: unknown): string | undefined {
  if (body && typeof body === "object" && "turnstileToken" in body) {
    const token = (body as { turnstileToken?: unknown }).turnstileToken;
    return typeof token === "string" ? token : undefined;
  }
  return undefined;
}
