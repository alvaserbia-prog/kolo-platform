import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

// GET /api/admin/tabla-jemstva/neprepoznati — spisak za UO Fondacije: ljudi koji
// su objavili karticu, dali saglasnost za poziv, a NIKO od članova ih nije
// prepoznao (nema nijednog odgovora „DA").
//
// Svrha (dogovoreno pri redizajnu): izolovanog čoveka ne odbijamo. Ako ga mreža
// ne prepozna, član UO ga pozove telefonom, upozna se sa njim i — ako oceni —
// verifikuje ga U SVOJE IME, kao član u lancu jemstva. Fondacija time NE postaje
// verifikator: upis u lanac je i dalje redovna verifikacija čovek–čovek, sa
// odgovornošću na tom članu.
//
// Broj telefona se ovde otkriva, pa se svaki pristup spisku loguje.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const zahtevi = await prisma.zahtevZaJemstvo.findMany({
    where: {
      status: { in: ["AKTIVAN", "NEPOTPUN"] },
      expiresAt: { gt: new Date() },
      telefonSaglasnost: true,
      telefon: { not: null },
      prepoznavanja: { none: { odgovor: "DA" } },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      ime: true,
      prezime: true,
      godiste: true,
      mesto: true,
      nadimak: true,
      cimeSeBavi: true,
      telefon: true,
      createdAt: true,
      expiresAt: true,
      user: { select: { pseudonim: true } },
      _count: { select: { prepoznavanja: true } },
    },
  });

  if (zahtevi.length > 0) {
    await logAdminAkcija(
      session.user.id,
      "PRISTUP_NEPREPOZNATI_JEMSTVO",
      undefined,
      `Pregled spiska neprepoznatih kandidata (${zahtevi.length}) — otkriveni brojevi telefona`
    );
  }

  return NextResponse.json({
    kandidati: zahtevi.map((z) => ({
      id: z.id,
      pseudonim: z.user.pseudonim,
      ime: z.ime,
      prezime: z.prezime,
      godiste: z.godiste,
      mesto: z.mesto,
      nadimak: z.nadimak,
      cimeSeBavi: z.cimeSeBavi,
      telefon: z.telefon,
      // Koliko ih je uopšte videlo i odgovorilo „ne / nisam siguran".
      odgovoreno: z._count.prepoznavanja,
      createdAt: z.createdAt.toISOString(),
      expiresAt: z.expiresAt.toISOString(),
    })),
  });
}
