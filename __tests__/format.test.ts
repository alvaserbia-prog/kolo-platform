import { describe, it, expect } from "vitest";
import { intlTag, fmtBroj, fmtDatum } from "@/lib/format";
import { routing } from "@/i18n/routing";

/**
 * Jezik koji nedostaje u `TAG` mapi ne pravi grešku nego tiho pada na srpski
 * format — `hr` i `hu` su tako od 2026-08-06 prikazivali srpski poređan datum.
 * Isti tip propusta kao u `ekran-poruke.ts`; ova provera ga zaključava.
 */
describe("formatiranje po jeziku", () => {
  it.each([...routing.locales])("%s ima sopstvenu Intl oznaku", (locale) => {
    // Pad na srpski se prepoznaje po tome što oznaka nije za taj jezik.
    const tag = intlTag(locale);
    const koren = locale.split("-")[0];
    expect(tag.startsWith(koren), `${locale} → ${tag}`).toBe(true);
  });

  it("nepoznat jezik pada na srpsku latinicu", () => {
    expect(intlTag("xx")).toBe("sr-Latn-RS");
  });

  it("razdvajač hiljada se razlikuje po jeziku", () => {
    expect(fmtBroj(1234567, "sr")).toBe("1.234.567");
    expect(fmtBroj(1234567, "en")).toBe("1,234,567");
  });

  /**
   * Mađarski poređa datum obrnuto od srpskog (godina prva) — po tome se vidi da
   * mapa radi, a ne da se tiho vratila na srpski.
   */
  it("mađarski datum počinje godinom, srpski danom", () => {
    const dan = new Date("2026-08-18T10:00:00Z");
    expect(fmtDatum(dan, "hu")).toMatch(/^2026/);
    expect(fmtDatum(dan, "sr")).toMatch(/^18/);
    expect(fmtDatum(dan, "hr")).toMatch(/^18/);
  });
});
