import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MIN_STOPA, MAX_STOPA, MAX_SATI, procenaPredlozenog } from "@/lib/protokol/zadaci";
import { ZadatakMod } from "@/generated/prisma/client";

// POST /api/admin/zadaci — kreiranje zadatka (Faza 1: Fondacija/admin, čl. 4)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const {
    naslov, opis, cilj, kriterijumi, izvor, mod,
    stopaPoSatu, maxSati, iznosUCelosti, gornjaGranica,
    brojIzvrsilaca, minIndeks, saOdobravanjem, kvalFilter,
    rokPrijave, rokIzvrsenja, krugId,
  } = body;

  if (!naslov?.trim() || !opis?.trim() || !cilj?.trim() || !kriterijumi?.trim())
    return NextResponse.json({ error: "Naslov, opis, cilj i kriterijumi su obavezni." }, { status: 400 });
  if (!["FONDACIJA", "KRUG", "PROJEKAT"].includes(izvor))
    return NextResponse.json({ error: "Nevalidan izvor." }, { status: 400 });
  if (mod !== "PO_SATU" && mod !== "U_CELOSTI")
    return NextResponse.json({ error: "Nevalidan mod obračuna." }, { status: 400 });

  let stopa: number | null = null;
  let maxS: number | null = null;
  let iznos: number | null = null;

  if (mod === "PO_SATU") {
    stopa = Number(stopaPoSatu);
    if (!Number.isInteger(stopa) || stopa < MIN_STOPA || stopa > MAX_STOPA)
      return NextResponse.json({ error: `Stopa mora biti ${MIN_STOPA}–${MAX_STOPA} POEN/sat.` }, { status: 400 });
    maxS = Number(maxSati ?? MAX_SATI);
    if (!Number.isInteger(maxS) || maxS < 1 || maxS > MAX_SATI)
      return NextResponse.json({ error: `Max sati mora biti 1–${MAX_SATI}.` }, { status: 400 });
  } else {
    iznos = Number(iznosUCelosti);
    if (!Number.isInteger(iznos) || iznos <= 0)
      return NextResponse.json({ error: "Iznos u celosti mora biti pozitivan ceo broj." }, { status: 400 });
  }

  let granica: number | null = null;
  if (gornjaGranica != null && gornjaGranica !== "") {
    granica = Number(gornjaGranica);
    if (!Number.isInteger(granica) || granica <= 0)
      return NextResponse.json({ error: "Gornja granica mora biti pozitivan ceo broj." }, { status: 400 });
  }

  const broj = Number(brojIzvrsilaca ?? 1);
  if (!Number.isInteger(broj) || broj < 1)
    return NextResponse.json({ error: "Broj izvršilaca mora biti najmanje 1." }, { status: 400 });

  const indeks = Number(minIndeks ?? 10);
  if (!Number.isInteger(indeks) || indeks < 10 || indeks > 100)
    return NextResponse.json({ error: "Min. indeks mora biti 10–100." }, { status: 400 });

  const predlozeniPoen = procenaPredlozenog({
    mod: mod as ZadatakMod,
    maxSati: maxS,
    stopaPoSatu: stopa,
    iznosUCelosti: iznos,
  });

  const zadatak = await prisma.zadatak.create({
    data: {
      naslov: naslov.trim(),
      opis: opis.trim(),
      cilj: cilj.trim(),
      kriterijumi: kriterijumi.trim(),
      izvor,
      mod,
      stopaPoSatu: stopa,
      maxSati: maxS,
      iznosUCelosti: iznos,
      gornjaGranica: granica,
      predlozeniPoen,
      brojIzvrsilaca: broj,
      minIndeks: indeks,
      saOdobravanjem: Boolean(saOdobravanjem),
      kvalFilter: kvalFilter?.trim() || null,
      rokPrijave: rokPrijave ? new Date(rokPrijave) : null,
      rokIzvrsenja: rokIzvrsenja ? new Date(rokIzvrsenja) : null,
      krugId: krugId || null,
      createdById: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, id: zadatak.id });
}

// GET /api/admin/zadaci — lista svih zadataka
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const zadaci = await prisma.zadatak.findMany({
    include: {
      createdBy: { select: { pseudonim: true } },
      krug: { select: { name: true } },
      _count: {
        select: {
          prijave: true,
          izvrsenja: { where: { status: "PODNETO" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    zadaci: zadaci.map((z) => ({
      id: z.id,
      naslov: z.naslov,
      izvor: z.izvor,
      mod: z.mod,
      stopaPoSatu: z.stopaPoSatu,
      iznosUCelosti: z.iznosUCelosti,
      predlozeniPoen: z.predlozeniPoen,
      brojIzvrsilaca: z.brojIzvrsilaca,
      saOdobravanjem: z.saOdobravanjem,
      rokPrijave: z.rokPrijave?.toISOString() ?? null,
      status: z.status,
      createdByPseudonim: z.createdBy.pseudonim,
      krugName: z.krug?.name ?? null,
      ukupnoPrijava: z._count.prijave,
      pendingIzvrsenja: z._count.izvrsenja,
      createdAt: z.createdAt.toISOString(),
    })),
  });
}
