import { prisma } from "./prisma";

export async function posaljiNotifikaciju(
  userId: string,
  tip: string,
  naslov: string,
  tekst: string,
  link?: string
) {
  await prisma.notifikacija.create({
    data: { userId, tip, naslov, tekst, link },
  });
}

/**
 * Obavesti sve aktivne admine (UO Fondacije) da se priključio nov korisnik —
 * bez obzira da li je verifikovan ili ne (verifikacija dolazi kasnije).
 */
export async function obavestiAdmineNoviKorisnik(noviUserId: string, pseudonim: string) {
  const admini = await prisma.user.findMany({
    where: { admin: { in: ["ADMIN", "SUPERADMIN"] }, deaktiviranAt: null },
    select: { id: true },
  });
  await Promise.all(
    admini.map((a) =>
      posaljiNotifikaciju(
        a.id,
        "NOV_KORISNIK",
        "Nov korisnik se priključio",
        `Korisnik „${pseudonim}" je upravo napravio nalog.`,
        `/profil/${noviUserId}`,
      ),
    ),
  );
}
