/**
 * Modul Deca — samostalna registracija deteta i preuzimanje naloga
 * (Pravilnik o Modulu Deca, čl. 4a–4c).
 *
 * ─── Zašto drugi ulaz uopšte postoji ────────────────────────────────────────
 *
 * Dete čuje za platformu od drugog deteta, ne od roditelja. Ako mu je jedini put
 * da prvo ubedi roditelja, ono odustaje. Ako može odmah da uđe i skuplja
 * prijatelje, ono postaje razlog zbog kog roditelj ulazi.
 *
 * ─── Šta dete unosi, a šta ne ───────────────────────────────────────────────
 *
 * Unosi pseudonim, lozinku i **imejl roditelja**. NE unosi datum rođenja — njega
 * upisuje roditelj pri preuzimanju (čl. 7), jer je roditeljska izjava jedina
 * provera godina kojom sistem raspolaže. Do preuzimanja o detetu se ne zna ništa
 * osim pseudonima; u poruci roditelju stoji **samo pseudonim**, nikad pravo ime —
 * ne zna se da li je adresa tačna.
 *
 * ─── Dva puta do veze ───────────────────────────────────────────────────────
 *
 *  - **primarni** — roditelj se registruje sa istim imejlom koji je dete unelo, i
 *    sistem mu sam predloži vezu (`poziviZaEmail`);
 *  - **rezervni** — šestocifreni kod vidljiv u profilu deteta, koji roditelj unosi
 *    uz pseudonim (`preuzmiKodom`). Istim putem ulazi i DRUGI roditelj.
 *
 * 🔴 Odobrenje deteta se ne traži. Roditeljstvo se ne uslovljava pristankom deteta.
 */
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { TipKorisnika, UserStatus, WalletType } from "@/generated/prisma/client";
import { gdePseudonim, poljaPseudonima } from "@/lib/pseudonim";
import { bazniUrl, emailLayout, esc, posaljiEmailRaw } from "@/lib/email";
import { obavesti } from "@/lib/notifikacije";
import { beogradskiDan } from "./obracunski-dan";
import { DecaGreska, obrisiDecjiNalog, poljaDeteta } from "./deca";
import { osveziPrijateljstvaDeteta } from "./prijateljstva";
import {
  ROK_PREUZIMANJA_DANA,
  ROK_TOKENA_DANA,
  rokPreuzimanja,
  rokTokena,
  uzrast,
  uzrastZaModul,
} from "@/lib/deca-pravila";

/** Najviše dva roditelja po detetu (čl. 4b st. 6) — otac i majka, ista ovlašćenja. */
export const MAX_RODITELJA = 2;

/** Šest cifara, bez vodeće nule koja se gubi pri prepisivanju. */
function generisiKod(): string {
  return String(crypto.randomInt(100_000, 1_000_000));
}

/**
 * Podaci za red `RoditeljPoziv` koji nastaje uz nalog otvoren IZ RODITELJSKOG
 * PROFILA (čl. 4).
 *
 * 🔴 Tu nema poziva — roditelj je već tu. Red ipak nastaje, jer u njemu živi
 * **šestocifreni kod kojim ulazi DRUGI roditelj** (čl. 4b st. 6). Bez njega bi
 * drugi roditelj mogao da uđe samo kod dece koja su se registrovala sama, što je
 * razlika bez razloga.
 *
 * Rokovi se postavljaju na sadašnji trenutak i `iskoriscenAt` je popunjen: link se
 * ne šalje i ne sme da radi, a noćni posao koji briše nepreuzete naloge traži
 * `iskoriscenAt: null`, pa ovaj red nikad ne pogađa.
 */
export function poljaPozivaZaRoditeljskiUlaz(email: string | null, sada: Date) {
  return {
    email: email ?? "",
    token: crypto.randomBytes(32).toString("hex"),
    kod: generisiKod(),
    tokenDo: sada,
    brisanjeDo: sada,
    iskoriscenAt: sada,
  };
}

