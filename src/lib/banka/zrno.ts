import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

export const UKUPNO_ZRNA = 1_000_000;
export const BANKA_WALLET_ID = "banka-singleton";

// ── Računanje ─────────────────────────────────────────────────────────────────

export function glasackaMoc(aktivno: number): number {
  if (aktivno <= 0) return 0;
  return Math.floor(Math.sqrt(aktivno));
}

export async function trendsKurs(): Promise<number> {
  // Kurs = |banka_balance| / zrnaUBanci
  const banka = await prisma.wallet.findUnique({
    where: { id: BANKA_WALLET_ID },
    select: { balance: true },
  });
  const bankaBalance = Math.abs(banka?.balance ?? 0);
  if (bankaBalance === 0) return 1;

  const ukupnoKodKorisnika = await prisma.zrnoStanje.aggregate({
    _sum: { slobodno: true, aktivno: true },
  });
  const kodKorisnika = (ukupnoKodKorisnika._sum.slobodno ?? 0) + (ukupnoKodKorisnika._sum.aktivno ?? 0);
  const zrnaUBanci = UKUPNO_ZRNA - kodKorisnika;
  if (zrnaUBanci <= 0) return bankaBalance; // edge case

  return bankaBalance / zrnaUBanci;
}

export async function poslednjiKurs(): Promise<number> {
  const rate = await prisma.zrnoDailyRate.findFirst({ orderBy: { date: "desc" } });
  if (rate) return Number(rate.kurs);
  return await trendsKurs();
}

// ── Noćna obrada ZRNO operacija ───────────────────────────────────────────────

