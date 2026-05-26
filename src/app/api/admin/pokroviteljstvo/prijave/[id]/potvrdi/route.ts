import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { potvrdiPrijavu } from "@/lib/protokol/pokrovitelj";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/pokroviteljstvo/prijave/[id]/potvrdi — Fondacija potvrđuje prijem (čl. 8)
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  try {
    const rez = await potvrdiPrijavu(id, session.user.id);
    await logAdminAkcija(session.user.id, "POKROVITELJSTVO_POTVRDJENO", id,
      `Bonus ${rez.bonus.toLocaleString("sr-RS")} POEN (${rez.noviNivoi.length} nivo(a))`);
    await posaljiNotifikaciju(
      rez.vlasnikId,
      "pokroviteljstvo_potvrdjeno",
      "Pokroviteljstvo potvrđeno",
      rez.bonus > 0
        ? `Doprinos pokroviteljstva je potvrđen. Evidentirano je ${rez.bonus.toLocaleString("sr-RS")} bonus POEN.`
        : "Doprinos pokroviteljstva je potvrđen i dodat kumulativnom doprinosu.",
      "/postani-pokrovitelj"
    );
    return NextResponse.json({ ok: true, ...rez });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Greška." }, { status: 400 });
  }
}
