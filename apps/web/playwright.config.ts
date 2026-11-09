import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

const AUTH_PORT = 3001;
const authBaseURL = `http://localhost:${AUTH_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /auth\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Runs against a second server started with authentication enabled.
      name: "chromium-auth",
      testMatch: /auth\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: authBaseURL },
    },
  ],
  webServer: [
    {
      command: "pnpm start",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      // Functional e2e tests share one server and IP; keep the limiter out of
      // their way. The rate limiter itself is covered by unit tests.
      env: { RATE_LIMIT_MAX: "1000" },
    },
    {
      command: "pnpm exec next start --port 3001",
      url: authBaseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      // Auth is on for this server. Raise the limits so the auth flow tests
      // never trip them; the limiters have their own unit tests.
      env: {
        RATE_LIMIT_MAX: "1000",
        LOGIN_RATE_LIMIT_MAX: "1000",
        SESSION_SECRET: "e2e-session-secret-that-is-long-enough-0000",
        ADMIN_EMAIL: "admin@example.com",
        ADMIN_PASSWORD: "e2e-admin-password",
      },
    },
  ],
});
