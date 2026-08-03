/**
 * POST /api/admin/sistemsko-obavestenje/[id]/proba
 *
 * Pošalji probnu poruku SAMO sebi — isti HTML koji bi dobili svi korisnici.
 * Obavezan korak pre pravog slanja: cirkularna poruka se ne može povući.
 *
 * SAMO SUPERADMIN.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import { posaljiEmailRaw } from "@/lib/email";
import { teloObavestenja } from "@/lib/sistemsko-obavestenje";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user)) {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { id } = await params;

  const [o, ja] = await Promise.all([
    prisma.sistemskoObavestenje.findUnique({ where: { id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, pseudonim: true },
    }),
  ]);

  if (!o) return NextResponse.json({ error: "Obaveštenje ne postoji." }, { status: 404 });
  if (!ja?.email) {
    return NextResponse.json({ error: "Tvoj nalog nema email adresu." }, { status: 400 });
  }

  const poslat = await posaljiEmailRaw(
    ja.email,
    `[PROBA] ${o.naslov} — KOLO`,
    teloObavestenja(o, ja.pseudonim),
    "sistemsko-proba"
  );

  if (!poslat) {
    return NextResponse.json({ error: "Slanje nije uspelo — proveri Resend podešavanja." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, poslatoNa: ja.email });
}
