import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [clanovi, protokol] = await Promise.all([
    prisma.user.count({ where: { verified: true } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
  ]);
  return NextResponse.json({
    clanovi,
    opticaj: protokol ? Math.abs(protokol.balance) : 0,
  });
}
