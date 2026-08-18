/**
 * Uvoz šifarnika škola iz zvaničnog izvoza JISP-a u `src/lib/skole-srbije.ts`.
 *
 *   node scripts/uvezi-skole.mjs <izvoz.csv> [--godina 2025/2026]
 *
 * ─── Odakle podaci ──────────────────────────────────────────────────────────
 *
 * Jedinstveni informacioni sistem prosvete (JISP), otvoreni podaci Ministarstva
 * prosvete: izveštaj **„Osnovno obrazovanje — Odeljenja i razredi"**. Portal ga
 * daje kao XLSX; pre uvoza ga sačuvati kao CSV (razdvojnik `;` ili `,`).
 *
 * 🔴 Izvoz je po ODELJENJU, ne po školi — jedna škola ima onoliko redova koliko
 * ima odeljenja, a broj upisanih učenika se dobija tek SABIRANJEM kolone
 * „Ukupan broj ucenika" po školi. Zato ova skripta grupiše, a ne samo prepisuje.
 *
 * ─── Ćirilica ───────────────────────────────────────────────────────────────
 *
 * Izvoz je na ćirilici, a ceo interfejs i šifarnik naselja su na latinici. Nazivi
 * i mesta se preslovljavaju; ključ je da se `mesto` posle preslovljavanja MORA
 * razrešiti u kanonsko naselje iz `NASELJA_SRBIJE`, inače škola tiho ispada iz
 * svega što se kači na lokaciju, a na listi i dalje stoji.
 *
 * ─── Šifra ──────────────────────────────────────────────────────────────────
 *
 * 🔴 Izvoz NEMA identifikator ustanove, pa se šifra izvodi iz para naziv + mesto.
 * Taj par jeste jedinstven (provereno na izvozu 2025/2026: 1.327 škola, isto
 * toliko parova), dok sam naziv nije — „ОШ Бранко Радичевић" javlja se na
 * **42 mesta**. Šifra je determinističan slug, pa ponovljen uvoz daje iste
 * vrednosti i zatečeni izbori dece ostaju važeći; sudar slugova ruši uvoz.
 *
 * ─── Šta se NE uvozi ────────────────────────────────────────────────────────
 *
 * Srednje škole. U ovom izvozu ih ima svega četrdesetak (muzičke, baletske i
 * poneka gimnazija koje dele ustanovu sa osnovnom), a u Srbiji ih je oko petsto.
 * Lista od četrdeset škola predstavljena kao „srednje škole u Srbiji" bila bi
 * netačna, pa se izostavljaju dok ne stigne izvoz srednjeg obrazovanja.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OVDE = dirname(fileURLToPath(import.meta.url));
const KOREN = resolve(OVDE, "..");
const IZLAZ = resolve(KOREN, "src/lib/skole-srbije.ts");

// ── Preslovljavanje ───────────────────────────────────────────────────────────

const CIR = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "đ", е: "e", ж: "ž", з: "z",
  и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o",
  п: "p", р: "r", с: "s", т: "t", ћ: "ć", у: "u", ф: "f", х: "h", ц: "c",
  ч: "č", џ: "dž", ш: "š",
};

/**
 * Ćirilica → latinica. Dvoslovi (љ, њ, џ) prate okolinu: usred verzalnog zapisa
 * daju „LJ", a na početku reči „Lj" — inače bi „ЉУБЕРАЂА" postalo „LjUBERAĐA".
 */
function preslovi(tekst) {
  const znakovi = [...String(tekst ?? "")];
  return znakovi
    .map((z, i) => {
      const malo = z.toLowerCase();
      const lat = CIR[malo];
      if (!lat) return z;
      if (z === malo) return lat;
      if (lat.length === 1) return lat.toUpperCase();
      // Dvoslov iz velikog slova: gleda se sledeći znak da se odluči LJ vs Lj.
      const sledeci = znakovi[i + 1] ?? "";
      const velikiSusjed = sledeci && sledeci === sledeci.toUpperCase() && CIR[sledeci.toLowerCase()];
      return velikiSusjed ? lat.toUpperCase() : lat[0].toUpperCase() + lat.slice(1);
    })
    .join("");
}

