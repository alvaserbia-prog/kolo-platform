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
import { FUNKCIONALNI_PRAG_INDEKSA } from "./dokaz-stvarnosti";
import { ponistiVerifikaciju } from "./lazna-verifikacija";
import { obavesti } from "@/lib/notifikacije";
import {
  PORUKA_CEKA_RODITELJA,
  ROK_POTVRDE_DANA,
  nalogRadi,
  rokIzjasnjenja,
  stanjeDeteta,
  uzrast,
  uzrastZaModul,
  type StanjeDeteta,
  type Ucesnik,
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
            // Oglase punoletnih dete vidi tek uz saglasnost roditelja — vidi
            // obrazloženje uz `smeDaVidiOglas` u `deca-pravila.ts`.
            ...(posmatrac.dozvolaOdrasli ? [{ maloletan: false }] : []),
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
          { maloletan: true, dozvolaOdrasli: true },
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

  // Ljudi koji su potvrdili roditelja — njima ide izjašnjenje iz čl. 6.
  //
  // 🟡 Skup SME da bude prazan: kod početnog korisnika (osnivač, UO) nema nikoga
  // iznad njega u lancu, pa se nalog deteta otvara na njegovu reč. To je posledica
  // toga što je on ishodište lanca potvrda, a ne propust — ali znači i da za ta
  // deca ne postoji nijedno izjašnjenje, pa se Fondaciji javlja da se zna.
  const veze = await prisma.verifikacionaVeza.findMany({
    where: { verifikovaniId: roditelj.id },
    select: { verifikatorId: true },
  });
  const potvrdjivaci = [...new Set(veze.map((v) => v.verifikatorId))];

  const sada = new Date();
  const rokDo = rokIzjasnjenja(sada);
  // Kod kojim ulazi DRUGI roditelj (čl. 4b st. 6). Nastaje i ovde, iako poziva
  // nema — inače bi drugi roditelj mogao da uđe samo kod dece koja su se
  // registrovala sama, što je razlika bez razloga.
  const { poljaPozivaZaRoditeljskiUlaz } = await import("./deca-poziv");
  const roditeljEmail = roditelj.email;

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

    await tx.roditeljstvoPotvrda.createMany({
      data: potvrdjivaci.map((potvrdjivacId) => ({
        deteId: kreirano.id,
        potvrdjivacId,
        rokDo,
      })),
      skipDuplicates: true,
    });

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
  for (const potvrdjivacId of potvrdjivaci) {
    await obavesti(potvrdjivacId, {
      tip: "roditeljstvo_potvrda",
      kljuc: "notifikacije.roditeljstvo_potvrda",
      parametri: { pseudonim: roditelj.pseudonim, godine, dana: ROK_POTVRDE_DANA },
      naslov: "Potvrdi postojanje deteta",
      tekst: `${roditelj.pseudonim} je otvorio/la nalog svom detetu uzrasta ${godine} godina. Imaš ${ROK_POTVRDE_DANA} dana da potvrdiš da to znaš.`,
      link: "/deca/potvrde",
    }).catch(() => {});
  }

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
          description: `Poništavanje POEN-a pri brisanju naloga deteta (${osnov})`,
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

/** Zapisi koji čekaju izjašnjenje ovog korisnika. */
export async function potvrdeNaCekanju(potvrdjivacId: string) {
  const redovi = await prisma.roditeljstvoPotvrda.findMany({
    where: { potvrdjivacId, status: "CEKA" },
    orderBy: { rokDo: "asc" },
    select: {
      id: true,
      rokDo: true,
      // 🔴 Pseudonim deteta i datum rođenja se NE šalju. Potvrđivač se izjašnjava o
      // činjenici koju i sam zna, ne o podatku koji mu se pokazuje (čl. 6 st. 1).
      dete: {
        select: {
          datumRodjenja: true,
          roditeljstvaKaoDete: { select: { roditelj: { select: { pseudonim: true } } } },
        },
      },
    },
  });
  const danas = beogradskiDan();
  return redovi
    .filter((r) => r.dete.datumRodjenja && r.dete.roditeljstvaKaoDete.length > 0)
    .map((r) => ({
      id: r.id,
      roditelj: r.dete.roditeljstvaKaoDete.map((v) => v.roditelj.pseudonim).join(" / "),
      godine: uzrast(r.dete.datumRodjenja!, danas),
      rokDo: r.rokDo.toISOString(),
    }));
}

/**
 * Izjašnjenje potvrđivača (čl. 6).
 *
 * „Nemam saznanja o tome" se NE beleži kao odgovor — po pravilniku je to isto što i
 * ćutanje, pa zapis ostaje da čeka istek roka. Da se beleži kao okončan, čovek bi
 * mislio da je posao završio, a potvrda bi mu ipak pala.
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
  // Izjašnjenje dato po isteku roka ne otklanja nastupelo poništenje (čl. 6 st. 4) —
  // zapis tada više nije u stanju CEKA, pa `updateMany` ne pogađa nijedan red.
  if (izmenjeno.count === 0) throw new DecaGreska("Rok za izjašnjenje je istekao.", 409);

  if (odgovor === "OSPORIO") {
    const podaci = await prisma.roditeljstvoPotvrda.findUnique({
      where: { id: potvrdaId },
      select: {
        dete: {
          select: {
            pseudonim: true,
            roditeljstvaKaoDete: { select: { roditelj: { select: { pseudonim: true } } } },
          },
        },
      },
    });
    // O osporavanju odlučuje Upravni odbor (čl. 6 st. 6).
    const { posaljiAdminAlert } = await import("@/lib/adminAlert");
    void posaljiAdminAlert(
      "Osporeno postojanje deteta",
      `Roditelj: ${podaci?.dete.roditeljstvaKaoDete.map((v) => v.roditelj.pseudonim).join(" / ") ?? "?"}\n` +
        `Nalog deteta: ${podaci?.dete.pseudonim ?? "?"}\nObrazloženje: ${obrazlozenje}`
    );
  }
  return { ok: true };
}

/**
 * Istek roka od trideset dana (čl. 6 st. 3) — noćni posao.
 *
 * Licu koje se nije izjasnilo poništava se potvrda stvarnosti roditelja. Poništenje
 * ide kroz zatečeni postupak (`ponistiVerifikaciju`), koji ukida SVE zapise POEN-a
 * evidentirane povodom te potvrde — potvrđivačevih 1.000, roditeljevih 1.000 i
 * nadzornikovih 500 ako je ishod bio „uredno".
 *
 * 🔴 Zašto sve, a ne samo potvrđivačevih 1.000: ciklus poništi–ponovi bi inače kovao
 * roditelju po 1.000 POEN u svakom krugu, jer ponovljena potvrda emituje iznova.
 * Ovako je ciklus neutralan i poklapa se sa čl. 20a Pravilnika o dokazu stvarnosti.
 *
 * Slot se oslobađa (čl. 6 st. 3) — zatečeno poništenje to ne radi, jer je pisano za
 * utvrđenu lažnu verifikaciju, gde verifikator ne treba da dobije mesto nazad.
 *
 * Posao je idempotentan i nadoknađuje: obrađuje sve istekle zapise, ne samo današnje.
 */
export async function obradiIstekleRokove(sada: Date = new Date()) {
  const istekli = await prisma.roditeljstvoPotvrda.findMany({
    where: { status: "CEKA", rokDo: { lte: sada } },
    select: {
      id: true,
      potvrdjivacId: true,
      dete: {
        select: {
          id: true,
          roditeljstvaKaoDete: {
            select: { roditeljId: true, roditelj: { select: { pseudonim: true } } },
          },
        },
      },
    },
  });

  let ponisteno = 0;
  for (const zapis of istekli) {
    // Stanje se prvo pomera na ISTEKLA, uslovno — ako dva pokretanja posla trče
    // uporedo, drugi neće naći red u stanju CEKA i neće poništiti potvrdu dvaput.
    const rezervisano = await prisma.roditeljstvoPotvrda.updateMany({
      where: { id: zapis.id, status: "CEKA" },
      data: { status: "ISTEKLA", odgovorAt: sada },
    });
    if (rezervisano.count === 0) continue;

    // Izjašnjenje se traži povodom KONKRETNOG roditelja — onog čiju je stvarnost
    // potvrdio ovaj potvrđivač. Kod deteta sa dvoje roditelja to je onaj u čijem je
    // lancu potvrđivač; ako ih je više, padaju sve njegove potvrde tim roditeljima.
    for (const veza of zapis.dete.roditeljstvaKaoDete) {
      const vezaPotvrde = await prisma.verifikacionaVeza.findUnique({
        where: {
          verifikatorId_verifikovaniId: {
            verifikatorId: zapis.potvrdjivacId,
            verifikovaniId: veza.roditeljId,
          },
        },
        select: { id: true },
      });
      // Potvrda je u međuvremenu već pala nekim drugim putem — nema šta da se poništi.
      if (!vezaPotvrde) continue;

      await ponistiVerifikaciju(vezaPotvrde.id);
      await oslobodiSlot(zapis.potvrdjivacId);
      ponisteno += 1;

      await obavesti(zapis.potvrdjivacId, {
        tip: "roditeljstvo_istekla",
        kljuc: "notifikacije.roditeljstvo_istekla",
        parametri: { pseudonim: veza.roditelj.pseudonim },
        naslov: "Potvrda stvarnosti je poništena",
        tekst: `Nisi se izjasnio/la u roku od ${ROK_POTVRDE_DANA} dana, pa je tvoja potvrda stvarnosti korisnika ${veza.roditelj.pseudonim} poništena.`,
        link: "/verifikacija",
      }).catch(() => {});

      await obavesti(veza.roditeljId, {
        tip: "roditeljstvo_pala_potvrda",
        kljuc: "notifikacije.roditeljstvo_pala_potvrda",
        parametri: {},
        naslov: "Jedna potvrda tvoje stvarnosti je pala",
        tekst:
          "Neko ko te je potvrdio nije se izjasnio o postojanju tvog deteta u roku od 30 dana.",
        link: "/verifikacija",
      }).catch(() => {});
    }
  }

  return { pregledano: istekli.length, ponisteno };
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
