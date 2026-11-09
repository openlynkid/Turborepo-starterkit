import { expect, test } from "@playwright/test";

/**
 * These tests run against a second dev/prod server started with authentication
 * enabled (see `chromium-auth` in playwright.config.ts). The default project
 * runs the rest of the suite against a server with auth turned off.
 */
test.describe("auth enabled", () => {
  test("redirects an unauthenticated visitor to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
    // The login form is rendered (auth is enabled), not the "continue" state.
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.locator("p[role='alert']")).toHaveText(
      "Invalid email or password.",
    );
    await expect(page).toHaveURL(/\/login$/);
  });

  test("signs in with the admin credentials and signs out", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill("e2e-admin-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login$/);

    // The session is gone, so the app section is protected again.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });
});
