import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ROK_PROMENE_SKOLE_DANA,
  pozicijaPoBroju,
  rangirajPoBroju,
  rangirajPoProcentu,
  sledecaPromenaSkole,
  smePromenitiSkolu,
  udeoUkljucenosti,
  skolePostoje,
  razresiSkolu,
  pretraziSkole,
  type RedSkole,
} from "@/lib/skola";
import { SKOLE } from "@/lib/skole-srbije";
import { razresiNaselje } from "@/lib/naselje";

/**
 * Pravila ranglista škola. Plan: `docs/plan-ranglista-skola.html`.
 *
 * Šifarnik (`skole-srbije.ts`) je namerno prazan dok se ne uveze zvaničan spisak,
 * pa se ovde ne testira sadržaj spiska nego SAMO pravila — ona rade i sa praznim
 * spiskom i moraju da nastave da rade kad se spisak popuni.
 */

function red(sifra: string, dece: number, ucenika: number | null, naziv = sifra): RedSkole {
  return { sifra, naziv, mesto: "Sombor", tip: "OSNOVNA", ucenika, dece };
}

describe("udeo uključenosti", () => {
  it("računa procenat kad je broj učenika poznat", () => {
    expect(udeoUkljucenosti(20, 80)).toBe(25);
  });

  it("vraća null kad broj učenika nije poznat — nikad procenu", () => {
    // 🔴 Izmišljen imenilac pravi izmišljen poredak, a poredak škola je javan
    // podatak koji ljudi prepričavaju. Takva škola stoji sa crticom.
    expect(udeoUkljucenosti(20, null)).toBeNull();
    expect(udeoUkljucenosti(20, 0)).toBeNull();
  });
});

describe("poredak po broju", () => {
  it("ređa opadajuće po broju dece", () => {
    const p = rangirajPoBroju([red("a", 3, 100), red("b", 12, 100), red("c", 7, 100)]);
    expect(p.map((r) => r.sifra)).toEqual(["b", "c", "a"]);
  });

  it("pri izjednačenom broju odlučuje naziv — poredak mora biti određen do kraja", () => {
    // Bez određenog poretka lista se pri svakom osvežavanju drugačije poređa i
    // izgleda kao da se nešto menja.
    const p = rangirajPoBroju([red("x", 5, 100, "Vuk"), red("y", 5, 100, "Branko")]);
    expect(p.map((r) => r.naziv)).toEqual(["Branko", "Vuk"]);
  });

  it("škola sa nula dece ostaje na listi", () => {
    // Škola u kojoj dvadesetoro dece čeka roditelje mora da vidi svoju nulu —
    // to je baš poruka koju dete treba da odnese kući.
    const p = rangirajPoBroju([red("a", 0, 100), red("b", 2, 100)]);
    expect(p.map((r) => r.sifra)).toEqual(["b", "a"]);
  });
});

describe("poredak po procentu", () => {
  it("malo selo pobeđuje veliki grad", () => {
    const selo = red("selo", 20, 80);
    const grad = red("grad", 40, 1200);
    const p = rangirajPoProcentu([grad, selo]);
    expect(p[0].sifra).toBe("selo");
    expect(p[0].procenat).toBe(25);
  });

  it("škole bez broja učenika idu na kraj, sa null umesto procenta", () => {
    // Ne izostavljaju se — inače bi škola nestala sa jedne liste a stajala na
    // drugoj, što izgleda kao greška.
    const p = rangirajPoProcentu([red("nepoznata", 9, null), red("poznata", 1, 100)]);
    expect(p.map((r) => r.sifra)).toEqual(["poznata", "nepoznata"]);
    expect(p[1].procenat).toBeNull();
  });
});

describe("pozicija škole", () => {
  it("računa koliko dece fali do mesta iznad", () => {
    const p = rangirajPoBroju([red("a", 10, 100), red("b", 7, 100), red("c", 1, 100)]);
    // 🔴 +1 nije greška: izjednačen broj ne preskače, jer pri jednakosti odlučuje
    // naziv. Ovo je broj koji čita dete („fali vam 3"), pa mora biti tačan.
    expect(pozicijaPoBroju(p, "b")?.doSledecegMesta).toBe(4);
    expect(pozicijaPoBroju(p, "b")?.mesto).toBe(2);
  });

  it("prva škola nema šta da stigne", () => {
    const p = rangirajPoBroju([red("a", 10, 100), red("b", 7, 100)]);
    expect(pozicijaPoBroju(p, "a")?.doSledecegMesta).toBeNull();
  });

  it("vraća null za školu koje nema na listi", () => {
    expect(pozicijaPoBroju(rangirajPoBroju([red("a", 1, 10)]), "nepostoji")).toBeNull();
  });
});

