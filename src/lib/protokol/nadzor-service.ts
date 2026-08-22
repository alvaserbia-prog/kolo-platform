/**
 * Servis za nadzor verifikacija (Pravilnik o dokazu stvarnosti 4.2.0, čl. 10, 11, 11a).
 *
 * Nadzornik (svaki nosilac ZRNA) proverava verifikaciju koju je obavio REGULARNI i
 * evidentira ISHOD: uredno / za proveru / sporno.
 *
 * Tri stvari koje su se promenile u 4.2.0 i lako se slučajno vrate:
 *  1. Nadzor ima glas. Ranije je postojalo samo „potvrdi" ili ćutanje, pa ko posumnja
 *     nije dobijao ništa i nije ostavljao trag — podsticaj je gurao ka propuštanju.
 *  2. 500 POEN-a ide PRVOM nadzorniku koji evidentira ishod, bez obzira koji je.
 *     Drugi (kome je zapis prosleđen po „za proveru") ne dobija ništa — inače bi se
 *     isplatilo lančano dodavati nadzornike.
 *  3. Slot kapaciteta verifikatora dopunjava SAMO ishod „uredno". Roka za nadzor
 *     nema (odluka vlasnika 2026-08-09) — zapis bez ishoda čeka koliko treba.
 *
 * Pattern: DB promene u prisma.$transaction, emitujPoen() VAN nje.
 */
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "@/lib/protokol/emisija";
import { POEN_NADZORNIK } from "@/lib/protokol/dokaz-stvarnosti";
import { TransactionType } from "@/generated/prisma/client";
import { mozeNadzor } from "@/lib/dozvole";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import {
  type Ishod,
  type Subjekt,
  type Razlog,
  jeSumnja,
  dopunjavaSlot,
  validirajIshod,
} from "@/lib/nadzor-pravila";

export {
  RAZLOZI,
  SUBJEKTI,
  ISHODI,
  jeSumnja,
  dopunjavaSlot,
  validirajIshod,
} from "@/lib/nadzor-pravila";
export type { Ishod, Subjekt, Razlog } from "@/lib/nadzor-pravila";

export class NadzorGreska extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "NadzorGreska";
  }
}

export type ObaviNadzorRezultat = {
  verifikacijaId: string;
  ishod: Ishod;
  verifikatorPseudonim: string;
  verifikovaniPseudonim: string;
  nadzornikId: string;
  nadzornikPseudonim: string;
  /** Da li je ovaj nadzornik prvi po ovoj verifikaciji — samo prvi prima POEN-e. */
  prviIshod: boolean;
  /** Da li je ovim ishodom otvoren ili ažuriran nadzorni predmet (čl. 11a). */
  predmetOtvoren: boolean;
};

/**
 * Nadzornik evidentira ishod nadzora nad verifikacijom.
 */
