import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const { razlog } = await req.json();

  if (!razlog?.trim())
    return NextResponse.json({ error: "Razlog je obavezan." }, { status: 400 });

  const zahtev = await prisma.krugOsnivanjeZahtev.findUnique({ where: { id } });
  if (!zahtev || zahtev.status !== "PENDING")
    return NextResponse.json({ error: "Zahtev nije pronađen ili nije na čekanju." }, { status: 400 });

  await prisma.krugOsnivanjeZahtev.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: razlog.trim(), reviewedAt: new Date(), reviewedById: session.user.id },
  });

  const osnivac = (zahtev.osnivaci as string[])[0];
  if (osnivac) {
    await posaljiNotifikaciju(
      osnivac,
      "info",
      `Osnivanje krugovi odbijeno`,
      `Zahtev za osnivanje krugovi "${zahtev.name}" je odbijen. Razlog: ${razlog.trim()}`,
      "/krug"
    );
  }

  return NextResponse.json({ ok: true });
}
