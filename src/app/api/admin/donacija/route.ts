import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evidentirajDonaciju } from "@/lib/protokol/donacija";
import { prisma } from "@/lib/prisma";
import { gdePseudonim } from "@/lib/pseudonim";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";
import { rasclaniPozivNaBroj } from "@/lib/placanje/ips-qr";

// POST — potvrdi ili ručno evidentiraj donaciju
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return await greska("Pristup odbijen.", 403);
  }

  const body = await req.json();
  const { pseudonim, pozivNaBroj, amountRSD, donationId } = body;
  // Anonimna donacija (javno=false) ne nosi POEN. Default je javna.
  const javnoBody = body.javno !== false;

  if (!amountRSD) {
    return await greska("Iznos je obavezan.", 400);
  }
  const iznos = Number(amountRSD);
  if (isNaN(iznos) || iznos <= 0) {
    return await greska("Iznos mora biti pozitivan broj.", 400);
  }

  if (donationId) {
    // Potvrdi postojeći PENDING zapis
    const donation = await prisma.donationRecord.findUnique({
      where: { id: donationId },
      include: { user: { select: { pseudonim: true, id: true, podaci: { select: { punoIme: true } } } } },
    });
    if (!donation) return await greska("Donacija nije pronađena.", 404);
    if (donation.status === "CONFIRMED") return await greska("Donacija je već potvrđena.", 400);

    // Vidljivost je određena pri kreiranju zapisa (kartica/forma).
    if (donation.javno && !donation.user.podaci?.punoIme?.trim()) {
      return await greska("Javna donacija zahteva da donator ima uneto ime i prezime u profilu.", 400);
    }

    try {
      const result = await evidentirajDonaciju(donation.userId, iznos, {
        existingRecordId: donationId,
        adminId: session.user.id,
        javno: donation.javno,
      });

      await logAdminAkcija(session.user.id, "DONACIJA_POTVRDJENA", donation.userId,
        `${iznos.toLocaleString("sr-RS")} RSD → ${result.poenEmitted} POEN`);
      await obavesti(donation.userId, {
        tip: "donacija_potvrdjena",
        kljuc: "notifikacije.donacija_potvrdjena",
        parametri: { rsd: iznos, poen: result.poenEmitted },
        naslov: "Donacija potvrđena!",
        tekst: `Tvoja donacija od ${iznos.toLocaleString("sr-RS")} RSD je potvrđena. Evidentirano ti je ${result.poenEmitted.toLocaleString("sr-RS")} POEN.`,
        link: "/donacije",
      });

      return NextResponse.json({ ok: true, ...result });
    } catch (e: unknown) {
      return await greska(e instanceof Error ? e.message : "Greška.", 400);
    }
  }

  // Ručno evidentiranje uplate iz izvoda — po pozivu na broj (model 97 nad
  // donatorskim brojem; primarni put) ili po pseudonimu (rezerva, npr. uplata
  // bez poziva na broj).
  if (!pseudonim && !pozivNaBroj) {
    return await greska("Poziv na broj, pseudonim ili donationId je obavezan.", 400);
  }

  let user;
  if (pozivNaBroj) {
    const donatorskiBroj = rasclaniPozivNaBroj(String(pozivNaBroj));
    if (donatorskiBroj === null) {
      return await greska("Poziv na broj nije ispravan (kontrolne cifre se ne poklapaju — proverite prepis iz izvoda).", 400);
    }
    user = await prisma.user.findUnique({
      where: { donatorskiBroj },
      include: { podaci: { select: { punoIme: true } } },
    });
  } else {
    user = await prisma.user.findFirst({
      where: gdePseudonim(pseudonim),
      include: { podaci: { select: { punoIme: true } } },
    });
  }
  if (!user) return await greska("Korisnik nije pronađen.", 404);

  if (javnoBody && !user.podaci?.punoIme?.trim()) {
    return await greska("Javna donacija zahteva da donator ima uneto ime i prezime u profilu (ili evidentirajte kao anonimnu).", 400);
  }

  try {
    const result = await evidentirajDonaciju(user.id, iznos, { adminId: session.user.id, javno: javnoBody });

    await logAdminAkcija(session.user.id, "DONACIJA_RUCNO_EVIDENTIRANA", user.id,
      `${iznos.toLocaleString("sr-RS")} RSD → ${result.poenEmitted} POEN`);
    await obavesti(user.id, {
      tip: "donacija_potvrdjena",
      kljuc: "notifikacije.donacija_potvrdjena",
      parametri: { rsd: iznos, poen: result.poenEmitted },
      naslov: "Donacija potvrđena!",
      tekst: `Tvoja donacija od ${iznos.toLocaleString("sr-RS")} RSD je potvrđena. Evidentirano ti je ${result.poenEmitted.toLocaleString("sr-RS")} POEN.`,
      link: "/donacije",
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e: unknown) {
    return await greska(e instanceof Error ? e.message : "Greška.", 400);
  }
}

// GET — lista svih donacija sa statusom
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return await greska("Pristup odbijen.", 403);
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
