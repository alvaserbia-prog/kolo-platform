import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/zaposljavnje/oglasi — kreiranje oglasa
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { title, description, source, hourlyRate, maxHoursPerDay, positions, deadline, zadrugaId } = body;

  if (!title?.trim() || !description?.trim()) return NextResponse.json({ error: "Naziv i opis su obavezni." }, { status: 400 });
  if (!["FONDACIJA", "ZADRUGA", "PROJEKAT"].includes(source)) return NextResponse.json({ error: "Nevalidan izvor." }, { status: 400 });

  const stopa = Number(hourlyRate);
  if (!stopa || stopa < 1000 || stopa > 2500) return NextResponse.json({ error: "Stopa mora biti između 1.000 i 2.500 POEN/sat." }, { status: 400 });

  const maxSati = Number(maxHoursPerDay ?? 8);
  if (maxSati < 1 || maxSati > 8) return NextResponse.json({ error: "Max sati dnevno mora biti 1–8." }, { status: 400 });

  const oglas = await prisma.radniOglas.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      source,
      hourlyRate: stopa,
      maxHoursPerDay: maxSati,
      positions: Number(positions ?? 1),
      deadline: deadline ? new Date(deadline) : null,
      zadrugaId: zadrugaId || null,
      createdById: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, id: oglas.id });
}

// GET /api/admin/zaposljavnje/oglasi — lista svih oglasa
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const oglasi = await prisma.radniOglas.findMany({
    include: {
      createdBy: { select: { pseudonim: true } },
      zadruga: { select: { name: true } },
      _count: {
        select: {
          prijave: true,
          evidencije: { where: { status: "PENDING" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    oglasi: oglasi.map((o) => ({
      id: o.id,
      title: o.title,
      source: o.source,
      hourlyRate: o.hourlyRate,
      maxHoursPerDay: o.maxHoursPerDay,
      positions: o.positions,
      deadline: o.deadline?.toISOString() ?? null,
      status: o.status,
      createdByPseudonim: o.createdBy.pseudonim,
      zadrugaName: o.zadruga?.name ?? null,
      ukupnoPrijava: o._count.prijave,
      pendingEvidencija: o._count.evidencije,
      createdAt: o.createdAt.toISOString(),
    })),
  });
}
