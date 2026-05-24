import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/zrno/otpis — rezervacija otpisa ZRNA (izvršava se u ponoć)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const trziste = await prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } });
  if (!trziste?.isActive) return NextResponse.json({ error: "ZRNO tržište nije aktivno." }, { status: 400 });

  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } });
  if (!stanje || stanje.slobodno <= 0)
    return NextResponse.json({ error: "Nemate slobodnih ZRNA za prodaju." }, { status: 400 });

  const body = await req.json();
  const kolicina = Number(body.kolicina);
  if (!kolicina || kolicina <= 0 || !Number.isInteger(kolicina))
    return NextResponse.json({ error: "Unesite pozitivan ceo broj ZRNA." }, { status: 400 });
  if (kolicina > stanje.slobodno)
    return NextResponse.json({ error: `Imate ${stanje.slobodno} slobodnih ZRNA.` }, { status: 400 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const vec = await prisma.zrnoProdajaZahtev.findUnique({
    where: { userId_date: { userId: session.user.id, date: danas } },
  });
  if (vec && vec.status === "PENDING")
    return NextResponse.json({ error: "Već postoji aktivan zahtev za prodaju danas." }, { status: 400 });

  await prisma.zrnoProdajaZahtev.upsert({
    where: { userId_date: { userId: session.user.id, date: danas } },
    create: { userId: session.user.id, kolicina, date: danas },
    update: { kolicina, status: "PENDING" },
  });

  void posaljiAdminAlert(
    "Zahtev za prodaju ZRNA",
    `Korisnik: ${session.user.pseudonim}\nKoličina: ${kolicina.toLocaleString("sr-RS")} ZRNA`
  );

  return NextResponse.json({ ok: true, poruka: "Zahtev primljen. Biće obrađen u ponoć." });
}
