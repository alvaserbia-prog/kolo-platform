import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/glasanje — lista predloga
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const predlozi = await prisma.glasanjePredlog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { pseudonim: true } },
      _count: { select: { glasovi: true } },
    },
  });

  // Ažuriraj CLOSED status za predloge kojima je istekao rok
  const now = new Date();
  const toClose = predlozi.filter((p) => p.status === "ACTIVE" && p.deadline < now);
  if (toClose.length > 0) {
    await prisma.glasanjePredlog.updateMany({
      where: { id: { in: toClose.map((p) => p.id) } },
      data: { status: "CLOSED" },
    });
    toClose.forEach((p) => { p.status = "CLOSED"; });
  }

  return NextResponse.json({
    predlozi: predlozi.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      authorPseudonim: p.author.pseudonim,
      deadline: p.deadline.toISOString(),
      status: p.status,
      brGlasova: p._count.glasovi,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

// POST /api/glasanje — kreiraj predlog
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  // Samo korisnici sa aktivnim ZRNOM mogu kreirati predloge
  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } });
  if (!stanje || stanje.aktivno <= 0)
    return NextResponse.json({ error: "Potrebno je imati aktivnih ZRNA za kreiranje predloga." }, { status: 403 });

  const body = await req.json();
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const deadline = body.deadline ? new Date(body.deadline) : null;

  if (!title || title.length < 5)
    return NextResponse.json({ error: "Naslov mora imati najmanje 5 karaktera." }, { status: 400 });
  if (!description || description.length < 20)
    return NextResponse.json({ error: "Opis mora imati najmanje 20 karaktera." }, { status: 400 });
  if (!deadline || isNaN(deadline.getTime()) || deadline <= new Date())
    return NextResponse.json({ error: "Unesite validan rok u budućnosti." }, { status: 400 });

  const predlog = await prisma.glasanjePredlog.create({
    data: { title, description, authorId: session.user.id, deadline },
  });

  return NextResponse.json({ ok: true, id: predlog.id });
}
