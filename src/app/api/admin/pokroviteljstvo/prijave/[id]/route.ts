import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/pokroviteljstvo/prijave/[id] — detalji (ugovor + cenovnik)
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const p = await prisma.pokroviteljPrijava.findUnique({
    where: { id },
    include: { podnosilac: { select: { pseudonim: true } } },
  });
  if (!p) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });

  return NextResponse.json({
    id: p.id,
    podnosilacPseudonim: p.podnosilac.pseudonim,
    naziv: p.naziv,
    pib: p.pib,
    vrstaDonacije: p.vrstaDonacije,
    vrednostRsd: Number(p.vrednostRsd),
    ugovorTekst: p.ugovorTekst,
    cenovnikSlika: p.cenovnikSlika,
    status: p.status,
    odbijenoRazlog: p.odbijenoRazlog,
    createdAt: p.createdAt.toISOString(),
  });
}
