import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { smeVidetiSpisakSkole, type Ucesnik } from "@/lib/deca-pravila";
import { OPIS_SOCIJALNOG_PROGRAMA, SOCIJALNI_PROGRAMI } from "@/lib/protokol/programi";

/**
 * R-03 — javna pseudonimna evidencija otkriva posebne kategorije i podatke dece.
 * Mere M-1, M-3a/b/c, M-4, M-5.
 *
 * 🔴 Zašto brana gleda IZVOR, a ne samo pravila: ista pouka je u ovom projektu
 * zapisana četiri puta (oglas deteta, zatvoren profil, lanac potvrda, R-01).
 * Ispravno pravilo ne vredi ništa dok ga svaki prikaz zaista ne prođe — a upravo
 * to je ovde i bio kvar: `/api/javno/feed` je decu isključivao, dok je stranica
 * `/sistem` iste transakcije dizala sopstvenim upitom bez te provere.
 */

const koren = join(__dirname, "..");
const izvor = (p: string) => readFileSync(join(koren, p), "utf-8");

const dete = (o: Partial<Ucesnik> = {}): Ucesnik => ({
  id: "d1",
  maloletan: true,
  godine: 12,
  dozvolaOdrasli: false,
  roditeljIds: ["r1"],
  skolaSifra: "os-neka-skola",
  stanje: "AKTIVNO",
  ...o,
});

describe("M-1 — naziv socijalnog programa ne ulazi u zapis transakcije", () => {
  const servis = izvor("src/lib/protokol/programi.ts");

  it("opis je opšta oznaka, bez imena programa", () => {
    expect(OPIS_SOCIJALNOG_PROGRAMA).not.toMatch(/majk|starij|briga|školov/i);
    for (const p of SOCIJALNI_PROGRAMI) {
      expect(OPIS_SOCIJALNOG_PROGRAMA).not.toContain(p);
    }
  });

  it("emisija se grana po tipu — samo operativni doprinos zadržava naziv", () => {
    expect(servis).toContain('const jeOperativni = item.type === "PED"');
    expect(servis).toContain("TransactionType.EMISIJA_OPERATIVNI");
    expect(servis).toContain("OPIS_SOCIJALNOG_PROGRAMA");
    expect(servis).toContain('kljuc: "transakcije.socijalni_program"');
  });

  it("operativni doprinos nije među socijalnim programima", () => {
    expect(SOCIJALNI_PROGRAMI).not.toContain("PED");
    expect(SOCIJALNI_PROGRAMI).toHaveLength(4);
  });
});

describe("M-1 — pojedinačni redovi izlaze iz javnih prikaza", () => {
  it("javni feed isključuje socijalne programe i nudi agregat", () => {
    const feed = izvor("src/app/api/javno/feed/route.ts");
    expect(feed).toContain("TransactionType.EMISIJA_PROGRAM");
    expect(feed).toContain("dnevniPregledPrograma");
  });

  it("spisak zapisa Protokola na /sistem isključuje socijalne programe", () => {
    const sistem = izvor("src/app/(app)/sistem/page.tsx");
    expect(sistem).toContain('notIn: ["TRANSFER", "EMISIJA_PROGRAM"]');
  });

  it("oba spiska transakcija isključuju decu ISTIM uslovom", () => {
    // 🔴 Jedan izvor, ne dve kopije: razlaz ta dva upita je i proizveo kvar —
    // feed je decu krio, `/sistem` nije.
    expect(izvor("src/lib/protokol/deca.ts")).toContain("export const BEZ_DECE");
    for (const p of ["src/app/api/javno/feed/route.ts", "src/app/(app)/sistem/page.tsx"]) {
      expect(izvor(p)).toContain('import { BEZ_DECE } from "@/lib/protokol/deca"');
      expect(izvor(p)).toContain("BEZ_DECE");
    }
  });

  it("agregat preskače dan sa jednim korisnikom — inače bi vratio pojedinačan iznos", () => {
    const servis = izvor("src/lib/protokol/programi.ts");
    expect(servis).toContain("if (korisnika < 2) continue");
  });

  it("lični zbir po programu postoji, da korisnik ne izgubi sopstveni podatak", () => {
    expect(izvor("prisma/schema.prisma")).toContain("isplacenoPoen");
    expect(izvor("src/lib/protokol/programi.ts")).toContain("isplacenoPoen: { increment: emitAmount }");
  });
});

