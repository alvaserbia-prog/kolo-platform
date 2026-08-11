import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeAdmin } from "@/lib/dozvole";
import { POKROVITELJSTVO_AKTIVNO, PORUKA_MODUL_UGASEN } from "@/lib/moduli";

// GET /api/admin/pokroviteljstvo/prijave — sve prijave pokroviteljstva
export async function GET() {
  if (!POKROVITELJSTVO_AKTIVNO) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return await greska("Pristup odbijen.", 403);

  const prijave = await prisma.pokroviteljPrijava.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { podnosilac: { select: { pseudonim: true } } },
  });

  return NextResponse.json(
    prijave.map((p) => ({
      id: p.id,
      podnosilacPseudonim: p.podnosilac.pseudonim,
      naziv: p.naziv,
      pib: p.pib,
      vrstaDonacije: p.vrstaDonacije,
      vrednostRsd: Number(p.vrednostRsd),
      imaCenovnik: !!p.cenovnikSlika,
      status: p.status,
      odbijenoRazlog: p.odbijenoRazlog,
      createdAt: p.createdAt.toISOString(),
    }))
  );
}
