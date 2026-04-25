import { NextRequest, NextResponse } from "next/server";
import { izvrsiNocnuEmisiju } from "@/lib/protokol/programi";
import { izvrsiZrnoOperacije } from "@/lib/protokol/zrno";

// POST /api/cron/nocna-emisija — pokreće se u ponoć (zaštićeno CRON_SECRET)
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const datum = new Date();
  try {
    const [programi, zrno] = await Promise.all([
      izvrsiNocnuEmisiju(datum),
      izvrsiZrnoOperacije(datum),
    ]);
    return NextResponse.json({ ok: true, programi, zrno });
  } catch (err) {
    console.error("[CRON] Greška pri nocnoj emisiji:", err);
    return NextResponse.json({ error: "Greška pri izvršavanju emisije." }, { status: 500 });
  }
}
