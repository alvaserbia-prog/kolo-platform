import { describe, it, expect } from "vitest";
import { izracunajBonusZaDonaciju } from "@/lib/banka/donacija";

describe("izracunajBonusZaDonaciju", () => {
  it("donacija ispod prvog praga (5.000 RSD) — nema bonusa", () => {
    const r = izracunajBonusZaDonaciju(0, 5_000);
    expect(r.ukupanBonus).toBe(0);
    expect(r.predjeniNivoi).toEqual([]);
    expect(r.noviNivo).toBe(0);
    expect(r.noviKumulativ).toBe(5_000);
  });

  it("nivo 1 — dostiže 10.000 RSD → 20.000 POEN", () => {
    const r = izracunajBonusZaDonaciju(0, 10_000);
    expect(r.ukupanBonus).toBe(20_000);
    expect(r.predjeniNivoi).toEqual([1]);
    expect(r.noviNivo).toBe(1);
  });

  it("nivo 2 — dostiže 20.000 RSD (od 12.000) → 30.000 POEN", () => {
    const r = izracunajBonusZaDonaciju(12_000, 8_000);
    expect(r.ukupanBonus).toBe(30_000);
    expect(r.predjeniNivoi).toEqual([2]);
  });

  it("prelazi više nivoa odjednom — od 0 do 50.000 → nivoi 1+2+3", () => {
    const r = izracunajBonusZaDonaciju(0, 50_000);
    expect(r.predjeniNivoi).toEqual([1, 2, 3]);
    expect(r.ukupanBonus).toBe(20_000 + 30_000 + 80_000); // 130.000
  });

  it("donacija 1.000.000 RSD od nule → svih 7 nivoa → 2.880.000 POEN", () => {
    const r = izracunajBonusZaDonaciju(0, 1_000_000);
    expect(r.predjeniNivoi).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(r.ukupanBonus).toBe(2_880_000);
    expect(r.noviNivo).toBe(7);
  });

  it("prag koji je već pređen se ne ponavlja", () => {
    // dosad 500.000 (svih 6 nivoa pređeno), nova donacija 600.000 → samo nivo 7
    const r = izracunajBonusZaDonaciju(500_000, 600_000);
    expect(r.predjeniNivoi).toEqual([7]);
    expect(r.ukupanBonus).toBe(1_500_000);
  });

  it("donacija iznad max praga (1.5M) — nema novih pragova", () => {
    const r = izracunajBonusZaDonaciju(1_000_000, 500_000);
    expect(r.ukupanBonus).toBe(0);
    expect(r.predjeniNivoi).toEqual([]);
    expect(r.noviNivo).toBe(7);
  });
});