/**
 * Datum rođenja iz tela zahteva.
 *
 * Tri ishoda, i sva tri su potrebna: `null` = nije poslat (drugi roditelj ga i ne
 * šalje, jer se datum posle upisa ne menja — čl. 7), `undefined` = poslat je
 * neispravan podatak, `Date` = ispravan.
 */
export function parsirajDatumRodjenja(vrednost: unknown): Date | null | undefined {
  if (vrednost === undefined || vrednost === null || vrednost === "") return null;
  if (typeof vrednost !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(vrednost)) return undefined;
  // Kolona je DATE, bez vremena — čita se kao UTC ponoć.
  const d = new Date(`${vrednost}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// ── Registracija deteta ───────────────────────────────────────────────────────

export type RegistracijaDetetaUlaz = {
  pseudonim: string;
  passwordHash: string;
  memberHash: string;
  roditeljEmail: string;
  /**
   * Origin sa kog je dete otvorilo nalog. Link u poruci roditelju mora da vodi
   * na ISTO okruženje: token živi u bazi tog okruženja, pa link na drugi host
   * otvara stranicu na kojoj poziva nema.
   */
  origin?: string;
};

/**
 * Dete otvara nalog samo. Nalog počinje u stanju `NA_CEKANJU` (čl. 4c):
 * ima profil, skenira QR kodove i sklapa prijateljstva, ali nema Pričaonicu i
 * POEN mu se ne upisuje.
 *
 * Poruka roditelju ide VAN transakcije i ne obara registraciju ako padne — kad
 * pošta ne stigne, ostaje rezervni put (šestocifreni kod iz profila deteta).
 */
export async function registrujDete(ulaz: RegistracijaDetetaUlaz) {
  const email = ulaz.roditeljEmail.trim().toLowerCase();
  const sada = new Date();

  const dete = await prisma.$transaction(async (tx) => {
    const kreirano = await tx.user.create({
      data: {
        ...poljaPseudonima(ulaz.pseudonim),
        passwordHash: ulaz.passwordHash,
        memberHash: ulaz.memberHash,
        // Maloletni korisnik ostaje NEVERIFIKOVAN (čl. 15): nema indeks stvarnosti i
        // nikoga ne potvrđuje. Time sve zatečene brane sistema važe bez nove provere.
        tipKorisnika: TipKorisnika.NEVERIFIKOVAN,
        // 🔴 Bez datuma rođenja — upisuje ga roditelj pri preuzimanju (čl. 7).
        ...poljaDeteta(null),
        vodicVidjenAt: null,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
        roditeljPoziv: {
          create: {
            email,
            token: crypto.randomBytes(32).toString("hex"),
            kod: generisiKod(),
            tokenDo: rokTokena(sada),
            brisanjeDo: rokPreuzimanja(sada),
          },
        },
      },
      select: {
        id: true,
        pseudonim: true,
        roditeljPoziv: { select: { token: true, kod: true, brisanjeDo: true } },
      },
    });
    return kreirano;
  });

  void posaljiPozivRoditelju(email, dete.pseudonim, dete.roditeljPoziv!.token, ulaz.origin);

  return {
    id: dete.id,
    pseudonim: dete.pseudonim,
    kod: dete.roditeljPoziv!.kod,
    brisanjeDo: dete.roditeljPoziv!.brisanjeDo.toISOString(),
  };
}

/**
 * Poruka roditelju — izbor, ne jedno dugme.
 *
 * 🔴 U poruci stoji SAMO pseudonim deteta. Adresa je podatak koji je uneo neko
 * treći i niko je nije proverio; pravo ime na pogrešnoj adresi bilo bi odavanje
 * podatka o detetu osobi koja s njim nema veze.
 *
 * ─── Zašto poruka opisuje DVA koraka, a ne jedan ────────────────────────────
 *
 * Preuzimanje naloga i sticanje svojstva redovnog člana su dve različite stvari i
 * ne dešavaju se istog dana. Ranija poruka je to pominjala u jednoj rečenici pri
 * dnu, pa je roditelj koji preuzme nalog očekivao da detetu odmah krene POEN — a
 * POEN čeka drugi korak. Sada svaki korak ima svoj naslov i svoju posledicu, pa
 * čovek vidi šta dobija odmah, a šta tek kad ga neko potvrdi.
 *
 * Uz to su izričito nabrojana ovlašćenja koja roditelj dobija preuzimanjem
 * (čl. 9 i 10). Bez toga poruka traži saglasnost, a ne kaže šta se za nju dobija.
 *
 * ─── Zašto su odbijanje i brisanje ravnopravno navedeni ─────────────────────
 *
 * Adresa nije proverena, pa je čovek na drugoj strani možda nema veze sa detetom.
 * Njemu poruka mora da ponudi izlaz jednako vidljivo kao i pristanak, inače je to
 * pritisak, a ne izbor. Obe radnje rade BEZ prijave (čl. 4b st. 4).
 */
async function posaljiPozivRoditelju(
  email: string,
  pseudonim: string,
  token: string,
  origin?: string,
) {
  const link = `${bazniUrl(origin)}/dete-poziv/${token}`;
  const html = emailLayout({
    naslov: "Dete je otvorilo nalog na KOLO platformi",
    telo: [
      `Nalog pod pseudonimom <strong>${esc(pseudonim)}</strong> naveo je ovu adresu kao adresu roditelja. ` +
        `Odluka je vaša — evo šta koja mogućnost znači.`,

      `<strong>Šta je KOLO.</strong> Platforma na kojoj ljudi jedni drugima daju stvari i usluge, a učešće se ` +
        `beleži u POEN-ima. POEN nije novac: ne menja se za dinare i ne može se podići. Deca imaju svoj deo, ` +
        `u kome su samo deca.`,

      `<strong>Šta dete može sada, bez vas.</strong> Samo da sklapa prijateljstva skeniranjem koda uživo. ` +
        `Nema pristup Pričaonici, ne može da objavljuje oglase ni da razmenjuje poruke, i POEN mu se ne upisuje.`,

      `<strong>Mogućnost 1 — preuzmete nalog.</strong> Otvorite svoj nalog ako ga nemate (besplatno je), ` +
        `upišete detetov datum rođenja i time date saglasnost. Dete odmah dobija Pričaonicu, oglase i poruke. ` +
        `Vi dobijate: spisak njegovih prijatelja sa datumima, uvid s kim se dopisuje i koliko (bez sadržaja ` +
        `poruka), njegove oglase — svaki možete ukloniti — prekidač kojim odobravate ili zabranjujete razgovor ` +
        `sa punoletnim korisnicima, i mogućnost da mu postavite novu lozinku ako je zaboravi.`,

      `<strong>Mogućnost 2 — uz to postanete i redovan član.</strong> To znači da vas je potvrdio neko ko vas ` +
        `lično poznaje, a već je na KOLU. Tek tada se detetu <strong>upisuje POEN</strong> — 500 za svako ` +
        `sklopljeno prijateljstvo. Ništa se do tada ne gubi: sve što dete zaradi stoji zabeleženo i upiše mu se ` +
        `tog dana. Uz to i vi sami koristite platformu u punom obimu.`,

      `<strong>Mogućnost 3 — ovo nije vaše dete.</strong> Na stranici stoje dugmad ` +
        `<strong>„Ovo nije moje dete"</strong> i <strong>„Obriši nalog"</strong>. Obe rade bez prijave i bez ` +
        `otvaranja naloga. Ako ne uradite ništa, nalog se briše sam u roku od ${ROK_PREUZIMANJA_DANA} dana.`,

      `<strong>Šta se o detetu evidentira.</strong> Pseudonim i datum rođenja. Ništa više — ni ime, ni adresa, ` +
        `ni broj telefona. Prijateljstva se sklapaju isključivo skeniranjem koda uživo, pa se do vašeg deteta ` +
        `ne može doći sa interneta, a njegov profil drugim odraslim korisnicima nije dostupan.`,

      `Link važi ${ROK_TOKENA_DANA} dana. Ako istekne, dete na svom ekranu ima šestocifreni kod koji vam ` +
        `pročita, pa nalog preuzimate u odeljku „Moja deca".`,
    ],
    dugme: { tekst: "Pogledaj i odluči", link },
  });
  await posaljiEmailRaw(email, "Dete je otvorilo nalog na KOLO platformi", html, "deca-poziv");
}

