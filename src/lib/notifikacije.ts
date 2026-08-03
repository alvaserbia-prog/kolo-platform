import { prisma } from "./prisma";
import { posaljiPush } from "./push";
import { posaljiEmailKorisniku } from "./email";

export interface NotifikacijaOpcije {
  /**
   * Da li uz zvonce ide i email. Podrazumevano `true` — obaveštenja se šalju kad
   * se desilo nešto što traži pažnju, pa korisnik treba da sazna i van aplikacije.
   * Isključi (`false`) kad je mejl suvišan: primalac isti događaj već dobija
   * drugim kanalom (npr. admin preko `posaljiAdminAlert`).
   *
   * Sam korisnik gasi sve mejlove ovog tipa u profilu (`User.emailObavestenja`)
   * ili linkom iz podnožja mejla — provera je u `posaljiEmailKorisniku`.
   */
  email?: boolean;
  /** Tekst dugmeta u mejlu; podrazumevano „Otvori u aplikaciji". */
  emailDugme?: string;
}

export async function posaljiNotifikaciju(
  userId: string,
  tip: string,
  naslov: string,
  tekst: string,
  link?: string,
  opcije?: NotifikacijaOpcije,
) {
  await prisma.notifikacija.create({
    data: { userId, tip, naslov, tekst, link },
  });
  // Push na telefon/uređaj (ako je korisnik uključio obaveštenja). Ne blokira i
  // ne baca — zvonce u aplikaciji radi nezavisno od push-a.
  void posaljiPush(userId, { naslov, tekst, link, tip });
  // Email (Resend) — isti tekst kao zvonce. Takođe ne blokira i ne baca.
  if (opcije?.email !== false) {
    void posaljiEmailKorisniku(userId, {
      naslov,
      tekst,
      link,
      linkTekst: opcije?.emailDugme,
    });
  }
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
        // Bez mejla: admini isti događaj već dobijaju preko `posaljiAdminAlert`
        // (email + Telegram) iz rute registracije — inače bi stigao dvaput.
        { email: false },
      ),
    ),
  );
}
