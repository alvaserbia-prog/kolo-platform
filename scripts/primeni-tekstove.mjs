#!/usr/bin/env node
/**
 * Primenjuje prepravljene tekstove na `messages/sr.json`.
 *
 * Ulaz je JSON sa PUNIM ključevima → nov tekst, onakav kakav vraća provera
 * teksta po paketima (`docs/provera-teksta/paket-*.md`):
 *
 *   { "login.podnaslov": "Dobro došao nazad", "pijaca.prazno": "…" }
 *
 * Skripta NE dira ostale jezike — oni se prevode posle, iz odobrenog srpskog.
 *
 * Pre upisa proverava troje, jer je svako od toga već jednom tiho palo:
 *   1) da ključ POSTOJI (izmišljen ključ bi se upisao kao mrtav unos),
 *   2) da su imena `{parametara}` ista kao u zatečenom tekstu — ime parametra je
 *      ugovor sa kodom, ne tekst za prevod; promenjeno ime daje praznu rupu u
 *      rečenici, a JSON ostaje validan i build prolazi,
 *   3) da nov tekst ne vraća ukinutu terminologiju (iste brane kao
 *      `__tests__/copy-ukinuto.test.ts`, da se ne čeka pad testa).
 *
 * Upotreba:
 *   node scripts/primeni-tekstove.mjs <fajl.json> [--suvo]
 *
 * `--suvo` samo prijavi šta bi se promenilo, bez upisa.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , ulazniFajl, ...zastavice] = process.argv;
const suvo = zastavice.includes("--suvo");

if (!ulazniFajl) {
  console.error("Upotreba: node scripts/primeni-tekstove.mjs <fajl.json> [--suvo]");
  process.exit(1);
}

const KOREN = path.resolve(import.meta.dirname, "..");
const PUT_SR = path.join(KOREN, "messages", "sr.json");

/** Ukinuti izrazi — isti obrasci koje čuva `__tests__/copy-ukinuto.test.ts`. */
const ZABRANJENO = [
  [/verifik/i, "„verifikacija“ ne ide u copy — na ekranu se govori o potvrdi"],
  [/novčanik/i, "ekran se zove POEN, ne Novčanik"],
  [/tabl[aeiou]\s+(zahteva\s+za\s+)?jemstv/i, "tabla jemstva je ukinuta"],
  [/lanc[aeu]\s+jemstva/i, "lanac jemstva → lanac potvrda"],
  [/kartic[aeiou]\s+prepoznavanja/i, "kartica prepoznavanja je ukinuta"],
  [/neverifikovan/i, "status se zove „nov član“"],
];

/** Ključevi koji moraju nositi koren „prepis“ (prenos POEN-a nije upis). */
const KLJUCEVI_PREPISA = new Set([
  "header.upisi_poen",
  "profil.upisi_poen",
  "novcanik.posalji_poen",
  "novcanik.send_naslov",
  "novcanik.send_dugme",
]);

/** Imena `{parametara}`; iz ICU grana uzima samo prvi identifikator. */
function parametri(poruka) {
  const imena = new Set();
  for (const [, unutra] of poruka.matchAll(/\{([^{}]+)\}/g)) {
    const ime = unutra.split(",")[0].trim();
    if (ime) imena.add(ime);
  }
  return imena;
}

function uzmi(cvor, kljuc) {
  let cur = cvor;
  for (const deo of kljuc.split(".")) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[deo];
  }
  return cur;
}

function upisi(cvor, kljuc, vrednost) {
  const delovi = kljuc.split(".");
  let cur = cvor;
  for (const deo of delovi.slice(0, -1)) cur = cur[deo];
  cur[delovi.at(-1)] = vrednost;
}

const sirovoSr = readFileSync(PUT_SR, "utf-8");
// Zatečeni završetak fajla se poštuje — inače svaki upis doda ili skine prazan
// red na kraju i diff izgleda veći nego što jeste.
const zavrsniRed = sirovoSr.endsWith("\n") ? "\n" : "";
const sr = JSON.parse(sirovoSr);
const nov = JSON.parse(readFileSync(ulazniFajl, "utf-8"));

const greske = [];
const izmene = [];
let nepromenjeno = 0;

for (const [kljuc, tekst] of Object.entries(nov)) {
  const stari = uzmi(sr, kljuc);

  if (typeof stari !== "string") {
    greske.push(`${kljuc} — ključ ne postoji u messages/sr.json (greška u kucanju?)`);
    continue;
  }
  if (typeof tekst !== "string") {
    greske.push(`${kljuc} — vrednost nije tekst`);
    continue;
  }
  if (stari === tekst) {
    nepromenjeno++;
    continue;
  }

  const a = parametri(stari);
  const b = parametri(tekst);
  const nedostaju = [...a].filter((x) => !b.has(x));
  const visak = [...b].filter((x) => !a.has(x));
  if (nedostaju.length || visak.length) {
    greske.push(
      `${kljuc} — parametri se ne poklapaju: nedostaje [${nedostaju}], višak [${visak}]`,
    );
    continue;
  }

  const pao = ZABRANJENO.find(([obrazac]) => obrazac.test(tekst));
  if (pao) {
    greske.push(`${kljuc} — ${pao[1]}\n      "${tekst.slice(0, 100)}"`);
    continue;
  }

  if (KLJUCEVI_PREPISA.has(kljuc) && !/prepi[sš]/i.test(tekst)) {
    greske.push(`${kljuc} — prenos POEN-a je prepis, ne upis: "${tekst}"`);
    continue;
  }

  izmene.push([kljuc, stari, tekst]);
}

if (uzmi(sr, "novcanik.send_napomena") === undefined) {
  greske.push("novcanik.send_napomena — definiciona rečenica uz obrazac ne sme da nestane");
}

for (const [kljuc, stari, tekst] of izmene) {
  console.log(`  ${kljuc}\n    - ${stari}\n    + ${tekst}`);
}

console.log(
  `\n${izmene.length} izmena, ${nepromenjeno} nepromenjeno, ${greske.length} odbijeno.`,
);

if (greske.length) {
  console.error("\nODBIJENO:");
  for (const g of greske) console.error(`  ✗ ${g}`);
}

if (suvo) {
  console.log("\n(suvi hod — ništa nije upisano)");
} else if (izmene.length) {
  for (const [kljuc, , tekst] of izmene) upisi(sr, kljuc, tekst);
  writeFileSync(PUT_SR, JSON.stringify(sr, null, 2) + zavrsniRed, "utf-8");
  console.log(`\nUpisano u messages/sr.json. Prevodi (en, ru, hr, hu) idu posebno.`);
}

process.exit(greske.length ? 1 : 0);
