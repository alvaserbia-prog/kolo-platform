import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/zrno/delegiraj — delegiraj glasove
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Verifikacija potrebna." }, { status: 403 });

  const body = await req.json();
  const delegatPseudonim = (body.pseudonim ?? "").trim();
  if (!delegatPseudonim)
    return NextResponse.json({ error: "Unesite pseudonim delegata." }, { status: 400 });

  const delegat = await prisma.user.findUnique({ where: { pseudonim: delegatPseudonim }, select: { id: true } });
  if (!delegat) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (delegat.id === session.user.id)
    return NextResponse.json({ error: "Ne možete delegirati sebi." }, { status: 400 });

  // Zakazana promena — stupa na snagu u ponoć (efektivna delegacija ostaje do tada).
  await prisma.zrnoDelegacija.upsert({
    where: { delegatorId: session.user.id },
    create: { delegatorId: session.user.id, delegatId: null, zakazaniDelegatId: delegat.id, imaZakazano: true },
    update: { zakazaniDelegatId: delegat.id, imaZakazano: true },
  });

  return NextResponse.json({ ok: true, poruka: "Delegacija primljena. Stupa na snagu u ponoć." });
}

// DELETE /api/zrno/delegiraj — zakaži opoziv delegacije (izvršava se u ponoć)
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const postoji = await prisma.zrnoDelegacija.findUnique({ where: { delegatorId: session.user.id } });
  if (!postoji) return NextResponse.json({ ok: true });

  await prisma.zrnoDelegacija.update({
    where: { delegatorId: session.user.id },
    data: { zakazaniDelegatId: null, imaZakazano: true },
  });

  return NextResponse.json({ ok: true, poruka: "Opoziv primljen. Stupa na snagu u ponoć." });
}
