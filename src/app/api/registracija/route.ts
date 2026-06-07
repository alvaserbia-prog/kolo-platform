import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { WalletType } from "@/generated/prisma/client";
import { RANI_PRISTUP_COOKIE, validanRaniPristup } from "@/lib/rani-pristup";

function generateMemberHash(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let hash = "";
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export async function POST(req: NextRequest) {
  try {
    if (
      process.env.MAINTENANCE_MODE === "true" &&
      !validanRaniPristup(req.cookies.get(RANI_PRISTUP_COOKIE)?.value)
    ) {
      return NextResponse.json(
        { error: "Registracija je trenutno onemogućena. Platforma se priprema za pokretanje." },
        { status: 503 },
      );
    }

    const body = await req.json();
    const { email, pseudonim, password } = body;
    const location = typeof body.location === "string" ? body.location.trim() : null;

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
    if (location !== null && location.length > 80) {
      return NextResponse.json({ error: "Mesto je predugačko." }, { status: 400 });
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

    // Generiši jedinstven member hash
    let myHash = generateMemberHash();
    while (await prisma.user.findUnique({ where: { memberHash: myHash } })) {
      myHash = generateMemberHash();
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Kreira korisnika + wallet
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        pseudonim,
        memberHash: myHash,
        location: location || null,
        wallet: {
          create: { type: WalletType.USER, balance: 0 },
        },
      },
    });

    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
