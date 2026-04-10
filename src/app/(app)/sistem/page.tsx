import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { labelPrograma } from "@/lib/banka/programi";
import { ProgramType } from "@/generated/prisma/client";
import SistemKlijent from "./SistemKlijent";

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

  const [
    wallet,
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
    poslednjeKorisnika,
  ] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { balance: true },
    }),
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
        createdAt: true,
        wallet: { select: { balance: true } },
        zadrugaMemberships: {
          where: { leftAt: null },
          select: { zadruga: { select: { name: true } } },
          take: 1,
        },
        referralsMade: { select: { id: true } },
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
    prisma.transaction.findMany({
      where: {
        OR: [
          { toWallet: { userId: session.user.id } },
          { fromWallet: { userId: session.user.id } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        fromWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
        toWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
      },
    }),
  ]);

  const opticaj = Math.abs(banka?.balance ?? 0);
  const bankaBalance = banka?.balance ?? 0;

  const danas = emisije[0];
  const danasEmitovano = danas?.totalEmitted ?? 0;
  const danasLimit = danas?.limit ?? Math.floor(opticaj * 0.1);

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

  const clanovi = korisnici.map((u) => ({
    id: u.id,
    pseudonim: u.pseudonim,
    verified: u.verified,
    balance: u.wallet?.balance ?? 0,
    zadruga: u.zadrugaMemberships[0]?.zadruga?.name ?? null,
    preporuke: u.referralsMade.length,
    createdAt: u.createdAt.toISOString(),
  }));

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

  const poslednjeKorisnikaTx = poslednjeKorisnika.map((t) => {
    const primio = t.toWallet?.userId === session.user.id;
    const drugiUser =
      t.type !== "TRANSFER"
        ? null
        : primio
        ? t.fromWallet?.user ?? null
        : t.toWallet?.user ?? null;
    return {
      id: t.id,
      amount: t.amount,
      type: t.type,
      primio,
      drugiPseudonim:
        drugiUser?.pseudonim ?? (t.type !== "TRANSFER" ? "Banka" : "?"),
      drugiId: drugiUser?.id ?? null,
      createdAt: t.createdAt.toISOString(),
    };
  });

  return (
    <SistemKlijent
      pseudonim={session.user.pseudonim}
      userBalance={wallet?.balance ?? 0}
      verRequest={verRequest ? { status: verRequest.status } : null}
      poslednjeKorisnikaTx={poslednjeKorisnikaTx}
      verified={verified}
      opticaj={opticaj}
      bankaBalance={bankaBalance}
      ukupnoKorisnika={ukupnoKorisnika}
      verifikovanih={verifikovanih}
      ukupnoZadrugaCount={ukupnoZadruga}
      danasEmitovano={danasEmitovano}
      danasLimit={danasLimit}
      emisijeChart={emisijeChart}
      transakcije={txData}
      clanovi={clanovi}
      zadruge={zadruge}
      programi={programiData}
    />
  );
}
