import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nivoZaKumulativ, RANG_TABELA } from "@/lib/protokol/donacija";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Nije verifikovan." }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      memberHash: true,
      donations: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amountRSD: true,
          cumulativeRSD: true,
          level: true,
          poenEmitted: true,
          status: true,
          javno: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  // Rang/nivo se računa samo iz javnih donacija (anonimne ne nose POEN).
  const totalRSD = user.donations
    .filter((d) => d.status === "CONFIRMED" && d.javno)
    .reduce((s, d) => s + Number(d.amountRSD), 0);
  const { nivo, kurs } = nivoZaKumulativ(totalRSD);

  // Javna lista donacija (dostupna verifikovanim korisnicima): prikazuje ime
  // SNIMLJENO na zapisu javne donacije (`donatorIme`) — trajan podatak, kao i
  // sama uplata. Istorijske/anonimne donacije imaju donatorIme = null pa se ne
  // prikazuju ("samo ubuduće").
  const javneDonacije = await prisma.donationRecord.findMany({
    where: {
      status: "CONFIRMED",
      javno: true,
      donatorIme: { not: null },
    },
    orderBy: [{ confirmedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
    select: {
      id: true,
      amountRSD: true,
      level: true,
      poenEmitted: true,
      donatorIme: true,
      confirmedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    trenutniNivo: nivo,
    trenutniKurs: kurs,
    kumulativRSD: totalRSD,
    donacije: user.donations.map((d) => ({
      id: d.id,
      amountRSD: Number(d.amountRSD),
      cumulativeRSD: Number(d.cumulativeRSD),
      level: d.level,
      poenEmitted: d.poenEmitted,
      status: d.status,
      javno: d.javno,
      createdAt: d.createdAt.toISOString(),
    })),
    listaDonacija: javneDonacije.map((d) => ({
      id: d.id,
      ime: d.donatorIme,
      anonimno: false,
      amountRSD: Number(d.amountRSD),
      level: d.level,
      poenEmitted: d.poenEmitted,
      createdAt: (d.confirmedAt ?? d.createdAt).toISOString(),
    })),
    rangTabela: RANG_TABELA,
  });
}
