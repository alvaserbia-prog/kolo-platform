import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evidentirajDonaciju } from "@/lib/banka/donacija";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { pseudonim, amountRSD } = await req.json();

  if (!pseudonim || !amountRSD) {
    return NextResponse.json({ error: "Pseudonim i iznos su obavezni." }, { status: 400 });
  }

  const iznos = Number(amountRSD);
  if (isNaN(iznos) || iznos <= 0) {
    return NextResponse.json({ error: "Iznos mora biti pozitivan broj." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { pseudonim } });
  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  try {
    const result = await evidentirajDonaciju(user.id, iznos);
    return NextResponse.json({
      ok: true,
      poenEmitted: result.poenEmitted,
      nivo: result.nivo,
      kurs: result.kurs,
      noviKumulativ: result.noviKumulativ,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Greška.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const donations = await prisma.donationRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { pseudonim: true } } },
  });

  return NextResponse.json(
    donations.map((d) => ({
      id: d.id,
      pseudonim: d.user.pseudonim,
      amountRSD: Number(d.amountRSD),
      cumulativeRSD: Number(d.cumulativeRSD),
      level: d.level,
      poenEmitted: d.poenEmitted,
      createdAt: d.createdAt.toISOString(),
    }))
  );
}
