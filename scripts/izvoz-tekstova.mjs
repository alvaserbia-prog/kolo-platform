/**
 * Izvoz SVIH tekstova sajta u jednu tabelu — radi lakšeg prevođenja i lekture.
 *
 * Pokretanje:  node scripts/izvoz-tekstova.mjs
 * Izlaz:       izvoz/tekstovi-sajta.csv   (svih 5 jezika u kolonama, jedan red = jedan tekst)
 *              izvoz/zakucano.txt         (mesta gde tekst stoji u kodu, pa nije prevodiv)
 *
 * Skript čita tri izvora, jer tekst sajta NE živi na jednom mestu:
 *   1) messages/<jezik>.json   — sav interfejs (next-intl)
 *   2) src/lib/faq-data*.ts    — često postavljana pitanja (predugačka za JSON)
 *   3) src/lib/ekran-poruke.ts — ekrani za pad sistema / održavanje / 404
 *      (namerno van next-intl-a: prikazuju se kad aplikacija ne radi)
 *
 * ŠTA NIJE OVDE: pravni akti (`dokumentacija 4.1/`, markdown fajlovi po jeziku) —
 * to su dokumenti, ne kratki tekstovi interfejsa, i prevode se kao celina.
 * I: tekst zakucan u kodu (uglavnom admin panel) — vidi `izvoz/zakucano.txt`.
 *
 * Ne zavisi ni od jedne biblioteke — pokreće se i bez `npm install`.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOREN = join(dirname(fileURLToPath(import.meta.url)), "..");
const JEZICI = ["sr", "en", "ru", "hr", "hu"];

/** Jedan red tabele. */
const redovi = [];
const dodaj = (izvor, sekcija, kljuc, tekstovi) =>
  redovi.push({ izvor, sekcija, kljuc, ...tekstovi });

// ─────────────────────────────────────────────────────────────
// 1) messages/*.json — interfejs
// ─────────────────────────────────────────────────────────────
const ucitajJson = (jezik) =>
  JSON.parse(readFileSync(join(KOREN, "messages", `${jezik}.json`), "utf8"));

const prevodi = Object.fromEntries(JEZICI.map((j) => [j, ucitajJson(j)]));

/** Spljošti ugnežđen objekat u { "a.b.c": "tekst" }. */
function spljosti(obj, prefiks = "", cilj = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const put = prefiks ? `${prefiks}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) spljosti(v, put, cilj);
    else cilj[put] = Array.isArray(v) ? v.join(" | ") : String(v);
  }
  return cilj;
}

const spljosteni = Object.fromEntries(JEZICI.map((j) => [j, spljosti(prevodi[j])]));

// Redosled ključeva ide po srpskom (osnovni jezik); ključ koji postoji samo u
// nekom prevodu je greška u paritetu — svejedno se ispisuje, da se vidi.
const sviKljucevi = [
  ...Object.keys(spljosteni.sr),
  ...JEZICI.flatMap((j) => Object.keys(spljosteni[j])).filter((k) => !(k in spljosteni.sr)),
];
const videni = new Set();

for (const kljuc of sviKljucevi) {
  if (videni.has(kljuc)) continue;
  videni.add(kljuc);
  const sekcija = kljuc.split(".")[0];
  dodaj(
    "interfejs",
    sekcija,
    kljuc,
    Object.fromEntries(JEZICI.map((j) => [j, spljosteni[j][kljuc] ?? ""])),
  );
}

// ─────────────────────────────────────────────────────────────
// 2) FAQ — src/lib/faq-data*.ts
// ─────────────────────────────────────────────────────────────
/**
 * Fajlovi su TypeScript, a `node_modules` ne mora da postoji, pa se čita
 * preko ugrađenog skidanja tipova (Node 22.18+ / 23+). Prevodi uvoze samo
 * `import type`, koji se skidanjem tipova briše, pa se uvoze direktno.
 *
 * `faq-data.ts` je izuzetak: na kraju fajla uvozi ostale jezike BEZ nastavka
 * (`"./faq-data-en"`), što Node ESM ne razrešava. Zato se srpski izvor odseca
 * na prvoj `import` liniji — sve iznad je samo definicija `FAQ_SEKCIJE`.
 */
async function ucitajFaq() {
  const izvori = {
    en: ["faq-data-en.ts", "FAQ_SEKCIJE_EN"],
    ru: ["faq-data-ru.ts", "FAQ_SEKCIJE_RU"],
    hr: ["faq-data-hr.ts", "FAQ_SEKCIJE_HR"],
    hu: ["faq-data-hu.ts", "FAQ_SEKCIJE_HU"],
  };
  const out = {};

  const srIzvor = readFileSync(join(KOREN, "src", "lib", "faq-data.ts"), "utf8");
  const rez = srIzvor.split(/\n(?=import )/)[0];
  const privremeni = join(KOREN, "izvoz", ".faq-sr.ts");
  mkdirSync(join(KOREN, "izvoz"), { recursive: true });
  writeFileSync(privremeni, rez);
  try {
    out.sr = (await import(`file://${privremeni}`)).FAQ_SEKCIJE;
  } finally {
    rmSync(privremeni, { force: true });
  }

  for (const [jezik, [fajl, izvoz]] of Object.entries(izvori)) {
    const mod = await import(`file://${join(KOREN, "src", "lib", fajl)}`);
    out[jezik] = mod[izvoz];
  }
  return out;
}

