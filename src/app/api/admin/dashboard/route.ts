import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UKUPNO_ZRNA } from "@/lib/protokol/zrno";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const [
    ukupnoKorisnika, verifikovanih, suspendovanih,
    ukupnoKrug, ukupnoKrugra,
    protokol, zrnoStanje,
    poslednjeEmisije, ukupnoTransakcija,
    noviKorisnici,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
    prisma.user.count({ where: { verified: true, role: { not: "ADMIN" } } }),
    prisma.user.count({ where: { status: "SUSPENDED" } }),
    prisma.krug.count({ where: { status: "ACTIVE" } }),
    prisma.krugClanstvo.count({ where: { leftAt: null } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
    prisma.zrnoStanje.aggregate({ _sum: { slobodno: true, aktivno: true } }),
    prisma.dailyEmissionSummary.findMany({ orderBy: { date: "desc" }, take: 7 }),
    prisma.transaction.count(),
    prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { createdAt: true },
    }),
  ]);

  const opticaj = Math.abs(protokol?.balance ?? 0);
  const zrnaKodKorisnika = (zrnoStanje._sum.slobodno ?? 0) + (zrnoStanje._sum.aktivno ?? 0);
  const zrnaUProtokolu = UKUPNO_ZRNA - zrnaKodKorisnika;

  // Grupiši nove korisnike po danu (poslednih 30 dana)
  const rastMap: Record<string, number> = {};
  for (const u of noviKorisnici) {
    const d = u.createdAt.toISOString().split("T")[0];
    rastMap[d] = (rastMap[d] ?? 0) + 1;
  }
  const rast = Object.entries(rastMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return NextResponse.json({
    korisnici: { ukupno: ukupnoKorisnika, verifikovanih, suspendovanih },
    krugovi: { ukupno: ukupnoKrug, krugra: ukupnoKrugra },
    finansije: { opticaj, protokolBalance: protokol?.balance ?? 0 },
    zrno: { kodKorisnika: zrnaKodKorisnika, uProtokolu: zrnaUProtokolu, ukupno: UKUPNO_ZRNA },
    programi: poslednjeEmisije.map((e) => ({
      date: e.date.toISOString(),
      emitted: e.totalEmitted,
      requested: e.totalRequested,
      koeficijent: Number(e.koeficijent),
    })),
    ukupnoTransakcija,
    rast,
  });
}
