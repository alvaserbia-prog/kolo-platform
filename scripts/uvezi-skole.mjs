/**
 * Uvoz šifarnika škola iz zvaničnog izvoza u `src/lib/skole-srbije.ts`.
 *
 *   node scripts/uvezi-skole.mjs <izvoz.csv>
 *
 * ─── Odakle podaci ──────────────────────────────────────────────────────────
 *
 * Jedinstveni informacioni sistem prosvete (JISP), otvoreni podaci Ministarstva
 * prosvete — `opendata.mpn.gov.rs`. Traži se izvoz ustanova koji uz naziv i mesto
 * nosi i BROJ UPISANIH UČENIKA po školi; bez tog broja ne postoji procentualna
 * lista, a ona je razlog zbog koga mala škola uopšte može da bude prva u državi.
 *
 * ─── Ulazni oblik ───────────────────────────────────────────────────────────
 *
 * CSV sa zaglavljem. Nazivi kolona se prepoznaju iz nekoliko uobičajenih zapisa
 * (vidi `KOLONE` ispod) — izvozi se razlikuju od godine do godine, a ručno
 * preimenovanje kolona pre uvoza je tačno onaj korak koji se zaboravi.
 *
 * Obavezne kolone: šifra, naziv, mesto, tip. Broj učenika je neobavezan; škola bez
 * njega prolazi i u procentualnoj listi stoji sa crticom (nikad sa procenom).
 *
 * ─── Dve provere koje ruše ceo uvoz ─────────────────────────────────────────
 *
 * 1. Šifre moraju biti jedinstvene. Dupla šifra znači da dve škole dele ključ, pa
 *    bi im se deca sabrala u jedan red.
 * 2. Svako mesto mora da se razreši u kanonsko naselje iz `NASELJA_SRBIJE`.
 *    🔴 Ovo je važnije nego što deluje: škola čije mesto ne pogađa nijedno naselje
 *    tiho ispada iz svega što se kači na lokaciju, a na listi i dalje stoji — dakle
 *    kvar koji se ne vidi. Bolje da uvoz stane i da se spisak naselja dopuni.
 *
 * Skripta NIŠTA ne upisuje dok obe provere ne prođu za sve redove.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OVDE = dirname(fileURLToPath(import.meta.url));
const KOREN = resolve(OVDE, "..");
const IZLAZ = resolve(KOREN, "src/lib/skole-srbije.ts");

// ── Prepoznavanje kolona ──────────────────────────────────────────────────────

const KOLONE = {
  sifra: ["sifra", "šifra", "sifra_ustanove", "id", "jisp", "jisp_id", "maticni_broj"],
  naziv: ["naziv", "naziv_ustanove", "ime", "skola", "škola"],
  mesto: ["mesto", "mesto_ustanove", "naselje", "grad", "sediste", "sedište"],
  tip: ["tip", "tip_ustanove", "vrsta", "nivo", "vrsta_ustanove"],
  ucenika: ["ucenika", "učenika", "broj_ucenika", "broj_učenika", "upisano", "ukupno_ucenika"],
};

function normalizujZaglavlje(s) {
  return s
    .replace(/^﻿/, "")
    .trim()
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[\s.-]+/g, "_");
}

function nadjiKolone(zaglavlje) {
  const norm = zaglavlje.map(normalizujZaglavlje);
  const mapa = {};
  for (const [polje, kandidati] of Object.entries(KOLONE)) {
    const i = norm.findIndex((h) => kandidati.some((k) => h === normalizujZaglavlje(k)));
    if (i >= 0) mapa[polje] = i;
  }
  return mapa;
}

// ── Čitanje CSV-a ─────────────────────────────────────────────────────────────

/** Minimalan CSV čitač: navodnici, udvojeni navodnik, zarez ili tačka-zarez. */
function citajCsv(tekst) {
  const razdvojnik = (tekst.split("\n")[0].match(/;/g) ?? []).length > 0 ? ";" : ",";
  const redovi = [];
  let polje = "";
  let red = [];
  let uNavodnicima = false;

  for (let i = 0; i < tekst.length; i++) {
    const z = tekst[i];
    if (uNavodnicima) {
      if (z === '"') {
        if (tekst[i + 1] === '"') { polje += '"'; i++; } else { uNavodnicima = false; }
      } else polje += z;
      continue;
    }
    if (z === '"') { uNavodnicima = true; continue; }
    if (z === razdvojnik) { red.push(polje); polje = ""; continue; }
    if (z === "\n") { red.push(polje); redovi.push(red); red = []; polje = ""; continue; }
    if (z === "\r") continue;
    polje += z;
  }
  if (polje !== "" || red.length > 0) { red.push(polje); redovi.push(red); }
  return redovi.filter((r) => r.some((c) => c.trim() !== ""));
}

