/**
 * Regresivni testovi za Fazu A kritičnih ispravki Pravilnika v3.7.0.
 *
 * Ne pogađaju bazu — samo proveravaju konstante, čiste funkcije i izvozni API.
 * Za testove koji zahtevaju bazu (DELETE /api/profil, NOSILAC_ZRNA verifikacija,
 * automatska aktivacija Faze 2) trebaju integracioni testovi sa mock Prisma-om
 * ili test bazom.
 */
import { describe, it, expect } from "vitest";
import { MINIMUM_POEN_ZA_UPIS_ZRNA, UKUPNO_ZRNA, glasackaMoc } from "@/lib/protokol/zrno";
import { PRAG_FAZE_2_POEN } from "@/lib/protokol/faza-sistema";
import {
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
  POEN_NADZORNIK,
  izracunajIndeks,
  MAX_INDEKS,
  PRIRAST_INDEKSA_PO_VERIFIKACIJI,
} from "@/lib/protokol/dokaz-stvarnosti";

describe("A1 — Minimum POEN za upis ZRNA (čl. 19 Pravilnika v3.7.0)", () => {
  it("MINIMUM_POEN_ZA_UPIS_ZRNA = 20.000", () => {
    expect(MINIMUM_POEN_ZA_UPIS_ZRNA).toBe(20_000);
  });

  it("nije više 10.000 (stara vrednost koja je narušavala Pravilnik)", () => {
    expect(MINIMUM_POEN_ZA_UPIS_ZRNA).not.toBe(10_000);
  });
});

describe("Glava IV — ZRNO obračunski okvir (čl. 18, 46)", () => {
  it("UKUPNO_ZRNA = 1.000.000 fiksno (čl. 18)", () => {
    expect(UKUPNO_ZRNA).toBe(1_000_000);
  });

  it("kvadratno glasanje (čl. 46): 100 aktivnih ZRNA → 10 glasova", () => {
    expect(glasackaMoc(100)).toBe(10);
    expect(glasackaMoc(10_000)).toBe(100);
    expect(glasackaMoc(1)).toBe(1);
  });

  it("kvadratno glasanje: 0 ili negativno → 0", () => {
    expect(glasackaMoc(0)).toBe(0);
    expect(glasackaMoc(-5)).toBe(0);
  });

  it("kvadratno glasanje: zaokružuje naniže (čl. 46)", () => {
    expect(glasackaMoc(99)).toBe(9); // sqrt(99) = 9.94
    expect(glasackaMoc(50)).toBe(7); // sqrt(50) = 7.07
  });
});

describe("A5 — Prag prelaza Faze 1 → Faze 2 (čl. 42, 44)", () => {
  it("PRAG_FAZE_2_POEN = 1.000.000", () => {
    expect(PRAG_FAZE_2_POEN).toBe(1_000_000);
  });
});

describe("A3 — POEN konstante pri verifikaciji (čl. 7 Pravilnika o dokazu stvarnosti)", () => {
  it("POEN_VERIFIKATOR = 1.000 (skida se pri brisanju verifikovanog)", () => {
    expect(POEN_VERIFIKATOR).toBe(1_000);
  });

  it("POEN_VERIFIKOVANI = 1.000 (skida se pri brisanju verifikatora)", () => {
    expect(POEN_VERIFIKOVANI).toBe(1_000);
  });

  it("POEN_NADZORNIK = 500 (skida se pri brisanju strane u verifikaciji pod nadzorom)", () => {
    expect(POEN_NADZORNIK).toBe(500);
  });
});

describe("A3 — izracunajIndeks (reizračun pri brisanju veza)", () => {
  it("0 veza → indeks 0 (verifikovani se vraća u NEVERIFIKOVAN)", () => {
    expect(izracunajIndeks(0)).toBe(0);
  });

  it("1 veza → indeks 10 (čl. 3 — funkcionalni prag)", () => {
    expect(izracunajIndeks(1)).toBe(10);
  });

  it("10 veza → indeks 100 (cap)", () => {
    expect(izracunajIndeks(10)).toBe(100);
  });

  it("ne prelazi MAX_INDEKS (čl. 3 st. 2)", () => {
    expect(izracunajIndeks(50)).toBe(MAX_INDEKS);
    expect(MAX_INDEKS).toBe(100);
  });

  it("svaka veza daje PRIRAST_INDEKSA_PO_VERIFIKACIJI", () => {
    expect(PRIRAST_INDEKSA_PO_VERIFIKACIJI).toBe(10);
  });

  it("brisanjem jedne veze indeks pada za 10 (osim cap-a)", () => {
    // 5 → 4 veza: indeks pada sa 50 na 40
    expect(izracunajIndeks(5) - izracunajIndeks(4)).toBe(10);
    // 1 → 0 veza: indeks pada sa 10 na 0
    expect(izracunajIndeks(1) - izracunajIndeks(0)).toBe(10);
  });

  it("negativan broj → indeks 0 (defenzivno)", () => {
    expect(izracunajIndeks(-1)).toBe(0);
  });
});
