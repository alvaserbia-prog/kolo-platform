import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { odgovoriNaPreporuku, GlasanjeGreska } from "@/lib/protokol/glasanje";

// POST /api/admin/glasanje/[id]/odgovor — obrazložen odgovor UO na usvojenu
// dinarsku preporuku (čl. 20). Telo: { odgovor: "PRIHVACENO"|"ODBIJENO", obrazlozenje }.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  try {
    await odgovoriNaPreporuku(id, body.odgovor, body.obrazlozenje ?? "");
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof GlasanjeGreska) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
