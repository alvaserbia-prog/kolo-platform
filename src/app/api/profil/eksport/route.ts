import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/profil/eksport
 * Pravo na prenosivost podataka — čl. 36 ZZPL.
 * Vraća JSON sa svim ličnim podacima korisnika.
 * Zahteva aktivnu sesiju.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const userId = session.user.id;

  const [
    user,
    podaci,
    transakcije,
    zrnoStanje,
    zrnoUpisi,
    zrnoOtpisi,
    zrnoStatusZahtevi,
    zrnoDelegacija,
    glasovi,
    poruke,
    politikaPristanci,
    zapisiPristanka,
    prigovori,
    programEnrollments,
    donacije,
    pokroviteljiBonusi,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        pseudonim: true,
        tipKorisnika: true,
        status: true,
        verified: true,
        verifiedAt: true,
        location: true,
        telefon: true,
        memberHash: true,
        emailObavestenja: true,
        createdAt: true,
        deaktiviranAt: true,
      },
    }),
    prisma.userPodaci.findUnique({
      where: { userId },
      select: { punoIme: true, opis: true, updatedAt: true },
    }),
    prisma.transaction.findMany({
      where: {
        OR: [
          { fromWallet: { userId } },
          { toWallet: { userId } },
        ],
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        createdAt: true,
        fromWallet: { select: { userId: true, krugId: true } },
        toWallet: { select: { userId: true, krugId: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.zrnoStanje.findUnique({
      where: { userId },
      select: { slobodno: true, aktivno: true, updatedAt: true },
    }),
    prisma.zrnoUpisZahtev.findMany({
      where: { userId },
      select: { id: true, poenIznos: true, date: true, status: true, zrnaUpisana: true, utrosenoPoen: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.zrnoOtpisZahtev.findMany({
      where: { userId },
      select: { id: true, kolicina: true, date: true, status: true, evidentiranoPoen: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.zrnoStatusZahtev.findMany({
      where: { userId },
      select: { id: true, kolicina: true, akcija: true, date: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.zrnoDelegacija.findFirst({
      where: { delegatorId: userId },
      select: { delegatId: true, zakazaniDelegatId: true, imaZakazano: true, createdAt: true },
    }),
    prisma.glasanjeGlas.findMany({
      where: { userId },
      select: { predlogId: true, za: true, glasackaGlasova: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.poruka.findMany({
      where: { posiljacId: userId },
      select: {
        id: true,
        tekst: true,
        procitana: true,
        createdAt: true,
        konverzacija: { select: { user1Id: true, user2Id: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.politikaPrihvatanje.findMany({
      where: { userId },
      select: {
        prihvacen: true,
        createdAt: true,
        verzija: { select: { verzija: true, naslov: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    // Dokaz pristanka (R-06). Izlazi u izvoz jer je to podatak O KORISNIKU — on
    // ima pravo da vidi na šta je pristao, kada i kojim tekstom, isto kao mi.
    prisma.zapisPristanka.findMany({
      where: { userId },
      select: { vrsta: true, verzija: true, tekst: true, jezik: true, datAt: true, povucenAt: true },
      orderBy: { datAt: "desc" },
    }),
    prisma.prigovorNaOdluku.findMany({
      where: { userId },
      select: { id: true, tipOdluke: true, opis: true, status: true, odgovor: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.programEnrollment.findMany({
      where: { userId },
      select: {
        type: true,
        status: true,
        dailyAmount: true,
        approvedAt: true,
        createdAt: true,
        // Tekst izričitog pristanka za posebne kategorije (R-06) — korisnik ima
        // pravo da vidi na šta je pristao, ne samo da je pristao.
        pristanakTekst: true,
        pristanakAt: true,
        pristanakPovucenAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.donationRecord.findMany({
      where: { userId },
      select: { amountRSD: true, level: true, poenEmitted: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.pokroviteljBonusEmisija.findMany({
      where: { vlasnikId: userId },
      select: { nivo: true, bonusPoen: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const eksport = {
    generisanoAt: new Date().toISOString(),
    napomena: "Eksport ličnih podataka u skladu sa čl. 36 Zakona o zaštiti podataka o ličnosti.",
    profil: { ...user, ...podaci },
    transakcije,
    zrno: {
      stanje: zrnoStanje,
      upisi: zrnoUpisi,
      otpisi: zrnoOtpisi,
      statusZahtevi: zrnoStatusZahtevi,
      delegacija: zrnoDelegacija,
    },
    glasanje: glasovi,
    poruke,
    saglasnosti: {
      politikaPristanci,
      zapisiPristanka,
    },
    prigovori,
    programEnrollments,
    donacije: donacije.map((d) => ({ ...d, amountRSD: Number(d.amountRSD) })),
    pokroviteljBonusi: pokroviteljiBonusi,
  };

  return new NextResponse(JSON.stringify(eksport, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="kolo-podaci-${userId.slice(0, 8)}.json"`,
    },
  });
}
