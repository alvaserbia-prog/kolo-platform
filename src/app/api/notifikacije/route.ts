import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — lista notifikacija za trenutnog korisnika
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifikacije = await prisma.notifikacija.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, tip: true, naslov: true, tekst: true, procitana: true, link: true, createdAt: true },
  });

  const neprocitano = await prisma.notifikacija.count({
    where: { userId: session.user.id, procitana: false },
  });

  return NextResponse.json({ notifikacije, neprocitano });
}

// PATCH — označi sve kao pročitane
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.notifikacija.updateMany({
    where: { userId: session.user.id, procitana: false },
    data: { procitana: true },
  });

  return NextResponse.json({ ok: true });
}
