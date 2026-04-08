import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [clanovi, banka] = await Promise.all([
    prisma.user.count({ where: { verified: true } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
  ]);
  return NextResponse.json({
    clanovi,
    opticaj: banka ? Math.abs(banka.balance) : 0,
  });
}
