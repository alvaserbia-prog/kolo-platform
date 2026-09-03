import { describe, it, expect } from "vitest";
import { izracunajLevak, pocetakMeseca, pocetakNedelje, type LevakUlaz } from "@/lib/levak";

const DAN = 24 * 60 * 60 * 1000;

function prazanUlaz(korisnici: LevakUlaz["korisnici"]): LevakUlaz {
  return {
    korisnici,
    otvoriliPoverenje: new Set(),
    otvoriliFormu: new Set(),
    prviOglas: new Map(),
  };
}

function korak(grupa: ReturnType<typeof izracunajLevak>[number], naziv: string) {
  return grupa.koraci.find((k) => k.korak === naziv)!;
}

function grupa(grupe: ReturnType<typeof izracunajLevak>, oznaka: string) {
  const g = grupe.find((x) => x.oznaka === oznaka);
  if (!g) throw new Error(`nema grupe „${oznaka}“ (ima: ${grupe.map((x) => x.oznaka).join(", ")})`);
  return g;
}

describe("pocetakNedelje", () => {
  it("vraća ponedeljak te nedelje", () => {
    // 2026-08-06 je četvrtak → ponedeljak je 2026-08-03
    expect(pocetakNedelje(new Date("2026-08-06T10:00:00Z"))).toBe("2026-08-03");
    expect(pocetakNedelje(new Date("2026-08-03T00:00:00Z"))).toBe("2026-08-03");
  });

  it("nedelju svrstava u nedelju koja se tog dana završava, ne u narednu", () => {
    // 2026-08-09 je nedelja → i dalje pripada nedelji koja počinje 2026-08-03
    expect(pocetakNedelje(new Date("2026-08-09T23:59:00Z"))).toBe("2026-08-03");
    expect(pocetakNedelje(new Date("2026-08-10T00:00:00Z"))).toBe("2026-08-10");
  });
});

describe("pocetakMeseca", () => {
  it("vraća mesec (UTC) datog datuma", () => {
    expect(pocetakMeseca(new Date("2026-08-31T23:00:00Z"))).toBe("2026-08");
    expect(pocetakMeseca(new Date("2026-09-01T00:00:00Z"))).toBe("2026-09");
  });
});

