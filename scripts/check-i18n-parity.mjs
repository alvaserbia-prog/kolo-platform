#!/usr/bin/env node
/**
 * Provera pariteta i18n ključeva: sr.json je izvor istine; en.json, hu.json i
 * (opciono) ostali moraju imati ISTE leaf ključeve — ni manje ni više.
 * Pada (exit 1) ako neki ključ nedostaje ili je višak. Pozvati iz CI i lokalno.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES = join(ROOT, "messages");
const IZVOR = "sr";
// sr-Cyrl nema fajl (transliteracija), ne proverava se.
// Namespace "admin" u ru.json OSTAJE srpski po odluci vlasnika; to ne remeti
// paritet jer se porede KLJUČEVI, ne vrednosti. NE dodavati izuzetke ovde —
// time bi se izgubila zaštita nad ostalim namespace-ovima.
const CILJEVI = ["en", "ru", "hr", "hu"];

function leafKeys(obj, prefix = "") {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys = keys.concat(leafKeys(v, prefix + k + "."));
    } else {
      keys.push(prefix + k);
    }
  }
  return keys;
}

function load(locale) {
  return JSON.parse(readFileSync(join(MESSAGES, `${locale}.json`), "utf8"));
}

function flat(locale) {
  const obj = load(locale);
  const out = {};
  for (const k of leafKeys(obj)) {
    out[k] = k.split(".").reduce((o, p) => o[p], obj);
  }
  return out;
}

/**
 * Vrednosti koje SMEJU biti iste kao engleske — nisu neprevedene, nego se ne
 * prevode: lična imena, nazivi brendova. Držati spisak kratkim; sve ostalo što
 * je identično engleskom je propušten prevod.
 */
const DOZVOLJENO_ISTO_KAO_EN = new Set([
  "oSistemu.topla_voda_citat_izvor",
  "oSistemu.margaret_izvor",
]);

/**
 * Namespace-ovi koji se NAMERNO ne prevode — vrednost mora da bude identična
 * srpskoj u svakom jeziku.
 *
 * `admin` = panel UO Fondacije: terminologija mora da prati akte (srpski
 * original), a UO radi na srpskom. Odluka vlasnika.
 *
 * Bez ove provere se pravilo tiho gubilo: paritet ključeva prolazi, provera
 * „ostalo na engleskom" ne pogađa prevod na hrvatski/ruski, pa je svaki nov
 * admin ekran ulazio preveden. Zatečeno stanje pre uvođenja: hr 162 prevedene
 * vrednosti (Lijevak, Vijesti, Financije…), en 382, ru 17 (ceo tab Levak).
 */
const SAMO_SRPSKI_NS = ["admin"];

const izvorKeys = new Set(leafKeys(load(IZVOR)));
const srV = flat(IZVOR);
const enV = flat("en");
let greske = 0;

for (const cilj of CILJEVI) {
  const ciljKeys = new Set(leafKeys(load(cilj)));
  const nedostaje = [...izvorKeys].filter((k) => !ciljKeys.has(k));
  const visak = [...ciljKeys].filter((k) => !izvorKeys.has(k));
  if (nedostaje.length || visak.length) {
    greske++;
    console.error(`\n✗ ${cilj}.json nije usklađen sa ${IZVOR}.json:`);
    if (nedostaje.length)
      console.error(`  Nedostaje (${nedostaje.length}): ${nedostaje.slice(0, 30).join(", ")}${nedostaje.length > 30 ? " …" : ""}`);
    if (visak.length)
      console.error(`  Višak (${visak.length}): ${visak.slice(0, 30).join(", ")}${visak.length > 30 ? " …" : ""}`);
  } else {
    console.log(`✓ ${cilj}.json — paritet OK (${ciljKeys.size} ključeva)`);
  }

  // Paritet ključeva NE hvata neprevedenu vrednost. Mađarski je tako godinu dana
  // vukao 893 engleske rečenice (34% fajla) uz „paritet OK" — ključ je postojao,
  // sadržaj je bio engleski. Vrednost identična engleskoj, a različita od srpske,
  // znači da je red prekopiran iz en.json i nikad preveden.
  if (cilj !== "en") {
    const ciljV = flat(cilj);
    const neprevedeno = [...ciljKeys].filter(
      (k) =>
        !DOZVOLJENO_ISTO_KAO_EN.has(k) &&
        typeof enV[k] === "string" &&
        ciljV[k] === enV[k] &&
        ciljV[k] !== srV[k],
    );
    if (neprevedeno.length) {
      greske++;
      console.error(
        `\n✗ ${cilj}.json — ${neprevedeno.length} vrednost(i) je ostalo na engleskom: ${neprevedeno.slice(0, 20).join(", ")}${neprevedeno.length > 20 ? " …" : ""}`,
      );
      console.error(`  Prevedi ih, ili dodaj u DOZVOLJENO_ISTO_KAO_EN ako se namerno ne prevode (imena, brendovi).`);
    }
  }

  // Obrnut smer: namespace koji NE sme da bude preveden.
  const ciljSve = flat(cilj);
  const prevedeno = [...ciljKeys].filter(
    (k) =>
      SAMO_SRPSKI_NS.some((ns) => k.startsWith(ns + ".")) &&
      typeof srV[k] === "string" &&
      ciljSve[k] !== srV[k],
  );
  if (prevedeno.length) {
    greske++;
    console.error(
      `\n✗ ${cilj}.json — ${prevedeno.length} vrednost(i) u [${SAMO_SRPSKI_NS.join(", ")}] je prevedeno, a ne sme: ${prevedeno.slice(0, 20).join(", ")}${prevedeno.length > 20 ? " …" : ""}`,
    );
    console.error(`  Prepiši srpsku vrednost iz ${IZVOR}.json (admin panel se ne prevodi — odluka vlasnika).`);
  }
}

if (greske) {
  console.error(`\n${greske} jezik(a) nije usklađeno. Dopuni/ukloni ključeve.`);
  process.exit(1);
}
console.log("\nSvi jezici usklađeni sa izvorom.");
