import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionType, UserStatus } from "@/generated/prisma/client";

const BANKA_WALLET_ID = "banka-singleton";

/**
 * DELETE /api/profil
 * Korisnik zahteva brisanje naloga (čl. 17 ZZPL — pravo na zaborav).
 *
 * Body: { prenesPoen?: string } — pseudonim primaoca preostalih POEN-a (opciono)
 *
 * Tok:
 * 1. Prodaj sva slobodna ZRNA Banci (po trenutnom kursu, izvršava se odmah, ne noćni cron)
 * 2. Prenesi POEN balans po izboru korisnika ili Banci
 * 3. Anonimizuj lične podatke (email, punoIme, telefon, lokacija, avatar = null;
 *    pseudonim = "obrisani-korisnik-{id}"; passwordHash = null)
 * 4. Deaktiviraj nalog (deaktiviranAt = now, status = EXCLUDED)
 * 5. Zadržaj: transakcije, audit log, KrugBonusLog, Referral zapise
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const userId = session.user.id;

  // Pročitaj telo — opciono ime primaoca preostalih POEN-a
  let primalacPseudonim: string | undefined;
  try {
    const body = await req.json();
    primalacPseudonim = body?.prenesPoen?.trim() || undefined;
  } catch {
    // body nije obavezan
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      zrnoStanje: true,
      krugClanstva: { where: { leftAt: null } },
    },
  });

  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (user.status === UserStatus.EXCLUDED || user.deaktiviranAt) {
    return NextResponse.json({ error: "Nalog je već deaktiviran." }, { status: 409 });
  }

  // --- 1. Prodaj slobodna ZRNA odmah (ne čekaj noćni cron) ---
  const slobodnaZrna = user.zrnoStanje?.slobodno ?? 0;
  if (slobodnaZrna > 0) {
    const danasnji = await prisma.zrnoDailyRate.findFirst({ orderBy: { date: "desc" } });
    const kurs = danasnji ? Number(danasnji.kurs) : 1;
    const poenDobijeno = Math.floor(slobodnaZrna * kurs); // u korist Banke

    await prisma.$transaction(async (tx) => {
      // Ažuriraj ZRNO stanje
      await tx.zrnoStanje.update({
        where: { userId },
        data: { slobodno: 0 },
      });

      // POEN iz Banke na korisnika
      const bankaWallet = await tx.wallet.findUnique({ where: { id: BANKA_WALLET_ID } });
      if (!bankaWallet || !user.wallet) throw new Error("Wallet nije pronađen.");

      await tx.wallet.update({ where: { id: BANKA_WALLET_ID }, data: { balance: { decrement: poenDobijeno } } });
      await tx.wallet.update({ where: { userId }, data: { balance: { increment: poenDobijeno } } });
      await tx.transaction.create({
        data: {
          fromWalletId: BANKA_WALLET_ID,
          toWalletId: user.wallet.id,
          amount: poenDobijeno,
          type: TransactionType.PRODAJA_ZRNO,
          description: `Prodaja ${slobodnaZrna} ZRNA pri deaktivaciji naloga`,
        },
      });
    });
  }

  // --- 2. Prenesi POEN balans ---
  const svezWallet = await prisma.wallet.findUnique({ where: { userId } });
  const balans = svezWallet?.balance ?? 0;

  if (balans > 0) {
    if (primalacPseudonim) {
      // Prenesi zadatom korisniku
      const primalac = await prisma.user.findUnique({
        where: { pseudonim: primalacPseudonim },
        include: { wallet: true },
      });

      if (!primalac || !primalac.wallet) {
        return NextResponse.json({ error: "Primalac POEN-a nije pronađen." }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({ where: { userId }, data: { balance: 0 } });
        await tx.wallet.update({ where: { id: primalac.wallet!.id }, data: { balance: { increment: balans } } });
        await tx.transaction.create({
          data: {
            fromWalletId: svezWallet!.id,
            toWalletId: primalac.wallet!.id,
            amount: balans,
            type: TransactionType.TRANSFER,
            description: `Prenos pri deaktivaciji naloga`,
          },
        });
      });
    } else {
      // Vrati Banci
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({ where: { userId }, data: { balance: 0 } });
        await tx.wallet.update({ where: { id: BANKA_WALLET_ID }, data: { balance: { increment: balans } } });
        await tx.transaction.create({
          data: {
            fromWalletId: svezWallet!.id,
            toWalletId: BANKA_WALLET_ID,
            amount: balans,
            type: TransactionType.TRANSFER,
            description: `Povrat Banci pri deaktivaciji naloga`,
          },
        });
      });
    }
  }

  // --- 3. Napusti krug ako je krugar ---
  for (const m of user.krugClanstva) {
    await prisma.krugClanstvo.update({
      where: { id: m.id },
      data: { leftAt: new Date() },
    });
  }

  // --- 4. Anonimizuj i deaktiviraj u jednoj transakciji ---
  await prisma.$transaction(async (tx) => {
    // Anonimizuj lične podatke
    await tx.user.update({
      where: { id: userId },
      data: {
        email: null,
        passwordHash: null,
        pseudonim: `obrisani-korisnik-${userId.slice(0, 8)}`,
        telefon: null,
        location: null,
        avatar: null,
        oauthProvider: null,
        oauthId: null,
        status: UserStatus.EXCLUDED,
        deaktiviranAt: new Date(),
      },
    });

    // Anonimizuj UserPodaci
    await tx.userPodaci.updateMany({
      where: { userId },
      data: { punoIme: null, opis: null },
    });

    // NE brišemo VerificationRequest odmah — retencija 5 godina (cron job)
  });

  return NextResponse.json({ ok: true });
}
