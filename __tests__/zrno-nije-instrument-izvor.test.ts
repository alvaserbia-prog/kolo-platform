import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * R-04 — ZRNO kao investicioni instrument (Komisija za hartije od vrednosti).
 *
 * Sažeto: ZRNO nije hartija od vrednosti (neprenosivo je) ni jedinica
 * kolektivnog investiranja. Opasan je test **investicionog ugovora**, u kome
 * smo tri od četiri elementa priznavali sopstvenim rečima — u kodu, u FAQ-u i
 * u whitepaperu. Ove provere gledaju IZVOR, jer je odbrana ovde jezička: akt
 * kaže jedno, a ime modela, opis transakcije ili jedna rečenica u FAQ-u umeju
 * da kažu suprotno, i to bez ijednog vidljivog kvara.
 *
 * 🔴 Repo je javan pod AGPL-om, pa `schema.prisma` NIJE interni fajl — to je
 * prvi dokument koji spoljni analitičar otvori.
 */

const koren = join(__dirname, "..");
const izvor = (p: string) => readFileSync(join(koren, p), "utf-8");

const JEZICI = ["sr", "en", "ru", "hr", "hu"] as const;

describe("IZVOR — baza ne govori suprotno od akta", () => {
  // Komentari u šemi namerno navode stara imena („zvalo se …") da se ne bi vratila;
  // provera gleda samo deklaracije, ne objašnjenja.
  const sema = izvor("prisma/schema.prisma").replace(/^\s*\/\/.*$/gm, "");

  it("nema modela ni polja koje se zove tržište (čl. 22 st. 3)", () => {
    // Pravilnik: „Za ZRNO ne postoji tržište, ne postoji cena ZRNA i ne postoji
    // mogućnost trgovanja njime." Model `ZrnoTrziste` je tu odredbu obarao.
    expect(sema).toContain("model ZrnoKanal {");
    expect(sema).not.toMatch(/model\s+ZrnoTrziste\b/);
  });

  it("dnevni snimak koeficijenta se ne zove kurs (čl. 23 st. 4)", () => {
    expect(sema).toContain("model ZrnoDnevniKoeficijent {");
    expect(sema).not.toMatch(/model\s+ZrnoDailyRate\b/);
    // 🟢 Snimak SME i mora da postoji — on je dokaz da koeficijent izračunava
    // Protokol automatski i bez diskrecije (čl. 23 st. 2). Brani se ime, ne postojanje.
    expect(sema).toMatch(/koeficijent\s+Decimal/);
  });

  it("ZRNO se ne kupuje i POEN se ne plaća (čl. 19 st. 6, čl. 21 st. 2)", () => {
    expect(sema).not.toMatch(/\bzrnaKupljeno\b/);
    expect(sema).not.toMatch(/\bpoenPlaceno\b/);
    expect(sema).not.toMatch(/\bpoenDobijeno\b/);
    expect(sema).toMatch(/\bzrnaUpisana\b/);
    expect(sema).toMatch(/\butrosenoPoen\b/);
    expect(sema).toMatch(/\bevidentiranoPoen\b/);
  });
});

describe("IZVOR — reč kurs ne izlazi na ekran", () => {
  const servis = izvor("src/lib/protokol/zrno.ts");

  it("opis ZRNO transakcije govori o koeficijentu", () => {
    expect(servis).toContain("ZRNA po koeficijentu");
    // Jedino preostalo pominjanje je komentar koji objašnjava zašto reč više ne stoji.
    const bezKomentara = servis.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    expect(bezKomentara).not.toMatch(/kurs/i);
  });

  it("opis nosi prevodni ključ, pa se ne prikazuje na srpskom svima", () => {
    // ZRNO je jedini tip transakcije koji je migracija `20260805130000` propustila.
    expect(servis).toContain('opisKljuc: "transakcije.zrno_upis"');
    expect(servis).toContain('opisKljuc: "transakcije.zrno_otpis"');
  });

  for (const jezik of JEZICI) {
    it(`prevod opisa postoji — ${jezik}`, () => {
      const m = JSON.parse(izvor(`messages/${jezik}.json`));
      expect(m.transakcije.zrno_upis).toContain("{koeficijent}");
      expect(m.transakcije.zrno_otpis).toContain("{koeficijent}");
      // Oznaka koeficijenta je na en glasila „Rate", a na hu „Árfolyam" (= devizni kurs).
      expect(m.zrno.koeficijent).not.toMatch(/rate|árfolyam|курс/i);
    });
  }
});

