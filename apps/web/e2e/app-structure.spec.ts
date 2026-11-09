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
