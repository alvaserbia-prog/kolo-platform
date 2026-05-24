import { NextResponse } from "next/server";
import { dohvatiVetoStatus } from "@/lib/protokol/fondacija";

/**
 * GET /api/javno/veto
 * Javni status Zastitnog veta Fondacije (cl. 71 Pravilnika v3.7.0).
 */
export async function GET() {
  try {
    const status = await dohvatiVetoStatus();
    return NextResponse.json(status);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
