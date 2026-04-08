import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminKlijent from "./AdminKlijent";
import { labelPrograma } from "@/lib/banka/programi";
import { ProgramType } from "@/generated/prisma/client";
import { UKUPNO_ZRNA } from "@/lib/banka/zrno";

const SVI_PROGRAMI: ProgramType[] = ["ZAPOSLJAVNJE", "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE"];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const [
    pendingRequests, allUsers, banka, pendingZadruge,
    adminProgrami, dashboardData, auditLogs, zadrugeLista, pokroviteljiData, zaposljavanjeData,
  ] = await Promise.all([
    prisma.verificationRequest.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { pseudonim: true, email: true, referredById: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, pseudonim: true, role: true, verified: true, status: true, suspendedReason: true, createdAt: true, wallet: { select: { balance: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
    prisma.zadrugaOsnivanjeZahtev.findMany({
      where: { status: "PENDING" },
      include: { inicijator: { select: { pseudonim: true } } },
      orderBy: { createdAt: "asc" },
    }),
    Promise.all([
      prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } }),
      prisma.bankaProgram.findMany(),
      prisma.programEnrollment.findMany({ where: { status: "PENDING" }, include: { user: { select: { pseudonim: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.zaposljvanjeEvidencija.findMany({ where: { status: "PENDING" }, include: { user: { select: { pseudonim: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.dailyEmissionSummary.findMany({ orderBy: { date: "desc" }, take: 7 }),
    ]),
    Promise.all([
      prisma.user.count({ where: { role: { not: "ADMIN" } } }),
      prisma.user.count({ where: { verified: true } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
      prisma.zadruga.count({ where: { status: "ACTIVE" } }),
      prisma.zadrugaMembership.count({ where: { leftAt: null } }),
      prisma.zrnoStanje.aggregate({ _sum: { slobodno: true, aktivno: true } }),
      prisma.transaction.count(),
    ]),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { admin: { select: { pseudonim: true } } },
    }),
    prisma.zadruga.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        wallet: { select: { balance: true } },
        _count: { select: { memberships: { where: { leftAt: null } }, projects: { where: { status: "ACTIVE" } } } },
      },
    }),
    Promise.all([
      prisma.pokrovitelj.findMany({
        include: {
          vlasnik: { select: { pseudonim: true } },
          zadruga: { select: { name: true } },
          _count: { select: { doprinosi: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        where: { verified: true },
        select: { id: true, pseudonim: true },
        orderBy: { pseudonim: "asc" },
      }),
      prisma.zadruga.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]),
    Promise.all([
      prisma.radniOglas.findMany({
        include: {
          createdBy: { select: { pseudonim: true } },
          zadruga: { select: { name: true } },
          _count: { select: { prijave: true, evidencije: { where: { status: "PENDING" } } } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.radniOglasPrijava.findMany({
        where: { status: "PENDING" },
        include: { user: { select: { pseudonim: true } }, oglas: { select: { title: true, hourlyRate: true, positions: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.radnaEvidencija.findMany({
        where: { status: "PENDING" },
        include: { user: { select: { pseudonim: true } }, oglas: { select: { title: true } } },
        orderBy: { createdAt: "asc" },
      }),
    ]),
  ]);

  const opticaj = banka ? Math.abs(banka.balance) : 0;
  const zrnaKodKorisnika = (dashboardData[5]._sum.slobodno ?? 0) + (dashboardData[5]._sum.aktivno ?? 0);

  return (
    <AdminKlijent
      opticaj={opticaj}
      pending={pendingRequests.map((vr) => ({
        requestId: vr.id, pseudonim: vr.user.pseudonim, email: vr.user.email,
        jmbg: vr.jmbg, createdAt: vr.createdAt.toISOString(), imaReferral: !!vr.user.referredById,
      }))}
      users={allUsers.map((u) => ({
        id: u.id, pseudonim: u.pseudonim, role: u.role, verified: u.verified,
        status: u.status, suspendedReason: u.suspendedReason,
        balance: u.wallet?.balance ?? 0, createdAt: u.createdAt.toISOString(),
      }))}
      pendingZadruge={pendingZadruge.map((z) => ({
        id: z.id, name: z.name, description: z.description, location: z.location,
        inicijatorPseudonim: z.inicijator.pseudonim, brOsnivaca: z.osnivaci.length,
        createdAt: z.createdAt.toISOString(),
      }))}
      adminProgrami={{
        zrnoTrzisjeAktivno: adminProgrami[0]?.isActive ?? false,
        programi: SVI_PROGRAMI.map((type) => {
          const bp = adminProgrami[1].find((p) => p.type === type);
          return { type, label: labelPrograma(type), isActive: bp?.isActive ?? false, activatedAt: bp?.activatedAt?.toISOString() ?? null };
        }),
        pendingEnrollments: adminProgrami[2].map((e) => ({
          id: e.id, pseudonim: e.user.pseudonim, type: e.type, label: labelPrograma(e.type),
          metadata: e.metadata as Record<string, unknown> | null, createdAt: e.createdAt.toISOString(),
        })),
        pendingEvidencije: adminProgrami[3].map((e) => ({
          id: e.id, pseudonim: e.user.pseudonim, date: e.date.toISOString(),
          description: e.description, amount: e.amount, createdAt: e.createdAt.toISOString(),
        })),
        poslednjeEmisije: adminProgrami[4].map((s) => ({
          date: s.date.toISOString(), opticaj: s.opticaj, limit: s.limit,
          totalRequested: s.totalRequested, totalEmitted: s.totalEmitted, koeficijent: Number(s.koeficijent),
        })),
      }}
      dashboard={{
        korisnici: { ukupno: dashboardData[0], verifikovanih: dashboardData[1], suspendovanih: dashboardData[2] },
        zadruge: { ukupno: dashboardData[3], zadrugara: dashboardData[4] },
        finansije: { opticaj, bankaBalance: banka?.balance ?? 0 },
        zrno: { kodKorisnika: zrnaKodKorisnika, uBanci: UKUPNO_ZRNA - zrnaKodKorisnika, ukupno: UKUPNO_ZRNA },
        ukupnoTransakcija: dashboardData[6],
      }}
      auditLogs={auditLogs.map((l) => ({
        id: l.id, adminPseudonim: l.admin.pseudonim, akcija: l.akcija,
        targetId: l.targetId, detalji: l.detalji, createdAt: l.createdAt.toISOString(),
      }))}
      zadrugeLista={zadrugeLista.map((z) => ({
        id: z.id, name: z.name, location: z.location, status: z.status,
        balance: z.wallet?.balance ?? 0, clanovi: z._count.memberships,
        projekti: z._count.projects, createdAt: z.createdAt.toISOString(),
      }))}
      adminPokrovitelji={pokroviteljiData[0].map((p) => ({
        id: p.id,
        naziv: p.naziv,
        pib: p.pib,
        vlasnikPseudonim: p.vlasnik.pseudonim,
        zadrugaName: p.zadruga?.name ?? null,
        rsdKumulativ: Number(p.rsdKumulativ),
        trenutniNivo: p.trenutniNivo,
        status: p.status,
        brDoprinosa: p._count.doprinosi,
        createdAt: p.createdAt.toISOString(),
      }))}
      verifikovaniKorisnici={pokroviteljiData[1]}
      zadrugeLista2={pokroviteljiData[2]}
      adminZaposljavnje={{
        oglasi: zaposljavanjeData[0].map((o) => ({
          id: o.id, title: o.title, source: o.source as string,
          hourlyRate: o.hourlyRate, maxHoursPerDay: o.maxHoursPerDay, positions: o.positions,
          deadline: o.deadline?.toISOString() ?? null, status: o.status as string,
          createdByPseudonim: o.createdBy.pseudonim, zadrugaName: o.zadruga?.name ?? null,
          ukupnoPrijava: o._count.prijave, pendingEvidencija: o._count.evidencije,
          createdAt: o.createdAt.toISOString(),
        })),
        pendingPrijave: zaposljavanjeData[1].map((p) => ({
          id: p.id, pseudonim: p.user.pseudonim, oglasTitle: p.oglas.title,
          hourlyRate: p.oglas.hourlyRate, positions: p.oglas.positions,
          createdAt: p.createdAt.toISOString(),
        })),
        pendingEvidencije: zaposljavanjeData[2].map((e) => ({
          id: e.id, pseudonim: e.user.pseudonim, oglasTitle: e.oglas.title,
          date: e.date.toISOString(), hoursWorked: e.hoursWorked, amount: e.amount,
          description: e.description, createdAt: e.createdAt.toISOString(),
        })),
      }}
    />
  );
}
