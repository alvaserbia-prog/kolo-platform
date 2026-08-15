import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";
import { obavesti } from "@/lib/notifikacije";
import { logAdminAkcija } from "@/lib/audit";
import { iznosZaVracanje, ponistenjePotpuno } from "@/lib/razmena-prijava";

export * from "@/lib/razmena-prijava";

/**
 * Odlučivanje o prijavi neispunjene razmene (servisne funkcije — sa Prismom).
 * Čista pravila su u `src/lib/razmena-prijava.ts` i odatle se re-eksportuju, pa
 * server ima jedan ulaz.
 *
 * Poništenje ide PROTIVZAPISOM tipa `PONISTENJE_PREPISA`, ne brisanjem reda:
 *  - istorija se ne prepravlja (isti obrazac kao pri prestanku statusa, čl. 34);
 *  - zaseban tip, ne TRANSFER, jer brojač putanje doprinosa razmeni (čl. 40b)
 *    čita transakcije tipa TRANSFER — povraćaj upisan kao TRANSFER bi lažno
 *    otvorio korak 2 onome kome je prepis poništen.
 *
 * Zero-sum ostaje netaknut: POEN se seli između dva korisnička zapisa, Protokol
 * se ne pomera.
 */

export type IshodOdluke =
  | { ok: true; vraceno: number; potpuno: boolean }
  | { ok: false; razlog: string };

/**
 * Poništi prepis po prijavi.
 *
 * Vraća najviše ono što na zapisu primaoca zatekne — njegov zapis ne sme u minus
 * (Pravilnik čl. 14; jedini izuzetak je nadoknada iz čl. 20b i ne proširuje se).
 * Zato ishod ume da bude i delimičan, i nikakav: `vraceno` se upisuje u prijavu
 * i javlja obema stranama, da odluka ne izgleda kao pun povraćaj kad nije.
 */
export async function ponistiPrepis(
  prijavaId: string,
  adminId: string,
  odluka: string,
): Promise<IshodOdluke> {
  const prijava = await prisma.prijavaRazmene.findUnique({
    where: { id: prijavaId },
    include: {
      transakcija: true,
      prijavioc: { select: { id: true, pseudonim: true, wallet: { select: { id: true } } } },
      protiv: { select: { id: true, pseudonim: true, wallet: { select: { id: true, balance: true } } } },
    },
  });

  if (!prijava) return { ok: false, razlog: "Prijava ne postoji." };
  if (prijava.status !== "OTVORENA") return { ok: false, razlog: "O prijavi je već odlučeno." };
  if (!prijava.prijavioc.wallet || !prijava.protiv.wallet)
    return { ok: false, razlog: "Jedna od strana nema zapis u Protokolu." };

  const iznos = prijava.transakcija.amount;
  const vraceno = iznosZaVracanje(iznos, prijava.protiv.wallet.balance);
  const potpuno = ponistenjePotpuno(iznos, vraceno);

  try {
    await prisma.$transaction(async (tx) => {
      if (vraceno > 0) {
        // Uslovni `updateMany` (kao u `/api/transfer`): ako je primalac u
        // međuvremenu potrošio POEN, ceo posao pada umesto da ode u minus.
        const skinuto = await tx.wallet.updateMany({
          where: { id: prijava.protiv.wallet!.id, balance: { gte: vraceno } },
          data: { balance: { decrement: vraceno } },
        });
        if (skinuto.count !== 1) throw new Error("STANJE_SE_PROMENILO");

        await tx.wallet.update({
          where: { id: prijava.prijavioc.wallet!.id },
          data: { balance: { increment: vraceno } },
        });

        await tx.transaction.create({
          data: {
            fromWalletId: prijava.protiv.wallet!.id,
            toWalletId: prijava.prijavioc.wallet!.id,
            amount: vraceno,
            type: TransactionType.PONISTENJE_PREPISA,
            description: `Poništen prepis po prijavi Fondaciji${potpuno ? "" : " (delimično — na zapisu nije bilo ceo iznos)"}`,
          },
        });
      }

      const zatvoreno = await tx.prijavaRazmene.updateMany({
        where: { id: prijavaId, status: "OTVORENA" },
        data: { status: "PONISTENA", odluka, resioId: adminId, resenAt: new Date(), vraceno },
      });
      if (zatvoreno.count !== 1) throw new Error("VEC_RESENA");
    });
  } catch (e) {
    if (e instanceof Error && e.message === "STANJE_SE_PROMENILO")
      return { ok: false, razlog: "Stanje primaoca se u međuvremenu promenilo. Pokušaj ponovo." };
    if (e instanceof Error && e.message === "VEC_RESENA")
      return { ok: false, razlog: "O prijavi je već odlučeno." };
    throw e;
  }

  // Obaveštenja i audit — van transakcije, ne obaraju odluku ako padnu.
  await obavesti(prijava.prijaviocId, {
    tip: "prijava_razmene",
    kljuc: "notifikacije.prijava_razmene_ponistena",
    parametri: { iznos: vraceno, pseudonim: prijava.protiv.pseudonim, odluka },
    naslov: vraceno > 0 ? `Vraćeno ti je ${vraceno.toLocaleString("sr-RS")} POEN` : "Prepis je poništen",
    tekst:
      vraceno > 0
        ? `Fondacija je poništila prepis ka ${prijava.protiv.pseudonim}. Vraćeno: ${vraceno.toLocaleString("sr-RS")} POEN${potpuno ? "" : " (na zapisu nije bilo ceo iznos)"}. Obrazloženje: ${odluka}`
        : `Fondacija je poništila prepis ka ${prijava.protiv.pseudonim}, ali na njegovom zapisu nije bilo POEN-a za vraćanje. Obrazloženje: ${odluka}`,
    link: "/novcanik",
  });

  await obavesti(prijava.protivId, {
    tip: "prijava_razmene",
    kljuc: "notifikacije.prijava_razmene_oduzeto",
    parametri: { iznos: vraceno, pseudonim: prijava.prijavioc.pseudonim, odluka },
    naslov: "Prepis je poništen",
    tekst: `Fondacija je po prijavi poništila prepis od ${prijava.prijavioc.pseudonim}. Sa tvog zapisa je vraćeno ${vraceno.toLocaleString("sr-RS")} POEN. Obrazloženje: ${odluka}`,
    link: "/novcanik",
  });

  await logAdminAkcija(
    adminId,
    "PREPIS_PONISTEN",
    prijava.protivId,
    `prijava ${prijavaId}, prepis ${prijava.transakcijaId}, iznos ${iznos}, vraćeno ${vraceno}; razlog: ${odluka}`,
  );

  return { ok: true, vraceno, potpuno };
}

