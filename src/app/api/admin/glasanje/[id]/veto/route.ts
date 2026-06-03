import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { vetoNaIzvrsenje, GlasanjeGreska } from "@/lib/protokol/glasanje";
import { jeSuperadmin } from "@/lib/dozvole";

// POST /api/admin/glasanje/[id]/veto — Fondacija (UO) obrazloženim vetom
// obustavlja izvršenje usvojene odluke (čl. 18). Telo: { obrazlozenje }.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  try {
    await vetoNaIzvrsenje(id, body.obrazlozenje ?? "");
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof GlasanjeGreska) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
