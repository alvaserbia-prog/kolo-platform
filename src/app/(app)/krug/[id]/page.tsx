import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import KrugDetalj from "./KrugDetalj";

export default async function KrugPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const { id } = await params;

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
      isAdmin={session.user.tipKorisnika === "POCETNI"}
    />
  );
}
