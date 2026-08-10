/**
 * Primenjuje terminološka pravila na `messages/sr.json`.
 * Menja SAMO vrednosti; ključevi ostaju (kod ih traži po imenu).
 *
 * Pokretanje:  node scripts/primeni-terminologiju.mjs [--suvo]
 */
import fs from "node:fs";
import { EKSPLICITNO, MEHANICKI } from "./terminologija-sr.mjs";

const SUVO = process.argv.includes("--suvo");
const PUT = "messages/sr.json";

/** Zamena koja čuva veliko slovo na početku pogotka. */
function zameni(tekst) {
  let out = tekst;
  for (const [obrazac, novo] of MEHANICKI) {
    out = out.replace(obrazac, (pogodak) => {
      const veliko = pogodak[0] === pogodak[0].toUpperCase() && pogodak[0] !== pogodak[0].toLowerCase();
      return veliko ? novo[0].toUpperCase() + novo.slice(1) : novo;
    });
  }
  return out;
}

const sirovo = fs.readFileSync(PUT, "utf-8");
const json = JSON.parse(sirovo);

const promene = [];
const ostalo = [];
let eksplicitnoIskorisceno = 0;

function hodaj(cvor, put = []) {
  for (const k of Object.keys(cvor)) {
    const v = cvor[k];
    const kljuc = [...put, k].join(".");
    if (typeof v === "string") {
      let novo;
      if (Object.hasOwn(EKSPLICITNO, kljuc)) {
        novo = EKSPLICITNO[kljuc];
        eksplicitnoIskorisceno++;
      } else if (/verifik/i.test(v)) {
        novo = zameni(v);
      } else continue;

      if (novo !== v) {
        promene.push([kljuc, v, novo]);
        cvor[k] = novo;
      }
      if (/verifik/i.test(novo)) ostalo.push([kljuc, novo]);
    } else if (v && typeof v === "object") {
      hodaj(v, [...put, k]);
    }
  }
}

hodaj(json);

// Ključevi iz EKSPLICITNO koji ne postoje u fajlu — greška u kucanju.
const sviKljucevi = new Set();
(function skupi(c, p = []) {
  for (const k of Object.keys(c)) {
    const v = c[k];
    if (typeof v === "string") sviKljucevi.add([...p, k].join("."));
    else if (v && typeof v === "object") skupi(v, [...p, k]);
  }
})(json);
const nepostojeci = Object.keys(EKSPLICITNO).filter((k) => !sviKljucevi.has(k));

console.log(`Izmenjeno stringova: ${promene.length}`);
console.log(`Eksplicitnih pogodaka: ${eksplicitnoIskorisceno} / ${Object.keys(EKSPLICITNO).length}`);
if (nepostojeci.length) {
  console.log(`\n⚠ KLJUČEVI KOJI NE POSTOJE U FAJLU (${nepostojeci.length}):`);
  nepostojeci.forEach((k) => console.log("   " + k));
}
if (ostalo.length) {
  console.log(`\n⚠ OSTALO „verifik" (${ostalo.length}) — za ručnu doradu:`);
  ostalo.forEach(([k, v]) => console.log(`   ${k}\n      ${v.slice(0, 150)}`));
}

if (!SUVO) {
  fs.writeFileSync(PUT, JSON.stringify(json, null, 2) + "\n");
  console.log(`\n✓ Upisano u ${PUT}`);
} else {
  console.log("\n(suvi hod — ništa nije upisano)");
}
