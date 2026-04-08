import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitujPoen, preporukaNagrada } from "@/lib/banka/emisija";
import { TransactionType } from "@/generated/prisma/client";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/admin/verifikacija/[id] — odobri (id je VerificationRequest.id)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { id } = await params;

  const vr = await prisma.verificationRequest.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          wallet: true,
          referralReceived: { include: { referrer: { include: { wallet: true } } } },
        },
      },
    },
  });

  if (!vr) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (vr.status !== "PENDING") return NextResponse.json({ error: "Zahtev nije na čekanju." }, { status: 400 });
  if (vr.user.verified) return NextResponse.json({ error: "Korisnik je već verifikovan." }, { status: 400 });
  if (!vr.user.wallet) return NextResponse.json({ error: "Korisnik nema novčanik." }, { status: 500 });

  // Odobri: verifikuj korisnika + emisija 1.000 POEN
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: vr.userId },
      data: { verified: true, verifiedAt: new Date() },
    });
    await tx.verificationRequest.update({
      where: { id },
      data: { status: "APPROVED", reviewedAt: new Date(), reviewedById: session.user.id },
    });
  });

  await emitujPoen(
    vr.user.wallet.id,
    1_000,
    TransactionType.EMISIJA_VERIFIKACIJA,
    `Verifikacija korisnika ${vr.user.pseudonim}`
  );

  // Referral nagrada za pozivaoca
  const referral = vr.user.referralReceived;
  if (referral && referral.referrer.wallet && !referral.rewardPaid) {
    const brojVerifikovanih = await prisma.referral.count({
      where: { referrerId: referral.referrerId, rewardPaid: true },
    });
    const nagrada = preporukaNagrada(brojVerifikovanih + 1);
    await emitujPoen(
      referral.referrer.wallet.id,
      nagrada,
      TransactionType.EMISIJA_PREPORUKA,
      `Preporuka: ${vr.user.pseudonim} verifikovan (${brojVerifikovanih + 1}. preporučeni)`
    );
    await prisma.referral.update({
      where: { id: referral.id },
      data: { rewardPaid: true, rewardAmount: nagrada },
    });
  }

  await logAdminAkcija(session.user.id, "VERIFIKACIJA_ODOBRENA", vr.userId, vr.user.pseudonim);
  return NextResponse.json({ ok: true });
}