function normalizuj(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Naselja ───────────────────────────────────────────────────────────────────

const naseljaIzvor = readFileSync(resolve(KOREN, "src/lib/naselja-srbije.ts"), "utf8");
const NASELJA = [...naseljaIzvor.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
if (NASELJA.length < 100) {
  console.error("Spisak naselja nije pročitan — očekivano je preko 800 naziva.");
  process.exit(1);
}
const INDEKS_NASELJA = new Map();
for (const n of NASELJA) {
  const k = normalizuj(n);
  if (!INDEKS_NASELJA.has(k)) INDEKS_NASELJA.set(k, n);
}

/**
 * Mesto škole u kanonski naziv naselja — uži pojam pobeđuje, kao u
 * `razresiNaselje` iz `src/lib/naselje.ts`.
 *
 * 🔴 Jedna razlika u odnosu na taj modul: sadržaj ZAGRADE se proverava PRVI.
 * JISP beogradske škole vodi kao „БЕОГРАД (ЗВЕЗДАРА)", a odbacivanje zagrade bi
 * sve svelo na „Beograd" — pa bi dve škole istog imena iz različitih opština
 * dobile isti ključ (dogodilo se sa „OŠ Branko Radičević" i „OŠ Vladislav
 * Petković Dis"), a na listi bi stajale kao dva neraspoznatljiva reda.
 * Za mesta čija zagrada nije naselje („НИШ (МЕДИЈАНА)") pravilo se ne aktivira i
 * ostaje „Niš".
 */
function razresiNaselje(unos) {
  const s = String(unos ?? "").trim().replace(/\s+/g, " ");
  if (!s) return null;
  const uZagradi = s.match(/\(([^)]*)\)\s*$/)?.[1];
  const kandidati = [
    ...(uZagradi ? [uZagradi] : []),
    s,
    s.replace(/\s*\([^)]*\)\s*$/, ""),
    s.split(/[,/;]|\s[-–—]\s/)[0],
  ];
  for (const k of kandidati) {
    const pogodak = INDEKS_NASELJA.get(normalizuj(k));
    if (pogodak) return pogodak;
  }
  return null;
}

// ── CSV ───────────────────────────────────────────────────────────────────────

