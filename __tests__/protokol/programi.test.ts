import { describe, it, expect } from "vitest";
import {
  izracunajMajke,
  izracunajStariji,
  izracunajDnevniIznos,
} from "@/lib/protokol/programi";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function datumPre(godinaUnazad: number, danas = new Date("2026-04-09")): string {
  const d = new Date(danas);
  d.setFullYear(d.getFullYear() - godinaUnazad);
  return d.toISOString();
}

const DANAS = new Date("2026-04-09");

// ─── izracunajMajke ───────────────────────────────────────────────────────────

describe("izracunajMajke", () => {
  it("nema dece → 0", () => {
    expect(izracunajMajke({ deca: [] }, DANAS)).toBe(0);
  });

  it("null metadata → 0", () => {
    expect(izracunajMajke(null, DANAS)).toBe(0);
  });

  it("jedno dete, 0 godina → baza 2000 × koef 1.0 = 2000", () => {
    const meta = { deca: [{ ime: "Ana", datumRodjenja: datumPre(0) }] };
    expect(izracunajMajke(meta, DANAS)).toBe(2_000);
  });

  it("jedno dete, 10 godina → baza (2000 - 1000) × 1.0 = 1000", () => {
    const meta = { deca: [{ ime: "Ana", datumRodjenja: datumPre(10) }] };
    expect(izracunajMajke(meta, DANAS)).toBe(1_000);
  });

  it("dete starije od 20 godina se ne računa", () => {
    const meta = { deca: [{ ime: "Ana", datumRodjenja: datumPre(20) }] };
    expect(izracunajMajke(meta, DANAS)).toBe(0);
  });

  it("dva deteta — koeficijenti 1.0 i 1.2", () => {
    const meta = {
      deca: [
        { ime: "Ana", datumRodjenja: datumPre(0) },  // 2000 × 1.0 = 2000
        { ime: "Ivo", datumRodjenja: datumPre(0) },  // 2000 × 1.2 = 2400
      ],
    };
    expect(izracunajMajke(meta, DANAS)).toBe(4_400);
  });

  it("četvoro i više dece — četvrto+ ima koef 2.0", () => {
    const deca = Array.from({ length: 4 }, (_, i) => ({
      ime: `Dete${i}`,
      datumRodjenja: datumPre(0),
    }));
    const meta = { deca };
    // 2000×1.0 + 2000×1.2 + 2000×1.5 + 2000×2.0 = 2000+2400+3000+4000 = 11400
    expect(izracunajMajke(meta, DANAS)).toBe(11_400);
  });

  it("iznos je uvek ceo broj (Math.floor u kodu)", () => {
    const meta = { deca: [{ ime: "Ana", datumRodjenja: datumPre(3) }] };
    const r = izracunajMajke(meta, DANAS);
    expect(Number.isInteger(r)).toBe(true);
  });
});

// ─── izracunajStariji ─────────────────────────────────────────────────────────

describe("izracunajStariji", () => {
  it("null metadata → 0", () => {
    expect(izracunajStariji(null, DANAS)).toBe(0);
  });

  it("ispod 50 godina → 0", () => {
    const meta = { datumRodjenja: datumPre(49) };
    expect(izracunajStariji(meta, DANAS)).toBe(0);
  });

  it("tačno 50 godina → 1000 POEN (bazni)", () => {
    const meta = { datumRodjenja: datumPre(50) };
    expect(izracunajStariji(meta, DANAS)).toBe(1_000);
  });

  it("55 godina → 1000 + 5×100 = 1500 POEN", () => {
    const meta = { datumRodjenja: datumPre(55) };
    expect(izracunajStariji(meta, DANAS)).toBe(1_500);
  });

  it("70 godina → 1000 + 20×100 = 3000 POEN", () => {
    const meta = { datumRodjenja: datumPre(70) };
    expect(izracunajStariji(meta, DANAS)).toBe(3_000);
  });

  it("iznos je uvek ceo broj", () => {
    for (const god of [50, 60, 75, 90]) {
      expect(Number.isInteger(izracunajStariji({ datumRodjenja: datumPre(god) }, DANAS))).toBe(true);
    }
  });
});

// ─── izracunajDnevniIznos ─────────────────────────────────────────────────────

describe("izracunajDnevniIznos", () => {
  it("POSEBNA_BRIGA uvek 2000 POEN", () => {
    expect(izracunajDnevniIznos("POSEBNA_BRIGA", null, null, DANAS)).toBe(2_000);
  });

  it("SKOLOVANJE → dailyAmount (admin podešava)", () => {
    expect(izracunajDnevniIznos("SKOLOVANJE", null, 1_500, DANAS)).toBe(1_500);
  });

  it("SKOLOVANJE bez dailyAmount → 0", () => {
    expect(izracunajDnevniIznos("SKOLOVANJE", null, null, DANAS)).toBe(0);
  });

  it("ZAPOSLJAVNJE → uvek 0 (ide kroz evidenciju)", () => {
    expect(izracunajDnevniIznos("PED", null, 5_000, DANAS)).toBe(0);
  });

  it("PODRSKA_MAJKAMA delegira na izracunajMajke", () => {
    const meta = { deca: [{ ime: "Ana", datumRodjenja: datumPre(0) }] };
    expect(izracunajDnevniIznos("PODRSKA_MAJKAMA", meta, null, DANAS)).toBe(2_000);
  });

  it("PODRSKA_STARIJIMA delegira na izracunajStariji", () => {
    const meta = { datumRodjenja: datumPre(50) };
    expect(izracunajDnevniIznos("PODRSKA_STARIJIMA", meta, null, DANAS)).toBe(1_000);
  });
});
