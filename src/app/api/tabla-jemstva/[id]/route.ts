import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/tabla-jemstva/[id] — korisnik povlači sopstveni zahtev (status POVUCEN).
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;
  const zahtev = await prisma.zahtevZaJemstvo.findUnique({
    where: { id },
    select: { userId: true, status: true },
  });
  if (!zahtev) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (zahtev.userId !== session.user.id)
    return NextResponse.json({ error: "Nije vaš zahtev." }, { status: 403 });
  if (zahtev.status !== "AKTIVAN")
    return NextResponse.json({ error: "Zahtev nije aktivan." }, { status: 400 });

  await prisma.zahtevZaJemstvo.update({
    where: { id },
    data: { status: "POVUCEN" },
  });

  return NextResponse.json({ ok: true });
}
