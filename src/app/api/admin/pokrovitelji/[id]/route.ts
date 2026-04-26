import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }

  const { id } = await params;

  const pokrovitelj = await prisma.pokrovitelj.findUnique({
    where: { id },
    include: {
      vlasnik: { select: { pseudonim: true, email: true } },
      doprinosi: {
        include: { evidentirao: { select: { pseudonim: true } } },
        orderBy: { createdAt: "desc" },
      },
      bonusiEmisije: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!pokrovitelj) {
    return NextResponse.json({ error: "Pokrovitelj nije pronađen." }, { status: 404 });
  }

  return NextResponse.json({
    id: pokrovitelj.id,
    naziv: pokrovitelj.naziv,
    pib: pokrovitelj.pib,
    adresa: pokrovitelj.adresa,
    kontaktEmail: pokrovitelj.kontaktEmail,
    kontaktTelefon: pokrovitelj.kontaktTelefon,
    vlasnikId: pokrovitelj.vlasnikId,
    vlasnikPseudonim: pokrovitelj.vlasnik.pseudonim,
    rsdKumulativ: Number(pokrovitelj.rsdKumulativ),
    trenutniNivo: pokrovitelj.trenutniNivo,
    status: pokrovitelj.status,
    createdAt: pokrovitelj.createdAt.toISOString(),
    doprinosi: pokrovitelj.doprinosi.map((d) => ({
      id: d.id,
      rsdIznos: Number(d.rsdIznos),
      tip: d.tip,
      evidentiraoPseudonim: d.evidentirao.pseudonim,
      napomena: d.napomena,
      createdAt: d.createdAt.toISOString(),
    })),
    bonusiEmisije: pokrovitelj.bonusiEmisije.map((b) => ({
      id: b.id,
      nivo: b.nivo,
      bonusPoen: b.bonusPoen,
      transactionId: b.transactionId,
      createdAt: b.createdAt.toISOString(),
    })),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { naziv, adresa, kontaktEmail, kontaktTelefon, status } = body;

  await prisma.pokrovitelj.update({
    where: { id },
    data: {
      ...(naziv !== undefined && { naziv }),
      ...(adresa !== undefined && { adresa }),
      ...(kontaktEmail !== undefined && { kontaktEmail: kontaktEmail || null }),
      ...(kontaktTelefon !== undefined && { kontaktTelefon }),
      ...(status !== undefined && { status }),
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.user.id,
      akcija: "POKROVITELJ_AZURIRAN",
      targetId: id,
      detalji: JSON.stringify(body),
    },
  });

  return NextResponse.json({ ok: true });
}