const faq = await ucitajFaq();

/** { "<sekcija>|<idPitanja>|<polje>": tekst } za jedan jezik. */
function faqUMapu(sekcije) {
  const m = {};
  for (const s of sekcije) {
    m[`${s.id}||naslov`] = s.naslov;
    for (const p of s.pitanja) {
      m[`${s.id}|${p.id}|pitanje`] = p.pitanje;
      m[`${s.id}|${p.id}|odgovor`] = p.odgovor;
    }
  }
  return m;
}

const faqMape = Object.fromEntries(JEZICI.map((j) => [j, faqUMapu(faq[j])]));

for (const kljuc of Object.keys(faqMape.sr)) {
  const [sekcija, id, polje] = kljuc.split("|");
  dodaj(
    "faq",
    sekcija,
    id ? `pitanje ${id} — ${polje}` : "naslov sekcije",
    Object.fromEntries(JEZICI.map((j) => [j, faqMape[j][kljuc] ?? ""])),
  );
}

// ─────────────────────────────────────────────────────────────
// 3) Ekrani pada sistema / održavanja / 404
// ─────────────────────────────────────────────────────────────
const ekrani = await import(`file://${join(KOREN, "src", "lib", "ekran-poruke.ts")}`);

for (const [naziv, skup] of Object.entries({
  "pad sistema": ekrani.PAD_SISTEMA,
  "održavanje": ekrani.ODRZAVANJE,
  "404": ekrani.NEMA_STRANICE,
})) {
  for (const polje of Object.keys(skup.sr)) {
    dodaj(
      "sistemski ekrani",
      naziv,
      polje,
      // Ovi ekrani postoje samo na sr / sr-Cyrl / en / ru — hr i hu nedostaju.
      Object.fromEntries(JEZICI.map((j) => [j, skup[j]?.[polje] ?? ""])),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Zapis
// ─────────────────────────────────────────────────────────────
mkdirSync(join(KOREN, "izvoz"), { recursive: true });

const KOLONE = ["izvor", "sekcija", "kljuc", ...JEZICI];

/** CSV po RFC 4180; BOM na početku da Excel prepozna UTF-8 (č, ć, š, ž, đ). */
const csvPolje = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const csv =
  "﻿" +
  [KOLONE.join(","), ...redovi.map((r) => KOLONE.map((k) => csvPolje(r[k])).join(","))].join("\r\n");
writeFileSync(join(KOREN, "izvoz", "tekstovi-sajta.csv"), csv);

// ─────────────────────────────────────────────────────────────
// 4) Tekst zakucan u kodu (nije prevodiv bez izmene koda)
// ─────────────────────────────────────────────────────────────
// Traži se srpski tekst u navodnicima po .tsx fajlovima, pa se ručno pregleda.
// Namerno grubo: cilj je spisak mesta za proveru, ne tačan spisak stringova.
let zakucano = "";
try {
  zakucano = execFileSync(
    "grep",
    [
      "-rnE",
      String.raw`["'\x60][^"'\x60]*[čćšžđČĆŠŽĐ][^"'\x60]*["'\x60]`,
      "src",
      "--include=*.tsx",
    ],
    { cwd: KOREN, encoding: "utf8" },
  );
} catch {
  zakucano = "(grep nije našao ništa)\n";
}
writeFileSync(
  join(KOREN, "izvoz", "zakucano.txt"),
  "# Mesta gde srpski tekst stoji u kodu, a ne u messages/*.json\n" +
    "# Pažnja: spisak sadrži i komentare i imena ključeva — traži se ručno.\n\n" +
    zakucano,
);

const brojPo = (izvor) => redovi.filter((r) => r.izvor === izvor).length;
console.log(`interfejs (messages):     ${brojPo("interfejs")}`);
console.log(`FAQ:                      ${brojPo("faq")}`);
console.log(`sistemski ekrani:         ${brojPo("sistemski ekrani")}`);
console.log(`UKUPNO redova:            ${redovi.length}`);
// Prazno polje = tekst nije preveden na taj jezik. Poznat izuzetak: `dugme` na
// ekranima održavanja/404 je prazno NAMERNO (nema `reset()` granice greške).
const prazni = redovi.flatMap((r) =>
  JEZICI.filter((j) => !r[j] && r.kljuc !== "dugme").map(
    (j) => `${j.padEnd(2)} ← ${r.izvor} / ${r.sekcija} / ${r.kljuc}`,
  ),
);
console.log(`nedostaje prevoda:        ${prazni.length}`);
for (const p of prazni) console.log(`  - ${p}`);
console.log("\nizvoz/tekstovi-sajta.csv, izvoz/zakucano.txt");
