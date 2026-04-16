import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/zrno/zakljucaj — SLOBODNO → AKTIVNO (period čekanja 1 dan)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } });
  if (!stanje || stanje.slobodno <= 0)
    return NextResponse.json({ error: "Nemate slobodnih ZRNA." }, { status: 400 });

  const body = await req.json();
  const kolicina = Number(body.kolicina);
  if (!kolicina || kolicina <= 0 || !Number.isInteger(kolicina))
    return NextResponse.json({ error: "Unesite pozitivan ceo broj ZRNA." }, { status: 400 });
  if (kolicina > stanje.slobodno)
    return NextResponse.json({ error: `Imate ${stanje.slobodno} slobodnih ZRNA.` }, { status: 400 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  await prisma.zrnoStatusZahtev.create({
    data: { userId: session.user.id, kolicina, akcija: "ZAKLJUCAJ", date: danas },
  });

  void posaljiAdminAlert(
    "Zahtev za zaključavanje ZRNA",
    `Korisnik: ${session.user.pseudonim}\nKoličina: ${kolicina.toLocaleString("sr-RS")} ZRNA`
  );

  return NextResponse.json({ ok: true, poruka: "Zahtev primljen. Zaključavanje se izvršava u ponoć." });
}
