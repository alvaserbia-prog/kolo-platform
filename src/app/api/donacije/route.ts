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
    rangTabela: RANG_TABELA,
  });
}