describe("M-3 — donacije", () => {
  const ruta = izvor("src/app/api/donacije/route.ts");
  const servis = izvor("src/lib/protokol/donacija.ts");

  it("M-3a — lista tuđih donacija traži potvrđenu stvarnost", () => {
    expect(ruta).toContain("const javneDonacije = verifikovan");
    expect(ruta).toContain("listaZakljucana");
  });

  it("M-3b — ime uplatioca ne ulazi u opis emisije", () => {
    expect(servis).not.toContain("transakcije.donacija_uplatilac");
    expect(servis).toContain('kljuc: "transakcije.donacija"');
  });

  it("M-3b — nijedan prevod ne traži parametar {uplatilac}", () => {
    // next-intl baca kad prevod traži parametar koji kod ne šalje.
    for (const j of ["sr", "en", "ru", "hr", "hu"]) {
      const m = JSON.parse(izvor(`messages/${j}.json`));
      expect(m.transakcije.donacija_uplatilac ?? "").not.toContain("{uplatilac}");
    }
  });

  it("M-3c — anonimna donacija ulazi u prikaze samo iznosom", () => {
    // Lice se ne identifikuje ni imenom ni pseudonimom ni linkom.
    expect(ruta).toContain("ime: d.javno ? d.donatorIme : null");
    expect(ruta).toContain("pseudonim: d.javno ? d.user?.pseudonim ?? null : null");
    const sistem = izvor("src/app/(app)/sistem/page.tsx");
    expect(sistem).toContain("pseudonim: d.javno ? d.user.pseudonim : null");
    expect(sistem).toContain("anonimno: !d.javno");
  });

  it("uz ime javnog donatora stoje pseudonim i link, kako Uslovi čl. 17 i kažu", () => {
    expect(ruta).toContain("user: { select: { id: true, pseudonim: true } }");
    expect(izvor("src/app/(app)/donacije/DonacijeKlijent.tsx")).toContain("profilHref");
  });
});

describe("M-4 — spisak dece jedne škole", () => {
  it("punopravno dete svoje škole ga vidi", () => {
    expect(smeVidetiSpisakSkole(dete(), "os-neka-skola")).toBe(true);
  });

  it("🔴 nalog koji čeka roditelja NE vidi — iza njega ne stoji niko", () => {
    expect(smeVidetiSpisakSkole(dete({ stanje: "NA_CEKANJU" }), "os-neka-skola")).toBe(false);
    expect(smeVidetiSpisakSkole(dete({ stanje: "POVEZANO" }), "os-neka-skola")).toBe(false);
  });

  it("🔴 dete druge škole NE vidi", () => {
    expect(smeVidetiSpisakSkole(dete(), "os-druga-skola")).toBe(false);
  });

  it("punoletan nalog i gost ne vide", () => {
    expect(smeVidetiSpisakSkole(dete({ maloletan: false }), "os-neka-skola")).toBe(false);
    expect(smeVidetiSpisakSkole(null, "os-neka-skola")).toBe(false);
  });

  it("IZVOR — ruta zaista prolazi kroz pravilo, ne kroz goli `maloletan`", () => {
    const ruta = izvor("src/app/api/skole/[sifra]/route.ts");
    expect(ruta).toContain("smeVidetiSpisakSkole(posmatrac, skola.sifra)");
    expect(ruta).not.toContain("posmatrac?.maloletan ? await decaSkole");
  });
});

describe("M-5 — sužen pregled profila skida i vezu roditelj–dete", () => {
  it("IZVOR — oba polja prolaze kroz `suzen`", () => {
    const ruta = izvor("src/app/api/profil/[id]/route.ts");
    expect(ruta).toContain("roditelji: suzen ? []");
    expect(ruta).toContain("deca: suzen ? []");
  });
});