describe("rok od 30 dana", () => {
  const sada = new Date("2026-08-18T10:00:00Z");

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("PRVA postavka nije promena i ne čeka ništa", () => {
    expect(smePromenitiSkolu(null, sada).ok).toBe(true);
  });

  it("druga promena unutar roka pada", () => {
    const pre10dana = new Date(sada.getTime() - 10 * 24 * 3600 * 1000);
    const p = smePromenitiSkolu(pre10dana, sada);
    expect(p.ok).toBe(false);
    if (!p.ok) {
      expect(p.status).toBe(403);
      // Poruka mora da nosi DATUM — „pokušaj kasnije" ne govori čoveku ništa.
      expect(p.razlog).toMatch(/\d/);
    }
  });

  it("promena posle isteka roka prolazi", () => {
    const preRoka = new Date(sada.getTime() - (ROK_PROMENE_SKOLE_DANA + 1) * 24 * 3600 * 1000);
    expect(smePromenitiSkolu(preRoka, sada).ok).toBe(true);
  });

  it("granica je uključiva — tačno 30 dana prolazi", () => {
    const tacno = new Date(sada.getTime() - ROK_PROMENE_SKOLE_DANA * 24 * 3600 * 1000);
    expect(smePromenitiSkolu(tacno, sada).ok).toBe(true);
    expect(sledecaPromenaSkole(tacno).getTime()).toBe(sada.getTime());
  });
});

/**
 * Brana nad samim šifarnikom (`skole-srbije.ts`), koji generiše
 * `scripts/uvezi-skole.mjs` iz izvoza JISP-a.
 *
 * Testira se PODATAK, ne pravilo — jer upravo se u podatku greška ne vidi:
 * dupla šifra tiho sabere dve škole u jedan red, a mesto koje ne pogađa nijedno
 * naselje ispadne iz svega što se kači na lokaciju dok škola i dalje stoji na
 * listi. Oba kvara prolaze i tipove i build.
 */
describe("šifarnik škola", () => {
  it("nije prazan — spisak je uvezen", () => {
    expect(skolePostoje()).toBe(true);
    expect(SKOLE.length).toBeGreaterThan(1000);
  });

  it("svaka šifra je jedinstvena", () => {
    const sifre = new Set(SKOLE.map((s) => s.sifra));
    expect(sifre.size).toBe(SKOLE.length);
  });

  it("svaka šifra se razrešava nazad u svoju školu", () => {
    for (const s of SKOLE) expect(razresiSkolu(s.sifra)?.naziv).toBe(s.naziv);
  });

  it("svako mesto je kanonsko naselje iz šifarnika naselja", () => {
    // 🔴 Ovo je provera koja se najlakše previdi: škola čije mesto ne pogađa
    // nijedno naselje nigde ne puca, samo tiho ispada iz svega što se kači na
    // lokaciju. Uvozna skripta zato odbija ceo uvoz, a ovaj test to zaključava.
    const promaseno = SKOLE.filter((s) => razresiNaselje(s.mesto) !== s.mesto);
    expect(promaseno.map((s) => `${s.naziv} — ${s.mesto}`)).toEqual([]);
  });

  it("broj upisanih učenika je pozitivan ili nepoznat, nikad nula ni negativan", () => {
    // Nula bi u procentualnoj listi dala deljenje nulom; `udeoUkljucenosti` to
    // hvata i vraća null, ali podatak takav ne sme ni da uđe.
    for (const s of SKOLE) {
      if (s.ucenika !== null) expect(s.ucenika).toBeGreaterThan(0);
    }
  });

  it("pretraga pogađa školu po nazivu i mestu", () => {
    const nadjena = SKOLE.find((s) => s.ucenika !== null)!;
    const prvaRec = nadjena.naziv.replace(/[„"]/g, " ").trim().split(/\s+/).pop()!;
    const pogoci = pretraziSkole(`${prvaRec} ${nadjena.mesto}`, { limit: 50 });
    expect(pogoci.some((s) => s.sifra === nadjena.sifra)).toBe(true);
  });
});
