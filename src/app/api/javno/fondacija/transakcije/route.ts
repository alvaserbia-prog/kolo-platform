import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/javno/fondacija/transakcije
 * Jedinstven spisak transakcija sa bankovnog racuna Fondacije (transparentnost):
 *  - priliv: donacije (CONFIRMED) + pokroviteljstvo (RSD)
 *  - odliv:  troskovi Fondacije (RSD)
 * Identitet donatora je transparentan (pseudonim donatora / naziv pokrovitelja).
 */
export async function GET() {
  const [donacije, pokroviteljstvo, troskovi] = await Promise.all([
    prisma.donationRecord.findMany({
      where: { status: "CONFIRMED" },
      select: {
        id: true,
        amountRSD: true,
        confirmedAt: true,
        createdAt: true,
        user: { select: { id: true, pseudonim: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.pokroviteljDoprinos.findMany({
      select: {
        id: true,
        rsdIznos: true,
        napomena: true,
        createdAt: true,
        pokrovitelj: { select: { naziv: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.fondacijaTrosak.findMany({
      select: { id: true, iznosRSD: true, kategorija: true, opis: true, datum: true },
      orderBy: { datum: "desc" },
      take: 200,
    }),
  ]);

  const stavke = [
    ...donacije.map((d) => ({
      id: `don-${d.id}`,
      datum: (d.confirmedAt ?? d.createdAt).toISOString(),
      smer: "PRILIV" as const,
      kategorija: "Donacija",
      opis: d.user?.pseudonim ?? "Donacija",
      userId: d.user?.id ?? null,
      iznosRSD: Number(d.amountRSD),
    })),
    ...pokroviteljstvo.map((p) => ({
      id: `pok-${p.id}`,
      datum: p.createdAt.toISOString(),
      smer: "PRILIV" as const,
      kategorija: "Pokroviteljstvo",
      opis: p.pokrovitelj?.naziv ?? p.napomena ?? "Pokroviteljstvo",
      userId: null,
      iznosRSD: Number(p.rsdIznos),
    })),
    ...troskovi.map((tr) => ({
      id: `tro-${tr.id}`,
      datum: tr.datum.toISOString(),
      smer: "ODLIV" as const,
      kategorija: String(tr.kategorija),
      opis: tr.opis,
      userId: null,
      iznosRSD: Number(tr.iznosRSD),
    })),
  ].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());

  return NextResponse.json({ stavke });
}
