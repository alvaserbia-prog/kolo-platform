import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obavesti } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/admin/krugovi/[id]/odobri — odobri osnivanje krugovi
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return await greska("Pristup odbijen.", 403);

  const { id } = await params;

  const zahtev = await prisma.krugOsnivanjeZahtev.findUnique({ where: { id } });
  if (!zahtev) return await greska("Zahtev nije pronađen.", 404);
  if (zahtev.status !== "PENDING")
    return await greska("Zahtev nije na čekanju.", 400);

  // Proveri naziv
  const vec = await prisma.krug.findUnique({ where: { name: zahtev.name } });
  if (vec) return await greska("Krug sa ovim nazivom već postoji.", 400);

  const krugId = crypto.randomUUID();
  const walletId = crypto.randomUUID();

  await prisma.$transaction(async (tx) => {
    // 1. Kreiraj krug
    await tx.krug.create({
      data: {
        id: krugId,
        name: zahtev.name,
        description: zahtev.description,
        location: zahtev.location,
      },
    });

    // 2. Kreiraj novčanik krugovi
    await tx.wallet.create({
      data: {
        id: walletId,
        krugId,
        type: "KRUG",
        balance: 0,
      },
    });

    // 3. Dodaj sve osnivače kao članove (prvi je admin)
    for (let i = 0; i < zahtev.osnivaci.length; i++) {
      const userId = zahtev.osnivaci[i];
      await tx.krugClanstvo.create({
        data: { userId, krugId, isAdmin: i === 0 },
      });
    }

    // 4. Ažuriraj status zahteva
    await tx.krugOsnivanjeZahtev.update({
      where: { id },
      data: { status: "APPROVED", reviewedAt: new Date(), reviewedById: session.user.id },
    });
  });

  // 5. Bez emisije POEN-a pri osnivanju. Rast kolektivnih oblika više NIJE kanal
  // evidentiranja (Pravilnik 4.2.0 čl. 15 — kanal brisan, spisak sa 8 pao na 7;
  // Glava VIII: „Krug nema mehanizam rasta"). Ranije se ovde emitovalo 50.000 POEN
  // za osnivački prag od 5 članova. Emisija bez kanala iz čl. 15 bila bi upis novih
  // zapisa POEN-a bez pravnog osnova, pa je uklonjena zajedno sa pragovima iz
  // `protokol/krug.ts`. Već isplaćeni bonusi ostaju — ne poništavaju se retroaktivno,
  // a `KrugBonusLog` ostaje kao njihov trag.

  await logAdminAkcija(session.user.id, "KRUG_ODOBREN", krugId, zahtev.name);

  // 6. Notifikacija svim osnivačima
  for (const userId of zahtev.osnivaci as string[]) {
    await obavesti(userId, {
      tip: "info",
      kljuc: "notifikacije.krug_odobren",
      parametri: { krug: zahtev.name },
      naslov: `Krug „${zahtev.name}" je odobren!`,
      tekst: "Osnivanje kruga je odobreno.",
      link: `/krug/${krugId}`,
    });
  }

  return NextResponse.json({ ok: true, krugId });
}