/**
 * Odbaci prijavu — prepis ostaje kakav jeste.
 *
 * Obrazloženje je obavezno i ide prijaviocu: odluka bez razloga je za čoveka
 * isto što i ćutanje (isti zahtev kao pri uklanjanju oglasa, Uslovi čl. 25 st. 2).
 */
export async function odbaciPrijavu(
  prijavaId: string,
  adminId: string,
  odluka: string,
): Promise<IshodOdluke> {
  const prijava = await prisma.prijavaRazmene.findUnique({
    where: { id: prijavaId },
    select: { id: true, status: true, prijaviocId: true, transakcijaId: true },
  });
  if (!prijava) return { ok: false, razlog: "Prijava ne postoji." };
  if (prijava.status !== "OTVORENA") return { ok: false, razlog: "O prijavi je već odlučeno." };

  const zatvoreno = await prisma.prijavaRazmene.updateMany({
    where: { id: prijavaId, status: "OTVORENA" },
    data: { status: "ODBACENA", odluka, resioId: adminId, resenAt: new Date(), vraceno: 0 },
  });
  if (zatvoreno.count !== 1) return { ok: false, razlog: "O prijavi je već odlučeno." };

  await obavesti(prijava.prijaviocId, {
    tip: "prijava_razmene",
    kljuc: "notifikacije.prijava_razmene_odbacena",
    parametri: { odluka },
    naslov: "Prijava razmene je razmotrena",
    tekst: `Fondacija je razmotrila tvoju prijavu i prepis ostaje. Obrazloženje: ${odluka}`,
    link: "/novcanik",
  });

  await logAdminAkcija(
    adminId,
    "PRIJAVA_RAZMENE_ODBACENA",
    prijava.prijaviocId,
    `prijava ${prijavaId}, prepis ${prijava.transakcijaId}; razlog: ${odluka}`,
  );

  return { ok: true, vraceno: 0, potpuno: false };
}
