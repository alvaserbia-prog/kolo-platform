import { describe, it, expect } from "vitest";
import {
  KOEFICIJENT_POKROVITELJSTVA,
  MINIMUM_PRIJAVE_POKROVITELJSTVA,
  nivoPokroviteljstvaZaKumulativ,
  tabelaPokroviteljstvaZaPrikaz,
} from "@/lib/protokol/pokrovitelj";
import { nivoZaKumulativ } from "@/lib/protokol/donacija";

/**
 * Koeficijentni model pokroviteljstva (čl. 10, od 2026-09-08).
 *
 * 🔴 Nosivo pravilo: koeficijent pokroviteljstva NIJE zasebna tabela nego izvod
 * iz čl. 4 — donacija × 1,20 za isti kumulativ. Ranija fiksna tabela sedam nivoa
 * davala je 1,67–1,92× više po dinaru do milion, a preko miliona ništa; ovaj test
 * čuva da se dve lestvice ne mogu ponovo razići.
 */
describe("koeficijent pokroviteljstva = donacija × 1,20", () => {
  it("na svakom pragu iz Tabele B", () => {
    for (const red of tabelaPokroviteljstvaZaPrikaz()) {
      const donacija = nivoZaKumulativ(red.do).kurs;
      expect(red.kurs, `prag ${red.do}`).toBeCloseTo(
        donacija * KOEFICIJENT_POKROVITELJSTVA,
        10
      );
    }
  });

  it("objavljena Tabela B — svih dvanaest redova", () => {
    expect(tabelaPokroviteljstvaZaPrikaz()).toEqual([
      { nivo: 1, do: 10_000, kurs: 1.44 },
      { nivo: 2, do: 20_000, kurs: 1.56 },
      { nivo: 3, do: 50_000, kurs: 1.68 },
      { nivo: 4, do: 100_000, kurs: 1.8 },
      { nivo: 5, do: 200_000, kurs: 1.92 },
      { nivo: 6, do: 500_000, kurs: 2.04 },
      { nivo: 7, do: 1_000_000, kurs: 2.16 },
      { nivo: 8, do: 2_000_000, kurs: 2.28 },
      { nivo: 9, do: 5_000_000, kurs: 2.4 },
      { nivo: 10, do: 10_000_000, kurs: 2.52 },
      { nivo: 11, do: 20_000_000, kurs: 2.64 },
      { nivo: 12, do: 50_000_000, kurs: 2.76 },
    ]);
  });

  // Koeficijent mora da padne na čistu stotinku. Poređenje ide kroz toleranciju,
  // jer 2,28 kao dvostruka preciznost daje 227.99999999999997 pri množenju sa 100
  // — to je svojstvo zapisa broja, ne greška u obračunu.
  it("koeficijent pada na čistu stotinku", () => {
    for (const red of tabelaPokroviteljstvaZaPrikaz(30)) {
      expect(red.kurs * 100).toBeCloseTo(Math.round(red.kurs * 100), 6);
    }
  });
});

/**
 * 🟢 Zatečeni `Pokrovitelj.trenutniNivo` (1–7 po staroj fiksnoj tabeli) ostaje
 * tačan i posle prelaska na koeficijentni model — stari pragovi daju iste
 * brojeve nivoa, pa migracija brojeva nije bila potrebna.
 */
describe("kontinuitet zatečenih nivoa", () => {
  const stari: [number, number][] = [
    [10_000, 1],
    [20_000, 2],
    [50_000, 3],
    [100_000, 4],
    [200_000, 5],
    [500_000, 6],
    [1_000_000, 7],
  ];
  it.each(stari)("kumulativ %i → nivo %i", (kumulativ, nivo) => {
    expect(nivoPokroviteljstvaZaKumulativ(kumulativ).nivo).toBe(nivo);
  });
});

describe("nivo se izvodi iz kumulativa", () => {
  it("između pragova zadržava niži nivo", () => {
    expect(nivoPokroviteljstvaZaKumulativ(19_999).nivo).toBe(1);
    expect(nivoPokroviteljstvaZaKumulativ(999_999).nivo).toBe(6);
  });

  it("nastavlja se iznad zatečenih sedam nivoa", () => {
    expect(nivoPokroviteljstvaZaKumulativ(2_000_000).kurs).toBe(2.28);
    expect(nivoPokroviteljstvaZaKumulativ(50_000_000).kurs).toBe(2.76);
    // Bez plafona — ranija tabela je preko miliona davala nulu marginalno.
    expect(nivoPokroviteljstvaZaKumulativ(1_000_000_000).kurs).toBeGreaterThan(2.76);
  });
});

describe("minimum prijave", () => {
  it("je 10.000 RSD (čl. 7)", () => {
    expect(MINIMUM_PRIJAVE_POKROVITELJSTVA).toBe(10_000);
  });

  it("poklapa se sa prvim pragom Tabele B", () => {
    expect(tabelaPokroviteljstvaZaPrikaz()[0].do).toBe(MINIMUM_PRIJAVE_POKROVITELJSTVA);
  });
});
