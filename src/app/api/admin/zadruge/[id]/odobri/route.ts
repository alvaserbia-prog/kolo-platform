import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "@/lib/banka/emisija";
import { TransactionType } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/zadruge/[id]/odobri — odobri osnivanje zadruge
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;

  const zahtev = await prisma.zadrugaOsnivanjeZahtev.findUnique({ where: { id } });
  if (!zahtev) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (zahtev.status !== "PENDING")
    return NextResponse.json({ error: "Zahtev nije na čekanju." }, { status: 400 });

  // Proveri naziv
  const vec = await prisma.zadruga.findUnique({ where: { name: zahtev.name } });
  if (vec) return NextResponse.json({ error: "Zadruga sa ovim nazivom već postoji." }, { status: 400 });

  const zadrugaId = crypto.randomUUID();
  const walletId = crypto.randomUUID();

  await prisma.$transaction(async (tx) => {
    // 1. Kreiraj zadrugu
    await tx.zadruga.create({
      data: {
        id: zadrugaId,
        name: zahtev.name,
        description: zahtev.description,
        location: zahtev.location,
      },
    });

    // 2. Kreiraj novčanik zadruge
    await tx.wallet.create({
      data: {
        id: walletId,
        zadrugaId,
        type: "ZADRUGA",
        balance: 0,
      },
    });

    // 3. Dodaj sve osnivače kao članove (prvi je admin)
    for (let i = 0; i < zahtev.osnivaci.length; i++) {
      const userId = zahtev.osnivaci[i];
      await tx.zadrugaMembership.create({
        data: { userId, zadrugaId, isAdmin: i === 0 },
      });
      await tx.user.update({
        where: { id: userId },
        data: { role: "ZADRUGAR" },
      });
    }

    // 4. Ažuriraj status zahteva
    await tx.zadrugaOsnivanjeZahtev.update({
      where: { id },
      data: { status: "APPROVED", reviewedAt: new Date(), reviewedById: session.user.id },
    });
  });

  // 5. Emisija 50.000 POEN (Čl. 37) — van transakcije jer koristi sopstvenu tx
  await emitujPoen(
    walletId,
    50_000,
    TransactionType.EMISIJA_ZADRUGA_OSNIVANJE,
    `Osnivanje zadruge "${zahtev.name}"`
  );

  // 6. Notifikacija svim osnivačima
  for (const userId of zahtev.osnivaci as string[]) {
    await posaljiNotifikaciju(
      userId,
      "info",
      `Zadruga "${zahtev.name}" odobrena!`,
      `Osnivanje zadruge je odobreno. Zadruga je dobila 50.000 POEN startnog kapitala.`,
      `/zajednica/${zadrugaId}`
    );
  }

  return NextResponse.json({ ok: true, zadrugaId });
}
