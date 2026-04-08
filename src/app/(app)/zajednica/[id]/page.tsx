import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ZadrugaDetalj from "./ZadrugaDetalj";

export default async function ZadrugaPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const { id } = await params;

  const [zadruga, mojeMemberstvo, mojaPristupnica] = await Promise.all([
    prisma.zadruga.findUnique({
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
                zaposljvanjeEvidencije: { where: { status: "PENDING" }, select: { id: true, date: true, description: true, amount: true, createdAt: true } },
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
    prisma.zadrugaMembership.findFirst({
      where: { zadrugaId: id, userId: session.user.id, leftAt: null },
    }),
    prisma.zadrugaPristupnica.findFirst({
      where: { zadrugaId: id, userId: session.user.id, status: "PENDING" },
    }),
  ]);

  if (!zadruga) notFound();

  return (
    <ZadrugaDetalj
      zadruga={{
        id: zadruga.id,
        name: zadruga.name,
        description: zadruga.description,
        location: zadruga.location,
        balance: zadruga.wallet?.balance ?? 0,
        clanovi: zadruga.memberships.map((m) => ({
          pseudonim: m.user.pseudonim,
          isAdmin: m.isAdmin,
          joinedAt: m.joinedAt.toISOString(),
          pendingEnrollments: m.user.programEnrollments.map((e) => ({
            id: e.id,
            type: e.type as string,
            metadata: e.metadata as Record<string, unknown> | null,
            createdAt: e.createdAt.toISOString(),
          })),
          pendingEvidencije: m.user.zaposljvanjeEvidencije.map((e) => ({
            id: e.id,
            date: e.date.toISOString(),
            description: e.description,
            amount: e.amount,
            createdAt: e.createdAt.toISOString(),
          })),
        })),
        projects: zadruga.projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: p.type,
          createdAt: p.createdAt.toISOString(),
        })),
        pristupnice: zadruga.pristupnice.map((p) => ({
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
