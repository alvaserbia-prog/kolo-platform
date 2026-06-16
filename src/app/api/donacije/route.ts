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

  // Javna lista donacija (dostupna verifikovanim korisnicima): prikazuju se samo
  // javne donacije čiji je donator uključio prikaz imena (čl. 5a). Time se
  // istorijski donatori (koji nisu uključili `prikaziPunoIme`) NE otkrivaju
  // ("samo ubuduće"), a donator zadržava pravo da sakrije ime preko profila.
  const javneDonacije = await prisma.donationRecord.findMany({
    where: {
      status: "CONFIRMED",
      javno: true,
      user: { podaci: { prikaziPunoIme: true, punoIme: { not: null } } },
    },
    orderBy: [{ confirmedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
    select: {
      id: true,
      amountRSD: true,
      level: true,
      poenEmitted: true,
      confirmedAt: true,
      createdAt: true,
      user: { select: { podaci: { select: { punoIme: true } } } },
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
      ime: d.javno ? d.user.podaci?.punoIme?.trim() || null : null,
      anonimno: !d.javno,
      amountRSD: Number(d.amountRSD),
      level: d.level,
      poenEmitted: d.poenEmitted,
      createdAt: (d.confirmedAt ?? d.createdAt).toISOString(),
    })),
    rangTabela: RANG_TABELA,
  });
}
