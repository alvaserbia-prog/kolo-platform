/**
 * Modul Deca — servisne funkcije (Pravilnik o Modulu Deca, prva verzija).
 *
 * Re-eksportuje čista pravila iz `src/lib/deca-pravila.ts`, pa server ima jedan
 * ulaz. Pretraživač uvozi pravila neposredno — ovaj modul povlači Prisma klijent.
 *
 * ─── Šta prva verzija namerno NEMA ──────────────────────────────────────────
 *
 * Nema poziva roditelju: nalog otvara isključivo roditelj iz svog naloga (čl. 4),
 * pa nema ni roka od sedam dana, ni rezervacije pseudonima, ni ekrana čekanja.
 * Nema drugog roditelja, uzrasnih grupa ni odredbe o punoletstvu. Sve to su
 * proširenja koja idu izmenom pravilnika, ne prećutnim dopunama koda.
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
  ROK_POTVRDE_DANA,
  jeUMirovanju,
  rokIzjasnjenja,
  uzrast,
  uzrastZaModul,
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

/** Polja koja opisuju maloletni nalog. 🔴 Jedino mesto koje ih upisuje. */
export function poljaDeteta(datumRodjenja: Date, roditeljId: string) {
  return { datumRodjenja, maloletan: true, roditeljId };
}

/** Izbor polja dovoljan da se od korisnika napravi `Ucesnik`. */
export const IZBOR_UCESNIKA = {
  id: true,
  maloletan: true,
  dozvolaOdrasli: true,
  roditeljId: true,
} as const;

/** Učitava najmanji oblik korisnika potreban za odluke ovog modula. */
export async function ucitajUcesnika(userId: string): Promise<Ucesnik | null> {
  return prisma.user.findUnique({ where: { id: userId }, select: IZBOR_UCESNIKA });
}

/**
 * Da li nalog miruje (čl. 16) — sam nalog ako je maloletan i njegov roditelj više
 * nije potvrđen, ili roditeljski nalog kome je potvrda pala.
 *
 * Izvodi se pri čitanju, ne čuva se u koloni: stanje zavisi od indeksa roditelja,
 * koji se menja poništenjem potvrde na nekom sasvim drugom mestu u sistemu. Kolona
 * bi značila da postoji drugi izvor iste istine i da neko mora da ga održava.
 */
export async function uMirovanju(userId: string): Promise<boolean> {
  const izbor = {
    verified: true,
    indeksStvarnosti: true,
    deaktiviranAt: true,
    status: true,
  } as const;
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { maloletan: true, ...izbor, roditelj: { select: izbor } },
  });
  if (!u) return false;
  const merodavan = u.maloletan ? u.roditelj : u;
  // Maloletni nalog bez roditelja nema pravni osnov obrade — miruje dok se ne
  // uspostavi. Isto važi kad roditelj ugasi svoj nalog: dete ostaje, ali stoji.
  if (!merodavan) return true;
  if (merodavan.deaktiviranAt || merodavan.status !== UserStatus.ACTIVE) return true;
  return jeUMirovanju(merodavan, FUNKCIONALNI_PRAG_INDEKSA);
}

/**
 * Baca ako nalog miruje (čl. 16). Zove se u rutama koje stvaraju sadržaj ili
 * pomeraju zapise — objava oglasa, prepis POEN-a, poruke.
 *
 * 🟡 Mirovanje nije `UserStatus`, pa ga osvežavanje JWT tokena ne hvata samo od sebe
 * kao suspenziju. Zato se proverava u samim rutama, a ne oslanja na sesiju.
 */
export async function zaustaviAkoMiruje(userId: string) {
  if (await uMirovanju(userId)) {
    throw new DecaGreska(
      "Nalog miruje dok stvarnost roditelja ne bude ponovo potvrđena. Ništa nije obrisano.",
      403
    );
  }
}

/**
 * Prodavac čiji nalog NE miruje (čl. 16).
 *
 * Tri grane, jer mirovanje pogađa i roditelja i dete: punoletan bez dece mirovanje
 * ne dodiruje; punoletan roditelj miruje kad mu potvrda padne ispod praga; maloletni
 * miruje kad padne njegovom roditelju.
 */
export const USLOV_PRODAVAC_NE_MIRUJE = {
  OR: [
    { maloletan: false, deca: { none: {} } },
    {
      maloletan: false,
      deca: { some: {} },
      verified: true,
      indeksStvarnosti: { gte: FUNKCIONALNI_PRAG_INDEKSA },
    },
    {
      maloletan: true,
      roditelj: { is: { verified: true, indeksStvarnosti: { gte: FUNKCIONALNI_PRAG_INDEKSA } } },
    },
  ],
};

/**
 * Uslov nad prodavcem koji sprovodi vidljivost oglasa iz čl. 13.
 *
 * 🔴 Gost NIKADA ne vidi oglas maloletnog korisnika, i to je jedini deo koji važi
 * bez obzira na prekidač modula — cena mu je nula, a cena propuštanja je izlaganje
 * deteta.
 */
