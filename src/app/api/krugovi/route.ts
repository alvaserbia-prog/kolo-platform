import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// GET /api/krugovi — lista svih aktivnih krug
export async function GET() {
  const krugovi = await prisma.krug.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
    include: {
      wallet: { select: { balance: true } },
      _count: { select: { memberships: { where: { leftAt: null } } } },
    },
  });

  return NextResponse.json({
    krugovi: krugovi.map((z) => ({
      id: z.id,
      name: z.name,
      description: z.description,
      location: z.location,
      balance: z.wallet?.balance ?? 0,
      clanovi: z._count.memberships,
    })),
  });
}

// POST /api/krugovi — zahtev za osnivanje (samo verifikovani)
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
    return NextResponse.json({ error: "Potrebno je navesti pseudonime najmanje 4 osnivača (pored vas, ukupno 5)." }, { status: 400 });

  // Proveri da naziv nije zauzet
  const postojeca = await prisma.krug.findUnique({ where: { name } });
  if (postojeca)
    return NextResponse.json({ error: "Krug sa ovim nazivom već postoji." }, { status: 400 });

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
    return NextResponse.json({ error: "Potrebno je 5 različitih osnivača. Ne unosite sopstveni pseudonim u listu." }, { status: 400 });

  // Proveri verifikaciju inicijatora (već provereno gore, ali proveri i njega)
  const inicijator = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verified: true },
  });
  if (!inicijator?.verified)
    return NextResponse.json({ error: "Inicijator mora biti verifikovan." }, { status: 403 });

  await prisma.krugOsnivanjeZahtev.create({
    data: {
      name,
      description: description || null,
      location: location || null,
      inicijatorId: session.user.id,
      osnivaci: sviOsnivaci,
    },
  });

  void posaljiAdminAlert(
    "Zahtev za osnivanje krugovi",
    `Naziv: ${name}\nInicijator: ${session.user.pseudonim}\nOsnivači: ${sviOsnivaci.length}`
  );

  return NextResponse.json({ ok: true });
}
