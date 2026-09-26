// Probni kadrovi (jedan bundle): node scripts/kadrovi.mjs <id> <frejm> [<frejm> …] -> out/kadrovi/<id>-<frejm>.jpg
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const [id, ...frejmovi] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable: BROWSER });
for (const fr of frejmovi) {
  await renderStill({ composition, serveUrl, frame: Number(fr), output: `out/kadrovi/${id}-${fr}.jpg`, imageFormat: "jpeg", scale: 0.35, browserExecutable: BROWSER, chromiumOptions: { gl: "swiftshader" } });
}
console.log("gotovo", id);
