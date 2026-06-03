import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { azurirajVetoStatus } from "@/lib/protokol/fondacija";
import { jeAdmin } from "@/lib/dozvole";

/**
 * DELETE /api/admin/fondacija/trosak/[id]
 * Brisanje troska. Po Pravilniku transparentnosti, brisanje treba biti redak slucaj
 * (npr. ispravljanje greske u unosu). Audit log preporucljiv.
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!jeAdmin(session.user)) return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  const { id } = await params;
  await prisma.fondacijaTrosak.delete({ where: { id } });
  await azurirajVetoStatus();
  return NextResponse.json({ ok: true });
}
