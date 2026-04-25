import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import KrugKlijent from "./KrugKlijent";

export default async function KrugPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [krugovi, aktivnoMemberstvo, mojiZahtevi] = await Promise.all([
    prisma.krug.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      include: {
        wallet: { select: { balance: true } },
        _count: { select: { memberships: { where: { leftAt: null } } } },
      },
    }),
    prisma.krugClanstvo.findFirst({
      where: { userId: session.user.id, leftAt: null },
      include: { krug: { select: { id: true, name: true } } },
    }),
    prisma.krugOsnivanjeZahtev.findFirst({
      where: { inicijatorId: session.user.id, status: "PENDING" },
    }),
  ]);

  return (
    <KrugKlijent
      krugovi={krugovi.map((z) => ({
        id: z.id,
        name: z.name,
        description: z.description,
        location: z.location,
        balance: z.wallet?.balance ?? 0,
        clanovi: z._count.memberships,
      }))}
      mojaKrug={aktivnoMemberstvo
        ? { id: aktivnoMemberstvo.krug.id, name: aktivnoMemberstvo.krug.name, isAdmin: aktivnoMemberstvo.isAdmin }
        : null}
      imaOsnivanjeZahtev={!!mojiZahtevi}
      isVerified={session.user.verified}
    />
  );
}
