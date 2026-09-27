// Probni kadrovi: node scripts/kadrovi.mjs <frejm> [frejm ...] -> out/kadrovi/f<frejm>.jpg
// Projekat se pakuje jednom, pa se svi kadrovi renderuju iz istog paketa.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const fr = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const id = process.env.KOMPOZICIJA ?? "KoloRaste";
const composition = await selectComposition({ serveUrl, id, browserExecutable: B });
for (const x of fr) {
  await renderStill({ composition, serveUrl, output: `out/kadrovi/f${x}.jpg`, frame: x, imageFormat: "jpeg", jpegQuality: 85, browserExecutable: B });
  console.log("f" + x);
}
