import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pokrovitelji = await prisma.pokrovitelj.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      naziv: true,
      pib: true,
      adresa: true,
      krugId: true,
      krug: { select: { name: true } },
      rsdKumulativ: true,
      trenutniNivo: true,
      createdAt: true,
    },
    orderBy: { rsdKumulativ: "desc" },
  });

  return NextResponse.json(
    pokrovitelji.map((p) => ({
      ...p,
      rsdKumulativ: Number(p.rsdKumulativ),
    }))
  );
}
