import { expect, test } from "@playwright/test";

test.describe("POST /api/contact", () => {
  test("accepts a valid submission", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Hello, I would like to know more about this starter kit.",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.data.email).toBe("ada@example.com");
  });

  test("rejects an invalid submission with field errors", async ({
    request,
  }) => {
    const response = await request.post("/api/contact", {
      data: { name: "A", email: "bad", message: "x" },
    });

    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.errors).toHaveProperty("email");
  });

  test("returns 400 for malformed JSON", async ({ request }) => {
    const response = await request.post("/api/contact", {
      headers: { "content-type": "application/json" },
      data: Buffer.from("{ not json"),
    });

    expect(response.status()).toBe(400);
  });
});
