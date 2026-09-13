/**
 * Brana za slanje slika na Pijaci.
 *
 * Povod je prijavljen kvar: čovek nije mogao da postavi fotografije na nov oglas.
 * Dva uzroka, oba tiha — HEIC sa telefona koji se odbija uz poruku o formatu koji
 * je telefon sam ponudio, i preveliko UKUPNO telo zahteva, koje platforma odbija
 * pre rute, pa `res.json()` na ekranu pukne i ostane samo „Greška pri slanju".
 *
 * Treći uzrok, prijavljen sa iPhone-a: čim se slike štikliraju, karticu izbaci i
 * sličice se ne pojave. Fotografija od 12 MP dekodirana zauzima ≈48MB, a sve
 * izabrane su se dekodirale ODJEDNOM; uz to je `URL.createObjectURL` stajao u
 * renderu, pa je pri svakom iscrtavanju nastajala nova blob adresa i nijedna se
 * nije oslobađala. iOS Safari na tu memoriju odbaci stranicu.
 *
 * Test gleda IZVOR, kao `oglasi-vidljivost-izvor.test.ts`: pravilo u
 * `slika-upload.ts` ne vredi ništa dok svaki obrazac ne prođe kroz njega, a
 * upravo to se već dešavalo (obrazac za IZMENU oglasa nije imao nikakvu pripremu).
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  MAX_PO_SLICI,
  MAX_SLIKA,
  MAX_UKUPNO,
  porukaIzOdgovora,
  ukupnaVelicina,
} from "@/lib/slika-upload";

const OBRASCI: ReadonlyArray<readonly [string, string]> = [
  ["nov oglas", "src/app/(app)/pijaca/novi-oglas/NoviOglasForma.tsx"],
  ["izmena oglasa", "src/app/(app)/pijaca/[id]/OglasDetalj.tsx"],
];

const koren = process.cwd();
const procitaj = (rel: string) => readFileSync(path.join(koren, rel), "utf-8");

const RUTA_POST = "src/app/api/pijaca/route.ts";
const RUTA_PATCH = "src/app/api/pijaca/[id]/route.ts";

describe("granice slanja slika", () => {
  it("ukupno telo staje ispod limita serverless funkcije (~4,5MB)", () => {
    // 🔴 Ako ovo poraste iznad platformskog limita, upload ponovo počinje da pada
    // sa 413 i bez JSON odgovora — tačno kvar zbog kog brana postoji.
    expect(MAX_UKUPNO).toBeLessThan(4.5 * 1024 * 1024);
  });

  it("pet pripremljenih slika mora moći da stane u jedno slanje", () => {
    expect(MAX_SLIKA).toBe(5);
    // Jedna slika sme biti veća od 1/5 ukupnog budžeta (kad je sama), ali gornja
    // granica po slici ne sme biti NIŽA od ukupne — inače je pravilo besmisleno.
    expect(MAX_PO_SLICI).toBeGreaterThanOrEqual(MAX_UKUPNO);
  });

  it("ukupnaVelicina sabira sve izabrane datoteke", () => {
    const lazni = [{ size: 1000 }, { size: 2500 }] as unknown as File[];
    expect(ukupnaVelicina(lazni)).toBe(3500);
    expect(ukupnaVelicina([])).toBe(0);
  });
});

describe("porukaIzOdgovora", () => {
  it("vraća poruku rute kad je odgovor naš JSON", async () => {
    const res = new Response(JSON.stringify({ error: "Neispravna kategorija." }), { status: 400 });
    expect(await porukaIzOdgovora(res)).toBe("Neispravna kategorija.");
  });

  it("vraća null kad odgovor NIJE JSON — tada poruku bira ekran", async () => {
    // Ovako izgleda 413 sa platforme: HTML, ne `{ error }`. Ranije je `res.json()`
    // na tom mestu bacao, pa se pravi uzrok nije video.
    const res = new Response("<html>Request Entity Too Large</html>", { status: 413 });
    expect(await porukaIzOdgovora(res)).toBeNull();
  });

  it("vraća null kad JSON nema upotrebljivu poruku", async () => {
    expect(await porukaIzOdgovora(new Response("{}", { status: 500 }))).toBeNull();
    expect(await porukaIzOdgovora(new Response(JSON.stringify({ error: "  " }), { status: 500 }))).toBeNull();
  });
});

describe("IZVOR — oba obrasca pripremaju slike kroz isto pravilo", () => {
  it.each(OBRASCI)("%s zove zajedničku pripremu i meri ukupnu veličinu", (_ime, rel) => {
    const izvor = procitaj(rel);
    expect(izvor).toContain("@/lib/slika-upload");
    expect(izvor).toContain("pripremiSlike");
    expect(izvor).toContain("ukupnaVelicina");
    expect(izvor).toContain("MAX_UKUPNO");
  });

  it.each(OBRASCI)("%s razlikuje odbijen FORMAT od prevelike slike", (_ime, rel) => {
    const izvor = procitaj(rel);
    expect(izvor).toContain("slika_format");
    expect(izvor).toContain("slike_ukupno_prevelike");
  });

  it.each(OBRASCI)("%s proverava res.ok pre čitanja tela odgovora", (_ime, rel) => {
    const izvor = procitaj(rel);
    // Slanje slika ide kao multipart (`body: fd`). Obrazac koji pada je
    // `const data = await res.json();` odmah iza tog fetch-a: preveliko telo
    // platforma odbija svojom stranicom, pa `res.json()` baci pre `if (!res.ok)`
    // i pravi uzrok se izgubi u opštoj poruci.
    const slanja = [...izvor.matchAll(/body:\s*fd\s*\}\)([\s\S]{0,400})/g)];
    expect(slanja.length).toBeGreaterThan(0);
    for (const [, posle] of slanja) {
      const doProvere = posle.split("if (!res.ok)")[0];
      expect(doProvere).not.toMatch(/await\s+res\.json\(\)(?!\s*\.catch)/);
    }
    expect(izvor).toContain("porukaIzOdgovora");
  });
});

describe("IZVOR — rute imenuju uzrok", () => {
  it.each([
    ["POST /api/pijaca", RUTA_POST],
    ["PATCH /api/pijaca/[id]", RUTA_PATCH],
  ])("%s uz odbijen format pominje HEIC", (_ime, rel) => {
    const izvor = procitaj(rel);
    expect(izvor).toContain("HEIC");
    // Gola lista dozvoljenih formata ne kaže čoveku u šta je upao.
    expect(izvor).not.toContain('greska("Dozvoljeni formati: JPG, PNG, WebP."');
  });

  it.each([
    ["POST /api/pijaca", RUTA_POST],
    ["PATCH /api/pijaca/[id]", RUTA_PATCH],
  ])("%s nepodešeno skladište kaže rečenicom, ne kao EROFS", (_ime, rel) => {
    const izvor = procitaj(rel);
    expect(izvor).toContain("Skladište slika nije konfigurisano (Cloudflare R2).");
  });

  it("POST proverava i ZBIR veličina, ne samo pojedinačnu sliku", () => {
    const izvor = procitaj(RUTA_POST);
    expect(izvor).toContain("ukupnaVelicina(imageFiles)");
    expect(izvor).toContain("MAX_UKUPNO");
  });
});

describe("prevodi za nove poruke postoje na svih pet jezika", () => {
  it.each(["sr", "en", "ru", "hr", "hu"])("%s", (jezik) => {
    const poruke = JSON.parse(procitaj(`messages/${jezik}.json`)) as {
      pijaca: Record<string, string>;
      greske: Record<string, string>;
    };
    expect(poruke.pijaca.slika_format?.trim()).toBeTruthy();
    expect(poruke.pijaca.slike_ukupno_prevelike?.trim()).toBeTruthy();
    expect(
      poruke.greske.slika_mora_biti_jpg_png_ili_webp_fotografiju_sa_iphone_a_heic_sacuvaj_kao_jpg?.trim(),
    ).toBeTruthy();
  });
});

describe("IZVOR — memorija na telefonu", () => {
  it.each(OBRASCI)("%s dekodira slike JEDNU PO JEDNU, ne odjednom", (_ime, rel) => {
    const izvor = procitaj(rel);
    // 🔴 `Promise.all` nad pripremom slika je tačan kvar zbog kog iPhone izbacuje
    // karticu: pet fotografija od 12 MP traži ~240MB u jednom trenutku.
    expect(izvor).not.toMatch(/Promise\.all\([^)]*pripremiSlik/);
    expect(izvor).toContain("pripremiSlike(");
  });

  it.each(OBRASCI)("%s ne pravi blob adresu u renderu", (_ime, rel) => {
    const izvor = procitaj(rel);
    // Adresa sličice se pravi jednom (`zaPregled`) i oslobađa (`oslobodiPregled`).
    // U `src={...}` ide zapamćena vrednost, nikad nov `createObjectURL`.
    expect(izvor).not.toMatch(/src=\{\s*URL\.createObjectURL/);
    expect(izvor).toContain("oslobodiPregled");
  });

  it.each(OBRASCI)("%s oslobađa sličice kad ekran ode", (_ime, rel) => {
    const izvor = procitaj(rel);
    expect(izvor).toMatch(/for \(const s of \w+\.current\) oslobodiPregled\(s\)/);
  });
});