describe("izracunajLevak", () => {
  it("bez korisnika vraća zbirni red i pomerajuće prozore, sve na nuli", () => {
    const g = izracunajLevak(prazanUlaz([]));
    // ukupno + poslednjih 7 dana + poslednjih 30 dana; pojedinačnih perioda nema
    expect(g.map((x) => x.oznaka)).toEqual(["ukupno", "nedelja", "mesec"]);
    expect(korak(g[0], "registrovani").broj).toBe(0);
    // Prolaz se ne računa kad je prethodni korak nula — ne deli se nulom.
    expect(korak(g[0], "objavili_oglas").prolaz).toBeNull();
  });

  it("broji korake kao „ikad uradio“, ne po nedelji radnje", () => {
    const registracija = new Date("2026-07-06T09:00:00Z"); // ponedeljak
    const ulaz: LevakUlaz = {
      korisnici: [{ id: "a", createdAt: registracija, verifiedAt: new Date("2026-07-20T09:00:00Z") }],
      otvoriliPoverenje: new Set(["a"]),
      otvoriliFormu: new Set(["a"]),
      // oglas mesec dana kasnije — i dalje se broji u julskoj kohorti
      prviOglas: new Map([["a", new Date("2026-08-05T09:00:00Z")]]),
    };
    const g = izracunajLevak(ulaz);
    const nedelja = grupa(g, "n:2026-07-06");
    expect(korak(nedelja, "objavili_oglas").broj).toBe(1);
    expect(korak(nedelja, "objavili_oglas").prolaz).toBe(100);
    // isti čovek u mesecu registracije, iako je oglas objavio u avgustu
    expect(korak(grupa(g, "m:2026-07"), "objavili_oglas").broj).toBe(1);
  });

  it("prolaz je udeo u odnosu na prethodni korak", () => {
    const d = new Date("2026-08-03T09:00:00Z");
    const korisnici = ["a", "b", "c", "d"].map((id) => ({ id, createdAt: d, verifiedAt: null }));
    const ulaz: LevakUlaz = {
      ...prazanUlaz(korisnici),
      otvoriliPoverenje: new Set(["a", "b"]), // 2 od 4 = 50%
      otvoriliFormu: new Set(["a"]), // 1 od 2 = 50%
    };
    const g = izracunajLevak(ulaz)[0];
    expect(korak(g, "otvorili_poverenje").prolaz).toBe(50);
    expect(korak(g, "otvorili_formu").prolaz).toBe(50);
  });

  it("verifikacija bez oglasa (jednokratan kod) daje prolaz preko 100% i to nije greška", () => {
    const d = new Date("2026-08-03T09:00:00Z");
    const ulaz = prazanUlaz([
      { id: "a", createdAt: d, verifiedAt: new Date("2026-08-04T09:00:00Z") },
      { id: "b", createdAt: d, verifiedAt: new Date("2026-08-04T09:00:00Z") },
    ]);
    ulaz.prviOglas = new Map([["a", new Date("2026-08-04T09:00:00Z")]]);
    const g = izracunajLevak(ulaz)[0];
    expect(korak(g, "objavili_oglas").broj).toBe(1);
    expect(korak(g, "verifikovani").broj).toBe(2);
    expect(korak(g, "verifikovani").prolaz).toBe(200);
  });

  it("računa prosečne dane do verifikacije i do prvog oglasa", () => {
    const reg = new Date("2026-08-03T00:00:00Z");
    const ulaz: LevakUlaz = {
      korisnici: [
        { id: "a", createdAt: reg, verifiedAt: new Date(reg.getTime() + 2 * DAN) },
        { id: "b", createdAt: reg, verifiedAt: new Date(reg.getTime() + 4 * DAN) },
        { id: "c", createdAt: reg, verifiedAt: null }, // neverifikovan ne ulazi u prosek
      ],
      otvoriliPoverenje: new Set(),
      otvoriliFormu: new Set(),
      prviOglas: new Map([["a", new Date(reg.getTime() + 5 * DAN)]]), // 3 dana posle verifikacije
    };
    const g = izracunajLevak(ulaz)[0];
    expect(g.danaDoVerifikacije).toBe(3);
    expect(g.danaDoPrvogOglasa).toBe(3);
  });

  it("oglas pre verifikacije ne ulazi u prosek kao negativan broj", () => {
    const reg = new Date("2026-08-03T00:00:00Z");
    const ulaz: LevakUlaz = {
      ...prazanUlaz([{ id: "a", createdAt: reg, verifiedAt: new Date(reg.getTime() + 5 * DAN) }]),
      prviOglas: new Map([["a", new Date(reg.getTime() + 1 * DAN)]]),
    };
    expect(izracunajLevak(ulaz)[0].danaDoPrvogOglasa).toBeNull();
  });

  it("ograničava broj nedelja, ali „ukupno“ obuhvata i starije", () => {
    const korisnici = Array.from({ length: 5 }, (_, i) => ({
      id: `u${i}`,
      // svaki u svojoj nedelji unazad
      createdAt: new Date(new Date("2026-08-03T00:00:00Z").getTime() - i * 7 * DAN),
      verifiedAt: null,
    }));
    const g = izracunajLevak(prazanUlaz(korisnici), { brojNedelja: 2, brojMeseci: 1 });
    expect(g.filter((x) => x.oznaka.startsWith("n:"))).toHaveLength(2);
    expect(g.filter((x) => x.oznaka.startsWith("m:"))).toHaveLength(1);
    expect(g[0].oznaka).toBe("ukupno");
    expect(korak(g[0], "registrovani").broj).toBe(5);
  });

  it("nedelje su poređane od najnovije ka starijoj", () => {
    const korisnici = [
      { id: "stari", createdAt: new Date("2026-07-06T00:00:00Z"), verifiedAt: null },
      { id: "novi", createdAt: new Date("2026-08-03T00:00:00Z"), verifiedAt: null },
    ];
    const g = izracunajLevak(prazanUlaz(korisnici));
    expect(g.filter((x) => x.oznaka.startsWith("n:")).map((x) => x.oznaka)).toEqual([
      "n:2026-08-03",
      "n:2026-07-06",
    ]);
    expect(g.filter((x) => x.oznaka.startsWith("m:")).map((x) => x.oznaka)).toEqual([
      "m:2026-08",
      "m:2026-07",
    ]);
  });

  it("pomerajući prozori mere 7 i 30 dana od `sada`, ne kalendarski period", () => {
    const sada = new Date("2026-09-03T12:00:00Z");
    const korisnici = [
      { id: "danas", createdAt: new Date("2026-09-03T09:00:00Z"), verifiedAt: null },
      { id: "pre5dana", createdAt: new Date("2026-08-29T09:00:00Z"), verifiedAt: null },
      { id: "pre20dana", createdAt: new Date("2026-08-14T09:00:00Z"), verifiedAt: null },
      { id: "pre60dana", createdAt: new Date("2026-07-05T09:00:00Z"), verifiedAt: null },
    ];
    const g = izracunajLevak(prazanUlaz(korisnici), { sada });
    expect(korak(grupa(g, "nedelja"), "registrovani").broj).toBe(2);
    expect(korak(grupa(g, "mesec"), "registrovani").broj).toBe(3);
    expect(korak(grupa(g, "ukupno"), "registrovani").broj).toBe(4);
  });

  it("prozor od 7 dana nije isto što red poslednje kalendarske nedelje", () => {
    // ponedeljak 2026-08-31 u 10h: prozor hvata i prošlu nedelju, red „n:“ ne
    const sada = new Date("2026-08-31T10:00:00Z");
    const korisnici = [
      { id: "ponedeljak", createdAt: new Date("2026-08-31T09:00:00Z"), verifiedAt: null },
      { id: "petak", createdAt: new Date("2026-08-28T09:00:00Z"), verifiedAt: null },
    ];
    const g = izracunajLevak(prazanUlaz(korisnici), { sada });
    expect(korak(grupa(g, "nedelja"), "registrovani").broj).toBe(2);
    expect(korak(grupa(g, "n:2026-08-31"), "registrovani").broj).toBe(1);
    expect(korak(grupa(g, "n:2026-08-24"), "registrovani").broj).toBe(1);
  });

  it("meseci se grupišu po mesecu registracije, nezavisno od nedelja", () => {
    const korisnici = [
      // ista nedelja (2026-08-31 – 2026-09-06), a dva različita meseca
      { id: "avgust", createdAt: new Date("2026-08-31T09:00:00Z"), verifiedAt: null },
      { id: "septembar", createdAt: new Date("2026-09-01T09:00:00Z"), verifiedAt: null },
    ];
    const g = izracunajLevak(prazanUlaz(korisnici));
    expect(korak(grupa(g, "n:2026-08-31"), "registrovani").broj).toBe(2);
    expect(korak(grupa(g, "m:2026-08"), "registrovani").broj).toBe(1);
    expect(korak(grupa(g, "m:2026-09"), "registrovani").broj).toBe(1);
  });
});
