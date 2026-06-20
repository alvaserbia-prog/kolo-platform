import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nivoZaKumulativ } from "@/lib/protokol/donacija";
import { dohvatiSaldoFondacije } from "@/lib/protokol/fondacija";
import SistemKlijent from "./SistemKlijent";

export default async function SistemPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const verified = session.user.verified;

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [
    protokol,
    ukupnoKorisnika,
    verifikovanih,
    emisije,
    transakcijeSve,
    ukupnoTransakcija,
    korisnici,
    danasKorisnika,
    danasTransakcija,
    ukupnoDonacijaRaw,
    danasDonacijaRaw,
    ukupanIznosTxRaw,
    danasIznosTxRaw,
    donacijeLista,
    pokroviteljiLista,
    ukupnoVerifikacija,
    danasVerifikacija,
    saldoFondacije,
  ] = await Promise.all([
    prisma.wallet.findUnique({
      where: { id: "banka-singleton" },
      select: { balance: true },
    }),
    prisma.user.count({ where: { oauthPending: false, deaktiviranAt: null, status: "ACTIVE" } }),
    prisma.user.count({ where: { verified: true } }),
    prisma.dailyEmissionSummary.findMany({
      orderBy: { date: "desc" },
      take: 30,
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        fromWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
        toWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
      },
    }),
    // Kartica „Transakcije" broji samo prenose između korisnika (TRANSFER),
    // ne i evidentiranje Protokola (EMISIJA_*, UPIS/OTPIS_ZRNO).
    prisma.transaction.count({ where: { type: "TRANSFER" } }),
    prisma.user.findMany({
      // Sakrij nezavršene OAuth naloge (privremeni pseudonim „korisnik_…",
      // oauthPending=true) i deaktivirane/neaktivne naloge iz spiska članova.
      where: {
        oauthPending: false,
        deaktiviranAt: null,
        status: "ACTIVE",
      },
      orderBy: [{ wallet: { balance: "desc" } }],
      select: {
        id: true,
        pseudonim: true,
        verified: true,
        location: true,
        createdAt: true,
        wallet: { select: { balance: true } },
        krugClanstva: {
          where: { leftAt: null },
          select: { krug: { select: { name: true } } },
          take: 1,
        },
        donations: {
          where: { status: "CONFIRMED" },
          select: { amountRSD: true },
        },
      },
    }),
    prisma.user.count({
      where: { createdAt: { gte: danas } },
    }),
    prisma.transaction.count({
      where: { type: "TRANSFER", createdAt: { gte: danas } },
    }),
    prisma.donationRecord.count({ where: { status: "CONFIRMED" } }),
    prisma.donationRecord.count({
      where: { status: "CONFIRMED", confirmedAt: { gte: danas } },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "TRANSFER" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "TRANSFER", createdAt: { gte: danas } },
    }),
    prisma.donationRecord.findMany({
      where: { status: "CONFIRMED" },
      orderBy: { confirmedAt: "desc" },
      take: 50,
      include: { user: { select: { id: true, pseudonim: true } } },
    }),
    prisma.pokrovitelj.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        naziv: true,
        adresa: true,
        rsdKumulativ: true,
        trenutniNivo: true,
      },
      orderBy: { rsdKumulativ: "desc" },
    }),
    prisma.verifikacionaVeza.count(),
    prisma.verifikacionaVeza.count({
      where: { vremenskiZig: { gte: danas } },
    }),
    dohvatiSaldoFondacije(),
  ]);

  const opticaj = Math.abs(protokol?.balance ?? 0);
  const protokolBalance = protokol?.balance ?? 0;

  const ukupnoDonacija = ukupnoDonacijaRaw;
  const danasDonacija = danasDonacijaRaw;
  const ukupanIznosTx = ukupanIznosTxRaw._sum.amount ?? 0;
  const danasIznosTx = danasIznosTxRaw._sum.amount ?? 0;
  const donacije = donacijeLista.map((d) => ({
    id: d.id,
    userId: d.userId,
    pseudonim: d.user.pseudonim,
    amountRSD: Number(d.amountRSD),
    poenEmitted: d.poenEmitted,
    level: d.level,
    confirmedAt: (d.confirmedAt ?? d.createdAt).toISOString(),
  }));

  const pokrovitelji = pokroviteljiLista.map((p) => ({
    id: p.id,
    naziv: p.naziv,
    adresa: p.adresa,
    rsdKumulativ: Number(p.rsdKumulativ),
    trenutniNivo: p.trenutniNivo,
  }));

  const danasEmisija = emisije[0];
  const danasEmitovano = danasEmisija?.totalEmitted ?? 0;
  const danasLimit = danasEmisija?.limit ?? Math.floor(opticaj * 0.1);

  const txData = transakcijeSve.map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    createdAt: t.createdAt.toISOString(),
    fromPseudonim: t.fromWallet?.user?.pseudonim ?? "Protokol",
    fromId: t.fromWallet?.user?.id ?? null,
    toPseudonim: t.toWallet?.user?.pseudonim ?? "Protokol",
    toId: t.toWallet?.user?.id ?? null,
  }));

  const clanovi = korisnici.map((u) => {
    const donacijeRSD = u.donations.reduce((s, d) => s + Number(d.amountRSD), 0);
    return {
      id: u.id,
      pseudonim: u.pseudonim,
      verified: u.verified,
      balance: u.wallet?.balance ?? 0,
      krug: u.krugClanstva[0]?.krug?.name ?? null,
      donacijeRSD,
      rangDonacije: donacijeRSD > 0 ? nivoZaKumulativ(donacijeRSD).nivo : 0,
      location: u.location ?? null,
      createdAt: u.createdAt.toISOString(),
    };
  });

  const emisijeChart = emisije
    .slice(0, 14)
    .reverse()
    .map((e) => ({
      date: e.date.toISOString().split("T")[0],
      emitted: e.totalEmitted,
      limit: e.limit,
    }));

  return (
    <SistemKlijent
      pseudonim={session.user.pseudonim}
      verified={verified}
      opticaj={opticaj}
      protokolBalance={protokolBalance}
      ukupnoKorisnika={ukupnoKorisnika}
      verifikovanih={verifikovanih}
      ukupnoTransakcija={ukupnoTransakcija}
      danasEmitovano={danasEmitovano}
      danasLimit={danasLimit}
      danasKorisnika={danasKorisnika}
      danasTransakcija={danasTransakcija}
      ukupnoVerifikacija={ukupnoVerifikacija}
      danasVerifikacija={danasVerifikacija}
      racunFondacije={saldoFondacije.saldo}
      ukupnoDonacija={ukupnoDonacija}
      danasDonacija={danasDonacija}
      ukupanIznosTx={ukupanIznosTx}
      danasIznosTx={danasIznosTx}
      donacije={donacije}
      pokrovitelji={pokrovitelji}
      emisijeChart={emisijeChart}
      transakcije={txData}
      clanovi={clanovi}
    />
  );
}
