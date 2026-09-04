/**
 * Brana: maloletni nalog ne ulazi u lanac potvrda (čl. 15 Pravilnika o učešću dece).
 *
 * Provera je nedostajala, a njeno odsustvo se nije videlo ni na jednom ekranu:
 * `/verifikacija` maloletan nalog preusmerava na `/prijatelji`, pa je put do
 * potvrde izgledao zatvoreno. Rute ispod tog ekrana bile su otvorene —
 * `POST /api/verifikacija/token` izdavao je kod svakom prijavljenom nalogu, a
 * `izvrsiJezgroVerifikacije` metu je proveravalo po tipu i indeksu, dakle po
 * vrednostima koje se potvrdom TEK DOBIJAJU.
 *
 * Cena propuštanja nije bila kozmetička: potvrđeno dete dobija `verified: true`
 * i indeks 10%, a na tome — ne na uzrastu — stoje `POST /api/zrno/upis`,
 * socijalni programi (`imaFunkcionalniPristup`), `POST /api/donacije`, glas u
 * Gornjem Kolu i sopstveni verifikacioni kapacitet (⌊10/10⌋ = 1). Jedna
 * propuštena provera otvarala je sve odjednom.
 *
 * Test gleda i pravilo i IZVOR, iz istog razloga iz kog to radi
 * `oglasi-vidljivost-izvor.test.ts`: tačno pravilo koje niko ne poziva ne
 * štiti ništa.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PORUKA_DETE_VAN_LANCA, smeULanacPotvrda } from "@/lib/deca-pravila";
import { kljucGreske } from "@/lib/greska-api";
import sr from "@/../messages/sr.json";
import en from "@/../messages/en.json";
import ru from "@/../messages/ru.json";
import hr from "@/../messages/hr.json";
import hu from "@/../messages/hu.json";

const KOREN = process.cwd();
const SERVIS = readFileSync(
  path.join(KOREN, "src/lib/protokol/verifikacija-service.ts"),
  "utf8",
);

describe("smeULanacPotvrda — čl. 15", () => {
  it("punoletan nalog sme", () => {
    expect(smeULanacPotvrda({ maloletan: false })).toBe(true);
  });

  it("maloletan nalog ne sme", () => {
    expect(smeULanacPotvrda({ maloletan: true })).toBe(false);
  });

  it("poruka objašnjava i šta dete umesto toga dobija", () => {
    expect(PORUKA_DETE_VAN_LANCA).toMatch(/18\. rođendan/);
  });

  // `kljucGreske()` seče ključ na 80 znakova, pa duža poruka daje ključ
  // presečen usred reči — nečitljiv i podložan sudaru sa drugom porukom koja
  // deli istih 80 znakova. Prevod bez ključa ne puca (vraća se srpski
  // original), pa bi izostanak prošao tiho kroz sve ostale provere.
  it("poruka ima ključ u sva PET jezika i ključ nije presečen", () => {
    const kljuc = kljucGreske(PORUKA_DETE_VAN_LANCA);
    expect(kljuc.length).toBeLessThan(80);
    for (const [jezik, poruke] of Object.entries({ sr, en, ru, hr, hu })) {
      expect(
        (poruke as { greske: Record<string, string> }).greske[kljuc],
        `${jezik} nema prevod za „${PORUKA_DETE_VAN_LANCA}"`,
      ).toBeTruthy();
    }
  });
});

describe("jezgro potvrde sprovodi pravilo", () => {
  it("verifikacija-service uvozi pravilo", () => {
    expect(SERVIS).toMatch(/smeULanacPotvrda.*from "@\/lib\/deca-pravila"/);
  });

  // Oba smera: „meta" je smer koji indeks ne može da odbije, „ko potvrđuje"
  // stoji izričito iz istog razloga iz kog ga `nabavka-pravila.ts` ima —
  // posredna zaštita preko indeksa pada čim se indeks negde drugde promeni.
  it("odbija i metu i onoga ko potvrđuje", () => {
    expect(SERVIS).toMatch(
      /!smeULanacPotvrda\(verifikator\)\s*\|\|\s*!smeULanacPotvrda\(verifikovani\)/,
    );
  });

  it("kod se maloletnom nalogu ne izdaje", () => {
    expect(SERVIS).toMatch(/!smeULanacPotvrda\(korisnik\)/);
  });
});

describe("punoletstvo se oslanja na ovu proveru", () => {
  const PUNOLETSTVO = readFileSync(
    path.join(KOREN, "src/lib/protokol/punoletstvo.ts"),
    "utf8",
  );

  // Roditeljske potvrde iz čl. 19 st. 3 upisuju se TEK pošto nalog pređe u
  // punoletni. Da je obrnuto, jezgro bi ih sada odbilo — pa redosled iz
  // `prevediUPunoletni` prestaje da bude stilski i postaje uslov da korak radi.
  it("nalog se prevodi u punoletni PRE nego što se traže potvrde", () => {
    const prelaz = PUNOLETSTVO.indexOf("maloletan: false");
    // `lastIndexOf`, ne `indexOf`: prvo pojavljivanje je `import` na vrhu fajla,
    // koje o redosledu koraka ne govori ništa. Meri se POZIV.
    const potvrde = PUNOLETSTVO.lastIndexOf("izvrsiVerifikacijuBezTokena(");
    expect(prelaz).toBeGreaterThan(-1);
    expect(potvrde).toBeGreaterThan(-1);
    expect(prelaz).toBeLessThan(potvrde);
  });
});
