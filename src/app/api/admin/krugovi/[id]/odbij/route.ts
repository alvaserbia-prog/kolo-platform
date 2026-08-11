import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obavesti } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";
import { KRUG_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!KRUG_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return await greska("Pristup odbijen.", 403);

  const { id } = await params;
  const { razlog } = await req.json();

  if (!razlog?.trim())
    return await greska("Razlog je obavezan.", 400);

  const zahtev = await prisma.krugOsnivanjeZahtev.findUnique({ where: { id } });
  if (!zahtev || zahtev.status !== "PENDING")
    return await greska("Zahtev nije pronađen ili nije na čekanju.", 400);

  await prisma.krugOsnivanjeZahtev.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: razlog.trim(), reviewedAt: new Date(), reviewedById: session.user.id },
  });

  await logAdminAkcija(session.user.id, "KRUG_ODBIJEN", id, `${zahtev.name}: ${razlog.trim()}`);

  const osnivac = (zahtev.osnivaci as string[])[0];
  if (osnivac) {
    await obavesti(osnivac, {
      tip: "info",
      kljuc: "notifikacije.krug_odbijen",
      parametri: { krug: zahtev.name, razlog: razlog.trim() },
      naslov: "Osnivanje kruga odbijeno",
      tekst: `Tvoj zahtev za osnivanje kruga „${zahtev.name}" je odbijen. Razlog: ${razlog.trim()}`,
      link: "/krug",
    });
  }

  return NextResponse.json({ ok: true });
}