// ── Preuzimanje naloga ────────────────────────────────────────────────────────

/** Podaci koje roditelj vidi na stranici poziva, pre nego što bilo šta uradi. */
export async function pozivPoTokenu(token: string) {
  const poziv = await prisma.roditeljPoziv.findUnique({
    where: { token },
    select: {
      tokenDo: true,
      brisanjeDo: true,
      iskoriscenAt: true,
      odbijenAt: true,
      dete: { select: { pseudonim: true, deaktiviranAt: true } },
    },
  });
  if (!poziv || poziv.dete.deaktiviranAt) throw new DecaGreska("Poziv nije pronađen.", 404);
  return {
    pseudonim: poziv.dete.pseudonim,
    istekao: poziv.tokenDo < new Date(),
    iskoriscen: poziv.iskoriscenAt !== null,
    odbijen: poziv.odbijenAt !== null,
    brisanjeDo: poziv.brisanjeDo.toISOString(),
  };
}

/** Zajednički deo oba puta: upiši vezu, upiši datum rođenja, javi detetu. */
async function poveziRoditelja(
  deteId: string,
  roditeljId: string,
  datumRodjenja: Date | null
): Promise<{ deteId: string; pseudonim: string }> {
  const [roditelj, dete] = await Promise.all([
    prisma.user.findUnique({
      where: { id: roditeljId },
      select: { id: true, pseudonim: true, maloletan: true, status: true, deaktiviranAt: true },
    }),
    prisma.user.findUnique({
      where: { id: deteId },
      select: {
        id: true,
        pseudonim: true,
        maloletan: true,
        datumRodjenja: true,
        deaktiviranAt: true,
        roditeljstvaKaoDete: { select: { roditeljId: true } },
      },
    }),
  ]);
  if (!roditelj || roditelj.deaktiviranAt || roditelj.status !== UserStatus.ACTIVE) {
    throw new DecaGreska("Nalog nije aktivan.", 403);
  }
  if (roditelj.maloletan) throw new DecaGreska("Maloletni korisnik ne može biti roditelj.", 403);
  if (!dete || !dete.maloletan || dete.deaktiviranAt) {
    throw new DecaGreska("Nalog nije pronađen.", 404);
  }
  if (dete.roditeljstvaKaoDete.some((r) => r.roditeljId === roditeljId)) {
    throw new DecaGreska("Već si upisan/a kao roditelj ovog naloga.", 409);
  }
  if (dete.roditeljstvaKaoDete.length >= MAX_RODITELJA) {
    throw new DecaGreska("Nalog već ima dva roditelja.", 409);
  }

  // Datum rođenja se traži samo pri PRVOM preuzimanju: posle upisa se ne menja
  // (čl. 7), pa drugi roditelj nema šta da unese ni da ispravi.
  if (!dete.datumRodjenja) {
    if (!datumRodjenja) throw new DecaGreska("Datum rođenja deteta je obavezan.", 400);
    const godine = uzrast(datumRodjenja, beogradskiDan());
    const dozvoljen = uzrastZaModul(godine);
    if (!dozvoljen.ok) throw new DecaGreska(dozvoljen.razlog, dozvoljen.status);
  }

  await prisma.$transaction(async (tx) => {
    await tx.roditeljstvo.create({ data: { deteId: dete.id, roditeljId } });
    if (!dete.datumRodjenja && datumRodjenja) {
      await tx.user.update({ where: { id: dete.id }, data: { datumRodjenja } });
    }
    // Poziv je odradio posao. Red OSTAJE — u njemu živi šestocifreni kod kojim
    // ulazi drugi roditelj (čl. 4b st. 6) — ali se obeleži kao iskorišćen, pa
    // noćni posao više ne broji ovaj nalog kao nepreuzet.
    await tx.roditeljPoziv.updateMany({
      where: { deteId: dete.id, iskoriscenAt: null },
      data: { iskoriscenAt: new Date(), odbijenAt: null },
    });
  });

  await obavesti(dete.id, {
    tip: "dete_preuzet_nalog",
    kljuc: "notifikacije.dete_preuzet_nalog",
    parametri: { pseudonim: roditelj.pseudonim },
    naslov: "Roditelj je preuzeo tvoj nalog",
    tekst: `Tvoj nalog je preuzeo ${roditelj.pseudonim}. Sada možeš u Pričaonicu.`,
    link: "/pocetna",
  }).catch(() => {});

  // Preuzimanje je jedan od dva trenutka u kojima dete može da pređe u stanje
  // `AKTIVNO` (drugi je kad roditelj postane redovan član). Tada se isplaćuju
  // prijateljstva koja su čekala. Van transakcije i ne baca — emisija ima svoju.
  await osveziPrijateljstvaDeteta(dete.id);

  return { deteId: dete.id, pseudonim: dete.pseudonim };
}

