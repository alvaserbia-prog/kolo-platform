import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/zadaci — lista otvorenih / aktivnih zadataka + status moje prijave
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const zadaci = await prisma.zadatak.findMany({
    where: { status: { in: ["OTVOREN", "U_IZVRSENJU"] } },
    include: {
      createdBy: { select: { pseudonim: true } },
      krug: { select: { name: true } },
      _count: { select: { prijave: { where: { status: "PRIMLJENA" } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mojePrijave = await prisma.zadatakPrijava.findMany({
    where: { userId: session.user.id },
    select: { zadatakId: true, status: true },
  });
  const prijaveMap = Object.fromEntries(mojePrijave.map((p) => [p.zadatakId, p.status]));

  return NextResponse.json({
    zadaci: zadaci.map((z) => ({
      id: z.id,
      naslov: z.naslov,
      opis: z.opis,
      cilj: z.cilj,
      izvor: z.izvor,
      mod: z.mod,
      stopaPoSatu: z.stopaPoSatu,
      maxSati: z.maxSati,
      iznosUCelosti: z.iznosUCelosti,
      predlozeniPoen: z.predlozeniPoen,
      brojIzvrsilaca: z.brojIzvrsilaca,
      minIndeks: z.minIndeks,
      saOdobravanjem: z.saOdobravanjem,
      rokPrijave: z.rokPrijave?.toISOString() ?? null,
      rokIzvrsenja: z.rokIzvrsenja?.toISOString() ?? null,
      status: z.status,
      createdByPseudonim: z.createdBy.pseudonim,
      krugName: z.krug?.name ?? null,
      primljeniIzvrsioci: z._count.prijave,
      createdAt: z.createdAt.toISOString(),
      mojaPrijava: prijaveMap[z.id] ?? null,
    })),
  });
}
