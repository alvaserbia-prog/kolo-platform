import { describe, it, expect } from "vitest";
import {
  NAJAVA_PUNOLETSTVA_DANA,
  PRIJATELJSTVO_POEN,
  ROK_POTVRDE_DANA,
  ROK_PREUZIMANJA_DANA,
  UZRAST_MIN,
  UZRAST_PUNOLETSTVO,
  danaDoIsteka,
  jeMojeDete,
  jeUMirovanju,
  rokIzjasnjenja,
  smeDaKomunicira,
  smeDaPrepise,
  smeDaVidiOglas,
  uzrast,
  uzrastZaModul,
  datumPunoletstva,
  jePunoletan,
  nalogRadi,
  otpisPriPunoletstvu,
  poenSeUpisuje,
  prijateljstvoNosiPoen,
  rokPreuzimanja,
  smeUPricaonicu,
  stanjeDeteta,
  suBracaISestre,
  vremeZaNajavuPunoletstva,
  type Ucesnik,
  smeDaVidiProfilDeteta,
} from "@/lib/deca-pravila";

const DANAS = new Date("2026-08-14T00:00:00.000Z");

function dete(o: Partial<Ucesnik> = {}): Ucesnik {
  return { id: "d1", maloletan: true, dozvolaOdrasli: false, roditeljIds: ["r1"], stanje: "AKTIVNO", ...o };
}
function odrastao(o: Partial<Ucesnik> = {}): Ucesnik {
  return { id: "o1", maloletan: false, dozvolaOdrasli: false, roditeljIds: [], stanje: "AKTIVNO", ...o };
}

describe("uzrast", () => {
  it("računa navršene godine", () => {
    expect(uzrast(new Date("2016-08-14T00:00:00.000Z"), DANAS)).toBe(10);
  });

  it("rođendan koji još nije stigao ne računa se", () => {
    expect(uzrast(new Date("2016-08-15T00:00:00.000Z"), DANAS)).toBe(9);
  });

  it("rođendan tog dana se računa", () => {
    expect(uzrast(new Date("2016-08-14T00:00:00.000Z"), DANAS)).toBe(10);
  });
});

describe("uzrastZaModul — granice iz čl. 2", () => {
  it(`odbija ispod ${UZRAST_MIN}`, () => {
    expect(uzrastZaModul(UZRAST_MIN - 1).ok).toBe(false);
  });
  it(`prima ${UZRAST_MIN}`, () => {
    expect(uzrastZaModul(UZRAST_MIN).ok).toBe(true);
  });
  it(`prima ${UZRAST_PUNOLETSTVO - 1}`, () => {
    expect(uzrastZaModul(UZRAST_PUNOLETSTVO - 1).ok).toBe(true);
  });
  it(`odbija ${UZRAST_PUNOLETSTVO}`, () => {
    expect(uzrastZaModul(UZRAST_PUNOLETSTVO).ok).toBe(false);
  });
});

describe("smeDaKomunicira — čl. 12", () => {
  it("dvoje dece smeju uvek, bez ijedne saglasnosti", () => {
    expect(smeDaKomunicira(dete({ id: "a" }), dete({ id: "b", roditeljIds: ["r2"] })).ok).toBe(true);
  });

  it("dete i odrastao ne smeju bez saglasnosti roditelja", () => {
    expect(smeDaKomunicira(dete(), odrastao()).ok).toBe(false);
  });

  it("saglasnost otvara odnos u OBA smera", () => {
    const d = dete({ dozvolaOdrasli: true });
    expect(smeDaKomunicira(d, odrastao()).ok).toBe(true);
    expect(smeDaKomunicira(odrastao(), d).ok).toBe(true);
  });

  it("🔴 saglasnost stoji na DETETU — odrastao je ne daje sebi", () => {
    // Da se čitala sa punoletne strane, svaki odrastao bi mogao da otvori odnos
    // prema svakom detetu prostim postavljanjem sopstvenog prekidača.
    expect(smeDaKomunicira(dete(), odrastao({ dozvolaOdrasli: true })).ok).toBe(false);
  });

  it("par dvoje punoletnih ovaj modul ne dodiruje", () => {
    expect(smeDaKomunicira(odrastao({ id: "a" }), odrastao({ id: "b" })).ok).toBe(true);
  });
});

