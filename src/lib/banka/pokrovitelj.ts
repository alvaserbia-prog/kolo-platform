import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";

/**
 * Generator nivoa po 1-2-5 skali (bez gornje granice).
 * Nivo 1: prvi doprinos (bilo koji pozitivan iznos) → 20.000 POEN
 * Nivo 2+: pragovi u RSD → iznos praga u POEN
 *
 * Pragovi: 50k, 100k, 200k, 500k, 1M, 2M, 5M, 10M, 20M, 50M, 100M, ...
 */
function* generatorPragova(): Generator<number> {
  const faktori = [1, 2, 5];
  let eksponent = 4; // 10^4 = 10_000 → × faktori daje 50k, 100k, ...
  let i = 1; // kreće od faktori[1] = 2 → 50_000
  while (true) {
    const baza = Math.pow(10, eksponent);
    yield faktori[i] * baza;
    i++;
    if (i >= faktori.length) {
      i = 0;
      eksponent++;
    }
  }
}

function pragZaNivo(nivo: number): number {
  if (nivo <= 1) return 0;
  const gen = generatorPragova();
  let prag = 0;
  for (let i = 2; i <= nivo; i++) {
    prag = gen.next().value as number;
  }
  return prag;
}

export function bonusZaNivo(nivo: number): number {
  if (nivo <= 0) return 0;
  if (nivo === 1) return 20_000;
  return pragZaNivo(nivo);
}

/**
 * Izračunaj koji je novi nivo na osnovu kumulativa RSD.
 * kumulativRsd je broj (float).
 */
export function izracunajNivo(kumulativRsd: number, trenutniNivo: number): number {
  const gen = generatorPragova();
  // Nivo 1 = dostignut prvim doprinosom (uvek >= 1 ako ima ikakvog kumulativa)
  // Nivo 2 = kumulativ >= 50.000 RSD, itd.
  let dostignuti = 1;
  for (;;) {
    const prag = gen.next().value as number;
    if (kumulativRsd >= prag) {
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
  tip: "SPONZORSTVO_ZADRUGE" | "DONACIJA_FONDACIJI";
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

  // Korak 2: Emituj POEN za svaki novi nivo (van transakcije)
  for (const { nivo, bonusPoen, bonusId } of noviNivoi) {
    const { transaction } = await emitujPoen(
      vlasnikWalletId,
      bonusPoen,
      "EMISIJA_POKROVITELJ",
      `Pokroviteljski bonus — nivo ${nivo}`
    );

    await prisma.pokroviteljBonusEmisija.update({
      where: { id: bonusId },
      data: { transactionId: transaction.id },
    });
  }

  return { noviNivoi };
}
