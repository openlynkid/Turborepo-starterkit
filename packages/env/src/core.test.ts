import { describe, expect, it } from "vitest";

import { createClientEnv, createServerEnv } from "./core";

describe("createServerEnv", () => {
  it("applies defaults for missing optional values", () => {
    const env = createServerEnv({});
    expect(env.NODE_ENV).toBe("development");
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it("accepts a valid DATABASE_URL", () => {
    const env = createServerEnv({
      DATABASE_URL: "postgres://user:pass@localhost:5432/db",
    });
    expect(env.DATABASE_URL).toBe("postgres://user:pass@localhost:5432/db");
  });

  it("rejects an invalid DATABASE_URL", () => {
    expect(() => createServerEnv({ DATABASE_URL: "not-a-url" })).toThrow();
  });

  it("treats empty strings as undefined", () => {
    const env = createServerEnv({ DATABASE_URL: "" });
    expect(env.DATABASE_URL).toBeUndefined();
  });
});

describe("createClientEnv", () => {
  it("defaults NEXT_PUBLIC_APP_URL", () => {
    const env = createClientEnv({});
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("accepts a valid NEXT_PUBLIC_APP_URL", () => {
    const env = createClientEnv({ NEXT_PUBLIC_APP_URL: "https://example.com" });
    expect(env.NEXT_PUBLIC_APP_URL).toBe("https://example.com");
  });

  it("rejects an invalid NEXT_PUBLIC_APP_URL", () => {
    expect(() => createClientEnv({ NEXT_PUBLIC_APP_URL: "example" })).toThrow();
  });
});
