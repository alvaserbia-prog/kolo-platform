import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { azurirajVetoStatus } from "@/lib/protokol/fondacija";

const KATEGORIJE = ["PLATA", "INFRASTRUKTURA", "PRAVNI_TROSAK", "SOFTWARE", "ADMINISTRATIVNO", "OPERATIVNO", "DRUGO"] as const;
type Kategorija = typeof KATEGORIJE[number];

/**
 * GET /api/admin/fondacija/trosak — sva evidencija troskova (admin)
 * POST /api/admin/fondacija/trosak — evidentira novi trosak
 *   body: { datum: ISO, iznosRSD: number, kategorija: enum, opis: string, dokumentUrl?: string }
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  const troskovi = await prisma.fondacijaTrosak.findMany({
    include: { kreirao: { select: { pseudonim: true } } },
    orderBy: { datum: "desc" },
  });
  return NextResponse.json({
    troskovi: troskovi.map((t) => ({ ...t, iznosRSD: Number(t.iznosRSD) })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  const body = await req.json();
  const { datum, iznosRSD, kategorija, opis, dokumentUrl } = body;

  if (!datum || typeof iznosRSD !== "number" || iznosRSD <= 0 || !kategorija || !opis) {
    return NextResponse.json({ error: "Nedostaju polja ili je iznos neispravan." }, { status: 400 });
  }
  if (!KATEGORIJE.includes(kategorija as Kategorija)) {
    return NextResponse.json({ error: "Nepoznata kategorija." }, { status: 400 });
  }

  const trosak = await prisma.fondacijaTrosak.create({
    data: {
      datum: new Date(datum),
      iznosRSD,
      kategorija: kategorija as Kategorija,
      opis,
      dokumentUrl,
      kreiraoId: session.user.id,
    },
  });

  // Posle svake izmene troskova, azuriraj veto status (mozda saldo Fondacije promenio prag)
  await azurirajVetoStatus();

  return NextResponse.json({ trosak: { ...trosak, iznosRSD: Number(trosak.iznosRSD) } });
}
