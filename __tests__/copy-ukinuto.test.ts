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
  sr: [/tabl[aeiou]\s+(zahteva\s+za\s+)?jemstv/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jemstva/i, /mrež[aeiu]\s+jemstva/i, /graf[au]?\s+jemstva/i],
  hr: [/ploč[aeiu]\s+(zahtjeva\s+za\s+)?jamstv/i, /kartic[aeiou]\s+prepoznavanja/i, /lanc[aeu]\s+jamstva/i, /graf[au]?\s+jamstva/i],
  en: [/(guarantee|vouching)\s+(request\s+)?board/i, /recognition\s+card/i, /vouching\s+(chain|network|graph)/i],
  ru: [/доск[аеиу]\s+(запросов\s+о\s+)?поручительств/i, /карточк[ауи]\s+узнавания/i, /цепочк[аеиу]\s+поручительства/i, /граф[ае]?\s+поручительства/i],
  hu: [/kezességi\s+(kérelmek\s+)?tábl/i, /felismerési\s+kártya/i, /kezességi\s+(lánc|gráf)/i],
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

/**
 * Terminologija „verifikacija → potvrda" (2026-08-10).
 *
 * Institut se u interfejsu zove POTVRDA, a poznavanje je njegov osnov, ne ime
 * („potvrdi nekoga koga poznaješ"). Reč „verifikacija" nije anglicizam nego
 * latinizam standardan u srpskom pravnom jeziku — zato OSTAJE u aktima, gde
 * se meri odgovornost, i izlazi samo iz copy-ja, gde se govori čoveku.
 *
 * Imenica za ulogu se NE uvodi: „potvrđivač potvrđuje" muca, pa se svuda gde
 * je stajao „verifikator" imenuje prava uloga — „tvoj lanac" u socijalnim
 * programima, „nosilac ZRNA" u operativnom doprinosu.
 *
 * Ovo NIJE provera akata: `dokumentacija 4.1/` i dalje govori „verifikacija"
 * i to je namerno (vidi `pravni-dokumenti.test.ts`).
 */
const DOZVOLJENO_U_COPYJU = [
  /\{(?:ne)?verif\w*\}/i, // promenljive koje kod ubacuje: {verifikator}, {verifikovani}, {verif}
  /verifikacijaId/, // ime polja u poruci o grešci
];

const STARA_TERMINOLOGIJA: Record<string, RegExp> = {
  sr: /verifik/i,
  hr: /verifik|verificir/i,
  en: /\bverif/i,
  ru: /верифи/i,
  hu: /hitelesít/i,
};

