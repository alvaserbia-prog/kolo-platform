import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import KrugDetalj from "./KrugDetalj";
import { KRUG_TABOVI, type Tab } from "./tabovi";
import { jeAdmin } from "@/lib/dozvole";
import { KRUG_AKTIVAN } from "@/lib/moduli";

export default async function KrugPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!KRUG_AKTIVAN) notFound();
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const { id } = await params;

  // Tab iz URL-a (?tab=clanovi) — back navigacija vraća na isti tab.
  const { tab } = await searchParams;
  const pocetniTab: Tab = (KRUG_TABOVI as readonly string[]).includes(tab ?? "")
    ? (tab as Tab)
    : "info";

  const [krug, mojeMemberstvo, mojaPristupnica] = await Promise.all([
    prisma.krug.findUnique({
      where: { id },
      include: {
        wallet: { select: { balance: true } },
        memberships: {
          where: { leftAt: null },
          include: {
            // Socijalni programi se prijavljuju i odobravaju isključivo kroz
            // Fondaciju (/programi + verifikatorske potvrde) — krug nema uvid u
            // prijave ni osetljive podatke članova (Pravilnik o programima
            // podrške čl. 4, čl. 14).
            user: { select: { pseudonim: true } },
          },
          orderBy: { joinedAt: "asc" },
        },
        projects: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } },
        pristupnice: {
          where: { status: "PENDING" },
          include: { user: { select: { pseudonim: true } } },
        },
      },
    }),
    prisma.krugClanstvo.findFirst({
      where: { krugId: id, userId: session.user.id, leftAt: null },
    }),
    prisma.krugPristupnica.findFirst({
      where: { krugId: id, userId: session.user.id, status: "PENDING" },
    }),
  ]);

  if (!krug) notFound();

  return (
    <KrugDetalj
      krug={{
        id: krug.id,
        name: krug.name,
        description: krug.description,
        location: krug.location,
        balance: krug.wallet?.balance ?? 0,
        clanovi: krug.memberships.map((m) => ({
          userId: m.userId,
          pseudonim: m.user.pseudonim,
          isAdmin: m.isAdmin,
          joinedAt: m.joinedAt.toISOString(),
        })),
        projects: krug.projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: p.type,
          createdAt: p.createdAt.toISOString(),
        })),
        pristupnice: krug.pristupnice.map((p) => ({
          id: p.id,
          pseudonim: p.user.pseudonim,
          userId: p.userId,
        })),
      }}
      mojeClansvo={mojeMemberstvo
        ? { isAdmin: mojeMemberstvo.isAdmin, membershipId: mojeMemberstvo.id }
        : null}
      imaPristupnicu={!!mojaPristupnica}
      isVerified={session.user.verified}
      isAdmin={jeAdmin(session.user)}
      pocetniTab={pocetniTab}
    />
  );
}
