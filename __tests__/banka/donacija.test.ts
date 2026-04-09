import { describe, it, expect } from "vitest";
import { nivoZaKumulativ, izracunajPoenZaDonaciju } from "@/lib/banka/donacija";

describe("nivoZaKumulativ", () => {
  it("0 RSD → nivo 1, kurs 1.00", () => {
    const r = nivoZaKumulativ(0);
    expect(r.nivo).toBe(1);
    expect(r.kurs).toBe(1.00);
  });

  it("2.000 RSD → nivo 1 (granica)", () => {
    expect(nivoZaKumulativ(2_000).nivo).toBe(1);
  });

  it("2.001 RSD → nivo 2, kurs 1.10", () => {
    const r = nivoZaKumulativ(2_001);
    expect(r.nivo).toBe(2);
    expect(r.kurs).toBe(1.10);
  });

  it("100.000 RSD → nivo 6, kurs 1.50", () => {
    const r = nivoZaKumulativ(100_000);
    expect(r.nivo).toBe(6);
    expect(r.kurs).toBe(1.50);
  });

  it("500.001.000 RSD (iznad max praga) → nivo 18, kurs 5.00", () => {
    const r = nivoZaKumulativ(500_001_000);
    expect(r.nivo).toBe(18);
    expect(r.kurs).toBe(5.00);
  });
});

describe("izracunajPoenZaDonaciju", () => {
  it("prva donacija 1.000 RSD (dosad 0) → kurs 1.00 → 1.000 POEN", () => {
    const r = izracunajPoenZaDonaciju(0, 1_000);
    expect(r.poen).toBe(1_000);
    expect(r.kurs).toBe(1.00);
    expect(r.nivo).toBe(1);
    expect(r.noviKumulativ).toBe(1_000);
  });

  it("donacija prelazi prag → važi NOVI kurs na celu donaciju", () => {
    // dosad 1.900 RSD, nova donacija 200 RSD → kumulativ 2.100 → nivo 2 (kurs 1.10)
    const r = izracunajPoenZaDonaciju(1_900, 200);
    expect(r.noviKumulativ).toBe(2_100);
    expect(r.kurs).toBe(1.10);
    expect(r.poen).toBe(Math.round(200 * 1.10)); // 220
  });

  it("POEN je uvek ceo broj (Math.round)", () => {
    // 3.000 RSD pri kursu 1.10 = 3300.0 — tačno
    const r = izracunajPoenZaDonaciju(0, 3_000);
    expect(Number.isInteger(r.poen)).toBe(true);
  });

  it("zaokruživanje — Math.round ne Math.floor", () => {
    // 1 RSD × kurs 1.10 = 1.1 → Math.round → 1, Math.floor → 1 (isti)
    // 5 RSD × kurs 1.10 = 5.5 → Math.round → 6, Math.floor → 5
    const r = izracunajPoenZaDonaciju(1_900, 5);
    // noviKumulativ = 1905, nivo 1 (≤2000), kurs 1.00
    // Ovde je kurs 1.00 pa je 5 * 1.00 = 5
    expect(r.poen).toBe(5);
  });

  it("velika donacija — nivo 18 (kurs 5.00)", () => {
    const r = izracunajPoenZaDonaciju(500_000_000, 10_000);
    expect(r.kurs).toBe(5.00);
    expect(r.poen).toBe(50_000);
  });

  it("noviKumulativ = dosad + nova", () => {
    const r = izracunajPoenZaDonaciju(50_000, 30_000);
    expect(r.noviKumulativ).toBe(80_000);
  });
});