function citajCsv(tekst) {
  const razdvojnik = (tekst.slice(0, tekst.indexOf("\n")).match(/;/g) ?? []).length > 0 ? ";" : ",";
  const redovi = [];
  let polje = "", red = [], uNavodnicima = false;
  for (let i = 0; i < tekst.length; i++) {
    const z = tekst[i];
    if (uNavodnicima) {
      if (z === '"') {
        if (tekst[i + 1] === '"') { polje += '"'; i++; } else uNavodnicima = false;
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

const zaglavljeKljuc = (s) =>
  String(s ?? "").replace(/^﻿/, "").trim().toLowerCase().replace(/[\s.-]+/g, "_");

const KOLONE = {
  godina: ["skolska_godina"],
  naziv: ["naziv_ustanove"],
  mesto: ["mesto/grad", "mesto_grad", "mesto"],
  opstina: ["opstina"],
  vrsta: ["vrsta_ustanove"],
  ucenika: ["ukupan_broj_ucenika"],
};

// ── Glavni tok ────────────────────────────────────────────────────────────────

const putanja = process.argv[2];
if (!putanja) {
  console.error("Upotreba: node scripts/uvezi-skole.mjs <izvoz.csv> [--godina 2025/2026]");
  process.exit(1);
}
const trazenaGodina = (() => {
  const i = process.argv.indexOf("--godina");
  return i > 0 ? process.argv[i + 1] : null;
})();

const redovi = citajCsv(readFileSync(resolve(putanja), "utf8"));
if (redovi.length < 2) {
  console.error("Fajl nema nijedan red podataka.");
  process.exit(1);
}

const norm = redovi[0].map(zaglavljeKljuc);
const kolone = {};
for (const [polje, kandidati] of Object.entries(KOLONE)) {
  const i = norm.findIndex((h) => kandidati.includes(h));
  if (i < 0) {
    console.error(`Nedostaje kolona „${polje}". Zaglavlje: ${redovi[0].join(" | ")}`);
    process.exit(1);
  }
  kolone[polje] = i;
}

const podaci = redovi.slice(1);
const uzmi = (red, polje) => (red[kolone[polje]] ?? "").trim();

// Najnovija školska godina sa značajnim brojem redova. Poslednja godina u izvozu
// ume da bude tek započeta (svega nekoliko odeljenja), pa se bira po BROJU redova
// među najnovijima, ne prosto najveći niz.
const poGodini = new Map();
for (const r of podaci) {
  const g = uzmi(r, "godina");
  if (!/^\d{4}\/\d{4}$/.test(g)) continue;
  poGodini.set(g, (poGodini.get(g) ?? 0) + 1);
}
const godina =
  trazenaGodina ??
  [...poGodini.entries()].sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))[0]?.[0];
if (!godina) {
  console.error("U izvozu nema nijedne prepoznate školske godine.");
  process.exit(1);
}
console.log(`Školska godina: ${godina} (${poGodini.get(godina)} odeljenja u izvozu)`);

const skole = new Map();
let preskoceneSrednje = 0;
for (const r of podaci) {
  if (uzmi(r, "godina") !== godina) continue;
  const vrsta = uzmi(r, "vrsta");
  if (vrsta.startsWith("Средња") || vrsta.startsWith("Srednja")) { preskoceneSrednje++; continue; }

  const naziv = preslovi(uzmi(r, "naziv"));
  const mestoUnos = preslovi(uzmi(r, "mesto"));
  if (!naziv || !mestoUnos) continue;

  const kljuc = `${naziv}|${mestoUnos}`;
  if (!skole.has(kljuc)) {
    skole.set(kljuc, { naziv, mestoUnos, opstina: preslovi(uzmi(r, "opstina")), ucenika: 0 });
  }
  const broj = Number(uzmi(r, "ucenika").replace(",", "."));
  if (Number.isFinite(broj) && broj > 0) skole.get(kljuc).ucenika += broj;
}

// ── Provere koje ruše ceo uvoz ────────────────────────────────────────────────

const nepoznataNaselja = new Map();
const izlazni = [];
const vidjeneSifre = new Map();
const sudari = [];

for (const s of skole.values()) {
  const mesto = razresiNaselje(s.mestoUnos);
  if (!mesto) {
    nepoznataNaselja.set(s.mestoUnos, (nepoznataNaselja.get(s.mestoUnos) ?? 0) + 1);
    continue;
  }
  const sifra = `${normalizuj(s.naziv)}-${normalizuj(mesto)}`
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (vidjeneSifre.has(sifra)) sudari.push(`${sifra}: „${vidjeneSifre.get(sifra)}" i „${s.naziv} — ${mesto}"`);
  vidjeneSifre.set(sifra, `${s.naziv} — ${mesto}`);
  izlazni.push({
    sifra,
    naziv: s.naziv,
    mesto,
    tip: "OSNOVNA",
    ucenika: Math.round(s.ucenika) || null,
  });
}

if (nepoznataNaselja.size > 0) {
  console.error(`\n🔴 ${nepoznataNaselja.size} mesta se ne razrešava u spisak naselja:\n`);
  for (const [mesto, broj] of [...nepoznataNaselja].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "sr"))) {
    console.error(`   ${String(broj).padStart(3)} × ${mesto}`);
  }
  console.error(
    "\nDopuni `src/lib/naselja-srbije.ts` ovim naseljima, pa ponovi uvoz.\n" +
      "Ne popravljati ručno u izvozu — sledeći uvoz bi vratio isti problem.\n"
  );
}
if (sudari.length > 0) {
  console.error(`\n🔴 ${sudari.length} sudara šifri:\n`);
  for (const s of sudari.slice(0, 20)) console.error(`   ${s}`);
}
if (nepoznataNaselja.size > 0 || sudari.length > 0) {
  console.error("Uvoz je prekinut — ništa nije upisano.");
  process.exit(1);
}

izlazni.sort((a, b) => a.naziv.localeCompare(b.naziv, "sr") || a.mesto.localeCompare(b.mesto, "sr"));

const bezBroja = izlazni.filter((s) => s.ucenika === null).length;
const zaglavlje = readFileSync(IZLAZ, "utf8").split("export const SKOLE")[0];
const telo =
  `export const SKOLE: Skola[] = [\n` +
  izlazni
    .map(
      (s) =>
        `  { sifra: ${JSON.stringify(s.sifra)}, naziv: ${JSON.stringify(s.naziv)}, ` +
        `mesto: ${JSON.stringify(s.mesto)}, tip: ${JSON.stringify(s.tip)}, ucenika: ${s.ucenika ?? "null"} },`
    )
    .join("\n") +
  `\n];\n`;
writeFileSync(IZLAZ, zaglavlje + telo, "utf8");

console.log(`✅ Upisano ${izlazni.length} osnovnih škola u ${IZLAZ}`);
console.log(`   ukupno upisanih učenika: ${izlazni.reduce((z, s) => z + (s.ucenika ?? 0), 0).toLocaleString("sr-RS")}`);
if (bezBroja > 0) console.log(`   🟡 bez broja učenika: ${bezBroja} — u procentualnoj listi stoje sa crticom.`);
if (preskoceneSrednje > 0) {
  console.log(
    `   🟡 preskočeno ${preskoceneSrednje} odeljenja srednjih škola — ovaj izvoz ih nosi tek četrdesetak,\n` +
      `      a u Srbiji ih je oko petsto; čeka se izvoz srednjeg obrazovanja.`
  );
}
