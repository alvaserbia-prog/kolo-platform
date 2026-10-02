import { prisma } from "@/lib/prisma";
import { UserStatus } from "@/generated/prisma/client";

/**
 * Brojevi članova za prve dve kartice admin panela.
 *
 * 🔴 „Aktivni" je ISTI uslov kao broj članova na `/pocetna` (`deaktiviranAt: null`)
 * — obrisan nalog ostaje red u bazi (pseudonimizacija, ne brisanje; na njemu visi
 * istorija zapisa), pa bi `user.count()` bez uslova pokazao jednog više nego početna.
 *
 * Prvi red: ukupno = aktivni + brisani; suspendovani su podskup aktivnih (nalog
 * postoji, privremeno je zaključan).
 * Drugi red razlaže aktivne: redovni + novi + deca = aktivni. Dete nikad nije
 * potvrđeno (ne ulazi u lanac potvrda), pa se redovni i novi broje među punoletnima.
 */
export async function brojeviClanova() {
  const aktivan = { deaktiviranAt: null };
  const [ukupno, aktivni, brisani, suspendovani, redovni, novi, deca] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: aktivan }),
    prisma.user.count({ where: { deaktiviranAt: { not: null } } }),
    prisma.user.count({ where: { ...aktivan, status: UserStatus.SUSPENDED } }),
    prisma.user.count({ where: { ...aktivan, maloletan: false, verified: true } }),
    prisma.user.count({ where: { ...aktivan, maloletan: false, verified: false } }),
    prisma.user.count({ where: { ...aktivan, maloletan: true } }),
  ]);
  return { ukupno, aktivni, brisani, suspendovani, redovni, novi, deca };
}

export type BrojeviClanova = Awaited<ReturnType<typeof brojeviClanova>>;
