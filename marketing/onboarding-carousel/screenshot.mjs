// Pravi prave screenshotove KOLO ekrana (lokalni dev server) za onboarding karusel.
// Pokretanje (iz korena, dok dev server radi na :3000):
//   node marketing/onboarding-carousel/screenshot.mjs
// playwright je globalno instaliran (/opt/node22/lib/node_modules); ESM ne čita NODE_PATH,
// pa pokušavamo lokalno, a fallback je apsolutna putanja do globalnog paketa.
let pw;
try {
  pw = await import("playwright");
} catch {
  pw = await import("/opt/node22/lib/node_modules/playwright/index.js");
}
const chromium = pw.chromium ?? pw.default?.chromium;
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "screenshots");
const BASE = process.env.BASE || "http://localhost:3000";
const USER = { email: "alva.serbia@gmail.com", pass: "admin1234" }; // verifikovan (NOSILAC_ZRNA) seed korisnik

// Playwright 1.56 + lokalni chromium build (env preko PLAYWRIGHT_BROWSERS_PATH)
const CHROME_FALLBACK = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const launchOpts = { args: ["--no-sandbox", "--disable-gpu", "--force-color-profile=srgb"] };
if (existsSync(CHROME_FALLBACK)) launchOpts.executablePath = CHROME_FALLBACK;

const VIEWPORT = { width: 402, height: 860 };
const DSF = 2;

// Sakrij dev artefakte (Next.js indikator) i nametni pristanak na kolačiće (bez bannera)
const HIDE_CSS = `nextjs-portal{display:none!important} [data-nextjs-toast]{display:none!important}`;
const initConsent = (ctx) =>
  ctx.addInitScript(() => {
    try { window.localStorage.setItem("kolo-kolacici-pristanak", "prihvaceno"); } catch {}
  });

const shot = async (ctx, name, path, { wait = 1500, prep } = {}) => {
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  }
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  if (prep) await prep(page);
  await page.waitForTimeout(wait);
  await page.screenshot({ path: join(OUT, `${name}.png`) }); // viewport (kao ekran telefona)
  console.log(`✓ ${name}  ←  ${path}`);
  await page.close();
};

const browser = await chromium.launch(launchOpts);

// ── 1) JAVNI ekrani (bez prijave) ─────────────────────────────────
const pub = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DSF, locale: "sr-Latn" });
await initConsent(pub);
await shot(pub, "landing", "/");
await shot(pub, "rani-pristup", "/rani-pristup", {
  prep: async (page) => {
    // popuni pristupni kod da ekran izgleda realno
    await page.fill('input[type="text"]', "kolo2026").catch(() => {});
  },
});
await shot(pub, "registracija", "/registracija");
await pub.close();

// ── 2) PRIJAVA (verifikovan korisnik) ─────────────────────────────
const auth = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DSF, locale: "sr-Latn" });
await initConsent(auth);
const lp = await auth.newPage();
await lp.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 45000 });
await lp.fill('input[type="email"]', USER.email);
await lp.fill('input[type="password"]', USER.pass);
await Promise.all([
  lp.waitForURL((u) => !u.pathname.includes("/login"), { timeout: 45000 }).catch(() => {}),
  lp.click('button[type="submit"]'),
]);
await lp.waitForTimeout(2000);
console.log("→ prijavljen, URL:", lp.url());
await lp.close();

// ── 3) AUTENTIFIKOVANI ekrani ─────────────────────────────────────
await shot(auth, "novcanik", "/novcanik");
await shot(auth, "verifikacija", "/verifikacija");
await shot(auth, "tabla-jemstva", "/tabla-jemstva");
await shot(auth, "pijaca", "/pijaca");
await shot(auth, "pocetna", "/pocetna");
await auth.close();

await browser.close();
console.log("GOTOVO →", OUT);
