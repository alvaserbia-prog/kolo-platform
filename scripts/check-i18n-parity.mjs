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
// "hu" je ZAMRZNUT (neaktivan) — messages/hu.json se NE održava do pune integracije
// mađarskog (vidi src/i18n/routing.ts). Vratiti "hu" u listu kad se reaktivira.
const CILJEVI = ["en", "hr"];

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

const izvorKeys = new Set(leafKeys(load(IZVOR)));
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
}

if (greske) {
  console.error(`\n${greske} jezik(a) nije usklađeno. Dopuni/ukloni ključeve.`);
  process.exit(1);
}
console.log("\nSvi jezici usklađeni sa izvorom.");
