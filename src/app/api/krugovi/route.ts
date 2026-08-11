import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { kljucPseudonima } from "@/lib/validacija";
import { razresiNaselje, PORUKA_MESTO_IZ_SPISKA } from "@/lib/naselje";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { KRUG_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";

// GET /api/krugovi — lista svih aktivnih krug
export async function GET() {
  if (!KRUG_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
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
  if (!KRUG_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  if (!session.user.verified)
    return await greska("Samo verifikovani korisnici mogu podneti zahtev.", 403);

  const body = await req.json();
  const name = (body.name ?? "").trim();
  const description = (body.description ?? "").trim();
  const location = (body.location ?? "").trim();
  const osnivaci: string[] = body.osnivaci ?? [];

  if (!name || name.length < 3)
    return await greska("Naziv mora imati najmanje 3 karaktera.", 400);
  // Sedište kruga je opciono, ali kad se navede mora biti naselje iz šifarnika.
  const mesto = location ? razresiNaselje(location) : null;
  if (location && !mesto)
    return await greska(PORUKA_MESTO_IZ_SPISKA, 400);
  if (osnivaci.length < 4)
    return await greska("Potrebno je navesti pseudonime najmanje 4 osnivača (pored vas, ukupno 5).", 400);

  // Proveri da naziv nije zauzet
  const postojeca = await prisma.krug.findUnique({ where: { name } });
  if (postojeca)
    return await greska("Krug sa ovim nazivom već postoji.", 400);

  // Pronađi korisnike po pseudonimu (forma šalje pseudonime)
  const osnivaciKorisnici = await prisma.user.findMany({
    where: { pseudonimLower: { in: osnivaci.map(kljucPseudonima) } },
    select: { id: true, verified: true, pseudonim: true },
  });

  if (osnivaciKorisnici.length !== osnivaci.length)
    return await greska("Jedan ili više osnivača nije pronađen.", 400);
  if (osnivaciKorisnici.some((k) => !k.verified))
    return await greska("Svi osnivači moraju biti verifikovani.", 400);

  const osnivaciIds = osnivaciKorisnici.map((k) => k.id).filter((id) => id !== session.user.id);
  const sviOsnivaci = [session.user.id, ...osnivaciIds];

  if (sviOsnivaci.length < 5)
    return await greska("Potrebno je 5 različitih osnivača. Ne unosite sopstveni pseudonim u listu.", 400);

  // Proveri verifikaciju inicijatora (već provereno gore, ali proveri i njega)
  const inicijator = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verified: true },
  });
  if (!inicijator?.verified)
    return await greska("Inicijator mora biti verifikovan.", 403);

  await prisma.krugOsnivanjeZahtev.create({
    data: {
      name,
      description: description || null,
      location: mesto,
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
