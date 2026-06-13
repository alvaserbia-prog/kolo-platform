import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeAdmin } from "@/lib/dozvole";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const meId = session.user.id;
  const danas = new Date();
  danas.setHours(0, 0, 0, 0);
  const sada = new Date();

  // "Viđeno" vremena: badge broji samo ono što je stiglo POSLE poslednjeg
  // otvaranja taba. Ako tab još nije otvaran (null), pada na ponoć ("novo danas").
  const meUser = await prisma.user.findUnique({
    where: { id: meId },
    select: { vidjenoNovcanikAt: true, vidjenoPijacaAt: true },
  });
  const odNovcanik = meUser?.vidjenoNovcanikAt ?? danas;
  const odPijaca = meUser?.vidjenoPijacaAt ?? danas;

  // "Novo od poslednje posete" — informativni brojači uz linkove
  const [wallet, pijaca] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: meId }, select: { id: true } }),
    prisma.marketplaceListing.count({ where: { createdAt: { gt: odPijaca } } }),
  ]);

  const novcanik = wallet
    ? await prisma.transaction.count({ where: { toWalletId: wallet.id, createdAt: { gt: odNovcanik } } })
    : 0;

  // Akcioni badge: otvoreni zahtevi za jemstvo na koje korisnik može da odgovori
  // (aktivni, nisu istekli, nisu njegovi)
  const tablaJemstva = await prisma.zahtevZaJemstvo.count({
    where: {
      status: "AKTIVAN",
      expiresAt: { gt: sada },
      userId: { not: meId },
    },
  });

  // Akcioni badge za admina: zbir stavki "na čekanju" koje traže admin radnju
  let adminCekanje = 0;
  if (jeAdmin(session.user)) {
    // Krugovi izbačeni iz admin panela → ne broje se ovde (nemaju tab gde bi se rešili).
    const [
      programi, oglasPrijave, oglasEvidencije,
      pokrovitelji, donacije, prigovori,
    ] = await Promise.all([
      prisma.programEnrollment.count({ where: { status: "PENDING" } }),
      prisma.oglasPrijava.count({ where: { status: "PENDING" } }),
      prisma.oglasEvidencija.count({ where: { status: "PENDING" } }),
      prisma.pokroviteljPrijava.count({ where: { status: "POTPISANA" } }),
      prisma.donationRecord.count({ where: { status: "PENDING" } }),
      prisma.prigovorNaOdluku.count({ where: { status: { in: ["PENDING", "U_OBRADI"] } } }),
    ]);
    adminCekanje =
      programi + oglasPrijave + oglasEvidencije +
      pokrovitelji + donacije + prigovori;
  }

  return NextResponse.json({ novcanik, pijaca, tablaJemstva, adminCekanje });
}
