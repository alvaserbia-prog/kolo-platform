import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

/**
 * PATCH /api/admin/bagovi/[id] — admin menja status prijave baga
 * Body: { status: "PRIJAVLJEN" | "U_RADU" | "RESENO" | "ODBIJENO", odgovor?: string }
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

  const validStatusi = ["PRIJAVLJEN", "U_RADU", "RESENO", "ODBIJENO"];
  if (!validStatusi.includes(status)) {
    return NextResponse.json({ error: "Nevalidan status." }, { status: 400 });
  }

  const bag = await prisma.bug.findUnique({
    where: { id },
    select: { userId: true, naslov: true },
  });
  if (!bag) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });

  const zatvoreno = status === "RESENO" || status === "ODBIJENO";
  await prisma.bug.update({
    where: { id },
    data: {
      status,
      odgovor: typeof odgovor === "string" ? odgovor.trim() || null : undefined,
      resenoAt: zatvoreno ? new Date() : null,
    },
  });

  await logAdminAkcija(session.user.id, "BAG_STATUS", bag.userId, `Bag ${id} → ${status}`);

  await posaljiNotifikaciju(
    bag.userId,
    "info",
    status === "U_RADU"
      ? "Radi se na tvojoj prijavi"
      : status === "RESENO"
      ? "Prijavljeni bag je rešen"
      : status === "ODBIJENO"
      ? "Prijava baga je odbijena"
      : "Status prijave baga je promenjen",
    `„${bag.naslov}"`,
    "/bagovi"
  );

  return NextResponse.json({ ok: true });
}
