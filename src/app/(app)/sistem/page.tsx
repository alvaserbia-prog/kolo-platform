import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { labelPrograma } from "@/lib/banka/programi";
import { nivoZaKumulativ } from "@/lib/banka/donacija";
import { ProgramType } from "@/generated/prisma/client";
import SistemKlijent from "./SistemKlijent";

const RANG_SIRENJEM = [
  { do: 0, rang: 0 },
  { do: 5, rang: 1 },
  { do: 10, rang: 2 },
  { do: 15, rang: 3 },
  { do: 20, rang: 4 },
  { do: 30, rang: 5 },
  { do: 40, rang: 6 },
  { do: 50, rang: 7 },
  { do: 70, rang: 8 },
  { do: 100, rang: 9 },
  { do: Infinity, rang: 10 },
];
function rangZaBroj(n: number): number {
  return RANG_SIRENJEM.find((r) => n <= r.do)?.rang ?? 10;
}

const SVE_PROGRAME: ProgramType[] = [
  "ZAPOSLJAVNJE",
  "PODRSKA_MAJKAMA",
  "PODRSKA_STARIJIMA",
  "POSEBNA_BRIGA",
  "SKOLOVANJE",
];

const OPIS_PROGRAMA: Record<ProgramType, string> = {
  ZAPOSLJAVNJE: "Mesečna POEN podrška nezaposlenim članovima koji aktivno traže posao.",
  PODRSKA_MAJKAMA: "Podrška majkama sa malom decom do 3 godine starosti.",
  PODRSKA_STARIJIMA: "Podrška starijim članovima koji su napunili 65 godina.",
  POSEBNA_BRIGA: "Posebna briga — za članove sa posebnim potrebama ili u teškim okolnostima.",
  SKOLOVANJE: "Podrška za školovanje — đacima i studentima koji su članovi KOLO-a.",
};

export default async function SistemPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const verified = session.user.verified;

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [
    banka,
    ukupnoKorisnika,
    verifikovanih,
    ukupnoZadruga,
    emisije,
    transakcijeSve,
    korisnici,
    zadrugeLista,
    aktivniProgrami,
    verRequest,
    danasKorisnika,
    danasTransakcija,
    danasZadruga,
    ukupnoDonacijaRaw,
    danasDonacijaRaw,
    ukupanIznosTxRaw,
    danasIznosTxRaw,
    donacijeLista,
  ] = await Promise.all([
    prisma.wallet.findUnique({
      where: { id: "banka-singleton" },
      select: { balance: true },
    }),
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
    prisma.user.count({ where: { verified: true, role: { not: "ADMIN" } } }),
    prisma.zadruga.count({ where: { status: "ACTIVE" } }),
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
    prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      orderBy: [{ wallet: { balance: "desc" } }],
      select: {
        id: true,
        pseudonim: true,
        verified: true,
        location: true,
        createdAt: true,
        wallet: { select: { balance: true } },
        zadrugaMemberships: {
          where: { leftAt: null },
          select: { zadruga: { select: { name: true } } },
          take: 1,
        },
        referralsMade: {
          where: { rewardPaid: true },
          select: { id: true },
        },
        donations: {
          where: { status: "CONFIRMED" },
          select: { amountRSD: true },
        },
      },
    }),
    prisma.zadruga.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        location: true,
        createdAt: true,
        memberships: { where: { leftAt: null }, select: { id: true } },
      },
    }),
    prisma.bankaProgram.findMany({
      select: { type: true, isActive: true, activatedAt: true },
    }),
    session.user.verified
      ? Promise.resolve(null)
      : prisma.verificationRequest.findUnique({
          where: { userId: session.user.id },
          select: { status: true },
        }),
    prisma.user.count({
      where: { role: { not: "ADMIN" }, createdAt: { gte: danas } },
    }),
    prisma.transaction.count({
      where: { createdAt: { gte: danas } },
    }),
    prisma.zadruga.count({
      where: { status: "ACTIVE", createdAt: { gte: danas } },
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
  ]);

  const opticaj = Math.abs(banka?.balance ?? 0);
  const bankaBalance = banka?.balance ?? 0;

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

  const danasEmisija = emisije[0];
  const danasEmitovano = danasEmisija?.totalEmitted ?? 0;
  const danasLimit = danasEmisija?.limit ?? Math.floor(opticaj * 0.1);

  const txData = transakcijeSve.map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    createdAt: t.createdAt.toISOString(),
    fromPseudonim: t.fromWallet?.user?.pseudonim ?? "Banka",
    fromId: t.fromWallet?.user?.id ?? null,
    toPseudonim: t.toWallet?.user?.pseudonim ?? "Banka",
    toId: t.toWallet?.user?.id ?? null,
  }));

  const clanovi = korisnici.map((u) => {
    const preporukeVerif = u.referralsMade.length;
    const donacijeRSD = u.donations.reduce((s, d) => s + Number(d.amountRSD), 0);
    return {
      id: u.id,
      pseudonim: u.pseudonim,
      verified: u.verified,
      balance: u.wallet?.balance ?? 0,
      zadruga: u.zadrugaMemberships[0]?.zadruga?.name ?? null,
      preporukeVerif,
      rangPreporuke: rangZaBroj(preporukeVerif),
      donacijeRSD,
      rangDonacije: donacijeRSD > 0 ? nivoZaKumulativ(donacijeRSD).nivo : 0,
      location: u.location ?? null,
      createdAt: u.createdAt.toISOString(),
    };
  });

  const zadruge = zadrugeLista.map((z) => ({
    id: z.id,
    name: z.name,
    location: z.location,
    clanovi: z.memberships.length,
    createdAt: z.createdAt.toISOString(),
  }));

  const emisijeChart = emisije
    .slice(0, 14)
    .reverse()
    .map((e) => ({
      date: e.date.toISOString().split("T")[0],
      emitted: e.totalEmitted,
      limit: e.limit,
    }));

  const programiData = SVE_PROGRAME.map((type) => {
    const program = aktivniProgrami.find((p) => p.type === type);
    return {
      type,
      label: labelPrograma(type),
      opis: OPIS_PROGRAMA[type],
      isActive: program?.isActive ?? false,
      activatedAt: program?.activatedAt?.toISOString() ?? null,
    };
  });

  return (
    <SistemKlijent
      pseudonim={session.user.pseudonim}
      verRequest={verRequest ? { status: verRequest.status } : null}
      verified={verified}
      opticaj={opticaj}
      bankaBalance={bankaBalance}
      ukupnoKorisnika={ukupnoKorisnika}
      verifikovanih={verifikovanih}
      ukupnoZadrugaCount={ukupnoZadruga}
      danasEmitovano={danasEmitovano}
      danasLimit={danasLimit}
      danasKorisnika={danasKorisnika}
      danasTransakcija={danasTransakcija}
      danasZadruga={danasZadruga}
      ukupnoDonacija={ukupnoDonacija}
      danasDonacija={danasDonacija}
      ukupanIznosTx={ukupanIznosTx}
      danasIznosTx={danasIznosTx}
      donacije={donacije}
      emisijeChart={emisijeChart}
      transakcije={txData}
      clanovi={clanovi}
      zadruge={zadruge}
      programi={programiData}
    />
  );
}
