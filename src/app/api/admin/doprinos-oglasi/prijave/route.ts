import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/doprinos-oglasi/prijave — sve pending prijave
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const prijave = await prisma.oglasPrijava.findMany({
    where: { status: "PENDING" },
    include: {
      user: { select: { pseudonim: true } },
      oglas: { select: { title: true, predlozeniPoen: true, positions: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    prijave: prijave.map((p) => ({
      id: p.id,
      pseudonim: p.user.pseudonim,
      oglasTitle: p.oglas.title,
      predlozeniPoen: p.oglas.predlozeniPoen,
      positions: p.oglas.positions,
      planIzvrsenja: p.planIzvrsenja,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}
