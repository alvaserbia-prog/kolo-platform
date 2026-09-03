import { describe, it, expect } from "vitest";
import {
  KOEFICIJENT_TROSENJA,
  MESECI_REZERVE,
  NIZ_DELOVA,
  NAJMANJE_PONUDA,
  ROK_PRIJAVE_DANA,
  ROK_POTVRDE_DANA,
  PERIOD_PREUZIMANJA_DANA,
  normalizujNaziv,
  ociscenNaziv,
  validanNaziv,
  raspolozivoZaProjekte,
  iznosNabavke,
  maloprodajnaReferenca,
  najveciBrojJedinica,
  izvediPodelu,
  poenPoDelu,
  odnosPonistenja,
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
  it("niz delova je 100, 50, 20 — od većeg ka manjem (čl. 18 st. 2)", () => {
    expect([...NIZ_DELOVA]).toEqual([100, 50, 20]);
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

  it("iznos nabavke je raspoloživo × koeficijent", () => {
    expect(iznosNabavke(385_000)).toBe(385_000);
  });
});

describe("maloprodajna referenca (čl. 17)", () => {
  it("prosek tri cene, zaokružen na ceo dinar", () => {
    expect(maloprodajnaReferenca([4290, 4150, 4400])).toBe(4280);
    expect(maloprodajnaReferenca([100, 101, 101])).toBe(101);
  });

  it("traži tačno tri cene", () => {
    expect(maloprodajnaReferenca([100, 200])).toBeNull();
    expect(maloprodajnaReferenca([100, 200, 300, 400])).toBeNull();
  });

  it("odbija nevažeće cene", () => {
    expect(maloprodajnaReferenca([100, 0, 300])).toBeNull();
    expect(maloprodajnaReferenca([100, -5, 300])).toBeNull();
  });
});

describe("izvođenje broja delova (čl. 18)", () => {
  it("bira najveće N pri kome deo ima bar jednu celu jedinicu", () => {
    expect(izvediPodelu(122)).toEqual({ brojDelova: 100, velicinaDela: 1, jedinicaSeKupuje: 100 });
    expect(izvediPodelu(70)).toEqual({ brojDelova: 50, velicinaDela: 1, jedinicaSeKupuje: 50 });
    expect(izvediPodelu(40)).toEqual({ brojDelova: 20, velicinaDela: 2, jedinicaSeKupuje: 40 });
  });

  it("na tačnim granicama uzima veće N", () => {
    expect(izvediPodelu(100)?.brojDelova).toBe(100);
    expect(izvediPodelu(99)?.brojDelova).toBe(50);
    expect(izvediPodelu(50)?.brojDelova).toBe(50);
    expect(izvediPodelu(49)?.brojDelova).toBe(20);
    expect(izvediPodelu(20)?.brojDelova).toBe(20);
  });

  // Čl. 18 st. 4 — ostatak se NE kupuje, pa nema viška ni deljenja na komade.
  it("kupuje se tačno deo × broj delova, ostatak ostaje Fondaciji", () => {
    const p = izvediPodelu(122)!;
    expect(p.jedinicaSeKupuje).toBe(100);
    expect(p.jedinicaSeKupuje).toBeLessThanOrEqual(122);
  });

  it("ispod dvadeset jedinica nabavke nema", () => {
    expect(izvediPodelu(19)).toBeNull();
    expect(izvediPodelu(1)).toBeNull();
    expect(izvediPodelu(0)).toBeNull();
  });
});

describe("POEN po delu (čl. 19)", () => {
  it("paritet jedan prema jedan sa maloprodajnom referencom", () => {
    expect(poenPoDelu(1, 4280)).toBe(4280);
    expect(poenPoDelu(2, 4280)).toBe(8560);
  });

  it("odnos poništenja meri koliko POEN-a nestane po dinaru", () => {
    expect(odnosPonistenja(4280, 3150)).toBeCloseTo(1.3587, 4);
    expect(odnosPonistenja(4280, 0)).toBeNull();
  });
});

describe("cela kalkulacija", () => {
  // Primer iz razrade: kasa 640.000, operativa 85.000/mesec, vreća nabavno 3.150,
  // tri javne maloprodajne cene 4.290 / 4.150 / 4.400.
  const ulaz = { saldoRSD: 640_000, trosakPrethodnogMesecaRSD: 85_000, nabavnaCena: 3150, cene: [4290, 4150, 4400] };

  it("prolazi ceo lanac od salda do broja poništenih POEN-a", () => {
    const k = izracunajKalkulaciju(ulaz)!;
    expect(k.rezervaRSD).toBe(255_000);
    expect(k.raspolozivoRSD).toBe(385_000);
    expect(k.iznosNabavkeRSD).toBe(385_000);
    expect(k.maloprodajna).toBe(4280);
    expect(k.najviseJedinica).toBe(122);
    expect(k.brojDelova).toBe(100);
    expect(k.velicinaDela).toBe(1);
    expect(k.brojJedinica).toBe(100);
    expect(k.poenPoDelu).toBe(4280);
    expect(k.ukupnoPoena).toBe(428_000);
    expect(k.procenjenoPlacanjeRSD).toBe(315_000);
    expect(k.odnosPonistenja).toBeCloseTo(1.36, 2);
  });

  it("plaćanje nikad ne prelazi iznos nabavke", () => {
    const k = izracunajKalkulaciju(ulaz)!;
    expect(k.procenjenoPlacanjeRSD).toBeLessThanOrEqual(k.iznosNabavkeRSD);
  });

  it("nema kalkulacije kad rezerva pojede saldo", () => {
    expect(izracunajKalkulaciju({ ...ulaz, saldoRSD: 200_000 })).toBeNull();
  });

  it("nema kalkulacije kad je roba preskupa za dvadeset delova", () => {
    expect(izracunajKalkulaciju({ ...ulaz, nabavnaCena: 30_000 })).toBeNull();
  });

  it("nema kalkulacije bez tri cene", () => {
    expect(izracunajKalkulaciju({ ...ulaz, cene: [4290, 4150] })).toBeNull();
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
