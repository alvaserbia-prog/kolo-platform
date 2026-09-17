import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * R-07 — nelojalna i obmanjujuća poslovna praksa (Ministarstvo trgovine).
 *
 * ─── Zašto ove provere gledaju IZVOR ────────────────────────────────────────
 *
 * Ovo nije rizik da neko dokaže da je POEN novac (to su R-01 i R-11) nego rizik
 * jedan stepen niže i zato mnogo lakši za regulatora: nepoštena praksa se ceni
 * po tome **kako prosečan potrošač razume poruku**, ne po tome šta piše u aktu
 * koji on nikad neće otvoriti. Teret je time faktički obrnut — regulatoru je
 * dovoljan screenshot na kome piše nešto što protivreči našem sopstvenom aktu.
 *
 * 🔴 Nalaz koji je pokrenuo ceo set: `nabavke.paritet_napomena` je na svih pet
 * jezika govorila da je POEN po jedinici jednak maloprodajnoj referenci
 * „**jedan prema jedan**" — dakle OBJAVLJEN KURS, na javnom ekranu, i to baš na
 * nabavci, jedinom mestu gde dinarski račun stvarno postoji. Institut koji je
 * opisivala (paritet) ukinut je setom 4.4.3 još 07.09.2026.
 *
 * 🔴 Preživela je R-01, R-02 i R-04 zato što su sve tri provere tražile reči
 * „kurs", „POEN/RSD", „Od (RSD)" i „Rate" — a nijedna reč kojom je ta rečenica
 * napisana. Zato ove provere traže IZRAZ, ne ime ključa.
 *
 * 🟡 Šta se namerno NE proverava: iznosi u primerima na naslovnoj (odluka
 * vlasnika). Odnos se iz njih može izvesti, ali ga nigde ne izgovaramo, a akt
 * (Uslovi čl. 19) izričito kaže da Fondacija nijedan odnos ne objavljuje i ne
 * preporučuje. Brojevi koji odgovaraju stvarnoj praksi korisnika nisu obmana.
 */

const koren = join(__dirname, "..");
const izvor = (p: string) => readFileSync(join(koren, p), "utf-8");
const JEZICI = ["sr", "en", "ru", "hr", "hu"] as const;
const poruke = (j: string) => JSON.parse(izvor(`messages/${j}.json`)) as Record<string, Record<string, string>>;
const sveVrednosti = (j: string) => JSON.stringify(poruke(j));

describe("IZVOR — objavljenog pariteta nema ni na jednom jeziku", () => {
  // Svaki izraz kojim se odnos može izgovoriti, na svih pet jezika. Ne ime ključa:
  // ključ `paritet_napomena` i dalje postoji, samo više ne nosi odnos.
  const PARITET = [
    /jedan\s+prema\s+jedan/i,
    /\bone\s+to\s+one\b/i,
    /один\s+к\s+одному/i,
    /egy\s+az\s+egyhez/i,
    /maloprodajn\w*\s+referenc/i,
    /retail\s+reference/i,
    /kiskereskedelmi\s+referencia/i,
    /розничн\w*\s+ориентир/i,
  ];

  for (const j of JEZICI) {
    it(`${j}: nijedan izraz za paritet u messages`, () => {
      const sve = sveVrednosti(j);
      for (const obrazac of PARITET) {
        expect(obrazac.test(sve), `${j}: vratio se paritet — ${obrazac}`).toBe(false);
      }
    });
  }

  it("mrtav ključ o maloprodajnom cenovniku je obrisan (donacija robe ukinuta 08.09.2026)", () => {
    for (const j of JEZICI) {
      const m = poruke(j);
      expect(m.greske?.za_robu_i_usluge_obavezan_je_maloprodajni_cenovnik).toBeUndefined();
    }
  });

  it("napomena uz kalkulaciju nabavke kaže da broj POEN-a NIJE cena dobra", () => {
    // Pozitivna strana iste provere: ključ mora da postoji i mora da nosi
    // odredbu iz nabavki čl. 19 (broj POEN-a se ne izvodi iz cene).
    const m = poruke("sr");
    expect(m.nabavke.paritet_napomena).toContain("nije cena dobra");
    expect(m.nabavke.paritet_napomena).toContain("ne izvodi se iz nje");
  });
});

