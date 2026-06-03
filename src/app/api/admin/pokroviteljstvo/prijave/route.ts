import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/pokroviteljstvo/prijave — sve prijave pokroviteljstva
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

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
