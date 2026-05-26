import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminKlijent from "./AdminKlijent";
import { labelPrograma } from "@/lib/protokol/programi";
import { ProgramType } from "@/generated/prisma/client";
import { UKUPNO_ZRNA } from "@/lib/protokol/zrno";
import { logAdminAkcija } from "@/lib/audit";

const SVI_PROGRAMI: ProgramType[] = ["PED", "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE"];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const [
    pendingRequests, allUsers, protokol, pendingKrugovi,
    adminProgrami, dashboardData, auditLogs, krugoviLista, pokroviteljiData, zaposljavanjeData,
    blogObjave,
  ] = await Promise.all([
    prisma.verificationRequest.findMany({
      where: { status: "PENDING" },
      select: {
        id: true, jmbg: true, kanal: true, createdAt: true,
        idFrontPath: true, idBackPath: true,
        user: { select: { pseudonim: true, email: true, referredById: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, pseudonim: true, email: true, role: true, verified: true, status: true, suspendedReason: true, createdAt: true, wallet: { select: { balance: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
    prisma.krugOsnivanjeZahtev.findMany({
      where: { status: "PENDING" },
      include: { inicijator: { select: { pseudonim: true } } },
      orderBy: { createdAt: "asc" },
    }),
    Promise.all([
      prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } }),
      prisma.protokolProgram.findMany(),
      prisma.programEnrollment.findMany({ where: { status: "PENDING" }, include: { user: { select: { pseudonim: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.dailyEmissionSummary.findMany({ orderBy: { date: "desc" }, take: 7 }),
    ]),
    Promise.all([
      prisma.user.count({ where: { role: { not: "ADMIN" } } }),
      prisma.user.count({ where: { verified: true } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
      prisma.krug.count({ where: { status: "ACTIVE" } }),
      prisma.krugClanstvo.count({ where: { leftAt: null } }),
      prisma.zrnoStanje.aggregate({ _sum: { slobodno: true, aktivno: true } }),
      prisma.transaction.count(),
    ]),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { admin: { select: { pseudonim: true } } },
    }),
    prisma.krug.findMany({
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
          _count: { select: { doprinosi: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        where: { verified: true },
        select: { id: true, pseudonim: true },
        orderBy: { pseudonim: "asc" },
      }),
      prisma.krug.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]),
    Promise.all([
      prisma.zadatak.findMany({
        include: {
          createdBy: { select: { pseudonim: true } },
          krug: { select: { name: true } },
          _count: { select: { prijave: true, izvrsenja: { where: { status: "PODNETO" } } } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.zadatakPrijava.findMany({
        where: { status: "PODNETA" },
        include: { user: { select: { pseudonim: true } }, zadatak: { select: { naslov: true, brojIzvrsilaca: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.zadatakIzvrsenje.findMany({
        where: { status: "PODNETO" },
        include: { user: { select: { pseudonim: true } }, zadatak: { select: { naslov: true, mod: true } } },
        orderBy: { createdAt: "asc" },
      }),
    ]),
    prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      include: { author: { select: { pseudonim: true } } },
    }),
  ]);

  const opticaj = protokol ? Math.abs(protokol.balance) : 0;
  const zrnaKodKorisnika = (dashboardData[5]._sum.slobodno ?? 0) + (dashboardData[5]._sum.aktivno ?? 0);

  // Audit log: admin je učitao stranicu sa JMBG podacima iz pending zahteva
  if (pendingRequests.length > 0) {
    await logAdminAkcija(
      session.user.id,
      "PRISTUP_JMBG_PODACI",
      undefined,
      `Pregled ${pendingRequests.length} zahteva za verifikaciju (JMBG vidljiv)`
    );
  }

  return (
    <AdminKlijent
      opticaj={opticaj}
      pending={pendingRequests.map((vr) => ({
        requestId: vr.id, pseudonim: vr.user.pseudonim, email: vr.user.email,
        jmbg: vr.jmbg, imaFotografije: !!(vr.idFrontPath && vr.idBackPath),
        createdAt: vr.createdAt.toISOString(), imaReferral: !!vr.user.referredById,
      }))}
      users={allUsers.map((u) => ({
        id: u.id, pseudonim: u.pseudonim, email: u.email, role: u.role, verified: u.verified,
        status: u.status, suspendedReason: u.suspendedReason,
        balance: u.wallet?.balance ?? 0, createdAt: u.createdAt.toISOString(),
      }))}
      pendingKrugovi={pendingKrugovi.map((z) => ({
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
        poslednjeEmisije: adminProgrami[3].map((s) => ({
          date: s.date.toISOString(), opticaj: s.opticaj, limit: s.limit,
          totalRequested: s.totalRequested, totalEmitted: s.totalEmitted, koeficijent: Number(s.koeficijent),
        })),
      }}
      dashboard={{
        korisnici: { ukupno: dashboardData[0], verifikovanih: dashboardData[1], suspendovanih: dashboardData[2] },
        krugovi: { ukupno: dashboardData[3], krugra: dashboardData[4] },
        finansije: { opticaj, protokolBalance: protokol?.balance ?? 0 },
        zrno: { kodKorisnika: zrnaKodKorisnika, uProtokolu: UKUPNO_ZRNA - zrnaKodKorisnika, ukupno: UKUPNO_ZRNA },
        ukupnoTransakcija: dashboardData[6],
      }}
      auditLogs={auditLogs.map((l) => ({
        id: l.id, adminPseudonim: l.admin.pseudonim, akcija: l.akcija,
        targetId: l.targetId, detalji: l.detalji, createdAt: l.createdAt.toISOString(),
      }))}
      krugoviLista={krugoviLista.map((z) => ({
        id: z.id, name: z.name, location: z.location, status: z.status,
        balance: z.wallet?.balance ?? 0, clanovi: z._count.memberships,
        projekti: z._count.projects, createdAt: z.createdAt.toISOString(),
      }))}
      adminPokrovitelji={pokroviteljiData[0].map((p) => ({
        id: p.id,
        naziv: p.naziv,
        pib: p.pib,
        vlasnikPseudonim: p.vlasnik.pseudonim,
        rsdKumulativ: Number(p.rsdKumulativ),
        trenutniNivo: p.trenutniNivo,
        status: p.status,
        brDoprinosa: p._count.doprinosi,
        createdAt: p.createdAt.toISOString(),
      }))}
      verifikovaniKorisnici={pokroviteljiData[1]}
      krugoviLista2={pokroviteljiData[2]}
      blogObjave={blogObjave.map((o) => ({
        id: o.id,
        title: o.title,
        content: o.content,
        authorPseudonim: o.author.pseudonim,
        publishedAt: o.publishedAt.toISOString(),
        createdAt: o.createdAt.toISOString(),
      }))}
      adminZadaci={{
        zadaci: zaposljavanjeData[0].map((z) => ({
          id: z.id, naslov: z.naslov, izvor: z.izvor as string, mod: z.mod as string,
          stopaPoSatu: z.stopaPoSatu, iznosUCelosti: z.iznosUCelosti, predlozeniPoen: z.predlozeniPoen,
          brojIzvrsilaca: z.brojIzvrsilaca, saOdobravanjem: z.saOdobravanjem, status: z.status as string,
          createdByPseudonim: z.createdBy.pseudonim, krugName: z.krug?.name ?? null,
          ukupnoPrijava: z._count.prijave, pendingIzvrsenja: z._count.izvrsenja,
          createdAt: z.createdAt.toISOString(),
        })),
        pendingPrijave: zaposljavanjeData[1].map((p) => ({
          id: p.id, pseudonim: p.user.pseudonim, zadatakNaslov: p.zadatak.naslov,
          brojIzvrsilaca: p.zadatak.brojIzvrsilaca, planIzvrsenja: p.planIzvrsenja,
          createdAt: p.createdAt.toISOString(),
        })),
        pendingIzvrsenja: zaposljavanjeData[2].map((iz) => ({
          id: iz.id, pseudonim: iz.user.pseudonim, zadatakNaslov: iz.zadatak.naslov,
          mod: iz.zadatak.mod as string, datum: iz.datum.toISOString(), sati: iz.sati,
          dokaz: iz.dokaz, tezina: iz.tezina, createdAt: iz.createdAt.toISOString(),
        })),
      }}
    />
  );
}