export function usloviVidljivostiOglasa(posmatrac: Ucesnik | null) {
  if (!posmatrac) return { AND: [USLOV_PRODAVAC_NE_MIRUJE, { maloletan: false }] };

  if (posmatrac.maloletan) {
    return {
      AND: [
        USLOV_PRODAVAC_NE_MIRUJE,
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
      USLOV_PRODAVAC_NE_MIRUJE,
      {
        OR: [
          { maloletan: false },
          { maloletan: true, dozvolaOdrasli: true },
          // Sopstveno dete roditelj vidi i kad je prekidač isključen.
          { maloletan: true, roditeljId: posmatrac.id },
        ],
      },
    ],
  };
}

// ── Otvaranje naloga (čl. 4–6) ────────────────────────────────────────────────

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
 * Nalog je aktivan od trenutka otvaranja — zaštita je naknadna i sastoji se u tome
 * što potvrđivači roditelja imaju trideset dana da potvrde postojanje deteta, a
 * onaj ko ćuti gubi sopstvenu potvrdu stvarnosti tog roditelja.
 *
 * Sve u JEDNOJ transakciji: nalog, zapis u Protokolu i redovi potvrde nastaju
 * zajedno ili nikako. Nalog bez redova potvrde bio bi nalog bez ijedne provere.
 */
export async function otvoriNalogDeteta(ulaz: OtvaranjeUlaz) {
  const roditelj = await prisma.user.findUnique({
    where: { id: ulaz.roditeljId },
    select: {
      id: true,
      pseudonim: true,
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
        ...poljaDeteta(ulaz.datumRodjenja, roditelj.id),
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
        `Uzrast deteta: ${godine} godina.`,
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

/** Provera da je nalog upravo dete tog roditelja; baca ako nije. */
export async function mojeDeteIliBaci(roditeljId: string, deteId: string) {
  const dete = await prisma.user.findUnique({
    where: { id: deteId },
    select: { id: true, pseudonim: true, maloletan: true, roditeljId: true, deaktiviranAt: true },
  });
  if (!dete || !dete.maloletan || dete.roditeljId !== roditeljId || dete.deaktiviranAt) {
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
 * Uklanjanje oglasa deteta (čl. 10 st. 1) — jedino ovlašćenje uklanjanja koje
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
 * Razgovori deteta — roditelj ih čita (čl. 9).
 *
 * 🔴 Roditelj SAMO ČITA. Ne piše u detetov razgovor, i to nije propust: sa druge
 * strane je drugo dete, a odnos deteta i punoletnog korisnika otvara isključivo
 * prekidač iz čl. 10, koji daje TUĐI roditelj. Kad bi roditelj mogao da se ubaci u
 * razgovor, obraćao bi se tuđem detetu bez saglasnosti njegovog roditelja.
 *
 * 🟡 Uvid dodiruje i drugu stranu: poruke drugog deteta čita neko ko u razgovoru
 * ne učestvuje. Zato deca u svom prostoru moraju biti obaveštena da roditelj vidi
 * razgovore — obaveštenje stoji uz same poruke, ne u sitnim slovima.
 */
export async function dohvatiRazgovoreDeteta(roditeljId: string, deteId: string) {
  const dete = await mojeDeteIliBaci(roditeljId, deteId);

  const konverzacije = await prisma.konverzacija.findMany({
    where: { OR: [{ user1Id: dete.id }, { user2Id: dete.id }] },
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

  await prisma.$transaction(async (tx) => {
    const w = await tx.wallet.findUnique({ where: { userId: dete.id } });
    const balans = w?.balance ?? 0;
    if (w && balans > 0) {
      await tx.wallet.update({ where: { id: w.id }, data: { balance: 0 } });
      await tx.wallet.update({
        where: { id: PROTOKOL_WALLET_ID },
        data: { balance: { increment: balans } },
      });
      await tx.transaction.create({
        data: {
          fromWalletId: w.id,
          toWalletId: PROTOKOL_WALLET_ID,
          amount: balans,
          type: TransactionType.TRANSFER,
          description: "Poništavanje POEN-a pri brisanju naloga deteta (Modul Deca, čl. 17)",
        },
      });
    }

    await tx.marketplaceListing.updateMany({
      where: { sellerId: dete.id, uklonjenAt: null },
      data: {
        uklonjenAt: new Date(),
        uklonioId: roditeljId,
        uklonjenRazlog: "Brisanje naloga deteta (Modul Deca, čl. 17)",
        status: "UKLONJEN",
      },
    });

    // Postupak potvrde gubi predmet — zapisi koji još čekaju se brišu, a oni koji
    // su okončani (potvrđeni, osporeni, istekli) padaju uz sam nalog kaskadno.
    await tx.roditeljstvoPotvrda.deleteMany({ where: { deteId: dete.id, status: "CEKA" } });

    await tx.verifikacijaToken.deleteMany({ where: { korisnikId: dete.id } });
    await tx.passwordResetToken.deleteMany({ where: { userId: dete.id } });
    await tx.aktivnostLog.deleteMany({ where: { userId: dete.id } });
    await tx.pseudonimIstorija.deleteMany({ where: { userId: dete.id } });

    await tx.user.update({
      where: { id: dete.id },
      data: {
        email: null,
        passwordHash: null,
        ...poljaPseudonima(`obrisani-korisnik-${dete.id.slice(0, 8)}`),
        telefon: null,
        location: null,
        avatar: null,
        datumRodjenja: null,
        maloletan: false,
        roditeljId: null,
        dozvolaOdrasli: false,
        status: UserStatus.EXCLUDED,
        deaktiviranAt: new Date(),
      },
    });
  });

  return { ok: true, pseudonim: dete.pseudonim };
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
      dete: { select: { datumRodjenja: true, roditelj: { select: { pseudonim: true } } } },
    },
  });
  const danas = beogradskiDan();
  return redovi
    .filter((r) => r.dete.datumRodjenja && r.dete.roditelj)
    .map((r) => ({
      id: r.id,
      roditelj: r.dete.roditelj!.pseudonim,
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
      select: { dete: { select: { pseudonim: true, roditelj: { select: { pseudonim: true } } } } },
    });
    // O osporavanju odlučuje Upravni odbor (čl. 6 st. 6).
    const { posaljiAdminAlert } = await import("@/lib/adminAlert");
    void posaljiAdminAlert(
      "Osporeno postojanje deteta",
      `Roditelj: ${podaci?.dete.roditelj?.pseudonim ?? "?"}\nNalog deteta: ${podaci?.dete.pseudonim ?? "?"}\nObrazloženje: ${obrazlozenje}`
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
      dete: { select: { id: true, roditeljId: true, roditelj: { select: { pseudonim: true } } } },
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

    const roditeljId = zapis.dete.roditeljId;
    if (!roditeljId) continue;

    const veza = await prisma.verifikacionaVeza.findUnique({
      where: {
        verifikatorId_verifikovaniId: {
          verifikatorId: zapis.potvrdjivacId,
          verifikovaniId: roditeljId,
        },
      },
      select: { id: true },
    });
    // Potvrda je u međuvremenu već pala nekim drugim putem — nema šta da se poništi.
    if (!veza) continue;

    await ponistiVerifikaciju(veza.id);
    await oslobodiSlot(zapis.potvrdjivacId);
    ponisteno += 1;

    await obavesti(zapis.potvrdjivacId, {
      tip: "roditeljstvo_istekla",
      kljuc: "notifikacije.roditeljstvo_istekla",
      parametri: { pseudonim: zapis.dete.roditelj?.pseudonim ?? "" },
      naslov: "Potvrda stvarnosti je poništena",
      tekst: `Nisi se izjasnio/la u roku od ${ROK_POTVRDE_DANA} dana, pa je tvoja potvrda stvarnosti korisnika ${zapis.dete.roditelj?.pseudonim ?? ""} poništena.`,
      link: "/verifikacija",
    }).catch(() => {});

    await obavesti(roditeljId, {
      tip: "roditeljstvo_pala_potvrda",
      kljuc: "notifikacije.roditeljstvo_pala_potvrda",
      parametri: {},
      naslov: "Jedna potvrda tvoje stvarnosti je pala",
      tekst: "Neko ko te je potvrdio nije se izjasnio o postojanju tvog deteta u roku od 30 dana.",
      link: "/verifikacija",
    }).catch(() => {});
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

/** Spisak dece sa stanjem postupka potvrde — za odeljak „Moja deca" u profilu. */
export async function dohvatiDecu(roditeljId: string) {
  const deca = await prisma.user.findMany({
    where: { roditeljId, maloletan: true, deaktiviranAt: null },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      pseudonim: true,
      avatar: true,
      datumRodjenja: true,
      dozvolaOdrasli: true,
      wallet: { select: { balance: true } },
      potvrdeRoditeljstvaZaMene: { select: { status: true, rokDo: true } },
    },
  });
  const danas = beogradskiDan();
  return deca.map((d) => {
    const potvrde = d.potvrdeRoditeljstvaZaMene;
    const cekaju = potvrde.filter((p) => p.status === "CEKA");
    const rokDo = cekaju.length > 0
      ? cekaju.reduce((min, p) => (p.rokDo < min ? p.rokDo : min), cekaju[0].rokDo)
      : null;
    return {
      id: d.id,
      pseudonim: d.pseudonim,
      avatar: d.avatar,
      godine: d.datumRodjenja ? uzrast(d.datumRodjenja, danas) : null,
      dozvolaOdrasli: d.dozvolaOdrasli,
      balans: d.wallet?.balance ?? 0,
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
