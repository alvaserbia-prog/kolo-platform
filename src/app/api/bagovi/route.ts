import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

/**
 * GET  /api/bagovi — javna lista svih prijavljenih bagova + status (vidljivo svim prijavljenima)
 * POST /api/bagovi — prijavi novi bag
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const bagovi = await prisma.bug.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      naslov: true,
      opis: true,
      status: true,
      odgovor: true,
      resenoAt: true,
      createdAt: true,
      userId: true,
      user: { select: { pseudonim: true } },
    },
  });

  return NextResponse.json(
    bagovi.map((b) => ({
      id: b.id,
      naslov: b.naslov,
      opis: b.opis,
      status: b.status,
      odgovor: b.odgovor,
      resenoAt: b.resenoAt,
      createdAt: b.createdAt,
      prijavio: b.user.pseudonim,
      mojBag: b.userId === session.user.id,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const body = await req.json();
  const naslov = typeof body.naslov === "string" ? body.naslov.trim() : "";
  const opis = typeof body.opis === "string" ? body.opis.trim() : "";

  if (naslov.length < 3) {
    return NextResponse.json({ error: "Naslov mora imati najmanje 3 karaktera." }, { status: 400 });
  }
  if (opis.length < 10) {
    return NextResponse.json({ error: "Opis mora imati najmanje 10 karaktera." }, { status: 400 });
  }

  // Spreči spam: najviše 5 otvorenih prijava po korisniku.
  const otvoreni = await prisma.bug.count({
    where: { userId: session.user.id, status: { in: ["PRIJAVLJEN", "U_RADU"] } },
  });
  if (otvoreni >= 5) {
    return NextResponse.json(
      { error: "Imate previše otvorenih prijava. Sačekajte da se postojeće obrade." },
      { status: 429 }
    );
  }

  const bag = await prisma.bug.create({
    data: { userId: session.user.id, naslov: naslov.slice(0, 200), opis: opis.slice(0, 4000) },
  });

  void posaljiAdminAlert(
    "Nova prijava baga",
    `Naslov: ${naslov}\nPrijavio: ${session.user.pseudonim}`
  );

  return NextResponse.json({ ok: true, id: bag.id }, { status: 201 });
}
