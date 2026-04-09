import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cron/zero-sum — proverava zero-sum invarijantu svaki minut (Vercel Cron)
export async function GET(req: NextRequest) {
  // Podrška za oba načina: Vercel Cron (Authorization: Bearer) i manuelni poziv (x-cron-secret)
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const secret = bearerSecret ?? req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const result = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const zbir = result._sum.balance ?? 0;

  if (zbir !== 0) {
    console.error(`[ZERO-SUM ALARM] Zbir svih balansa nije 0! Zbir: ${zbir} | ${new Date().toISOString()}`);
    return NextResponse.json({ ok: false, zbir }, { status: 500 });
  }

  return NextResponse.json({ ok: true, zbir: 0 });
}
