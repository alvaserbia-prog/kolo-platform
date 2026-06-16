import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/javno/fondacija/transakcije
 * Jedinstven spisak transakcija sa bankovnog racuna Fondacije (transparentnost):
 *  - priliv: donacije (CONFIRMED) + pokroviteljstvo (RSD)
 *  - odliv:  troskovi Fondacije (RSD)
 * Identitet donatora se NE otkriva (privatnost) — stavke su uopstene.
 */
export async function GET() {
  const [donacije, pokroviteljstvo, troskovi] = await Promise.all([
    prisma.donationRecord.findMany({
      where: { status: "CONFIRMED" },
      select: { id: true, amountRSD: true, confirmedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.pokroviteljDoprinos.findMany({
      select: { id: true, rsdIznos: true, napomena: true, createdAt: true },
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
      opis: "Donacija",
      iznosRSD: Number(d.amountRSD),
    })),
    ...pokroviteljstvo.map((p) => ({
      id: `pok-${p.id}`,
      datum: p.createdAt.toISOString(),
      smer: "PRILIV" as const,
      kategorija: "Pokroviteljstvo",
      opis: p.napomena ?? "Pokroviteljstvo",
      iznosRSD: Number(p.rsdIznos),
    })),
    ...troskovi.map((tr) => ({
      id: `tro-${tr.id}`,
      datum: tr.datum.toISOString(),
      smer: "ODLIV" as const,
      kategorija: String(tr.kategorija),
      opis: tr.opis,
      iznosRSD: Number(tr.iznosRSD),
    })),
  ].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());

  return NextResponse.json({ stavke });
}
