import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const korisnik = await prisma.user.findUnique({ where: { id }, select: { status: true, pseudonim: true } });
  if (!korisnik) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  await prisma.user.update({
    where: { id },
    data: { status: "ACTIVE", suspendedAt: null, suspendedReason: null },
  });

  await logAdminAkcija(session.user.id, "KORISNIK_AKTIVIRAN", id, korisnik.pseudonim);
  return NextResponse.json({ ok: true });
}
