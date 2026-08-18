#!/usr/bin/env node
/**
 * Primenjuje prepravljene tekstove na `messages/sr.json`.
 *
 * Ulaz je JSON sa PUNIM ključevima → nov tekst, onakav kakav vraća provera
 * teksta po paketima (`docs/provera-teksta/paket-*.md`):
 *
 *   { "login.podnaslov": "Dobro došao nazad", "pijaca.prazno": "…" }
 *
 * Bez `--jezik` upisuje u srpski; prevodi idu posle, iz odobrenog srpskog, sa
 * `--jezik=en|ru|hr|hu`. Za prevode se imena `{parametara}` porede sa srpskim
 * izvornikom, a zabranjeni izrazi po jeziku (ruski je osam meseci nosio ukinutu
 * terminologiju jer je provera gledala pogrešnu imenicu).
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
const jezik = (zastavice.find((z) => z.startsWith("--jezik="))?.split("=")[1] ?? "sr").trim();

if (!ulazniFajl || !["sr", "en", "ru", "hr", "hu"].includes(jezik)) {
  console.error("Upotreba: node scripts/primeni-tekstove.mjs <fajl.json> [--jezik=en] [--suvo]");
  process.exit(1);
}

const KOREN = path.resolve(import.meta.dirname, "..");
const PUT_CILJ = path.join(KOREN, "messages", `${jezik}.json`);
const PUT_SR = path.join(KOREN, "messages", "sr.json");

/**
 * Ukinuti izrazi po jeziku — isti obrasci koje čuva `__tests__/copy-ukinuto.test.ts`.
 * Po jeziku, jer je stara terminologija dvaput preživela u prevodima duže nego u
 * srpskom: ruski je osam meseci govorio „цепь поручительства“ jer je provera
 * tražila „цепочка“, a mađarski „kezességi gráf“ naspram provere za „lánc“.
 */
const ZABRANJENO = {
  sr: [
    [/verifik/i, "„verifikacija“ ne ide u copy — na ekranu se govori o potvrdi"],
    [/novčanik/i, "ekran se zove POEN, ne Novčanik"],
    [/tabl[aeiou]\s+(zahteva\s+za\s+)?jemstv/i, "tabla jemstva je ukinuta"],
    [/lanc[aeu]\s+jemstva/i, "lanac jemstva → lanac potvrda"],
    [/kartic[aeiou]\s+prepoznavanja/i, "kartica prepoznavanja je ukinuta"],
    [/neverifikovan/i, "status se zove „nov član“"],
  ],
  hr: [
    [/verifik|verificir/i, "„verifikacija“ ne ide u copy — govori se o potvrdi"],
    [/novčanik/i, "ekran se zove POEN"],
    [/ploč[aeiu]\s+(zahtjeva\s+za\s+)?jamstv/i, "ploča jamstva je ukinuta"],
    [/lanc[aeu]\s+jamstva|graf[au]?\s+jamstva/i, "lanac jamstva → lanac potvrda"],
  ],
  en: [
    [/\bverif/i, "„verification“ ne ide u copy — govori se o confirmation"],
    [/\bwallet/i, "ekran se zove POEN, ne Wallet"],
    [/(guarantee|vouching)\s+(request\s+)?board|\bvouch|chain\s+of\s+guarant/i,
      "institut jemstva je ukinut"],
  ],
  ru: [
    [/верифи/i, "„верификация“ ne ide u copy — govori se o подтверждении"],
    [/кошел/i, "ekran se zove POEN"],
    [/поручител/i, "institut jemstva je ukinut"],
  ],
  hu: [
    [/hitelesít/i, "„hitelesítés“ ne ide u copy — govori se o megerősítés"],
    [/pénztárc|tárcá|tárca/i, "ekran se zove POEN"],
    [/kezes/i, "institut jemstva je ukinut"],
  ],
};

/** Koren kojim se u svakom jeziku imenuje prepis (prenos POEN-a nije upis). */
const KOREN_PREPISA = {
  sr: /prepi[sš]/i,
  hr: /prepi[sš]/i,
  en: /re-register/i,
  ru: /перепис/i,
  hu: /átír/i,
};

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

const sirovoSr = readFileSync(PUT_CILJ, "utf-8");
// Parametri se porede sa SRPSKIM izvornikom, ne sa zatečenim prevodom: srpski je
// izvor istine, a prevod koji traži parametar koji kod ne šalje daje praznu rupu.
const izvorSr = jezik === "sr" ? null : JSON.parse(readFileSync(PUT_SR, "utf-8"));
// Zatečeni završetak fajla se poštuje — inače svaki upis doda ili skine prazan
// red na kraju i diff izgleda veći nego što jeste.
const zavrsniRed = sirovoSr.endsWith("\n") ? "\n" : "";
const sr = JSON.parse(sirovoSr);
const nov = JSON.parse(readFileSync(ulazniFajl, "utf-8"));

const greske = [];
const izmene = [];
let nepromenjeno = 0;

for (let [kljuc, tekst] of Object.entries(nov)) {
  const stari = uzmi(sr, kljuc);
  const merilo = izvorSr ? uzmi(izvorSr, kljuc) : stari;

  if (typeof stari !== "string") {
    greske.push(`${kljuc} — ključ ne postoji u messages/sr.json (greška u kucanju?)`);
    continue;
  }
  if (typeof tekst !== "string") {
    greske.push(`${kljuc} — vrednost nije tekst`);
    continue;
  }

  // U dokumentima paketa nov red je prikazan kao „⏎“, da se tekst vidi u jednom
  // redu spiska. Vraća se nazad u pravi prelom — inače bi se znak upisao doslovno.
  tekst = tekst.replaceAll("⏎", "\n");
  if (stari === tekst) {
    nepromenjeno++;
    continue;
  }

  const a = parametri(typeof merilo === "string" ? merilo : stari);
  const b = parametri(tekst);
  const nedostaju = [...a].filter((x) => !b.has(x));
  const visak = [...b].filter((x) => !a.has(x));
  if (nedostaju.length || visak.length) {
    greske.push(
      `${kljuc} — parametri se ne poklapaju: nedostaje [${nedostaju}], višak [${visak}]`,
    );
    continue;
  }

  // Placeholderi se izuzimaju iz provere terminologije: `{verifikator}` i
  // `{verifikovani}` su imena koja kod traži po slovu — nisu copy. Isti izuzetak
  // ima i `__tests__/copy-ukinuto.test.ts`; bez njega se dobra rečenica odbija.
  const bezPlaceholdera = tekst.replace(/\{[^{}]*\}/g, "");
  const pao = ZABRANJENO[jezik].find(([obrazac]) => obrazac.test(bezPlaceholdera));
  if (pao) {
    greske.push(`${kljuc} — ${pao[1]}\n      "${tekst.slice(0, 100)}"`);
    continue;
  }

  if (KLJUCEVI_PREPISA.has(kljuc) && !KOREN_PREPISA[jezik].test(tekst)) {
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
  writeFileSync(PUT_CILJ, JSON.stringify(sr, null, 2) + zavrsniRed, "utf-8");
  console.log(
    `\nUpisano u messages/${jezik}.json.` +
      (jezik === "sr" ? " Prevodi (en, ru, hr, hu) idu posebno." : ""),
  );
}

process.exit(greske.length ? 1 : 0);
