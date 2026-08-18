#!/usr/bin/env node
/**
 * Generiše `docs/provera-teksta/paket-*.md` — radne dokumente za prolazak kroz
 * sav tekst interfejsa, paket po paket.
 *
 * Svaki dokument je SAMOSTALAN (kontekst sistema + tvrda pravila + svi tekstovi
 * tog paketa), jer se nalepljuje u prazan razgovor. Otud ponavljanje pravila u
 * devet fajlova — to nije previd nego uslov upotrebe.
 *
 * Podela na pakete ide po tome KO tekst vidi, ne po rasporedu koda: prvo ono što
 * čovek pročita pre nego što ima nalog, poslednje admin panel koji ne vidi nijedan
 * član. Podela, opisi ekrana i tekst pravila stoje u
 * `scripts/pakete-teksta.podaci.json`.
 *
 * Pokreni ponovo kad se u `messages/sr.json` pojave novi ključevi (npr. kad se
 * tekst zakucan u kodu izvuče u prevode) — dokumenti se prepisuju iz nule.
 *
 *   node scripts/generisi-pakete-teksta.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const KOREN = path.resolve(import.meta.dirname, "..");
const IZLAZ = path.join(KOREN, "docs", "provera-teksta");

const sr = JSON.parse(readFileSync(path.join(KOREN, "messages", "sr.json"), "utf-8"));
const { OPIS, ZAKLJUCANI, PAKETI, PRAVILA, KONTEKST } = JSON.parse(
  readFileSync(path.join(import.meta.dirname, "pakete-teksta.podaci.json"), "utf-8"),
);

/** Ravan spisak `[pun.kljuc, tekst]` iz ugnežđenog objekta. */
function* ravno(cvor, prefiks = "") {
  if (cvor && typeof cvor === "object" && !Array.isArray(cvor)) {
    for (const [k, v] of Object.entries(cvor)) yield* ravno(v, prefiks ? `${prefiks}.${k}` : k);
  } else if (Array.isArray(cvor)) {
    for (const [i, v] of cvor.entries()) yield* ravno(v, `${prefiks}[${i}]`);
  } else {
    yield [prefiks, String(cvor)];
  }
}

/** Imena `{parametara}`; iz ICU grana uzima samo prvi identifikator. */
function parametri(tekst) {
  const imena = new Set();
  for (const [, unutra] of tekst.matchAll(/\{([^{}]+)\}/g)) {
    const ime = unutra.split(",")[0].trim();
    if (ime) imena.add(ime);
  }
  return [...imena];
}

mkdirSync(IZLAZ, { recursive: true });
const pregled = [];

for (const [oznaka, naslov, uvod, imena] of PAKETI) {
  const delovi = [];
  let ukupno = 0;
  let znakova = 0;

  for (const ns of imena) {
    const stavke = [...ravno(sr[ns], ns)];
    ukupno += stavke.length;
    znakova += stavke.reduce((z, [, v]) => z + v.length, 0);

    const red = [`### \`${ns}\` — ${OPIS[ns] ?? ""}`, ""];
    for (const [kljuc, tekst] of stavke) {
      const oznake = [];
      if (ZAKLJUCANI[kljuc]) oznake.push(`🔒 ${ZAKLJUCANI[kljuc]}`);
      const p = parametri(tekst);
      if (p.length) oznake.push("parametri: " + p.sort().map((x) => `\`{${x}}\``).join(", "));
      const sufiks = oznake.length ? `  \n  ↳ ${oznake.join(" · ")}` : "";
      red.push(`- \`${kljuc}\`  \n  „${tekst.replaceAll("\n", "⏎")}“${sufiks}`);
    }
    red.push("");
    delovi.push(red.join("\n"));
  }

  const dok = `# Provera tekstova — paket ${oznaka}: ${naslov}

${uvod}

**Obim:** ${ukupno} tekstova, ${znakova} znakova.

---

${KONTEKST}
---

${PRAVILA}
---

# Tekstovi

Ispod je svaki tekst sa svojim ključem. Prođi ih redom po ekranima.

${delovi.join("")}`;

  writeFileSync(path.join(IZLAZ, `paket-${oznaka}.md`), dok, "utf-8");
  pregled.push([oznaka, naslov, ukupno, znakova]);
}

for (const [o, n, k, z] of pregled) {
  console.log(`paket-${o}.md  ${n.padEnd(28)} ${String(k).padStart(4)} tekstova  ${String(z).padStart(6)} znakova`);
}
console.log("UKUPNO tekstova:", pregled.reduce((s, p) => s + p[2], 0));
