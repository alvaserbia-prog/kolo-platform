/**
 * Brana: podatak o socijalnom programu ne izlazi iz Platforme.
 *
 * Naziv programa uz pseudonim otkriva pripadnost posebnoj kategoriji podataka
 * (zdravlje, porodica, godine). Akti su do seta 4.5.0 tvrdili da se obaveštavanje
 * verifikatora vrši „isključivo unutar platforme (in-app notifikacija)" — a
 * `obavesti` je isti tekst slao i mejlom (Resend, SAD) i push-om, koji stiže na
 * zaključan ekran telefona. Tvrdnja je postala istinita tek uvođenjem `spoljni`
 * teksta u `posaljiNotifikaciju`.
 *
 * Test gleda IZVOR, iz istog razloga iz kog to rade `oglasi-vidljivost-izvor` i
 * `deca-lanac-potvrda`: mehanizam koji postoji a niko ga ne poziva ne štiti
 * ništa, a povratak na jedan tekst za sva tri kanala ne bi ništa vidljivo
 * pokvario.
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
const citaj = (p: string) => readFileSync(path.join(KOREN, p), "utf8");

const NOTIFIKACIJE = citaj("src/lib/notifikacije.ts");
const PRIJAVA = citaj("src/app/api/programi/[type]/prijava/route.ts");
const POVLACENJE = citaj("src/app/api/programi/[type]/povuci-pristanak/route.ts");
const ODGOVORI = citaj("src/app/api/programi/potvrde/[id]/odgovori/route.ts");

describe("neutralan tekst za kanale van aplikacije", () => {
  it("posaljiNotifikaciju šalje push i mejl `spoljni` tekstom", () => {
    // Ako se ovde vrati `naslovL`/`tekstL`, pun tekst zvonca ponovo odlazi mejlom
    // i push-om, a nijedan ekran to ne pokazuje.
    expect(NOTIFIKACIJE).toMatch(/zakaziPush\(userId, \{ naslov: spoljniNaslov, tekst: spoljniTekst/);
    expect(NOTIFIKACIJE).toMatch(/naslov: spoljniNaslov,\s*\n\s*tekst: spoljniTekst,/);
  });

  it("zahtev verifikatoru nosi `spoljni` bez naziva programa", () => {
    expect(PRIJAVA).toContain("spoljni: {");
    expect(PRIJAVA).toContain("notifikacije.zahtev_potvrda_spoljni");
    // Neutralan tekst ne sme da sadrži ni program ni pseudonim.
    const blok = PRIJAVA.slice(PRIJAVA.indexOf("spoljni: {"));
    const kraj = blok.indexOf("},");
    const spoljni = blok.slice(0, kraj);
    expect(spoljni).not.toContain("labelPrograma");
    expect(spoljni).not.toContain("pseudonim");
  });

  it("obaveštenje o povlačenju pristanka takođe nosi `spoljni`", () => {
    expect(POVLACENJE).toContain("notifikacije.program_pristanak_povucen_spoljni");
  });
});

describe("naziv programa ne ide u kanal upozorenja Fondaciji", () => {
  // `posaljiAdminAlert` ide na ADMIN_EMAIL (Resend) i na Telegram — oba u SAD.
  // Ko odlučuje o prijavi vidi je u admin panelu, gde su uneti podaci ionako
  // otvoreni samo superadminu.
  for (const [ime, izvor] of [["prijava", PRIJAVA], ["odgovori", ODGOVORI]] as const) {
    it(`${ime}: alert ne sklapa naziv programa`, () => {
      const delovi = izvor.split("posaljiAdminAlert(").slice(1);
      expect(delovi.length).toBeGreaterThan(0);
      for (const d of delovi) {
        const poziv = d.slice(0, d.indexOf(");"));
        expect(poziv).not.toContain("labelPrograma");
        expect(poziv).not.toContain("programLabel");
      }
    });
  }
});

describe("prava iz čl. 4 st. 3 postoje u kodu", () => {
  it("povlačenje pristanka gasi prijavu i briše unete podatke", () => {
    expect(POVLACENJE).toContain("okoncajPrijavu");
    expect(POVLACENJE).toContain("povucenPristanak: true");
    const PRIJAVA_LIB = citaj("src/lib/protokol/program-prijava.ts");
    expect(PRIJAVA_LIB).toContain("metadata: Prisma.DbNull");
  });

  it("svaki ishod koji obara prijavu briše unete podatke", () => {
    // Odbijanje Fondacije, odbijanje verifikatora i obustava po reviziji — sva
    // tri idu kroz `okoncajPrijavu`; bez toga posebne kategorije ostaju u bazi
    // zauvek, jer se rok čuvanja gasio samo povlačenjem pristanka.
    for (const p of [
      "src/app/api/admin/programi/enrollments/[id]/odbij/route.ts",
      "src/app/api/programi/potvrde/[id]/odgovori/route.ts",
      "src/app/api/cron/programi-revizija/route.ts",
    ]) {
      expect(citaj(p)).toContain("okoncajPrijavu");
    }
  });

  it("okončan postupak sklanja zahteve i obaveštenja verifikatorima", () => {
    expect(citaj("src/app/api/admin/programi/enrollments/[id]/odobri/route.ts"))
      .toContain("zatvoriPostupakPotvrda");
    const POTVRDA = citaj("src/lib/protokol/program-potvrda.ts");
    expect(POTVRDA).toContain("notifikacija.deleteMany");
    expect(POTVRDA).toContain('path: ["enrollmentId"]');
  });
});

describe("tekst pristanka imenuje stvarno otkrivanje", () => {
  const JEZICI = { sr, en, ru, hr, hu } as Record<string, { programi: Record<string, string> }>;

  for (const [jezik, poruke] of Object.entries(JEZICI)) {
    it(`${jezik}: pristanak nosi broj ljudi, mogućnost povlačenja i javnost zapisa`, () => {
      const tekst = poruke.programi.pristanak_tekst;
      // Koliko ljudi saznaje za koji se program prijavljuje.
      expect(tekst).toContain("{broj}");
      // Da se pristanak može povući — pravo iz čl. 4 st. 3.
      expect(tekst.length).toBeGreaterThan(200);
      // Dugme za povlačenje postoji na svakom jeziku.
      expect(poruke.programi.povuci_pristanak).toBeTruthy();
      expect(poruke.programi.povuci_potvrda).toBeTruthy();
    });
  }
});
