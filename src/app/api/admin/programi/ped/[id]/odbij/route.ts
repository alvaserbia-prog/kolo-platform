import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/programi/ped/[id]/odbij — odbij evidenciju
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const ev = await prisma.doprinosEvidencija.findUnique({ where: { id } });
  if (!ev) return NextResponse.json({ error: "Evidencija nije pronađena." }, { status: 404 });
  if (ev.status !== "PENDING")
    return NextResponse.json({ error: "Evidencija nije na čekanju." }, { status: 400 });

  await prisma.doprinosEvidencija.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ ok: true });
}
