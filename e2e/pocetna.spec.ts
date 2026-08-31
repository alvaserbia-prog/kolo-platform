import { test, expect } from "@playwright/test";

/**
 * Osnovni smoke E2E test — proverava da se javna početna stranica učita.
 * Služi kao polazna tačka; dodaj nove `*.spec.ts` fajlove u `e2e/`.
 */
test("javna stranica se učita", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/.+/);
});
