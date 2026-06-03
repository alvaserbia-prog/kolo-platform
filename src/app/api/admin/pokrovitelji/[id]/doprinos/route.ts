import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evidentirajDoprinos } from "@/lib/protokol/pokrovitelj";
import { jeAdmin } from "@/lib/dozvole";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) {
    return NextResponse.json({ error: "Nemate pristup." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { rsdIznos, tip, napomena } = body;

  if (!rsdIznos || typeof rsdIznos !== "number" || rsdIznos <= 0) {
    return NextResponse.json({ error: "Neispravan iznos." }, { status: 400 });
  }
  if (tip !== "NOVAC" && tip !== "ROBA" && tip !== "USLUGE") {
    return NextResponse.json({ error: "Neispravan tip doprinosa." }, { status: 400 });
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
