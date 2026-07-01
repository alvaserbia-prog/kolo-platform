import { prisma } from "./prisma";
import { zakaziPush } from "./push";

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
  // Push na telefon/uređaj (ako je korisnik uključio obaveštenja). Ne blokira i
  // ne baca — zvonce u aplikaciji radi nezavisno od push-a. `zakaziPush` koristi
  // `after()` da push preživi kraj serverless odgovora (vidi push.ts).
  zakaziPush(userId, { naslov, tekst, link, tip });
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
