import { describe, it, expect } from "vitest";
import { izracunajPoenZaDonaciju, nivoZaKumulativ } from "@/lib/protokol/donacija";

describe("nivoZaKumulativ — 2 nivoa (prag 5.000 RSD)", () => {
  it("ispod praga 5.000 RSD → nivo 1, kurs 1,00", () => {
    expect(nivoZaKumulativ(0)).toEqual({ nivo: 1, kurs: 1.0 });
    expect(nivoZaKumulativ(2_000)).toEqual({ nivo: 1, kurs: 1.0 });
    expect(nivoZaKumulativ(4_999)).toEqual({ nivo: 1, kurs: 1.0 });
  });
  it("na pragu 5.000 RSD → nivo 2, kurs 1,10", () => {
    expect(nivoZaKumulativ(5_000)).toEqual({ nivo: 2, kurs: 1.1 });
  });
  it("preko praga → nivo 2, kurs 1,10", () => {
    expect(nivoZaKumulativ(5_000_000_000)).toEqual({ nivo: 2, kurs: 1.1 });
  });
});

describe("izracunajPoenZaDonaciju — koeficijentni model (2 nivoa)", () => {
  it("nivo 1: 1.000 RSD → kurs 1,00 → 1.000 POEN", () => {
    const r = izracunajPoenZaDonaciju(0, 1_000);
    expect(r).toMatchObject({ noviKumulativ: 1_000, noviNivo: 1, kurs: 1.0, poen: 1_000 });
  });

  it("nivo 1: tik ispod praga 4.999 RSD → kurs 1,00", () => {
    const r = izracunajPoenZaDonaciju(0, 4_999);
    expect(r.noviNivo).toBe(1);
    expect(r.kurs).toBe(1.0);
    expect(r.poen).toBe(4_999);
  });

  it("nivo 2: prva donacija 5.000 RSD → kurs 1,10 → 5.500 POEN", () => {
    const r = izracunajPoenZaDonaciju(0, 5_000);
    expect(r.noviNivo).toBe(2);
    expect(r.kurs).toBe(1.1);
    expect(r.poen).toBe(5_500);
  });

  it("koeficijent novog kumulativa se primenjuje na celu novu donaciju (prelaz praga)", () => {
    // dosad 3.000 (nivo 1), nova 4.000 → kumulativ 7.000 (nivo 2, kurs 1,10)
    const r = izracunajPoenZaDonaciju(3_000, 4_000);
    expect(r.noviKumulativ).toBe(7_000);
    expect(r.noviNivo).toBe(2);
    expect(r.poen).toBe(Math.round(4_000 * 1.1)); // 4.400
  });

  it("Math.round na nepravilnim iznosima", () => {
    // kumulativ 7.000 → nivo 2 (kurs 1,10); 3.333 × 1,10 = 3.666,3 → 3.666
    const r = izracunajPoenZaDonaciju(3_667, 3_333);
    expect(r.noviKumulativ).toBe(7_000);
    expect(r.noviNivo).toBe(2);
    expect(r.poen).toBe(3_666);
  });
});
