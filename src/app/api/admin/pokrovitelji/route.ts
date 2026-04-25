import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }

  const pokrovitelji = await prisma.pokrovitelj.findMany({
    include: {
      vlasnik: { select: { pseudonim: true } },
      krug: { select: { name: true } },
      _count: { select: { doprinosi: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    pokrovitelji.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      pib: p.pib,
      adresa: p.adresa,
      kontaktEmail: p.kontaktEmail,
      kontaktTelefon: p.kontaktTelefon,
      vlasnikId: p.vlasnikId,
      vlasnikPseudonim: p.vlasnik.pseudonim,
      krugId: p.krugId,
      krugName: p.krug?.name ?? null,
      rsdKumulativ: Number(p.rsdKumulativ),
      trenutniNivo: p.trenutniNivo,
      status: p.status,
      brDoprinosa: p._count.doprinosi,
      createdAt: p.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }

  const body = await req.json();
  const { naziv, pib, adresa, kontaktEmail, kontaktTelefon, vlasnikId, krugId } = body;

  if (!naziv?.trim() || !pib?.trim() || !vlasnikId) {
    return NextResponse.json({ error: "Naziv, PIB i vlasnik su obavezni." }, { status: 400 });
  }

  const vlasnik = await prisma.user.findUnique({
    where: { id: vlasnikId },
    select: { verified: true, pseudonim: true },
  });
  if (!vlasnik || !vlasnik.verified) {
    return NextResponse.json({ error: "Vlasnik mora biti verifikovan član." }, { status: 400 });
  }

  const existing = await prisma.pokrovitelj.findUnique({ where: { pib: pib.trim() } });
  if (existing) {
    return NextResponse.json({ error: "Pokrovitelj sa ovim PIB-om već postoji." }, { status: 400 });
  }

  const pokrovitelj = await prisma.pokrovitelj.create({
    data: {
      naziv: naziv.trim(),
      pib: pib.trim(),
      adresa: adresa?.trim() || null,
      kontaktEmail: kontaktEmail?.trim() || null,
      kontaktTelefon: kontaktTelefon?.trim() || null,
      vlasnikId,
      kreiraoId: session.user.id,
      krugId: krugId || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.user.id,
      akcija: "POKROVITELJ_KREIRAN",
      targetId: pokrovitelj.id,
      detalji: `Naziv: ${pokrovitelj.naziv}, PIB: ${pokrovitelj.pib}, Vlasnik: ${vlasnik.pseudonim}`,
    },
  });

  return NextResponse.json({ id: pokrovitelj.id }, { status: 201 });
}
