import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dohvatiSaldoFondacije } from "@/lib/protokol/fondacija";

/**
 * GET /api/javno/fondacija
 * Javna transparentnost sredstava Fondacije.
 * Vraca: saldo, ukupan priliv (donacije + pokroviteljstvo), ukupan odliv (troskovi),
 *        i pun spisak troskova grupisan po kategoriji.
 */
export async function GET() {
  try {
    const [saldo, troskoviPoKategoriji, ukupnoTroskova] = await Promise.all([
      dohvatiSaldoFondacije(),
      prisma.fondacijaTrosak.groupBy({
        by: ["kategorija"],
        _sum: { iznosRSD: true },
        _count: true,
      }),
      prisma.fondacijaTrosak.count(),
    ]);

    return NextResponse.json({
      saldo,
      troskoviPoKategoriji: troskoviPoKategoriji.map((t) => ({
        kategorija: t.kategorija,
        ukupnoRSD: Number(t._sum.iznosRSD ?? 0),
        brojTroskova: t._count,
      })),
      ukupnoZapisaTroskova: ukupnoTroskova,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
