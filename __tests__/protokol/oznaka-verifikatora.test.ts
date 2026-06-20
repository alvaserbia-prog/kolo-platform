/**
 * Testovi za normalizaciju oznake verifikatora (dopuna 3.9.1).
 * Čista funkcija — ne pogađa bazu.
 */
import { describe, it, expect } from "vitest";
import { normalizujOznaku, MAX_OZNAKA_DUZINA } from "@/lib/protokol/verifikacija-service";

describe("normalizujOznaku", () => {
  it("trimuje i sažima razmake", () => {
    expect(normalizujOznaku("  Pera   sa pijace  ")).toBe("Pera sa pijace");
  });

  it("prazan/whitespace string → null (briše oznaku)", () => {
    expect(normalizujOznaku("")).toBeNull();
    expect(normalizujOznaku("   ")).toBeNull();
    expect(normalizujOznaku("\t\n")).toBeNull();
  });

  it("ne-string ulaz → null", () => {
    expect(normalizujOznaku(undefined)).toBeNull();
    expect(normalizujOznaku(null)).toBeNull();
    expect(normalizujOznaku(123)).toBeNull();
  });

  it("seče na MAX_OZNAKA_DUZINA", () => {
    const dugacko = "a".repeat(MAX_OZNAKA_DUZINA + 50);
    const rez = normalizujOznaku(dugacko);
    expect(rez).not.toBeNull();
    expect(rez!.length).toBe(MAX_OZNAKA_DUZINA);
  });

  it("zadržava običan nadimak nepromenjen", () => {
    expect(normalizujOznaku("Komšija Žika")).toBe("Komšija Žika");
  });
});
