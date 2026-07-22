import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/admin/doprinos-oglasi/oglasi — kreiranje oglasa
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { title, description, predlozeniPoen, obrazlozenje, saOdobravanjem, positions, deadline, krugId } = body;

  if (!title?.trim() || !description?.trim()) return NextResponse.json({ error: "Naziv i opis su obavezni." }, { status: 400 });

  // Predloženi POEN — težinski koeficijent (čl. 5/6). Gornja granica po zadatku je
  // operativni parametar (čl. 26) koji utvrđuje UO/Gornje Kolo; ovde se primenjuje
  // samo zdravorazumski opseg kako bi se sprečili očigledno pogrešni unosi.
  const predlozeni = Number(predlozeniPoen);
  if (!Number.isInteger(predlozeni) || predlozeni < 100 || predlozeni > 10_000_000)
    return NextResponse.json({ error: "Predloženi POEN mora biti ceo broj između 100 i 10.000.000." }, { status: 400 });

  const brMesta = Number(positions ?? 1);
  if (!Number.isInteger(brMesta) || brMesta < 1 || brMesta > 1000)
    return NextResponse.json({ error: "Broj izvršilaca mora biti između 1 i 1000." }, { status: 400 });

  const oglas = await prisma.doprinosOglas.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      source: "FONDACIJA", // izvor zadatka uvek Fondacija (admin = UO); selektor uklonjen iz forme
      predlozeniPoen: predlozeni,
      obrazlozenje: typeof obrazlozenje === "string" && obrazlozenje.trim() ? obrazlozenje.trim() : null,
      saOdobravanjem: Boolean(saOdobravanjem),
      positions: brMesta,
      deadline: deadline ? new Date(deadline) : null,
      krugId: krugId || null,
      createdById: session.user.id,
    },
  });

  await logAdminAkcija(session.user.id, "DOPRINOS_OGLAS_KREIRAN", oglas.id,
    `${oglas.title} (predloženo ${predlozeni} POEN)`);

  return NextResponse.json({ ok: true, id: oglas.id });
}

// GET /api/admin/doprinos-oglasi/oglasi — lista svih oglasa
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const oglasi = await prisma.doprinosOglas.findMany({
    include: {
      createdBy: { select: { pseudonim: true } },
      krug: { select: { name: true } },
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
      predlozeniPoen: o.predlozeniPoen,
      saOdobravanjem: o.saOdobravanjem,
      positions: o.positions,
      deadline: o.deadline?.toISOString() ?? null,
      status: o.status,
      createdByPseudonim: o.createdBy.pseudonim,
      krugName: o.krug?.name ?? null,
      ukupnoPrijava: o._count.prijave,
      pendingEvidencija: o._count.evidencije,
      createdAt: o.createdAt.toISOString(),
    })),
  });
}
