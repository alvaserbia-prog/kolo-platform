import { prisma } from "@/lib/prisma";
import { TransactionType, UserStatus } from "@/generated/prisma/client";
import {
  POEN_NADZORNIK,
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
} from "./dokaz-stvarnosti";

const PROTOKOL_WALLET_ID = "banka-singleton";

export class LaznaVerifikacijaGreska extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type PonistavanjeRezultat = {
  pseudonim: string;
  poistenoVerifikacija: number;
  pogodjeniKorisnici: string[];
};

/**
 * Poništavanje lažne verifikacije sa rekurzivnom kaskadom
 * (Pravilnik o dokazu stvarnosti, čl. 18–21).
 *
 * Admin označava korisnika kao lažnog verifikatora. Posledice:
 *  - sve verifikacije koje je obavio se poništavaju (brišu se veze);
 *  - svaki korisnik kog je verifikovao gubi 10 p.p. indeksa — u ovom stablo-modelu
 *    (jedan verifikator po korisniku) to znači pad na 0%;
 *  - vraćaju se emitovani POEN-i: verifikator 1.000, verifikovani 1.000, nadzornik 500.
 *    Reverzija NIJE ograničena na stanje — u ovom jedinstvenom slučaju računi mogu
 *    da odu u minus (izuzetak od zabrane negativnog stanja). Zero-sum je očuvan jer je
 *    svaka reverzija tačan ogled emisije (korisnik −X, Protokol +X);
 *  - korisnik koji padne na 0% OSTAJE verifikovan (zadržava nalog, slanje/primanje
 *    POEN-a, Pijaca, donacije), ali gubi pristup operativnom doprinosu i programima
 *    podrške (indeks < 10%);
 *  - kaskada je rekurzivna: i verifikacije koje su pogođeni korisnici obavili se
 *    poništavaju po istom principu, sve dok se podstablo lažnog verifikatora ne isprazni;
 *  - sam lažni verifikator se isključuje.
 */
export async function ponistiLaznogVerifikatora(
  laznoVerifikatorId: string
): Promise<PonistavanjeRezultat> {
  const lazni = await prisma.user.findUnique({
    where: { id: laznoVerifikatorId },
    select: { id: true, pseudonim: true, role: true, status: true },
  });
  if (!lazni) throw new LaznaVerifikacijaGreska("Korisnik nije pronađen.", 404);
  if (lazni.role === "ADMIN")
    throw new LaznaVerifikacijaGreska("Ne može se označiti administrator.", 400);

  const pogodjeni: string[] = [];

  await prisma.$transaction(
    async (tx) => {
      // Uncapped reverzija — dozvoljen minus (jedini izuzetak, čl. 18).
      async function reverzija(targetUserId: string, iznos: number, opis: string) {
        if (iznos <= 0) return;
        const w = await tx.wallet.findUnique({ where: { userId: targetUserId } });
        if (!w) return;
        await tx.wallet.update({
          where: { id: w.id },
          data: { balance: { decrement: iznos } },
        });
        await tx.wallet.update({
          where: { id: PROTOKOL_WALLET_ID },
          data: { balance: { increment: iznos } },
        });
        await tx.transaction.create({
          data: {
            fromWalletId: w.id,
            toWalletId: PROTOKOL_WALLET_ID,
            amount: iznos,
            type: TransactionType.TRANSFER,
            description: opis,
          },
        });
      }

      // BFS preko obavljenih verifikacija; rekurzija kroz celo podstablo.
      const obradjeni = new Set<string>();
      const red: string[] = [laznoVerifikatorId];
      while (red.length > 0) {
        const verifikatorId = red.shift()!;
        if (obradjeni.has(verifikatorId)) continue;
        obradjeni.add(verifikatorId);

        const veze = await tx.verifikacionaVeza.findMany({
          where: { verifikatorId },
        });
        for (const v of veze) {
          await reverzija(
            v.verifikatorId,
            POEN_VERIFIKATOR,
            "Poništavanje lažne verifikacije — povrat POEN verifikatora (čl. 18)"
          );
          await reverzija(
            v.verifikovaniId,
            POEN_VERIFIKOVANI,
            "Poništavanje lažne verifikacije — povrat POEN verifikovanog (čl. 18)"
          );
          if (v.podlezeNadzoru && v.nadzornikId) {
            await reverzija(
              v.nadzornikId,
              POEN_NADZORNIK,
              "Poništavanje lažne verifikacije — povrat POEN nadzornika (čl. 18)"
            );
          }
          // Verifikovani gubi jedinu verifikaciju → indeks 0; ostaje verifikovan.
          await tx.user.update({
            where: { id: v.verifikovaniId },
            data: { indeksStvarnosti: 0, slotoviPotroseni: 0 },
          });
          pogodjeni.push(v.verifikovaniId);
          red.push(v.verifikovaniId);
        }
        await tx.verifikacionaVeza.deleteMany({ where: { verifikatorId } });
      }

      // Lažni verifikator: isključenje + reset indeksa/slotova.
      await tx.user.update({
        where: { id: laznoVerifikatorId },
        data: {
          status: UserStatus.EXCLUDED,
          suspendedAt: new Date(),
          suspendedReason:
            "Lažna verifikacija (Pravilnik o dokazu stvarnosti, čl. 18)",
          indeksStvarnosti: 0,
          slotoviPotroseni: 0,
        },
      });
    },
    { timeout: 30000 }
  );

  return {
    pseudonim: lazni.pseudonim,
    poistenoVerifikacija: pogodjeni.length,
    pogodjeniKorisnici: pogodjeni,
  };
}
