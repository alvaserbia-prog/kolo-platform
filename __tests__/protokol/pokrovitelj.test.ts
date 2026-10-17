import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import {
  MINIMUM_PRIJAVE_POKROVITELJSTVA,
  nivoPokroviteljstvaZaKumulativ,
  tabelaPokroviteljstvaZaPrikaz,
} from "@/lib/protokol/pokrovitelj";
import { nivoZaKumulativ, pragZaNivo } from "@/lib/protokol/donacija";

/**
 * Pokroviteljstvo po ISTOJ tabeli kao donacija fizičkog lica (čl. 10, set 4.6.8).
 *
 * 🔴 Nosivo pravilo: nema uvećanja po pravnom obliku davaoca. Do 4.6.8 je
 * koeficijent bio donacija × 1,20; pre 2026-09-08 fiksna tabela sedam nivoa. Ovaj
 * test čuva da se zasebna lestvica ne vrati ni kao množilac.
 */
describe("pokroviteljstvo = tabela donacija", () => {
  it("isti nivo i koeficijent za svaki kumulativ", () => {
    for (const k of [10_000, 19_999, 50_000, 300_000, 1_000_000, 5_000_000, 1e9]) {
      expect(nivoPokroviteljstvaZaKumulativ(k), `kumulativ ${k}`).toEqual(nivoZaKumulativ(k));
    }
  });

  it("tabela na ekranu počinje od najmanje prijave i nosi koeficijente iz čl. 4", () => {
    const tabela = tabelaPokroviteljstvaZaPrikaz();
    expect(tabela[0]).toEqual({ nivo: 3, do: 10_000, kurs: 1.2 });
    for (const red of tabela) {
      expect(nivoZaKumulativ(red.do)).toEqual({ nivo: red.nivo, kurs: red.kurs });
    }
  });

  it("bez plafona", () => {
    expect(nivoPokroviteljstvaZaKumulativ(1_000_000_000).kurs).toBeGreaterThan(2);
  });
});

describe("IZVOR — uvećanje se ne vraća", () => {
  const izvor = readFileSync(join(__dirname, "../../src/lib/donacija-pravila.ts"), "utf-8");
  it("nema konstante ni funkcije za zaseban koeficijent pokroviteljstva", () => {
    expect(izvor).not.toMatch(/KOEFICIJENT_POKROVITELJSTVA/);
    expect(izvor).not.toMatch(/koeficijentPokroviteljstvaZaNivo/);
    expect(izvor).not.toMatch(/POMERAJ_NIVOA_POKROVITELJSTVA/);
  });

  it("POEN ide podnosiocu prijave, ne upisanom vlasniku pokrovitelja", () => {
    const servis = readFileSync(join(__dirname, "../../src/lib/protokol/pokrovitelj.ts"), "utf-8");
    expect(servis).toMatch(/primalacId:\s*prijava\.podnosilacId/);
  });
});

/**
 * Migracija koja zatečeni `trenutniNivo` prevodi u numeraciju čl. 4 nosi pragove
 * prepisane u SQL — proverava se da su to baš pragovi iz `pragZaNivo()`.
 */
describe("migracija nivoa", () => {
  const dir = join(__dirname, "../../prisma/migrations");
  const ime = readdirSync(dir).find((d) => d.endsWith("_pokrovitelj_nivo_jedinstvena_tabela"))!;
  const sql = readFileSync(join(dir, ime, "migration.sql"), "utf-8");
  const redovi = [...sql.matchAll(/>= (\d+) THEN (\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

  it("svaki prag odgovara nivou iz pravila", () => {
    expect(redovi.length).toBeGreaterThan(15);
    for (const [prag, nivo] of redovi) expect(pragZaNivo(nivo), `nivo ${nivo}`).toBe(prag);
  });
});

describe("minimum prijave", () => {
  it("je 10.000 RSD (čl. 7)", () => {
    expect(MINIMUM_PRIJAVE_POKROVITELJSTVA).toBe(10_000);
  });
});
