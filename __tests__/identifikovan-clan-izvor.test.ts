import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { smeProsireno, smeGlasati } from "@/lib/dozvole";

/**
 * R-01, mera M-9 i odluka vlasnika „opcija B" — obim prava člana čiji je
 * identitet utvrđen na donatorskom putu.
 *
 * Sažeto: novcem se dobija položaj u zajedničkom dobru, ne kupovna moć i ne
 * glas. Ovi testovi gledaju IZVOR, jer je pouka u CLAUDE.md zapisana tri puta
 * (oglas deteta, zatvoren profil, lanac potvrda): ispravno pravilo ne vredi
 * ništa dok svaka staza zaista ne prođe kroz njega.
 */

const koren = join(__dirname, "..");
const izvor = (p: string) => readFileSync(join(koren, p), "utf-8");

describe("pravilo — prošireni krug", () => {
  it("potvrđen član je unutra", () => {
    expect(smeProsireno({ verified: true, identitetUtvrdjen: false })).toBe(true);
  });

  it("član sa utvrđenim identitetom je unutra", () => {
    expect(smeProsireno({ verified: false, identitetUtvrdjen: true })).toBe(true);
  });

  it("nov član bez oboje je napolju", () => {
    expect(smeProsireno({ verified: false, identitetUtvrdjen: false })).toBe(false);
    expect(smeProsireno(null)).toBe(false);
  });
});

describe("pravilo — glas u Gornjem Kolu", () => {
  it("glas traži aktivirano ZRNO I potvrđenu stvarnost", () => {
    expect(smeGlasati({ verified: true }, 5)).toBe(true);
  });

  it("🔴 ZRNO upisano iz donacije ne nosi glas dok stvarnost nije potvrđena", () => {
    expect(smeGlasati({ verified: false, identitetUtvrdjen: true }, 5)).toBe(false);
  });

  it("potvrđen član bez aktiviranog ZRNA ne glasa", () => {
    expect(smeGlasati({ verified: true }, 0)).toBe(false);
  });
});

describe("otvoreno identifikovanom članu — svaka staza kroz pravilo", () => {
  const staze: [string, string][] = [
    ["oglas POTRAŽNJA i više od tri oglasa", "src/app/api/pijaca/route.ts"],
    ["Pričaonica", "src/app/api/chat/route.ts"],
    ["pretraga članova", "src/app/api/korisnici/pretraga/route.ts"],
    ["pokretanje razgovora", "src/app/api/poruke/route.ts"],
    ["upis ZRNA", "src/app/api/zrno/upis/route.ts"],
    ["sužen pregled tuđeg profila", "src/app/api/profil/[id]/route.ts"],
  ];
  for (const [sta, put] of staze) {
    it(`${sta} prolazi kroz smeProsireno`, () => {
      expect(izvor(put)).toContain("smeProsireno");
    });
  }

  it("profil vraća oznaku suženog pregleda, a ne 403", () => {
    const ruta = izvor("src/app/api/profil/[id]/route.ts");
    expect(ruta).toContain("suzen");
    // Telefon ostaje zatvoren — Politika 4.8 ga obećava „isključivo verifikovanim".
    expect(ruta).toContain("!suzen && (jeVlasnik || podaci?.prikaziTelefon)");
  });
});

describe("zatvoreno i posle donacije — razlika između R-01 = 5 i R-01 = 9", () => {
  const zatvorene: [string, string][] = [
    ["operativni doprinos", "src/app/api/doprinos-oglasi/[id]/prijavi/route.ts"],
    ["socijalni programi", "src/app/api/programi/[type]/prijava/route.ts"],
    ["pokroviteljstvo", "src/app/api/pokroviteljstvo/prijava/route.ts"],
    ["otpis ZRNA", "src/app/api/zrno/otpis/route.ts"],
    ["aktiviranje ZRNA", "src/app/api/zrno/zakljucaj/route.ts"],
    ["otključavanje ZRNA", "src/app/api/zrno/otkljucaj/route.ts"],
    ["delegiranje glasa", "src/app/api/zrno/delegiraj/route.ts"],
    ["mreža potvrda", "src/app/api/verifikacija/lanac/[korisnikId]/route.ts"],
  ];
  for (const [sta, put] of zatvorene) {
    it(`${sta} i dalje traži potvrđenu stvarnost`, () => {
      const t = izvor(put);
      expect(t).toContain("session.user.verified");
      expect(t).not.toContain("smeProsireno");
    });
  }

  it("prepis POEN-a ostaje vezan za TIP naloga (čl. 28 st. 2)", () => {
    const transfer = izvor("src/app/api/transfer/route.ts");
    expect(transfer).toContain("smeDaSalje");
    expect(transfer).not.toContain("smeProsireno");
  });

  it("gašenje naloga nije drugi ulaz za prepis (mera P-2)", () => {
    const profil = izvor("src/app/api/profil/route.ts");
    expect(profil).toContain("smeDaSalje(user.tipKorisnika)");
    expect(profil).toContain("primalacPseudonim && smeDaPrenese");
  });

  it("glasanje traži i potvrdu, ne samo aktivno ZRNO", () => {
    for (const p of ["src/app/api/glasanje/route.ts", "src/app/api/glasanje/[id]/glasaj/route.ts"]) {
      expect(izvor(p)).toContain("smeGlasati");
    }
  });
});

describe("status nosioca ZRNA se ne dodeljuje nepotvrđenom nalogu", () => {
  it("upis ZRNA unapređuje samo potvrđenog člana", () => {
    // `NOSILAC_ZRNA` nadjačava indeks: neograničen kapacitet potvrda, izuzeće od
    // nadzora, pun pristup programima. Dodeljen nepotvrđenom nalogu, obara opciju B.
    expect(izvor("src/lib/protokol/zrno.ts")).toContain(
      "z.user.tipKorisnika === TipKorisnika.REGULARNI"
    );
  });

  it("potvrda stvarnosti sustiže status onome ko ZRNO već drži", () => {
    const servis = izvor("src/lib/protokol/verifikacija-service.ts");
    expect(servis).toContain("drziZrno");
    expect(servis).toContain("TipKorisnika.NOSILAC_ZRNA");
  });
});