export async function izvrsiZrnoOperacije(datum: Date) {
  const danas = new Date(datum);
  danas.setHours(0, 0, 0, 0);

  // 1. Izračunaj kurs za danas
  const banka = await prisma.wallet.findUnique({
    where: { id: BANKA_WALLET_ID },
    select: { balance: true },
  });
  const bankaBalance = Math.abs(banka?.balance ?? 0);

  const ukupnoKodKorisnika = await prisma.zrnoStanje.aggregate({
    _sum: { slobodno: true, aktivno: true },
  });
  const kodKorisnika = (ukupnoKodKorisnika._sum.slobodno ?? 0) + (ukupnoKodKorisnika._sum.aktivno ?? 0);
  const zrnaUBanci = UKUPNO_ZRNA - kodKorisnika;
  const kurs = bankaBalance > 0 && zrnaUBanci > 0 ? bankaBalance / zrnaUBanci : 1;

  // Sačuvaj kurs
  await prisma.zrnoDailyRate.upsert({
    where: { date: danas },
    create: { date: danas, kurs: kurs.toFixed(2), bankaMinus: bankaBalance, zrnaUBanci },
    update: { kurs: kurs.toFixed(2), bankaMinus: bankaBalance, zrnaUBanci },
  });

  // 2. Obradi kupovine
  const kupovine = await prisma.zrnoKupovinaZahtev.findMany({
    where: { date: danas, status: "PENDING" },
    include: { user: { include: { wallet: true, zrnoStanje: true } } },
  });

  for (const z of kupovine) {
    try {
      if (!z.user.wallet) { await cancel(z.id, "kupovina"); continue; }
      const walletBalance = z.user.wallet.balance;

      // Proveri minimalni balans
      if (walletBalance < 10_000) { await cancel(z.id, "kupovina"); continue; }

      // Proveri limit (1% balansa)
      const maxPoen = Math.floor(walletBalance * 0.01);
      const poenZaTrosak = Math.min(z.poenIznos, maxPoen);

      // Zaokruži
      const zrnaDobija = Math.floor(poenZaTrosak / kurs);
      if (zrnaDobija <= 0) { await cancel(z.id, "kupovina"); continue; }
      const poenPlaceno = Math.ceil(zrnaDobija * kurs);

      // Proveri da ima dovoljno slobodnih ZRNA u Banci
      const slobodnoUBanci = UKUPNO_ZRNA - kodKorisnika;
      if (zrnaDobija > slobodnoUBanci) { await cancel(z.id, "kupovina"); continue; }

      await prisma.$transaction(async (tx) => {
        // POEN: user → Banka (reverse emission)
        await tx.wallet.update({ where: { id: z.user.wallet!.id }, data: { balance: { decrement: poenPlaceno } } });
        await tx.wallet.update({ where: { id: BANKA_WALLET_ID }, data: { balance: { increment: poenPlaceno } } });
        await tx.transaction.create({ data: {
          fromWalletId: z.user.wallet!.id,
          toWalletId: BANKA_WALLET_ID,
          amount: poenPlaceno,
          type: TransactionType.KUPOVINA_ZRNO,
          description: `Kupovina ${zrnaDobija} ZRNA po kursu ${kurs.toFixed(2)}`,
        }});

        // ZRNO: Banka → user
        await tx.zrnoStanje.upsert({
          where: { userId: z.userId },
          create: { userId: z.userId, slobodno: zrnaDobija, aktivno: 0 },
          update: { slobodno: { increment: zrnaDobija } },
        });

        await tx.zrnoKupovinaZahtev.update({
          where: { id: z.id },
          data: { status: "EXECUTED", zrnaKupljeno: zrnaDobija, poenPlaceno },
        });
      });
    } catch (err) {
      console.error(`Greška pri kupovini ZRNA za ${z.userId}:`, err);
      await cancel(z.id, "kupovina");
    }
  }

  // 3. Obradi prodaje
  const prodaje = await prisma.zrnoProdajaZahtev.findMany({
    where: { date: danas, status: "PENDING" },
    include: { user: { include: { wallet: true, zrnoStanje: true } } },
  });

  for (const z of prodaje) {
    try {
      if (!z.user.wallet || !z.user.zrnoStanje) { await cancel(z.id, "prodaja"); continue; }
      if (z.user.zrnoStanje.slobodno < z.kolicina) { await cancel(z.id, "prodaja"); continue; }

      const poenDobijeno = Math.floor(z.kolicina * kurs);
      if (poenDobijeno <= 0) { await cancel(z.id, "prodaja"); continue; }

      await prisma.$transaction(async (tx) => {
        // POEN: Banka → user
        await tx.wallet.update({ where: { id: BANKA_WALLET_ID }, data: { balance: { decrement: poenDobijeno } } });
        await tx.wallet.update({ where: { id: z.user.wallet!.id }, data: { balance: { increment: poenDobijeno } } });
        await tx.transaction.create({ data: {
          fromWalletId: BANKA_WALLET_ID,
          toWalletId: z.user.wallet!.id,
          amount: poenDobijeno,
          type: TransactionType.PRODAJA_ZRNO,
          description: `Prodaja ${z.kolicina} ZRNA po kursu ${kurs.toFixed(2)}`,
        }});

        // ZRNO: user → Banka
        await tx.zrnoStanje.update({
          where: { userId: z.userId },
          data: { slobodno: { decrement: z.kolicina } },
        });

        await tx.zrnoProdajaZahtev.update({
          where: { id: z.id },
          data: { status: "EXECUTED", poenDobijeno },
        });
      });
    } catch (err) {
      console.error(`Greška pri prodaji ZRNA za ${z.userId}:`, err);
      await cancel(z.id, "prodaja");
    }
  }

  // 4. Obradi promene statusa
  const statusZahtevi = await prisma.zrnoStatusZahtev.findMany({
    where: { date: danas, status: "PENDING" },
    include: { user: { include: { zrnoStanje: true } } },
  });

  for (const z of statusZahtevi) {
    try {
      if (!z.user.zrnoStanje) { await cancelStatus(z.id); continue; }
      const st = z.user.zrnoStanje;

      if (z.akcija === "ZAKLJUCAJ") {
        if (st.slobodno < z.kolicina) { await cancelStatus(z.id); continue; }
        await prisma.zrnoStanje.update({
          where: { userId: z.userId },
          data: { slobodno: { decrement: z.kolicina }, aktivno: { increment: z.kolicina } },
        });
      } else {
        if (st.aktivno < z.kolicina) { await cancelStatus(z.id); continue; }
        await prisma.zrnoStanje.update({
          where: { userId: z.userId },
          data: { aktivno: { decrement: z.kolicina }, slobodno: { increment: z.kolicina } },
        });
      }

      await prisma.zrnoStatusZahtev.update({ where: { id: z.id }, data: { status: "EXECUTED" } });
    } catch (err) {
      console.error(`Greška pri promeni statusa ZRNA za ${z.userId}:`, err);
      await cancelStatus(z.id);
    }
  }

  // 5. Aktiviraj pending delegacije
  await prisma.zrnoDelegacija.updateMany({
    where: { aktivna: false },
    data: { aktivna: true },
  });

  return { kurs, zrnaUBanci, obradjenihKupovina: kupovine.length, obradjenihProdaja: prodaje.length };
}

async function cancel(id: string, tip: "kupovina" | "prodaja") {
  if (tip === "kupovina") {
    await prisma.zrnoKupovinaZahtev.update({ where: { id }, data: { status: "CANCELLED" } });
  } else {
    await prisma.zrnoProdajaZahtev.update({ where: { id }, data: { status: "CANCELLED" } });
  }
}

async function cancelStatus(id: string) {
  await prisma.zrnoStatusZahtev.update({ where: { id }, data: { status: "CANCELLED" } });
}

// ── Glasačka moć sa delegacijom ───────────────────────────────────────────────

export async function izracunajGlasove(userId: string): Promise<number> {
  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId } });
  const sopstveni = glasackaMoc(stanje?.aktivno ?? 0);

  // Dodaj delegirane glasove
  const delegacije = await prisma.zrnoDelegacija.findMany({
    where: { delegatId: userId, aktivna: true },
    include: { delegator: { include: { zrnoStanje: true } } },
  });

  const delegirani = delegacije.reduce((sum, d) => {
    return sum + glasackaMoc(d.delegator.zrnoStanje?.aktivno ?? 0);
  }, 0);

  return sopstveni + delegirani;
}