describe("smeDaPrepise — čl. 14", () => {
  it("roditelj prepisuje svom detetu i bez saglasnosti (st. 2)", () => {
    const r = odrastao({ id: "r1" });
    expect(smeDaPrepise(r, dete({ roditeljIds: ["r1"] })).ok).toBe(true);
  });

  it("dete prepisuje sopstvenom roditelju i bez saglasnosti", () => {
    expect(smeDaPrepise(dete({ roditeljIds: ["r1"] }), odrastao({ id: "r1" })).ok).toBe(true);
  });

  it("🔴 punoletni ne prepisuje TUĐEM detetu bez saglasnosti", () => {
    expect(smeDaPrepise(odrastao({ id: "x" }), dete({ roditeljIds: ["r1"] })).ok).toBe(false);
  });

  it("deca prepisuju međusobno", () => {
    expect(smeDaPrepise(dete({ id: "a" }), dete({ id: "b", roditeljIds: ["r2"] })).ok).toBe(true);
  });

  /**
   * 🔴 Prepis NE čeka potvrdu roditelja — čeka samo preuzimanje naloga.
   *
   * Potvrda roditelja je uslov za UPIS iz prijateljstava (čl. 14b st. 2), jer
   * upis stvara nove POEN-e i tu je odbrana od farmovanja. Prepis nijedan POEN
   * ne stvara: seli postojeći zapis, zero-sum ostaje isti — pa bi vezivanje za
   * potvrdu zaustavljalo decu bez ijedne koristi po sistem.
   */
  it("dete u stanju POVEZANO prepisuje i prima, iako mu se POEN još ne upisuje", () => {
    const a = dete({ id: "a", roditeljIds: ["r1"], stanje: "POVEZANO" });
    const b = dete({ id: "b", roditeljIds: ["r2"], stanje: "AKTIVNO" });
    expect(smeDaPrepise(a, b).ok).toBe(true);
    expect(smeDaPrepise(b, a).ok).toBe(true);
    // ...ali upis iz prijateljstva i dalje čeka obe strane.
    expect(poenSeUpisuje("POVEZANO")).toBe(false);
    expect(prijateljstvoNosiPoen(a, b)).toBe(false);
  });

  it("🔴 nalog koji još čeka roditelja ne prepisuje ni u jednom smeru", () => {
    const ceka = dete({ id: "c", roditeljIds: [], stanje: "NA_CEKANJU" });
    const drugo = dete({ id: "d", roditeljIds: ["r2"], stanje: "AKTIVNO" });
    expect(smeDaPrepise(ceka, drugo).ok).toBe(false);
    expect(smeDaPrepise(drugo, ceka).ok).toBe(false);
  });
});

describe("smeDaVidiOglas — čl. 13", () => {
  const oglasivac = dete({ id: "d1", roditeljIds: ["r1"] });

  it("🔴 gost NIKADA ne vidi oglas maloletnog korisnika", () => {
    expect(smeDaVidiOglas(null, oglasivac)).toBe(false);
  });

  it("drugo dete ga vidi", () => {
    expect(smeDaVidiOglas(dete({ id: "d2", roditeljIds: ["r2"] }), oglasivac)).toBe(true);
  });

  it("sopstveni roditelj ga vidi i kad je prekidač isključen", () => {
    expect(smeDaVidiOglas(odrastao({ id: "r1" }), oglasivac)).toBe(true);
  });

  it("tuđi punoletni ga ne vidi bez saglasnosti, a vidi sa njom", () => {
    expect(smeDaVidiOglas(odrastao({ id: "x" }), oglasivac)).toBe(false);
    expect(smeDaVidiOglas(odrastao({ id: "x" }), { ...oglasivac, dozvolaOdrasli: true })).toBe(true);
  });

  it("admin ga vidi — bez toga moderacija prijavljenog oglasa ne radi", () => {
    expect(smeDaVidiOglas({ ...odrastao({ id: "x" }), admin: true }, oglasivac)).toBe(true);
  });

  it("oglas punoletnog je javan, a detetu se prikazuje uz saglasnost", () => {
    const o = odrastao({ id: "o1" });
    expect(smeDaVidiOglas(null, o)).toBe(true);
    expect(smeDaVidiOglas(dete(), o)).toBe(false);
    expect(smeDaVidiOglas(dete({ dozvolaOdrasli: true }), o)).toBe(true);
  });
});

describe("jeMojeDete", () => {
  it("razlikuje sopstveno dete od tuđeg", () => {
    expect(jeMojeDete(odrastao({ id: "r1" }), dete({ roditeljIds: ["r1"] }))).toBe(true);
    expect(jeMojeDete(odrastao({ id: "r2" }), dete({ roditeljIds: ["r1"] }))).toBe(false);
  });

  it("punoletan korisnik nikome nije dete", () => {
    expect(jeMojeDete(odrastao({ id: "r1" }), odrastao({ id: "x" }))).toBe(false);
  });
});

describe("mirovanje — čl. 16", () => {
  it("nastupa kad indeks roditelja padne ispod praga", () => {
    expect(jeUMirovanju({ verified: true, indeksStvarnosti: 0 }, 10)).toBe(true);
    expect(jeUMirovanju({ verified: true, indeksStvarnosti: 10 }, 10)).toBe(false);
  });

  it("nastupa i kad roditelj uopšte nije potvrđen", () => {
    expect(jeUMirovanju({ verified: false, indeksStvarnosti: 100 }, 10)).toBe(true);
  });
});

