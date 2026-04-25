import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? "0");
  const take = 50;

  const [transakcije, ukupno] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      skip: offset,
      take,
      include: {
        fromWallet: { include: { user: { select: { pseudonim: true } }, krug: { select: { name: true } } } },
        toWallet: { include: { user: { select: { pseudonim: true } }, krug: { select: { name: true } } } },
      },
    }),
    prisma.transaction.count(),
  ]);

  function walletLabel(w: { user?: { pseudonim: string } | null; krug?: { name: string } | null } | null) {
    if (!w) return "Banka";
    if (w.user) return w.user.pseudonim;
    if (w.krug) return `[${w.krug.name}]`;
    return "Banka";
  }

  return NextResponse.json({
    ukupno,
    transakcije: transakcije.map((t) => ({
      id: t.id,
      from: walletLabel(t.fromWallet),
      to: walletLabel(t.toWallet),
      amount: t.amount,
      type: t.type,
      // Opis samo za emisije Banke, ne za P2P transfere
      description: t.fromWallet === null ? t.description : null,
      createdAt: t.createdAt.toISOString(),
    })),
  });
}
