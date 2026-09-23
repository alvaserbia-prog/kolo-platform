import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sr from "@/../messages/sr.json";
import en from "@/../messages/en.json";
import ru from "@/../messages/ru.json";
import hr from "@/../messages/hr.json";
import hu from "@/../messages/hu.json";

/**
 * Namespace `admin` se NE prevodi (odluka vlasnika, 2026-09-13) i postoji
 * ISKLJUČIVO u `messages/sr.json`; `src/i18n/request.ts` ga dodaje svakom drugom
 * jeziku pri učitavanju poruka.
 *
 * Razlog nije ušteda nego tačnost: admin panel je alat operative Fondacije
 * (ne UO — ispravljeno 2026-09-23) i njegova terminologija preslikava akte,
 * u kojima je merodavan srpski original. Uz to
 * akti namerno razdvajaju institute koje prevod lako slepi u jednu reč —
 * prigovor (Uslovi čl. 37a), prijava razmene, prijava oglasa, nadzorni predmet —
 * pa bi loš prevod vodio ka odluci po pogrešnom institutu.
 *
 * 🔴 Ranije pravilo („prevod mora biti identičan srpskom") se nije održavalo:
 * namespace je bio NAPOLA preveden — 177 od 450 ključeva u en/ru/hu i 80 u hr —
 * pa je isti red tabova glasio „Overview, Members, … Razmene, Nabavke". Noviji
 * ekrani (Razmene, Nabavke) ulazili su na srpskom jer ih niko ne prevodi.
 *
 * Ovaj test čuva OBA kraja: da prevod ne nastane, i da merge ne nestane. Bez
 * drugog dela bi brisanje jedne linije u `request.ts` ostavilo admin panel bez
 * teksta na četiri jezika, a ništa ne bi puklo pri build-u.
 */
const PREVODI: Record<string, unknown> = { en, ru, hr, hu };

describe("admin namespace se ne prevodi", () => {
  it("postoji u srpskom izvoru", () => {
    expect(Object.keys((sr as Record<string, Record<string, unknown>>).admin ?? {}).length).toBeGreaterThan(100);
  });

  it.each(Object.keys(PREVODI))("%s.json ga uopšte ne sadrži", (jezik) => {
    expect(
      Object.prototype.hasOwnProperty.call(PREVODI[jezik] as object, "admin"),
      `messages/${jezik}.json sadrži "admin" — taj namespace živi samo u sr.json, a dodaje ga src/i18n/request.ts`,
    ).toBe(false);
  });

  it("request.ts dodaje srpski admin blok ostalim jezicima", () => {
    const izvor = readFileSync(join(process.cwd(), "src/i18n/request.ts"), "utf8");
    // Bez merge-a admin panel ostaje bez teksta na en/ru/hr/hu, a build prolazi.
    expect(izvor).toMatch(/admin:\s*\(await import\(["'`]\.\.\/\.\.\/messages\/sr\.json["'`]\)\)\.default\.admin/);
    // Prevod se ne sme vratiti kroz izuzetak za srpski — `sr` ga već ima.
    expect(izvor).toContain('izvorLocale === "sr"');
  });

  it("provera pariteta izuzima taj namespace", () => {
    const skripta = readFileSync(join(process.cwd(), "scripts/check-i18n-parity.mjs"), "utf8");
    expect(skripta).toContain("NEPREVEDENI_NS");
    expect(skripta).toContain("jeNeprevedeni");
  });
});
