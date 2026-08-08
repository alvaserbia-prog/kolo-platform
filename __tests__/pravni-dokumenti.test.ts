/**
 * Čuvar kanonskog seta akata.
 *
 * Javne pravne stranice učitavaju markdown po IMENU FAJLA, a ime nosi verziju
 * (`Pravilnik_4_1_0.md`). Pri podizanju verzije seta lako je repointovati jednu
 * stranicu a drugu zaboraviti, ili preimenovati srpski original a ostaviti prevod
 * — loader tada tiho padne na srpski i čitalac na engleskom dobije stari tekst,
 * bez ijedne greške u logu.
 *
 * Ovaj test zato proverava tri stvari:
 *  1. svaki akt koji app traži postoji na SVA tri jezika (sr, en, ru);
 *  2. ključne odredbe verzije 4.1.0 su stvarno unutra, na svakom jeziku;
 *  3. ukinute odredbe (tabla zahteva za jemstvo) nisu preživele nigde.
 */
import { describe, it, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { ucitajPravniDokument } from "@/lib/pravni-dokument";

const BAZA = path.join(process.cwd(), "dokumentacija 4.1");
const JEZICI = ["sr", "en", "ru"] as const;

/** Svi akti koje javne stranice traže — mora se poklapati sa `page.tsx` referencama. */
const AKTI = [
  "Pravilnik_4_1_0.md",
  "dokaz_stvarnosti_4_1_0.md",
  "uslovi_koriscenja_4_1_0.md",
  "politika_4_1_0.md",
  "DPIA_4_1_0.md",
  "radnje_obrade_4_1_0.md",
  "statut_4_1_0.md",
  "whitepaper_4_1_0.md",
  "rizici_4_1_0.md",
  "hijerarhija_4_1_0.md",
  "donacije_4_1_0.md",
  "operativni_4_1_0.md",
  "osnivacki_4_1_0.md",
  "gornje_kolo_4_1_0.md",
  "programi_podrske_4_1_0.md",
];

/** Odredbe uvedene verzijom 4.1.0 — po jeziku, da fallback na srpski ne prođe neopaženo. */
const UVEDENO: Record<string, Record<string, string>> = {
  "Pravilnik_4_1_0.md": {
    sr: "### Član 40a",
    en: "### Article 40a",
    ru: "### Статья 40a",
  },
  "uslovi_koriscenja_4_1_0.md": {
    sr: "Oglas neverifikovanog korisnika",
    en: "Listing by an Unverified User",
    ru: "Объявление неверифицированного пользователя",
  },
};

/** Ukinute odredbe — ne smeju da prežive ni u jednom aktu, ni na jednom jeziku. */
const UKINUTO: Record<string, string[]> = {
  sr: ["tabli zahteva za jemstvo", "Tabla zahteva za jemstvo omogućava"],
  en: ["on the guarantee board", "The guarantee board enables"],
  ru: ["на доске запросов", "Доска запросов о поручительстве позволяет"],
};

/** Napomene o izmeni namerno pominju ukinutu tablu — one se izuzimaju iz provere. */
function bezNapomenaOIzmeni(tekst: string): string {
  return tekst
    .split("\n")
    .filter(
      (red) =>
        !red.includes("Napomena o izmeni") &&
        !red.includes("Note on the amendment") &&
        !red.includes("Примечание об изменении") &&
        !red.startsWith("| **Napomena** |") &&
        !red.startsWith("| **Note** |") &&
        !red.startsWith("| **Примечание** |"),
    )
    .join("\n");
}

describe("kanonski set akata 4.1.0", () => {
  it.each(AKTI)("%s postoji na sva tri jezika", async (akt) => {
    for (const jez of JEZICI) {
      const pod = jez === "sr" ? "" : `${jez}/`;
      await expect(
        fs.access(path.join(BAZA, pod + akt)),
        `nedostaje ${pod}${akt}`,
      ).resolves.toBeUndefined();
    }
  });

  it.each(AKTI)("%s se učita i nije prazan", async (akt) => {
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument(akt, jez);
      expect(tekst.length, `${jez}/${akt} je prekratak`).toBeGreaterThan(500);
    }
  });

  it("odredbe uvedene u 4.1.0 postoje na svakom jeziku", async () => {
    for (const [akt, poJeziku] of Object.entries(UVEDENO)) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        expect(tekst, `${jez}/${akt} nema „${poJeziku[jez]}"`).toContain(poJeziku[jez]);
      }
    }
  });

  it("ukinuta tabla zahteva za jemstvo ne postoji ni u jednom aktu", async () => {
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = bezNapomenaOIzmeni(await ucitajPravniDokument(akt, jez));
        for (const fraza of UKINUTO[jez]) {
          expect(tekst, `${jez}/${akt} još sadrži „${fraza}"`).not.toContain(fraza);
        }
      }
    }
  });

  it("unakrsne verzijske reference ne pokazuju na stari set", async () => {
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        // Statut ima sopstvenu numeraciju (v4.1) i ne prati verziju seta.
        expect(tekst, `${jez}/${akt} upućuje na v4.0.x`).not.toMatch(/\(v(?:erzija |ersion |ерсия )?4\.0\.[01]\)/);
      }
    }
  });
});
