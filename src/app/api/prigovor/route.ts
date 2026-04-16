import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

/**
 * POST /api/prigovor — korisnik podnosi prigovor na odluku (čl. 38 ZZPL)
 * GET  /api/prigovor — lista sopstvenih prigovora
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const prigovori = await prisma.prigovorNaOdluku.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, tipOdluke: true, opis: true, status: true,
      odgovor: true, odgovorioAt: true, createdAt: true,
    },
  });

  return NextResponse.json(prigovori);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const body = await req.json();
  const { opis, tipOdluke } = body;

  if (!opis || opis.trim().length < 10) {
    return NextResponse.json({ error: "Opis prigovora mora imati najmanje 10 karaktera." }, { status: 400 });
  }

  const tipovi = ["VERIFIKACIJA", "SUSPENZIJA", "PROGRAM", "OSTALO"];
  if (!tipovi.includes(tipOdluke)) {
    return NextResponse.json({ error: "Nepoznat tip odluke." }, { status: 400 });
  }

  // Spreči spam: max 3 otvorena prigovora
  const otvoreni = await prisma.prigovorNaOdluku.count({
    where: { userId: session.user.id, status: { in: ["PENDING", "U_OBRADI"] } },
  });
  if (otvoreni >= 3) {
    return NextResponse.json({ error: "Imate previše otvorenih prigovora. Sačekajte odgovor na prethodne." }, { status: 429 });
  }

  const prigovor = await prisma.prigovorNaOdluku.create({
    data: {
      userId: session.user.id,
      opis: opis.trim(),
      tipOdluke,
    },
  });

  void posaljiAdminAlert(
    "Novi prigovor na odluku",
    `Tip: ${tipOdluke}\nKorisnik: ${session.user.pseudonim}`
  );

  return NextResponse.json({ ok: true, id: prigovor.id }, { status: 201 });
}
