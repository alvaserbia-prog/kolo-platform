import { describe, it, expect } from "vitest";
import { preporukaNagrada } from "@/lib/banka/emisija";

describe("preporukaNagrada", () => {
  it("prvi preporučeni → 1.000 POEN", () => {
    expect(preporukaNagrada(1)).toBe(1_000);
  });

  it("5 preporučenih → 1.000 POEN (granica prvog nivoa)", () => {
    expect(preporukaNagrada(5)).toBe(1_000);
  });

  it("6 preporučenih → 2.000 POEN (drugi nivo)", () => {
    expect(preporukaNagrada(6)).toBe(2_000);
  });

  it("10 preporučenih → 2.000 POEN (granica drugog nivoa)", () => {
    expect(preporukaNagrada(10)).toBe(2_000);
  });

  it("50 preporučenih → 7.000 POEN", () => {
    expect(preporukaNagrada(50)).toBe(7_000);
  });

  it("100 preporučenih → 9.000 POEN", () => {
    expect(preporukaNagrada(100)).toBe(9_000);
  });

  it("101 preporučenih → 10.000 POEN (iznad 100)", () => {
    expect(preporukaNagrada(101)).toBe(10_000);
  });

  it("nagrada je uvek ceo broj", () => {
    for (const n of [1, 3, 7, 15, 25, 45, 75, 100, 500]) {
      expect(Number.isInteger(preporukaNagrada(n))).toBe(true);
    }
  });
});
