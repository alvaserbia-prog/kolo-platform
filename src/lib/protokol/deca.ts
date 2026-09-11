/**
 * Modul Deca — servisne funkcije (Pravilnik o Modulu Deca, druga verzija).
 *
 * Re-eksportuje čista pravila iz `src/lib/deca-pravila.ts`, pa server ima jedan
 * ulaz. Pretraživač uvozi pravila neposredno — ovaj modul povlači Prisma klijent.
 *
 * ─── Dva ulaza u modul ──────────────────────────────────────────────────────
 *
 *  1. **Roditelj otvara nalog iz svog profila** (čl. 4). Nalog ulazi odmah u
 *     stanje `AKTIVNO`; postupak potvrde iz čl. 6 teče paralelno. Ovde.
 *  2. **Dete se registruje samo** (čl. 4a–4c), pre nego što je iko od njegovih
 *     roditelja na platformi. Nalog počinje na `NA_CEKANJU`. Vidi
 *     `src/lib/protokol/deca-poziv.ts`.
 *
 * Razlika između dva ulaza je SAMO u tome na kom stanju nalog počinje. Drugi ulaz
 * postoji zato što dete čuje za platformu od drugog deteta, ne od roditelja: ako
 * mu je jedini put da prvo ubedi roditelja, ono odustaje.
 */
import { prisma } from "@/lib/prisma";
import { TipKorisnika, TransactionType, UserStatus, WalletType } from "@/generated/prisma/client";
import type { PrismaClient, RoditeljstvoPotvrdaStatus } from "@/generated/prisma/client";
import { poljaPseudonima } from "@/lib/pseudonim";
import { beogradskiDan } from "./obracunski-dan";
import {
  FUNKCIONALNI_PRAG_INDEKSA,
  POEN_NADZORNIK,
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
} from "./dokaz-stvarnosti";
import { ponistiVerifikaciju } from "./lazna-verifikacija";
import { generisiIzjavuRoditelja } from "@/lib/deca-izjava";
import bcrypt from "bcryptjs";
import { obavesti } from "@/lib/notifikacije";
import {
  PORUKA_CEKA_RODITELJA,
  ROK_POTVRDE_DANA,
  UZRAST_SA_ODRASLIMA,
  danaDoIsteka,
  granicaDatumaZaUzrast,
  smeSaOdraslima,
  nalogRadi,
  pragPodsetnika,
  rokIzjasnjenja,
  smeDaVidiProfilDeteta,
  stanjeDeteta,
  uzrast,
  uzrastZaModul,
  type StanjeDeteta,
  type Ucesnik,
  MIN_LOZINKA,
} from "@/lib/deca-pravila";

export * from "@/lib/deca-pravila";

const PROTOKOL_WALLET_ID = "banka-singleton";

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export class DecaGreska extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Polja koja opisuju maloletni nalog. 🔴 Jedino mesto koje ih upisuje.
 *
 * `datumRodjenja` sme da bude `null` — dete koje se registrovalo samo ga ne unosi,
 * upisuje ga roditelj pri preuzimanju (čl. 7). Veza sa roditeljem NIJE ovde: ona
 * živi u tabeli `Roditeljstvo`, jer roditelja može biti dvoje.
 */
export function poljaDeteta(datumRodjenja: Date | null) {
  return { datumRodjenja, maloletan: true };
}

/** Izbor polja dovoljan da se od korisnika napravi `Ucesnik`. */
export const IZBOR_UCESNIKA = {
  id: true,
  maloletan: true,
  datumRodjenja: true,
  dozvolaOdrasli: true,
  roditeljstvaKaoDete: {
    select: {
      roditeljId: true,
      roditelj: {
        select: { verified: true, indeksStvarnosti: true, status: true, deaktiviranAt: true },
      },
    },
  },
} as const;

type RedUcesnika = {
  id: string;
  maloletan: boolean;
  datumRodjenja: Date | null;
  dozvolaOdrasli: boolean;
  roditeljstvaKaoDete: {
    roditeljId: string;
    roditelj: {
      verified: boolean;
      indeksStvarnosti: number;
      status: UserStatus;
      deaktiviranAt: Date | null;
    };
  }[];
};

/** Od reda iz baze pravi `Ucesnik` — jedino mesto koje izvodi stanje naloga. */
export function ucesnikIzReda(red: RedUcesnika): Ucesnik {
  return {
    id: red.id,
    maloletan: red.maloletan,
    // Uzrast nosi razvrstavanje iz čl. 12. Kod deteta koje čeka preuzimanje datum
    // još ne postoji (upisuje ga roditelj, čl. 7), pa ostaje `null` — a `null` po
    // `smeSaOdraslima` pada na stroži režim, što je ovde ispravno.
    godine: red.maloletan && red.datumRodjenja ? uzrast(red.datumRodjenja, beogradskiDan()) : null,
    dozvolaOdrasli: red.dozvolaOdrasli,
    roditeljIds: red.roditeljstvaKaoDete.map((r) => r.roditeljId),
    // Punoletan korisnik nema stanje — `AKTIVNO` je jedina vrednost koja ništa ne
    // ograničava, pa se ostatak koda ne mora granati na „je li ovo dete".
    stanje: red.maloletan
      ? stanjeDeteta(
          red.roditeljstvaKaoDete.map((r) => ({
            aktivan: !r.roditelj.deaktiviranAt && r.roditelj.status === UserStatus.ACTIVE,
            redovan:
              r.roditelj.verified && r.roditelj.indeksStvarnosti >= FUNKCIONALNI_PRAG_INDEKSA,
          }))
        )
      : "AKTIVNO",
  };
}

/** Učitava najmanji oblik korisnika potreban za odluke ovog modula. */
export async function ucitajUcesnika(userId: string): Promise<Ucesnik | null> {
  const red = await prisma.user.findUnique({ where: { id: userId }, select: IZBOR_UCESNIKA });
  return red ? ucesnikIzReda(red) : null;
}

/** Stanje naloga (čl. 4c). Za punoletni nalog uvek `AKTIVNO`. */
export async function stanjeNaloga(userId: string): Promise<StanjeDeteta> {
  return (await ucitajUcesnika(userId))?.stanje ?? "NA_CEKANJU";
}

/**
 * Baca ako nalog još čeka roditelja (čl. 4c). Zove se u rutama koje stvaraju
 * sadržaj ili pomeraju zapise — objava oglasa, prepis POEN-a, poruke, Pričaonica.
 *
 * 🟡 Stanje nije `UserStatus`, pa ga osvežavanje JWT tokena ne hvata samo od sebe
 * kao suspenziju. Zato se proverava u samim rutama, a ne oslanja na sesiju.
 */
export async function zaustaviAkoCekaRoditelja(userId: string) {
  if (!nalogRadi(await stanjeNaloga(userId))) {
    throw new DecaGreska(PORUKA_CEKA_RODITELJA, 403);
  }
}

/**
 * Prodavac čiji nalog radi (čl. 4c).
 *
 * Punoletan nalog ovaj uslov ne dodiruje. Maloletni mora imati bar jednog
 * roditelja — dete na čekanju nije objavilo oglas i ne može, ali uslov stoji i
 * radi kao brana ako veza kasnije nestane (roditelj obriše svoj nalog).
 *
 * 🔴 Uslov je „ima roditelja", NE „roditelj je redovan član". Kad roditelju padne
 * potvrda, dete se vraća u `POVEZANO` — oglasi i poruke rade, samo upis POEN-a
 * čeka. U prvoj verziji je tada stajalo sve, što u drugom ulazu nema smisla: onaj
 * ko tek preuzme nalog i JESTE nov član.
 */
