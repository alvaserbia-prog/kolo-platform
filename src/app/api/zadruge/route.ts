import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/zadruge — lista svih aktivnih zadruga
export async function GET() {
  const zadruge = await prisma.zadruga.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
    include: {
      wallet: { select: { balance: true } },
      _count: { select: { memberships: { where: { leftAt: null } } } },
    },
  });

  return NextResponse.json({
    zadruge: zadruge.map((z) => ({
      id: z.id,
      name: z.name,
      description: z.description,
      location: z.location,
      balance: z.wallet?.balance ?? 0,
      clanovi: z._count.memberships,
    })),
  });
}

// POST /api/zadruge — zahtev za osnivanje (samo verifikovani)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnici mogu podneti zahtev." }, { status: 403 });

  const body = await req.json();
  const name = (body.name ?? "").trim();
  const description = (body.description ?? "").trim();
  const location = (body.location ?? "").trim();
  const osnivaci: string[] = body.osnivaci ?? [];

  if (!name || name.length < 3)
    return NextResponse.json({ error: "Naziv mora imati najmanje 3 karaktera." }, { status: 400 });
  if (osnivaci.length < 4)
    return NextResponse.json({ error: "Potrebno je najmanje 5 osnivača (uključujući vas)." }, { status: 400 });

  // Proveri da naziv nije zauzet
  const postojeca = await prisma.zadruga.findUnique({ where: { name } });
  if (postojeca)
    return NextResponse.json({ error: "Zadruga sa ovim nazivom već postoji." }, { status: 400 });

  // Pronađi korisnike po pseudonimu (forma šalje pseudonime)
  const osnivaciKorisnici = await prisma.user.findMany({
    where: { pseudonim: { in: osnivaci } },
    select: { id: true, verified: true, pseudonim: true },
  });

  if (osnivaciKorisnici.length !== osnivaci.length)
    return NextResponse.json({ error: "Jedan ili više osnivača nije pronađen." }, { status: 400 });
  if (osnivaciKorisnici.some((k) => !k.verified))
    return NextResponse.json({ error: "Svi osnivači moraju biti verifikovani." }, { status: 400 });

  const osnivaciIds = osnivaciKorisnici.map((k) => k.id).filter((id) => id !== session.user.id);
  const sviOsnivaci = [session.user.id, ...osnivaciIds];

  if (sviOsnivaci.length < 5)
    return NextResponse.json({ error: "Potrebno je najmanje 5 različitih osnivača." }, { status: 400 });

  // Proveri verifikaciju inicijatora (već provereno gore, ali proveri i njega)
  const inicijator = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verified: true },
  });
  if (!inicijator?.verified)
    return NextResponse.json({ error: "Inicijator mora biti verifikovan." }, { status: 403 });

  await prisma.zadrugaOsnivanjeZahtev.create({
    data: {
      name,
      description: description || null,
      location: location || null,
      inicijatorId: session.user.id,
      osnivaci: sviOsnivaci,
    },
  });

  return NextResponse.json({ ok: true });
}
