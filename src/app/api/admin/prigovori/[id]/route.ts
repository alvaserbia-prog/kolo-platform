import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

/**
 * PATCH /api/admin/prigovori/[id] — odgovori na prigovor
 * Body: { status: "RESENO" | "ODBIJENO" | "U_OBRADI", odgovor: string }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return await greska("Nije ovlašćen.", 403);
  }

  const { id } = await params;
  const body = await req.json();
  const { status, odgovor } = body;

  const validStatusi = ["U_OBRADI", "RESENO", "ODBIJENO"];
  if (!validStatusi.includes(status)) {
    return await greska("Nevalidan status.", 400);
  }

  const prigovor = await prisma.prigovorNaOdluku.findUnique({
    where: { id },
    include: { user: { select: { pseudonim: true } } },
  });
  if (!prigovor) return await greska("Prigovor nije pronađen.", 404);

  await prisma.prigovorNaOdluku.update({
    where: { id },
    data: {
      status,
      odgovor: odgovor?.trim() || null,
      odgovorioId: session.user.id,
      odgovorioAt: new Date(),
    },
  });

  await logAdminAkcija(
    session.user.id,
    "PRIGOVOR_ODGOVOR",
    prigovor.userId,
    `Prigovor ${id} → ${status}`
  );

  if (status === "RESENO" || status === "ODBIJENO") {
    const reseno = status === "RESENO";
    const rucniOdgovor = odgovor?.trim();
    const koren = reseno ? "notifikacije.prigovor_resen" : "notifikacije.prigovor_odbijen";
    await posaljiNotifikaciju(
      prigovor.userId,
      "info",
      reseno ? "Prigovor rešen" : "Prigovor odbijen",
      rucniOdgovor || (reseno ? "Tvoj prigovor je rešen." : "Tvoj prigovor je odbijen."),
      "/profil",
      // Obrazloženje koje je UO otkucao je autorski tekst i ide kako je napisano —
      // zato se BEZ ključa, pa se ne prevodi. Samo standardna rečenica je prevodiva.
      rucniOdgovor ? undefined : { kljuc: koren },
    );
  }

  return NextResponse.json({ ok: true });
}
