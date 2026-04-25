import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/krugovi/[id]/programi/evidencije/[evidencijaId]/odbij
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; evidencijaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id: krugId, evidencijaId } = await params;

  if (session.user.role !== "ADMIN") {
    const membership = await prisma.krugClanstvo.findFirst({
      where: { krugId, userId: session.user.id, isAdmin: true, leftAt: null },
    });
    if (!membership) return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const ev = await prisma.doprinosEvidencija.findUnique({
    where: { id: evidencijaId },
    include: { user: { include: { krugClanstva: { where: { krugId, leftAt: null } } } } },
  });

  if (!ev) return NextResponse.json({ error: "Evidencija nije pronađena." }, { status: 404 });
  if (ev.status !== "PENDING") return NextResponse.json({ error: "Evidencija nije na čekanju." }, { status: 400 });

  if (session.user.role !== "ADMIN" && ev.user.krugClanstva.length === 0) {
    return NextResponse.json({ error: "Korisnik nije član ove krugovi." }, { status: 403 });
  }

  await prisma.doprinosEvidencija.update({
    where: { id: evidencijaId },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ ok: true });
}
