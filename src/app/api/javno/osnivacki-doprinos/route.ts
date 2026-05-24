import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dohvatiStatusKanala } from "@/lib/protokol/osnivacki";

/**
 * GET /api/javno/osnivacki-doprinos
 * Javni endpoint transparentnosti (cl. 16 Pravilnika o osnivackom doprinosu).
 * Vraca status kanala + listu osnivaca sa udelima + log koraka.
 */
export async function GET() {
  try {
    const [status, osnivaci, koraci] = await Promise.all([
      dohvatiStatusKanala(),
      prisma.osnivac.findMany({
        select: {
          redniBroj: true,
          udeoBrojilac: true,
          udeoImenilac: true,
          napomena: true,
          user: { select: { pseudonim: true } },
        },
        orderBy: { redniBroj: "asc" },
      }),
      prisma.osnivackiKorakLog.findMany({
        select: {
          brojKoraka: true,
          prag: true,
          ukupanPoenUSistemu: true,
          iznosKoraka: true,
          createdAt: true,
        },
        orderBy: { brojKoraka: "desc" },
        take: 20, // poslednjih 20 koraka
      }),
    ]);

    return NextResponse.json({ status, osnivaci, poslednjikoraci: koraci });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
