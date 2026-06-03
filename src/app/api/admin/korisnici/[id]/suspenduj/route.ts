import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = (body.razlog ?? "").trim();

  const korisnik = await prisma.user.findUnique({ where: { id }, select: { tipKorisnika: true, status: true, pseudonim: true } });
  if (!korisnik) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (korisnik.tipKorisnika === "POCETNI") return NextResponse.json({ error: "Ne može se suspendovati admin." }, { status: 400 });
  if (korisnik.status === "SUSPENDED") return NextResponse.json({ error: "Korisnik je već suspendovan." }, { status: 400 });

  await prisma.user.update({
    where: { id },
    data: { status: "SUSPENDED", suspendedAt: new Date(), suspendedReason: razlog || null },
  });

  await logAdminAkcija(session.user.id, "KORISNIK_SUSPENDOVAN", id, `${korisnik.pseudonim}${razlog ? ": " + razlog : ""}`);

  return NextResponse.json({ ok: true });
}
