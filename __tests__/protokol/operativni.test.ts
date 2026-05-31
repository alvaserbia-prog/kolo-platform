import { describe, it, expect } from "vitest";
import { raspodelaKoeficijent, evidentiraniPoen } from "@/lib/protokol/programi";

// Pravilnik o operativnom doprinosu čl. 24:
//   evidentirani POEN = predloženi POEN × min(1, L/P)
//   P = zbir predloženih POEN-a svih potvrđenih verifikacija u periodu
//   L = dnevni limit

describe("raspodelaKoeficijent (min(1, L/P))", () => {
  it("P ≤ L → koeficijent 1 (pun predloženi iznos)", () => {
    expect(raspodelaKoeficijent(50_000, 100_000)).toBe(1);
    expect(raspodelaKoeficijent(100_000, 100_000)).toBe(1);
  });

  it("P > L → koeficijent L/P (srazmerno smanjenje)", () => {
    expect(raspodelaKoeficijent(120_000, 100_000)).toBeCloseTo(100_000 / 120_000, 10);
    expect(raspodelaKoeficijent(200_000, 100_000)).toBe(0.5);
  });

  it("limit 0 → koeficijent 1 (nema opticaja, guard)", () => {
    expect(raspodelaKoeficijent(50_000, 0)).toBe(1);
  });

  it("nema potražnje → koeficijent 1", () => {
    expect(raspodelaKoeficijent(0, 100_000)).toBe(1);
  });
});

describe("evidentiraniPoen (predloženi × koeficijent, Math.floor)", () => {
  it("koeficijent 1 → pun predloženi iznos", () => {
    expect(evidentiraniPoen(9000, 1)).toBe(9000);
  });

  it("srazmeran udeo se zaokružuje naniže (u korist Protokola)", () => {
    // koef = 100000/120000 = 0.8333..., 60000 × koef = 50000
    const koef = raspodelaKoeficijent(120_000, 100_000);
    expect(evidentiraniPoen(60_000, koef)).toBe(50_000);
  });

  it("nikad ne premašuje predloženi (koef ≤ 1)", () => {
    const koef = raspodelaKoeficijent(150_000, 100_000);
    expect(evidentiraniPoen(10_000, koef)).toBeLessThanOrEqual(10_000);
  });

  it("rezultat je uvek ceo broj", () => {
    const koef = raspodelaKoeficijent(7, 3); // 3/7
    expect(Number.isInteger(evidentiraniPoen(5, koef))).toBe(true);
  });
});

describe("raspodela ne premašuje dnevni limit (čl. 23 — tvrd limit)", () => {
  it("zbir svih evidentiranih ≤ L kada P > L", () => {
    const limit = 100_000;
    const predlozeni = [60_000, 60_000, 30_000]; // P = 150_000 > L
    const P = predlozeni.reduce((s, x) => s + x, 0);
    const koef = raspodelaKoeficijent(P, limit);
    const zbir = predlozeni.reduce((s, x) => s + evidentiraniPoen(x, koef), 0);
    expect(zbir).toBeLessThanOrEqual(limit);
  });

  it("kada P ≤ L svako dobija pun predloženi iznos", () => {
    const limit = 100_000;
    const predlozeni = [20_000, 30_000, 10_000]; // P = 60_000 ≤ L
    const P = predlozeni.reduce((s, x) => s + x, 0);
    const koef = raspodelaKoeficijent(P, limit);
    const evid = predlozeni.map((x) => evidentiraniPoen(x, koef));
    expect(evid).toEqual(predlozeni);
  });
});
