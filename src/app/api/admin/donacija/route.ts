import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evidentirajDonaciju } from "@/lib/protokol/donacija";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

// POST — potvrdi ili ručno evidentiraj donaciju
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const body = await req.json();
  const { pseudonim, amountRSD, donationId } = body;

  if (!amountRSD) {
    return NextResponse.json({ error: "Iznos je obavezan." }, { status: 400 });
  }
  const iznos = Number(amountRSD);
  if (isNaN(iznos) || iznos <= 0) {
    return NextResponse.json({ error: "Iznos mora biti pozitivan broj." }, { status: 400 });
  }

  if (donationId) {
    // Potvrdi postojeći PENDING zapis
    const donation = await prisma.donationRecord.findUnique({
      where: { id: donationId },
      include: { user: { select: { pseudonim: true, id: true } } },
    });
    if (!donation) return NextResponse.json({ error: "Donacija nije pronađena." }, { status: 404 });
    if (donation.status === "CONFIRMED") return NextResponse.json({ error: "Donacija je već potvrđena." }, { status: 400 });

    try {
      const result = await evidentirajDonaciju(donation.userId, iznos, {
        existingRecordId: donationId,
        adminId: session.user.id,
      });

      await logAdminAkcija(session.user.id, "DONACIJA_POTVRDJENA", donation.userId,
        `${iznos.toLocaleString("sr-RS")} RSD → ${result.poenEmitted} POEN`);
      await posaljiNotifikaciju(
        donation.userId,
        "donacija_potvrdjena",
        "Donacija potvrđena!",
        `Vaša donacija od ${iznos.toLocaleString("sr-RS")} RSD je potvrđena. Dobili ste ${result.poenEmitted.toLocaleString("sr-RS")} POEN.`,
        "/donacije"
      );

      return NextResponse.json({ ok: true, ...result });
    } catch (e: unknown) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Greška." }, { status: 400 });
    }
  }

  // Ručno vezivanje — admin pronašao uplatu bez poziva na broj
  if (!pseudonim) {
    return NextResponse.json({ error: "Pseudonim ili donationId je obavezan." }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { pseudonim } });
  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  try {
    const result = await evidentirajDonaciju(user.id, iznos, { adminId: session.user.id });

    await logAdminAkcija(session.user.id, "DONACIJA_RUCNO_EVIDENTIRANA", user.id,
      `${iznos.toLocaleString("sr-RS")} RSD → ${result.poenEmitted} POEN`);
    await posaljiNotifikaciju(
      user.id,
      "donacija_potvrdjena",
      "Donacija potvrđena!",
      `Vaša donacija od ${iznos.toLocaleString("sr-RS")} RSD je potvrđena. Dobili ste ${result.poenEmitted.toLocaleString("sr-RS")} POEN.`,
      "/donacije"
    );

    return NextResponse.json({ ok: true, ...result });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Greška." }, { status: 400 });
  }
}

// GET — lista svih donacija sa statusom
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const donations = await prisma.donationRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
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
      status: d.status,
      referenceNumber: d.referenceNumber,
      confirmedAt: d.confirmedAt?.toISOString() ?? null,
      createdAt: d.createdAt.toISOString(),
    }))
  );
}
