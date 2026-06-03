import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { granicePeriodaGlasanja, fazaPredloga, zatvoriIstekleIObjaviIshod, postojiSkoroOdbijen } from "@/lib/protokol/glasanje";
import { dohvatiFazuStatus } from "@/lib/protokol/faza-sistema";

// GET /api/glasanje — lista predloga
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  // Zatvori istekle i utvrdi ishod (čl. 13)
  await zatvoriIstekleIObjaviIshod();

  const predlozi = await prisma.glasanjePredlog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { pseudonim: true } },
      _count: { select: { glasovi: true } },
    },
  });

  return NextResponse.json({
    predlozi: predlozi.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      authorPseudonim: p.author.pseudonim,
      glasanjePocetak: p.glasanjePocetak.toISOString(),
      deadline: p.deadline.toISOString(),
      status: p.status,
      faza: fazaPredloga(p),
      ishodUsvojen: p.ishodUsvojen,
      zaZbir: p.zaZbir,
      protivZbir: p.protivZbir,
      brGlasova: p._count.glasovi,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

// POST /api/glasanje — kreiraj predlog
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  // Glasanje Gornjeg Kola je operativno tek u Fazi 2 (čl. 3, 24)
  const faza = await dohvatiFazuStatus();
  if (faza.faza !== "FAZA_2")
    return NextResponse.json({ error: "Glasanje Gornjeg Kola je operativno tek u Fazi 2." }, { status: 403 });

  // Samo nosioci sa aktivnim ZRNOM mogu predlagati (čl. 10)
  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } });
  if (!stanje || stanje.aktivno <= 0)
    return NextResponse.json({ error: "Potrebno je imati aktivnih ZRNA za kreiranje predloga." }, { status: 403 });

  const body = await req.json();
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();

  if (!title || title.length < 5)
    return NextResponse.json({ error: "Naslov mora imati najmanje 5 karaktera." }, { status: 400 });
  if (!description || description.length < 20)
    return NextResponse.json({ error: "Opis mora imati najmanje 20 karaktera." }, { status: 400 });

  // Neusvojen predlog iste sadržine ne sme ponovo pre 30 dana (čl. 22)
  if (await postojiSkoroOdbijen(title))
    return NextResponse.json({ error: "Predlog iste sadržine je nedavno odbijen — ponovno predlaganje moguće je tek po isteku 30 dana (čl. 22)." }, { status: 400 });

  // Rok ne određuje predlagač — glasanje je u narednom obračunskom periodu (čl. 11)
  const { glasanjePocetak, deadline } = granicePeriodaGlasanja(new Date());

  const predlog = await prisma.glasanjePredlog.create({
    data: { title, description, authorId: session.user.id, glasanjePocetak, deadline },
  });

  return NextResponse.json({ ok: true, id: predlog.id });
}
