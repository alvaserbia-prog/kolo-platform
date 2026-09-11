import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PODSETNIK_PRAGOVI_DANA,
  ROK_POTVRDE_DANA,
  pragPodsetnika,
  rokIzjasnjenja,
} from "@/lib/deca-pravila";
import { generisiIzjavuRoditelja } from "@/lib/deca-izjava";

/**
 * Postupak potvrde postojanja deteta (Pravilnik o učešću dece, čl. 6) — brana.
 *
 * Gleda IZVOR, kao `oglasi-vidljivost-izvor.test.ts` i `programi-kanal-izvor.test.ts`,
 * jer se sve što ovaj rizik ispravlja lako gubi tiho:
 *
 *  — poništenje je do seta 4.5.2 išlo kroz zatečeni postupak za UTVRĐENU lažnu
 *    verifikaciju, pa je čoveku koji nije slagao u zapis i u GDPR izvoz upisivalo
 *    „Poništavanje lažne verifikacije (čl. 20a)", a nepokriveni tuđi deo prebacivalo
 *    njemu kao nadoknadu — do 2.500 POEN u minusu zbog toga što se nije javio;
 *  — postupak se otvarao SAMO pri otvaranju naloga iz roditeljskog profila, pa
 *    dete koje se registrovalo samo i drugi roditelj nisu prolazili nijednu proveru;
 *  — čl. 6 st. 5 („pri svakoj novoj potvrdi postupak se sprovodi ponovo") kod nije
 *    sprovodio uopšte;
 *  — podsetnika nije bilo, a jedino obaveštenje išlo je mesec dana ranije.
 */
function izvor(p: string): string {
  return readFileSync(join(process.cwd(), p), "utf-8");
}

const DECA = izvor("src/lib/protokol/deca.ts");
const POZIV = izvor("src/lib/protokol/deca-poziv.ts");
const VERIF = izvor("src/lib/protokol/verifikacija-service.ts");
const LAZNA = izvor("src/lib/protokol/lazna-verifikacija.ts");
const CRON = izvor("src/app/api/cron/deca-potvrde/route.ts");
const PRIGOVOR = izvor("src/lib/prigovor-pravila.ts");
const PREVOD = izvor("src/lib/protokol/prevod-u-maloletni.ts");

describe("rok i podsetnici", () => {
  it("rok je 60 dana", () => {
    expect(ROK_POTVRDE_DANA).toBe(60);
    const od = new Date("2026-01-01T00:00:00.000Z");
    expect(rokIzjasnjenja(od).toISOString()).toBe("2026-03-02T00:00:00.000Z");
  });

  it("pragovi su opadajući i šalju se jednom", () => {
    expect([...PODSETNIK_PRAGOVI_DANA]).toEqual([30, 7, 1]);
    expect(pragPodsetnika(45, null)).toBeNull();
    expect(pragPodsetnika(30, null)).toBe(30);
    expect(pragPodsetnika(29, 30)).toBeNull();
    expect(pragPodsetnika(7, 30)).toBe(7);
    expect(pragPodsetnika(1, 7)).toBe(1);
    expect(pragPodsetnika(1, 1)).toBeNull();
    // Preskočeno pokretanje ne šalje tri poruke odjednom nego jednu.
    expect(pragPodsetnika(1, null)).toBe(30);
  });
});

describe("poništenje zbog neaktivnosti", () => {
  it("ide bez nadoknade i sa sopstvenim opisom", () => {
    expect(DECA).toContain("bezNadoknade: true");
    expect(DECA).toContain("čl. 6 st. 3 Pravilnika o učešću dece");
    // 🔴 Podrazumevani opis glasi „Poništavanje lažne verifikacije … (čl. 20a)" i
    // ovde ne sme da se pojavi: niko nije slagao.
    expect(DECA).not.toContain("lažne verifikacije ${");
  });

  it("javlja SVAKOME kome je nešto oduzeto, sa iznosom", () => {
    for (const uloga of ["potvrdjivac", "roditelj", "nadzornik"]) {
      expect(DECA).toContain(`uloga: "${uloga}"`);
    }
    expect(DECA).toContain("roditeljstvo_ponistena_${s.uloga}");
    expect(DECA).toContain("roditeljstvo_podsetnik_${s.uloga}");
    expect(DECA).toContain("iznos: s.iznos");
  });

  it("nadzornikovih 500 pada samo uz ishod „uredno“", () => {
    expect(DECA).toContain('v.nadzorIshod === "UREDNO"');
  });

  it("bez nadoknade niko ne nosi tuđi teret", () => {
    expect(LAZNA).toContain("bezNadoknade");
    expect(LAZNA).toContain("{ saKorisnika: POEN_VERIFIKOVANI, naVerifikatora: 0 }");
    expect(LAZNA).toContain("{ saKorisnika: POEN_NADZORNIK, naVerifikatora: 0 }");
  });
});

