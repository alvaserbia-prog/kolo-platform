import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "@/lib/protokol/emisija";
import { TransactionType } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/admin/krugovi/[id]/odobri — odobri osnivanje krugovi
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;

  const zahtev = await prisma.krugOsnivanjeZahtev.findUnique({ where: { id } });
  if (!zahtev) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (zahtev.status !== "PENDING")
    return NextResponse.json({ error: "Zahtev nije na čekanju." }, { status: 400 });

  // Proveri naziv
  const vec = await prisma.krug.findUnique({ where: { name: zahtev.name } });
  if (vec) return NextResponse.json({ error: "Krug sa ovim nazivom već postoji." }, { status: 400 });

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

  // 5. Emisija 50.000 POEN (Čl. 37) — van transakcije jer koristi sopstvenu tx
  await emitujPoen(
    walletId,
    50_000,
    TransactionType.EMISIJA_KRUG_OSNIVANJE,
    `Osnivanje krugovi "${zahtev.name}"`
  );

  // Logovati osnivački prag (threshold=5) u BonusLog radi konzistentnosti
  await prisma.krugBonusLog.create({
    data: { krugId, threshold: 5, amount: 50_000 },
  });

  await logAdminAkcija(session.user.id, "KRUG_ODOBREN", krugId, zahtev.name);

  // 6. Notifikacija svim osnivačima
  for (const userId of zahtev.osnivaci as string[]) {
    await posaljiNotifikaciju(
      userId,
      "info",
      `Krug "${zahtev.name}" odobrena!`,
      `Osnivanje krugovi je odobreno. Krug je dobila 50.000 POEN startnog kapitala.`,
      `/krug/${krugId}`
    );
  }

  return NextResponse.json({ ok: true, krugId });
}
