/**
 * Brana: svaka staza do oglasa mora da sprovede vidljivost iz čl. 13.
 *
 * Pravilo `smeDaVidiOglas` / `usloviVidljivostiOglasa` postojalo je od uvođenja
 * unapređenog Modula Deca, ali je bilo uvezano SAMO u `GET /api/pijaca` i
 * `GET /api/pijaca/[id]` — dve rute koje nijedan ekran ne poziva. Sama Pijaca
 * (`src/app/pijaca/page.tsx`) je spisak čitala sopstvenim upitom sa
 * `where: { status: "ACTIVE" }`, a stranica oglasa je oglas dizala po `id`-u bez
 * ijedne provere. Posledica: oglasi deteta viđeni su punoletnim članovima, pa i
 * gostima, uprkos ispravnom pravilu koje je stajalo dva fajla dalje.
 *
 * Zato test ne gleda pravilo (to radi `deca-pravila.test.ts`) nego IZVOR: da li
 * svaki fajl koji sam čita oglase pominje jedan od dva ulaza u pravilo. Grubo
 * jeste, ali hvata tačno onu grešku koja se desila — dodavanje novog prikaza
 * oglasa koji za decu ne zna.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const KOREN = process.cwd();

/** Prikazi oglasa koji svoj upit pišu sami i moraju da sprovedu čl. 13. */
const PRIKAZI = [
  "src/app/pijaca/page.tsx",
  "src/app/pijaca/[id]/page.tsx",
  "src/app/page.tsx",
  "src/app/(app)/pocetna/page.tsx",
  "src/app/api/pijaca/route.ts",
  "src/app/api/pijaca/[id]/route.ts",
  "src/app/sitemap.ts",
];

const ULAZI = ["usloviVidljivostiOglasa", "smeDaVidiOglas", "maloletan: false"];

describe("vidljivost oglasa maloletnog korisnika (čl. 13)", () => {
  it.each(PRIKAZI)("%s sprovodi pravilo", (rel) => {
    const izvor = readFileSync(path.join(KOREN, rel), "utf8");
    const nasao = ULAZI.some((u) => izvor.includes(u));
    expect(nasao, `${rel} čita oglase bez provere vidljivosti iz čl. 13`).toBe(true);
  });

  // Sam pomen pravila u fajlu nije dovoljan ako pored njega stoji i drugi, goli
  // upit. Broj oglasa (`count`) je namerno izuzet — agregat pokazuje da oglas
  // postoji, kao i knjiga zapisa, i nije put do deteta.
  it("nijedan `findMany` ne diže oglase golim `status: \"ACTIVE\"`", () => {
    for (const rel of ["src/app/pijaca/page.tsx", "src/app/page.tsx"]) {
      const izvor = readFileSync(path.join(KOREN, rel), "utf8");
      const goli = /marketplaceListing\.findMany\(\{[\s\S]{0,400}?where:\s*\{\s*status:\s*"ACTIVE"\s*\}/.test(
        izvor,
      );
      expect(goli, `${rel} ima spisak oglasa bez uslova nad prodavcem`).toBe(false);
    }
  });
});