describe("copy govori o potvrdi, ne o verifikaciji", () => {
  it.each(Object.keys(STARA_TERMINOLOGIJA))("messages/%s.json", async (jezik) => {
    const sirovo = await fs.readFile(path.join(KOREN, "messages", `${jezik}.json`), "utf-8");
    const pogodci: string[] = [];

    for (const [kljuc, tekst] of stringovi(JSON.parse(sirovo))) {
      if (!STARA_TERMINOLOGIJA[jezik].test(tekst)) continue;
      // Skini dozvoljene ostatke pa proveri ima li još nečega.
      let ostatak = tekst;
      for (const dozvoljen of DOZVOLJENO_U_COPYJU) {
        ostatak = ostatak.replace(new RegExp(dozvoljen.source, "gi"), "");
      }
      if (STARA_TERMINOLOGIJA[jezik].test(ostatak)) pogodci.push(`${kljuc}: ${tekst.slice(0, 120)}`);
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
    expect(
      STARA_TERMINOLOGIJA[jezik].test(tekst),
      `${fajl} i dalje govori „verifikacija" umesto „potvrda"`,
    ).toBe(false);
  });
});

/**
 * POEN nije novac — ni u imenu ekrana, ni u glagolu (2026-08-11).
 *
 * Dve izmene koje ovaj blok čuva:
 *
 * 1. Ekran se zove POEN, ne Novčanik. Novčanik je posuda za novac, a POEN
 *    postoji isključivo kao zapis u Protokolu (Pravilnik čl. 12) — nema
 *    nosioca i ne drži se. Ime je birano po simetriji sa stavkom ZRNO i zato
 *    je isto na svih pet jezika. Najgori je bio prevod: `Pénztárca` doslovno
 *    sadrži `pénz` = novac.
 *
 * 2. UPIS i PREPIS nisu isto. Kroz kanale iz čl. 15 POEN NASTAJE — Protokol
 *    ide u minus za isti iznos, ukupan broj POEN-a raste; to je „upis".
 *    Između dva korisnika POEN NE nastaje — jedan zapis se umanjuje, drugi
 *    uvećava, zbir ostaje isti; to je „prepis". Dok su obe operacije nosile
 *    reč „upis", iz interfejsa se nije videlo kad sistem stvara POEN a kad ga
 *    samo premešta.
 *
 * Doslovan prevod „prepisa" se NE koristi: `transcription`, `prijepis` i
 * `переписывание` u prvom značenju znače KOPIJU, a kopija ostavlja original
 * na mestu — tačno suprotno od zero-suma. Zato en ide na `re-register`
 * (upis na drugo ime u registru), a mađarski na `átírás`, koji taj posao
 * već obavlja u sopstvenom registru (prepis vozila, nekretnine).
 */
const NOVAC_U_IMENU: Record<string, RegExp> = {
  sr: /novčanik/i,
  hr: /novčanik/i,
  en: /\bwallet/i,
  ru: /кошел/i,
  hu: /pénztárc|tárcá|tárca/i,
};

/** Ključevi kojima se imenuje prepis — moraju nositi koren prepisa, ne upisa. */
const KLJUCEVI_PREPISA = ["header.upisi_poen", "profil.upisi_poen", "novcanik.posalji_poen", "novcanik.send_naslov", "novcanik.send_dugme"];

const KOREN_PREPISA: Record<string, RegExp> = {
  sr: /prepi[sš]/i,
  hr: /prepi[sš]/i,
  en: /re-register/i,
  ru: /перепис/i,
  hu: /átír/i,
};

function uzmi(podaci: unknown, kljuc: string): string | undefined {
  let cur: unknown = podaci;
  for (const deo of kljuc.split(".")) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[deo];
  }
  return typeof cur === "string" ? cur : undefined;
}

describe("POEN nije novac", () => {
  it.each(Object.keys(NOVAC_U_IMENU))("messages/%s.json ne imenuje novčanik", async (jezik) => {
    const sirovo = await fs.readFile(path.join(KOREN, "messages", `${jezik}.json`), "utf-8");
    const pogodci: string[] = [];

    for (const [kljuc, tekst] of stringovi(JSON.parse(sirovo))) {
      if (NOVAC_U_IMENU[jezik].test(tekst)) pogodci.push(`${kljuc}: ${tekst.slice(0, 120)}`);
    }

    expect(pogodci).toEqual([]);
  });

  it.each(Object.keys(KOREN_PREPISA))("messages/%s.json razlikuje prepis od upisa", async (jezik) => {
    const podaci = JSON.parse(await fs.readFile(path.join(KOREN, "messages", `${jezik}.json`), "utf-8"));

    for (const kljuc of KLJUCEVI_PREPISA) {
      const tekst = uzmi(podaci, kljuc);
      expect(tekst, `nema ključa ${kljuc}`).toBeTypeOf("string");
      expect(KOREN_PREPISA[jezik].test(tekst!), `${kljuc} = "${tekst}" — prenos POEN-a je prepis, ne upis`).toBe(true);
    }

    // Napomena uz obrazac gasi dva pogrešna čitanja reči „prepis": prenos
    // svojine („prepisati kuću") i kopiju. Bez nje reč radi protiv sistema.
    expect(uzmi(podaci, "novcanik.send_napomena")).toBeTypeOf("string");
  });
});
