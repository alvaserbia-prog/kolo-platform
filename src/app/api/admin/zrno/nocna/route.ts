import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { izvrsiZrnoOperacije } from "@/lib/protokol/zrno";
import { prisma } from "@/lib/prisma";

// POST /api/admin/zrno/nocna — manualni okidač ZRNO operacija
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  try {
    const rezultat = await izvrsiZrnoOperacije(new Date());
    return NextResponse.json({ ok: true, ...rezultat });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Greška.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/zrno/nocna — toggle ZRNO tržište
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const current = await prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } });
  const novoStanje = !(current?.isActive ?? false);

  await prisma.zrnoTrziste.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", isActive: novoStanje, activatedAt: novoStanje ? new Date() : null },
    update: { isActive: novoStanje, activatedAt: novoStanje ? new Date() : undefined },
  });

  return NextResponse.json({ ok: true, isActive: novoStanje });
}
