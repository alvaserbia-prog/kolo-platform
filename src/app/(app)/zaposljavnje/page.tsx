import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ZaposljavanjeKlijent from "./ZaposljavanjeKlijent";

export default async function ZaposljavljanjePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [oglasiRaw, mojePrijaveRaw] = await Promise.all([
    prisma.radniOglas.findMany({
      where: { status: "ACTIVE" },
      include: {
        createdBy: { select: { pseudonim: true } },
        zadruga: { select: { name: true } },
        _count: { select: { prijave: { where: { status: "APPROVED" } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.radniOglasPrijava.findMany({
      where: { userId: session.user.id },
      select: { oglasId: true, status: true },
    }),
  ]);

  const prijaveMap = Object.fromEntries(mojePrijaveRaw.map((p) => [p.oglasId, p.status]));

  const oglasi = oglasiRaw.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    source: o.source as string,
    hourlyRate: o.hourlyRate,
    maxHoursPerDay: o.maxHoursPerDay,
    positions: o.positions,
    deadline: o.deadline?.toISOString() ?? null,
    createdByPseudonim: o.createdBy.pseudonim,
    zadrugaName: o.zadruga?.name ?? null,
    odobreniClanovi: o._count.prijave,
    createdAt: o.createdAt.toISOString(),
    mojaPrijava: (prijaveMap[o.id] ?? null) as string | null,
  }));

  return (
    <ZaposljavanjeKlijent
      oglasi={oglasi}
      isVerified={session.user.verified}
    />
  );
}
