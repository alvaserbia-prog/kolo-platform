import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { beogradskiDan } from "@/lib/protokol/obracunski-dan";

// POST /api/zrno/zakljucaj — SLOBODNO → AKTIVNO (period čekanja 1 dan)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  if (!session.user.verified) return await greska("Verifikacija potrebna.", 403);

  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } });
  if (!stanje || stanje.slobodno <= 0)
    return await greska("Nemate slobodnih ZRNA.", 400);

  const body = await req.json();
  const kolicina = Number(body.kolicina);
  if (!kolicina || kolicina <= 0 || !Number.isInteger(kolicina))
    return await greska("Unesite pozitivan ceo broj ZRNA.", 400);
  if (kolicina > stanje.slobodno)
    return await greska(`Imate ${stanje.slobodno} slobodnih ZRNA.`, 400);

  const danas = beogradskiDan();

  await prisma.zrnoStatusZahtev.create({
    data: { userId: session.user.id, kolicina, akcija: "ZAKLJUCAJ", date: danas },
  });

  void posaljiAdminAlert(
    "Zahtev za zaključavanje ZRNA",
    `Korisnik: ${session.user.pseudonim}\nKoličina: ${kolicina.toLocaleString("sr-RS")} ZRNA`
  );

  return NextResponse.json({ ok: true, poruka: "Zahtev primljen. Zaključavanje se izvršava u ponoć." });
}
