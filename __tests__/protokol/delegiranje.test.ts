import { describe, it, expect } from "vitest";
import { razresiGlasackuMoc } from "@/lib/protokol/zrno";

// Pomoćni konstruktori
const N = (pairs: [string, string][]) => new Map(pairs);
const B = (pairs: [string, number][]) => new Map(pairs);

describe("razresiGlasackuMoc — tranzitivno delegiranje + krugovi", () => {
  it("bez delegacija: svako glasa svojom moći", () => {
    const next = N([]);
    const baza = B([["A", 5], ["B", 3]]);
    expect(razresiGlasackuMoc(next, baza, "A")).toBe(5);
    expect(razresiGlasackuMoc(next, baza, "B")).toBe(3);
  });

  it("ko je delegirao nema sopstveni glas", () => {
    const next = N([["A", "B"]]);
    const baza = B([["A", 5], ["B", 3]]);
    expect(razresiGlasackuMoc(next, baza, "A")).toBe(0);
  });

  it("delegat dobija sopstvenu + delegiranu moć", () => {
    const next = N([["A", "B"]]);
    const baza = B([["A", 5], ["B", 3]]);
    expect(razresiGlasackuMoc(next, baza, "B")).toBe(8);
  });

  it("lanac je tranzitivan: A→B→C, sva moć ide na C", () => {
    const next = N([["A", "B"], ["B", "C"]]);
    const baza = B([["A", 5], ["B", 3], ["C", 2]]);
    expect(razresiGlasackuMoc(next, baza, "C")).toBe(10); // 2 + 3 + 5
    expect(razresiGlasackuMoc(next, baza, "B")).toBe(0);
    expect(razresiGlasackuMoc(next, baza, "A")).toBe(0);
  });

  it("duboki lanac (više nivoa) se prosleđuje do kraja", () => {
    const next = N([["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"]]);
    const baza = B([["A", 1], ["B", 1], ["C", 1], ["D", 1], ["E", 1]]);
    expect(razresiGlasackuMoc(next, baza, "E")).toBe(5);
  });

  it("krug: A→B→C→A — niko od njih nema pravo glasa", () => {
    const next = N([["A", "B"], ["B", "C"], ["C", "A"]]);
    const baza = B([["A", 5], ["B", 3], ["C", 2]]);
    expect(razresiGlasackuMoc(next, baza, "A")).toBe(0);
    expect(razresiGlasackuMoc(next, baza, "B")).toBe(0);
    expect(razresiGlasackuMoc(next, baza, "C")).toBe(0);
  });

  it("ko delegira U krug — moć mu propada, terminal je van toka", () => {
    // X→A, a A→B→A je krug. X nema glas; krug nema glas; niko ne skuplja X-ovu moć.
    const next = N([["X", "A"], ["A", "B"], ["B", "A"]]);
    const baza = B([["X", 9], ["A", 4], ["B", 1]]);
    expect(razresiGlasackuMoc(next, baza, "X")).toBe(0);
    expect(razresiGlasackuMoc(next, baza, "A")).toBe(0);
    expect(razresiGlasackuMoc(next, baza, "B")).toBe(0);
  });

  it("dva odvojena lanca ka istom delegatu", () => {
    const next = N([["A", "C"], ["B", "C"]]);
    const baza = B([["A", 2], ["B", 3], ["C", 1]]);
    expect(razresiGlasackuMoc(next, baza, "C")).toBe(6); // 1 + 2 + 3
  });
});
