import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/zrno/otkljucaj — AKTIVNO → SLOBODNO (period čekanja 1 dan)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Verifikacija potrebna." }, { status: 403 });

  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } });
  if (!stanje || stanje.aktivno <= 0)
    return NextResponse.json({ error: "Nemate aktivnih ZRNA." }, { status: 400 });

  const body = await req.json();
  const kolicina = Number(body.kolicina);
  if (!kolicina || kolicina <= 0 || !Number.isInteger(kolicina))
    return NextResponse.json({ error: "Unesite pozitivan ceo broj ZRNA." }, { status: 400 });
  if (kolicina > stanje.aktivno)
    return NextResponse.json({ error: `Imate ${stanje.aktivno} aktivnih ZRNA.` }, { status: 400 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  await prisma.zrnoStatusZahtev.create({
    data: { userId: session.user.id, kolicina, akcija: "OTKLJUCAJ", date: danas },
  });

  void posaljiAdminAlert(
    "Zahtev za otključavanje ZRNA",
    `Korisnik: ${session.user.pseudonim}\nKoličina: ${kolicina.toLocaleString("sr-RS")} ZRNA`
  );

  return NextResponse.json({ ok: true, poruka: "Zahtev primljen. Otključavanje se izvršava u ponoć." });
}