describe("rok izjašnjenja — čl. 6 st. 2", () => {
  it(`traje ${ROK_POTVRDE_DANA} dana od otvaranja naloga`, () => {
    const rok = rokIzjasnjenja(DANAS);
    expect(danaDoIsteka(rok, DANAS)).toBe(ROK_POTVRDE_DANA);
  });

  it("istekao rok daje nulu, ne negativan broj", () => {
    expect(danaDoIsteka(new Date("2026-01-01"), DANAS)).toBe(0);
  });
});


describe("tri stanja naloga — čl. 4c", () => {
  const redovan = { aktivan: true, redovan: true };
  const novClan = { aktivan: true, redovan: false };

  it("bez ijednog roditelja nalog ČEKA", () => {
    expect(stanjeDeteta([])).toBe("NA_CEKANJU");
  });

  it("roditelj koji nije redovan član daje POVEZANO", () => {
    expect(stanjeDeteta([novClan])).toBe("POVEZANO");
  });

  it("🔴 dovoljan je JEDAN redovan roditelj — dvoje ne sme da bude gore od jednog", () => {
    expect(stanjeDeteta([novClan, redovan])).toBe("AKTIVNO");
  });

  it("ugašen roditelj se ne broji", () => {
    expect(stanjeDeteta([{ aktivan: false, redovan: true }])).toBe("NA_CEKANJU");
  });

  it("🔴 Pričaonica se otvara tek kad nalog preuzme neko ko je prošao registraciju", () => {
    expect(smeUPricaonicu("NA_CEKANJU")).toBe(false);
    expect(smeUPricaonicu("POVEZANO")).toBe(true);
    expect(smeUPricaonicu("AKTIVNO")).toBe(true);
  });

  it("POEN se upisuje tek u stanju AKTIVNO", () => {
    expect(poenSeUpisuje("POVEZANO")).toBe(false);
    expect(poenSeUpisuje("AKTIVNO")).toBe(true);
  });

  it("nalog na čekanju ne objavljuje, ne piše i ne prepisuje", () => {
    expect(nalogRadi("NA_CEKANJU")).toBe(false);
    expect(nalogRadi("POVEZANO")).toBe(true);
  });
});

describe("nalog na čekanju u komunikaciji i prepisu", () => {
  const naCekanju = dete({ id: "c", roditeljIds: [], stanje: "NA_CEKANJU" });

  it("ne može da piše ni drugom detetu", () => {
    expect(smeDaKomunicira(naCekanju, dete({ id: "b", roditeljIds: ["r2"] })).ok).toBe(false);
  });

  it("ne može da prepiše POEN nikome", () => {
    expect(smeDaPrepise(naCekanju, dete({ id: "b", roditeljIds: ["r2"] })).ok).toBe(false);
  });

  it("ni odrastao ne može njemu, ni uz uključen prekidač", () => {
    expect(
      smeDaKomunicira(odrastao({ id: "x" }), { ...naCekanju, dozvolaOdrasli: true }).ok
    ).toBe(false);
  });
});

describe("prijateljstvo nosi POEN — čl. 14b", () => {
  const a = dete({ id: "a", roditeljIds: ["r1"] });
  const b = dete({ id: "b", roditeljIds: ["r2"] });

  it("dve aktivne strane, različiti roditelji — nosi", () => {
    expect(prijateljstvoNosiPoen(a, b)).toBe(true);
  });

  it("🔴 obostrano čekanje: dok jedna strana nije aktivna, ne nosi", () => {
    expect(prijateljstvoNosiPoen(a, { ...b, stanje: "POVEZANO" })).toBe(false);
    expect(prijateljstvoNosiPoen({ ...a, stanje: "NA_CEKANJU" }, b)).toBe(false);
  });

  it("🔴 braća i sestre — prijateljstvo radi, ali POEN ne nosi", () => {
    const brat = dete({ id: "b2", roditeljIds: ["r1"] });
    expect(suBracaISestre(a, brat)).toBe(true);
    expect(prijateljstvoNosiPoen(a, brat)).toBe(false);
    // Zajednički je dovoljan JEDAN roditelj — polubrat je isto brat.
    expect(suBracaISestre(a, dete({ id: "b3", roditeljIds: ["r1", "r9"] }))).toBe(true);
  });

  it("punoletan korisnik u prijateljstvu ne učestvuje", () => {
    expect(prijateljstvoNosiPoen(a, odrastao({ id: "o" }))).toBe(false);
  });
});

