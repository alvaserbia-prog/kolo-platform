import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { glasackaMoc, poslednjiKurs, UKUPNO_ZRNA } from "@/lib/protokol/zrno";
import ZrnoKlijent from "./ZrnoKlijent";

export default async function ZrnoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);
  const now = new Date();

  const [stanje, wallet, upisZahtev, otpisZahtev, statusZahtevi, delegacija, trziste, kurs, poslednjiKursovi, predlozi] = await Promise.all([
    prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } }),
    prisma.wallet.findUnique({ where: { userId: session.user.id }, select: { balance: true } }),
    prisma.zrnoUpisZahtev.findUnique({ where: { userId_date: { userId: session.user.id, date: danas } } }),
    prisma.zrnoOtpisZahtev.findUnique({ where: { userId_date: { userId: session.user.id, date: danas } } }),
    prisma.zrnoStatusZahtev.findMany({ where: { userId: session.user.id, status: "PENDING" } }),
    prisma.zrnoDelegacija.findUnique({
      where: { delegatorId: session.user.id },
      include: { delegat: { select: { pseudonim: true } }, zakazaniDelegat: { select: { pseudonim: true } } },
    }),
    prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } }),
    poslednjiKurs(),
    prisma.zrnoDailyRate.findMany({ orderBy: { date: "desc" }, take: 7 }),
    prisma.glasanjePredlog.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { pseudonim: true } }, glasovi: true },
    }),
  ]);

  // Auto-close expired proposals
  const toClose = predlozi.filter((p) => p.status === "ACTIVE" && p.deadline < now);
  if (toClose.length > 0) {
    await prisma.glasanjePredlog.updateMany({
      where: { id: { in: toClose.map((p) => p.id) } },
      data: { status: "CLOSED" },
    });
    toClose.forEach((p) => { p.status = "CLOSED"; });
  }

  const slobodno = stanje?.slobodno ?? 0;
  const aktivno = stanje?.aktivno ?? 0;
  const moc = glasackaMoc(aktivno);

  return (
    <ZrnoKlijent
      slobodno={slobodno}
      aktivno={aktivno}
      glasackaMoc={moc}
      poenBalans={wallet?.balance ?? 0}
      kurs={kurs}
      trzisjeAktivno={trziste?.isActive ?? false}
      isVerified={session.user.verified}
      upisZahtev={upisZahtev ? { poenIznos: upisZahtev.poenIznos, status: upisZahtev.status } : null}
      otpisZahtev={otpisZahtev ? { kolicina: otpisZahtev.kolicina, status: otpisZahtev.status } : null}
      statusZahtevi={statusZahtevi.map((z) => ({ kolicina: z.kolicina, akcija: z.akcija }))}
      delegacija={delegacija ? {
        aktivna: delegacija.delegatId != null,
        delegatPseudonim: delegacija.delegat?.pseudonim ?? null,
        imaZakazano: delegacija.imaZakazano,
        zakazaniPseudonim: delegacija.zakazaniDelegat?.pseudonim ?? null,
      } : null}
      poslednjiKursovi={poslednjiKursovi.map((r) => ({ date: r.date.toISOString(), kurs: Number(r.kurs) }))}
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
    />
  );
}
