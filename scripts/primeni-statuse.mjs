/** Primenjuje statuse članova na messages/*.json. Menja samo vrednosti. */
import fs from "node:fs";
import { OZNAKE, IZRAZI, KLJUCEVI } from "./statusi-clanova.mjs";

const SUVO = process.argv.includes("--suvo");
const kljucSet = new Set(KLJUCEVI);

for (const jezik of ["sr", "hr", "en", "ru", "hu"]) {
  const put = `messages/${jezik}.json`;
  const json = JSON.parse(fs.readFileSync(put, "utf-8"));
  const promene = [];

  (function hodaj(c, p = []) {
    for (const k of Object.keys(c)) {
      const v = c[k];
      const kljuc = [...p, k].join(".");
      if (typeof v === "string") {
        let novo = v;
        if (OZNAKE[kljuc]?.[jezik] !== undefined) novo = OZNAKE[kljuc][jezik];
        else if (kljucSet.has(kljuc)) for (const [a, b] of IZRAZI[jezik]) novo = novo.split(a).join(b);
        if (novo !== v) { c[k] = novo; promene.push([kljuc, v, novo]); }
      } else if (v && typeof v === "object") hodaj(v, [...p, k]);
    }
  })(json);

  console.log(`\n── ${jezik}: ${promene.length} izmena`);
  if (jezik === "sr") promene.forEach(([k, a, b]) => console.log(`   ${k}\n      − ${a.slice(0, 100)}\n      + ${b.slice(0, 100)}`));
  if (!SUVO) fs.writeFileSync(put, JSON.stringify(json, null, 2) + "\n");
}
console.log(SUVO ? "\n(suvi hod)" : "\n✓ upisano");
