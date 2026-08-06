/**
 * Servis za nadzor verifikacija (Pravilnik o dokazu stvarnosti v3.5.0, čl. 10–11).
 *
 * Nadzornik (POCETNI ili NOSILAC_ZRNA) potvrđuje verifikaciju koju je obavio REGULARNI;
 * dopunjava potrošeni slot verifikatora i prima 500 POEN.
 *
 * Pattern: DB promene u prisma.$transaction, emitujPoen() VAN nje.
 */
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "@/lib/protokol/emisija";
import { POEN_NADZORNIK } from "@/lib/protokol/dokaz-stvarnosti";
import { TransactionType } from "@/generated/prisma/client";
import { mozeNadzor } from "@/lib/dozvole";

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
  verifikatorPseudonim: string;
  verifikovaniPseudonim: string;
  nadzornikId: string;
  nadzornikPseudonim: string;
};

/**
 * Nadzornik potvrđuje verifikaciju, dopuni slot verifikatora, prima 500 POEN.
 */
export async function obaviNadzor(input: {
  verifikacijaId: string;
  nadzornikId: string;
}): Promise<ObaviNadzorRezultat> {
  const { verifikacijaId, nadzornikId } = input;

  const { verifikatorPseudonim, verifikovaniPseudonim, nadzornikPseudonim } =
    await prisma.$transaction(async (tx) => {
      const veza = await tx.verifikacionaVeza.findUnique({
        where: { id: verifikacijaId },
        include: {
          verifikator: { select: { id: true, pseudonim: true, tipKorisnika: true } },
          verifikovani: { select: { pseudonim: true } },
        },
      });
      if (!veza) {
        throw new NadzorGreska("Verifikacija ne postoji.", 404);
      }
      if (!veza.podlezeNadzoru) {
        throw new NadzorGreska(
          "Ova verifikacija ne podleže nadzoru (čl. 10 Pravilnika).",
          400
        );
      }
      if (veza.nadzornikId) {
        throw new NadzorGreska("Verifikacija je već nadzirana.", 409);
      }
      if (veza.verifikator.id === nadzornikId) {
        throw new NadzorGreska(
          "Ne možeš da nadziraš svoju sopstvenu verifikaciju.",
          400
        );
      }

      const nadzornik = await tx.user.findUnique({
        where: { id: nadzornikId },
        select: { id: true, pseudonim: true, tipKorisnika: true },
      });
      if (!nadzornik) {
        throw new NadzorGreska("Nadzornik ne postoji.", 404);
      }
      if (!mozeNadzor(nadzornik)) {
        throw new NadzorGreska(
          "Nemaš ovlašćenje za nadzor (samo nosioci ZRNA i UO, čl. 10).",
          403
        );
      }

      // DB promene
      await tx.verifikacionaVeza.update({
        where: { id: verifikacijaId },
        data: { nadzornikId, nadzoranAt: new Date() },
      });
      // Dopuni slot verifikatora (max(0, -1))
      await tx.user.update({
        where: { id: veza.verifikatorId },
        data: { slotoviPotroseni: { decrement: 1 } },
      });
      // Safety: ne dozvoli negativan slotoviPotroseni
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

      return {
        verifikatorPseudonim: veza.verifikator.pseudonim,
        verifikovaniPseudonim: veza.verifikovani.pseudonim,
        nadzornikPseudonim: nadzornik.pseudonim,
      };
    });

  // Faza 2: POEN emisija za nadzornika — VAN transakcije
  const nadzornikWallet = await prisma.wallet.findUnique({
    where: { userId: nadzornikId },
  });
  if (nadzornikWallet) {
    try {
      await emitujPoen(
        nadzornikWallet.id,
        POEN_NADZORNIK,
        TransactionType.EMISIJA_NADZOR,
        `Nadzor verifikacije ${verifikatorPseudonim} → ${verifikovaniPseudonim}`
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

  return {
    verifikacijaId,
    verifikatorPseudonim,
    verifikovaniPseudonim,
    nadzornikId,
    nadzornikPseudonim,
  };
}

/**
 * Lista verifikacija koje čekaju nadzor (osim svojih sopstvenih).
 */
export async function listajVerifikacijeZaNadzor(nadzornikId: string) {
  return prisma.verifikacionaVeza.findMany({
    where: {
      podlezeNadzoru: true,
      nadzornikId: null,
      verifikatorId: { not: nadzornikId },
    },
    orderBy: { vremenskiZig: "asc" },
    include: {
      verifikator: { select: { id: true, pseudonim: true, slotoviPotroseni: true } },
      verifikovani: { select: { id: true, pseudonim: true } },
    },
  });
}

/**
 * Broj verifikacija koje čekaju nadzor (za badge u sidebar-u).
 */
export async function brojVerifikacijaZaNadzor(nadzornikId: string): Promise<number> {
  return prisma.verifikacionaVeza.count({
    where: {
      podlezeNadzoru: true,
      nadzornikId: null,
      verifikatorId: { not: nadzornikId },
    },
  });
}
