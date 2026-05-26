import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [wallet, pijaca, krug, ped, programi, zrno] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: session.user.id }, select: { id: true } }),
    prisma.marketplaceListing.count({ where: { createdAt: { gte: danas } } }),
    prisma.krugPristupnica.count({ where: { createdAt: { gte: danas } } }),
    prisma.zadatak.count({ where: { createdAt: { gte: danas }, status: { in: ["OTVOREN", "U_IZVRSENJU"] } } }),
    prisma.programEnrollment.count({ where: { createdAt: { gte: danas } } }),
    prisma.glasanjePredlog.count({ where: { createdAt: { gte: danas } } }),
  ]);

  const novcanik = wallet
    ? await prisma.transaction.count({ where: { toWalletId: wallet.id, createdAt: { gte: danas } } })
    : 0;

  return NextResponse.json({ novcanik, pijaca, krug, ped, programi, zrno });
}
