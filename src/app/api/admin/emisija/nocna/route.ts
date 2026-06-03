import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { izvrsiNocnuEmisiju } from "@/lib/protokol/programi";
import { jeSuperadmin } from "@/lib/dozvole";

// POST /api/admin/emisija/nocna — manualni okidač (samo admin)
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  try {
    const rezultat = await izvrsiNocnuEmisiju(new Date());
    return NextResponse.json({ ok: true, ...rezultat });
  } catch (err) {
    console.error("[Admin] Greška pri manualnoj nocnoj emisiji:", err);
    const msg = err instanceof Error ? err.message : "Greška.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
