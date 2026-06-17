import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  // V2: pretraga otkriva pseudonime — dostupna samo korisnicima sa punim pristupom
  // (verifikovan, indeks ≥ 10%). Neverifikovani ne smeju da vide pseudonime drugih.
  if (!session.user.verified) {
    return NextResponse.json({ error: "Verifikacija potrebna." }, { status: 403 });
  }
  // Anti-scraping: 30 pretraga u 10s po korisniku.
  if (!rateLimit(`pretraga:${session.user.id}`, 30, 10_000).ok) {
    return NextResponse.json([], { status: 429 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const korisnici = await prisma.user.findMany({
    where: {
      pseudonim: { contains: q, mode: "insensitive" },
      status: { not: "EXCLUDED" },
      id: { not: session.user.id },
    },
    select: {
      id: true,
      pseudonim: true,
      verified: true,
      // `location` se NE vraća u pretrazi — privatan podatak; vidljiv samo na profilu
      // po togglu vidljivosti.
    },
    take: 10,
    orderBy: { pseudonim: "asc" },
  });

  return NextResponse.json(korisnici);
}