/** Preuzimanje linkom iz poruke (primarni put). */
export async function preuzmiTokenom(
  token: string,
  roditeljId: string,
  datumRodjenja: Date | null
) {
  const poziv = await prisma.roditeljPoziv.findUnique({
    where: { token },
    select: { deteId: true, tokenDo: true, dete: { select: { deaktiviranAt: true } } },
  });
  if (!poziv || poziv.dete.deaktiviranAt) throw new DecaGreska("Poziv nije pronađen.", 404);
  if (poziv.tokenDo < new Date()) {
    throw new DecaGreska(
      "Link je istekao. Zamoli dete da ti pročita šestocifreni kod sa svog ekrana.",
      410
    );
  }
  return poveziRoditelja(poziv.deteId, roditeljId, datumRodjenja);
}

/**
 * Preuzimanje pseudonimom i šestocifrenim kodom (rezervni put).
 *
 * 🔴 Istim putem ulazi i DRUGI roditelj — nema zasebnog obrasca. Prvi i drugi
 * roditelj rade istu radnju i dobijaju ista ovlašćenja.
 */
export async function preuzmiKodom(
  roditeljId: string,
  pseudonim: string,
  kod: string,
  datumRodjenja: Date | null
) {
  const dete = await prisma.user.findFirst({
    where: { ...gdePseudonim(pseudonim), maloletan: true, deaktiviranAt: null },
    select: { id: true, roditeljPoziv: { select: { kod: true } } },
  });
  // Ista poruka za nepostojeći pseudonim i za pogrešan kod — inače bi obrazac
  // odao koji pseudonimi pripadaju deci.
  const kodClean = kod.replace(/\s+/g, "");
  if (!dete?.roditeljPoziv || dete.roditeljPoziv.kod !== kodClean) {
    throw new DecaGreska("Pseudonim i kod se ne poklapaju.", 404);
  }
  return poveziRoditelja(dete.id, roditeljId, datumRodjenja);
}

