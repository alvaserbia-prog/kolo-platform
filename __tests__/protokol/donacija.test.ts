import { describe, it, expect } from "vitest";
import { izracunajPoenZaDonaciju, nivoZaKumulativ } from "@/lib/protokol/donacija";

describe("nivoZaKumulativ", () => {
  it("ispod praga 5.000 RSD → nivo 1, kurs 1,00 (bez nivoa 0)", () => {
    expect(nivoZaKumulativ(0)).toEqual({ nivo: 1, kurs: 1.0 });
    expect(nivoZaKumulativ(1_000)).toEqual({ nivo: 1, kurs: 1.0 });
    expect(nivoZaKumulativ(4_999)).toEqual({ nivo: 1, kurs: 1.0 });
  });
  it("na pragu 5.000 RSD → nivo 2, kurs 1,10", () => {
    expect(nivoZaKumulativ(5_000)).toEqual({ nivo: 2, kurs: 1.1 });
  });
  it("110.000 RSD → nivo 6, kurs 1,50", () => {
    expect(nivoZaKumulativ(110_000)).toEqual({ nivo: 6, kurs: 1.5 });
  });
  it("nivo 11 (5.000.000) → kurs 2,00", () => {
    expect(nivoZaKumulativ(5_000_000)).toEqual({ nivo: 11, kurs: 2.0 });
  });

  /**
   * 🔴 Tabela se od 2026-09-08 NASTAVLJA BEZ KRAJA (odluka vlasnika) — pragovi
   * idu nizom 1–2–5, koeficijent +0,10 po nivou. Ranije je nivo 11 bio plafon,
   * pa je donacija od pedeset miliona nosila isti koeficijent kao od pet.
   */
  it("nastavlja se iznad nivoa 11, nizom 1–2–5", () => {
    expect(nivoZaKumulativ(10_000_000)).toEqual({ nivo: 12, kurs: 2.1 });
    expect(nivoZaKumulativ(20_000_000)).toEqual({ nivo: 13, kurs: 2.2 });
    expect(nivoZaKumulativ(50_000_000)).toEqual({ nivo: 14, kurs: 2.3 });
    expect(nivoZaKumulativ(100_000_000)).toEqual({ nivo: 15, kurs: 2.4 });
  });

  it("nema plafona — veći iznos nikad ne daje manji koeficijent", () => {
    let prethodni = 0;
    for (const k of [0, 5_000, 1e6, 5e6, 1e7, 1e9, 1e12]) {
      const { kurs } = nivoZaKumulativ(k);
      expect(kurs).toBeGreaterThanOrEqual(prethodni);
      prethodni = kurs;
    }
  });

  it("koeficijent pada na čistu stotinku i za visoke nivoe", () => {
    expect(nivoZaKumulativ(5_000_000).kurs).toBe(2);
    const visok = nivoZaKumulativ(1e15).kurs;
    expect(visok * 100).toBeCloseTo(Math.round(visok * 100), 6);
  });

  it("beskonačan i besmislen unos pada na nivo 1, bez vrtenja u petlji", () => {
    expect(nivoZaKumulativ(Number.POSITIVE_INFINITY)).toEqual({ nivo: 1, kurs: 1.0 });
    expect(nivoZaKumulativ(Number.NaN)).toEqual({ nivo: 1, kurs: 1.0 });
    expect(nivoZaKumulativ(-5)).toEqual({ nivo: 1, kurs: 1.0 });
  });
});

describe("izracunajPoenZaDonaciju — koeficijentni model (čl. 4)", () => {
  it("nivo 1: 1.000 RSD → kurs 1,00 → 1.000 POEN", () => {
    const r = izracunajPoenZaDonaciju(0, 1_000);
    expect(r).toMatchObject({ noviKumulativ: 1_000, noviNivo: 1, kurs: 1.0, poen: 1_000 });
  });

  it("nivo 2: prva donacija 5.000 RSD → kurs 1,10 → 5.500 POEN", () => {
    const r = izracunajPoenZaDonaciju(0, 5_000);
    expect(r.noviNivo).toBe(2);
    expect(r.kurs).toBe(1.1);
    expect(r.poen).toBe(5_500);
  });

  it("nivo 3: prva donacija 10.000 RSD → kurs 1,20 → 12.000 POEN", () => {
    const r = izracunajPoenZaDonaciju(0, 10_000);
    expect(r.noviNivo).toBe(3);
    expect(r.poen).toBe(12_000);
  });

  it("nivo 9: prva donacija 1.000.000 RSD → kurs 1,80 → 1.800.000 POEN", () => {
    const r = izracunajPoenZaDonaciju(0, 1_000_000);
    expect(r.noviNivo).toBe(9);
    expect(r.poen).toBe(1_800_000);
  });

  it("koeficijent novog kumulativa se primenjuje na celu novu donaciju", () => {
    // dosad 50.000 (nivo 5), nova 60.000 → kumulativ 110.000 (nivo 6, kurs 1,50)
    const r = izracunajPoenZaDonaciju(50_000, 60_000);
    expect(r.noviKumulativ).toBe(110_000);
    expect(r.noviNivo).toBe(6);
    expect(r.poen).toBe(Math.round(60_000 * 1.5)); // 90.000
  });

  it("Math.round na nepravilnim iznosima", () => {
    // kumulativ 7.000 → nivo 2 (kurs 1,10); 3.333 × 1,10 = 3.666,3 → 3.666
    const r = izracunajPoenZaDonaciju(3_667, 3_333);
    expect(r.noviKumulativ).toBe(7_000);
    expect(r.noviNivo).toBe(2);
    expect(r.poen).toBe(3_666);
  });
});
