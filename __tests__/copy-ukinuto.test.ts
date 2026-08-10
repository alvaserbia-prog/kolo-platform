import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Ukinuti instituti ne smeju da prežive u copy-ju.
 *
 * Tabla zahteva za jemstvo ukinuta je 2026-08-09 (Pravilnik 4.1.1 čl. 32 st. 4).
 * Rute, komponente i podaci su obrisani istog dana — ali je TEKST ostao, pa je
 * onboarding mesecima slao nove korisnike na dugme koje ne postoji, a FAQ 42 je
 * opisivao karticu prepoznavanja kao put do verifikacije.
 *
 * Preživelo je zato što je `pravni-dokumenti.test.ts` (pravilo UKINUTO) gledao
 * SAMO akte u `dokumentacija 4.1/`. Copy nije gledao niko. Ovaj test pokriva tu
 * rupu: `messages/*.json` i `src/lib/faq-data*.ts`.
 *
 * Ko ubuduće ukida institut, dopunjava ZABRANJENO svojim izrazima na svih pet
 * jezika — inače ukidanje ostaje pola posla.
 */

const KOREN = process.cwd();

/**
 * Namespace stranice-objašnjenja („Tabla zahteva za jemstvo više ne postoji").
 * Ona SME da imenuje ukinuti institut — to joj je jedini posao, jer stari
 * linkovi iz notifikacija i mejlova i dalje vode na `/tabla-jemstva`.
 */
const IZUZETI_NAMESPACE = new Set(["tablaJemstva"]);

/**
 * Uz ukinutu tablu, ovde stoji i ukinuta TERMINOLOGIJA: od 4.2.1 institut se
 * zove „lanac potvrda", ne „lanac jemstva". Razlika nije stilska — jemstvo je
 * obavezivanje za tuđe buduće ispunjenje, a verifikator tvrdi činjenicu koja
 * u tom trenutku jeste ili nije istinita. Bez ove provere se stara reč vraća
 * prvom izmenom copy-ja, jer je u prevodima nosi pet različitih korena.
 */
const ZABRANJENO: Record<string, RegExp[]> = {
  sr: [/tabl[aeiou]\s+(zahteva\s+za\s+)?jemstv/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jemstva/i, /mrež[aeiu]\s+jemstva/i],
  hr: [/ploč[aeiu]\s+(zahtjeva\s+za\s+)?jamstv/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jamstva/i],
  en: [/(guarantee|vouching)\s+(request\s+)?board/i, /recognition\s+card/i, /vouching\s+(chain|network)/i],
  ru: [/доск[аеиу]\s+(запросов\s+о\s+)?поручительств/i, /карточк[ауи]\s+узнавания/i, /цепочк[аеиу]\s+поручительства/i],
  hu: [/kezességi\s+(kérelmek\s+)?tábl/i, /felismerési\s+kártya/i, /kezességi\s+lánc/i],
};

/** Svaki string u prevodima, sa punom putanjom ključa. */
function* stringovi(v: unknown, put: string[] = []): Generator<[string, string]> {
  if (typeof v === "string") {
    yield [put.join("."), v];
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, dete] of Object.entries(v as Record<string, unknown>)) {
      if (put.length === 0 && IZUZETI_NAMESPACE.has(k)) continue;
      yield* stringovi(dete, [...put, k]);
    }
  }
}

describe("ukinuti instituti ne žive u copy-ju", () => {
  it.each(Object.keys(ZABRANJENO))("messages/%s.json", async (jezik) => {
    const sirovo = await fs.readFile(path.join(KOREN, "messages", `${jezik}.json`), "utf-8");
    const pogodci: string[] = [];

    for (const [kljuc, tekst] of stringovi(JSON.parse(sirovo))) {
      for (const obrazac of ZABRANJENO[jezik]) {
        if (obrazac.test(tekst)) pogodci.push(`${kljuc}: ${tekst.slice(0, 120)}`);
      }
    }

    expect(pogodci).toEqual([]);
  });

  it.each([
    ["sr", "faq-data.ts"],
    ["en", "faq-data-en.ts"],
    ["ru", "faq-data-ru.ts"],
    ["hr", "faq-data-hr.ts"],
    ["hu", "faq-data-hu.ts"],
  ])("src/lib/%s → %s", async (jezik, fajl) => {
    const tekst = await fs.readFile(path.join(KOREN, "src", "lib", fajl), "utf-8");

    for (const obrazac of ZABRANJENO[jezik]) {
      expect(obrazac.test(tekst), `${fajl} sadrži ukinut institut: ${obrazac}`).toBe(false);
    }
  });
});
