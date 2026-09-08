import { describe, it, expect } from "vitest";
import {
  KOEFICIJENT_TROSENJA,
  MESECI_REZERVE,
  NAJMANJE_PONUDA,
  ROK_PRIJAVE_DANA,
  ROK_POTVRDE_DANA,
  PERIOD_PREUZIMANJA_DANA,
  normalizujNaziv,
  ociscenNaziv,
  validanNaziv,
  raspolozivoZaProjekte,
  gornjaGranicaTrosenja,
  validniParametri,
  brojDelova,
  ukupanTrosak,
  ispunjavaPrag,
  PRAG_POENA_ZA_UCESCE,
  izracunajKalkulaciju,
  poredjajRed,
  krajDana,
  rokPrijave,
  rokPotvrde,
  krajPeriodaPreuzimanja,
  danJeUPeriodu,
  predlogIstice,
  smeUcestvovati,
  utvrdiIzbor,
} from "@/lib/nabavka-pravila";

describe("konstante iz akta", () => {
  // 🔴 Ovi brojevi stoje DOSLOVNO u Pravilniku o projektima i kolektivnim
  // nabavkama i zaključani su i u `pravni-dokumenti.test.ts`. Ako se ovde promene
  // a u aktu ne, norma i primena se razilaze.
  it("koeficijent trošenja je 1,00 (čl. 8 st. 2)", () => {
    expect(KOEFICIJENT_TROSENJA).toBe(1.0);
  });
  it("rezerva je tri operativna troška prethodnog meseca (čl. 5 st. 3)", () => {
    expect(MESECI_REZERVE).toBe(3);
  });
  it("traži se najmanje tri ponude (čl. 15 st. 1)", () => {
    expect(NAJMANJE_PONUDA).toBe(3);
  });
  it("sva tri roka su po tri dana (čl. 21, 23, 26)", () => {
    expect(ROK_PRIJAVE_DANA).toBe(3);
    expect(ROK_POTVRDE_DANA).toBe(3);
    expect(PERIOD_PREUZIMANJA_DANA).toBe(3);
  });
});

describe("rečnik naziva", () => {
  it("normalizuje veličinu slova i višak razmaka", () => {
    expect(normalizujNaziv("  ĐUBRIVO   NPK ")).toBe("đubrivo npk");
    expect(normalizujNaziv("Đubrivo NPK")).toBe("đubrivo npk");
  });

  it("prikazni oblik zadržava slova, samo sređuje razmake", () => {
    expect(ociscenNaziv("  Đubrivo   NPK ")).toBe("Đubrivo NPK");
  });

  // Dijakritika se NAMERNO ne skida — spajanje „djubrivo" i „đubrivo" spojilo bi i
  // parove koji nisu isti, a rečnik ionako nudi postojeće nazive pri kucanju.
  it("ne skida kvačice", () => {
    expect(normalizujNaziv("djubrivo")).not.toBe(normalizujNaziv("đubrivo"));
  });

  it("prihvata nazive dobara, odbija rečenice i prazno", () => {
    expect(validanNaziv("gorivo")).toBe(true);
    expect(validanNaziv("Đubrivo NPK 15:15:15".replace(/:/g, "-"))).toBe(true);
    expect(validanNaziv("cement 25 kg")).toBe(true);
    expect(validanNaziv("a")).toBe(false);
    expect(validanNaziv("   ")).toBe(false);
    expect(validanNaziv("x".repeat(41))).toBe(false);
    expect(validanNaziv("!!!")).toBe(false);
  });
});

describe("sredstva (čl. 5 i 8)", () => {
  it("oduzima rezervu od tri operativna troška", () => {
    expect(raspolozivoZaProjekte(640_000, 85_000)).toBe(385_000);
  });

  it("nikad ne vraća negativno — nabavka se tada ne sprovodi", () => {
    expect(raspolozivoZaProjekte(100_000, 85_000)).toBe(0);
    expect(raspolozivoZaProjekte(0, 0)).toBe(0);
  });

  it("gornja granica je raspoloživo × koeficijent", () => {
    expect(gornjaGranicaTrosenja(385_000)).toBe(385_000);
  });
});

