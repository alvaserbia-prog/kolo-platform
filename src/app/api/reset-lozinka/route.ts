import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifikujResetToken } from "@/lib/passwordReset";

export async function POST(req: NextRequest) {
  try {
    const { token, novaLozinka } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token je obavezan." }, { status: 400 });
    }
    if (!novaLozinka || typeof novaLozinka !== "string") {
      return NextResponse.json({ error: "Nova lozinka je obavezna." }, { status: 400 });
    }
    if (novaLozinka.length < 8) {
      return NextResponse.json({ error: "Lozinka mora imati najmanje 8 karaktera." }, { status: 400 });
    }

    const verified = await verifikujResetToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Link je nevažeći ili je istekao." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: verified.userId } });
    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ error: "Nalog nije dostupan." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(novaLozinka, 12);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });
      await tx.passwordResetToken.update({
        where: { id: verified.tokenId },
        data: { usedAt: new Date() },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reset-lozinka] greška:", err);
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}

// GET — proveri da li je token validan (za prikaz forme bez slanja lozinke)
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }
    const verified = await verifikujResetToken(token);
    return NextResponse.json({ valid: !!verified });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
