import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dohvatiZabelezen } from "@/lib/protokol/doprinos-sadrzaju";
import { dohvatiZabelezeneKorake } from "@/lib/protokol/doprinos-razmeni";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const [wallet, user, zabelezenOglas, zabelezeniKoraci] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { balance: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatar: true },
    }),
    dohvatiZabelezen(session.user.id),
    // Koraci 2–5 putanje (čl. 40a) čekaju iste okidače kao korak 1, pa se u
    // prikazu vode zajedno — jedan red „zabeležen doprinos", ne dva.
    dohvatiZabelezeneKorake(session.user.id),
  ]);
  const zabelezenDoprinos = zabelezenOglas + zabelezeniKoraci;

  // `zabelezenDoprinos` ide kao ODVOJENO polje i nikad se ne sabira sa stanjem
  // računa: do evidentiranja to nije zapis POEN-a (čl. 40a st. 3), pa bi zbir
  // pokazivao POEN koji u Protokolu ne postoji. Vidi ga samo vlasnik naloga (čl. 67).
  return NextResponse.json({
    balance: wallet?.balance ?? 0,
    avatar: user?.avatar ?? null,
    zabelezenDoprinos,
  });
}
