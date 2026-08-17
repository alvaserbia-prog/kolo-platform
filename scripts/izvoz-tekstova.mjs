/**
 * Izvoz SVIH tekstova sajta u jednu tabelu — radi lakšeg prevođenja i lekture.
 *
 * Pokretanje:  node scripts/izvoz-tekstova.mjs
 * Izlaz:       izvoz/tekstovi-sajta.md    (svih 5 jezika jedan pod drugim, uz ključ)
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

// Ključ mora da bude JEDINSTVEN u celoj tabeli — po njemu se red pronalazi kad
// se izmenjen tekst vraća u kod. Zato nosi i sekciju: „pitanje 42 — pitanje"
// samo po sebi ne bi razlikovalo sekcije, a „naslov sekcije" bi se ponovilo 8 puta.
for (const kljuc of Object.keys(faqMape.sr)) {
  const [sekcija, id, polje] = kljuc.split("|");
  dodaj(
    "faq",
    sekcija,
    id ? `faq.${sekcija}.pitanje-${id}.${polje}` : `faq.${sekcija}.naslov`,
    Object.fromEntries(JEZICI.map((j) => [j, faqMape[j][kljuc] ?? ""])),
  );
}

// ─────────────────────────────────────────────────────────────
// 3) Ekrani pada sistema / održavanja / 404
// ─────────────────────────────────────────────────────────────
const ekrani = await import(`file://${join(KOREN, "src", "lib", "ekran-poruke.ts")}`);

for (const [naziv, oznaka, skup] of [
  ["pad sistema", "pad_sistema", ekrani.PAD_SISTEMA],
  ["održavanje", "odrzavanje", ekrani.ODRZAVANJE],
  ["404", "nema_stranice", ekrani.NEMA_STRANICE],
]) {
  for (const polje of Object.keys(skup.sr)) {
    dodaj("sistemski ekrani", naziv, `ekran.${oznaka}.${polje}`, {
      ...Object.fromEntries(JEZICI.map((j) => [j, skup[j]?.[polje] ?? ""])),
    });
  }
}

// ─────────────────────────────────────────────────────────────
// Zapis
// ─────────────────────────────────────────────────────────────
mkdirSync(join(KOREN, "izvoz"), { recursive: true });

// Ključ je adresa reda — dva reda sa istim ključem znače da se izmenjen tekst
// ne bi mogao jednoznačno vratiti u kod. Pada odmah, ne ćuti.
const brojac = new Map();
for (const r of redovi) brojac.set(r.kljuc, (brojac.get(r.kljuc) ?? 0) + 1);
const dupli = [...brojac].filter(([, n]) => n > 1);
if (dupli.length) {
  console.error("Ključ se ponavlja:", dupli.map(([k, n]) => `${k} (${n}×)`).join(", "));
  process.exit(1);
}

/**
 * Markdown, ne CSV (odluka vlasnika 2026-08-17): tekstovi su proza, a ne
 * tabelarni podaci — FAQ odgovor ima više pasusa, što u ćeliji tablice ne može
 * da se čita ni menja. Ovde svaki tekst stoji kao pasus, pa se piše kao u
 * uredniku.
 *
 * 🔴 FORMAT JE MAŠINSKI ČITLJIV i po njemu se izmene vraćaju u kod, pa se ne
 * menja bez potrebe:
 *   `### <kljuc>`     — jedan tekst, ključ je njegova adresa
 *   `**<jezik>**`     — jezik, pa PRAZAN RED, pa tekst do sledećeg `**jezik**`
 *   `---`             — kraj jednog teksta
 * Uređuje se SAMO tekst pod oznakom jezika. Ključ i oznake jezika ostaju.
 */
const zaglavlje = (r) => `### ${r.kljuc}`;

/**
 * Tekst ide u markdown kakav jeste, uz jedan zahvat: red koji počinje znakom
 * markdown sintakse (`#`, `-`, `>`, `|`, cifra + tačka) beži obrnutom kosom
 * crtom, inače bi se prikazao kao naslov ili kao stavka liste. Znak bežanja
 * `raspakuj()` skida pri čitanju, pa tekst ostaje isti do znaka.
 *
 * Prelomi reda se NE pretvaraju u markdown prelome (dupli razmak na kraju
 * reda): prikaz bi bio verniji, ali bi u tekst ušla dva znaka kojih u kodu
 * nema, pa bi se pri vraćanju u kod izgubila razlika između pravog teksta i
 * ukrasa. Vernost teksta je važnija od vernosti prikaza.
 */
