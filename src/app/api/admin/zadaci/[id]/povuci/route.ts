import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/zadaci/[id]/povuci — povlačenje zadatka (čl. 8)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const zadatak = await prisma.zadatak.findUnique({ where: { id } });
  if (!zadatak) return NextResponse.json({ error: "Zadatak nije pronađen." }, { status: 404 });
  if (zadatak.status === "POVUCEN" || zadatak.status === "IZVRSEN")
    return NextResponse.json({ error: "Zadatak je već zatvoren." }, { status: 400 });

  await prisma.zadatak.update({ where: { id }, data: { status: "POVUCEN" } });
  return NextResponse.json({ ok: true });
}
