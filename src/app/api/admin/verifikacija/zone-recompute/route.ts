/**
 * POST /api/admin/verifikacija/zone-recompute
 *
 * Puna rekomputacija keša zabranjene zone (verification_zone) iz grafa
 * verifikacija (dokaz stvarnosti v3.9.2, čl. 12). Namena:
 *  - inicijalni backfill posle migracije 20260707120000_verifikaciona_zona
 *    (jednokratno posle deploy-a);
 *  - ručna resinhronizacija ako se posumnja na nekonzistentan keš.
 *
 * Idempotentno: briše sve redove i upisuje sveže stanje izvedeno replay-em
 * grafa (recomputeZones). Keš se inače održava automatski u transakciji svake
 * verifikacije/poništavanja, pa je ovaj endpoint bezbedan za višestruki poziv.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";
import { preracunajZoneUBazi } from "@/lib/protokol/zona-sinhronizacija";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  try {
    const rezultat = await prisma.$transaction(
      async (tx) => preracunajZoneUBazi(tx),
      { timeout: 60_000 }
    );

    await logAdminAkcija(
      session.user.id,
      "ZONE_RECOMPUTE",
      undefined,
      `Rekomputacija zabranjene zone: ${rezultat.parova} parova iz ${rezultat.zapisa} verifikacionih zapisa`
    );

    return NextResponse.json({ ok: true, ...rezultat });
  } catch (e) {
    console.error("[POST /api/admin/verifikacija/zone-recompute]", e);
    return NextResponse.json({ error: "Greška servera" }, { status: 500 });
  }
}
