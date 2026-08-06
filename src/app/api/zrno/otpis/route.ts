import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { beogradskiDan } from "@/lib/protokol/obracunski-dan";

// POST /api/zrno/otpis — rezervacija otpisa ZRNA (izvršava se u ponoć)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  if (!session.user.verified) return await greska("Verifikacija potrebna.", 403);

  const trziste = await prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } });
  if (!trziste?.isActive) return await greska("ZRNO tržište nije aktivno.", 400);

  const stanje = await prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } });
  if (!stanje || stanje.slobodno <= 0)
    return await greska("Nemate slobodnih ZRNA za otpis.", 400);

  const body = await req.json();
  const kolicina = Number(body.kolicina);
  if (!kolicina || kolicina <= 0 || !Number.isInteger(kolicina))
    return await greska("Unesite pozitivan ceo broj ZRNA.", 400);
  if (kolicina > stanje.slobodno)
    return await greska(`Imate ${stanje.slobodno} slobodnih ZRNA.`, 400);

  const danas = beogradskiDan();

  const vec = await prisma.zrnoOtpisZahtev.findUnique({
    where: { userId_date: { userId: session.user.id, date: danas } },
  });
  if (vec && vec.status === "PENDING")
    return await greska("Već postoji aktivan zahtev za otpis danas.", 400);

  await prisma.zrnoOtpisZahtev.upsert({
    where: { userId_date: { userId: session.user.id, date: danas } },
    create: { userId: session.user.id, kolicina, date: danas },
    update: { kolicina, status: "PENDING" },
  });

  void posaljiAdminAlert(
    "Zahtev za otpis ZRNA",
    `Korisnik: ${session.user.pseudonim}\nKoličina: ${kolicina.toLocaleString("sr-RS")} ZRNA`
  );

  return NextResponse.json({ ok: true, poruka: "Zahtev primljen. Biće obrađen u ponoć." });
}
