import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/zadruge/[id]/programi/evidencije/[evidencijaId]/odbij
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; evidencijaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id: zadrugaId, evidencijaId } = await params;

  if (session.user.role !== "ADMIN") {
    const membership = await prisma.zadrugaMembership.findFirst({
      where: { zadrugaId, userId: session.user.id, isAdmin: true, leftAt: null },
    });
    if (!membership) return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const ev = await prisma.zaposljvanjeEvidencija.findUnique({
    where: { id: evidencijaId },
    include: { user: { include: { zadrugaMemberships: { where: { zadrugaId, leftAt: null } } } } },
  });

  if (!ev) return NextResponse.json({ error: "Evidencija nije pronađena." }, { status: 404 });
  if (ev.status !== "PENDING") return NextResponse.json({ error: "Evidencija nije na čekanju." }, { status: 400 });

  if (session.user.role !== "ADMIN" && ev.user.zadrugaMemberships.length === 0) {
    return NextResponse.json({ error: "Korisnik nije član ove zadruge." }, { status: 403 });
  }

  await prisma.zaposljvanjeEvidencija.update({
    where: { id: evidencijaId },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ ok: true });
}
