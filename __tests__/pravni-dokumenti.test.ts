/**
 * Čuvar kanonskog seta akata.
 *
 * Javne pravne stranice učitavaju markdown po IMENU FAJLA, a ime nosi verziju
 * (`Pravilnik_4_1_1.md`, `uslovi_koriscenja_4_1_1.md`). Pri podizanju verzije lako je
 * repointovati jednu stranicu a drugu zaboraviti, ili preimenovati srpski original
 * a ostaviti prevod — loader tada tiho padne na srpski i čitalac na engleskom dobije
 * stari tekst, bez ijedne greške u logu.
 *
 * Ovaj test zato proverava tri stvari:
 *  1. svaki akt koji app traži postoji na SVA tri jezika (sr, en, ru);
 *  2. ključne odredbe seta su stvarno unutra, na svakom jeziku;
 *  3. ukinute odredbe (tabla zahteva za jemstvo) nisu preživele nigde.
 */
import { describe, it, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { ucitajPravniDokument } from "@/lib/pravni-dokument";

const BAZA = path.join(process.cwd(), "dokumentacija 4.1");
const JEZICI = ["sr", "en", "ru"] as const;

/** Svi akti koje javne stranice traže — mora se poklapati sa `page.tsx` referencama. */
const AKTI = [
  // Set je MEŠOVIT: ova četiri akta su na 4.2.0 (paket „nadzor dobija glas"),
  // ostalih jedanaest na 4.1.1. Verzija po aktu, ne po setu.
  "Pravilnik_4_2_0.md",
  "dokaz_stvarnosti_4_2_0.md",
  "DPIA_4_2_0.md",
  "radnje_obrade_4_2_0.md",
  "uslovi_koriscenja_4_1_1.md",
  "politika_4_1_1.md",
  "statut_4_1_0.md",
  "whitepaper_4_1_1.md",
  "rizici_4_1_1.md",
  "hijerarhija_4_1_1.md",
  "donacije_4_1_1.md",
  "operativni_4_1_1.md",
  "osnivacki_4_1_1.md",
  "gornje_kolo_4_1_1.md",
  "programi_podrske_4_1_1.md",
];

/**
 * Ključne odredbe seta — po jeziku, da fallback na srpski ne prođe neopaženo.
 *
 * Drže se odredbe uvedene i u 4.1.0 (osmi kanal, oglas neverifikovanog), i u 4.1.1
 * (postupak izmene; doprinos verifikovanom odmah), i u 4.2.0 (nadzorni predmet,
 * nadoknada): sadržaj starije verzije nije nestao podizanjem broja.
 *
 * 🔴 Provera „Verifikovanom korisniku doprinos" postoji zato što su 4.2.0 dokumenta
 * nastala iz 4.1.0 osnove dok je `main` u međuvremenu izdao 4.1.1. Bez nje bi objava
 * 4.2.0 tiho poništila izmenu čl. 40a iz 4.1.1 i niko to ne bi primetio.
 */
const UVEDENO: Record<string, Record<string, string[]>> = {
  "Pravilnik_4_2_0.md": {
    sr: ["### Član 40a", "Verifikovanom korisniku doprinos se evidentira", "član 20b"],
    en: ["### Article 40a", "Article 20b"],
    ru: ["### Статья 40a", "статьёй 20b"],
  },
  "dokaz_stvarnosti_4_2_0.md": {
    sr: ["### Član 11a", "### Član 20b", "### Član 20c"],
    en: ["### Article 11a", "### Article 20b", "### Article 20c"],
    ru: ["### Статья 11a", "### Статья 20b", "### Статья 20c"],
  },
  "radnje_obrade_4_2_0.md": {
    sr: ["Radnja obrade br. 14"],
    en: ["Processing activity No. 14"],
    ru: ["Операция обработки № 14"],
  },
  "uslovi_koriscenja_4_1_1.md": {
    sr: ["Oglas neverifikovanog korisnika", "ne smatra se izmenom Uslova"],
    en: ["Listing by an Unverified User", "is not deemed an amendment to the Terms"],
    ru: ["Объявление неверифицированного пользователя", "не считается изменением Условий"],
  },
  // Prihvatanje Politike NIJE pristanak za obrade čiji je osnov pristanak — bez te
  // odredbe bi gejt (zamrzavanje naloga do prihvatanja) obuhvatio i te obrade, pa
  // pristanak ne bi bio slobodno dat.
  "politika_4_1_1.md": {
    sr: ["nije pristanak za obrade čiji je pravni osnov pristanak"],
    en: ["is not consent for processing whose legal basis is consent"],
    ru: ["не является согласием на обработку"],
  },
};

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

describe("kanonski set akata 4.1.1", () => {
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

  it("ključne odredbe seta postoje na svakom jeziku", async () => {
    for (const [akt, poJeziku] of Object.entries(UVEDENO)) {
      for (const jez of JEZICI) {
        const tekst = await ucitajPravniDokument(akt, jez);
        for (const odredba of poJeziku[jez]) {
          expect(tekst, `${jez}/${akt} nema „${odredba}"`).toContain(odredba);
        }
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

  /**
   * 4.2.0 briše reč „trajno" iz čl. 12 dokaza stvarnosti. Nije kozmetika: dok je
   * preuzimanje zone trajno, poništenjem verifikacije bi korisniku ostao zatvoren
   * deo mreže, pa ga niko odatle ne bi mogao ponovo verifikovati — i pravo na
   * povratak iz čl. 20c ne bi radilo. Kod zonu ionako preračunava iz važećih veza.
   */
  it("zabranjena zona se više ne opisuje kao trajna", async () => {
    const TRAJNO: Record<string, RegExp> = {
      sr: /trajno preuzima/i,
      en: /permanently takes/i,
      ru: /навсегда принимает/i,
    };
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument("dokaz_stvarnosti_4_2_0.md", jez);
      expect(tekst, `${jez} još opisuje zonu kao trajnu`).not.toMatch(TRAJNO[jez]);
    }
  });

  /**
   * Kaskada više ne obara sve verifikacije jednog verifikatora (čl. 19). Ako se ta
   * rečenica vrati u tekst, stvarni ljudi ponovo gube status zbog tuđe radnje.
   */
  it("ne postoji više poništavanje SVIH verifikacija lažnog verifikatora", async () => {
    const STARO: Record<string, RegExp> = {
      sr: /poništavaju se sve verifikacije koje je lažni verifikator obavio/i,
      en: /all verifications performed by the false verifier are annulled/i,
      ru: /аннулируются все верификации, проведённые ложным верификатором/i,
    };
    for (const jez of JEZICI) {
      const tekst = await ucitajPravniDokument("dokaz_stvarnosti_4_2_0.md", jez);
      expect(tekst, `${jez} još obara sve verifikacije verifikatora`).not.toMatch(STARO[jez]);
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
