import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/politika/prihvati — vraća najnoviju verziju politike koju korisnik NIJE prihvatio
 * POST /api/politika/prihvati — korisnik prihvata verziju politike
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const userId = session.user.id;

  // Najnovija aktivna verzija (efektivnaOd <= now)
  const najnovija = await prisma.politikaVerzija.findFirst({
    where: { efektivnaOd: { lte: new Date() } },
    orderBy: { efektivnaOd: "desc" },
  });

  if (!najnovija) return NextResponse.json({ potrebno: false });

  // Da li je korisnik već prihvatio?
  const prihvaceno = await prisma.politikaPrihvatanje.findUnique({
    where: { userId_verzijaId: { userId, verzijaId: najnovija.id } },
  });

  if (prihvaceno) return NextResponse.json({ potrebno: false });

  return NextResponse.json({ potrebno: true, verzija: najnovija });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const userId = session.user.id;
  const body = await req.json();
  const { verzijaId } = body;

  if (!verzijaId) {
    return NextResponse.json({ error: "verzijaId je obavezno." }, { status: 400 });
  }

  const verzija = await prisma.politikaVerzija.findUnique({ where: { id: verzijaId } });
  if (!verzija) return NextResponse.json({ error: "Verzija nije pronađena." }, { status: 404 });

  await prisma.politikaPrihvatanje.upsert({
    where: { userId_verzijaId: { userId, verzijaId } },
    update: { prihvacen: true, createdAt: new Date() },
    create: { userId, verzijaId, prihvacen: true },
  });

  return NextResponse.json({ ok: true });
}
