import { describe, it, expect } from "vitest";
import { bonusZaNivo, izracunajNivo } from "@/lib/banka/pokrovitelj";

// Pragovi po 1-2-5 skali: 50k, 100k, 200k, 500k, 1M, 2M, 5M, 10M, 20M, 50M, 100M...
describe("bonusZaNivo", () => {
  it("nivo 0 → 0 POEN", () => {
    expect(bonusZaNivo(0)).toBe(0);
  });

  it("nivo 1 (prvi doprinos) → 20.000 POEN", () => {
    expect(bonusZaNivo(1)).toBe(20_000);
  });

  it("nivo 2 (prag 50k RSD) → 50.000 POEN", () => {
    expect(bonusZaNivo(2)).toBe(50_000);
  });

  it("nivo 3 (prag 100k RSD) → 100.000 POEN", () => {
    expect(bonusZaNivo(3)).toBe(100_000);
  });

  it("nivo 4 (prag 200k RSD) → 200.000 POEN", () => {
    expect(bonusZaNivo(4)).toBe(200_000);
  });

  it("nivo 5 (prag 500k RSD) → 500.000 POEN", () => {
    expect(bonusZaNivo(5)).toBe(500_000);
  });

  it("nivo 6 (prag 1M RSD) → 1.000.000 POEN", () => {
    expect(bonusZaNivo(6)).toBe(1_000_000);
  });

  it("bonus je uvek ceo broj", () => {
    for (let n = 1; n <= 10; n++) {
      expect(Number.isInteger(bonusZaNivo(n))).toBe(true);
    }
  });
});

describe("izracunajNivo", () => {
  it("izracunajNivo uvek vraća minimum 1 (dostignuti počinje od 1)", () => {
    // Funkcija uvek vraća >= 1 jer dostignuti startuje na 1
    expect(izracunajNivo(0, 0)).toBe(1);
  });

  it("prvi doprinos ispod prvog praga (50k) → nivo 1", () => {
    expect(izracunajNivo(1, 1)).toBe(1);
    expect(izracunajNivo(49_999, 1)).toBe(1);
  });

  it("kumulativ 50.000 RSD → nivo 2", () => {
    expect(izracunajNivo(50_000, 1)).toBe(2);
  });

  it("kumulativ 100.000 RSD → nivo 3", () => {
    expect(izracunajNivo(100_000, 1)).toBe(3);
  });

  it("kumulativ 200.000 RSD → nivo 4", () => {
    expect(izracunajNivo(200_000, 1)).toBe(4);
  });

  it("kumulativ 500.000 RSD → nivo 5", () => {
    expect(izracunajNivo(500_000, 1)).toBe(5);
  });

  it("kumulativ 1.000.000 RSD → nivo 6", () => {
    expect(izracunajNivo(1_000_000, 1)).toBe(6);
  });

  it("nivo nikad ne opada (max sa trenutnim)", () => {
    // ako je neki bio nivo 5, sa manjim kumulativom ne sme pasti
    expect(izracunajNivo(10_000, 5)).toBe(5);
  });

  it("skok više nivoa odjednom — 600.000 RSD od 0", () => {
    // prelazi pragove: 50k(n2), 100k(n3), 200k(n4), 500k(n5) → nivo 5
    expect(izracunajNivo(600_000, 1)).toBe(5);
  });
});
