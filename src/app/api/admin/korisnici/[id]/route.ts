import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { email, pseudonim } = body as { email?: string; pseudonim?: string };

  const korisnik = await prisma.user.findUnique({
    where: { id },
    select: { pseudonim: true, tipKorisnika: true },
  });
  if (!korisnik) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (korisnik.tipKorisnika === "POCETNI") return NextResponse.json({ error: "Ne može se editovati admin." }, { status: 400 });

  const data: { email?: string; pseudonim?: string } = {};

  if (email?.trim()) {
    const existing = await prisma.user.findFirst({ where: { email: email.trim(), id: { not: id } } });
    if (existing) return NextResponse.json({ error: "Email je već u upotrebi." }, { status: 409 });
    data.email = email.trim();
  }

  if (pseudonim?.trim()) {
    const existing = await prisma.user.findFirst({ where: { pseudonim: pseudonim.trim(), id: { not: id } } });
    if (existing) return NextResponse.json({ error: "Pseudonim je već zauzet." }, { status: 409 });
    data.pseudonim = pseudonim.trim();
  }

  if (Object.keys(data).length === 0)
    return NextResponse.json({ error: "Nema podataka za izmenu." }, { status: 400 });

  await prisma.user.update({ where: { id }, data });

  await logAdminAkcija(
    session.user.id,
    "KORISNIK_IZMENJEN",
    id,
    `${korisnik.pseudonim}: ${Object.keys(data).join(", ")}`
  );

  return NextResponse.json({ ok: true });
}
