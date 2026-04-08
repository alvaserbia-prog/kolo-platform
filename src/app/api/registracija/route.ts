import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { WalletType } from "@/generated/prisma/client";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, pseudonim, password, referralCode } = body;

    // Validacija
    if (!email || !pseudonim || !password) {
      return NextResponse.json({ error: "Sva obavezna polja moraju biti popunjena." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Lozinka mora imati najmanje 8 karaktera." }, { status: 400 });
    }
    if (pseudonim.length < 3 || pseudonim.length > 30) {
      return NextResponse.json({ error: "Pseudonim mora imati između 3 i 30 karaktera." }, { status: 400 });
    }

    // Provera jedinstvenosti
    const [existingEmail, existingPseudonim] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { pseudonim } }),
    ]);
    if (existingEmail) {
      return NextResponse.json({ error: "Email je već registrovan." }, { status: 409 });
    }
    if (existingPseudonim) {
      return NextResponse.json({ error: "Pseudonim je zauzet." }, { status: 409 });
    }

    // Referral — pronađi pozivaoca
    let referrer = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (!referrer) {
        return NextResponse.json({ error: "Referral kod nije validan." }, { status: 400 });
      }
    }

    // Generiši jedinstven referral kod
    let myCode = generateReferralCode();
    while (await prisma.user.findUnique({ where: { referralCode: myCode } })) {
      myCode = generateReferralCode();
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Kreira korisnika + wallet u transakciji
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          pseudonim,
          referralCode: myCode,
          referredById: referrer?.id ?? null,
          wallet: {
            create: { type: WalletType.USER, balance: 0 },
          },
        },
      });

      // Upiši Referral zapis
      if (referrer) {
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: newUser.id,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
