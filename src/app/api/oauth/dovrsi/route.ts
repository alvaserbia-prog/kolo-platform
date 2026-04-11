import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  if (!session.user.oauthPending) {
    return NextResponse.json({ error: "Nalog je već podešen." }, { status: 400 });
  }

  const body = await req.json();
  const { pseudonim, referralCode } = body;

  if (!pseudonim || pseudonim.trim().length < 3 || pseudonim.trim().length > 30) {
    return NextResponse.json({ error: "Pseudonim mora imati između 3 i 30 karaktera." }, { status: 400 });
  }

  const trimmed = pseudonim.trim();

  const existing = await prisma.user.findFirst({
    where: { pseudonim: trimmed, NOT: { id: session.user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Pseudonim je zauzet." }, { status: 409 });
  }

  let referrer = null;
  if (referralCode?.trim()) {
    referrer = await prisma.user.findUnique({ where: { referralCode: referralCode.trim() } });
    if (!referrer) {
      return NextResponse.json({ error: "Referral kod nije validan." }, { status: 400 });
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: {
        pseudonim: trimmed,
        oauthPending: false,
        referredById: referrer?.id ?? undefined,
      },
    });

    if (referrer) {
      const refPostoji = await tx.referral.findUnique({
        where: { referredId: session.user.id },
      });
      if (!refPostoji) {
        await tx.referral.create({
          data: { referrerId: referrer.id, referredId: session.user.id },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
