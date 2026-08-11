import { greska } from "@/lib/greska-api";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { POKROVITELJSTVO_AKTIVNO, PORUKA_MODUL_UGASEN } from "@/lib/moduli";

export async function GET() {
  if (!POKROVITELJSTVO_AKTIVNO) return await greska(PORUKA_MODUL_UGASEN, 410);
  const pokrovitelji = await prisma.pokrovitelj.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      naziv: true,
      pib: true,
      adresa: true,
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
