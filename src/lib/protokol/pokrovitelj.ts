import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";

/**
 * Fiksna tabela 7 nivoa pokrovitelja.
 * Nivo se dostiže kad kumulativni RSD doprinos pređe prag.
 * Nivo 1: prvi doprinos (kumulativ >= 10.000 RSD) → 20.000 POEN
 */
const NIVOI_POKROVITELJA: { pragRsd: number; bonusPoen: number }[] = [
  { pragRsd: 10_000, bonusPoen: 20_000 },
  { pragRsd: 20_000, bonusPoen: 30_000 },
  { pragRsd: 50_000, bonusPoen: 80_000 },
  { pragRsd: 100_000, bonusPoen: 150_000 },
  { pragRsd: 200_000, bonusPoen: 300_000 },
  { pragRsd: 500_000, bonusPoen: 800_000 },
  { pragRsd: 1_000_000, bonusPoen: 1_500_000 },
];

export function bonusZaNivo(nivo: number): number {
  if (nivo <= 0 || nivo > NIVOI_POKROVITELJA.length) return 0;
  return NIVOI_POKROVITELJA[nivo - 1].bonusPoen;
}

/**
 * Izračunaj koji je novi nivo na osnovu kumulativa RSD.
 * kumulativRsd je broj (float).
 */
export function izracunajNivo(kumulativRsd: number, trenutniNivo: number): number {
  let dostignuti = 0;
  for (const nivo of NIVOI_POKROVITELJA) {
    if (kumulativRsd >= nivo.pragRsd) {
      dostignuti++;
    } else {
      break;
    }
  }
  return Math.max(dostignuti, trenutniNivo);
}

/**
 * Evidentira doprinos pokrovitelja i emituje bonus POEN vlasniku
 * za svaki novi nivo koji je dostignut.
 */
export async function evidentirajDoprinos(params: {
  pokroviteljId: string;
  rsdIznos: number;
  tip: "SPONZORSTVO_KRUGA" | "DONACIJA_FONDACIJI";
  evidentiraoId: string;
  napomena?: string;
}) {
  const { pokroviteljId, rsdIznos, tip, evidentiraoId, napomena } = params;

  // Korak 1: DB transakcija
  const { noviNivoi, vlasnikWalletId } = await prisma.$transaction(async (tx) => {
    const pokrovitelj = await tx.pokrovitelj.findUniqueOrThrow({
      where: { id: pokroviteljId },
      include: { vlasnik: { include: { wallet: true } } },
    });

    const stariKumulativ = Number(pokrovitelj.rsdKumulativ);
    const noviKumulativ = stariKumulativ + rsdIznos;
    const stariNivo = pokrovitelj.trenutniNivo;

    // Nivo 1 se dostiže prvim doprinosom
    let bazniNivo = stariNivo;
    if (stariNivo === 0) {
      bazniNivo = 1;
    }

    const izracunatiNivo = izracunajNivo(noviKumulativ, bazniNivo);

    await tx.pokroviteljDoprinos.create({
      data: {
        pokroviteljId,
        rsdIznos: rsdIznos,
        tip,
        evidentiraoId,
        napomena,
      },
    });

    await tx.pokrovitelj.update({
      where: { id: pokroviteljId },
      data: {
        rsdKumulativ: noviKumulativ,
        trenutniNivo: izracunatiNivo,
      },
    });

    const noviNivoi: { nivo: number; bonusPoen: number; bonusId: string }[] = [];
    for (let n = stariNivo + 1; n <= izracunatiNivo; n++) {
      const bonusPoen = bonusZaNivo(n);
      if (bonusPoen > 0) {
        const bonus = await tx.pokroviteljBonusEmisija.create({
          data: {
            pokroviteljId,
            vlasnikId: pokrovitelj.vlasnikId,
            nivo: n,
            bonusPoen,
          },
        });
        noviNivoi.push({ nivo: n, bonusPoen, bonusId: bonus.id });
      }
    }

    return {
      noviNivoi,
      vlasnikWalletId: pokrovitelj.vlasnik.wallet!.id,
    };
  });

  // Korak 2: Emituj bonus POEN za dostignute nivoe
  const bonusiZbir = noviNivoi.reduce((s, n) => s + n.bonusPoen, 0);

  if (bonusiZbir > 0) {
    const { transaction } = await emitujPoen(
      vlasnikWalletId,
      bonusiZbir,
      "EMISIJA_POKROVITELJ",
      `Bonus za pokroviteljstvo iznos ${bonusiZbir.toLocaleString("sr-RS")}`
    );

    // Poveži sve bonus zapise sa istom transakcijom
    for (const { bonusId } of noviNivoi) {
      await prisma.pokroviteljBonusEmisija.update({
        where: { id: bonusId },
        data: { transactionId: transaction.id },
      });
    }
  }

  return { noviNivoi };
}