export async function obaviNadzor(input: {
  verifikacijaId: string;
  nadzornikId: string;
  ishod: Ishod;
  subjekt?: Subjekt | null;
  razlog?: Razlog | null;
  opis?: string | null;
}): Promise<ObaviNadzorRezultat> {
  const { verifikacijaId, nadzornikId, ishod } = input;

  const validacija = validirajIshod({
    ishod,
    subjekt: input.subjekt,
    razlog: input.razlog,
    opis: input.opis,
  });
  if (!validacija.ok) throw new NadzorGreska(validacija.poruka, 400);

  // Uz „uredno" se obrazloženje ne traži i eventualno poslata polja se odbacuju —
  // da se sumnja ne bi upisala uz ishod koji je ne izražava.
  const sumnja = jeSumnja(ishod);
  const subjekt = sumnja ? (input.subjekt as Subjekt) : null;
  const razlog = sumnja ? (input.razlog as Razlog) : null;
  const opis = sumnja ? (input.opis?.trim() || null) : null;

  const {
    verifikatorPseudonim,
    verifikovaniPseudonim,
    nadzornikPseudonim,
    prviIshod,
  } = await prisma.$transaction(async (tx) => {
    const veza = await tx.verifikacionaVeza.findUnique({
      where: { id: verifikacijaId },
      include: {
        verifikator: { select: { id: true, pseudonim: true } },
        verifikovani: { select: { id: true, pseudonim: true } },
      },
    });
    if (!veza) {
      throw new NadzorGreska("Potvrda ne postoji.", 404);
    }
    if (!veza.podlezeNadzoru) {
      throw new NadzorGreska(
        "Ova potvrda ne podleže nadzoru (čl. 10 Pravilnika).",
        400
      );
    }
    if (veza.nadzorIshod === "UREDNO") {
      throw new NadzorGreska("Nadzor nad ovom potvrdom je okončan.", 409);
    }
    // Čl. 10 st. 4: nadzor ne može da obavlja onaj ko je u verifikaciji učestvovao —
    // ni kao verifikator ni kao verifikovani. Do 4.2.0 je bila pokrivena samo prva
    // strana, pa je nadzornik mogao da „nadzire" verifikaciju u kojoj je on meta.
    if (veza.verifikatorId === nadzornikId || veza.verifikovaniId === nadzornikId) {
      throw new NadzorGreska(
        "Ne možeš da nadziraš potvrdu u kojoj si i sam učestvovao.",
        400
      );
    }

    const nadzornik = await tx.user.findUnique({
      where: { id: nadzornikId },
      select: { id: true, pseudonim: true, tipKorisnika: true, admin: true },
    });
    if (!nadzornik) {
      throw new NadzorGreska("Nadzornik ne postoji.", 404);
    }
    if (!mozeNadzor(nadzornik)) {
      throw new NadzorGreska(
        "Nemaš ovlašćenje za nadzor (samo nosioci ZRNA, čl. 10).",
        403
      );
    }

    // Isti nadzornik ne sme dvaput nad istim zapisom (čl. 10 st. 4). Jedinstveni
    // indeks u bazi je poslednja brana; ovo je da poruka bude razumljiva.
    const vecGledao = await tx.nadzorZapis.findUnique({
      where: { verifikacijaId_nadzornikId: { verifikacijaId, nadzornikId } },
      select: { id: true },
    });
    if (vecGledao) {
      throw new NadzorGreska("Već si evidentirao ishod nad ovom potvrdom.", 409);
    }

    const dosadasnjih = await tx.nadzorZapis.count({ where: { verifikacijaId } });
    const prvi = dosadasnjih === 0;

    await tx.nadzorZapis.create({
      data: {
        verifikacijaId,
        nadzornikId,
        ishod,
        subjekt,
        razlog,
        opis,
        poenEvidentiran: prvi,
      },
    });

    await tx.verifikacionaVeza.update({
      where: { id: verifikacijaId },
      data: { nadzornikId, nadzoranAt: new Date(), nadzorIshod: ishod },
    });

    if (dopunjavaSlot(ishod)) {
      await tx.user.update({
        where: { id: veza.verifikatorId },
        data: { slotoviPotroseni: { decrement: 1 } },
      });
      // Safety: ne dozvoli negativan slotoviPotroseni.
      const azurirani = await tx.user.findUnique({
        where: { id: veza.verifikatorId },
        select: { slotoviPotroseni: true },
      });
      if (azurirani && azurirani.slotoviPotroseni < 0) {
        await tx.user.update({
          where: { id: veza.verifikatorId },
          data: { slotoviPotroseni: 0 },
        });
      }
    }

    if (sumnja) {
      // Jedan predmet po verifikaciji (čl. 11a st. 1): drugi nadzornik koji doda
      // ishod ažurira postojeći umesto da otvori drugi. Predmet koji je UO već
      // rešio se NE vraća u OTVOREN — status se dira samo pri kreiranju.
      await tx.nadzorniPredmet.upsert({
        where: { verifikacijaId },
        create: {
          verifikacijaId,
          subjekt: subjekt!,
          razlog: razlog!,
          opis,
        },
        update: { subjekt: subjekt!, razlog: razlog!, opis },
      });
    }

    return {
      verifikatorPseudonim: veza.verifikator.pseudonim,
      verifikovaniPseudonim: veza.verifikovani.pseudonim,
      nadzornikPseudonim: nadzornik.pseudonim,
      prviIshod: prvi,
    };
  });

  // POEN emisija za nadzornika — VAN transakcije, i samo za prvog (čl. 7 st. 2).
  // Evidentira se RAD, ne saglasnost: i „sporno" se plaća isto kao „uredno".
  if (prviIshod) {
    const nadzornikWallet = await prisma.wallet.findUnique({
      where: { userId: nadzornikId },
    });
    if (nadzornikWallet) {
      try {
        await emitujPoen(
          nadzornikWallet.id,
          POEN_NADZORNIK,
          TransactionType.EMISIJA_NADZOR,
          `Nadzor verifikacije ${verifikatorPseudonim} → ${verifikovaniPseudonim}`,
          {
            kljuc: "transakcije.nadzor",
            parametri: {
              verifikator: verifikatorPseudonim,
              verifikovani: verifikovaniPseudonim,
            },
          }
        );
      } catch (e) {
        console.error("[nadzor-service] POEN emisija pukla — incident", {
          verifikacijaId,
          nadzornikId,
          error: e,
        });
      }
    } else {
      console.warn("[nadzor-service] Nadzornik nema wallet — preskačem POEN emisiju", {
        nadzornikId,
      });
    }
  }

  if (ishod === "SPORNO") {
    // Ne blokira odgovor i ne baca — obaveštenje, ne mera.
    void posaljiAdminAlert(
      "Sporna verifikacija",
      `Nadzornik ${nadzornikPseudonim} označio je kao SPORNU verifikaciju ` +
        `${verifikatorPseudonim} → ${verifikovaniPseudonim} (razlog: ${razlog}). ` +
        `Predmet čeka odluku u admin panelu → Odluke.`
    ).catch(() => {});
  }

  return {
    verifikacijaId,
    ishod,
    verifikatorPseudonim,
    verifikovaniPseudonim,
    nadzornikId,
    nadzornikPseudonim,
    prviIshod,
    predmetOtvoren: sumnja,
  };
}

