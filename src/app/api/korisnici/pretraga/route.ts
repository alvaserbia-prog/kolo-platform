import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/korisnici/pretraga?q=... — autocomplete pseudonima
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ rezultati: [] });

  const korisnici = await prisma.user.findMany({
    where: {
      pseudonim: { contains: q, mode: "insensitive" },
      id: { not: session.user.id }, // ne prikazuj sebe
    },
    select: { pseudonim: true, verified: true },
    take: 6,
    orderBy: { pseudonim: "asc" },
  });

  return NextResponse.json({ rezultati: korisnici.map((k) => k.pseudonim) });
}
