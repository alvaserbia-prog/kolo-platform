// Pravi sveže screenshotove KOLO ekrana za onboarding karusel (praktično uputstvo).
// Ekrani i useri:
//   public           → rani-pristup (kod kolo2026 upisan), registracija
//   neverif (ljubica)→ dobrodosli, verifikacija (0/0%), tabla-jemstva
// Štampa i bounding-box ključnih elemenata (za zaokruženja u generatoru).
// Pokretanje: node marketing/onboarding-carousel/screenshot.mjs  (dok dev server radi na :3000)
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

let pw;
try { pw = await import("playwright"); }
catch { pw = await import("/opt/node22/lib/node_modules/playwright/index.js"); }
const chromium = pw.chromium ?? pw.default?.chromium;

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "screenshots");
const BASE = process.env.BASE || "http://localhost:3000";
const VIEWPORT = { width: 402, height: 860 };
const DSF = 2;
const HIDE = `nextjs-portal{display:none!important}[data-nextjs-toast]{display:none!important}`;
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const launchOpts = { args: ["--no-sandbox", "--disable-gpu", "--force-color-profile=srgb"] };
if (existsSync(CHROME)) launchOpts.executablePath = CHROME;

const newCtx = async (browser) => {
  const c = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DSF, locale: "sr-Latn" });
  await c.addInitScript(() => { try { localStorage.setItem("kolo-kolacici-pristanak", "prihvaceno"); } catch {} });
  return c;
};
const open = async (ctx, path) => {
  const p = await ctx.newPage();
  try { await p.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 45000 }); }
  catch { await p.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 }); }
  await p.addStyleTag({ content: HIDE }).catch(() => {});
  return p;
};
const box = async (loc) => { try { return await loc.boundingBox(); } catch { return null; } };

const browser = await chromium.launch(launchOpts);

// ── PUBLIC ──────────────────────────────────────────────────────────
const pub = await newCtx(browser);
{
  const p = await open(pub, "/rani-pristup");
  await p.fill('input[type="text"]', "kolo2026").catch(() => {});
  await p.waitForTimeout(900);
  console.log("BOX rani-pristup input:", JSON.stringify(await box(p.locator('input[type="text"]').first())));
  await p.screenshot({ path: join(OUT, "rani-pristup.png") });
  console.log("✓ rani-pristup"); await p.close();
}
{
  const p = await open(pub, "/registracija");
  await p.waitForTimeout(900);
  console.log("BOX registracija submit:", JSON.stringify(await box(p.locator('button[type="submit"]').first())));
  await p.screenshot({ path: join(OUT, "registracija.png") });
  console.log("✓ registracija"); await p.close();
}
await pub.close();

// ── NEVERIF (ljubica@demo.rs) ───────────────────────────────────────
const auth = await newCtx(browser);
{
  const lp = await auth.newPage();
  await lp.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 45000 });
  await lp.fill('input[type="email"]', "ljubica@demo.rs");
  await lp.fill('input[type="password"]', "demo1234");
  await Promise.all([
    lp.waitForURL((u) => !u.pathname.includes("/login"), { timeout: 45000 }).catch(() => {}),
    lp.click('button[type="submit"]'),
  ]);
  await lp.waitForTimeout(1500);
  console.log("→ prijavljen ljubica:", lp.url());
  await lp.close();
}
{
  const p = await open(auth, "/dobrodosli");
  await p.waitForTimeout(1200);
  await p.screenshot({ path: join(OUT, "dobrodosli.png") });
  console.log("✓ dobrodosli"); await p.close();
}
{
  const p = await open(auth, "/verifikacija");
  await p.waitForTimeout(1200);
  const instr = p.getByText(/Poka(ž|z)i svoj kod/i).first();
  console.log("BOX verif instrukcija:", JSON.stringify(await box(instr)));
  await p.screenshot({ path: join(OUT, "verifikacija.png") });
  console.log("✓ verifikacija"); await p.close();
}
{
  const p = await open(auth, "/tabla-jemstva");
  await p.waitForTimeout(1200);
  await p.screenshot({ path: join(OUT, "tabla-jemstva.png") });
  console.log("✓ tabla-jemstva"); await p.close();
}
await auth.close();

await browser.close();
console.log("GOTOVO →", OUT);
