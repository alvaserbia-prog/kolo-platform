// Probni kadrovi: node scripts/kadrovi.mjs <frejm> [frejm ...] -> out/kadrovi/f<frejm>.jpg
import { execFileSync } from "node:child_process";
const B = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const fr = process.argv.slice(2);
for (const x of fr) {
  execFileSync("npx", ["remotion", "still", "src/index.ts", "KoloDomacice", `out/kadrovi/f${x}.jpg`, `--frame=${x}`, `--browser-executable=${B}`, "--jpeg-quality=85", "--log=error"], { stdio: "inherit" });
}
