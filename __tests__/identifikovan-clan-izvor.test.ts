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

describe("🔴 anonimna donacija NE daje svojstvo identifikovanog člana", () => {
  it("identitetUtvrdjenAt se postavlja samo uz javnu donaciju", () => {
    // Anonimna donacija ne nosi POEN (čl. 5a st. 2 pravilnika o donacijama:
    // upis koji se ne može pripisati licu nije proverljiv), pa ne nastaje ni
    // položaj koji bi proširena prava pratila. Uz to je `identitetUtvrdjen`
    // javna oznaka „donator“ — postavljena po anonimnoj donaciji, odala bi
    // upravo onoga kome Politika obećava suprotno.
    const servis = izvor("src/lib/protokol/donacija.ts");
    expect(servis).toContain("if (javno && uplatilac && !user.identitetUtvrdjenAt)");
    expect(servis).not.toContain("if (uplatilac && !user.identitetUtvrdjenAt)");
  });
});

describe("oznaka „donator“ (odluka vlasnika, 13.09.2026)", () => {
  it("prikazuje se umesto oznake za novog člana, ne uz potvrđenog", () => {
    const prikaz = izvor("src/components/verifikacija/IndeksPrikaz.tsx");
    expect(prikaz).toContain("tip_donator");
    // Samo NEVERIFIKOVAN nalog: potvrđenom je „redovan član" jači podatak, a
    // dete i osnivač imaju svoje oznake.
    expect(prikaz).toContain('tip === "NEVERIFIKOVAN"');
  });

  it("izvor oznake dolazi sa servera, ne iz pretpostavke ekrana", () => {
    expect(izvor("src/app/api/verifikacija/lanac/[korisnikId]/route.ts")).toContain(
      "identitetUtvrdjen: user.identitetUtvrdjenAt !== null"
    );
    expect(izvor("src/app/(app)/sistem/page.tsx")).toContain(
      "identitetUtvrdjen: u.identitetUtvrdjenAt !== null"
    );
  });

  it("spisak članova ne prikazuje javnog donatora kao „?“", () => {
    expect(izvor("src/app/(app)/sistem/SistemKlijent.tsx")).toContain(
      "!c.verified && c.identitetUtvrdjen"
    );
  });
});

describe("ekran za upis i otpis ZRNA (odluka D-1)", () => {
  const ekran = () => izvor("src/app/(app)/zrno/ZrnoKlijent.tsx");

  it("upozorenje pre upisa postoji i imenuje sva tri zatvorena poteza", () => {
    // Odluka D-1: identifikovan član ZRNO upisuje JEDNOSMERNO. Bez upozorenja
    // pravo bi se ostvarivalo naslepo — čovek bi saznao tek kad ga ruta odbije.
    expect(ekran()).toContain("donator_upozorenje");
    for (const jezik of ["sr", "en", "ru", "hr", "hu"]) {
      const poruke = JSON.parse(izvor(`messages/${jezik}.json`));
      const tekst: string = poruke.zrno.donator_upozorenje;
      expect(tekst.length).toBeGreaterThan(40);
    }
  });

  it("otpis i aktiviranje su zatvoreni identifikovanom članu", () => {
    const s = ekran();
    expect(s).toContain("const samoUpis = !isVerified && identitetUtvrdjen;");
    expect(s).toContain("zatvorenaKartica(t(\"otpis_naslov\")");
    expect(s).toContain("zatvorenaKartica(t(\"status_naslov\")");
  });

  it("ekran postoji za sve tri rute koje do sada nisu imale ulaznu tačku", () => {
    const s = ekran();
    expect(s).toContain("/api/zrno/upis");
    expect(s).toContain("/api/zrno/otpis");
    expect(s).toContain("/api/zrno/zakljucaj");
    expect(s).toContain("/api/zrno/otkljucaj");
  });
});
