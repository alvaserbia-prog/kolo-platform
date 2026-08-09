/**
 * Čuvar kanonskog seta akata.
 *
 * Javne pravne stranice učitavaju markdown po IMENU FAJLA, a ime nosi verziju
 * (`Pravilnik_4_2_0.md`). Pri podizanju verzije seta lako je repointovati jednu
 * stranicu a drugu zaboraviti, ili preimenovati srpski original a ostaviti prevod
 * — loader tada tiho padne na srpski i čitalac na engleskom dobije stari tekst,
 * bez ijedne greške u logu.
 *
 * Ovaj test zato proverava tri stvari:
 *  1. svaki akt koji app traži postoji na SVA tri jezika (sr, en, ru);
 *  2. ključne odredbe verzije 4.2.0 su stvarno unutra, na svakom jeziku;
 *  3. ukinute odredbe (tabla zahteva za jemstvo) nisu preživele nigde.
 */
import { describe, it, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { ucitajPravniDokument } from "@/lib/pravni-dokument";

const BAZA = path.join(process.cwd(), "dokumentacija 4.2");
const JEZICI = ["sr", "en", "ru"] as const;

/** Svi akti koje javne stranice traže — mora se poklapati sa `page.tsx` referencama. */
const AKTI = [
  "Pravilnik_4_2_0.md",
  "dokaz_stvarnosti_4_2_0.md",
  "uslovi_koriscenja_4_2_0.md",
  "politika_4_2_0.md",
  "DPIA_4_2_0.md",
  "radnje_obrade_4_2_0.md",
  "statut_4_1_0.md",
  "whitepaper_4_2_0.md",
  "rizici_4_2_0.md",
  "hijerarhija_4_2_0.md",
  "donacije_4_2_0.md",
  "operativni_4_2_0.md",
  "osnivacki_4_2_0.md",
  "gornje_kolo_4_2_0.md",
  "programi_podrske_4_2_0.md",
];

/** Odredbe uvedene verzijom 4.2.0 — po jeziku, da fallback na srpski ne prođe neopaženo. */
const UVEDENO: Record<string, Record<string, string>> = {
  "Pravilnik_4_2_0.md": {
    sr: "### Član 40a",
    en: "### Article 40a",
    ru: "### Статья 40a",
  },
  "uslovi_koriscenja_4_2_0.md": {
    sr: "Oglas neverifikovanog korisnika",
    en: "Listing by an Unverified User",
    ru: "Объявление неверифицированного пользователя",
  },
};

/**
 * Spisak kanala iz čl. 15 — brojana lista, pa se greška ne vidi golim okom.
 *
 * U 4.2.0 je kanal „rast kolektivnih oblika" brisan (modul nije aktiviran), pa je
 * spisak pao sa OSAM na SEDAM tačaka, a kanal koji je bio tačka 8 preimenovan je u
 * „doprinos razmeni na platformi" i postao tačka 7. Renumeracija je opasna zato što
 * ostatak akata upućuje na TAČKU po broju (čl. 28: „član 15 tačka 7"): ako se
 * prevod ne renumeriše zajedno sa originalom, upućivanje tiho pokaže na pogrešan
 * kanal — tekst i dalje deluje ispravno.
 */
const POSLEDNJI_KANAL: Record<string, string> = {
  sr: "7) doprinos razmeni na platformi.",
  en: "7) contribution to exchange on the platform.",
  ru: "7) вклад в обмен на платформе.",
};

/** Osma tačka ne sme da postoji ni na jednom jeziku — spisak se završava na sedmoj. */
const OSMA_TACKA = /^8\)\s/m;

/**
 * Ukinute odredbe — ne smeju da prežive ni u jednom aktu, ni na jednom jeziku.
 *
 * Provera je namerno na KORENU pojma, ne na celoj rečenici: prva verzija ovog
 * testa tražila je tačne fraze i zato je propustila definiciju pojma u čl. 2
 * Uslova („Tabla zahteva za jemstvo — mehanizam Platforme…"). Ko ukida institut,
 * mora da ga ukine i u rečniku pojmova, ne samo tamo gde se primenjuje.
 */
const UKINUTO: Record<string, RegExp[]> = {
  sr: [/tabl[aeiou]\s+zahteva\s+za\s+jemstvo/i, /kartic[aeiou]\s+prepoznavanja/i],
  en: [/guarantee\s+board/i, /recognition\s+card/i],
  ru: [/доск[аеиуой]\s+запросов/i, /карточк[аеиуой]\s+узнавания/i],
};

/** Napomene o izmeni namerno pominju ukinutu tablu — one se izuzimaju iz provere. */
function bezNapomenaOIzmeni(tekst: string): string {
  return tekst
    .split("\n")
    .filter(
      (red) =>
        !red.includes("Napomena o izmeni") &&
        !red.includes("Note on the amendment") &&
        !red.includes("Примечание об изменении") &&
        !red.startsWith("| **Napomena** |") &&
        !red.startsWith("| **Note** |") &&
        !red.startsWith("| **Примечание** |"),
    )
    .join("\n");
}

