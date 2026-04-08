import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { TransactionType } from "@/generated/prisma/client";

// Čl. 38 — pragovi rasta zadruge
const BONUS_PRAGOVI = [
  { clanovi: 10,  poen: 100_000 },
  { clanovi: 20,  poen: 200_000 },
  { clanovi: 50,  poen: 500_000 },
  { clanovi: 100, poen: 1_000_000 },
  { clanovi: 200, poen: 2_000_000 },
  { clanovi: 500, poen: 5_000_000 },
];

/**
 * Proveri da li je dostignut novi prag i emituj bonus ako jeste.
 * Poziva se posle svakog novog odobrenog članstva.
 */
export async function proveriIEmitujBonusPrag(zadrugaId: string) {
  const zadruga = await prisma.zadruga.findUnique({
    where: { id: zadrugaId },
    include: { wallet: true },
  });
  if (!zadruga?.wallet) return;

  const brojClanova = await prisma.zadrugaMembership.count({
    where: { zadrugaId, leftAt: null },
  });

  for (const prag of BONUS_PRAGOVI) {
    if (brojClanova !== prag.clanovi) continue;

    // Proveri da li je ovaj prag već isplaćen
    const vec = await prisma.zadrugaBonusLog.findFirst({
      where: { zadrugaId, threshold: prag.clanovi },
    });
    if (vec) continue;

    await emitujPoen(
      zadruga.wallet.id,
      prag.poen,
      TransactionType.EMISIJA_ZADRUGA_BONUS,
      `Bonus zadruge "${zadruga.name}" — ${prag.clanovi} članova`
    );

    await prisma.zadrugaBonusLog.create({
      data: { zadrugaId, threshold: prag.clanovi, amount: prag.poen },
    });
  }
}
