/**
 * Brana: poništenje zapisa POEN-a uz protivzapis Protokola ide tipom
 * `PONISTENJE_ZAPISA`, nikad `TRANSFER` (pravilo 5).
 *
 * Do 06.10.2026. su gašenje naloga, poništenje lažne potvrde i brisanje dečjeg
 * naloga upisivali `TRANSFER` ka Protokolu. Kvar nije vidljiv na mestu nastanka —
 * vidi se tek kao „razmena" više na naslovnoj, u zbiru prepisa i kao prepis na
 * koji se može podneti prigovor. Zato se gleda izvor.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const KOREN = path.join(__dirname, "..");
const procitaj = (rel: string) => readFileSync(path.join(KOREN, rel), "utf8");
const broj = (izvor: string, izraz: string) => izvor.split(izraz).length - 1;

describe("poništenje zapisa ide sopstvenim tipom", () => {
  it("lažna verifikacija ne upisuje TRANSFER", () => {
    const izvor = procitaj("src/lib/protokol/lazna-verifikacija.ts");
    expect(izvor).toContain("TransactionType.PONISTENJE_ZAPISA");
    expect(izvor).not.toContain("TransactionType.TRANSFER");
  });

  it("brisanje dečjeg naloga ne upisuje TRANSFER", () => {
    const izvor = procitaj("src/lib/protokol/deca.ts");
    expect(izvor).toContain("TransactionType.PONISTENJE_ZAPISA");
    expect(izvor).not.toContain("TransactionType.TRANSFER");
  });

  it("gašenje naloga: TRANSFER ostaje samo za prenos drugom članu i za brisanje opisa prepisa", () => {
    const izvor = procitaj("src/app/api/profil/route.ts");
    // Kaskada potvrda i poništenje stanja pri prestanku statusa.
    expect(broj(izvor, "TransactionType.PONISTENJE_ZAPISA")).toBe(2);
    // „Prenos pri deaktivaciji" je pravi prepis (član → član), a drugo pojavljivanje
    // je `where` upit koji briše slobodan tekst uz prepise.
    expect(broj(izvor, "TransactionType.TRANSFER")).toBe(2);
  });

  it("vrednost enum-a stoji u zasebnoj migraciji", () => {
    const sql = procitaj("prisma/migrations/20261006120000_ponistenje_zapisa_enum/migration.sql");
    expect(sql).toContain("ADD VALUE IF NOT EXISTS 'PONISTENJE_ZAPISA'");
    expect(procitaj("prisma/schema.prisma")).toMatch(/^\s+PONISTENJE_ZAPISA$/m);
  });
});
