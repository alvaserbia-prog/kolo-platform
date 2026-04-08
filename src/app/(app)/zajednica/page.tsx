import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ZajednicaKlijent from "./ZajednicaKlijent";

export default async function ZajednicaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [zadruge, aktivnoMemberstvo, mojiZahtevi] = await Promise.all([
    prisma.zadruga.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
      include: {
        wallet: { select: { balance: true } },
        _count: { select: { memberships: { where: { leftAt: null } } } },
      },
    }),
    prisma.zadrugaMembership.findFirst({
      where: { userId: session.user.id, leftAt: null },
      include: { zadruga: { select: { id: true, name: true } } },
    }),
    prisma.zadrugaOsnivanjeZahtev.findFirst({
      where: { inicijatorId: session.user.id, status: "PENDING" },
    }),
  ]);

  return (
    <ZajednicaKlijent
      zadruge={zadruge.map((z) => ({
        id: z.id,
        name: z.name,
        description: z.description,
        location: z.location,
        balance: z.wallet?.balance ?? 0,
        clanovi: z._count.memberships,
      }))}
      mojaZadruga={aktivnoMemberstvo
        ? { id: aktivnoMemberstvo.zadruga.id, name: aktivnoMemberstvo.zadruga.name, isAdmin: aktivnoMemberstvo.isAdmin }
        : null}
      imaOsnivanjeZahtev={!!mojiZahtevi}
      isVerified={session.user.verified}
    />
  );
}