// 🔴 Set 4.4.3 — paritet je ODVEZAN. Broj POEN-a po delu je parametar odluke o
// nabavci; funkcija koja ga je računala iz maloprodajne reference (`poenPoDelu`) i
// merilo `odnosPonistenja` su obrisani, jer su oboje objavljivali odnos POEN-a
// prema dinaru. Ostaje samo provera ispravnosti unetog broja.
// 🔴 Set 4.4.3 — tok je OBRNUT. Odluka utvrđuje količinu, veličinu dela i broj
// POEN-a po delu PRE tendera; dinar ulazi tek kao provera staje li trošak u
// gornju granicu. Ranije se količina izvodila iz novca i cene, pa je raspodela
// bila izvedena iz cene. Ne vraćati izvođenje.
describe("parametri odluke (čl. 17)", () => {
  const p = { kolicina: 2000, velicinaDela: 20, poenPoDelu: 4000 };

  it("prima cele brojeve veće od nule", () => {
    expect(validniParametri(p)).toBe(true);
  });

  it("odbija nulu, negativan i decimalan broj", () => {
    expect(validniParametri({ ...p, poenPoDelu: 0 })).toBe(false);
    expect(validniParametri({ ...p, poenPoDelu: -100 })).toBe(false);
    expect(validniParametri({ ...p, velicinaDela: 20.5 })).toBe(false);
    expect(validniParametri({ ...p, kolicina: Number.NaN })).toBe(false);
  });

  // Delovi su jednaki (čl. 3), pa ostatak pri deljenju znači deo manji od
  // objavljenog — takva odluka se ne sprovodi.
  it("odbija količinu koja nije deljiva veličinom dela", () => {
    expect(validniParametri({ ...p, kolicina: 2010 })).toBe(false);
  });

  it("broj delova je količnik količine i veličine dela", () => {
    expect(brojDelova(2000, 20)).toBe(100);
    expect(brojDelova(60, 20)).toBe(3);
  });

  it("ukupan trošak je količina × nabavna cena", () => {
    expect(ukupanTrosak(2000, 150)).toBe(300_000);
  });
});

// Čl. 21 st. 1 — prag za prijavu. Vezan je za minimum za upis ZRNA iz čl. 19
// Pravilnika (20.000), da ne bi bio proizvoljan broj. Poreklo POEN-a se ne gleda.
describe("prag za učešće (čl. 21)", () => {
  it("prag je 20.000 POEN", () => {
    expect(PRAG_POENA_ZA_UCESCE).toBe(20_000);
  });

  it("na tačnoj granici prolazi", () => {
    expect(ispunjavaPrag(20_000)).toBe(true);
    expect(ispunjavaPrag(19_999)).toBe(false);
    expect(ispunjavaPrag(0)).toBe(false);
  });

  // Nadoknada i poništen prepis mogu odvesti zapis u minus (čl. 14 st. 3
  // Pravilnika) — takav nalog ne ulazi u red.
  it("negativan zapis ne ispunjava prag", () => {
    expect(ispunjavaPrag(-5_000)).toBe(false);
  });
});

describe("cela kalkulacija", () => {
  // Kasa 640.000, operativa 85.000/mesec → granica 385.000. Odluka: 100 vreća,
  // deo je jedna vreća, 4.280 POEN po delu. Tender daje 3.150 po vreći.
  const parametri = { kolicina: 100, velicinaDela: 1, poenPoDelu: 4280 };
  const ulaz = { saldoRSD: 640_000, trosakPrethodnogMesecaRSD: 85_000, nabavnaCena: 3150, parametri };

  it("prolazi ceo lanac od salda do broja poništenih POEN-a", () => {
    const k = izracunajKalkulaciju(ulaz)!;
    expect(k.rezervaRSD).toBe(255_000);
    expect(k.raspolozivoRSD).toBe(385_000);
    expect(k.gornjaGranicaRSD).toBe(385_000);
    expect(k.kolicina).toBe(100);
    expect(k.velicinaDela).toBe(1);
    expect(k.brojDelova).toBe(100);
    expect(k.poenPoDelu).toBe(4280);
    expect(k.ukupnoPoena).toBe(428_000);
    expect(k.ukupnoRSD).toBe(315_000);
  });

  it("trošak nikad ne prelazi gornju granicu", () => {
    const k = izracunajKalkulaciju(ulaz)!;
    expect(k.ukupnoRSD).toBeLessThanOrEqual(k.gornjaGranicaRSD);
  });

  it("nema kalkulacije kad rezerva pojede saldo", () => {
    expect(izracunajKalkulaciju({ ...ulaz, saldoRSD: 200_000 })).toBeNull();
  });

  // Čl. 18 st. 2 — prekoračenje granice nije greška u unosu nego ishod tendera:
  // nabavka se ne sprovodi, a nova odluka može utvrditi manju količinu.
  it("nema kalkulacije kad ukupan trošak pređe gornju granicu", () => {
    expect(izracunajKalkulaciju({ ...ulaz, nabavnaCena: 4000 })).toBeNull();
    expect(izracunajKalkulaciju({ ...ulaz, parametri: { ...parametri, kolicina: 200 } })).toBeNull();
  });

  it("nema kalkulacije bez ispravnih parametara odluke", () => {
    expect(izracunajKalkulaciju({ ...ulaz, parametri: { ...parametri, poenPoDelu: 0 } })).toBeNull();
    expect(izracunajKalkulaciju({ ...ulaz, parametri: { ...parametri, kolicina: 0 } })).toBeNull();
  });

  // 🔴 Brana protiv vraćanja izvođenja iz cene: jeftinija roba ne menja NIŠTA u
  // raspodeli — ni količinu, ni broj delova, ni broj POEN-a. Menja se samo koliko
  // je dinara Fondacija potrošila.
  it("cena ne utiče ni na jedan parametar raspodele", () => {
    const a = izracunajKalkulaciju(ulaz)!;
    const b = izracunajKalkulaciju({ ...ulaz, nabavnaCena: 1575 })!;
    expect(b.poenPoDelu).toBe(a.poenPoDelu);
    expect(b.brojDelova).toBe(a.brojDelova);
    expect(b.velicinaDela).toBe(a.velicinaDela);
    expect(b.kolicina).toBe(a.kolicina);
    expect(b.ukupnoRSD).toBe(157_500);
  });
});

