import { describe, expect, it } from "vitest";

import { POST } from "./route";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to know more about this starter kit.",
};

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("returns 200 for valid input", async () => {
    const response = await POST(jsonRequest(valid));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      data: valid,
    });
  });

  it("returns 422 with field errors for invalid input", async () => {
    const response = await POST(
      jsonRequest({ name: "", email: "x", message: "" }),
    );

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(Object.keys(body.errors)).toEqual(
      expect.arrayContaining(["name", "email", "message"]),
    );
  });

  it("returns 400 for malformed JSON", async () => {
    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{ not json",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      errors: { form: ["Invalid JSON body"] },
    });
  });

  it("returns 429 once the rate limit is exceeded", async () => {
    let lastStatus = 0;

    // The default limit is 5; earlier tests in this file already spent a few
    // slots, so a bounded burst is guaranteed to trip the limiter.
    for (let i = 0; i < 10; i += 1) {
      const response = await POST(jsonRequest(valid));
      lastStatus = response.status;
      if (lastStatus === 429) {
        await expect(response.json()).resolves.toMatchObject({
          ok: false,
          errors: { form: [expect.stringMatching(/too many requests/i)] },
        });
        break;
      }
    }

    expect(lastStatus).toBe(429);
  });
});
