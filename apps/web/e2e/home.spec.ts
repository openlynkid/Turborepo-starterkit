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
      "Get in touch",
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

  test("submits the contact form and shows a toast", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Name").fill("Grace Hopper");
    await page.getByLabel("Email").fill("grace@example.com");
    await page
      .getByLabel("Message")
      .fill("I would like to learn more about this starter kit.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Message sent")).toBeVisible();
  });
});
