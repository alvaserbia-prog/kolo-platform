import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

/**
 * GET /api/admin/korisnici/[id]/eksport
 * Admin generiše eksport ličnih podataka za korisnika koji je to zatražio pisanim putem.
 * Uključuje JMBG (za razliku od korisničkog self-export-a).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nije ovlašćen." }, { status: 403 });
  }

  const { id: userId } = await params;

  const [
    user, podaci, transakcije, zrnoStanje, zrnoUpisi, zrnoOtpisi,
    verifikacija, politikaPristanci, prigovori, programEnrollments, donacije,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, pseudonim: true, role: true, status: true,
        verified: true, verifiedAt: true, location: true, telefon: true,
        referralCode: true, memberHash: true, createdAt: true, deaktiviranAt: true,
      },
    }),
    prisma.userPodaci.findUnique({ where: { userId }, select: { punoIme: true, opis: true } }),
    prisma.transaction.findMany({
      where: { OR: [{ fromWallet: { userId } }, { toWallet: { userId } }] },
      select: { id: true, amount: true, type: true, description: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.zrnoStanje.findUnique({ where: { userId }, select: { slobodno: true, aktivno: true } }),
    prisma.zrnoUpisZahtev.findMany({
      where: { userId },
      select: { id: true, poenIznos: true, date: true, status: true, zrnaKupljeno: true, createdAt: true },
    }),
    prisma.zrnoOtpisZahtev.findMany({
      where: { userId },
      select: { id: true, kolicina: true, date: true, status: true, poenDobijeno: true, createdAt: true },
    }),
    // Admin eksport uključuje JMBG
    prisma.verificationRequest.findUnique({
      where: { userId },
      select: { jmbg: true, status: true, kanal: true, createdAt: true, reviewedAt: true },
    }),
    prisma.politikaPrihvatanje.findMany({
      where: { userId },
      select: { prihvacen: true, createdAt: true, verzija: { select: { verzija: true } } },
    }),
    prisma.prigovorNaOdluku.findMany({
      where: { userId },
      select: { tipOdluke: true, opis: true, status: true, odgovor: true, createdAt: true },
    }),
    prisma.programEnrollment.findMany({
      where: { userId },
      select: { type: true, status: true, dailyAmount: true, createdAt: true },
    }),
    prisma.donationRecord.findMany({
      where: { userId },
      select: { amountRSD: true, level: true, poenEmitted: true, status: true, createdAt: true },
    }),
  ]);

  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  await logAdminAkcija(
    session.user.id,
    "ADMIN_EKSPORT_PODATAKA",
    userId,
    `Eksport ličnih podataka za korisnika ${user.pseudonim} (uključuje JMBG)`
  );

  const eksport = {
    generisanoAt: new Date().toISOString(),
    generisaoAdmin: session.user.id,
    napomena: "Admin eksport ličnih podataka — uključuje JMBG po pisanom zahtevu korisnika. Čuvati u skladu sa procedurama.",
    profil: { ...user, ...podaci },
    verifikacija,
    transakcije,
    zrno: { stanje: zrnoStanje, upisi: zrnoUpisi, otpisi: zrnoOtpisi },
    politikaPristanci,
    prigovori,
    programEnrollments,
    donacije: donacije.map((d) => ({ ...d, amountRSD: Number(d.amountRSD) })),
  };

  return new NextResponse(JSON.stringify(eksport, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="admin-eksport-${userId.slice(0, 8)}.json"`,
    },
  });
}
