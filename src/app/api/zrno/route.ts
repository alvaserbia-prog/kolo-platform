import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { glasackaMoc, poslednjiKurs, UKUPNO_ZRNA } from "@/lib/protokol/zrno";

// GET /api/zrno — stanje ZRNA korisnika
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [stanje, upisZahtev, otpisZahtev, statusZahtevi, delegacija, kurs, trziste] = await Promise.all([
    prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } }),
    prisma.zrnoUpisZahtev.findUnique({ where: { userId_date: { userId: session.user.id, date: danas } } }),
    prisma.zrnoOtpisZahtev.findUnique({ where: { userId_date: { userId: session.user.id, date: danas } } }),
    prisma.zrnoStatusZahtev.findMany({ where: { userId: session.user.id, status: "PENDING" } }),
    prisma.zrnoDelegacija.findUnique({ where: { delegatorId: session.user.id } }),
    poslednjiKurs(),
    prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } }),
  ]);

  const slobodno = stanje?.slobodno ?? 0;
  const aktivno = stanje?.aktivno ?? 0;

  return NextResponse.json({
    slobodno,
    aktivno,
    ukupno: slobodno + aktivno,
    glasackaMoc: glasackaMoc(aktivno),
    kurs,
    trzisjeAktivno: trziste?.isActive ?? false,
    upisZahtev: upisZahtev ? { id: upisZahtev.id, poenIznos: upisZahtev.poenIznos, status: upisZahtev.status } : null,
    otpisZahtev: otpisZahtev ? { id: otpisZahtev.id, kolicina: otpisZahtev.kolicina, status: otpisZahtev.status } : null,
    statusZahtevi: statusZahtevi.map((z) => ({ id: z.id, kolicina: z.kolicina, akcija: z.akcija })),
    delegacija: delegacija ? { delegatId: delegacija.delegatId, aktivna: delegacija.aktivna } : null,
  });
}