// ── Tip škole ─────────────────────────────────────────────────────────────────

function razresiTip(unos) {
  const s = normalizujZaglavlje(String(unos ?? ""));
  if (!s) return null;
  if (s.includes("osnovn") || s === "os" || s.startsWith("o_s")) return "OSNOVNA";
  if (
    s.includes("srednj") ||
    s.includes("gimnazij") ||
    s.includes("strucn") ||
    s === "ss"
  ) return "SREDNJA";
  return null;
}

// ── Glavni tok ────────────────────────────────────────────────────────────────

const putanja = process.argv[2];
if (!putanja) {
  console.error("Upotreba: node scripts/uvezi-skole.mjs <izvoz.csv>");
  process.exit(1);
}

// `razresiNaselje` je TypeScript modul, pa se spisak naselja čita iz izvora.
// Namerno bez build koraka — skripta se pokreće retko i ne sme da zavisi od toga
// da li je projekat prethodno preveden.
const naseljaIzvor = readFileSync(resolve(KOREN, "src/lib/naselja-srbije.ts"), "utf8");
const NASELJA = [...naseljaIzvor.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
if (NASELJA.length < 100) {
  console.error("Spisak naselja nije pročitan — očekivano je preko 800 naziva.");
  process.exit(1);
}

function normalizujNaselje(s) {
  return s
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

const INDEKS_NASELJA = new Map();
for (const n of NASELJA) {
  const k = normalizujNaselje(n);
  if (!INDEKS_NASELJA.has(k)) INDEKS_NASELJA.set(k, n);
}

/** Isti postupak kao `razresiNaselje` u `src/lib/naselje.ts` — uži pojam pobeđuje. */
function razresiNaselje(unos) {
  if (typeof unos !== "string") return null;
  const s = unos.trim().replace(/\s+/g, " ");
  if (!s) return null;
  const kandidati = [
    s,
    s.replace(/\s*\([^)]*\)\s*$/, ""),
    s.split(/[,/;]|\s[-–—]\s/)[0],
  ];
  for (const k of kandidati) {
    const pogodak = INDEKS_NASELJA.get(normalizujNaselje(k));
    if (pogodak) return pogodak;
  }
  return null;
}

const redovi = citajCsv(readFileSync(resolve(putanja), "utf8"));
if (redovi.length < 2) {
  console.error("Fajl nema nijedan red podataka.");
  process.exit(1);
}

const kolone = nadjiKolone(redovi[0]);
for (const obavezna of ["sifra", "naziv", "mesto", "tip"]) {
  if (kolone[obavezna] === undefined) {
    console.error(
      `Nedostaje kolona „${obavezna}". Prepoznata zaglavlja: ${redovi[0].join(" | ")}`
    );
    console.error(`Očekivan neki od zapisa: ${KOLONE[obavezna].join(", ")}`);
    process.exit(1);
  }
}

const skole = [];
const vidjeneSifre = new Set();
const greske = [];
const nepoznataNaselja = new Map();

for (let i = 1; i < redovi.length; i++) {
  const red = redovi[i];
  const uzmi = (polje) =>
    kolone[polje] === undefined ? "" : (red[kolone[polje]] ?? "").trim();

  const sifra = uzmi("sifra");
  const naziv = uzmi("naziv");
  const mestoUnos = uzmi("mesto");
  const tip = razresiTip(uzmi("tip"));

  if (!sifra || !naziv || !mestoUnos) {
    greske.push(`red ${i + 1}: prazna šifra, naziv ili mesto`);
    continue;
  }
  if (vidjeneSifre.has(sifra)) {
    greske.push(`red ${i + 1}: šifra „${sifra}" se ponavlja`);
    continue;
  }
  if (!tip) {
    greske.push(`red ${i + 1}: tip škole nije prepoznat („${uzmi("tip")}")`);
    continue;
  }

  const mesto = razresiNaselje(mestoUnos);
  if (!mesto) {
    nepoznataNaselja.set(mestoUnos, (nepoznataNaselja.get(mestoUnos) ?? 0) + 1);
    continue;
  }

  const ucenikaSirovo = uzmi("ucenika").replace(/[^\d]/g, "");
  const ucenika = ucenikaSirovo ? Number(ucenikaSirovo) : null;

  vidjeneSifre.add(sifra);
  skole.push({ sifra, naziv, mesto, tip, ucenika: ucenika && ucenika > 0 ? ucenika : null });
}

if (nepoznataNaselja.size > 0) {
  console.error(`\n🔴 ${nepoznataNaselja.size} mesta se ne razrešava u spisak naselja:\n`);
  for (const [mesto, broj] of [...nepoznataNaselja].sort((a, b) => b[1] - a[1])) {
    console.error(`   ${String(broj).padStart(4)} × ${mesto}`);
  }
  console.error(
    "\nDopuni `src/lib/naselja-srbije.ts` ovim naseljima, pa ponovi uvoz.\n" +
      "Ne popravljati ručno u izvozu — sledeći uvoz bi vratio isti problem.\n"
  );
}
if (greske.length > 0) {
  console.error(`\n🔴 ${greske.length} redova nije ispravno:\n`);
  for (const g of greske.slice(0, 40)) console.error(`   ${g}`);
  if (greske.length > 40) console.error(`   … i još ${greske.length - 40}`);
}
if (nepoznataNaselja.size > 0 || greske.length > 0) {
  console.error("Uvoz je prekinut — ništa nije upisano.");
  process.exit(1);
}

skole.sort((a, b) => a.naziv.localeCompare(b.naziv, "sr") || a.mesto.localeCompare(b.mesto, "sr"));

const bezBrojaUcenika = skole.filter((s) => s.ucenika === null).length;
const zaglavlje = readFileSync(IZLAZ, "utf8").split("export const SKOLE")[0];

const telo =
  `export const SKOLE: Skola[] = [\n` +
  skole
    .map(
      (s) =>
        `  { sifra: ${JSON.stringify(s.sifra)}, naziv: ${JSON.stringify(s.naziv)}, ` +
        `mesto: ${JSON.stringify(s.mesto)}, tip: ${JSON.stringify(s.tip)}, ucenika: ${s.ucenika ?? "null"} },`
    )
    .join("\n") +
  `\n];\n`;

writeFileSync(IZLAZ, zaglavlje + telo, "utf8");

console.log(`✅ Upisano ${skole.length} škola u ${IZLAZ}`);
console.log(`   osnovnih: ${skole.filter((s) => s.tip === "OSNOVNA").length}`);
console.log(`   srednjih: ${skole.filter((s) => s.tip === "SREDNJA").length}`);
if (bezBrojaUcenika > 0) {
  console.log(
    `   🟡 bez broja učenika: ${bezBrojaUcenika} — te škole stoje u listi po broju, ` +
      `a u procentualnoj sa crticom.`
  );
}
