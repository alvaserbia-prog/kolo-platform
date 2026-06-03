import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const korisnici = await prisma.user.findMany({
    where: {
      pseudonim: { contains: q, mode: "insensitive" },
      status: { not: "EXCLUDED" },
      tipKorisnika: { not: "POCETNI" },
      id: { not: session.user.id },
    },
    select: {
      id: true,
      pseudonim: true,
      verified: true,
      location: true,
    },
    take: 10,
    orderBy: { pseudonim: "asc" },
  });

  return NextResponse.json(korisnici);
}
