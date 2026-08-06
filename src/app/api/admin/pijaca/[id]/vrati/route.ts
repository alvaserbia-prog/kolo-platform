import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

// POST /api/admin/pijaca/[id]/vrati — poništenje uklanjanja.
//
// Postoji zato što je uklanjanje jednostrana odluka Fondacije: pogrešnu procenu
// i usvojen prigovor (Uslovi čl. 30) mora biti moguće ispraviti bez traženja od
// korisnika da ponovo kuca oglas.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const oglas = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { title: true, status: true, sellerId: true, seller: { select: { pseudonim: true } } },
  });
  if (!oglas) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  if (oglas.status !== "UKLONJEN")
    return NextResponse.json({ error: "Oglas nije uklonjen." }, { status: 400 });

  await prisma.marketplaceListing.update({
    where: { id },
    data: { status: "ACTIVE", uklonjenAt: null, uklonjenRazlog: null, uklonioId: null },
  });

  await logAdminAkcija(session.user.id, "OGLAS_VRACEN", id, `${oglas.seller.pseudonim} — ${oglas.title}`);
  await posaljiNotifikaciju(
    oglas.sellerId,
    "OGLAS_VRACEN",
    "Oglas vraćen na Pijacu",
    `Tvoj oglas „${oglas.title}" je vraćen i ponovo je vidljiv na Pijaci.`,
    `/pijaca/${id}`,
  );

  return NextResponse.json({ ok: true });
}
