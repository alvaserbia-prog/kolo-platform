import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PRIVREMENI debug endpoint za dijagnostiku reset lozinke.
// Admin-only. Vraća stanje korisnika i Resend env varijabli — bez slanja email-a.
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen — samo admin." }, { status: 403 });
  }

  const trazeniEmail = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!trazeniEmail) {
    return NextResponse.json({ error: "Dodaj ?email=neki@email.com" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: trazeniEmail },
    select: {
      id: true,
      email: true,
      pseudonim: true,
      status: true,
      oauthProvider: true,
      verified: true,
      passwordHash: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    diagnostika: {
      trazeniEmail,
      naloPostoji: !!user,
      nalog: user
        ? {
            id: user.id,
            email: user.email,
            pseudonim: user.pseudonim,
            status: user.status,
            oauthProvider: user.oauthProvider ?? "(nema)",
            verified: user.verified,
            imaLozinku: !!user.passwordHash,
            kreiran: user.createdAt,
          }
        : null,
      env: {
        RESEND_API_KEY: process.env.RESEND_API_KEY
          ? `postavljen (${process.env.RESEND_API_KEY.slice(0, 6)}...)`
          : "NIJE POSTAVLJEN",
        RESEND_FROM: process.env.RESEND_FROM ?? "(default — nije postavljen)",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "(NIJE POSTAVLJEN)",
        ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "(NIJE POSTAVLJEN)",
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "postavljen" : "NIJE POSTAVLJEN",
      },
    },
  });
}
