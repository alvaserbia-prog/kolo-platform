import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/doprinos-oglasi/oglasi/[id]/zatvori
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  await prisma.doprinosOglas.update({ where: { id }, data: { status: "CLOSED" } });
  return NextResponse.json({ ok: true });
}