describe("kanonski set akata 4.2.0", () => {
  it.each(AKTI)("%s postoji na sva tri jezika", async (akt) => {
    for (const jez of JEZICI) {
      const pod = jez === "sr" ? "" : `${jez}/`;
      await expect(
        fs.access(path.join(BAZA, pod + akt)),
        `nedostaje ${pod}${akt}`,
      ).resolves.toBeUndefined();
    }
  });

  it.each(AKTI)("%s se učita i nije prazan", async (akt) => {
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument(akt, jez);
      expect(tekst.length, `${jez}/${akt} je prekratak`).toBeGreaterThan(500);
    }
  });

  it("odredbe uvedene u 4.2.0 postoje na svakom jeziku", async () => {
    for (const [akt, poJeziku] of Object.entries(UVEDENO)) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        expect(tekst, `${jez}/${akt} nema „${poJeziku[jez]}"`).toContain(poJeziku[jez]);
      }
    }
  });

  it("ukinuta tabla zahteva za jemstvo ne postoji ni u jednom aktu", async () => {
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = bezNapomenaOIzmeni(await ucitajPravniDokument(akt, jez));
        for (const obrazac of UKINUTO[jez]) {
          expect(tekst, `${jez}/${akt} još sadrži ${obrazac}`).not.toMatch(obrazac);
        }
      }
    }
  });

  it("čl. 15 ima sedam kanala i završava se doprinosom razmeni", async () => {
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument("Pravilnik_4_2_0.md", jez);
      expect(tekst, `${jez}: nema „${POSLEDNJI_KANAL[jez]}"`).toContain(POSLEDNJI_KANAL[jez]);
      expect(tekst, `${jez}: spisak kanala još ima osmu tačku`).not.toMatch(OSMA_TACKA);
    }
  });

  it("rast kolektivnih oblika nije više kanal ni u jednom aktu", async () => {
    // Traži se BROJANA STAVKA, ne sam pojam: pojam ostaje u Glavi VIII (Krug i
    // zadruga postoje kao moduli) i u odredbi koja izričito kaže da rast NIJE kanal.
    const kaoStavka = /^\d\)\s.*(rast kolektivnih|growth of collective|рост коллективных)/im;
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        expect(tekst, `${jez}/${akt} još nabraja rast kolektivnih oblika kao kanal`).not.toMatch(kaoStavka);
      }
    }
  });

  it("stari naziv kanala (doprinos sadržaju platforme) ne postoji nigde", async () => {
    const stari = [/doprinos[uae]?\s+sadržaju\s+platforme/i, /contribution to platform content/i,
                   /вклад[ае]?\s+в\s+содержание\s+платформы/i];
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        for (const obrazac of stari) {
          expect(tekst, `${jez}/${akt} još nosi stari naziv kanala ${obrazac}`).not.toMatch(obrazac);
        }
      }
    }
  });

  it("unakrsne verzijske reference ne pokazuju na stari set", async () => {
    for (const akt of AKTI) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        // Statut ima sopstvenu numeraciju (v4.1) i ne prati verziju seta.
        expect(tekst, `${jez}/${akt} upućuje na v4.0.x`).not.toMatch(/\(v(?:erzija |ersion |ерсия )?4\.0\.[01]\)/);
      }
    }
  });
});

/**
 * Hrvatski i mađarski prevod nastaju postupno — akt po akt. Ovaj blok zato
 * proverava SAMO one fajlove koji već postoje, pa nedovršen set ne obara test.
 *
 * Provera na curenje jezika nije teorijska: pri prvom mađarskom aktu se kroz
 * tekst provukla hrvatska reč „Zaklada" umesto „Alapítvány", pet puta. Kad se
 * isti dokument piše na dva bliska zadatka zaredom, takav propust je tih —
 * fajl je i dalje validan markdown i stranica se uredno prikaže.
 */
describe("prevodi u nastajanju (hr, hu)", () => {
  const U_NASTAJANJU = ["hr", "hu"] as const;

  const DISKLEJMER: Record<string, string> = {
    hr: "Neslužbeni prijevod",
    hu: "Nem hivatalos fordítás",
  };

  /** Reči koje u datom jeziku ne smeju da se pojave — znak da je tekst procurio iz drugog. */
  const TUDJE_RECI: Record<string, RegExp[]> = {
    hr: [/\bAlapítvány\b/, /\bfelhasználó/i, /\bhitelesít/i, /\bszabályzat/i],
    hu: [/\bZaklada\b/, /\bkorisnik/i, /\bverifikacij/i, /\bpravilnik/i],
  };

  async function postojeci(jez: string) {
    const nadjeni: string[] = [];
    for (const akt of AKTI) {
      try {
        await fs.access(path.join(BAZA, jez, akt));
        nadjeni.push(akt);
      } catch {
        // Prevod još nije napisan — preskače se.
      }
    }
    return nadjeni;
  }

  it.each(U_NASTAJANJU)("%s: svaki napisan prevod nosi disklejmer o merodavnom originalu", async (jez) => {
    for (const akt of await postojeci(jez)) {
      const tekst = await fs.readFile(path.join(BAZA, jez, akt), "utf-8");
      expect(tekst.slice(0, 400), `${jez}/${akt} nema disklejmer`).toContain(DISKLEJMER[jez]);
    }
  });

  it.each(U_NASTAJANJU)("%s: nijedan prevod ne sadrži reči drugog jezika", async (jez) => {
    for (const akt of await postojeci(jez)) {
      const tekst = await fs.readFile(path.join(BAZA, jez, akt), "utf-8");
      for (const obrazac of TUDJE_RECI[jez]) {
        expect(tekst, `${jez}/${akt} sadrži tuđu reč ${obrazac}`).not.toMatch(obrazac);
      }
    }
  });

  it.each(U_NASTAJANJU)("%s: loader servira prevod kad postoji, inače srpski original", async (jez) => {
    const napisani = await postojeci(jez);
    for (const akt of AKTI) {
      const tekst = await ucitajPravniDokument(akt, jez);
      if (napisani.includes(akt)) {
        expect(tekst, `${jez}/${akt} nije serviran`).toContain(DISKLEJMER[jez]);
      } else {
        expect(tekst, `${jez}/${akt} bez prevoda mora pasti na srpski`).not.toContain(DISKLEJMER[jez]);
        expect(tekst.length).toBeGreaterThan(500);
      }
    }
  });
});
