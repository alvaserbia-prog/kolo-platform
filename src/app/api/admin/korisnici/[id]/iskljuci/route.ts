import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

// POST — isključi korisnika (Čl. 33): EXCLUDED status, izlaz iz krugovi
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = (body.razlog ?? "").trim();

  const korisnik = await prisma.user.findUnique({
    where: { id },
    select: { role: true, status: true, pseudonim: true },
  });
  if (!korisnik) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (korisnik.role === "ADMIN") return NextResponse.json({ error: "Ne može se isključiti admin." }, { status: 400 });
  if (korisnik.status === "EXCLUDED") return NextResponse.json({ error: "Korisnik je već isključen." }, { status: 400 });

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
        role: "FIZICKO_LICE",
      },
    });
  });

  await logAdminAkcija(session.user.id, "KORISNIK_ISKLJUCEN", id, `${korisnik.pseudonim}${razlog ? ": " + razlog : ""}`);
  return NextResponse.json({ ok: true });
}
