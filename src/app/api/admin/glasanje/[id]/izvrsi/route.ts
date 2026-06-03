import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { izvrsiOdluku, GlasanjeGreska } from "@/lib/protokol/glasanje";

// POST /api/admin/glasanje/[id]/izvrsi — Fondacija (UO) beleži izvršenje odluke (čl. 17)
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  const { id } = await params;
  try {
    await izvrsiOdluku(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof GlasanjeGreska) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
