import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pristanakStatus } from "@/lib/politika";

/**
 * GET /api/politika/prihvati — vraća najnoviju verziju politike koju korisnik NIJE prihvatio
 * POST /api/politika/prihvati — korisnik prihvata verziju politike
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  // Isti izvor istine kao `/api/me` — vidi `pristanakStatus`. Dva odvojena upita
  // su umela da se raziđu, pa je ekran za pristanak bljesnuo i nestao.
  const { potrebno, verzija } = await pristanakStatus(session.user.id);

  return NextResponse.json(potrebno ? { potrebno, verzija } : { potrebno: false });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const userId = session.user.id;
  const body = await req.json();
  const { verzijaId } = body;

  if (!verzijaId) {
    return await greska("verzijaId je obavezno.", 400);
  }

  const verzija = await prisma.politikaVerzija.findUnique({ where: { id: verzijaId } });
  if (!verzija) return await greska("Verzija nije pronađena.", 404);

  await prisma.politikaPrihvatanje.upsert({
    where: { userId_verzijaId: { userId, verzijaId } },
    update: { prihvacen: true, createdAt: new Date() },
    create: { userId, verzijaId, prihvacen: true },
  });

  return NextResponse.json({ ok: true });
}