describe("postupak se otvara svuda gde nastaje veza", () => {
  it("i pri preuzimanju naloga (čl. 4b) i za drugog roditelja", () => {
    expect(POZIV).toContain("otvoriPostupakPotvrde");
    expect(POZIV).toContain("generisiIzjavuRoditelja");
  });

  it("i pri svakoj novoj potvrdi stvarnosti roditelja (čl. 6 st. 5)", () => {
    expect(VERIF).toContain("otvoriPostupakZaNovogPotvrdjivaca");
  });

  it("potvrda nosi konkretnog roditelja, ne samo dete", () => {
    expect(DECA).toContain("roditeljId,");
    expect(PREVOD).toContain("roditeljId: roditelj.id");
  });
});

describe("izjava roditelja (čl. 6 st. 1)", () => {
  it("rok teče samo tamo gde radnje preuzimanja odgovornosti nema", () => {
    // Otvaranje i preuzimanje upisuju izjavu odmah; jedini rok je kod prevođenja.
    expect(DECA).toContain("izjavaAt: sada");
    expect(POZIV).toContain("izjavaAt: sada");
    expect(PREVOD).toContain("izjavaRokDo: rokDo");
  });

  it("tekst imenuje da svako vraća svoje i da zapis sme u minus", () => {
    const tekst = generisiIzjavuRoditelja({ pseudonimDeteta: "Mihajlo", godine: 9 });
    expect(tekst).toContain("Mihajlo");
    expect(tekst).toContain("9 godina");
    expect(tekst).toContain("Pod punom odgovornošću");
    expect(tekst).toContain("negativan");
    expect(tekst).toContain("član");
  });
});

describe("podsetnici i prigovor", () => {
  it("cron šalje podsetnike PRE nego što obradi istekle", () => {
    expect(CRON).toContain("posaljiPodsetnike");
    expect(CRON.indexOf("posaljiPodsetnike()")).toBeLessThan(
      CRON.indexOf("obradiIstekleRokove()")
    );
  });

  it("prigovor prima vrstu POTVRDA (čl. 38 ZZPL-a traži ljudski uvid)", () => {
    expect(PRIGOVOR).toContain('"POTVRDA"');
  });
});

describe("copy imenuje posledicu na svih pet jezika", () => {
  const jezici = ["sr", "en", "ru", "hr", "hu"] as const;
  const znak: Record<(typeof jezici)[number], string[]> = {
    sr: ["minus", "prigovor"],
    en: ["negative", "appeal"],
    ru: ["минус", "возражение"],
    hr: ["minus", "prigovor"],
    hu: ["mínusz", "kifogást"],
  };
  for (const j of jezici) {
    it(`${j}: „ako ne znaš“ kaže da otpis pogađa sve i da postoji prigovor`, () => {
      const m = JSON.parse(izvor(`messages/${j}.json`));
      const t: string = m.deca.ako_ne_znas;
      for (const s of znak[j]) expect(t.toLowerCase()).toContain(s.toLowerCase());
      expect(m.profil.prigovor_tip_potvrda).toBeTruthy();
      expect(m.notifikacije.roditeljstvo_podsetnik_potvrdjivac_tekst).toBeTruthy();
      expect(m.notifikacije.roditeljstvo_ponistena_nadzornik_tekst).toBeTruthy();
      // Stari ključevi su nosili poruku bez iznosa i bez pomena minusa.
      expect(m.notifikacije.roditeljstvo_istekla_tekst).toBeUndefined();
    });
  }
});
