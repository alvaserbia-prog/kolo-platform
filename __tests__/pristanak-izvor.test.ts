/**
 * Brana za dokaz pristanka (R-06, set 4.6.3).
 *
 * 🔴 Gleda IZVOR, ne samo ponašanje. Cela poenta mere je da server, a ne
 * pretraživač, proverava i beleži pristanak — a to se iz jedinične provere
 * funkcije ne vidi. Isti obrazac kao `oglasi-vidljivost-izvor.test.ts`,
 * `identifikovan-clan-izvor.test.ts` i `r03-posebne-kategorije-izvor.test.ts`:
 * ispravno pravilo ne vredi ništa dok ga svaki ulaz zaista ne pozove.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

import { AKT_POLITIKA, AKT_USLOVI, VERZIJA_PRISTANKA_KOLACICI } from "@/lib/verzije-akata";
import { oba, pristanciPriRegistraciji, tekstPristankaNaKolacice } from "@/lib/pristanak";

const KOREN = process.cwd();
const citaj = (p: string) => readFileSync(join(KOREN, p), "utf-8");

const REGISTRACIJA = citaj("src/app/api/registracija/route.ts");
const OAUTH = citaj("src/app/api/oauth/dovrsi/route.ts");
const OBRAZAC = citaj("src/app/(auth)/registracija/page.tsx");
const OBRAZAC_OAUTH = citaj("src/app/oauth/dovrsi/page.tsx");
const SERVIS = citaj("src/lib/protokol/pristanak.ts");
const PRAVILA = citaj("src/lib/pristanak.ts");
const KOLACICI = citaj("src/lib/cookieConsent.ts");
const BANNER = citaj("src/components/CookieConsent.tsx");
const PROGRAM = citaj("src/app/api/programi/[type]/prijava/route.ts");
const PRIJAVA_SERVIS = citaj("src/lib/protokol/program-prijava.ts");
const DECA = citaj("src/lib/protokol/deca.ts");
const DECA_POZIV = citaj("src/lib/protokol/deca-poziv.ts");
const IZJAVA = citaj("src/lib/deca-izjava.ts");
const EKSPORT = citaj("src/app/api/profil/eksport/route.ts");
const SEMA = citaj("prisma/schema.prisma");

describe("pravila pristanka", () => {
  it("traži OBA prihvatanja i ne prihvata ništa osim `true`", () => {
    expect(oba(true, true)).toBe(true);
    expect(oba(true, false)).toBe(false);
    expect(oba(false, true)).toBe(false);
    // Striktno: „truthy" vrednost nije pristanak. Obrazac šalje logičku vrednost,
    // a sve ostalo je ili greška ili pokušaj zaobilaženja.
    expect(oba("true", "true")).toBe(false);
    expect(oba(1, 1)).toBe(false);
    expect(oba(undefined, undefined)).toBe(false);
  });

  it("registracija daje DVA odvojena zapisa, ne jedan", () => {
    const stavke = pristanciPriRegistraciji("sr");
    expect(stavke).toHaveLength(2);
    expect(stavke.map((s) => s.vrsta).sort()).toEqual([
      "POLITIKA_PRIVATNOSTI",
      "USLOVI_KORISCENJA",
    ]);
  });

  it("svaki zapis nosi verziju akta i neprazan tekst", () => {
    for (const s of pristanciPriRegistraciji("sr")) {
      expect(s.verzija).toMatch(/^\d+\.\d+\.\d+$/);
      expect(s.tekst.length).toBeGreaterThan(10);
      expect(s.tekst).toContain(s.verzija);
    }
  });

  it("tekst je na jeziku korisnika, a ne uvek na srpskom", () => {
    // 🔴 Obrnuto od ugovora o donaciji i izjave roditelja, koji su pravni dokumenti
    // po srpskom pravu. Pristanak po ZZPL čl. 15 st. 2 mora biti dat jezikom
    // razumljivim onome ko ga daje.
    const sr = pristanciPriRegistraciji("sr")[0].tekst;
    for (const jezik of ["en", "ru", "hr", "hu"]) {
      expect(pristanciPriRegistraciji(jezik)[0].tekst).not.toBe(sr);
    }
  });

  it("kolačići nose sopstvenu verziju obaveštenja", () => {
    const k = tekstPristankaNaKolacice("sr");
    expect(k.vrsta).toBe("KOLACICI_ANALITIKA");
    expect(k.verzija).toBe(VERZIJA_PRISTANKA_KOLACICI);
    expect(k.tekst.length).toBeGreaterThan(10);
  });
});

describe("verzije akata imaju JEDAN izvor", () => {
  it("fajl iz konstante postoji na svih pet jezika", () => {
    for (const akt of [AKT_USLOVI, AKT_POLITIKA]) {
      for (const pod of ["", "en/", "ru/", "hr/", "hu/"]) {
        const put = join(KOREN, "dokumentacija 4.1", pod, akt.fajl);
        expect(existsSync(put), `nedostaje ${pod}${akt.fajl}`).toBe(true);
      }
    }
  });

  it("broj verzije se poklapa sa imenom fajla", () => {
    for (const akt of [AKT_USLOVI, AKT_POLITIKA]) {
      expect(akt.fajl).toContain(akt.verzija.replace(/\./g, "_"));
    }
  });

  it("stranice čitaju ime fajla iz konstante, ne otkucano", () => {
    // Bez ovoga bi verzija živela na dva mesta i razišla se pri prvom bumpu —
    // a zapis pristanka bi tada upućivao na akt koji se čitaocu ne prikazuje.
    expect(citaj("src/app/(public)/uslovi/page.tsx")).toContain("AKT_USLOVI.fajl");
    expect(citaj("src/app/(public)/privatnost/page.tsx")).toContain("AKT_POLITIKA.fajl");
  });
});

describe("IZVOR: registracija ne otvara nalog bez pristanka", () => {
  it("obe rute proveravaju pristanak na SERVERU", () => {
    for (const [ime, izvor] of [["registracija", REGISTRACIJA], ["oauth", OAUTH]] as const) {
      expect(izvor, `${ime} ne proverava pristanak`).toContain("oba(");
      expect(izvor).toContain("prihvatamUslove");
      expect(izvor).toContain("prihvatamPolitiku");
      expect(izvor).toContain("PORUKA_PRISTANAK_OBAVEZAN");
    }
  });

  it("zapis nastaje u ISTOJ transakciji sa nalogom", () => {
    // Pad između `user.create` i upisa pristanka vratio bi tačno stanje koje R-06
    // uklanja — nalog bez dokaza — i to tiho, jer bi korisnik dobio uspeh.
    expect(REGISTRACIJA).toContain("prisma.$transaction");
    expect(REGISTRACIJA).toContain("upisiPristankeRegistracije(tx");
    expect(OAUTH).toContain("upisiPristankeRegistracije(tx");
  });

  it("OAuth upisuje pristanak na SVA tri puta kojima nalog dolazi do pseudonima", () => {
    // Legacy red, idempotentna grana po email-u i nov nalog — sve tri dovršavaju
    // registraciju, pa nijedna ne sme da prođe bez zapisa.
    const pojava = OAUTH.split("upisiPristankeRegistracije(tx").length - 1;
    expect(pojava).toBe(3);
  });

  it("obrasci šalju pristanak serveru", () => {
    expect(OBRAZAC).toContain("prihvatamUslove: uslovi");
    expect(OBRAZAC).toContain("prihvatamPolitiku: privatnost");
    expect(OBRAZAC_OAUTH).toContain("prihvatamUslove: uslovi");
    expect(OBRAZAC_OAUTH).toContain("prihvatamPolitiku: privatnost");
  });

  it("obrasci prikazuju verziju akta uz kvačicu", () => {
    for (const izvor of [OBRAZAC, OBRAZAC_OAUTH]) {
      expect(izvor).toContain("AKT_USLOVI.verzija");
      expect(izvor).toContain("AKT_POLITIKA.verzija");
    }
  });
});

describe("IZVOR: minimizacija — bez otiska uređaja", () => {
  it("nijedan deo toka pristanka ne dira IP ni user-agent", () => {
    // 🔴 Najlakša „poboljšica" koja bi oborila celu meru: dopisati IP „radi jačeg
    // dokaza". To je proširenje obrade radi dokazivanja pristanka na obradu, i
    // protiv je čl. 3 Politike, gde minimizacija stoji kao strukturni princip.
    //
    // 🟡 Rute se ne mere u celini: `registracija/route.ts` legitimno koristi IP za
    // rate-limit protiv spama, što sa pristankom nema veze. Mere se sam tok
    // pristanka i ono što se prosleđuje upisu.
    for (const izvor of [SERVIS, PRAVILA]) {
      expect(izvor).not.toMatch(/klijentIP\s*\(/);
      expect(izvor).not.toMatch(/user-agent/i);
      expect(izvor).not.toMatch(/userAgent/);
    }
    for (const izvor of [REGISTRACIJA, OAUTH]) {
      // Upisu pristanka idu isključivo korisnik, jezik i izvor — nikad zahtev.
      expect(izvor).toMatch(/upisiPristankeRegistracije\(tx, [\w.]+, jezik, "(registracija|oauth)"\)/);
    }
  });

  it("model ne nosi kolonu za IP ni za uređaj", () => {
    const model = SEMA.slice(SEMA.indexOf("model ZapisPristanka"));
    const telo = model.slice(0, model.indexOf("\n}"));
    expect(telo).not.toMatch(/\bip\b/i);
    expect(telo).not.toMatch(/userAgent|uredjaj/i);
  });
});

describe("IZVOR: opoziv se beleži, ne briše", () => {
  it("opoziv upisuje `povucenAt` umesto brisanja reda", () => {
    expect(SERVIS).toContain("povucenAt: new Date()");
    expect(SERVIS).not.toMatch(/zapisPristanka\.delete/);
    expect(SERVIS).not.toMatch(/zapisPristanka\.deleteMany/);
  });

  it("povlačenje pristanka na program NE gasi logičku vrednost", () => {
    // Pristanak jeste bio dat; opoziv po ZZPL čl. 15 st. 3 ne utiče na zakonitost
    // ranije obrade, pa dokaz mora ostati. Do 4.6.3 se `false` upisivao nazad.
    expect(PRIJAVA_SERVIS).toContain("pristanakPovucenAt");
    expect(PRIJAVA_SERVIS).not.toContain("pristanakVerifikatori: false");
  });
});

describe("IZVOR: izričit pristanak za posebne kategorije nosi tekst", () => {
  it("tekst se sklapa na serveru, sa stvarnim brojem verifikatora", () => {
    expect(PROGRAM).toContain('prevedi(jezik, "programi.pristanak_tekst"');
    expect(PROGRAM).toContain("broj: verifikatori.length");
    // 🔴 Tekst se NE prima od klijenta: tekst koji pošalje pretraživač dokazuje
    // samo šta je pretraživač poslao.
    expect(PROGRAM).not.toMatch(/body\.pristanakTekst/);
  });

  it("upisuje se i pri prvoj i pri ponovnoj prijavi", () => {
    const pojava = PROGRAM.split("pristanakTekst,").length - 1;
    expect(pojava).toBe(2);
  });
});

describe("IZVOR: saglasnost roditelja je odvojena od izjave o detetu", () => {
  it("izjava o postojanju deteta više ne nosi pristanak na obradu", () => {
    // Spojene, opoziv saglasnosti nije se mogao izvršiti a da ne obori i tvrdnju
    // o postojanju deteta — dakle pravo na opoziv faktički nije postojalo.
    expect(IZJAVA).not.toContain("pristajem na obradu njegovih podataka");
    expect(IZJAVA).toContain("generisiSaglasnostRoditelja");
  });

  it("saglasnost se upisuje svuda gde nastaje veza roditelj–dete", () => {
    expect(DECA).toContain("saglasnostTekst: generisiSaglasnostRoditelja");
    expect(DECA_POZIV).toContain("saglasnostTekst: generisiSaglasnostRoditelja");
    // `dajIzjavuRoditelja` je treći put — prevođenje punoletnog naloga u maloletni.
    const pojava = DECA.split("saglasnostTekst: generisiSaglasnostRoditelja").length - 1;
    expect(pojava).toBe(2);
  });

  it("šema drži dva odvojena para polja", () => {
    const model = SEMA.slice(SEMA.indexOf("model Roditeljstvo"));
    const telo = model.slice(0, model.indexOf("\n}"));
    for (const polje of ["izjavaAt", "izjavaTekst", "saglasnostAt", "saglasnostTekst"]) {
      expect(telo).toContain(polje);
    }
  });
});

describe("IZVOR: kolačići", () => {
  it("odluka ide u kolačić, ne u localStorage", () => {
    // `localStorage` nikad ne stiže do servera i gubi se čišćenjem keša.
    expect(KOLACICI).toContain("document.cookie");
    // Gleda se upotreba, ne pomen: zaglavlje fajla objašnjava ZAŠTO je
    // `localStorage` napušten, i ta reč tamo sme da stoji.
    expect(KOLACICI).not.toMatch(/window\.localStorage|localStorage\.(get|set|remove)Item/);
  });

  it("odluka nosi verziju i zastareva kad se verzija promeni", () => {
    expect(KOLACICI).toContain("VERZIJA_PRISTANKA_KOLACICI");
    // Odluka po staroj verziji vraća `null` — čovek se pita ponovo.
    expect(KOLACICI).toContain("if (o.verzija !== VERZIJA_PRISTANKA_KOLACICI) return null;");
  });

  it("banner drži OBA dugmeta u prvom nivou", () => {
    // 🔴 Ako „Odbij" ode u podmeni, pristanak prestaje da bude slobodan i cela
    // mera pada, ma koliko uredan zapis o njoj vodili.
    expect(BANNER).toContain('odluci("odbijeno")');
    expect(BANNER).toContain('odluci("prihvaceno")');
  });

  it("zapis uz nalog postoji samo za prijavljenog korisnika", () => {
    const ruta = citaj("src/app/api/pristanak/kolacici/route.ts");
    expect(ruta).toContain("if (!session?.user?.id)");
    // Gost nije greška — njegovu odluku nosi kolačić, a identifikator se ne pravi.
    expect(ruta).toContain("zabelezeno: false");
    expect(ruta).not.toMatch(/klijentIP|userAgent/);
  });
});

describe("IZVOR: korisnik vidi svoj dokaz", () => {
  it("pristanci ulaze u izvoz podataka", () => {
    expect(EKSPORT).toContain("zapisiPristanka");
    expect(EKSPORT).toContain("pristanakTekst: true");
  });

  it("pregled prikazuje SNIMLJEN tekst, ne današnji", () => {
    const komponenta = citaj("src/components/profil/MojiPristanci.tsx");
    expect(komponenta).toContain("r.tekst");
    // Ne sme da sklapa tekst iznova iz prevoda — tada bi tvrdio da je čovek
    // pristao na nešto što mu nikad nije bilo prikazano.
    expect(komponenta).not.toContain("tekstPristankaNaAkt");
  });
});

describe("IZVOR: potvrda adrese nije uslov za rad naloga", () => {
  it("registracija šalje potvrdu kao `void`, bez uslovljavanja", () => {
    expect(REGISTRACIJA).toContain("void posaljiPotvrduAdrese");
    expect(OAUTH).toContain("void posaljiPotvrduAdrese");
  });

  it("potvrda je zajednička za punoletan i maloletan nalog", () => {
    const potvrda = citaj("src/lib/protokol/potvrda-adrese.ts");
    expect(potvrda).toContain("emailPotvrdjenAt");
    // Maloletan nalog adresu tek dobija; punoletan je već ima i samo je potvrđuje.
    expect(potvrda).toContain("maloletan");
    // Ruta više ne pada na 410 kad je Modul Deca ugašen — potvrda sad služi svima.
    const ruta = citaj("src/app/api/profil/email/potvrdi/route.ts");
    expect(ruta).not.toContain("MODUL_DECA_AKTIVAN");
  });
});

describe("IZVOR: gejt za zatečene naloge (R-06)", () => {
  const MODULI = citaj("src/lib/moduli.ts");
  const GEJT_RUTA = citaj("src/app/api/politika/prihvati/route.ts");
  const GEJT_EKRAN = citaj("src/components/PolitikaPristanak.tsx");

  it("prekidač je upaljen — zatečeni nalozi nemaju drugi put do dokaza", () => {
    expect(MODULI).toMatch(/export const PRISTANAK_NA_AKTE_TRAZI_SE = true;/);
  });

  it("migracija upisuje red PolitikaVerzija za 4.6.3", () => {
    const sql = citaj("prisma/migrations/20260914130000_pristanak_4_6_3/migration.sql");
    expect(sql).toContain('INSERT INTO "PolitikaVerzija"');
    expect(sql).toContain("'4.6.3'");
    // Ponovljen deploy ne sme da napravi drugi red — gejt bi tada tražio pristanak
    // na verziju koja je već prihvaćena.
    expect(sql).toContain('ON CONFLICT ("verzija") DO NOTHING');
  });

  it("registracija upisuje i PolitikaPrihvatanje — nov čovek ekran NE vidi", () => {
    // Most ka gejtu: `pristanakStatus()` čita isključivo `PolitikaPrihvatanje`.
    // Bez ovoga bi upaljen prekidač pogodio i onoga ko je kvačicu čekirao pre
    // trideset sekundi, a upaljen je zbog zatečenih naloga.
    expect(SERVIS).toContain("upisiPrihvatanjeTekuceVerzije(tx, userId)");
    expect(SERVIS).toContain("tx.politikaPrihvatanje.createMany");
    // Redosled mora biti isti kao u `pristanakStatus()`, inače se upis i provera
    // razilaze kad dve verzije dele isti trenutak stupanja na snagu.
    expect(SERVIS).toMatch(
      /orderBy: \[\{ efektivnaOd: "desc" \}, \{ createdAt: "desc" \}, \{ id: "desc" \}\]/,
    );
    const politika = citaj("src/lib/politika.ts");
    expect(politika).toMatch(
      /orderBy: \[\{ efektivnaOd: "desc" \}, \{ createdAt: "desc" \}, \{ id: "desc" \}\]/,
    );
  });

  it("gejt traži DVE kvačice i proverava ih na serveru", () => {
    // ZZPL čl. 15 st. 2 — razdvojen pristanak. Do R-06 je ovde bilo jedno dugme
    // za ceo set; iz jednog klika se ne može upisati dokaz o razdvojenosti.
    expect(GEJT_EKRAN).toContain('t("kvacica_uslovi")');
    expect(GEJT_EKRAN).toContain("AKT_USLOVI.verzija");
    expect(GEJT_EKRAN).toContain("AKT_POLITIKA.verzija");
    expect(GEJT_EKRAN).toContain("prihvatamUslove: uslovi");
    expect(GEJT_EKRAN).toContain("prihvatamPolitiku: politika");
    // Pretraživač nije poslednja reč.
    expect(GEJT_RUTA).toContain("oba(prihvatamUslove, prihvatamPolitiku)");
  });

  it("gejt upisuje ZapisPristanka, ne samo otključanje ekrana", () => {
    // Za zatečen nalog je ovo JEDINO mesto na kome dokaz može da nastane.
    expect(GEJT_RUTA).toContain("upisiPristankeRegistracije(tx, userId, jezik, \"gejt\")");
    // Oba upisa u istoj transakciji — nalog koji je prošao gejt a nema zapis je
    // tačno stanje koje se uklanja.
    expect(GEJT_RUTA).toMatch(/prisma\.\$transaction\(async \(tx\) => \{[\s\S]*politikaPrihvatanje\.upsert[\s\S]*upisiPristankeRegistracije/);
    // I ovde bez otiska: dokaz nosi verzija, tekst i trenutak.
    expect(GEJT_RUTA).not.toMatch(/klijentIP|userAgent/);
  });
});