describe("red (čl. 22)", () => {
  const d = (s: string) => new Date(s);
  const st = (userId: string, poen: number, prijava: string, nalog = "2026-01-01T00:00:00Z") => ({
    userId,
    poen,
    prijavljenoAt: d(prijava),
    nalogOd: d(nalog),
  });

  it("ređa po broju POEN-a, od većeg ka manjem", () => {
    const red = poredjajRed([
      st("a", 100, "2026-09-01T10:00:00Z"),
      st("b", 500, "2026-09-01T11:00:00Z"),
      st("c", 300, "2026-09-01T12:00:00Z"),
    ]);
    expect(red.map((r) => r.userId)).toEqual(["b", "c", "a"]);
  });

  it("pri istom broju POEN-a ispred je ko se ranije prijavio", () => {
    const red = poredjajRed([
      st("kasni", 100, "2026-09-01T12:00:00Z"),
      st("rani", 100, "2026-09-01T09:00:00Z"),
    ]);
    expect(red.map((r) => r.userId)).toEqual(["rani", "kasni"]);
  });

  it("pri potpunoj izjednačenosti ispred je stariji nalog", () => {
    const red = poredjajRed([
      st("noviji", 100, "2026-09-01T09:00:00Z", "2026-05-01T00:00:00Z"),
      st("stariji", 100, "2026-09-01T09:00:00Z", "2026-02-01T00:00:00Z"),
    ]);
    expect(red.map((r) => r.userId)).toEqual(["stariji", "noviji"]);
  });

  it("ne menja ulazni niz", () => {
    const ulaz = [st("a", 100, "2026-09-01T10:00:00Z"), st("b", 500, "2026-09-01T11:00:00Z")];
    poredjajRed(ulaz);
    expect(ulaz.map((r) => r.userId)).toEqual(["a", "b"]);
  });
});

describe("rokovi (čl. 21, 23, 26)", () => {
  it("rok se meri do kraja dana, ne na sat tačno", () => {
    // Objavljeno 10.09. u 14h → prijave do ponoći nakon 13.09., dakle pune tri dana.
    const objava = new Date(2026, 8, 10, 14, 0, 0);
    const rok = rokPrijave(objava);
    expect(rok.getFullYear()).toBe(2026);
    expect(rok.getMonth()).toBe(8);
    expect(rok.getDate()).toBe(14);
    expect(rok.getHours()).toBe(0);
    expect(rok > objava).toBe(true);
  });

  it("čovek koji je objavio u 23:59 dobija isti rok kao onaj u 00:01", () => {
    expect(rokPrijave(new Date(2026, 8, 10, 23, 59)).getTime()).toBe(
      rokPrijave(new Date(2026, 8, 10, 0, 1)).getTime()
    );
  });

  it("rok za potvrdu se meri od poziva", () => {
    const poziv = new Date(2026, 8, 12, 8, 0);
    expect(rokPotvrde(poziv).getDate()).toBe(16);
  });

  it("period preuzimanja traje tačno tri dana", () => {
    const od = new Date(2026, 8, 20, 0, 0);
    const doDatuma = krajPeriodaPreuzimanja(od);
    // 20, 21, 22 — kraj je ponoć koja započinje 23.
    expect(doDatuma.getDate()).toBe(23);
  });

  it("krajDana ne zavisi od sata polaznog trenutka", () => {
    const a = krajDana(new Date(2026, 8, 1, 0, 0), 3);
    const b = krajDana(new Date(2026, 8, 1, 23, 59), 3);
    expect(a.getTime()).toBe(b.getTime());
  });
});