function telo(tekst) {
  if (!tekst) return PRAZNO;
  return tekst
    .replace(/^ +/, (m) => RAZMAK.repeat(m.length))
    .replace(/ +$/, (m) => RAZMAK.repeat(m.length))
    .split("\n")
    .map((red) => red.replace(/^(\s*)([#>|+*-]|\d+\.)/, "$1\\$2"))
    .join("\n");
}

/** Oznaka za tekst koji na tom jeziku ne postoji — da se prazan red ne čita kao brisanje. */
const PRAZNO = "_(prazno)_";

/**
 * Razmak na početku ili kraju teksta se ISPISUJE kao „␣".
 *
 * Jedanaest tekstova ga nosi namerno — to su odlomci koji se u rečenici spajaju
 * oko podebljane reči („To zovemo ", pa POEN, pa " je zapis…"), pa bi izgubljen
 * razmak spojio dve reči. U markdownu se takav razmak ne vidi, a većina
 * urednika ga briše pri čuvanju fajla, tiho i bez pitanja. Vidljiv znak je
 * jedina odbrana: ono što se vidi, ne može da se izgubi neopaženo.
 */
const RAZMAK = "␣";

/**
 * Obrnuto od `telo()` — koristi se pri vraćanju izmena iz fajla u kod.
 *
 * Prazan red posle oznake jezika i pre sledeće oznake pripada formatu, ne
 * tekstu, pa se skida po jedan sa svakog kraja. NE koristi se `trim()`, jer bi
 * odneo i razmak koji je deo teksta.
 */
function raspakuj(blok) {
  const linije = blok.split("\n");
  if (linije[0] === "") linije.shift();
  if (linije.at(-1) === "") linije.pop();
  const tekst = linije
    .map((red) => red.replace(/^(\s*)\\([#>|+*-]|\d+\.)/, "$1$2"))
    .join("\n");
  if (tekst === PRAZNO) return "";
  return tekst.replaceAll(RAZMAK, " ");
}

/**
 * Čita gotov markdown i vraća `{ kljuc: { jezik: tekst } }`.
 *
 * Stoji ovde, a ne u zasebnoj skripti, da bi se izvoz proveravao sam: posle
 * pisanja se fajl pročita natrag i uporedi sa izvorom. Bez toga bi „format je
 * mašinski čitljiv" bilo obećanje koje ništa ne drži — a upravo od njega
 * zavisi da se izmene iz fajla mogu vratiti u kod.
 */
export function procitajIzvoz(sadrzaj) {
  const out = {};
  let kljuc = null;
  let jezik = null;
  let blok = [];
  const zatvori = () => {
    if (kljuc && jezik) (out[kljuc] ??= {})[jezik] = raspakuj(blok.join("\n"));
    blok = [];
  };
  for (const red of sadrzaj.split("\n")) {
    const noviKljuc = /^### (.+)$/.exec(red);
    const noviJezik = /^\*\*([a-z-]{2,7})\*\*$/.exec(red);
    if (noviKljuc) {
      zatvori();
      kljuc = noviKljuc[1].trim();
      jezik = null;
    } else if (noviJezik) {
      zatvori();
      jezik = noviJezik[1];
    } else if (red === "---") {
      zatvori();
      jezik = null;
    } else if (jezik) {
      blok.push(red);
    }
  }
  zatvori();
  return out;
}

const md = [];
md.push("# Tekstovi sajta");
md.push("");
md.push(
  `Generisano skriptom \`scripts/izvoz-tekstova.mjs\`. Ukupno **${redovi.length}** tekstova ` +
    `na ${JEZICI.length} jezika (${JEZICI.join(", ")}).`,
);
md.push("");
md.push("**Kako se uređuje:** menja se samo tekst ispod oznake jezika. Red koji počinje sa");
md.push("`###` je ključ — adresa po kojoj se tekst vraća u kod — i ne dira se, kao ni oznake");
md.push("jezika (`**sr**`, `**en**`…). Novi jezik se ne dodaje ovde nego u `messages/`.");
md.push("");
md.push("Dva znaka pripadaju fajlu, a ne tekstu sajta:");
md.push("");
md.push("- `\\` na početku reda — izbegnut znak markdown sintakse (`#`, `-`, `>`…).");
md.push(
  `- \`${RAZMAK}\` — razmak na početku ili kraju teksta. Nosi ga jedanaest odlomaka koji se u ` +
    "rečenici spajaju oko podebljane reči; ako se izgubi, dve reči se sastave. Ostavi ga gde je.",
);
md.push("");
md.push(`Tekst koji na nekom jeziku ne postoji označen je sa ${PRAZNO}.`);
md.push("");

// Sadržaj — po izvoru i sekciji, sa brojem tekstova; sekcija je i naslov ispod.
md.push("## Sadržaj");
md.push("");
const grupe = [];
for (const r of redovi) {
  const naziv = `${r.izvor} / ${r.sekcija}`;
  if (grupe.at(-1)?.naziv !== naziv) grupe.push({ naziv, redovi: [] });
  grupe.at(-1).redovi.push(r);
}
for (const g of grupe) md.push(`- ${g.naziv} — ${g.redovi.length}`);
md.push("");

for (const g of grupe) {
  md.push(`## ${g.naziv}`);
  md.push("");
  for (const r of g.redovi) {
    md.push(zaglavlje(r));
    md.push("");
    for (const j of JEZICI) {
      md.push(`**${j}**`);
      md.push("");
      md.push(telo(r[j]));
      md.push("");
    }
    md.push("---");
    md.push("");
  }
}

const sadrzajMd = md.join("\n");
writeFileSync(join(KOREN, "izvoz", "tekstovi-sajta.md"), sadrzajMd);

// Provera da se napisano može pročitati natrag — inače fajl nije upotrebljiv za
// vraćanje izmena, a to se ne bi videlo do trenutka kad zatreba.
const procitano = procitajIzvoz(sadrzajMd);
const razlike = [];
for (const r of redovi) {
  for (const j of JEZICI) {
    if (procitano[r.kljuc]?.[j] !== r[j]) razlike.push(`${r.kljuc} / ${j}`);
  }
}
if (razlike.length) {
  console.error(`Izvoz se ne čita natrag (${razlike.length}):`, razlike.slice(0, 10).join(", "));
  process.exit(1);
}

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
  JEZICI.filter((j) => !r[j] && !r.kljuc.endsWith(".dugme")).map(
    (j) => `${j.padEnd(2)} ← ${r.izvor} / ${r.sekcija} / ${r.kljuc}`,
  ),
);
console.log(`nedostaje prevoda:        ${prazni.length}`);
for (const p of prazni) console.log(`  - ${p}`);
console.log("\nizvoz/tekstovi-sajta.md, izvoz/zakucano.txt");
