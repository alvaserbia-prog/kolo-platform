// Naslovna slika: node scripts/naslovna.mjs -> out/naslovna.jpg (kompozicija „Naslovna", src/Naslovna.tsx)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const BR = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Naslovna", browserExecutable: BR });
await renderStill({ serveUrl, composition, frame: 0, output: "out/naslovna.jpg", imageFormat: "jpeg", jpegQuality: 92, browserExecutable: BR, chromiumOptions: { gl: "swiftshader" } });
console.log("out/naslovna.jpg");
