/**
 * Brana: POEN po potvrdi ne sme da nastane ni da nestane mimo pravila iz čl. 7.
 *
 * Test gleda IZVOR, ne ponašanje — pravila su pokrivena u `potvrda-uslov.test.ts`.
 * Razlog je isti kao kod `oglasi-vidljivost-izvor.test.ts`: ispravno pravilo ne vredi
 * ništa dok ga svaka staza zaista ne pozove, a ovde ima šest staza koje POEN po
 * potvrdi diraju — jedna ga stvara, četiri ga otključavaju, pet ga obara.
 *
 * Najgore od svega je što se propust NE VIDI: zaboravljen okidač znači da POEN čeka
 * zauvek bez ijedne greške, a zaboravljen `poenStatus` u kaskadi znači protivzapis za
 * POEN koji nikad nije emitovan — dakle tiho pokvaren zero-sum.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import sr from "@/../messages/sr.json";
import en from "@/../messages/en.json";
import ru from "@/../messages/ru.json";
import hr from "@/../messages/hr.json";
import hu from "@/../messages/hu.json";

const KOREN = process.cwd();
const citaj = (p: string) => readFileSync(path.join(KOREN, p), "utf-8");

describe("upis POEN-a po potvrdi ide kroz pravilo", () => {
  it("jezgro verifikacije ne emituje POEN samo, nego zove `probajUpisatiPotvrdu`", () => {
    const s = citaj("src/lib/protokol/verifikacija-service.ts");
    expect(s).toContain("probajUpisatiPotvrdu");
    // 🔴 Ako se `emitujPoen` ikad vrati u ovaj fajl, POEN po potvrdi bi ponovo
    // nastajao u trenutku potvrde — dakle bez ijednog traga stvarnog učešća.
    expect(s, "verifikacija-service ne sme sam da emituje POEN").not.toContain("emitujPoen(");
    // Obe strane moraju da saznaju zašto POEN nije stigao, inače potvrda izgleda
    // kao kvar: indeks skoči, POEN-a nema, i niko ne kaže zašto.
    expect(s).toContain("javiZabelezeno");
  });

  it("servis upisa proverava uslov i rezerviše prelaz pre emisije", () => {
    const s = citaj("src/lib/protokol/potvrda-poen.ts");
    expect(s).toContain("uslovPotvrde");
    // Uslovan `updateMany` nad statusom — bez njega dva okidača u istoj sekundi
    // emituju POEN dvaput.
    expect(s).toMatch(/updateMany\([\s\S]*?poenStatus:\s*PotvrdaPoenStatus\.ZABELEZEN/);
  });

  it("trag učešća se meri emisijama iz četiri kanala, i nijednim drugim", () => {
    const s = citaj("src/lib/protokol/potvrda-poen.ts");
    for (const tip of [
      "EMISIJA_SADRZAJ",
      "EMISIJA_DONACIJA",
      "EMISIJA_POKROVITELJ",
      "EMISIJA_OPERATIVNI",
    ]) {
      expect(s, `${tip} mora da bude među uslovima`).toContain(tip);
    }
    // 🔴 Ovo su odbijeni uslovi i ne smeju da se provuku: prepis se dogovara privatno
    // i niko ga ne potvrđuje, osnivački je automatski, a socijalni program je podrška
    // a ne doprinos — korisnik prima, ne daje.
    const mapa = s.slice(s.indexOf("TIP_PO_USLOVU"), s.indexOf("dohvatiTragUcesca"));
    for (const tip of ["EMISIJA_PROGRAM", "EMISIJA_OSNIVACKI", "TransactionType.TRANSFER"]) {
      expect(mapa, `${tip} NE sme da bude uslov`).not.toContain(tip);
    }
  });

  it("sva četiri okidača zovu otključavanje", () => {
    const okidaci: [string, string][] = [
      ["src/lib/protokol/doprinos-sadrzaju.ts", "odobren prvi oglas"],
      ["src/lib/protokol/donacija.ts", "javna donacija"],
      ["src/lib/protokol/pokrovitelj.ts", "pokroviteljstvo"],
      ["src/lib/protokol/programi.ts", "operativni doprinos"],
    ];
    for (const [fajl, opis] of okidaci) {
      expect(citaj(fajl), `${opis} (${fajl}) ne zove probajEvidentiratiPotvrde`).toContain(
        "probajEvidentiratiPotvrde",
      );
    }
  });

  it("anonimna donacija ne otključava — okidač stoji unutar `if (poen > 0)`", () => {
    const s = citaj("src/lib/protokol/donacija.ts");
    const blok = s.slice(s.indexOf("if (poen > 0)"), s.indexOf("identitetUtvrdjenAt"));
    expect(blok, "okidač mora da bude unutar bloka koji emituje POEN").toContain(
      "probajEvidentiratiPotvrde",
    );
  });

  it("socijalni program ne otključava — okidač je vezan za `jeOperativni`", () => {
    const s = citaj("src/lib/protokol/programi.ts");
    expect(s).toMatch(/if\s*\(jeOperativni\)\s*\{[\s\S]{0,400}?probajEvidentiratiPotvrde/);
  });

  it("noćni prolaz postoji i upisan je u vercel.json", () => {
    expect(citaj("src/app/api/cron/potvrde-uslov/route.ts")).toContain(
      "probajEvidentiratiPotvrde",
    );
    const v = JSON.parse(citaj("vercel.json")) as { crons: { path: string }[] };
    expect(
      v.crons.some((c) => c.path === "/api/cron/potvrde-uslov"),
      "bez crona zaostale potvrde ne bi pokupio niko",
    ).toBe(true);
  });
});

describe("kaskade ne prave protivzapis za POEN koji nije upisan", () => {
  const KASKADE = [
    "src/lib/protokol/lazna-verifikacija.ts",
    "src/lib/protokol/verifikacije-naloga.ts",
    "src/app/api/profil/route.ts",
    "src/lib/protokol/deca.ts",
  ];

  it("svako mesto koje obara potvrdu gleda `poenStatus`", () => {
    for (const fajl of KASKADE) {
      expect(citaj(fajl), `${fajl} ne proverava poenStatus`).toContain(
        "PotvrdaPoenStatus.EVIDENTIRAN",
      );
    }
  });

  it("nadzornikovih 500 NISU pod tim uslovom", () => {
    // 🔴 Njih emituje `nadzor-service` pri evidentiranju ishoda (čl. 7 st. 2), dakle
    // nezavisno od ovog kanala. Ako se stave pod `poenStatus`, poništenje ostavlja u
    // opticaju POEN koji je Protokol stvarno emitovao. Prva verzija ove izmene je
    // upravo to i uradila.
    const s = citaj("src/lib/protokol/verifikacije-naloga.ts");
    const posle = s.slice(s.indexOf("vezeKaoVerifikator"));
    expect(posle).toMatch(
      /if \(v\.podlezeNadzoru && v\.nadzornikId && v\.nadzorIshod === "UREDNO"\) \{\s*\n\s*await vratiPoenProtokolu/,
    );
  });

  it("punoletstvo upisuje bez uslova", () => {
    const s = citaj("src/lib/protokol/punoletstvo.ts");
    expect(s, "roditeljske potvrde iz čl. 19 st. 3 ne smeju da čekaju prvi oglas").toContain(
      "bezUslovaZaPoen: true",
    );
  });
});

describe("copy ne obećava POEN u trenutku potvrde", () => {
  const PORUKE = { sr, en, ru, hr, hu } as unknown as Record<
    string,
    Record<string, Record<string, string>>
  >;

  it("svi jezici imaju tekstove za zabeleženu potvrdu", () => {
    for (const [jez, m] of Object.entries(PORUKE)) {
      for (const [ns, kljuc] of [
        ["novcanik", "zabelezene_potvrde_naslov"],
        ["novcanik", "zabelezene_potvrde_opis"],
        ["verifikacija", "ceka_naslov"],
        ["notifikacije", "potvrda_poen_ceka_potvrdjeni"],
        ["notifikacije", "potvrda_uskladjena"],
      ] as const) {
        expect(m[ns]?.[kljuc], `${jez}.${ns}.${kljuc} nedostaje`).toBeTruthy();
      }
    }
  });

  it("naziv reda nije „POEN na čekanju“ — POEN postoji samo kao zapis (čl. 12)", () => {
    for (const [jez, m] of Object.entries(PORUKE)) {
      const tekst = JSON.stringify(m);
      expect(tekst, `${jez}: „POEN na čekanju" se ne koristi`).not.toMatch(
        /POEN\s+na\s+čekanju/i,
      );
    }
  });
});
