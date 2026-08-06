import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { proveriIEmitujBonusPrag } from "@/lib/protokol/krug";
import { obavesti } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

// POST — odobri pristupnicu (admin krugovi ili ADMIN)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; pristupnicaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const { id: krugId, pristupnicaId } = await params;

  // Mora biti admin krugovi ili ADMIN sistema
  const isAdmin = jeAdmin(session.user);
  const isKrugAdmin = await prisma.krugClanstvo.findFirst({
    where: { krugId, userId: session.user.id, leftAt: null, isAdmin: true },
  });
  if (!isAdmin && !isKrugAdmin)
    return await greska("Nemaš pravo da odobriš pristupnicu.", 403);

  const pristupnica = await prisma.krugPristupnica.findUnique({
    where: { id: pristupnicaId },
  });
  if (!pristupnica || pristupnica.krugId !== krugId)
    return await greska("Pristupnica nije pronađena.", 404);
  if (pristupnica.status !== "PENDING")
    return await greska("Pristupnica nije na čekanju.", 400);

  // Čl. 28 — korisnik ne sme biti u drugoj zadruzi
  const vec = await prisma.krugClanstvo.findFirst({
    where: { userId: pristupnica.userId, leftAt: null },
  });
  if (vec)
    return await greska("Korisnik je već član druge krugovi.", 400);

  await prisma.$transaction(async (tx) => {
    await tx.krugClanstvo.create({
      data: { userId: pristupnica.userId, krugId, isAdmin: false },
    });
    await tx.krugPristupnica.update({
      where: { id: pristupnicaId },
      data: { status: "APPROVED" },
    });
  });

  // Proveri bonus prag (van $transaction)
  await proveriIEmitujBonusPrag(krugId);

  const krug = await prisma.krug.findUnique({ where: { id: krugId }, select: { name: true } });

  await logAdminAkcija(session.user.id, "KRUG_PRISTUPNICA_ODOBRENA", pristupnica.userId,
    krug?.name ?? krugId);

  await obavesti(pristupnica.userId, {
    tip: "info",
    kljuc: "notifikacije.pristupnica_prihvacena",
    parametri: { krug: krug?.name ?? krugId },
    naslov: "Pristupnica prihvaćena!",
    tekst: `Postao/la si član kruga „${krug?.name ?? krugId}".`,
    link: `/krug/${krugId}`,
  });

  return NextResponse.json({ ok: true });
}
