import { describe, it, expect } from "vitest";
import {
  izracunajTezinu,
  primeniGornjuGranicu,
  procenaPredlozenog,
} from "@/lib/protokol/zadaci";
import {
  koeficijentRaspodele,
  evidentiraniIznos,
} from "@/lib/protokol/programi";

// ─── izracunajTezinu ───────────────────────────────────────────────────────────

describe("izracunajTezinu", () => {
  it("PO_SATU: 5 sati × 2000 = 10000", () => {
    expect(izracunajTezinu({ mod: "PO_SATU", sati: 5, stopaPoSatu: 2000 })).toBe(10_000);
  });

  it("PO_SATU bez sati → 0", () => {
    expect(izracunajTezinu({ mod: "PO_SATU", sati: null, stopaPoSatu: 2000 })).toBe(0);
  });

  it("PO_SATU bez stope → 0", () => {
    expect(izracunajTezinu({ mod: "PO_SATU", sati: 4, stopaPoSatu: null })).toBe(0);
  });

  it("U_CELOSTI: vraća fiksni iznos", () => {
    expect(izracunajTezinu({ mod: "U_CELOSTI", iznosUCelosti: 15_000 })).toBe(15_000);
  });

  it("U_CELOSTI bez iznosa → 0", () => {
    expect(izracunajTezinu({ mod: "U_CELOSTI", iznosUCelosti: null })).toBe(0);
  });

  it("U_CELOSTI ignoriše sate/stopu", () => {
    expect(
      izracunajTezinu({ mod: "U_CELOSTI", sati: 8, stopaPoSatu: 2500, iznosUCelosti: 5_000 })
    ).toBe(5_000);
  });
});

// ─── primeniGornjuGranicu ──────────────────────────────────────────────────────

describe("primeniGornjuGranicu", () => {
  it("ispod granice → nepromenjeno", () => {
    expect(primeniGornjuGranicu(8_000, 10_000)).toBe(8_000);
  });

  it("iznad granice → srezano na granicu", () => {
    expect(primeniGornjuGranicu(12_000, 10_000)).toBe(10_000);
  });

  it("granica null → nepromenjeno", () => {
    expect(primeniGornjuGranicu(50_000, null)).toBe(50_000);
  });

  it("granica 0 → tretira se kao bez granice", () => {
    expect(primeniGornjuGranicu(50_000, 0)).toBe(50_000);
  });
});

// ─── procenaPredlozenog ────────────────────────────────────────────────────────

describe("procenaPredlozenog", () => {
  it("PO_SATU: maxSati × stopa", () => {
    expect(procenaPredlozenog({ mod: "PO_SATU", maxSati: 8, stopaPoSatu: 2000 })).toBe(16_000);
  });

  it("PO_SATU bez maxSati → default 8", () => {
    expect(procenaPredlozenog({ mod: "PO_SATU", stopaPoSatu: 1000 })).toBe(8_000);
  });

  it("U_CELOSTI: vraća iznosUCelosti", () => {
    expect(procenaPredlozenog({ mod: "U_CELOSTI", iznosUCelosti: 30_000 })).toBe(30_000);
  });
});

// ─── koeficijentRaspodele / evidentiraniIznos (zajednički bazen, čl. 24) ────────

describe("koeficijentRaspodele", () => {
  it("tražnja ispod limita → koeficijent 1.0", () => {
    expect(koeficijentRaspodele(5_000, 10_000)).toBe(1.0);
  });

  it("tražnja jednaka limitu → 1.0", () => {
    expect(koeficijentRaspodele(10_000, 10_000)).toBe(1.0);
  });

  it("tražnja iznad limita → L/P", () => {
    expect(koeficijentRaspodele(20_000, 10_000)).toBe(0.5);
  });

  it("limit 0 → 1.0 (nema srezivanja)", () => {
    expect(koeficijentRaspodele(20_000, 0)).toBe(1.0);
  });
});

describe("evidentiraniIznos", () => {
  it("pun koeficijent → ceo iznos", () => {
    expect(evidentiraniIznos(8_000, 1.0)).toBe(8_000);
  });

  it("srezano na pola → floor", () => {
    expect(evidentiraniIznos(8_001, 0.5)).toBe(4_000); // 4000.5 → floor 4000
  });

  it("uvek ceo broj", () => {
    expect(Number.isInteger(evidentiraniIznos(12_345, 0.37))).toBe(true);
  });
});

// ─── Integracija formule (čl. 24): predloženi × min(1, L/P) ────────────────────

describe("raspodela — formula iz čl. 24", () => {
  it("dve verifikacije iznad limita dele proporcionalno", () => {
    // P = 30000, L = 15000 → koef 0.5
    const items = [10_000, 20_000];
    const P = items.reduce((s, x) => s + x, 0);
    const L = 15_000;
    const koef = koeficijentRaspodele(P, L);
    const emitovano = items.map((x) => evidentiraniIznos(x, koef));
    expect(emitovano).toEqual([5_000, 10_000]);
    expect(emitovano[0] + emitovano[1]).toBeLessThanOrEqual(L);
  });
});
