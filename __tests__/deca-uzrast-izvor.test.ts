import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRAG_ODOBRENJA_MLADJI,
  PRAG_ODOBRENJA_STARIJI,
  ROK_ODOBRENJA_PREPISA_DANA,
  UZRAST_SA_ODRASLIMA,
  granicaDatumaZaUzrast,
  pragOdobrenja,
  smeDaKomunicira,
  smeDaVidiOglas,
  smeSaOdraslima,
  trebaOdobrenjeRoditelja,
  type Ucesnik,
} from "@/lib/deca-pravila";
import { smePrijaviti } from "@/lib/razmena-prijava";

/**
 * Uzrasne grupe 7–14 i 15–17 (Pravilnik o učešću dece, čl. 12) — brana.
 *
 * Do seta 4.5.3 su svi maloletni korisnici bili jedna grupa, pa je sedmogodišnjak
 * smeo isto što i sedamnaestogodišnjak: uz prekidač roditelja i da razmenjuje sa
 * punoletnima, i da mu oglas bude javno vidljiv njima. Ovo pravilo je pravno, ne
 * bezbednosno (Porodični zakon čl. 64), pa ga ne sme oboriti nijedan prekidač.
 *
 * Gleda i IZVOR — pravilo koje nijedan prikaz ne zove ne vredi ništa, što je u
 * ovom modulu već tri puta zapisano (oglasi, profil, lanac potvrda).
 */
function dete(godine: number | null, o: Partial<Ucesnik> = {}): Ucesnik {
  return {
    id: "d1",
    maloletan: true,
    godine,
    dozvolaOdrasli: true,
    roditeljIds: ["r1"],
    stanje: "AKTIVNO",
    ...o,
  };
}
const odrastao: Ucesnik = {
  id: "o1",
  maloletan: false,
  godine: null,
  dozvolaOdrasli: false,
  roditeljIds: [],
  stanje: "AKTIVNO",
};
const roditelj: Ucesnik = { ...odrastao, id: "r1" };

function izvor(p: string): string {
  return readFileSync(join(process.cwd(), p), "utf-8");
}

describe("granica prema punoletnima (čl. 12)", () => {
  it("granica je 15 godina", () => {
    expect(UZRAST_SA_ODRASLIMA).toBe(15);
    expect(smeSaOdraslima(dete(14))).toBe(false);
    expect(smeSaOdraslima(dete(15))).toBe(true);
    // Nepoznat uzrast (nalog koji čeka preuzimanje) pada na stroži režim.
    expect(smeSaOdraslima(dete(null))).toBe(false);
    expect(smeSaOdraslima(odrastao)).toBe(true);
  });

  it("🔴 saglasnost roditelja NE otvara razgovor detetu do 15", () => {
    const mlad = smeDaKomunicira(dete(12), odrastao);
    expect(mlad.ok).toBe(false);
    expect(smeDaKomunicira(dete(15), odrastao)).toEqual({ ok: true });
    // Prekidač i dalje mora da bude uključen za stariju grupu.
    expect(smeDaKomunicira(dete(16, { dozvolaOdrasli: false }), odrastao).ok).toBe(false);
    // Među decom uzrast ne igra ulogu.
    expect(smeDaKomunicira(dete(8), dete(17, { id: "d2" }))).toEqual({ ok: true });
  });

  it("🔴 oglas deteta do 15 punoletnom nije vidljiv ni uz saglasnost", () => {
    expect(smeDaVidiOglas(odrastao, dete(12))).toBe(false);
    expect(smeDaVidiOglas(odrastao, dete(15))).toBe(true);
    // Roditelj svoje dete vidi uvek.
    expect(smeDaVidiOglas(roditelj, dete(12))).toBe(true);
    // Drugo dete vidi uvek.
    expect(smeDaVidiOglas(dete(9, { id: "d2", roditeljIds: [] }), dete(12))).toBe(true);
    // Obrnut smer: dete do 15 ne vidi oglase punoletnih.
    expect(smeDaVidiOglas(dete(12), odrastao)).toBe(false);
    expect(smeDaVidiOglas(dete(16), odrastao)).toBe(true);
  });

  it("uzrasni uslov je i u upitu nad bazom, ne samo u čistoj funkciji", () => {
    const deca = izvor("src/lib/protokol/deca.ts");
    expect(deca).toContain("granicaDatumaZaUzrast(UZRAST_SA_ODRASLIMA");
    expect(deca).toContain("smeSaOdraslima(posmatrac)");
  });

  it("granica datuma se poklapa sa računanjem uzrasta", () => {
    const danas = new Date("2026-09-11T00:00:00.000Z");
    expect(granicaDatumaZaUzrast(15, danas).toISOString()).toBe("2011-09-11T00:00:00.000Z");
  });
});

