import { prisma } from "@/lib/prisma";
import { TransactionType, DoprinosOkidac } from "@/generated/prisma/client";
import { obavesti } from "@/lib/notifikacije";
import { probajEvidentirati } from "@/lib/protokol/doprinos-sadrzaju";
import { probajEvidentiratiKorake, probajNapredovati } from "@/lib/protokol/doprinos-razmeni";

/**
 * Izvršenje prepisa POEN-a između dva korisnička zapisa (Pravilnik čl. 14, 16).
 *
 * Izdvojeno iz `POST /api/transfer` kad je uveden prepis koji čeka odobrenje
 * roditelja (Pravilnik o učešću dece, čl. 14): isti posao tada kreće sa dva mesta
 * — iz rute, i iz odluke roditelja danima kasnije. Dve kopije bi se razišle, a
 * razlaz ovde znači pokvaren zero-sum ili izgubljen okidač kanala.
 *
 * 🔴 Ovde se NE proveravaju dozvole. Ko sme da prepiše kome (čl. 28 st. 2, čl. 12,
 * čl. 14), da li ima pokriće i da li je u nadoknadi — odlučuje pozivalac. Funkcija
 * radi samo ono što joj ime kaže i ATOMSKI: skidanje ide `updateMany` sa uslovom
 * `balance >= iznos`, pa dva paralelna prepisa ne mogu oba da prođu.
 */
export class PrepisGreska extends Error {}

export type StranaPrepisa = { id: string; pseudonim: string; walletId: string };

export async function izvrsiPrepis(
  posiljac: StranaPrepisa,
  primalac: StranaPrepisa,
  iznos: number,
  opis?: string | null
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const skinuto = await tx.wallet.updateMany({
      where: { id: posiljac.walletId, balance: { gte: iznos } },
      data: { balance: { decrement: iznos } },
    });
    if (skinuto.count !== 1) {
      // Stanje se u međuvremenu promenilo (paralelni prepis) — prekini ceo posao.
      throw new PrepisGreska("NEDOVOLJNO_SREDSTAVA");
    }
    await tx.wallet.update({
      where: { id: primalac.walletId },
      data: { balance: { increment: iznos } },
    });
    await tx.transaction.create({
      data: {
        fromWalletId: posiljac.walletId,
        toWalletId: primalac.walletId,
        amount: iznos,
        type: TransactionType.TRANSFER,
        description: opis?.trim() || null,
      },
    });
  });

  // Primljen POEN je jedan od dva okidača za evidentiranje doprinosa sadržaju
  // (čl. 40a st. 3). Zove se VAN transakcije — `emitujPoen()` otvara sopstvenu.
  // Ne baca: prenos je već upisan i ne sme da padne zbog ovog kanala.
  await probajEvidentirati(primalac.id, DoprinosOkidac.PRIMLJEN_POEN, posiljac.id);
  await probajEvidentiratiKorake(primalac.id);

  // Prepis pomera brojač putanje doprinosa razmeni OBEMA stranama.
  await probajNapredovati(posiljac.id);
  await probajNapredovati(primalac.id);

  // Iznos se NE formatira ovde: broj ide kao parametar, a razdvajač hiljada se
  // bira pri prikazu, po jeziku primaoca (sr 1.000 · en 1,000 · ru 1 000).
  await obavesti(primalac.id, {
    tip: "transfer_primljen",
    kljuc: opis ? "notifikacije.transfer_primljen_poruka" : "notifikacije.transfer_primljen",
    parametri: { iznos, pseudonim: posiljac.pseudonim, poruka: opis ?? "" },
    naslov: `Prepisano ti je ${iznos.toLocaleString("sr-RS")} POEN`,
    tekst: `Prepisano ti je ${iznos.toLocaleString("sr-RS")} POEN u tvoj zapis — od člana ${posiljac.pseudonim}.${opis ? ` Poruka: „${opis}"` : ""}`,
    link: "/novcanik",
  });
}
