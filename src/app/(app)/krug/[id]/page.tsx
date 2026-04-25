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
            user: {
              select: {
                pseudonim: true,
                programEnrollments: { where: { status: "PENDING" }, select: { id: true, type: true, metadata: true, createdAt: true } },
                doprinosEvidencije: { where: { status: "PENDING" }, select: { id: true, date: true, description: true, amount: true, createdAt: true } },
              },
            },
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
          pendingEnrollments: m.user.programEnrollments.map((e) => ({
            id: e.id,
            type: e.type as string,
            metadata: e.metadata as Record<string, unknown> | null,
            createdAt: e.createdAt.toISOString(),
          })),
          pendingEvidencije: m.user.doprinosEvidencije.map((e) => ({
            id: e.id,
            date: e.date.toISOString(),
            description: e.description,
            amount: e.amount,
            createdAt: e.createdAt.toISOString(),
          })),
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
      isAdmin={session.user.role === "ADMIN"}
    />
  );
}