export const USLOV_PRODAVAC_RADI = {
  OR: [{ maloletan: false }, { maloletan: true, roditeljstvaKaoDete: { some: {} } }],
};

/**
 * Uslov nad prodavcem koji sprovodi vidljivost oglasa iz čl. 13.
 *
 * 🔴 Gost NIKADA ne vidi oglas maloletnog korisnika, i to je jedini deo koji važi
 * bez obzira na prekidač modula — cena mu je nula, a cena propuštanja je izlaganje
 * deteta.
 */
export function usloviVidljivostiOglasa(posmatrac: Ucesnik | null) {
  if (!posmatrac) return { AND: [USLOV_PRODAVAC_RADI, { maloletan: false }] };

  if (posmatrac.maloletan) {
    return {
      AND: [
        USLOV_PRODAVAC_RADI,
        {
          OR: [
            { maloletan: true },
            // Oglase punoletnih dete vidi tek uz saglasnost roditelja i tek od 15.
            // godine — vidi obrazloženje uz `smeDaVidiOglas` u `deca-pravila.ts`.
            ...(smeSaOdraslima(posmatrac) && posmatrac.dozvolaOdrasli
              ? [{ maloletan: false }]
              : []),
          ],
        },
      ],
    };
  }

  return {
    AND: [
      USLOV_PRODAVAC_RADI,
      {
        OR: [
          { maloletan: false },
          // 🔴 Uzrasni uslov MORA biti i u upitu, ne samo u `smeDaVidiOglas`: spisak
          // na Pijaci se diže jednim `findMany`, pa bi bez njega oglas deteta do 15
          // izašao punoletnom posmatraču i pre nego što ijedna čista funkcija stigne
          // da ga odbije.
          {
            maloletan: true,
            dozvolaOdrasli: true,
            datumRodjenja: { lte: granicaDatumaZaUzrast(UZRAST_SA_ODRASLIMA, beogradskiDan()) },
          },
          // Sopstveno dete roditelj vidi i kad je prekidač isključen.
          { maloletan: true, roditeljstvaKaoDete: { some: { roditeljId: posmatrac.id } } },
        ],
      },
    ],
  };
}

// ── Otvaranje naloga iz roditeljskog profila (čl. 4–6) ───────────────────────

export type OtvaranjeUlaz = {
  roditeljId: string;
  pseudonim: string;
  passwordHash: string;
  datumRodjenja: Date;
  memberHash: string;
};

/**
 * Otvara nalog maloletnog korisnika i pokreće postupak potvrde (čl. 4 i 6).
 *
 * Nalog ulazi odmah u stanje `AKTIVNO` — zaštita je naknadna i sastoji se u tome
 * što potvrđivači roditelja imaju trideset dana da potvrde postojanje deteta, a
 * onaj ko ćuti gubi sopstvenu potvrdu stvarnosti tog roditelja.
 *
 * Sve u JEDNOJ transakciji: nalog, veza sa roditeljem, zapis u Protokolu i redovi
 * potvrde nastaju zajedno ili nikako. Nalog bez veze sa roditeljem bio bi dete na
 * čekanju, a nalog bez redova potvrde nalog bez ijedne provere.
 */