/**
 * „Ovo nije moje dete" (čl. 4b st. 4).
 *
 * Nalog se NE briše — dete je možda pogrešno otkucalo adresu i ima još vremena da
 * je ispravi. Poziv umire, pa ista adresa više ne dobija poruku, a nalog i dalje
 * pada sam po isteku roka od četrnaest dana ako ga niko ne preuzme.
 */
export async function odbijPoziv(token: string) {
  const izmenjeno = await prisma.roditeljPoziv.updateMany({
    where: { token, iskoriscenAt: null },
    data: { odbijenAt: new Date() },
  });
  if (izmenjeno.count === 0) throw new DecaGreska("Poziv nije pronađen.", 404);
  return { ok: true };
}

/**
 * „Obriši nalog" iz poruke (čl. 4b st. 4).
 *
 * 🔴 Radi BEZ prijave: onaj ko drži link je jedina osoba koju sistem u tom
 * trenutku može da pita, a odbijanje bez mogućnosti brisanja ostavlja tuđe dete da
 * koristi tvoju adresu dve nedelje. Link je jednokratan i traje sedam dana.
 */
export async function obrisiPoTokenu(token: string) {
  const poziv = await prisma.roditeljPoziv.findUnique({
    where: { token },
    select: {
      tokenDo: true,
      iskoriscenAt: true,
      dete: { select: { id: true, pseudonim: true, deaktiviranAt: true } },
    },
  });
  if (!poziv || poziv.dete.deaktiviranAt) throw new DecaGreska("Poziv nije pronađen.", 404);
  if (poziv.iskoriscenAt) {
    throw new DecaGreska("Nalog je već preuzet — briše se sa profila deteta.", 409);
  }
  if (poziv.tokenDo < new Date()) throw new DecaGreska("Link je istekao.", 410);
  return obrisiDecjiNalog(poziv.dete.id, poziv.dete.pseudonim, null, "Modul Deca, čl. 4b st. 4");
}

