import { describe, it, expect } from "vitest";
import {
  proveriRazlog,
  jeRazlogPrijave,
  tekstObavestenjaOglas,
  tekstObavestenjaPoruka,
  PRIJAVA_RAZLOZI,
  RAZLOG_OPIS,
  MAX_RAZLOG,
} from "@/lib/moderacija";

describe("proveriRazlog", () => {
  // Uslovi čl. 25 st. 2: uklanjanje se saopštava korisniku „uz navođenje razloga".
  // Prazan razlog bi značio obaveštenje bez obrazloženja, pa se odbija.
  it("odbija prazan razlog", () => {
    expect(proveriRazlog("")).toEqual({ ok: false, greska: "Razlog uklanjanja je obavezan." });
  });

  it("odbija razlog od samih razmaka", () => {
    expect(proveriRazlog("   \n  ").ok).toBe(false);
  });

  it("odbija vrednost koja nije string", () => {
    expect(proveriRazlog(undefined).ok).toBe(false);
    expect(proveriRazlog(null).ok).toBe(false);
    expect(proveriRazlog(42).ok).toBe(false);
    expect(proveriRazlog({ razlog: "x" }).ok).toBe(false);
  });

  it("prihvata razlog i skida višak razmaka", () => {
    expect(proveriRazlog("  Zabranjeno dobro.  ")).toEqual({ ok: true, razlog: "Zabranjeno dobro." });
  });

  it("prihvata razlog tačno na granici dužine", () => {
    const nagranici = "x".repeat(MAX_RAZLOG);
    expect(proveriRazlog(nagranici)).toEqual({ ok: true, razlog: nagranici });
  });

  it("odbija razlog preko granice dužine", () => {
    expect(proveriRazlog("x".repeat(MAX_RAZLOG + 1)).ok).toBe(false);
  });
});

describe("jeRazlogPrijave", () => {
  it("prihvata sve propisane kodove", () => {
    for (const kod of PRIJAVA_RAZLOZI) expect(jeRazlogPrijave(kod)).toBe(true);
  });

  it("odbija nepoznat kod i ne-string vrednosti", () => {
    expect(jeRazlogPrijave("NEPOSTOJECI")).toBe(false);
    expect(jeRazlogPrijave("")).toBe(false);
    expect(jeRazlogPrijave(undefined)).toBe(false);
    expect(jeRazlogPrijave(["OBMANA"])).toBe(false);
  });

  it("svaki kod ima opis (padajući meni prijave ne sme imati praznu stavku)", () => {
    for (const kod of PRIJAVA_RAZLOZI) expect(RAZLOG_OPIS[kod]?.length).toBeGreaterThan(0);
  });
});

describe("tekstovi obaveštenja", () => {
  it("obaveštenje o oglasu nosi naslov, razlog i pouku o prigovoru", () => {
    const tekst = tekstObavestenjaOglas("Med iz Homolja", "Nedozvoljena kategorija.");
    expect(tekst).toContain("Med iz Homolja");
    expect(tekst).toContain("Nedozvoljena kategorija.");
    expect(tekst).toContain("prigovor");
  });

  it("obaveštenje o poruci nosi razlog i pouku o prigovoru", () => {
    const tekst = tekstObavestenjaPoruka("Uvredljiv sadržaj.");
    expect(tekst).toContain("Uvredljiv sadržaj.");
    expect(tekst).toContain("prigovor");
  });
});