/**
 * Uslov „čeka nadzor" za datog nadzornika.
 *
 * Zapis izlazi sa spiska tek kad neko evidentira „uredno" — dok stoji „za proveru"
 * ostaje vidljiv OSTALIM nadzornicima, jer je poziv da još neko pogleda (čl. 11).
 * Sopstvene verifikacije se ne prikazuju, ni sa jedne strane (čl. 10 st. 4).
 */
function uslovZaNadzor(nadzornikId: string) {
  return {
    podlezeNadzoru: true,
    verifikatorId: { not: nadzornikId },
    verifikovaniId: { not: nadzornikId },
    nadzorZapisi: { none: { nadzornikId } },
    // Eksplicitan OR umesto `not: "UREDNO"` — ponašanje `not` nad nullable kolonom
    // se razlikuje među verzijama Prisme, a ovde bi tiho sakrilo sve nenadzirane.
    OR: [
      { nadzorIshod: null },
      { nadzorIshod: { in: ["ZA_PROVERU" as const, "SPORNO" as const] } },
    ],
  };
}

/**
 * Lista verifikacija koje čekaju nadzor (osim onih u kojima je nadzornik učestvovao).
 */
export async function listajVerifikacijeZaNadzor(nadzornikId: string) {
  return prisma.verifikacionaVeza.findMany({
    where: uslovZaNadzor(nadzornikId),
    orderBy: { vremenskiZig: "asc" },
    include: {
      verifikator: { select: { id: true, pseudonim: true, slotoviPotroseni: true } },
      verifikovani: { select: { id: true, pseudonim: true } },
      nadzorZapisi: {
        select: { id: true, ishod: true, razlog: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/**
 * Broj verifikacija koje čekaju nadzor (za badge u sidebar-u).
 */
export async function brojVerifikacijaZaNadzor(nadzornikId: string): Promise<number> {
  return prisma.verifikacionaVeza.count({ where: uslovZaNadzor(nadzornikId) });
}
