import { prisma } from "@/lib/prisma";
import { UserStatus } from "@/generated/prisma/client";
import { TIP_PO_USLOVU } from "@/lib/protokol/potvrda-poen";

/**
 * Brojevi članova za prve dve kartice admin panela.
 *
 * 🔴 „Registrovani" je ISTI uslov kao broj članova na `/pocetna` (`deaktiviranAt: null`)
 * — obrisan nalog ostaje red u bazi (pseudonimizacija, ne brisanje; na njemu visi
 * istorija zapisa), pa bi `user.count()` bez uslova pokazao jednog više nego početna.
 *
 * Prvi red: ukupno = registrovani + brisani; suspendovani su podskup registrovanih
 * (nalog postoji, privremeno je zaključan).
 * Drugi red razlaže registrovane: redovni + novi + deca = registrovani. Dete nikad nije
 * potvrđeno (ne ulazi u lanac potvrda), pa se redovni i novi broje među punoletnima.
 *
 * „Aktivni" su podskup redovnih (početni članovi uključeni): redovan član koji ima i
 * PRVI POTVRĐEN DOPRINOS — isti trag učešća koji otključava POEN po potvrdi (dokaz
 * stvarnosti čl. 7), pa se tipovi emisija čitaju iz `TIP_PO_USLOVU`, ne prepisuju.
 * Naziv je samo naziv kartice u panelu, ne status člana.
 */
export async function brojeviClanova() {
  const registrovan = { deaktiviranAt: null };
  const redovan = { ...registrovan, maloletan: false, verified: true };
  const [ukupno, registrovani, brisani, suspendovani, redovni, novi, deca, aktivni] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: registrovan }),
    prisma.user.count({ where: { deaktiviranAt: { not: null } } }),
    prisma.user.count({ where: { ...registrovan, status: UserStatus.SUSPENDED } }),
    prisma.user.count({ where: redovan }),
    prisma.user.count({ where: { ...registrovan, maloletan: false, verified: false } }),
    prisma.user.count({ where: { ...registrovan, maloletan: true } }),
    prisma.user.count({
      where: {
        ...redovan,
        wallet: { is: { incomingTx: { some: { type: { in: Object.values(TIP_PO_USLOVU) } } } } },
      },
    }),
  ]);
  return { ukupno, registrovani, brisani, suspendovani, redovni, novi, deca, aktivni };
}

export type BrojeviClanova = Awaited<ReturnType<typeof brojeviClanova>>;