describe("punoletstvo — čl. 19", () => {
  it("otpis je broj isplaćenih prijateljstava × 500", () => {
    expect(otpisPriPunoletstvu(0)).toBe(0);
    expect(otpisPriPunoletstvu(30)).toBe(30 * PRIJATELJSTVO_POEN);
    expect(otpisPriPunoletstvu(30)).toBe(15_000);
  });

  it("datum punoletstva je osamnaesti rođendan", () => {
    expect(datumPunoletstva(new Date("2008-08-14T00:00:00.000Z")).toISOString().slice(0, 10)).toBe(
      "2026-08-14"
    );
  });

  it("jePunoletan hvata sam dan rođendana, ne dan posle", () => {
    expect(jePunoletan(new Date("2008-08-14T00:00:00.000Z"), DANAS)).toBe(true);
    expect(jePunoletan(new Date("2008-08-15T00:00:00.000Z"), DANAS)).toBe(false);
  });

  it("nalog bez datuma rođenja (dete na čekanju) nikad nije punoletan", () => {
    expect(jePunoletan(null, DANAS)).toBe(false);
    expect(vremeZaNajavuPunoletstva(null, DANAS)).toBe(false);
  });

  it(`najava ide ${NAJAVA_PUNOLETSTVA_DANA} dana ranije, ne pre i ne posle`, () => {
    // Rođendan za 20 dana → u prozoru; za 40 dana → još ne.
    expect(vremeZaNajavuPunoletstva(new Date("2008-09-03T00:00:00.000Z"), DANAS)).toBe(true);
    expect(vremeZaNajavuPunoletstva(new Date("2008-10-01T00:00:00.000Z"), DANAS)).toBe(false);
    // Već punoletan — najava nema smisla, obrada je na redu.
    expect(vremeZaNajavuPunoletstva(new Date("2008-08-01T00:00:00.000Z"), DANAS)).toBe(false);
  });
});

describe("rok preuzimanja naloga — čl. 4b st. 5", () => {
  it(`traje ${ROK_PREUZIMANJA_DANA} dana od registracije deteta`, () => {
    expect(danaDoIsteka(rokPreuzimanja(DANAS), DANAS)).toBe(ROK_PREUZIMANJA_DANA);
  });
});

describe("pristup profilu maloletnog korisnika", () => {
  // Načelo: do deteta se dolazi samo kroz ono što je dete sámo objavilo. Ranglista
  // i knjiga zapisa pokazuju da dete postoji — one nisu vrata ni u šta.

  it("punoletan član NE otvara profil deteta", () => {
    expect(smeDaVidiProfilDeteta(odrastao(), dete(), false)).toBe(false);
  });

  it("ni kad je roditeljski prekidač upaljen", () => {
    // Prekidač iz čl. 10 otvara komunikaciju i razmenu, ne profil. Da ga otvara,
    // roditelj bi jednim potezom otključao i ono što nikad nije ni razmatrao.
    expect(smeDaVidiProfilDeteta(odrastao(), dete({ dozvolaOdrasli: true }), false)).toBe(false);
  });

  it("roditelj svog deteta vidi profil (čl. 9)", () => {
    expect(smeDaVidiProfilDeteta(odrastao({ id: "r1" }), dete(), false)).toBe(true);
  });

  it("Fondacija vidi profil — bez toga nema moderacije", () => {
    expect(smeDaVidiProfilDeteta({ ...odrastao(), admin: true }, dete(), false)).toBe(true);
  });

  it("dete vidi profil SAMO svog prijatelja", () => {
    const drugo = dete({ id: "d2", roditeljIds: ["r9"] });
    expect(smeDaVidiProfilDeteta(drugo, dete(), true)).toBe(true);
    expect(smeDaVidiProfilDeteta(drugo, dete(), false)).toBe(false);
  });

  it("dete iz iste škole koje nije prijatelj ne prolazi", () => {
    // Lista unutar škole pokazuje nadimak koji se ne može otvoriti. Put do drugog
    // deteta ostaje jedan: skeniran QR kod uživo.
    expect(smeDaVidiProfilDeteta(dete({ id: "d2", roditeljIds: ["r9"] }), dete(), false)).toBe(false);
  });

  it("svako vidi sopstveni profil", () => {
    expect(smeDaVidiProfilDeteta(dete(), dete(), false)).toBe(true);
  });

  it("gost ne vidi profil deteta", () => {
    expect(smeDaVidiProfilDeteta(null, dete(), false)).toBe(false);
  });

  it("profil punoletnog korisnika ovo pravilo ne dodiruje", () => {
    expect(smeDaVidiProfilDeteta(odrastao({ id: "o2" }), odrastao(), false)).toBe(true);
    expect(smeDaVidiProfilDeteta(null, odrastao(), false)).toBe(true);
  });
});
