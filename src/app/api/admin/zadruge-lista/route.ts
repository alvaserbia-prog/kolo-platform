import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const zadruge = await prisma.zadruga.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      wallet: { select: { balance: true } },
      _count: {
        select: {
          memberships: { where: { leftAt: null } },
          projects: { where: { status: "ACTIVE" } },
        },
      },
    },
  });

  return NextResponse.json({
    zadruge: zadruge.map((z) => ({
      id: z.id,
      name: z.name,
      location: z.location,
      status: z.status,
      balance: z.wallet?.balance ?? 0,
      clanovi: z._count.memberships,
      projekti: z._count.projects,
      createdAt: z.createdAt.toISOString(),
    })),
  });
}