describe("dan preuzimanja mora biti u periodu (čl. 23 st. 2)", () => {
  const od = new Date(2026, 8, 20, 0, 0);
  const doDatuma = krajPeriodaPreuzimanja(od); // ponoć na 23.

  it("prihvata sva tri dana perioda", () => {
    expect(danJeUPeriodu(new Date(2026, 8, 20, 10, 0), od, doDatuma)).toBe(true);
    expect(danJeUPeriodu(new Date(2026, 8, 21, 10, 0), od, doDatuma)).toBe(true);
    expect(danJeUPeriodu(new Date(2026, 8, 22, 23, 0), od, doDatuma)).toBe(true);
  });

  // Bez ove granice lanac poziva ne bi imao kraj — neko bi upisao datum za pola
  // godine i time zauvek zauzeo deo.
  it("odbija dan pre i posle perioda", () => {
    expect(danJeUPeriodu(new Date(2026, 8, 19, 23, 0), od, doDatuma)).toBe(false);
    expect(danJeUPeriodu(new Date(2026, 8, 23, 0, 1), od, doDatuma)).toBe(false);
    expect(danJeUPeriodu(new Date(2027, 2, 1), od, doDatuma)).toBe(false);
  });
});

describe("istek predloga (čl. 32)", () => {
  it("dvanaest meseci od upisa", () => {
    const upis = new Date(2026, 8, 2);
    const istek = predlogIstice(upis);
    expect(istek.getFullYear()).toBe(2027);
    expect(istek.getMonth()).toBe(8);
  });
});

describe("ko učestvuje (čl. 4)", () => {
  const osnovni = { maloletan: false, deaktiviranAt: null, status: "ACTIVE" };

  it("punoletan aktivan nalog učestvuje", () => {
    expect(smeUcestvovati(osnovni)).toBe(true);
  });

  // 🔴 Maloletni nalog je isključen IZRIČITO, ne posredno preko indeksa: dete sme
  // da ima POEN i ušlo bi u red, a ne sme da bude strana u preuzimanju robe.
  it("maloletni nalog ne učestvuje ni sa koliko POEN-a", () => {
    expect(smeUcestvovati({ ...osnovni, maloletan: true })).toBe(false);
  });

  it("ugašen i suspendovan nalog ne učestvuju", () => {
    expect(smeUcestvovati({ ...osnovni, deaktiviranAt: new Date() })).toBe(false);
    expect(smeUcestvovati({ ...osnovni, status: "SUSPENDED" })).toBe(false);
  });
});

describe("izborno glasanje (Gornje Kolo čl. 8 st. 4, čl. 9 st. 2)", () => {
  const m = (kljuc: string, moc: number, brojPredlagaca: number, unet: string) => ({
    kljuc,
    moc,
    brojPredlagaca,
    unetAt: new Date(unet),
  });

  it("pobeđuje najveći zbir glasačke moći", () => {
    const izbor = utvrdiIzbor([
      m("gorivo", 12, 30, "2026-01-01"),
      m("djubrivo", 40, 8, "2026-02-01"),
      m("cement", 25, 15, "2026-03-01"),
    ]);
    expect(izbor?.kljuc).toBe("djubrivo");
  });

  // Registar broji ljude, glasanje meri ZRNO — pri izjednačenom ZRNU prevagne
  // ono što je tražilo više ljudi.
  it("pri jednakoj moći prevagne veći broj različitih predlagača", () => {
    const izbor = utvrdiIzbor([
      m("gorivo", 20, 30, "2026-02-01"),
      m("cement", 20, 12, "2026-01-01"),
    ]);
    expect(izbor?.kljuc).toBe("gorivo");
  });

  it("pri potpunoj izjednačenosti prevagne raniji upis u registar", () => {
    const izbor = utvrdiIzbor([
      m("noviji", 20, 10, "2026-05-01"),
      m("stariji", 20, 10, "2026-01-01"),
    ]);
    expect(izbor?.kljuc).toBe("stariji");
  });

  it("bez ijednog glasa nema izbora", () => {
    expect(utvrdiIzbor([])).toBeNull();
    expect(utvrdiIzbor([m("gorivo", 0, 30, "2026-01-01")])).toBeNull();
  });

  it("mogućnost bez ijednog glasa ne može da pobedi", () => {
    const izbor = utvrdiIzbor([m("bezglasa", 0, 500, "2026-01-01"), m("sajednim", 1, 1, "2026-06-01")]);
    expect(izbor?.kljuc).toBe("sajednim");
  });
});