describe("odobrenje roditelja za veći prepis (čl. 14)", () => {
  it("dva praga, po uzrasnoj grupi", () => {
    expect(PRAG_ODOBRENJA_MLADJI).toBe(5_000);
    expect(PRAG_ODOBRENJA_STARIJI).toBe(20_000);
    expect(ROK_ODOBRENJA_PREPISA_DANA).toBe(7);
    expect(pragOdobrenja(14)).toBe(5_000);
    expect(pragOdobrenja(15)).toBe(20_000);
    expect(pragOdobrenja(null)).toBe(5_000);
  });

  it("traži se samo za ODLIV iz dečjeg zapisa, i to iznad praga", () => {
    const d = dete(10);
    const drugo = dete(11, { id: "d2", roditeljIds: ["r9"] });
    expect(trebaOdobrenjeRoditelja(d, drugo, 4_999)).toBe(false);
    expect(trebaOdobrenjeRoditelja(d, drugo, 5_000)).toBe(true);
    // Priliv se ne odobrava — maloletnik sam preduzima posao kojim pribavlja prava.
    expect(trebaOdobrenjeRoditelja(drugo, d, 100_000)).toBe(true); // odliv drugog deteta
    expect(trebaOdobrenjeRoditelja(odrastao, d, 100_000)).toBe(false);
    // Prepis sopstvenom roditelju je bez ograničenja (čl. 14 st. 2).
    expect(trebaOdobrenjeRoditelja(d, roditelj, 100_000)).toBe(false);
  });

  it("ruta čeka odobrenje umesto da izvrši prepis", () => {
    const ruta = izvor("src/app/api/transfer/route.ts");
    expect(ruta).toContain("trebaOdobrenjeRoditelja");
    expect(ruta).toContain("zatraziOdobrenje");
    // 🔴 Provera mora da stoji POSLE pokrića — nema smisla tražiti odobrenje za
    // iznos koji na zapisu ne postoji.
    expect(ruta.indexOf("balance < iznos")).toBeLessThan(
      ruta.indexOf("trebaOdobrenjeRoditelja(odUcesnik")
    );
  });

  it("POEN se ne skida dok roditelj ne odobri", () => {
    const servis = izvor("src/lib/protokol/prepis-odobrenje.ts");
    expect(servis).toContain("prepisOdobrenje.create");
    // U `zatraziOdobrenje` nema nijednog dodira wallet-a.
    const zatrazi = servis.slice(
      servis.indexOf("export async function zatraziOdobrenje"),
      servis.indexOf("export async function prepisiNaCekanju")
    );
    expect(zatrazi).not.toContain("wallet");
    // Pokriće se proverava PONOVO pri odluci — prolazi do sedam dana.
    expect(servis).toContain("jeNadoknada(dete.wallet.balance)");
  });
});

describe("roditeljska lozinka i prijava razmene", () => {
  it("roditelj ne postavlja lozinku detetu koje ima svoju adresu (čl. 10)", () => {
    const deca = izvor("src/lib/protokol/deca.ts");
    expect(deca).toContain("PORUKA_LOZINKA_IMA_ADRESU");
    expect(deca).toContain("sopstvenaAdresa?.email");
  });

  it("maloletni korisnik ne podnosi prijavu razmene (čl. 14 st. 8)", () => {
    const osnova = {
      tipTransakcije: "TRANSFER",
      posiljaocId: "ja",
      prijaviocId: "ja",
      vecPrijavljena: false,
      otvorenihPrijava: 0,
      opis: "Prepisao sam POEN, robu nisam dobio.",
    };
    expect(smePrijaviti({ ...osnova, prijaviocMaloletan: false })).toEqual({ ok: true });
    expect(smePrijaviti({ ...osnova, prijaviocMaloletan: true }).ok).toBe(false);
  });
});

describe("copy prati pravilo na svih pet jezika", () => {
  for (const j of ["sr", "en", "ru", "hr", "hu"] as const) {
    it(`${j}: prekidač ima tekst za zatvoreno stanje i prepis ima svoj odeljak`, () => {
      const m = JSON.parse(izvor(`messages/${j}.json`));
      expect(m.deca.prekidac_zatvoren).toBeTruthy();
      expect(m.deca.lozinka_ima_adresu).toBeTruthy();
      expect(m.deca.prepis_odobri).toBeTruthy();
      expect(m.novcanik.send_ceka_naslov).toBeTruthy();
      expect(m.notifikacije.prepis_odobrenje_tekst).toContain("{dete}");
    });
  }
});
