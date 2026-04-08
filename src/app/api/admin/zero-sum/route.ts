import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const result = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const zbir = result._sum.balance ?? 0;

  return NextResponse.json({ zbir, ok: zbir === 0 });
}
