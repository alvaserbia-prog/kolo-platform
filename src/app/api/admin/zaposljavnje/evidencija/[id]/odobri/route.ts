import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "@/lib/banka/emisija";
import { TransactionType } from "@/generated/prisma/client";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;

  const ev = await prisma.radnaEvidencija.findUnique({
    where: { id },
    include: {
      user: { include: { wallet: true } },
      oglas: { select: { title: true } },
    },
  });

  if (!ev) return NextResponse.json({ error: "Evidencija nije pronađena." }, { status: 404 });
  if (ev.status !== "PENDING") return NextResponse.json({ error: "Evidencija nije na čekanju." }, { status: 400 });
  if (!ev.user.wallet) return NextResponse.json({ error: "Korisnik nema novčanik." }, { status: 400 });

  await emitujPoen(
    ev.user.wallet!.id,
    ev.amount,
    TransactionType.EMISIJA_PROGRAM,
    `Zapošljavanje: ${ev.oglas.title} (${ev.hoursWorked}h)`
  );

  await prisma.radnaEvidencija.update({
    where: { id },
    data: { status: "EMITTED", approvedById: session.user.id, approvedAt: new Date() },
  });

  return NextResponse.json({ ok: true, amount: ev.amount });
}
