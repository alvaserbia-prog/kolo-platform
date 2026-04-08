import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nivoZaKumulativ } from "@/lib/banka/donacija";

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
          createdAt: true,
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  const totalRSD = user.donations
    .filter((d) => d.status === "CONFIRMED")
    .reduce((s, d) => s + Number(d.amountRSD), 0);
  const { nivo, kurs } = nivoZaKumulativ(totalRSD);

  // Pravilnik tabela 18 nivoa
  const rangTabela = [
    { nivo: 1,  do: 2_000,           kurs: 1.00 },
    { nivo: 2,  do: 5_000,           kurs: 1.10 },
    { nivo: 3,  do: 10_000,          kurs: 1.20 },
    { nivo: 4,  do: 20_000,          kurs: 1.30 },
    { nivo: 5,  do: 50_000,          kurs: 1.40 },
    { nivo: 6,  do: 100_000,         kurs: 1.50 },
    { nivo: 7,  do: 200_000,         kurs: 1.60 },
    { nivo: 8,  do: 500_000,         kurs: 1.70 },
    { nivo: 9,  do: 1_000_000,       kurs: 1.80 },
    { nivo: 10, do: 2_000_000,       kurs: 1.90 },
    { nivo: 11, do: 5_000_000,       kurs: 2.00 },
    { nivo: 12, do: 10_000_000,      kurs: 2.20 },
    { nivo: 13, do: 20_000_000,      kurs: 2.40 },
    { nivo: 14, do: 50_000_000,      kurs: 2.70 },
    { nivo: 15, do: 100_000_000,     kurs: 3.00 },
    { nivo: 16, do: 200_000_000,     kurs: 3.50 },
    { nivo: 17, do: 500_000_000,     kurs: 4.00 },
    { nivo: 18, do: 1_000_000_000,   kurs: 5.00 },
  ];

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
      createdAt: d.createdAt.toISOString(),
    })),
    rangTabela,
  });
}
