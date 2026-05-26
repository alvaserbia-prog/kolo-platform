import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/zadaci/[id] — detalji zadatka + moja prijava i izvršenja
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id } = await params;
  const z = await prisma.zadatak.findUnique({
    where: { id },
    include: {
      createdBy: { select: { pseudonim: true } },
      krug: { select: { name: true } },
      _count: { select: { prijave: { where: { status: "PRIMLJENA" } } } },
    },
  });
  if (!z) return NextResponse.json({ error: "Zadatak nije pronađen." }, { status: 404 });

  const prijava = await prisma.zadatakPrijava.findUnique({
    where: { zadatakId_userId: { zadatakId: id, userId: session.user.id } },
    include: {
      izvrsenja: { orderBy: { datum: "desc" } },
    },
  });

  return NextResponse.json({
    zadatak: {
      id: z.id,
      naslov: z.naslov,
      opis: z.opis,
      cilj: z.cilj,
      kriterijumi: z.kriterijumi,
      izvor: z.izvor,
      mod: z.mod,
      stopaPoSatu: z.stopaPoSatu,
      maxSati: z.maxSati,
      iznosUCelosti: z.iznosUCelosti,
      gornjaGranica: z.gornjaGranica,
      predlozeniPoen: z.predlozeniPoen,
      brojIzvrsilaca: z.brojIzvrsilaca,
      minIndeks: z.minIndeks,
      saOdobravanjem: z.saOdobravanjem,
      kvalFilter: z.kvalFilter,
      rokPrijave: z.rokPrijave?.toISOString() ?? null,
      rokIzvrsenja: z.rokIzvrsenja?.toISOString() ?? null,
      status: z.status,
      createdByPseudonim: z.createdBy.pseudonim,
      krugName: z.krug?.name ?? null,
      primljeniIzvrsioci: z._count.prijave,
      createdAt: z.createdAt.toISOString(),
    },
    mojaPrijava: prijava
      ? {
          id: prijava.id,
          status: prijava.status,
          planIzvrsenja: prijava.planIzvrsenja,
          odbijenaRazlog: prijava.odbijenaRazlog,
          izvrsenja: prijava.izvrsenja.map((iz) => ({
            id: iz.id,
            datum: iz.datum.toISOString(),
            sati: iz.sati,
            dokaz: iz.dokaz,
            tezina: iz.tezina,
            status: iz.status,
            obrazlozenje: iz.obrazlozenje,
            evidentiraniPoen: iz.evidentiraniPoen,
            createdAt: iz.createdAt.toISOString(),
          })),
        }
      : null,
  });
}
