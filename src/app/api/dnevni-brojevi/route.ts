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

  // "Novo danas" — informativni brojači uz linkove
  const [wallet, pijaca] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: meId }, select: { id: true } }),
    prisma.marketplaceListing.count({ where: { createdAt: { gte: danas } } }),
  ]);

  const novcanik = wallet
    ? await prisma.transaction.count({ where: { toWalletId: wallet.id, createdAt: { gte: danas } } })
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
    const [
      krugOsnivanje, krugPristupnice, programi, oglasPrijave, oglasEvidencije,
      pokrovitelji, donacije, prigovori,
    ] = await Promise.all([
      prisma.krugOsnivanjeZahtev.count({ where: { status: "PENDING" } }),
      prisma.krugPristupnica.count({ where: { status: "PENDING" } }),
      prisma.programEnrollment.count({ where: { status: "PENDING" } }),
      prisma.oglasPrijava.count({ where: { status: "PENDING" } }),
      prisma.oglasEvidencija.count({ where: { status: "PENDING" } }),
      prisma.pokroviteljPrijava.count({ where: { status: "POTPISANA" } }),
      prisma.donationRecord.count({ where: { status: "PENDING" } }),
      prisma.prigovorNaOdluku.count({ where: { status: { in: ["PENDING", "U_OBRADI"] } } }),
    ]);
    adminCekanje =
      krugOsnivanje + krugPristupnice + programi + oglasPrijave + oglasEvidencije +
      pokrovitelji + donacije + prigovori;
  }

  return NextResponse.json({ novcanik, pijaca, tablaJemstva, adminCekanje });
}
