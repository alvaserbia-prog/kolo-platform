import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/zrno/delegiraj — delegiraj glasove
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const body = await req.json();
  const delegatPseudonim = (body.pseudonim ?? "").trim();
  if (!delegatPseudonim)
    return NextResponse.json({ error: "Unesite pseudonim delegata." }, { status: 400 });

  const delegat = await prisma.user.findUnique({ where: { pseudonim: delegatPseudonim }, select: { id: true } });
  if (!delegat) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (delegat.id === session.user.id)
    return NextResponse.json({ error: "Ne možete delegirati sebi." }, { status: 400 });

  // Upsert — pending (aktivna: false), aktivira se u ponoć
  await prisma.zrnoDelegacija.upsert({
    where: { delegatorId: session.user.id },
    create: { delegatorId: session.user.id, delegatId: delegat.id, aktivna: false },
    update: { delegatId: delegat.id, aktivna: false },
  });

  return NextResponse.json({ ok: true, poruka: "Delegacija primljena. Stupa na snagu u ponoć." });
}

// DELETE /api/zrno/delegiraj — opozovi delegaciju
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  await prisma.zrnoDelegacija.deleteMany({ where: { delegatorId: session.user.id } });
  return NextResponse.json({ ok: true });
}
