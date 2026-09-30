// Probni kadrovi: node scripts/kadrovi.mjs 100 250 400 ... -> out/kadrovi/fNNNN.jpg
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const BR = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Kolo04", browserExecutable: BR });
fs.mkdirSync("out/kadrovi", { recursive: true });
for (const a of process.argv.slice(2)) {
  const frame = Number(a);
  await renderStill({ serveUrl, composition, frame, output: `out/kadrovi/f${String(frame).padStart(4, "0")}.jpeg`, imageFormat: "jpeg", jpegQuality: 80, scale: 0.5, browserExecutable: BR, chromiumOptions: { gl: "swiftshader" } });
  console.log("kadar", frame);
}
