import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "Build faster with a modern monorepo starter kit",
      }),
    ).toBeVisible();
  });

  test("shows the feature cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('[data-slot="card-title"]');
    await expect(cards).toHaveText([
      "Turborepo",
      "pnpm workspaces",
      "shadcn/ui",
    ]);
  });

  test("toggles between light and dark theme", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Toggle theme" });
    await expect(toggle).toBeVisible();

    const initial = await page.locator("html").getAttribute("class");
    await toggle.click();
    await expect
      .poll(() => page.locator("html").getAttribute("class"))
      .not.toBe(initial);
  });
});
