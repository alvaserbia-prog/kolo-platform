import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitujPoen, preporukaNagrada } from "@/lib/protokol/emisija";
import { TransactionType } from "@/generated/prisma/client";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/korisnici/[id]/rucna-verifikacija
// Ručna verifikacija korisnika — admin je video dokument lično
// Body: { jmbg: string }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { id: userId } = await params;
  const body = await req.json();
  const jmbg = (body.jmbg ?? "").trim();

  if (!jmbg || jmbg.length !== 13 || !/^\d{13}$/.test(jmbg)) {
    return NextResponse.json({ error: "JMBG mora imati tačno 13 cifara." }, { status: 400 });
  }

  const korisnik = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      referralReceived: { include: { referrer: { include: { wallet: true } } } },
      verificationRequest: true,
    },
  });

  if (!korisnik) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (korisnik.verified) return NextResponse.json({ error: "Korisnik je već verifikovan." }, { status: 400 });
  if (!korisnik.wallet) return NextResponse.json({ error: "Korisnik nema novčanik." }, { status: 500 });

  // Provera duplikata JMBG
  const jmbgPostoji = await prisma.verificationRequest.findFirst({
    where: { jmbg, status: "APPROVED" },
  });
  if (jmbgPostoji) {
    return NextResponse.json({ error: "Ovaj JMBG je već verifikovan na drugom nalogu." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    // Upsert VerificationRequest — ako postoji pending zahtev, ažuriraj ga
    if (korisnik.verificationRequest) {
      await tx.verificationRequest.update({
        where: { id: korisnik.verificationRequest.id },
        data: {
          jmbg,
          kanal: "LICNO",
          status: "APPROVED",
          reviewedAt: new Date(),
          reviewedById: session.user.id,
        },
      });
    } else {
      await tx.verificationRequest.create({
        data: {
          userId,
          jmbg,
          kanal: "LICNO",
          status: "APPROVED",
          reviewedAt: new Date(),
          reviewedById: session.user.id,
        },
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: { verified: true, verifiedAt: new Date() },
    });
  });

  await emitujPoen(
    korisnik.wallet.id,
    1_000,
    TransactionType.EMISIJA_VERIFIKACIJA,
    `Ručna verifikacija (lično): ${korisnik.pseudonim}`
  );

  // Referral nagrada za pozivaoca
  const referral = korisnik.referralReceived;
  if (referral && referral.referrer.wallet && !referral.rewardPaid) {
    const brojVerifikovanih = await prisma.referral.count({
      where: { referrerId: referral.referrerId, rewardPaid: true },
    });
    const nagrada = preporukaNagrada(brojVerifikovanih + 1);
    await emitujPoen(
      referral.referrer.wallet.id,
      nagrada,
      TransactionType.EMISIJA_PREPORUKA,
      `Preporuka: ${korisnik.pseudonim} verifikovan ručno (${brojVerifikovanih + 1}. preporučeni)`
    );
    await prisma.referral.update({
      where: { id: referral.id },
      data: { rewardPaid: true, rewardAmount: nagrada },
    });
  }

  await logAdminAkcija(session.user.id, "RUCNA_VERIFIKACIJA", userId, korisnik.pseudonim);
  await posaljiNotifikaciju(
    userId,
    "verifikacija_odobrena",
    "Verifikacija odobrena!",
    "Vaš identitet je verifikovan (lično). Dobili ste 1.000 POEN bonus.",
    "/novcanik"
  );
  return NextResponse.json({ ok: true });
}
