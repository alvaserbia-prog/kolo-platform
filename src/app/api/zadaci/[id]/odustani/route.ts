import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/zadaci/[id]/odustani — odustanak izvršioca bez posledica (čl. 20)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id: zadatakId } = await params;
  const prijava = await prisma.zadatakPrijava.findUnique({
    where: { zadatakId_userId: { zadatakId, userId: session.user.id } },
  });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.status !== "PRIMLJENA" && prijava.status !== "PODNETA")
    return NextResponse.json({ error: "Od ove prijave nije moguće odustati." }, { status: 400 });

  await prisma.zadatakPrijava.update({
    where: { id: prijava.id },
    data: { status: "ODUSTAO" },
  });

  // Verifikovana izvršenja do trenutka odustanka ostaju u raspodeli (čl. 20).
  // Ako više nema primljenih izvršilaca, zadatak se vraća u OTVOREN.
  const preostali = await prisma.zadatakPrijava.count({
    where: { zadatakId, status: "PRIMLJENA" },
  });
  if (preostali === 0) {
    const z = await prisma.zadatak.findUnique({ where: { id: zadatakId }, select: { status: true } });
    if (z?.status === "U_IZVRSENJU")
      await prisma.zadatak.update({ where: { id: zadatakId }, data: { status: "OTVOREN" } });
  }

  return NextResponse.json({ ok: true });
}
