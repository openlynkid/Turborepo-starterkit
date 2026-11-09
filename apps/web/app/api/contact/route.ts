import { NextResponse } from "next/server";

import { submitContact } from "@/lib/contact";

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

  const result = await submitContact(body);

  if (!result.ok) {
    return NextResponse.json(result, { status: 422 });
  }

  return NextResponse.json(result, { status: 200 });
}