// ── Primarni put: predlog veze pri registraciji roditelja ────────────────────

/**
 * Pozivi upućeni na imejl ovog korisnika (čl. 4b st. 6, primarni put).
 *
 * Roditelj koji se registruje istim imejlom koji je dete unelo ne mora ništa da
 * traži — veza mu se sama predloži u odeljku „Moja deca".
 */
export async function poziviZaEmail(email: string | null) {
  if (!email) return [];
  const pozivi = await prisma.roditeljPoziv.findMany({
    where: {
      email: email.trim().toLowerCase(),
      iskoriscenAt: null,
      odbijenAt: null,
      brisanjeDo: { gt: new Date() },
      dete: { deaktiviranAt: null, maloletan: true },
    },
    select: {
      token: true,
      brisanjeDo: true,
      dete: { select: { id: true, pseudonim: true } },
    },
  });
  return pozivi.map((p) => ({
    token: p.token,
    deteId: p.dete.id,
    pseudonim: p.dete.pseudonim,
    brisanjeDo: p.brisanjeDo.toISOString(),
  }));
}

// ── Noćni posao: nalozi koje niko nije preuzeo (čl. 4b st. 5) ────────────────

/**
 * Briše naloge dece koje niko nije preuzeo u roku od četrnaest dana.
 *
 * 🔴 Rok je pravni, ne operativni: dete na čekanju je lice čije podatke obrađujemo
 * PRE pribavljenog pristanka roditelja, i to ne sme da traje neograničeno. Zato se
 * nalog briše, a ne zamrzava.
 *
 * Posao je idempotentan i nadoknađuje: obrađuje sve istekle pozive, ne samo
 * današnje. Bez toga bi jedno preskočeno pokretanje ostavilo nalog da živi dalje.
 */
export async function obrisiNepreuzeteNaloge(sada: Date = new Date()) {
  const istekli = await prisma.roditeljPoziv.findMany({
    where: {
      iskoriscenAt: null,
      brisanjeDo: { lte: sada },
      dete: { deaktiviranAt: null, maloletan: true, roditeljstvaKaoDete: { none: {} } },
    },
    select: { dete: { select: { id: true, pseudonim: true } } },
  });

  let obrisano = 0;
  for (const p of istekli) {
    try {
      await obrisiDecjiNalog(p.dete.id, p.dete.pseudonim, null, "Modul Deca, čl. 4b st. 5");
      obrisano += 1;
    } catch (e) {
      console.error("[deca-poziv] Brisanje nepreuzetog naloga nije uspelo", p.dete.id, e);
    }
  }
  return { pregledano: istekli.length, obrisano };
}
