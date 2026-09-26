// Renderuje svih pet probnih stilova u out/<id>.mp4 (ili samo one navedene kao argumenti).
import { execSync } from "node:child_process";
const SVI = ["Stil1-Tipografija", "Stil2-Telefon", "Stil3-Vez", "Stil4-Mreza", "Stil5-Linija"];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : SVI;
for (const id of ids) {
  execSync(`npx remotion render src/index.ts ${id} out/${id.toLowerCase()}.mp4`, { stdio: "inherit" });
}