describe("IZVOR — POEN se ne 'plaća' (Pravilnik čl. 13, Uslovi čl. 22 st. 3)", () => {
  // Akt kaže da POEN „ne služi izmirenju novčanih obaveza" i da ažuriranje
  // evidencije „ne predstavlja plaćanje". Prva rečenica na naslovnoj je do 4.6.4
  // glasila „Na pijaci tvog kraja PLAĆA SE doprinosom" — dakle najvidljivije mesto
  // koje imamo govorilo je suprotno od akta.
  //
  // 🟡 Provera je namerno SUŽENA na tvrdnju da se POEN-om/doprinosom plaća.
  // Prva verzija je hvatala svaki glagol plaćanja u rečenici sa POEN-om i obarala
  // pet ISPRAVNIH tekstova: četiri su negacije koje nose samu odbranu („nadoknada
  // … ne može se naplatiti", „ne postoji … institucija koja razliku isplaćuje"),
  // a peti opisuje kartično plaćanje U DINARIMA („Naplaćeno karticom"). Brana koja
  // obara odbranu je gora od nikakve.
  const PLACANJE_POENOM = [
    /pla(ć|c)a\s+se\s+(doprinos|POEN)/i,
    /plati(š|ti|te)\s+(doprinos|POEN)/i,
    /pla(ć|c)a(š|ju|mo)\s+(doprinos|POEN)/i,
    /pla(ć|c)anj\w*\s+POEN/i,
    /paid\s+in\s+(contribution|POEN)/i,
    /pay(ing)?\s+(with|in)\s+(contribution|POEN)/i,
    /плат(ишь|ить|ите)\s+вкладом/i,
    /оплат\w*\s+ПОЕН/i,
    /hozzájárulással\s+fizet/i,
    /POEN-nel\s+fizet/i,
  ];

  for (const j of JEZICI) {
    it(`${j}: nigde ne piše da se plaća POEN-om ili doprinosom`, () => {
      const sve = sveVrednosti(j);
      for (const obrazac of PLACANJE_POENOM) {
        expect(obrazac.test(sve), `${j}: POEN kao sredstvo plaćanja — ${obrazac}`).toBe(false);
      }
    });
  }

  it("sr: bedž na naslovnoj govori o razmeni, ne o plaćanju", () => {
    expect(poruke("sr").landing.hero_badge).toMatch(/razmenjuje\s+se/i);
  });
});

describe("IZVOR — naslovna ne preporučuje odnos prema dinaru (Uslovi čl. 19 st. 1)", () => {
  // Akt: „Fondacija … ne preporučuje po kom odnosu korisnik treba da odredi iznos."
  // Naslovna je do 4.6.4 govorila „Dinarska cena služi samo kao orijentir pri
  // dogovoru" — deklarativno i autorski, dakle preporuka.
  const ORIJENTIR = [
    /dinarska\s+cena\s+služi/i,
    /price\s+in\s+dinars\s+only\s+serves/i,
    /цена\s+в\s+динарах\s+служит/i,
    /cijena\s+u\s+dinarima\s+služi/i,
    /dinárban\s+megadott\s+ár\s+csak/i,
  ];

  for (const j of JEZICI) {
    it(`${j}: nema rečenice da dinarska cena služi kao orijentir`, () => {
      const sve = sveVrednosti(j);
      for (const obrazac of ORIJENTIR) {
        expect(obrazac.test(sve), `${j}: vratio se orijentir — ${obrazac}`).toBe(false);
      }
    });
  }

  it("sr: napomena uz primer nosi odredbu čl. 19 doslovno", () => {
    const m = poruke("sr");
    expect(m.landing.primer_napomena_2).toContain("ne objavljuje, ne preporučuje");
  });
});

