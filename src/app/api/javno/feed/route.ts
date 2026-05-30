import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/javno/feed — gradirana vidljivost (Politika privatnosti čl. 6):
 *  - gost (neprijavljen): samo agregat (ukupan broj), BEZ pojedinačnih transakcija
 *  - prijavljen neverifikovan: iznosi/vreme/tip, ali strane su MASKIRANE (bez pseudonima)
 *  - verifikovan (indeks ≥ 10%): pun feed sa pseudonimima strana
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const prijavljen = !!session;
  const verifikovan = !!session?.user?.verified;

  const ukupno = await prisma.transaction.count();

  // Gost vidi samo agregat — pojedinačne transakcije se ne izlažu neprijavljenima.
  if (!prijavljen) {
    return NextResponse.json({ ukupno, nivo: "gost", transakcije: [] });
  }

  const offset = Number(req.nextUrl.searchParams.get("offset") ?? "0");
  const take = 50;

  const transakcije = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    skip: offset,
    take,
    include: {
      fromWallet: { include: { user: { select: { pseudonim: true } }, krug: { select: { name: true } } } },
      toWallet: { include: { user: { select: { pseudonim: true } }, krug: { select: { name: true } } } },
    },
  });

  // Pseudonim korisnika vidljiv je samo verifikovanima; neverifikovanom se strana
  // koja je korisnik prikazuje kao neutralno „Korisnik" (Krug/Protokol nisu pseudonimi).
  function walletLabel(w: { user?: { pseudonim: string } | null; krug?: { name: string } | null } | null) {
    if (!w) return "Protokol";
    if (w.user) return verifikovan ? w.user.pseudonim : "Korisnik";
    if (w.krug) return `[${w.krug.name}]`;
    return "Protokol";
  }

  return NextResponse.json({
    ukupno,
    nivo: verifikovan ? "verifikovan" : "neverifikovan",
    transakcije: transakcije.map((t) => ({
      id: t.id,
      from: walletLabel(t.fromWallet),
      to: walletLabel(t.toWallet),
      amount: t.amount,
      type: t.type,
      // Opis samo za emisije Protokola, ne za ažuriranja evidencije između korisnika
      description: t.fromWallet === null ? t.description : null,
      createdAt: t.createdAt.toISOString(),
    })),
  });
}
