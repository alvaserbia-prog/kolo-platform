import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { odbijPrijavu } from "@/lib/protokol/pokrovitelj";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/pokroviteljstvo/prijave/[id]/odbij — Fondacija odbija prijem (čl. 8)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = (body.razlog ?? "").trim();
  if (!razlog) return NextResponse.json({ error: "Obrazloženje je obavezno." }, { status: 400 });

  try {
    const rez = await odbijPrijavu(id, session.user.id, razlog);
    await logAdminAkcija(session.user.id, "POKROVITELJSTVO_ODBIJENO", id, razlog);
    await posaljiNotifikaciju(
      rez.podnosilacId,
      "pokroviteljstvo_odbijeno",
      "Prijava pokroviteljstva odbijena",
      `Vaša prijava pokroviteljstva je odbijena. Razlog: ${razlog}. Možete podneti novu prijavu.`,
      "/postani-pokrovitelj"
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Greška." }, { status: 400 });
  }
}
