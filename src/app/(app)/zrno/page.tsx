import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { glasackaMoc, poslednjiKurs, UKUPNO_ZRNA } from "@/lib/banka/zrno";
import ZrnoKlijent from "./ZrnoKlijent";

export default async function ZrnoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [stanje, wallet, kupovinaZahtev, prodajaZahtev, statusZahtevi, delegacija, trziste, kurs, poslednjiKursovi] = await Promise.all([
    prisma.zrnoStanje.findUnique({ where: { userId: session.user.id } }),
    prisma.wallet.findUnique({ where: { userId: session.user.id }, select: { balance: true } }),
    prisma.zrnoKupovinaZahtev.findUnique({ where: { userId_date: { userId: session.user.id, date: danas } } }),
    prisma.zrnoProdajaZahtev.findUnique({ where: { userId_date: { userId: session.user.id, date: danas } } }),
    prisma.zrnoStatusZahtev.findMany({ where: { userId: session.user.id, status: "PENDING" } }),
    prisma.zrnoDelegacija.findUnique({
      where: { delegatorId: session.user.id },
      include: { delegat: { select: { pseudonim: true } } },
    }),
    prisma.zrnoTrziste.findUnique({ where: { id: "singleton" } }),
    poslednjiKurs(),
    prisma.zrnoDailyRate.findMany({ orderBy: { date: "desc" }, take: 7 }),
  ]);

  const slobodno = stanje?.slobodno ?? 0;
  const aktivno = stanje?.aktivno ?? 0;

  return (
    <ZrnoKlijent
      slobodno={slobodno}
      aktivno={aktivno}
      glasackaMoc={glasackaMoc(aktivno)}
      poenBalans={wallet?.balance ?? 0}
      kurs={kurs}
      trzisjeAktivno={trziste?.isActive ?? false}
      isVerified={session.user.verified}
      kupovinaZahtev={kupovinaZahtev ? { poenIznos: kupovinaZahtev.poenIznos, status: kupovinaZahtev.status } : null}
      prodajaZahtev={prodajaZahtev ? { kolicina: prodajaZahtev.kolicina, status: prodajaZahtev.status } : null}
      statusZahtevi={statusZahtevi.map((z) => ({ kolicina: z.kolicina, akcija: z.akcija }))}
      delegacija={delegacija ? { delegatPseudonim: delegacija.delegat.pseudonim, aktivna: delegacija.aktivna } : null}
      poslednjiKursovi={poslednjiKursovi.map((r) => ({ date: r.date.toISOString(), kurs: Number(r.kurs) }))}
    />
  );
}
