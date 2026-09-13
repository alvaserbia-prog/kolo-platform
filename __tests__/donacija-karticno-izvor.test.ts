import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  MAX_KARTICNA_UPLATA_RSD,
  MAX_KARTICNIH_UPLATA_DNEVNO,
  normalizujUplatioca,
} from "@/lib/donacija-pravila";

/**
 * R-01 — POEN kao virtuelna valuta. Mere M-4a, M-9, M-11 i C-1.
 *
 * Nalaz koji je ovo pokrenuo: kartični callback je zvao `evidentirajDonaciju`
 * odmah po verifikovanom odgovoru banke, pa između uplate i upisa POEN-a nije
 * bilo NIJEDNE ljudske odluke — a to je tačno slika pribavljanja digitalne
 * imovine uz naknadu, u realnom vremenu, po objavljenoj tabeli.
 *
 * Ovi testovi gledaju IZVOR, kao `oglasi-vidljivost-izvor` i `prigovor-izvor`:
 * ispravno pravilo ne vredi ništa dok ga svaka putanja zaista ne prođe.
 */

const koren = join(__dirname, "..");
const izvor = (p: string) => readFileSync(join(koren, p), "utf-8");

describe("M-4a — detekcija automatska, potvrda ljudska", () => {
  const callback = izvor("src/app/api/donacije/placanje/povratak/route.ts");

  it("callback banke NE evidentira donaciju", () => {
    // Gleda se UVOZ i poziv, ne pominjanje: docstring rute namerno objašnjava
    // šta je radila do mere M-4a, pa gola reč u fajlu nije dokaz.
    expect(callback).not.toContain('from "@/lib/protokol/donacija"');
    expect(callback).not.toContain("evidentirajDonaciju(");
  });

  it("callback prevodi zapis u NAPLACENO, ne u CONFIRMED", () => {
    expect(callback).toContain('status: "NAPLACENO"');
    expect(callback).not.toContain('data: { status: "CONFIRMED" }');
  });

  it("callback javlja adminima da zapis čeka potvrdu", () => {
    expect(callback).toContain("posaljiAdminAlert");
  });

  it("admin ruta i dalje traži uplatioca iz izvoda (R-19)", () => {
    const admin = izvor("src/app/api/admin/donacija/route.ts");
    expect(admin).toContain("uplatilac.length < 2");
  });

  it("red čekanja u admin panelu obuhvata i NAPLACENO", () => {
    expect(izvor("src/app/(app)/admin/page.tsx")).toContain('["PENDING", "NAPLACENO"]');
    expect(izvor("src/lib/chrome-podaci.ts")).toContain('["PENDING", "NAPLACENO"]');
  });
});

describe("M-9 — donirati sme i član bez potvrde", () => {
  it("nijedna donaciona ruta ne traži potvrđenu stvarnost", () => {
    for (const p of [
      "src/app/api/donacije/route.ts",
      "src/app/api/donacije/ips/route.ts",
      "src/app/api/donacije/placanje/zapocni/route.ts",
    ]) {
      expect(izvor(p)).not.toContain("session.user.verified");
    }
  });

  it("evidentiranje ne odbija nepotvrđen nalog", () => {
    const servis = izvor("src/lib/protokol/donacija.ts");
    expect(servis).not.toContain('throw new Error("Korisnik nije verifikovan.")');
  });

  it("identitet se beleži zasebnim svojstvom, ne novim statusom korisnika", () => {
    const servis = izvor("src/lib/protokol/donacija.ts");
    expect(servis).toContain("identitetUtvrdjenAt");
    // Donacija ne sme da pomeri tip korisnika — potvrda stvarnosti je jedini put.
    expect(servis).not.toContain("tipKorisnika:");
  });
});

describe("M-11 — kapa i brzinska kočnica", () => {
  const zapocni = izvor("src/app/api/donacije/placanje/zapocni/route.ts");

  it("kapa po kartičnoj uplati je 100.000 RSD", () => {
    expect(MAX_KARTICNA_UPLATA_RSD).toBe(100_000);
  });

  it("ruta sprovodi kapu, a stara granica od 2.000.000 je nestala", () => {
    expect(zapocni).toContain("MAX_KARTICNA_UPLATA_RSD");
    expect(zapocni).not.toContain("2_000_000");
  });

  it("ruta sprovodi brzinsku kočnicu", () => {
    expect(MAX_KARTICNIH_UPLATA_DNEVNO).toBeGreaterThan(0);
    expect(zapocni).toContain("MAX_KARTICNIH_UPLATA_DNEVNO");
  });

  it("izjava o nepovratnosti se traži pre naplate i snima na zapis", () => {
    expect(zapocni).toContain("body.nepovratnost !== true");
    expect(zapocni).toContain("nepovratnostPotvrdjenaAt");
  });
});

describe("C-1 — uplatilac kao ključ za duplikat", () => {
  it("normalizacija spaja isto ime bez obzira na redosled, dijakritiku i razmake", () => {
    const a = normalizujUplatioca("Petar Petrović");
    expect(a).not.toBeNull();
    expect(normalizujUplatioca("PETROVIĆ  PETAR")).toBe(a);
    expect(normalizujUplatioca("petar petrovic")).toBe(a);
  });

  it("đ se ne gubi u normalizaciji", () => {
    expect(normalizujUplatioca("Đorđe Đurić")).toBe(normalizujUplatioca("Dorde Duric"));
  });

  it("prekratak unos ne daje ključ — inače bi se svi kratki unosi složili", () => {
    expect(normalizujUplatioca("a")).toBeNull();
    expect(normalizujUplatioca("  ")).toBeNull();
    expect(normalizujUplatioca(null)).toBeNull();
  });

  it("različiti ljudi ne dele ključ", () => {
    expect(normalizujUplatioca("Petar Petrović")).not.toBe(normalizujUplatioca("Marko Marković"));
  });

  it("admin ruta zaustavlja evidentiranje pri poklapanju, uz izričitu ljudsku odluku", () => {
    const admin = izvor("src/app/api/admin/donacija/route.ts");
    expect(admin).toContain("proveriDuplikatUplatioca");
    expect(admin).toContain("potvrdiDuplikat");
  });
});
