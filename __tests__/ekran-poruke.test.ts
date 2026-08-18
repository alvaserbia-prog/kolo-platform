/**
 * Sistemski ekrani (pad sistema, održavanje, 404) NE idu kroz `next-intl` —
 * prikazuju se upravo kad aplikacija ne radi, pa tekst mora da postoji i bez
 * provajdera prevoda. Cena toga je da paritet jezika niko ne čuva sam od sebe.
 *
 * Fajl je i sam tražio ovaj test — komentar iznad `EkranJezik` kaže „isti spisak
 * kao src/i18n/routing.ts; kad se tamo doda jezik, dodati i ovde". Kad su hr i
 * hu dodati (2026-08-09), ovde nisu — pa su Hrvat i Mađar na 404 stranici osam
 * meseci dobijali srpski, tiho, jer `normalizujJezik` nepoznat jezik svede na
 * „sr" umesto da pukne.
 */
import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";
import {
  PAD_SISTEMA,
  ODRZAVANJE,
  NEMA_STRANICE,
  normalizujJezik,
  htmlLang,
  type EkranJezik,
} from "@/lib/ekran-poruke";

const SKUPOVI = { PAD_SISTEMA, ODRZAVANJE, NEMA_STRANICE };

describe("sistemski ekrani pokrivaju sve jezike aplikacije", () => {
  it.each(Object.keys(SKUPOVI))("%s ima svaki locale iz routing.ts", (ime) => {
    const skup = SKUPOVI[ime as keyof typeof SKUPOVI];
    const nedostaje = routing.locales.filter((l) => !(l in skup));
    expect(nedostaje, `nedostaju jezici u ${ime}`).toEqual([]);
  });

  it.each(Object.keys(SKUPOVI))("%s nema prazan naslov ni telo", (ime) => {
    const skup = SKUPOVI[ime as keyof typeof SKUPOVI];
    for (const [jezik, tekst] of Object.entries(skup)) {
      expect(tekst.naslov.trim(), `${ime}.${jezik}.naslov`).not.toBe("");
      expect(tekst.telo.trim(), `${ime}.${jezik}.telo`).not.toBe("");
      expect(tekst.pocetna.trim(), `${ime}.${jezik}.pocetna`).not.toBe("");
    }
  });

  it("normalizujJezik prihvata svaki locale, a nepoznat svodi na srpski", () => {
    for (const l of routing.locales) expect(normalizujJezik(l)).toBe(l);
    expect(normalizujJezik("de")).toBe("sr");
    expect(normalizujJezik(undefined)).toBe("sr");
  });

  it("htmlLang daje zaseban kod za svaki jezik osim srpskih pisama", () => {
    // Obe srpske varijante su isti jezik — razlikuje ih pismo, ne `lang`.
    expect(htmlLang("sr")).toBe("sr");
    expect(htmlLang("sr-Cyrl" as EkranJezik)).toBe("sr");
    for (const l of ["en", "ru", "hr", "hu"] as EkranJezik[]) expect(htmlLang(l)).toBe(l);
  });
});
