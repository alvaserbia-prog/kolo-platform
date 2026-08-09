/**
 * Nadzor verifikacija i nadoknada — čiste funkcije.
 *
 * Osnov: Pravilnik o dokazu stvarnosti 4.2.0, čl. 11, 20a, 20b i 20c.
 */
import { describe, it, expect } from "vitest";
import {
  RAZLOZI,
  SUBJEKTI,
  ISHODI,
  jeSumnja,
  dopunjavaSlot,
  validirajIshod,
} from "@/lib/nadzor-pravila";
import {
  podelaTereta,
  jeNadoknada,
  iznosNadoknade,
  raspolozivo,
} from "@/lib/protokol/nadoknada";

describe("ishod nadzora (čl. 11)", () => {
  it("slot dopunjava ISKLJUČIVO ishod „uredno“", () => {
    expect(dopunjavaSlot("UREDNO")).toBe(true);
    expect(dopunjavaSlot("ZA_PROVERU")).toBe(false);
    expect(dopunjavaSlot("SPORNO")).toBe(false);
  });

  it("sumnju izražavaju „za proveru“ i „sporno“, ne i „uredno“", () => {
    expect(jeSumnja("ZA_PROVERU")).toBe(true);
    expect(jeSumnja("SPORNO")).toBe(true);
    expect(jeSumnja("UREDNO")).toBe(false);
  });

  it("„uredno“ prolazi bez obrazloženja", () => {
    expect(validirajIshod({ ishod: "UREDNO" }).ok).toBe(true);
  });

  it("uz sumnju su subjekt i razlog obavezni — bez njih predmet nema šta da kaže UO", () => {
    for (const ishod of ["ZA_PROVERU", "SPORNO"]) {
      expect(validirajIshod({ ishod }).ok).toBe(false);
      expect(validirajIshod({ ishod, subjekt: "VERIFIKATOR" }).ok).toBe(false);
      expect(validirajIshod({ ishod, razlog: "ne_poznaju_se" }).ok).toBe(false);
      expect(
        validirajIshod({ ishod, subjekt: "VERIFIKATOR", razlog: "ne_poznaju_se" }).ok
      ).toBe(true);
    }
  });

  it("razlog i subjekt moraju biti sa zatvorene liste", () => {
    expect(
      validirajIshod({ ishod: "SPORNO", subjekt: "VERIFIKATOR", razlog: "izmisljeno" }).ok
    ).toBe(false);
    expect(
      validirajIshod({ ishod: "SPORNO", subjekt: "NEKO_TRECI", razlog: "ne_poznaju_se" }).ok
    ).toBe(false);
  });

  it("razlog „ostalo“ traži kratak opis", () => {
    const bez = validirajIshod({ ishod: "SPORNO", subjekt: "OBA", razlog: "ostalo" });
    expect(bez.ok).toBe(false);
    const prazan = validirajIshod({
      ishod: "SPORNO",
      subjekt: "OBA",
      razlog: "ostalo",
      opis: "   ",
    });
    expect(prazan.ok).toBe(false);
    const sa = validirajIshod({
      ishod: "SPORNO",
      subjekt: "OBA",
      razlog: "ostalo",
      opis: "isti telefon na dva naloga",
    });
    expect(sa.ok).toBe(true);
  });

  it("nepoznat ishod se odbija", () => {
    expect(validirajIshod({ ishod: "POTVRDJENO" }).ok).toBe(false);
  });

  it("šifarnik ostaje zatvoren i stabilan", () => {
    expect(ISHODI).toEqual(["UREDNO", "ZA_PROVERU", "SPORNO"]);
    expect(SUBJEKTI).toEqual(["VERIFIKATOR", "VERIFIKOVANI", "OBA", "DEO_MREZE"]);
    expect(RAZLOZI).toContain("prijava_verifikovanog");
    expect(RAZLOZI).toHaveLength(6);
  });
});

describe("nadoknada (čl. 20b, 20c)", () => {
  it("ko ima dovoljno, snosi ceo iznos sam", () => {
    expect(podelaTereta(5000, 1000)).toEqual({ saKorisnika: 1000, naVerifikatora: 0 });
  });

  it("ko nema dovoljno, ide najviše do nule — ostatak na verifikatora", () => {
    // Lažni nalog je od 1.000 potrošio 700: skida mu se 300, a 700 prelazi na
    // verifikatora. Tih 700 je tačno vrednost robe izvučene iz mreže.
    expect(podelaTereta(300, 1000)).toEqual({ saKorisnika: 300, naVerifikatora: 700 });
  });

  it("prazan zapis ne ide u minus — ceo teret nosi verifikator", () => {
    expect(podelaTereta(0, 1000)).toEqual({ saKorisnika: 0, naVerifikatora: 1000 });
  });

  it("ko je već u nadoknadi, ne plaća dvaput", () => {
    // Bez ovoga bi jedno poništenje gurnulo isti dug drugi put.
    expect(podelaTereta(-500, 1000)).toEqual({ saKorisnika: 0, naVerifikatora: 1000 });
  });

  it("zbir podele je uvek jednak poništenom iznosu — zero-sum se ne kvari", () => {
    for (const stanje of [-900, -1, 0, 1, 499, 500, 999, 1000, 12345]) {
      for (const iznos of [500, 1000]) {
        const p = podelaTereta(stanje, iznos);
        expect(p.saKorisnika + p.naVerifikatora).toBe(iznos);
        expect(p.saKorisnika).toBeGreaterThanOrEqual(0);
        expect(p.naVerifikatora).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("nulti i negativni iznos ne rade ništa", () => {
    expect(podelaTereta(100, 0)).toEqual({ saKorisnika: 0, naVerifikatora: 0 });
    expect(podelaTereta(100, -5)).toEqual({ saKorisnika: 0, naVerifikatora: 0 });
  });

  it("minus jeste nadoknada, a nula i plus nisu", () => {
    expect(jeNadoknada(-1)).toBe(true);
    expect(jeNadoknada(0)).toBe(false);
    expect(jeNadoknada(10)).toBe(false);
    expect(iznosNadoknade(-700)).toBe(700);
    expect(iznosNadoknade(0)).toBe(0);
    expect(iznosNadoknade(700)).toBe(0);
  });

  it("raspoloživo nikad nije negativno — primljeni POEN prvo puni nadoknadu", () => {
    expect(raspolozivo(-700)).toBe(0);
    expect(raspolozivo(0)).toBe(0);
    expect(raspolozivo(250)).toBe(250);
  });
});
