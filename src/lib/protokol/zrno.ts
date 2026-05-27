import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

export const UKUPNO_ZRNA = 1_000_000;
export const PROTOKOL_WALLET_ID = "banka-singleton";

// Pravilnik v3.7.0, čl. 19: upis ZRNA pretpostavlja minimum od 20.000 evidentiranih POEN-a
export const MINIMUM_POEN_ZA_UPIS_ZRNA = 20_000;

// ── Računanje ─────────────────────────────────────────────────────────────────

export function glasackaMoc(aktivno: number): number {
  if (aktivno <= 0) return 0;
  return Math.floor(Math.sqrt(aktivno));
}

export async function trendsKurs(): Promise<number> {
  // Kurs = |protokol_balance| / zrnaUProtokolu
  const protokol = await prisma.wallet.findUnique({
    where: { id: PROTOKOL_WALLET_ID },
    select: { balance: true },
  });
  const protokolBalance = Math.abs(protokol?.balance ?? 0);
  if (protokolBalance === 0) return 1;

  const ukupnoKodKorisnika = await prisma.zrnoStanje.aggregate({
    _sum: { slobodno: true, aktivno: true },
  });
  const kodKorisnika = (ukupnoKodKorisnika._sum.slobodno ?? 0) + (ukupnoKodKorisnika._sum.aktivno ?? 0);
  const zrnaUProtokolu = UKUPNO_ZRNA - kodKorisnika;
  if (zrnaUProtokolu <= 0) return protokolBalance; // edge case

  return protokolBalance / zrnaUProtokolu;
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
  const protokol = await prisma.wallet.findUnique({
    where: { id: PROTOKOL_WALLET_ID },
    select: { balance: true },
  });
  const protokolBalance = Math.abs(protokol?.balance ?? 0);

  const ukupnoKodKorisnika = await prisma.zrnoStanje.aggregate({
    _sum: { slobodno: true, aktivno: true },
  });
  const kodKorisnika = (ukupnoKodKorisnika._sum.slobodno ?? 0) + (ukupnoKodKorisnika._sum.aktivno ?? 0);
  const zrnaUProtokolu = UKUPNO_ZRNA - kodKorisnika;
  const kurs = protokolBalance > 0 && zrnaUProtokolu > 0 ? protokolBalance / zrnaUProtokolu : 1;

  // Sačuvaj kurs
  await prisma.zrnoDailyRate.upsert({
    where: { date: danas },
    create: { date: danas, kurs: kurs.toFixed(2), protokolMinus: protokolBalance, zrnaUProtokolu: zrnaUProtokolu },
    update: { kurs: kurs.toFixed(2), protokolMinus: protokolBalance, zrnaUProtokolu: zrnaUProtokolu },
  });

  // 2. Obradi upise
  const upisi = await prisma.zrnoUpisZahtev.findMany({
    where: { date: danas, status: "PENDING" },
    include: { user: { include: { wallet: true, zrnoStanje: true } } },
  });

  for (const z of upisi) {
    try {
      if (!z.user.wallet) { await cancel(z.id, "upis"); continue; }
      const walletBalance = z.user.wallet.balance;

      // Proveri minimalni balans
      if (walletBalance < MINIMUM_POEN_ZA_UPIS_ZRNA) { await cancel(z.id, "upis"); continue; }

      // Proveri limit (1% balansa)
      const maxPoen = Math.floor(walletBalance * 0.01);
      const poenZaTrosak = Math.min(z.poenIznos, maxPoen);

      // Zaokruži
      const zrnaDobija = Math.floor(poenZaTrosak / kurs);
      if (zrnaDobija <= 0) { await cancel(z.id, "upis"); continue; }
      const poenPlaceno = Math.ceil(zrnaDobija * kurs);

      // Proveri da ima dovoljno slobodnih ZRNA u Protokolu
      const slobodnoUProtokolu = UKUPNO_ZRNA - kodKorisnika;
      if (zrnaDobija > slobodnoUProtokolu) { await cancel(z.id, "upis"); continue; }

      await prisma.$transaction(async (tx) => {
        // POEN: user → Protokol (reverse emission)
        await tx.wallet.update({ where: { id: z.user.wallet!.id }, data: { balance: { decrement: poenPlaceno } } });
        await tx.wallet.update({ where: { id: PROTOKOL_WALLET_ID }, data: { balance: { increment: poenPlaceno } } });
        await tx.transaction.create({ data: {
          fromWalletId: z.user.wallet!.id,
          toWalletId: PROTOKOL_WALLET_ID,
          amount: poenPlaceno,
          type: TransactionType.UPIS_ZRNO,
          description: `Upis ${zrnaDobija} ZRNA po kursu ${kurs.toFixed(2)}`,
        }});

        // ZRNO: Protokol → user
        await tx.zrnoStanje.upsert({
          where: { userId: z.userId },
          create: { userId: z.userId, slobodno: zrnaDobija, aktivno: 0 },
          update: { slobodno: { increment: zrnaDobija } },
        });

        await tx.zrnoUpisZahtev.update({
          where: { id: z.id },
          data: { status: "EXECUTED", zrnaKupljeno: zrnaDobija, poenPlaceno },
        });
      });
    } catch (err) {
      console.error(`Greška pri upisu ZRNA za ${z.userId}:`, err);
      await cancel(z.id, "upis");
    }
  }

  // 3. Obradi otpise
  const otpisi = await prisma.zrnoOtpisZahtev.findMany({
    where: { date: danas, status: "PENDING" },
    include: { user: { include: { wallet: true, zrnoStanje: true } } },
  });

  for (const z of otpisi) {
    try {
      if (!z.user.wallet || !z.user.zrnoStanje) { await cancel(z.id, "otpis"); continue; }
      if (z.user.zrnoStanje.slobodno < z.kolicina) { await cancel(z.id, "otpis"); continue; }

      const poenDobijeno = Math.floor(z.kolicina * kurs);
      if (poenDobijeno <= 0) { await cancel(z.id, "otpis"); continue; }

      await prisma.$transaction(async (tx) => {
        // POEN: Protokol → user
        await tx.wallet.update({ where: { id: PROTOKOL_WALLET_ID }, data: { balance: { decrement: poenDobijeno } } });
        await tx.wallet.update({ where: { id: z.user.wallet!.id }, data: { balance: { increment: poenDobijeno } } });
        await tx.transaction.create({ data: {
          fromWalletId: PROTOKOL_WALLET_ID,
          toWalletId: z.user.wallet!.id,
          amount: poenDobijeno,
          type: TransactionType.OTPIS_ZRNO,
          description: `Otpis ${z.kolicina} ZRNA po kursu ${kurs.toFixed(2)}`,
        }});

        // ZRNO: user → Protokol
        await tx.zrnoStanje.update({
          where: { userId: z.userId },
          data: { slobodno: { decrement: z.kolicina } },
        });

        await tx.zrnoOtpisZahtev.update({
          where: { id: z.id },
          data: { status: "EXECUTED", poenDobijeno },
        });
      });
    } catch (err) {
      console.error(`Greška pri otpisu ZRNA za ${z.userId}:`, err);
      await cancel(z.id, "otpis");
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

  // 5. Primeni zakazane promene delegiranja (delegacija i opoziv stupaju na snagu u ponoć)
  const zakazane = await prisma.zrnoDelegacija.findMany({ where: { imaZakazano: true } });
  for (const d of zakazane) {
    if (!d.zakazaniDelegatId) {
      // Zakazan opoziv → ukloni delegaciju
      await prisma.zrnoDelegacija.delete({ where: { id: d.id } });
    } else {
      await prisma.zrnoDelegacija.update({
        where: { id: d.id },
        data: { delegatId: d.zakazaniDelegatId, zakazaniDelegatId: null, imaZakazano: false },
      });
    }
  }

  return { kurs, zrnaUProtokolu, obradjenihUpisa: upisi.length, obradjenihOtpisa: otpisi.length };
}

async function cancel(id: string, tip: "upis" | "otpis") {
  if (tip === "upis") {
    await prisma.zrnoUpisZahtev.update({ where: { id }, data: { status: "CANCELLED" } });
  } else {
    await prisma.zrnoOtpisZahtev.update({ where: { id }, data: { status: "CANCELLED" } });
  }
}

async function cancelStatus(id: string) {
  await prisma.zrnoStatusZahtev.update({ where: { id }, data: { status: "CANCELLED" } });
}

// ── Glasačka moć sa delegacijom ───────────────────────────────────────────────

/**
 * Glasačka moć korisnika sa tranzitivnim (beskonačnim) lancem delegiranja.
 *
 * Pravila (Pravilnik o KOLO sistemu, Glava VII):
 * - Ko je delegirao svoje glasove, nema sopstvenu glasačku moć (preneo ju je).
 * - Lanac delegiranja je beskonačan: moć delegatora teče do terminalnog delegata
 *   (onaj koji sam nije delegirao).
 * - Ako se lanac zatvori u krug, niko u tom krugu (ni oni koji su u njega
 *   delegirali) nema pravo glasa.
 *
 * Računa se nad VAŽEĆIM delegacijama (delegatId != null). Zakazane promene
 * (imaZakazano) stupaju na snagu tek u ponoć i ne utiču na trenutni obračun.
 */
/**
 * Čista funkcija razrešavanja glasačke moći nad grafom delegiranja.
 * `next`: delegator → delegat (samo važeće delegacije). `baza`: userId → sopstvena
 * kvadratna moć. Vraća ukupnu moć kojom `userId` glasa.
 *  - ako je `userId` delegirao (ima izlaznu vezu) → 0;
 *  - inače: sopstvena moć + moć svih čiji se lanac (tranzitivno) završava na njemu;
 *  - lanci koji upadnu u krug ne doprinose nikome (krug = nevažeći).
 */
export function razresiGlasackuMoc(
  next: Map<string, string>,
  baza: Map<string, number>,
  userId: string
): number {
  if (next.has(userId)) return 0;

  const resolve = (h: string): string | null => {
    const seen = new Set<string>();
    let cur = h;
    while (next.has(cur)) {
      if (seen.has(cur)) return null; // krug → nevažeće
      seen.add(cur);
      cur = next.get(cur)!;
    }
    return cur;
  };

  let total = baza.get(userId) ?? 0;
  for (const delegator of next.keys()) {
    if (delegator !== userId && resolve(delegator) === userId) {
      total += baza.get(delegator) ?? 0;
    }
  }
  return total;
}

export async function izracunajGlasove(userId: string): Promise<number> {
  const sve = await prisma.zrnoDelegacija.findMany({
    where: { delegatId: { not: null } },
    select: { delegatorId: true, delegatId: true },
  });
  const next = new Map<string, string>();
  for (const d of sve) next.set(d.delegatorId, d.delegatId!);

  if (next.has(userId)) return 0;

  // Kandidati za doprinos: userId + svi delegatori (lanac može da se završi na userId).
  const ids = [...new Set<string>([userId, ...next.keys()])];
  const stanja = await prisma.zrnoStanje.findMany({
    where: { userId: { in: ids } },
    select: { userId: true, aktivno: true },
  });
  const baza = new Map<string, number>();
  for (const s of stanja) baza.set(s.userId, glasackaMoc(s.aktivno));

  return razresiGlasackuMoc(next, baza, userId);
}
