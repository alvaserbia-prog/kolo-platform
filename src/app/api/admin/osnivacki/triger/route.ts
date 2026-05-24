import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { proveriIEvidentirajKorak } from "@/lib/protokol/osnivacki";

/**
 * POST /api/admin/osnivacki/triger
 * Manuelno okidanje provere i evidentiranja koraka osnivackog doprinosa.
 * U buducnosti zameniti sa cron job-om (noćna emisija).
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  try {
    const rezultat = await proveriIEvidentirajKorak();
    return NextResponse.json(rezultat);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
