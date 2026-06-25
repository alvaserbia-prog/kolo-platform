import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright konfiguracija za KOLO Platformu (E2E testovi).
 *
 * Browser (Chromium) se NE skida ponovo — koristi se pre-instalirani
 * iz `PLAYWRIGHT_BROWSERS_PATH` (npr. /opt/pw-browsers u remote okruženju).
 * Lokalno: `npx playwright install chromium` jednom, pa `npm run e2e`.
 *
 * E2E testovi žive u `e2e/` i odvojeni su od Vitest testova (`__tests__/`).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Pokreni dev server pre testova (preskoči ako je E2E_BASE_URL eksterni).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
