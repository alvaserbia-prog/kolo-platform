import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { glasackaMoc } from "@/lib/banka/zrno";
import GlasanjeKlijent from "./GlasanjeKlijent";

export default async function GlasanjePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const now = new Date();

  const [predlozi, stanje] = await Promise.all([
    prisma.glasanjePredlog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { pseudonim: true } },
        glasovi: true,
      },
    }),
    prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } }),
  ]);

  // Auto-close expired
  const toClose = predlozi.filter((p) => p.status === "ACTIVE" && p.deadline < now);
  if (toClose.length > 0) {
    await prisma.glasanjePredlog.updateMany({
      where: { id: { in: toClose.map((p) => p.id) } },
      data: { status: "CLOSED" },
    });
    toClose.forEach((p) => { p.status = "CLOSED"; });
  }

  const mojaGlasackaMoc = glasackaMoc(stanje?.aktivno ?? 0);

  return (
    <GlasanjeKlijent
      predlozi={predlozi.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        authorPseudonim: p.author.pseudonim,
        deadline: p.deadline.toISOString(),
        status: p.status as "ACTIVE" | "CLOSED",
        zaGlasova: p.glasovi.filter((g) => g.za).reduce((s, g) => s + g.glasackaGlasova, 0),
        protiGlasova: p.glasovi.filter((g) => !g.za).reduce((s, g) => s + g.glasackaGlasova, 0),
        mojGlas: p.glasovi.find((g) => g.userId === session.user.id)?.za ?? null,
        createdAt: p.createdAt.toISOString(),
      }))}
      mojaGlasackaMoc={mojaGlasackaMoc}
    />
  );
}
