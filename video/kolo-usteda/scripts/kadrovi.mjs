// Probni kadrovi: node scripts/kadrovi.mjs <Kompozicija> <frejm> [frejm...] -> out/kadrovi/<Kompozicija>-<frejm>.jpg
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [id, ...frejmovi] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frejmovi) {
  const output = `out/kadrovi/${id}-${f}.jpg`;
  await renderStill({ composition, serveUrl, output, frame: Number(f), browserExecutable, imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: { gl: "swiftshader" } });
  console.log(output);
}
