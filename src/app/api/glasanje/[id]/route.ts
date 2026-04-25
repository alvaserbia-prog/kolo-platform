import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { izracunajGlasove } from "@/lib/protokol/zrno";

// GET /api/glasanje/[id] — detalji predloga + rezultati
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;
  const predlog = await prisma.glasanjePredlog.findUnique({
    where: { id },
    include: {
      author: { select: { pseudonim: true } },
      glasovi: true,
    },
  });

  if (!predlog) return NextResponse.json({ error: "Predlog nije pronađen." }, { status: 404 });

  // Auto-close expired
  if (predlog.status === "ACTIVE" && predlog.deadline < new Date()) {
    await prisma.glasanjePredlog.update({ where: { id }, data: { status: "CLOSED" } });
    predlog.status = "CLOSED";
  }

  const mojGlas = predlog.glasovi.find((g) => g.userId === session.user.id);
  const zaGlasova = predlog.glasovi.filter((g) => g.za).reduce((s, g) => s + g.glasackaGlasova, 0);
  const protiGlasova = predlog.glasovi.filter((g) => !g.za).reduce((s, g) => s + g.glasackaGlasova, 0);

  // Moja glasačka moć (za prikaz)
  const mojGlasoviBroj = await izracunajGlasove(session.user.id);

  return NextResponse.json({
    id: predlog.id,
    title: predlog.title,
    description: predlog.description,
    authorPseudonim: predlog.author.pseudonim,
    deadline: predlog.deadline.toISOString(),
    status: predlog.status,
    zaGlasova,
    protiGlasova,
    mojGlas: mojGlas ? { za: mojGlas.za, glasackaGlasova: mojGlas.glasackaGlasova } : null,
    mojGlasoviBroj,
    createdAt: predlog.createdAt.toISOString(),
  });
}
