import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json({ error: "Nije ovlašćen." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, odgovor } = body;

  const validStatusi = ["U_OBRADI", "RESENO", "ODBIJENO"];
  if (!validStatusi.includes(status)) {
    return NextResponse.json({ error: "Nevalidan status." }, { status: 400 });
  }

  const prigovor = await prisma.prigovorNaOdluku.findUnique({
    where: { id },
    include: { user: { select: { pseudonim: true } } },
  });
  if (!prigovor) return NextResponse.json({ error: "Prigovor nije pronađen." }, { status: 404 });

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
    await posaljiNotifikaciju(
      prigovor.userId,
      "info",
      status === "RESENO" ? "Prigovor rešen" : "Prigovor odbijen",
      odgovor?.trim() || (status === "RESENO" ? "Vaš prigovor je rešen." : "Vaš prigovor je odbijen."),
      "/profil"
    );
  }

  return NextResponse.json({ ok: true });
}
