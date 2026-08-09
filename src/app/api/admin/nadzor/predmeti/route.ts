/**
 * GET /api/admin/nadzor/predmeti — nadzorni predmeti (dokaz stvarnosti 4.2.0, čl. 11a).
 *
 * Predmet nastaje kad nadzornik evidentira ishod „za proveru" ili „sporno".
 * Vidi ga SAMO superadmin (UO Fondacije) — ne ostali nadzornici, ne verifikator,
 * ne verifikovani, ne javnost (čl. 11a st. 2).
 *
 * Panel je alat, ne organ: sam predmet ne proizvodi dejstvo prema korisniku.
 * Lažnu verifikaciju utvrđuje UO (čl. 18).
 */
import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import type { NadzorniPredmetStatus } from "@/generated/prisma/client";

const PRIKAZI: Record<string, NadzorniPredmetStatus[]> = {
  otvoreni: ["OTVOREN"],
  reseni: ["UTVRDJENA_LAZNA", "NEMA_OSNOVA"],
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return await greska("Pristup odbijen.", 403);

  const prikaz = req.nextUrl.searchParams.get("prikaz") ?? "otvoreni";
  const statusi = PRIKAZI[prikaz] ?? PRIKAZI.otvoreni;

  const predmeti = await prisma.nadzorniPredmet.findMany({
    where: { status: { in: statusi } },
    orderBy: { otvorenAt: "desc" },
    take: 200,
    include: {
      resenBy: { select: { pseudonim: true } },
      verifikacija: {
        include: {
          verifikator: {
            select: { id: true, pseudonim: true, indeksStvarnosti: true, slotoviPotroseni: true },
          },
          verifikovani: {
            select: {
              id: true,
              pseudonim: true,
              indeksStvarnosti: true,
              createdAt: true,
              utvrdjenNepostojeci: true,
            },
          },
          nadzorZapisi: {
            orderBy: { createdAt: "asc" },
            include: { nadzornik: { select: { pseudonim: true } } },
          },
        },
      },
    },
  });

  const otvorenih = await prisma.nadzorniPredmet.count({ where: { status: "OTVOREN" } });

  return NextResponse.json({
    otvorenih,
    predmeti: predmeti.map((p) => ({
      id: p.id,
      status: p.status,
      subjekt: p.subjekt,
      razlog: p.razlog,
      opis: p.opis,
      otvorenAt: p.otvorenAt.toISOString(),
      resenAt: p.resenAt?.toISOString() ?? null,
      resenBy: p.resenBy?.pseudonim ?? null,
      beleska: p.beleska,
      verifikacijaId: p.verifikacijaId,
      verifikator: p.verifikacija.verifikator,
      verifikovani: {
        ...p.verifikacija.verifikovani,
        createdAt: p.verifikacija.verifikovani.createdAt.toISOString(),
        utvrdjenNepostojeci:
          p.verifikacija.verifikovani.utvrdjenNepostojeci?.toISOString() ?? null,
      },
      vremenskiZig: p.verifikacija.vremenskiZig.toISOString(),
      zapisi: p.verifikacija.nadzorZapisi.map((z) => ({
        id: z.id,
        ishod: z.ishod,
        razlog: z.razlog,
        subjekt: z.subjekt,
        opis: z.opis,
        nadzornik: z.nadzornik.pseudonim,
        createdAt: z.createdAt.toISOString(),
      })),
    })),
  });
}
