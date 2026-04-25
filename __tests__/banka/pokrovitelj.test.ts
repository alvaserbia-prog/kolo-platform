import { describe, it, expect } from "vitest";
import { bonusZaNivo, izracunajNivo } from "@/lib/protokol/pokrovitelj";

// Fiksna tabela 7 nivoa:
// Nivo 1: prag 10.000 RSD → 20.000 POEN
// Nivo 2: prag 20.000 RSD → 30.000 POEN
// Nivo 3: prag 50.000 RSD → 80.000 POEN
// Nivo 4: prag 100.000 RSD → 150.000 POEN
// Nivo 5: prag 200.000 RSD → 300.000 POEN
// Nivo 6: prag 500.000 RSD → 800.000 POEN
// Nivo 7: prag 1.000.000 RSD → 1.500.000 POEN

describe("bonusZaNivo", () => {
  it("nivo 0 → 0 POEN", () => {
    expect(bonusZaNivo(0)).toBe(0);
  });

  it("nivo 1 → 20.000 POEN", () => {
    expect(bonusZaNivo(1)).toBe(20_000);
  });

  it("nivo 2 → 30.000 POEN", () => {
    expect(bonusZaNivo(2)).toBe(30_000);
  });

  it("nivo 3 → 80.000 POEN", () => {
    expect(bonusZaNivo(3)).toBe(80_000);
  });

  it("nivo 4 → 150.000 POEN", () => {
    expect(bonusZaNivo(4)).toBe(150_000);
  });

  it("nivo 5 → 300.000 POEN", () => {
    expect(bonusZaNivo(5)).toBe(300_000);
  });

  it("nivo 6 → 800.000 POEN", () => {
    expect(bonusZaNivo(6)).toBe(800_000);
  });

  it("nivo 7 → 1.500.000 POEN", () => {
    expect(bonusZaNivo(7)).toBe(1_500_000);
  });

  it("nivo 8 (van tabele) → 0 POEN", () => {
    expect(bonusZaNivo(8)).toBe(0);
  });

  it("bonus je uvek ceo broj", () => {
    for (let n = 1; n <= 7; n++) {
      expect(Number.isInteger(bonusZaNivo(n))).toBe(true);
    }
  });
});

describe("izracunajNivo", () => {
  it("kumulativ 0 RSD → nivo 0", () => {
    expect(izracunajNivo(0, 0)).toBe(0);
  });

  it("kumulativ ispod prvog praga (9.999 RSD) → nivo 0", () => {
    expect(izracunajNivo(9_999, 0)).toBe(0);
  });

  it("kumulativ 10.000 RSD → nivo 1", () => {
    expect(izracunajNivo(10_000, 0)).toBe(1);
  });

  it("kumulativ 19.999 RSD → nivo 1", () => {
    expect(izracunajNivo(19_999, 0)).toBe(1);
  });

  it("kumulativ 20.000 RSD → nivo 2", () => {
    expect(izracunajNivo(20_000, 0)).toBe(2);
  });

  it("kumulativ 50.000 RSD → nivo 3", () => {
    expect(izracunajNivo(50_000, 0)).toBe(3);
  });

  it("kumulativ 100.000 RSD → nivo 4", () => {
    expect(izracunajNivo(100_000, 0)).toBe(4);
  });

  it("kumulativ 200.000 RSD → nivo 5", () => {
    expect(izracunajNivo(200_000, 0)).toBe(5);
  });

  it("kumulativ 500.000 RSD → nivo 6", () => {
    expect(izracunajNivo(500_000, 0)).toBe(6);
  });

  it("kumulativ 1.000.000 RSD → nivo 7", () => {
    expect(izracunajNivo(1_000_000, 0)).toBe(7);
  });

  it("nivo nikad ne opada (max sa trenutnim)", () => {
    expect(izracunajNivo(10_000, 5)).toBe(5);
  });

  it("skok više nivoa odjednom — 600.000 RSD od 0", () => {
    // prelazi pragove: 10k(n1), 20k(n2), 50k(n3), 100k(n4), 200k(n5), 500k(n6) → nivo 6
    expect(izracunajNivo(600_000, 0)).toBe(6);
  });
});
