import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/prigovori — lista svih prigovora
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI") {
    return NextResponse.json({ error: "Nije ovlašćen." }, { status: 403 });
  }

  const prigovori = await prisma.prigovorNaOdluku.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { pseudonim: true } },
    },
  });

  return NextResponse.json(prigovori);
}
