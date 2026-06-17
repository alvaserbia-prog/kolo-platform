import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evidentirajDoprinos } from "@/lib/protokol/pokrovitelj";
import { jeAdmin } from "@/lib/dozvole";
import { prisma } from "@/lib/prisma";

// Gornja granica jednog evidentiranog doprinosa (RSD) — odbrana od slučajnog upisa
// ogromnog iznosa koji bi emitovao bonus POEN bez pokrića.
const MAX_RSD_DOPRINOS = 1_000_000_000;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { rsdIznos, tip, napomena } = body;

  if (!rsdIznos || typeof rsdIznos !== "number" || !Number.isFinite(rsdIznos) || rsdIznos <= 0) {
    return NextResponse.json({ error: "Neispravan iznos." }, { status: 400 });
  }
  if (rsdIznos > MAX_RSD_DOPRINOS) {
    return NextResponse.json({ error: "Iznos je neuobičajeno velik." }, { status: 400 });
  }
  if (tip !== "NOVAC" && tip !== "ROBA" && tip !== "USLUGE") {
    return NextResponse.json({ error: "Neispravan tip doprinosa." }, { status: 400 });
  }

  // Anti dupli-klik: odbij identičan doprinos (isti iznos/tip/napomena) u poslednjih 15s.
  const skoro = await prisma.pokroviteljDoprinos.findFirst({
    where: {
      pokroviteljId: id,
      rsdIznos: rsdIznos,
      tip,
      napomena: napomena ?? null,
      createdAt: { gt: new Date(Date.now() - 15_000) },
    },
    select: { id: true },
  });
  if (skoro) {
    return NextResponse.json({ error: "Isti doprinos je upravo evidentiran (mogući dupli klik)." }, { status: 409 });
  }

  const rezultat = await evidentirajDoprinos({
    pokroviteljId: id,
    rsdIznos: rsdIznos,
    tip,
    evidentiraoId: session.user.id,
    napomena,
  });

  return NextResponse.json({
    ok: true,
    noviNivoi: rezultat.noviNivoi.map((n) => ({ nivo: n.nivo, bonusPoen: n.bonusPoen })),
  });
}
