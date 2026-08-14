import { describe, it, expect } from "vitest";
import {
  PAD_SISTEMA,
  ODRZAVANJE,
  NEMA_STRANICE,
  JEZICI,
  normalizujJezik,
  htmlLang,
  type EkranJezik,
} from "@/lib/ekran-poruke";
import { routing } from "@/i18n/routing";

/**
 * Sistemski ekrani (pad sistema, održavanje, 404) NISU u `messages/*.json` —
 * namerno, jer se prikazuju kad `next-intl` provider ne postoji. Zato ih ne
 * pokriva ni `scripts/check-i18n-parity.mjs` ni `faq-paritet.test.ts`, pa je
 * jezik koji nedostaje umeo da prođe neopaženo: `routing.ts` je od 2026-08-06
 * imao `hr` i `hu`, a `EkranJezik` ih nije, pa je `normalizujJezik()` oba
 * vraćao na "sr" — Hrvat i Mađar su na padu sistema i na 404 dobijali srpski.
 *
 * Ova provera zaključava tri stvari: spisak jezika prati `routing.ts`, nijedan
 * tekst nije prazan, i nijedan nije ostao na srpskom.
 */
const EKRANI = {
  "pad sistema": PAD_SISTEMA,
  "održavanje": ODRZAVANJE,
  "404": NEMA_STRANICE,
} as const;

/** `dugme` je prazno svuda osim na padu sistema — vidi komentar uz `ODRZAVANJE`. */
const POLJA = ["oznaka", "naslov", "telo", "dopuna", "pocetna"] as const;

describe("sistemski ekrani", () => {
  it("pokrivaju iste jezike kao routing.ts", () => {
    expect([...JEZICI].sort()).toEqual([...routing.locales].sort());
  });

  it.each(Object.entries(EKRANI))("%s ima sve jezike", (_naziv, ekran) => {
    expect(Object.keys(ekran).sort()).toEqual([...JEZICI].sort());
  });

  it.each(Object.entries(EKRANI))("%s nema prazno polje", (naziv, ekran) => {
    for (const jezik of JEZICI) {
      for (const polje of POLJA) {
        expect(ekran[jezik][polje].trim(), `${naziv} / ${jezik} / ${polje}`).not.toBe("");
      }
    }
  });

  it("dugme postoji samo na padu sistema (ostali ekrani nemaju reset())", () => {
    for (const jezik of JEZICI) {
      expect(PAD_SISTEMA[jezik].dugme.trim()).not.toBe("");
      expect(ODRZAVANJE[jezik].dugme).toBe("");
      expect(NEMA_STRANICE[jezik].dugme).toBe("");
    }
  });

  /**
   * Prevod koji je ostao srpski se ne vidi kao greška, pa se traži doslovno.
   * Reči su birane tako da postoje u srpskom tekstu ekrana, a ne u tačnom
   * prevodu na taj jezik — „dostupan" npr. postoji i u hrvatskom, pa nije ovde.
   */
  const SRPSKI_TRAG: Partial<Record<EkranJezik, RegExp>> = {
    en: /[čćšžđ]|Molimo|zapisi|sistem/i,
    // ђ ј љ њ ћ џ postoje u srpskoj ćirilici, a ne u ruskoj azbuci; latinica
    // duža od tri znaka bi značila da je ostao tekst sa latinicom.
    ru: /[јљњћђџ]|[a-z]{4}/i,
    hr: /sistema|u toku|bezbedn|ponovo\b|promenjena/i,
    hu: /[čćšž]|Molimo|zapisi|sustav/i,
  };

  it.each(Object.entries(SRPSKI_TRAG))("%s nije ostao na srpskom", (jezik, obrazac) => {
    for (const [naziv, ekran] of Object.entries(EKRANI)) {
      for (const polje of POLJA) {
        const tekst = ekran[jezik as EkranJezik][polje];
        // "KOLO" je naziv sistema i ostaje latinicom na svakom jeziku.
        expect(tekst.replace(/KOLO/g, ""), `${naziv} / ${jezik} / ${polje}`).not.toMatch(
          obrazac as RegExp,
        );
      }
    }
  });

  it("nepoznat jezik pada na srpski, poznat se zadržava", () => {
    expect(normalizujJezik("xx")).toBe("sr");
    expect(normalizujJezik(undefined)).toBe("sr");
    for (const jezik of JEZICI) expect(normalizujJezik(jezik)).toBe(jezik);
  });

  it("htmlLang daje važeću oznaku jezika, ćirilica ostaje sr", () => {
    expect(htmlLang("sr-Cyrl")).toBe("sr");
    expect(htmlLang("sr")).toBe("sr");
    expect(htmlLang("hr")).toBe("hr");
    expect(htmlLang("hu")).toBe("hu");
    expect(htmlLang("en")).toBe("en");
    expect(htmlLang("ru")).toBe("ru");
  });
});