describe("IZVOR — istorija koeficijenta se nigde ne prikazuje", () => {
  it("sedmodnevna serija se ne dohvata ni ne prosleđuje (M-4)", () => {
    // Bila je mrtav kod: čitala se iz baze na svako otvaranje ekrana i slala
    // klijentu, koji je nikad nije nacrtao. Grafikon cene se ne uvodi.
    const stranica = izvor("src/app/(app)/zrno/page.tsx");
    const klijent = izvor("src/app/(app)/zrno/ZrnoKlijent.tsx");
    expect(stranica).not.toMatch(/zrnoDnevniKoeficijent\.findMany/);
    expect(stranica).not.toMatch(/poslednjiKursovi|poslednjiKoeficijenti/);
    expect(klijent).not.toMatch(/poslednjiKursovi|poslednjiKoeficijenti/);
  });
});

describe("IZVOR — copy ne predviđa prinos", () => {
  const faq = izvor("src/lib/faq-data.ts");

  it("FAQ 52 ne tvrdi da koeficijent raste sa rastom sistema", () => {
    // 🔴 Predviđanje dobiti koje izgovara sam izdavalac je treći element testa
    // investicionog ugovora. Ograda „nije zagarantovano" ga ne popravlja.
    expect(faq).not.toContain("Pošto koeficijent raste kako sistem raste");
    expect(faq).not.toContain("najčešće dobiješ više POENA");
    // Otvorenost OSTAJE — menja se oblik, ne iskrenost.
    expect(faq).toContain("i to ti kažemo otvoreno");
    expect(faq).toContain("u oba smera");
  });

  it("FAQ 52 objašnjava neutralnost upisa i otpisa", () => {
    expect(faq).toContain("Tvoj sopstveni upis i otpis ga ne pomeraju");
    // Netačna rečenica koja je tvrdila suprotno.
    expect(faq).not.toContain("pa je i koeficijent viši");
  });

  it("ZRNO se u FAQ-u ne opisuje kao ulog", () => {
    // „Ulog" je prvi element testa, izgovoren našim glasom.
    expect(faq).not.toContain("uložio nazad u nju");
    expect(faq).not.toContain("iz tog uloga dobijaš glas");
    expect(faq).not.toContain("koliko si uložio u zajednicu");
  });

  it("/pravna-pozicija ne tvrdi jednosmerno da se dobije više POENA", () => {
    const sr = JSON.parse(izvor("messages/sr.json"));
    const t = sr.pravnaPozicija.sporno2_tekst as string;
    expect(t).toContain("u oba smera");
    expect(t).toContain("sopstveni upis i otpis koeficijent ne pomeraju");
    expect(t).not.toContain("pri nižem koeficijentu a otpiše ga pri višem");
  });

  // 🔴 Prevodi su ovde rađeni ODMAH, ne pred objavu: `npm run prevodi` ovu izmenu
  // NE vidi, jer meri samo razliku prema `origin/production`, a prevodi tih ključeva
  // su tamo već bili izmenjeni ranijim radom (R-01/R-02). Gate bi prošao, a strani
  // čitalac bi zadržao predviđanje prinosa koje je R-04 upravo uklonio.
  for (const jezik of JEZICI) {
    it(`prevod ne predviđa prinos — ${jezik}`, () => {
      const m = JSON.parse(izvor(`messages/${jezik}.json`));
      const t = m.pravnaPozicija.sporno2_tekst as string;
      // Svaka verzija nabraja ČETIRI razloga, ne tri — četvrti je neutralnost upisa.
      expect(t).toMatch(/Četiri|Four|Четыре|Négy/);
    });
  }
});

describe("IZVOR — whitepaper ne zove razliku podsticajem", () => {
  const wp = izvor("dokumentacija 4.1/whitepaper_4_6_6.md");

  it("koeficijent više nema podsticajnu funkciju", () => {
    expect(wp).not.toContain("ima podsticajnu funkciju za rane učesnike");
    expect(wp).not.toContain("Ova mogućnost je strukturni podsticaj");
  });

  it("odeljak 6.4 ne tvrdi da upis ZRNA diže koeficijent", () => {
    expect(wp).not.toContain("Kad korisnici upisuju ZRNO, imenilac formule opada. To takođe menja obračunski koeficijent naviše.");
    expect(wp).toContain("Upis i otpis ZRNA takođe ne pomeraju koeficijent");
  });
});
