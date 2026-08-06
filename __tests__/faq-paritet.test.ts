import { describe, it, expect } from "vitest";
import { FAQ_SEKCIJE, getFaqSekcije, getFaqPoBrojevima } from "@/lib/faq-data";

/**
 * FAQ nije u `messages/*.json`, pa ga `scripts/check-i18n-parity.mjs` NE pokriva.
 * Bez ove provere prevod može tiho da izgubi pitanje: `getFaqPoBrojevima` bira po
 * `id`, pa bi pitanje sa promašenim brojem nestalo sa stranica koje ga ubacuju
 * (npr. „kako funkcioniše"), i to samo na jednom jeziku.
 */
const JEZICI = ["en", "hr", "ru", "hu"];

const potpis = (sekcije: ReturnType<typeof getFaqSekcije>) => ({
  sekcije: sekcije.map((s) => s.id),
  pitanja: sekcije.flatMap((s) => s.pitanja.map((p) => p.id)),
});

const izvor = potpis(FAQ_SEKCIJE);

describe("FAQ paritet sa srpskim originalom", () => {
  it.each(JEZICI)("%s ima iste sekcije i iste brojeve pitanja", (jezik) => {
    expect(potpis(getFaqSekcije(jezik))).toEqual(izvor);
  });

  it.each(JEZICI)("%s nema prazno pitanje ili odgovor", (jezik) => {
    for (const s of getFaqSekcije(jezik)) {
      expect(s.naslov.trim()).not.toBe("");
      for (const p of s.pitanja) {
        expect(p.pitanje.trim(), `${jezik} #${p.id} pitanje`).not.toBe("");
        expect(p.odgovor.trim(), `${jezik} #${p.id} odgovor`).not.toBe("");
      }
    }
  });

  it("nepoznat jezik pada na srpski", () => {
    expect(getFaqSekcije("xx")).toBe(FAQ_SEKCIJE);
    expect(getFaqSekcije("sr-Cyrl")).toBe(FAQ_SEKCIJE);
  });

  it("getFaqPoBrojevima vraća isti broj pitanja na svakom jeziku", () => {
    const trazeni = [42, 1, 7, 34];
    for (const jezik of ["sr", ...JEZICI]) {
      expect(getFaqPoBrojevima(trazeni, jezik).map((p) => p.id)).toEqual(trazeni);
    }
  });
});
