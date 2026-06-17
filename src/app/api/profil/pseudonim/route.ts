import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validanPseudonim } from "@/lib/validacija";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const body = await req.json();
  if (!validanPseudonim(body?.pseudonim)) {
    return NextResponse.json(
      { error: "Pseudonim: 3–30 znakova, samo slova, brojevi, razmak, _ . -" },
      { status: 400 }
    );
  }
  const pseudonim = (body.pseudonim as string).trim();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  // Provera 30-dnevnog ograničenja
  if (user.pseudonimChangedAt) {
    const elapsed = Date.now() - user.pseudonimChangedAt.getTime();
    if (elapsed < 30 * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: "Pseudonim možete menjati jednom u 30 dana." }, { status: 400 });
    }
  }

  const exists = await prisma.user.findUnique({ where: { pseudonim } });
  if (exists) return NextResponse.json({ error: "Pseudonim je zauzet." }, { status: 409 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { pseudonim, pseudonimChangedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
