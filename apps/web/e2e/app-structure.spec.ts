import { expect, test } from "@playwright/test";

test.describe("app structure", () => {
  test("about page renders under the marketing layout", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", {
        name: "A monorepo starter kit that is ready for production",
      }),
    ).toBeVisible();
    // The marketing footer is part of the (marketing) layout.
    await expect(page.getByText("built with Turborepo")).toBeVisible();
  });

  test("dashboard renders the app shell and sidebar nav", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Messages" }).first(),
    ).toBeVisible();
  });

  test("sidebar navigates to messages", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: "Messages" }).first().click();
    await expect(page).toHaveURL(/\/messages$/);
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
  });

  test("settings renders", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("unknown route shows the not-found page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });
});

test.describe("seo routes", () => {
  test("serves a sitemap", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("<urlset");
  });

  test("serves robots.txt", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-Agent");
    expect(body).toContain("sitemap.xml");
  });

  test("generates an opengraph image", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("security", () => {
  test("sends baseline security headers", async ({ request }) => {
    const response = await request.get("/");

    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["referrer-policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(response.headers()["x-powered-by"]).toBeUndefined();
  });

  test("sends a nonce-based content security policy", async ({ request }) => {
    const response = await request.get("/");
    const csp = response.headers()["content-security-policy"];

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    // Scripts run from a per-request nonce, not 'unsafe-inline'.
    expect(csp).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  test("tags inline scripts with the request nonce", async ({ request }) => {
    const response = await request.get("/");
    const csp = response.headers()["content-security-policy"] ?? "";
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    expect(nonce).toBeTruthy();

    const html = await response.text();
    // next-themes injects an inline bootstrap script that must carry the nonce.
    expect(html).toContain(`<script nonce="${nonce}"`);
  });
});

test.describe("health", () => {
  test("reports the app as ok", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });
});

test.describe("auth", () => {
  test("shows the login page when auth is not configured", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
    await expect(page.getByText("Continue without auth")).toBeVisible();
  });

  test("leaves the app open when auth is not configured", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
  });
});

test.describe("component library", () => {
  test("components page renders the showcase", async ({ page }) => {
    await page.goto("/components");
    await expect(
      page.getByRole("heading", { name: "Components", level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: "Billing" })).toBeVisible();
  });

  test("switching tabs reveals the billing table", async ({ page }) => {
    await page.goto("/components");
    await page.getByRole("tab", { name: "Billing" }).click();
    await expect(page.getByRole("cell", { name: "INV-001" })).toBeVisible();
  });

  test("switching to settings reveals form controls", async ({ page }) => {
    await page.goto("/components");
    await page.getByRole("tab", { name: "Settings" }).click();
    await expect(
      page.getByRole("switch", { name: "Email notifications" }),
    ).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "Accept terms" }),
    ).toBeVisible();
  });

  test("renders the obsidia surface utilities", async ({ page }) => {
    await page.goto("/components");
    await expect(page.getByRole("heading", { name: "Surfaces" })).toBeVisible();
    await expect(page.getByTestId("obsidia-glass")).toBeVisible();
    await expect(page.getByTestId("obsidia-glass-hover")).toBeVisible();

    // The glass card must stay readable: its background must not be the
    // dark-only rgba(18, 18, 24, 0.7) while the theme is light.
    const background = await page
      .getByTestId("obsidia-glass")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    const isDarkTheme = await page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark"));
    expect(isDarkTheme).toBe(false);
    expect(background).not.toBe("rgba(18, 18, 24, 0.7)");
  });
});