describe("IZVOR — trgovinski rečnik ne stoji u šemi ni u copy-ju", () => {
  const sema = izvor("prisma/schema.prisma").replace(/^\s*\/\/.*$/gm, "");

  it("MarketplaceListing nema kupca ni prodaju", () => {
    expect(sema).not.toMatch(/\bbuyerId\b/);
    expect(sema).not.toMatch(/\bsoldAt\b/);
    expect(sema).not.toMatch(/\bBuyerListings\b/);
  });

  it("ListingStatus nema vrednost SOLD", () => {
    const enumBlok = sema.match(/enum ListingStatus \{[^}]*\}/)?.[0] ?? "";
    expect(enumBlok).not.toMatch(/\bSOLD\b/);
    expect(enumBlok).toMatch(/\bRAZMENJEN\b/);
  });

  it("naslovna ne nosi 'maržu' (trgovinski pojam + uporedna tvrdnja o ceni)", () => {
    const MARZA = [/\bmarž/i, /\bmarkup\b/i, /наценк/i, /árrés/i];
    for (const j of JEZICI) {
      const sve = sveVrednosti(j);
      for (const obrazac of MARZA) {
        expect(obrazac.test(sve), `${j}: vratila se marža — ${obrazac}`).toBe(false);
      }
    }
  });
});

describe("IZVOR — javna pravna pozicija ima odeljak o zaštiti potrošača", () => {
  // Do R-07 stranica je imala ZDI, ZPS, ZTK i (od R-02) poreski odeljak, a ZZP
  // se nije pominjao nijednom — iako je to regulator sa najnižim pragom za dolazak.
  it("stranica renderuje zzp_naslov i zzp_tekst", () => {
    const strana = izvor("src/app/(public)/pravna-pozicija/page.tsx");
    expect(strana).toContain('t("zzp_naslov")');
    expect(strana).toContain('t("zzp_tekst")');
  });

  for (const j of JEZICI) {
    it(`${j}: tekst postoji i priznaje šta ostaje sporno`, () => {
      const p = poruke(j).pravnaPozicija;
      expect(p.zzp_naslov?.length ?? 0).toBeGreaterThan(5);
      expect(p.zzp_tekst?.length ?? 0).toBeGreaterThan(400);
    });
  }

  it("sr: odgovara na prethodno pitanje — da li je Fondacija trgovac", () => {
    expect(poruke("sr").pravnaPozicija.zzp_tekst).toContain("Fondacija prema korisnicima tako ne nastupa");
  });
});

describe("IZVOR — oglas deteta: zabrana i obaveštenje roditelju (M-5″)", () => {
  it("obrazac za oglas prikazuje napomenu maloletnom nalogu", () => {
    const forma = izvor("src/app/(app)/pijaca/novi-oglas/NoviOglasForma.tsx");
    expect(forma).toMatch(/maloletan\s*&&/);
    expect(forma).toContain('t("dete_zabranjeno")');
    const strana = izvor("src/app/(app)/pijaca/novi-oglas/page.tsx");
    expect(strana).toMatch(/maloletan=\{/);
  });

  for (const j of JEZICI) {
    it(`${j}: napomena imenuje e-cigarete`, () => {
      // 🔴 E-cigareta je konkretan povod za meru: dete može da je ponudi drugom
      // detetu, a oglas neće videti nijedan odrastao osim roditelja.
      const v = poruke(j).pijaca.dete_zabranjeno ?? "";
      expect(v.length).toBeGreaterThan(40);
      expect(/e-cigaret|elektronikus|электронн|e-cigi/i.test(v), `${j}: ${v}`).toBe(true);
    });
  }

  it("objava oglasa maloletnog naloga javlja roditelju", () => {
    // 🔴 Čl. 10 st. 6 čini roditelja odgovornim za sadržaj DO TRENUTKA UKLANJANJA.
    // Ta odredba je neizvodljiva dok roditelj ne zna da je oglas objavljen — do
    // 4.6.4 ga je video samo ako bi sam otvorio profil deteta.
    const ruta = izvor("src/app/api/pijaca/route.ts");
    expect(ruta).toContain("javiRoditeljimaZaOglas");
    expect(ruta).toMatch(/korisnik\.maloletan/);

    const servis = izvor("src/lib/protokol/deca.ts");
    expect(servis).toContain("export async function javiRoditeljimaZaOglas");
    // Link mora da vodi na profil deteta — tamo je dugme „Ukloni" (čl. 10 st. 1).
    expect(servis).toMatch(/link:\s*`\/deca\/\$\{deteId\}`/);
  });

  for (const j of JEZICI) {
    it(`${j}: obaveštenje roditelju je prevedeno`, () => {
      const n = poruke(j).notifikacije;
      expect(n.dete_oglas_naslov).toBeTruthy();
      expect(n.dete_oglas_tekst).toBeTruthy();
    });
  }
});
