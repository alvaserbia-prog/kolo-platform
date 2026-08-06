import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { jeSuperadmin } from "@/lib/dozvole";

// POST — isključi korisnika (Čl. 33): EXCLUDED status, izlaz iz krugovi
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return await greska("Pristup odbijen.", 403);

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = (body.razlog ?? "").trim();

  const korisnik = await prisma.user.findUnique({
    where: { id },
    select: { tipKorisnika: true, admin: true, status: true, pseudonim: true },
  });
  if (!korisnik) return await greska("Korisnik nije pronađen.", 404);
  if (jeSuperadmin(korisnik)) return await greska("Ne može se isključiti admin.", 400);
  if (korisnik.status === "EXCLUDED") return await greska("Korisnik je već isključen.", 400);

  await prisma.$transaction(async (tx) => {
    // Isključi iz krugovi
    await tx.krugClanstvo.updateMany({
      where: { userId: id, leftAt: null },
      data: { leftAt: new Date() },
    });
    // Odbij pending pristupnice
    await tx.krugPristupnica.updateMany({
      where: { userId: id, status: "PENDING" },
      data: { status: "REJECTED" },
    });
    // Postavi status
    await tx.user.update({
      where: { id },
      data: {
        status: "EXCLUDED",
        suspendedAt: new Date(),
        suspendedReason: razlog || "Isključenje (Čl. 33)",
      },
    });
  });

  await logAdminAkcija(session.user.id, "KORISNIK_ISKLJUCEN", id, `${korisnik.pseudonim}${razlog ? ": " + razlog : ""}`);
  return NextResponse.json({ ok: true });
}
