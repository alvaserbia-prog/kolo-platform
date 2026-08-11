import { prisma } from "@/lib/prisma";
import { jeAdmin, mozeNadzor, type KorisnikDozvole } from "@/lib/dozvole";
import { listajVerifikacijeZaNadzor } from "@/lib/protokol/nadzor-service";

/**
 * Zajednička logika za podatke „chrome"-a (Header + Sidebar badge-evi).
 *
 * Izvučeno iz `/api/dnevni-brojevi` i `/api/nadzor` da bi se isti račun delio sa
 * konsolidovanim `/api/me` endpointom (jedan zahtev za ceo chrome umesto 6).
 */

export interface DnevniBrojevi {
  novcanik: number;
  pijaca: number;
  adminCekanje: number;
}

/** Badge brojevi uz sidebar linkove + admin „na čekanju". */
export async function izracunajDnevniBrojeve(
  userId: string,
  korisnik: KorisnikDozvole,
): Promise<DnevniBrojevi> {
  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  // "Viđeno" vremena: badge broji samo ono što je stiglo POSLE poslednjeg
  // otvaranja taba. Ako tab još nije otvaran (null), pada na ponoć ("novo danas").
  const meUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { vidjenoNovcanikAt: true, vidjenoPijacaAt: true },
  });
  const odNovcanik = meUser?.vidjenoNovcanikAt ?? danas;
  const odPijaca = meUser?.vidjenoPijacaAt ?? danas;

  // "Novo od poslednje posete" — informativni brojači uz linkove
  const [wallet, pijaca] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId }, select: { id: true } }),
    prisma.marketplaceListing.count({ where: { createdAt: { gt: odPijaca } } }),
  ]);

  const novcanik = wallet
    ? await prisma.transaction.count({ where: { toWalletId: wallet.id, createdAt: { gt: odNovcanik } } })
    : 0;

  // Akcioni badge za admina: zbir stavki "na čekanju" koje traže admin radnju
  let adminCekanje = 0;
  if (jeAdmin(korisnik)) {
    // Krugovi izbačeni iz admin panela → ne broje se ovde (nemaju tab gde bi se rešili).
    const [
      programi, oglasPrijave, oglasEvidencije,
      pokrovitelji, donacije, prigovori, prijaveOglasa, prviOglasi,
    ] = await Promise.all([
      prisma.programEnrollment.count({ where: { status: "PENDING" } }),
      prisma.oglasPrijava.count({ where: { status: "PENDING" } }),
      prisma.oglasEvidencija.count({ where: { status: "PENDING" } }),
      prisma.pokroviteljPrijava.count({ where: { status: "POTPISANA" } }),
      prisma.donationRecord.count({ where: { status: "PENDING" } }),
      prisma.prigovorNaOdluku.count({ where: { status: { in: ["PENDING", "U_OBRADI"] } } }),
      // Prijavljeni oglasi na Pijaci — red čekanja za moderaciju (Uslovi čl. 25).
      prisma.prijavaOglasa.count({ where: { status: "OTVORENA" } }),
      // Prvi oglasi naloga bez potvrde — čekaju odobrenje doprinosa (čl. 40a st. 4).
      prisma.doprinosSadrzaju.count({ where: { status: "ZABELEZEN" } }),
    ]);
    adminCekanje =
      programi + oglasPrijave + oglasEvidencije +
      pokrovitelji + donacije + prigovori + prijaveOglasa + prviOglasi;
  }

  return { novcanik, pijaca, adminCekanje };
}

/** Broj verifikacija koje čekaju nadzor (samo za nosioce ZRNA / admine). */
export async function izracunajNadzorBroj(
  userId: string,
  korisnik: KorisnikDozvole,
): Promise<number> {
  if (!mozeNadzor(korisnik)) return 0;
  const lista = await listajVerifikacijeZaNadzor(userId);
  return lista.length;
}