export async function otvoriNalogDeteta(ulaz: OtvaranjeUlaz) {
  const roditelj = await prisma.user.findUnique({
    where: { id: ulaz.roditeljId },
    select: {
      id: true,
      pseudonim: true,
      email: true,
      verified: true,
      maloletan: true,
      status: true,
      deaktiviranAt: true,
      indeksStvarnosti: true,
    },
  });
  if (!roditelj) throw new DecaGreska("Nalog ne postoji.", 401);
  if (roditelj.maloletan)
    throw new DecaGreska("Maloletni korisnik ne može otvoriti nalog detetu.", 403);
  if (roditelj.status !== UserStatus.ACTIVE || roditelj.deaktiviranAt)
    throw new DecaGreska("Nalog nije aktivan.", 403);
  // Čl. 5 — merodavan je INDEKS STVARNOSTI, ne broj ljudi koji su se potpisali.
  //
  // 🔴 Ne proveravati broj potvrda. Početnim korisnicima (osnivači, UO) indeks je
  // fiksno 100 iako ih formalno niko nije potvrdio — oni su ishodište lanca. Provera
  // po broju potvrda njih zaustavlja, a upravo oni prvi otvaraju naloge deci.
  if (roditelj.indeksStvarnosti < FUNKCIONALNI_PRAG_INDEKSA)
    throw new DecaGreska(
      `Nalog detetu možeš otvoriti kad ti indeks stvarnosti bude ${FUNKCIONALNI_PRAG_INDEKSA}% ili više.`,
      403
    );

  const godine = uzrast(ulaz.datumRodjenja, beogradskiDan());
  const dozvoljen = uzrastZaModul(godine);
  if (!dozvoljen.ok) throw new DecaGreska(dozvoljen.razlog, dozvoljen.status);

  const sada = new Date();
  // Kod kojim ulazi DRUGI roditelj (čl. 4b st. 6). Nastaje i ovde, iako poziva
  // nema — inače bi drugi roditelj mogao da uđe samo kod dece koja su se
  // registrovala sama, što je razlika bez razloga.
  const { poljaPozivaZaRoditeljskiUlaz } = await import("./deca-poziv");
  const roditeljEmail = roditelj.email;

  // 🟡 Skup SME da bude prazan: kod početnog korisnika (osnivač, UO) nema nikoga
  // iznad njega u lancu, pa se nalog deteta otvara na njegovu reč. To je posledica
  // toga što je on ishodište lanca potvrda, a ne propust — ali znači i da za tu
  // decu ne postoji nijedno izjašnjenje, pa se Fondaciji javlja da se zna.
  let potvrdjivaci: string[] = [];

  const dete = await prisma.$transaction(async (tx) => {
    const kreirano = await tx.user.create({
      data: {
        ...poljaPseudonima(ulaz.pseudonim),
        passwordHash: ulaz.passwordHash,
        memberHash: ulaz.memberHash,
        // Maloletni korisnik ostaje NEVERIFIKOVAN: nema indeks stvarnosti i nikoga
        // ne potvrđuje (čl. 15). Time sve zatečene brane sistema — ZRNO, glasanje,
        // nadzor, programi — važe za njega bez ijedne nove provere.
        tipKorisnika: TipKorisnika.NEVERIFIKOVAN,
        ...poljaDeteta(ulaz.datumRodjenja),
        roditeljstvaKaoDete: { create: { roditeljId: roditelj.id } },
        roditeljPoziv: { create: poljaPozivaZaRoditeljskiUlaz(roditeljEmail, sada) },
        // Vodič se prikazuje pri prvoj prijavi, kao i svakom novom nalogu.
        vodicVidjenAt: null,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
      select: { id: true, pseudonim: true },
    });

    // Izjava roditelja (čl. 6 st. 1) nastaje ODMAH: otvaranje naloga je upravo
    // radnja kojom roditelj preuzima odgovornost, pa nema šta da čeka rok. Tekst
    // se snima i posle toga se ne menja.
    await tx.roditeljstvo.update({
      where: { deteId_roditeljId: { deteId: kreirano.id, roditeljId: roditelj.id } },
      data: {
        izjavaAt: sada,
        izjavaTekst: generisiIzjavuRoditelja({ pseudonimDeteta: kreirano.pseudonim, godine }),
      },
    });

    // Ljudi koji su potvrdili roditelja — njima ide izjašnjenje iz čl. 6.
    potvrdjivaci = await otvoriPostupakPotvrde(kreirano.id, roditelj.id, sada, tx);

    return kreirano;
  });

  // Nalog otvoren bez ijednog izjašnjenja ostavlja trag kod Fondacije — inače bi
  // jedini put do dečjeg prostora koji ne prolazi kroz mrežu bio i nevidljiv.
  if (potvrdjivaci.length === 0) {
    const { posaljiAdminAlert } = await import("@/lib/adminAlert");
    void posaljiAdminAlert(
      "Nalog detetu otvoren bez izjašnjenja",
      `Roditelj: ${roditelj.pseudonim} (indeks ${roditelj.indeksStvarnosti}%)\n` +
        `Njegovu stvarnost nije potvrdio nijedan korisnik, pa nema koga da se pita o postojanju deteta.\n` +
        `Uzrast deteta: ${godine} godina.`
    );
  }

  // Obaveštenja idu van transakcije i ne obaraju otvaranje naloga ako padnu.
  await javiPotvrdjivacima(potvrdjivaci, roditelj.pseudonim, godine);

  return { id: dete.id, pseudonim: dete.pseudonim, brojPotvrdjivaca: potvrdjivaci.length };
}

// ── Prekidač i uklanjanje (čl. 10) ────────────────────────────────────────────

/**
 * Provera da je nalog upravo dete tog roditelja; baca ako nije.
 *
 * 🔴 Oba roditelja prolaze isti test — nema „prvog" i „drugog". Ovlašćenja iz
 * čl. 10 (prekidač, uklanjanje oglasa, uvid, brisanje) su im jednaka.
 */
export async function mojeDeteIliBaci(roditeljId: string, deteId: string) {
  const dete = await prisma.user.findUnique({
    where: { id: deteId },
    select: {
      id: true,
      pseudonim: true,
      maloletan: true,
      deaktiviranAt: true,
      roditeljstvaKaoDete: { select: { roditeljId: true } },
    },
  });
  const jeMoje = dete?.roditeljstvaKaoDete.some((r) => r.roditeljId === roditeljId) ?? false;
  if (!dete || !dete.maloletan || !jeMoje || dete.deaktiviranAt) {
    // 404, ne 403 — status 403 bi potvrdio da nalog postoji.
    throw new DecaGreska("Nalog nije pronađen.", 404);
  }
  return dete;
}

/** Prekidač iz čl. 10 st. 2 — komunikacija i razmena sa punoletnim korisnicima. */
export async function postaviDozvolu(roditeljId: string, deteId: string, dozvola: boolean) {
  await mojeDeteIliBaci(roditeljId, deteId);
  await prisma.user.update({ where: { id: deteId }, data: { dozvolaOdrasli: dozvola } });
  return { dozvolaOdrasli: dozvola };
}

/**
 * Nova lozinka detetu, na zahtev roditelja (čl. 10 st. 1).
 *
 * ─── Zašto ovo mora da postoji ──────────────────────────────────────────────
 *
 * Nalog maloletnog korisnika po pravilu nema imejl (čl. 4a — dete unosi adresu
 * SVOG RODITELJA, koja se ne upisuje u `User.email`). Tok „zaboravljena lozinka"
 * traži imejl, pa detetu bez adrese ne stoji na raspolaganju: zaboravljena lozinka
 * je do ove izmene značila trajno zaključan nalog, sa svim prijateljstvima i
 * POEN-om u njemu. Drugi izlaz — da dete sámo upiše i potvrdi svoju adresu — radi
 * samo za stariju decu; ovaj radi uvek.
 *
 * 🔴 Stara lozinka se NE traži i ne može da se traži: roditelj je ne zna, u tome i
 * jeste stvar. Zaštitu nosi to što radnju izvodi isključivo roditelj tog deteta,
 * prijavljen na sopstveni nalog (`mojeDeteIliBaci`).
 *
 * Dete o promeni dobija obaveštenje. Bez njega bi mu nalog prestao da radi bez
 * ijednog traga o tome zašto — a lozinku koju je zapamtilo više ne bi mogao da
 * upotrebi ni ono ni bilo ko drugi.
 */
export async function postaviLozinkuDeteta(
  roditeljId: string,
  deteId: string,
  lozinka: unknown
) {
  const dete = await mojeDeteIliBaci(roditeljId, deteId);
  if (typeof lozinka !== "string" || lozinka.length < MIN_LOZINKA) {
    throw new DecaGreska(`Lozinka mora imati najmanje ${MIN_LOZINKA} znakova.`, 400);
  }

  // 🔴 Ovlašćenje prestaje čim dete upiše i potvrdi SOPSTVENU adresu (čl. 7a):
  // tada mu je put oporavka sopstveni i roditelju ovo dugme više ne treba, a
  // ostavljeno bi značilo da roditelj u svakom trenutku preuzima nalog deteta —
  // uključujući sedamnaestogodišnjaka sa sopstvenom lozinkom. Kad je pristup
  // zaista izgubljen, put je prigovor o kome odlučuje Fondacija (čl. 10 st. 3).
  const sopstvenaAdresa = await prisma.user.findUnique({
    where: { id: dete.id },
    select: { email: true },
  });
  if (sopstvenaAdresa?.email) {
    throw new DecaGreska(PORUKA_LOZINKA_IMA_ADRESU, 403);
  }

  const passwordHash = await bcrypt.hash(lozinka, 12);
  await prisma.user.update({ where: { id: dete.id }, data: { passwordHash } });

  await obavesti(dete.id, {
    tip: "lozinka_promenio_roditelj",
    kljuc: "notifikacije.lozinka_promenio_roditelj",
    parametri: {},
    naslov: "Roditelj ti je postavio novu lozinku",
    tekst: "Pitaj ga koja je nova lozinka i prijavi se njome.",
    link: "/pocetna",
  }).catch(() => {});

  return { ok: true };
}

/**
 * Uklanjanje oglasa deteta (čl. 10 st. 1) — jedno od ovlašćenja uklanjanja koje
 * roditelj ima. Meko, kao i moderacija Fondacije: oglas nestaje iz svih prikaza,
 * a trag ko ga je i kada uklonio ostaje.
 */
export async function ukloniOglasDeteta(roditeljId: string, deteId: string, oglasId: string) {
  const dete = await mojeDeteIliBaci(roditeljId, deteId);
  const izmenjeno = await prisma.marketplaceListing.updateMany({
    where: { id: oglasId, sellerId: dete.id, uklonjenAt: null },
    data: {
      uklonjenAt: new Date(),
      uklonioId: roditeljId,
      uklonjenRazlog: "Uklonio roditelj (Pravilnik o Modulu Deca, čl. 10 st. 1)",
      status: "UKLONJEN",
    },
  });
  if (izmenjeno.count === 0) throw new DecaGreska("Oglas nije pronađen.", 404);

  await obavesti(dete.id, {
    tip: "oglas_uklonjen_roditelj",
    kljuc: "notifikacije.oglas_uklonio_roditelj",
    parametri: {},
    naslov: "Roditelj je uklonio tvoj oglas",
    tekst: "Tvoj oglas je uklonjen sa Pijace.",
    link: "/profil/oglasi",
  }).catch(() => {});

  return { ok: true };
}

/**
 * Razgovori deteta SA PUNOLETNIM LICIMA — roditelj ih čita (čl. 9).
 *
 * 🔴 IZMENA U ODNOSU NA PRVU VERZIJU: razgovore između dece roditelj VIŠE NE ČITA.
 * Nadzor nad dečjim razgovorom dodiruje i tuđe dete — poruke drugog deteta čitao bi
 * neko ko u razgovoru ne učestvuje i kome njegov roditelj ništa nije dozvolio. To je
 * bilo najteže mesto za procenu uticaja i za Politiku privatnosti; kad roditelj ne
 * čita, problem nestaje ceo. Umesto sadržaja roditelj vidi KO i KOLIKO (vidi
 * `dohvatiPregledDeteta`).
 *
 * 🔴 Roditelj SAMO ČITA. Ne piše u razgovor: sa druge strane je odrastao čovek, a
 * taj odnos otvara isključivo prekidač iz čl. 10. Punoletnom sagovorniku u razgovoru
 * stoji vidljiv natpis da razgovor čita roditelj — to je i odvraćanje i poštenje.
 */
export async function dohvatiRazgovoreDeteta(roditeljId: string, deteId: string) {
  const dete = await mojeDeteIliBaci(roditeljId, deteId);

  const konverzacije = await prisma.konverzacija.findMany({
    where: {
      OR: [
        { user1Id: dete.id, user2: { maloletan: false } },
        { user2Id: dete.id, user1: { maloletan: false } },
      ],
    },
    orderBy: { lastMessageAt: "desc" },
    take: 30,
    select: {
      id: true,
      lastMessageAt: true,
      user1: { select: { id: true, pseudonim: true } },
      user2: { select: { id: true, pseudonim: true } },
      poruke: {
        orderBy: { createdAt: "asc" },
        take: 100,
        select: { id: true, tekst: true, posiljacId: true, createdAt: true },
      },
    },
  });

  return konverzacije.map((k) => {
    const drugi = k.user1.id === dete.id ? k.user2 : k.user1;
    return {
      id: k.id,
      drugi: drugi.pseudonim,
      drugiId: drugi.id,
      poslednja: k.lastMessageAt.toISOString(),
      poruke: k.poruke.map((p) => ({
        id: p.id,
        tekst: p.tekst,
        odDeteta: p.posiljacId === dete.id,
        createdAt: p.createdAt.toISOString(),
      })),
    };
  });
}

/**
 * Šta roditelj vidi umesto sadržaja razgovora među decom (čl. 9 st. 2): KO i KOLIKO.
 *
 * Spisak prijatelja sa datumima i spisak razgovora bez ijedne poruke. Uz to
 * istorija prepisa i oglasi stoje na svojim mestima, kao i do sada.
 */
export async function dohvatiPregledDeteta(roditeljId: string, deteId: string) {
  const dete = await mojeDeteIliBaci(roditeljId, deteId);

  const [prijateljstva, konverzacije] = await Promise.all([
    prisma.prijateljstvo.findMany({
      where: { OR: [{ aId: dete.id }, { bId: dete.id }], raskinutAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        poenIsplacen: true,
        a: { select: { id: true, pseudonim: true, deaktiviranAt: true } },
        b: { select: { id: true, pseudonim: true, deaktiviranAt: true } },
      },
    }),
    prisma.konverzacija.findMany({
      where: {
        OR: [
          { user1Id: dete.id, user2: { maloletan: true } },
          { user2Id: dete.id, user1: { maloletan: true } },
        ],
      },
      orderBy: { lastMessageAt: "desc" },
      take: 50,
      select: {
        id: true,
        lastMessageAt: true,
        user1: { select: { id: true, pseudonim: true } },
        user2: { select: { id: true, pseudonim: true } },
        _count: { select: { poruke: true } },
      },
    }),
  ]);

  return {
    prijatelji: prijateljstva
      .map((p) => ({
        drugi: p.a.id === dete.id ? p.b : p.a,
        createdAt: p.createdAt,
        poenIsplacen: p.poenIsplacen,
      }))
      .filter((p) => !p.drugi.deaktiviranAt)
      .map((p) => ({
        pseudonim: p.drugi.pseudonim,
        od: p.createdAt.toISOString(),
        poenIsplacen: p.poenIsplacen,
      })),
    // 🔴 Bez ijedne poruke — samo sa kim i kada. Sadržaj razgovora među decom
    // roditelj ne vidi.
    razgovori: konverzacije.map((k) => ({
      id: k.id,
      drugi: (k.user1.id === dete.id ? k.user2 : k.user1).pseudonim,
      poruka: k._count.poruke,
      poslednja: k.lastMessageAt.toISOString(),
    })),
  };
}

// ── Brisanje naloga (čl. 17) ─────────────────────────────────────────────────

/**
 * Roditelj briše nalog svog deteta. Poništavaju se svi zapisi POEN-a uz protivzapis
 * Protokola i uklanjaju se svi oglasi.
 *
 * Nalog se anonimizuje i deaktivira, a ne briše iz baze — isti postupak kao pri
 * prestanku statusa punoletnog korisnika (čl. 34 Pravilnika o KOLO sistemu).
 * Numerička istorija transakcija ostaje, jer bez nje zero-sum ne bi mogao da se
 * proveri; napušteni pseudonim se briše, pa ime postaje ponovo slobodno.
 */
export async function obrisiNalogDeteta(roditeljId: string, deteId: string) {
  const dete = await mojeDeteIliBaci(roditeljId, deteId);
  return obrisiDecjiNalog(dete.id, dete.pseudonim, roditeljId, "Modul Deca, čl. 17");
}

/**
 * Jezgro brisanja dečjeg naloga. Zove ga i roditelj (čl. 17) i noćni posao koji
 * uklanja naloge koje niko nije preuzeo u roku od četrnaest dana (čl. 4b st. 5).
 */
export async function obrisiDecjiNalog(
  deteId: string,
  pseudonim: string,
  uklonioId: string | null,
  osnov: string
) {
  await prisma.$transaction(async (tx) => {
    const w = await tx.wallet.findUnique({ where: { userId: deteId } });
    const balans = w?.balance ?? 0;
    // 🔴 `increment: balans` pokriva i NEGATIVNO stanje. Dečji zapis sme u minus
    // (raskid prijateljstva, čl. 14c st. 3), pa nulovanje takvog zapisa dodaje POEN
    // u sistem i Protokol mora da ide dublje u minus, ne plići. Uslov `> 0` bi tada
    // tiho oborio zero-sum.
    if (w && balans !== 0) {
      await tx.wallet.update({ where: { id: w.id }, data: { balance: 0 } });
      await tx.wallet.update({
        where: { id: PROTOKOL_WALLET_ID },
        data: { balance: { increment: balans } },
      });
      await tx.transaction.create({
        data: {
          fromWalletId: balans > 0 ? w.id : PROTOKOL_WALLET_ID,
          toWalletId: balans > 0 ? PROTOKOL_WALLET_ID : w.id,
          amount: Math.abs(balans),
          type: TransactionType.TRANSFER,
          description: `Poništavanje POENA pri brisanju naloga deteta (${osnov})`,
        },
      });
    }

    await tx.marketplaceListing.updateMany({
      where: { sellerId: deteId, uklonjenAt: null },
      data: {
        uklonjenAt: new Date(),
        uklonioId,
        uklonjenRazlog: `Brisanje naloga deteta (${osnov})`,
        status: "UKLONJEN",
      },
    });

    // Postupak potvrde gubi predmet — zapisi koji još čekaju se brišu, a oni koji
    // su okončani (potvrđeni, osporeni, istekli) padaju uz sam nalog kaskadno.
    await tx.roditeljstvoPotvrda.deleteMany({ where: { deteId, status: "CEKA" } });

    // Prijateljstva se brišu bez otpisa: POEN je upravo poništen u celini, pa bi
    // otpis po prijateljstvu isti iznos oduzeo dvaput. Druga strana zadržava svojih
    // 500 — nije ona ta koja odlazi.
    await tx.prijateljstvo.deleteMany({ where: { OR: [{ aId: deteId }, { bId: deteId }] } });
    await tx.prijateljToken.deleteMany({ where: { korisnikId: deteId } });
    await tx.roditeljstvo.deleteMany({ where: { deteId } });
    await tx.roditeljPoziv.deleteMany({ where: { deteId } });

    await tx.verifikacijaToken.deleteMany({ where: { korisnikId: deteId } });
    await tx.passwordResetToken.deleteMany({ where: { userId: deteId } });
    await tx.aktivnostLog.deleteMany({ where: { userId: deteId } });
    await tx.pseudonimIstorija.deleteMany({ where: { userId: deteId } });

    await tx.user.update({
      where: { id: deteId },
      data: {
        email: null,
        passwordHash: null,
        ...poljaPseudonima(`obrisani-korisnik-${deteId.slice(0, 8)}`),
        telefon: null,
        location: null,
        avatar: null,
        datumRodjenja: null,
        maloletan: false,
        dozvolaOdrasli: false,
        status: UserStatus.EXCLUDED,
        deaktiviranAt: new Date(),
      },
    });
  });

  return { ok: true, pseudonim };
}

// ── Potvrda roditeljstva (čl. 6) ─────────────────────────────────────────────

/**
 * Poruka koja se vraća na izjašnjenje posle isteka roka.
 *
 * Ne kaže samo „istekao je" nego i šta čoveku preostaje: po čl. 6 st. 4 zakasnelo
 * izjašnjenje samo po sebi ne otklanja poništenje, ali prigovor postoji i o njemu
 * odlučuje čovek. Bez druge rečenice poruka saopštava da izlaza nema.
 */
/**
 * Zašto roditelj ne postavlja lozinku detetu koje ima svoju adresu (čl. 10 st. 3).
 * Poruka imenuje i izlaz — inače saopštava samo zabranu.
 */
export const PORUKA_LOZINKA_IMA_ADRESU =
  "Dete je upisalo svoju elektronsku adresu, pa lozinku postavlja samo ono — kroz postupak za zaboravljenu lozinku. Ako je pristup stvarno izgubljen, podnesi prigovor sa svog profila; odlučuje Fondacija.";

export const PORUKA_ROK_ISTEKAO =
  "Rok za izjašnjenje je istekao. Ako smatraš da je poništenje nepravilno, možeš uložiti prigovor sa svog profila.";

/**
 * Otvara postupak potvrde za jednu vezu roditelj–dete.
 *
 * 🔴 Postupak se od seta 4.5.2 otvara na SVAKOM mestu na kome nastaje veza koja
 * ga traži, a ne samo pri otvaranju naloga iz roditeljskog profila. Do tada je
 * `poveziRoditelja` (dete koje se registrovalo samo, i drugi roditelj) nije
 * otvarao uopšte — ceo taj ulaz u modul prolazio je bez ijedne provere, iako je
 * upravo on onaj iza koga ne stoji niko dok roditelj ne dođe.
 *
 * Vraća pseudonime i identifikatore potvrđivača kojima je red nastao, radi
 * javljanja koje ide van transakcije.
 */
export async function otvoriPostupakPotvrde(
  deteId: string,
  roditeljId: string,
  sada: Date,
  tx?: Tx
): Promise<string[]> {
  const db = tx ?? prisma;
  // 🟡 Skup SME da bude prazan: kod početnog korisnika (osnivač, UO) nema nikoga
  // iznad njega u lancu, pa se nalog deteta otvara na njegovu reč.
  const veze = await db.verifikacionaVeza.findMany({
    where: { verifikovaniId: roditeljId },
    select: { verifikatorId: true },
  });
  const potvrdjivaci = [...new Set(veze.map((v) => v.verifikatorId))];
  if (potvrdjivaci.length === 0) return [];

  await db.roditeljstvoPotvrda.createMany({
    data: potvrdjivaci.map((potvrdjivacId) => ({
      deteId,
      roditeljId,
      potvrdjivacId,
      rokDo: rokIzjasnjenja(sada),
    })),
    skipDuplicates: true,
  });
  return potvrdjivaci;
}

/** Javljanje potvrđivačima da se od njih traži izjašnjenje. Van transakcije. */
export async function javiPotvrdjivacima(
  potvrdjivaci: string[],
  roditeljPseudonim: string,
  godine: number,
  povod: "otvaranje" | "prevod" = "otvaranje"
) {
  for (const potvrdjivacId of potvrdjivaci) {
    await obavesti(potvrdjivacId, {
      tip: "roditeljstvo_potvrda",
      kljuc:
        povod === "prevod"
          ? "notifikacije.roditeljstvo_potvrda_prevod"
          : "notifikacije.roditeljstvo_potvrda",
      parametri: { pseudonim: roditeljPseudonim, godine, dana: ROK_POTVRDE_DANA },
      naslov: "Potvrdi postojanje deteta",
      tekst:
        povod === "prevod"
          ? `Nalog člana ${roditeljPseudonim} ispravljen je u nalog deteta uzrasta ${godine} godina. Imaš ${ROK_POTVRDE_DANA} dana da potvrdiš da to znaš.`
          : `Sa naloga ${roditeljPseudonim} otvoren je nalog za dete uzrasta ${godine} godina. Imaš ${ROK_POTVRDE_DANA} dana da potvrdiš da to znaš.`,
      link: "/deca/potvrde",
    }).catch(() => {});
  }
}

/**
 * Čl. 6 st. 5 — postupak se sprovodi ponovo pri svakoj novoj potvrdi stvarnosti
 * roditelja. Odredba postoji od prve verzije akta; kod je do seta 4.5.2 nije
 * sprovodio, pa onaj ko roditelja potvrdi posle otvaranja dečjeg naloga nikad
 * nije bio upitan — a upravo je on jedini potvrđivač koji o detetu ništa nije rekao.
 *
 * Ne baca: nova potvrda stvarnosti ne sme da padne zbog ovog postupka.
 */
export async function otvoriPostupakZaNovogPotvrdjivaca(
  roditeljId: string,
  potvrdjivacId: string,
  sada: Date = new Date()
): Promise<number> {
  const deca = await prisma.roditeljstvo.findMany({
    where: { roditeljId, dete: { maloletan: true, deaktiviranAt: null } },
    select: { deteId: true },
  });
  if (deca.length === 0) return 0;
  const rezultat = await prisma.roditeljstvoPotvrda.createMany({
    data: deca.map((d) => ({
      deteId: d.deteId,
      roditeljId,
      potvrdjivacId,
      rokDo: rokIzjasnjenja(sada),
    })),
    skipDuplicates: true,
  });
  return rezultat.count;
}

/** Zapisi koji čekaju izjašnjenje ovog korisnika. */
export async function potvrdeNaCekanju(potvrdjivacId: string) {
  const redovi = await prisma.roditeljstvoPotvrda.findMany({
    where: { potvrdjivacId, status: "CEKA" },
    orderBy: { rokDo: "asc" },
    select: {
      id: true,
      rokDo: true,
      roditelj: { select: { pseudonim: true } },
      // 🔴 Pseudonim deteta i datum rođenja se NE šalju. Potvrđivač se izjašnjava o
      // činjenici koju i sam zna, ne o podatku koji mu se pokazuje (čl. 6 st. 1).
      dete: { select: { datumRodjenja: true } },
    },
  });
  const danas = beogradskiDan();
  return redovi
    .filter((r) => r.dete.datumRodjenja)
    .map((r) => ({
      id: r.id,
      roditelj: r.roditelj.pseudonim,
      godine: uzrast(r.dete.datumRodjenja!, danas),
      rokDo: r.rokDo.toISOString(),
    }));
}

/**
 * Izjava roditelja o postojanju deteta (čl. 6 st. 1), kad je rok počeo da teče.
 *
 * Po pravilu izjava nastaje u trenutku u kome roditelj preuzima odgovornost za
 * nalog, pa ova radnja pokriva jedini slučaj u kome tog trenutka nije bilo —
 * administrativno prevođenje punoletnog naloga u maloletni.
 */
export async function dajIzjavuRoditelja(roditeljId: string, deteId: string) {
  const veza = await prisma.roditeljstvo.findUnique({
    where: { deteId_roditeljId: { deteId, roditeljId } },
    select: {
      id: true,
      izjavaAt: true,
      dete: { select: { pseudonim: true, datumRodjenja: true } },
    },
  });
  if (!veza) throw new DecaGreska("Nalog nije pronađen.", 404);
  if (veza.izjavaAt) return { ok: true, vecData: true };
  if (!veza.dete.datumRodjenja) throw new DecaGreska("Datum rođenja nije upisan.", 409);

  const godine = uzrast(veza.dete.datumRodjenja, beogradskiDan());
  await prisma.roditeljstvo.update({
    where: { id: veza.id },
    data: {
      izjavaAt: new Date(),
      izjavaTekst: generisiIzjavuRoditelja({
        pseudonimDeteta: veza.dete.pseudonim,
        godine,
      }),
      izjavaRokDo: null,
    },
  });
  return { ok: true, vecData: false };
}

/**
 * Izjašnjenje potvrđivača (čl. 6).
 *
 * „Nemam saznanja o tome" se NE beleži kao odgovor — po pravilniku je to isto što i
 * neaktivnost, pa zapis ostaje da čeka istek roka. Da se beleži kao okončan, čovek
 * bi mislio da je posao završio, a potvrda bi mu ipak pala.
 */
export async function izjasniSe(
  potvrdjivacId: string,
  potvrdaId: string,
  odgovor: "POTVRDIO" | "OSPORIO",
  obrazlozenje?: string
) {
  if (odgovor === "OSPORIO" && !obrazlozenje?.trim()) {
    throw new DecaGreska("Osporavanje zahteva obrazloženje.", 400);
  }
  const izmenjeno = await prisma.roditeljstvoPotvrda.updateMany({
    where: { id: potvrdaId, potvrdjivacId, status: "CEKA" },
    data: {
      status: odgovor as RoditeljstvoPotvrdaStatus,
      obrazlozenje: obrazlozenje?.trim() || null,
      odgovorAt: new Date(),
    },
  });
  // Izjašnjenje dato po isteku roka ne otklanja nastupelo poništenje samo po sebi
  // (čl. 6 st. 4) — zapis tada više nije u stanju CEKA, pa `updateMany` ne pogađa
  // nijedan red. Put koji ostaje je prigovor, o kome odlučuje čovek.
  if (izmenjeno.count === 0) throw new DecaGreska(PORUKA_ROK_ISTEKAO, 409);

  if (odgovor === "OSPORIO") {
    const podaci = await prisma.roditeljstvoPotvrda.findUnique({
      where: { id: potvrdaId },
      select: {
        roditelj: { select: { pseudonim: true } },
        dete: { select: { pseudonim: true } },
      },
    });
    // O osporavanju odlučuje Upravni odbor (čl. 6 st. 6).
    const { posaljiAdminAlert } = await import("@/lib/adminAlert");
    void posaljiAdminAlert(
      "Osporeno postojanje deteta",
      `Roditelj: ${podaci?.roditelj.pseudonim ?? "?"}\n` +
        `Nalog deteta: ${podaci?.dete.pseudonim ?? "?"}\nObrazloženje: ${obrazlozenje}`
    );
  }
  return { ok: true };
}

// ── Istek roka (čl. 6 st. 3) ─────────────────────────────────────────────────

/**
 * Opis koji ide u zapise pogođenih.
 *
 * 🔴 NE koristiti podrazumevani opis iz `ponistiVerifikaciju` — on glasi
 * „Poništavanje lažne verifikacije … (čl. 20a)". Ovde niko nije slagao: veza pada
 * zato što se o postojanju deteta nije izjasnila jedna od dve strane. Taj opis
 * stoji u istoriji POEN-a pogođenog i u njegovom GDPR izvozu, pa bi mu Fondacija
 * izdavala dokument sa neistinitom kvalifikacijom.
 */
function opisPonistenja(potvrdjivac: string, roditelj: string): string {
  return (
    `Poništenje potvrde ${potvrdjivac} → ${roditelj} zbog neaktivnosti u postupku ` +
    `potvrde postojanja deteta (čl. 6 st. 3 Pravilnika o učešću dece)`
  );
}

/** Vraća sve pogođene jedne veze i iznos koji svakome pada. */
async function pogodjeniVezom(vezaId: string) {
  const v = await prisma.verifikacionaVeza.findUnique({
    where: { id: vezaId },
    select: {
      verifikatorId: true,
      verifikovaniId: true,
      nadzornikId: true,
      podlezeNadzoru: true,
      nadzorIshod: true,
      verifikator: { select: { pseudonim: true } },
      verifikovani: { select: { pseudonim: true } },
    },
  });
  if (!v) return null;
  const stavke: { userId: string; iznos: number; uloga: "potvrdjivac" | "roditelj" | "nadzornik" }[] =
    [
      { userId: v.verifikatorId, iznos: POEN_VERIFIKATOR, uloga: "potvrdjivac" },
      { userId: v.verifikovaniId, iznos: POEN_VERIFIKOVANI, uloga: "roditelj" },
    ];
  // Nadzornikovih 500 pada samo uz ishod „uredno" (čl. 20a st. 2) — ko je sumnju
  // prijavio i bio u pravu ne sme da prođe gore od onoga ko se nije javio.
  if (v.podlezeNadzoru && v.nadzornikId && v.nadzorIshod === "UREDNO") {
    stavke.push({ userId: v.nadzornikId, iznos: POEN_NADZORNIK, uloga: "nadzornik" });
  }
  return { veza: v, stavke };
}

/**
 * Poništenje jedne potvrde zbog neaktivnosti + javljanje svima koje pogađa.
 *
 * 🔴 Svaki pogođeni vraća TAČNO ono što je po toj potvrdi dobio, i njegov zapis
 * sme u minus (Pravilnik čl. 14 st. 3 t. 4, čl. 6 st. 3 Pravilnika o učešću dece).
 * Nadoknada iz čl. 20b se NE primenjuje: ona je posledica utvrđene lažne
 * verifikacije i vezuje teret za verifikatora zato što je on uveo nalog koji ne
 * postoji. Ovde utvrđenja nema, pa nema ni razloga da jedan čovek nosi tuđe —
 * do seta 4.5.2 je upravo to radio, i to do 2.500 POEN u minusu.
 */
async function ponistiPotvrduZbogNeaktivnosti(vezaId: string): Promise<boolean> {
  const podaci = await pogodjeniVezom(vezaId);
  if (!podaci) return false;
  const { veza, stavke } = podaci;
  const opis = opisPonistenja(veza.verifikator.pseudonim, veza.verifikovani.pseudonim);

  await ponistiVerifikaciju(vezaId, { opis, bezNadoknade: true });

  // Minus menja šta čovek sme sa zapisom i ne sme da se pojavi bez reči — zato
  // javljanje ide SVAKOME kome je nešto oduzeto, sa iznosom, a ne samo onome ko
  // se nije izjasnio.
  for (const s of stavke) {
    await obavesti(s.userId, {
      tip: "roditeljstvo_ponistena",
      kljuc: `notifikacije.roditeljstvo_ponistena_${s.uloga}`,
      parametri: {
        pseudonim:
          s.uloga === "potvrdjivac" ? veza.verifikovani.pseudonim : veza.verifikator.pseudonim,
        iznos: s.iznos,
      },
      naslov: "Potvrda stvarnosti je poništena",
      tekst:
        `Potvrda stvarnosti ${veza.verifikator.pseudonim} → ${veza.verifikovani.pseudonim} ` +
        `poništena je jer izjašnjenje o postojanju deteta nije stiglo u roku. ` +
        `Sa tvog zapisa je otpisano ${s.iznos} POEN; zapis time može preći u minus. ` +
        `Poništenje ne znači da je iko dao neistinitu potvrdu — ako smatraš da je ` +
        `nepravilno, možeš uložiti prigovor sa svog profila.`,
      link: "/verifikacija",
    }).catch(() => {});
  }
  return true;
}

/**
 * Istek roka za izjašnjenje (čl. 6 st. 3) — noćni posao.
 *
 * Potvrda opstaje samo ako su se u roku izjasnile OBE strane veze. Otud dva izvora
 * isteka: potvrđivač koji se nije izjasnio, i roditelj koji nije dao izjavu tamo
 * gde mu je rok tekao (jedini takav slučaj je administrativno prevođenje naloga).
 *
 * Posao je idempotentan i nadoknađuje: obrađuje sve istekle zapise, ne samo
 * današnje. Bez toga bi jedno preskočeno pokretanje ostavilo potvrdu na snazi.
 */
export async function obradiIstekleRokove(sada: Date = new Date()) {
  let ponisteno = 0;
  let pregledano = 0;

  // ── A. Roditelj nije dao izjavu u roku ─────────────────────────────────────
  //
  // Pada svaka potvrda koja za to dete čeka izjašnjenje o TOM roditelju. Rok se
  // potom gasi (`izjavaRokDo: null`) — i zato što je posao obavljen, i zato što
  // nova potvrda po čl. 6 st. 5 mora da dobije svoj rok, a ne da istekne odmah
  // na zatečeni. Sam roditelj izjavu i dalje može dati.
  const bezIzjave = await prisma.roditeljstvo.findMany({
    where: { izjavaAt: null, izjavaRokDo: { lte: sada } },
    select: { id: true, deteId: true, roditeljId: true },
  });
  for (const veza of bezIzjave) {
    const rezervisano = await prisma.roditeljstvo.updateMany({
      where: { id: veza.id, izjavaAt: null, izjavaRokDo: { lte: sada } },
      data: { izjavaRokDo: null },
    });
    if (rezervisano.count === 0) continue;

    const cekaju = await prisma.roditeljstvoPotvrda.findMany({
      where: { deteId: veza.deteId, roditeljId: veza.roditeljId, status: "CEKA" },
      select: { id: true, potvrdjivacId: true },
    });
    pregledano += cekaju.length;
    for (const zapis of cekaju) {
      if (await padniZapis(zapis.id, zapis.potvrdjivacId, veza.roditeljId, sada)) {
        ponisteno += 1;
      }
    }
  }

  // ── B. Potvrđivač se nije izjasnio u roku ──────────────────────────────────
  const istekli = await prisma.roditeljstvoPotvrda.findMany({
    where: { status: "CEKA", rokDo: { lte: sada } },
    select: { id: true, potvrdjivacId: true, roditeljId: true },
  });
  pregledano += istekli.length;
  for (const zapis of istekli) {
    if (await padniZapis(zapis.id, zapis.potvrdjivacId, zapis.roditeljId, sada)) {
      ponisteno += 1;
    }
  }

  return { pregledano, ponisteno };
}

/** Jedan zapis: rezervacija stanja, poništenje veze, oslobađanje slota. */
async function padniZapis(
  potvrdaId: string,
  potvrdjivacId: string,
  roditeljId: string,
  sada: Date
): Promise<boolean> {
  // Stanje se prvo pomera na ISTEKLA, uslovno — ako dva pokretanja posla trče
  // uporedo, drugi neće naći red u stanju CEKA i neće poništiti potvrdu dvaput.
  const rezervisano = await prisma.roditeljstvoPotvrda.updateMany({
    where: { id: potvrdaId, status: "CEKA" },
    data: { status: "ISTEKLA", odgovorAt: sada },
  });
  if (rezervisano.count === 0) return false;

  const vezaPotvrde = await prisma.verifikacionaVeza.findUnique({
    where: { verifikatorId_verifikovaniId: { verifikatorId: potvrdjivacId, verifikovaniId: roditeljId } },
    select: { id: true },
  });
  // Potvrda je u međuvremenu već pala nekim drugim putem — nema šta da se poništi.
  if (!vezaPotvrde) return false;

  const pao = await ponistiPotvrduZbogNeaktivnosti(vezaPotvrde.id);
  if (pao) await oslobodiSlot(potvrdjivacId);
  return pao;
}

/**
 * Podsetnici pre isteka roka (čl. 6 st. 3) — isti noćni posao.
 *
 * 🔴 Podsetnik ide SVAKOME koga bi poništenje oštetilo — potvrđivaču, roditelju i
 * nadzorniku — a ne samo onome od koga se izjašnjenje traži. Do seta 4.5.2 je
 * postojalo jedno jedino obaveštenje, u trenutku otvaranja naloga: čovek je gubio
 * potvrdu i POEN posle mesec dana tišine, bez ijednog upozorenja u međuvremenu.
 */
export async function posaljiPodsetnike(sada: Date = new Date()) {
  const cekaju = await prisma.roditeljstvoPotvrda.findMany({
    where: { status: "CEKA", rokDo: { gt: sada } },
    select: {
      id: true,
      rokDo: true,
      podsetnikDana: true,
      potvrdjivacId: true,
      roditeljId: true,
      roditelj: { select: { pseudonim: true } },
      potvrdjivac: { select: { pseudonim: true } },
    },
  });

  let poslato = 0;
  for (const zapis of cekaju) {
    const prag = pragPodsetnika(danaDoIsteka(zapis.rokDo, sada), zapis.podsetnikDana);
    if (prag === null) continue;

    const rezervisano = await prisma.roditeljstvoPotvrda.updateMany({
      where: {
        id: zapis.id,
        status: "CEKA",
        OR: [{ podsetnikDana: null }, { podsetnikDana: { gt: prag } }],
      },
      data: { podsetnikDana: prag },
    });
    if (rezervisano.count === 0) continue;

    const veza = await prisma.verifikacionaVeza.findUnique({
      where: {
        verifikatorId_verifikovaniId: {
          verifikatorId: zapis.potvrdjivacId,
          verifikovaniId: zapis.roditeljId,
        },
      },
      select: { id: true },
    });
    if (!veza) continue;
    const podaci = await pogodjeniVezom(veza.id);
    if (!podaci) continue;

    for (const s of podaci.stavke) {
      await obavesti(s.userId, {
        tip: "roditeljstvo_podsetnik",
        kljuc: `notifikacije.roditeljstvo_podsetnik_${s.uloga}`,
        parametri: {
          pseudonim:
            s.uloga === "potvrdjivac" ? zapis.roditelj.pseudonim : zapis.potvrdjivac.pseudonim,
          dana: prag,
          iznos: s.iznos,
        },
        naslov: "Potvrda postojanja deteta ističe",
        tekst:
          `Rok za izjašnjenje o postojanju deteta ističe za ${prag} dana. ` +
          `Ako izjašnjenje izostane, potvrda stvarnosti ${zapis.potvrdjivac.pseudonim} → ` +
          `${zapis.roditelj.pseudonim} biće poništena, a sa tvog zapisa otpisano ` +
          `${s.iznos} POEN — i kada zapis time pređe u minus.`,
        link: s.uloga === "potvrdjivac" ? "/deca/potvrde" : "/verifikacija",
      }).catch(() => {});
      poslato += 1;
    }
  }
  return { poslato };
}

/** Vraća slot potvrđivaču. Prati obrazac iz `reset-korisnika.ts`. */
async function oslobodiSlot(potvrdjivacId: string, tx?: Tx) {
  const db = tx ?? prisma;
  const k = await db.user.findUnique({
    where: { id: potvrdjivacId },
    select: { tipKorisnika: true, slotoviPotroseni: true },
  });
  if (k?.tipKorisnika === TipKorisnika.REGULARNI && k.slotoviPotroseni > 0) {
    await db.user.update({
      where: { id: potvrdjivacId },
      data: { slotoviPotroseni: { decrement: 1 } },
    });
  }
}
// ── Prikaz roditelju ──────────────────────────────────────────────────────────

/** Spisak dece sa stanjem naloga i postupka potvrde — za odeljak „Moja deca". */
export async function dohvatiDecu(roditeljId: string) {
  const deca = await prisma.user.findMany({
    where: {
      maloletan: true,
      deaktiviranAt: null,
      roditeljstvaKaoDete: { some: { roditeljId } },
    },
    orderBy: { createdAt: "asc" },
    select: {
      ...IZBOR_UCESNIKA,
      pseudonim: true,
      avatar: true,
      datumRodjenja: true,
      wallet: { select: { balance: true } },
      roditeljPoziv: { select: { kod: true, brisanjeDo: true } },
      potvrdeRoditeljstvaZaMene: { select: { status: true, rokDo: true } },
      roditeljstvaKaoDete: {
        select: {
          roditeljId: true,
          roditelj: {
            select: {
              pseudonim: true,
              verified: true,
              indeksStvarnosti: true,
              status: true,
              deaktiviranAt: true,
            },
          },
        },
      },
    },
  });
  const danas = beogradskiDan();
  return deca.map((d) => {
    const potvrde = d.potvrdeRoditeljstvaZaMene;
    const cekaju = potvrde.filter((p) => p.status === "CEKA");
    const rokDo =
      cekaju.length > 0
        ? cekaju.reduce((min, p) => (p.rokDo < min ? p.rokDo : min), cekaju[0].rokDo)
        : null;
    return {
      id: d.id,
      pseudonim: d.pseudonim,
      avatar: d.avatar,
      godine: d.datumRodjenja ? uzrast(d.datumRodjenja, danas) : null,
      dozvolaOdrasli: d.dozvolaOdrasli,
      balans: d.wallet?.balance ?? 0,
      stanje: ucesnikIzReda(d).stanje,
      // Šestocifreni kod stoji uz dete i posle preuzimanja — njime DRUGI roditelj
      // ulazi u nalog (čl. 4b st. 6).
      kod: d.roditeljPoziv?.kod ?? null,
      roditelji: d.roditeljstvaKaoDete.map((r) => r.roditelj.pseudonim),
      potvrde: {
        ukupno: potvrde.length,
        potvrdjeno: potvrde.filter((p) => p.status === "POTVRDIO").length,
        ceka: cekaju.length,
        osporeno: potvrde.filter((p) => p.status === "OSPORIO").length,
        isteklo: potvrde.filter((p) => p.status === "ISTEKLA").length,
        rokDo: rokDo?.toISOString() ?? null,
      },
    };
  });
}

/**
 * Odluka o pristupu profilu maloletnog korisnika (vidi `smeDaVidiProfilDeteta`).
 *
 * Kad pristup nije dopušten, vraća se sadržaj ZATVORENOG PRIKAZA — a ne gola
 * zabrana. Ekran mora da uradi tri stvari, inače izgleda kao kvar:
 *   1. kaže ZAŠTO profil nije otvoren,
 *   2. imenuje ODRASLU OSOBU kojoj se čovek obraća (čl. 10 — roditelj odgovara za
 *      radnje deteta; bez imena roditelja je to slepa ulica, a i zapis u knjizi
 *      ostaje neobjašnjen: „ko je sad pa Mihajlo"),
 *   3. pokazuje JEDINI dozvoljeni put dalje — oglas na Pijaci.
 *
 * 🔴 U zatvorenom prikazu NE SME biti ničega drugog: ni stanja, ni škole, ni
 * oglasa, ni prijateljstava. Svaki dodatak pretvara ekran u mali profil.
 *
 * `razlog` razdvaja dva različita ekrana: punoletnom članu se objašnjava pravilo,
 * detetu se kaže da profil vidi samo svojim prijateljima.
 */
export async function pristupProfiluDeteta(
  posmatracId: string | null,
  metaId: string,
  posmatracJeAdmin: boolean
): Promise<
  | { sme: true }
  | {
      sme: false;
      zatvoren: {
        pseudonim: string;
        roditelji: { id: string; pseudonim: string }[];
        razlog: "PUNOLETAN" | "NIJE_PRIJATELJ";
      };
    }
> {
  const meta = await ucitajUcesnika(metaId);
  if (!meta || !meta.maloletan) return { sme: true };

  const posmatrac = posmatracId ? await ucitajUcesnika(posmatracId) : null;

  // Prijateljstvo se proverava upitom umesto pozivom `suPrijatelji()` iz
  // `prijateljstva.ts` — taj modul uvozi OVAJ (`IZBOR_UCESNIKA`, `ucesnikIzReda`),
  // pa bi obrnut uvoz zatvorio krug. Par se uvek pamti uređeno (`aId < bId`).
  const [aId, bId] = posmatracId
    ? posmatracId < metaId
      ? [posmatracId, metaId]
      : [metaId, posmatracId]
    : ["", ""];
  const prijatelji =
    posmatracId && posmatrac?.maloletan
      ? (await prisma.prijateljstvo.count({ where: { aId, bId, raskinutAt: null } })) > 0
      : false;

  if (
    smeDaVidiProfilDeteta(
      posmatrac ? { ...posmatrac, admin: posmatracJeAdmin } : null,
      meta,
      prijatelji
    )
  ) {
    return { sme: true };
  }

  const red = await prisma.user.findUnique({
    where: { id: metaId },
    select: {
      pseudonim: true,
      roditeljstvaKaoDete: {
        select: { roditelj: { select: { id: true, pseudonim: true } } },
      },
    },
  });

  return {
    sme: false,
    zatvoren: {
      pseudonim: red?.pseudonim ?? "",
      roditelji: red?.roditeljstvaKaoDete.map((r) => r.roditelj) ?? [],
      razlog: posmatrac?.maloletan ? "NIJE_PRIJATELJ" : "PUNOLETAN",
    },
  };
}
