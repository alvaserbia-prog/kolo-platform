import { prisma } from "@/lib/prisma";
import { jeAdmin, mozeNadzor, type KorisnikDozvole } from "@/lib/dozvole";
import { listajVerifikacijeZaNadzor } from "@/lib/protokol/nadzor-service";
import { POKROVITELJSTVO_AKTIVNO } from "@/lib/moduli";
import { ChatSoba } from "@/generated/prisma/client";
import { idPrijatelja, smeUSobu } from "@/lib/protokol/prijateljstva";

/**
 * Zajednička logika za podatke „chrome"-a (Header + Sidebar badge-evi).
 *
 * Izvučeno iz `/api/dnevni-brojevi` i `/api/nadzor` da bi se isti račun delio sa
 * konsolidovanim `/api/me` endpointom (jedan zahtev za ceo chrome umesto 6).
 */

export interface DnevniBrojevi {
  pocetna: number;
  novcanik: number;
  pijaca: number;
  adminCekanje: number;
}

/**
 * Badge uz „Početna" — šta je novo na tom ekranu od poslednjeg otvaranja.
 *
 * Ekran nosi Pričaonicu i Vesti Fondacije, pa se broji tačno to što se na njemu
 * vidi. 🔴 Soba se izvodi iz uzrasta, kao u `GET /api/chat` (Modul Deca, čl. 12):
 * dete broji SAMO dečju sobu i u njoj samo poruke svojih prijatelja (čl. 18
 * st. 3), a dečja Početna nema Vesti pa se Blog ne broji. Brojanje šire od
 * vidljivog dalo bi badge koji se ne može spustiti — otvoriš ekran, a poruke
 * koja ga je podigla nema.
 *
 * Nalog koji još čeka roditelja (čl. 4c) sobu uopšte ne vidi, pa mu je badge 0.
 * Uklonjene poruke (Uslovi čl. 25 st. 2) i sopstvene poruke se ne broje.
 */
async function brojNovoNaPocetnoj(
  userId: string,
  maloletan: boolean,
  od: Date,
): Promise<number> {
  if (maloletan) {
    if (!(await smeUSobu(userId))) return 0;
    // `idPrijatelja` vraća i sam nalog — svoje poruke se ne broje.
    const autori = (await idPrijatelja(userId)).filter((id) => id !== userId);
    if (autori.length === 0) return 0;
    return prisma.chatMessage.count({
      where: {
        createdAt: { gt: od },
        uklonjenoAt: null,
        soba: ChatSoba.DECA,
        userId: { in: autori },
      },
    });
  }

  const [chatNove, blogNove] = await Promise.all([
    prisma.chatMessage.count({
      where: {
        createdAt: { gt: od },
        uklonjenoAt: null,
        soba: ChatSoba.ODRASLI,
        userId: { not: userId },
      },
    }),
    prisma.blogPost.count({ where: { publishedAt: { gt: od } } }),
  ]);
  return chatNove + blogNove;
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
    select: {
      vidjenoNovcanikAt: true,
      vidjenoPijacaAt: true,
      vidjenoPocetnaAt: true,
      maloletan: true,
    },
  });
  const odNovcanik = meUser?.vidjenoNovcanikAt ?? danas;
  const odPijaca = meUser?.vidjenoPijacaAt ?? danas;
  const odPocetna = meUser?.vidjenoPocetnaAt ?? danas;

  // "Novo od poslednje posete" — informativni brojači uz linkove
  const [wallet, pijaca, pocetna] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId }, select: { id: true } }),
    prisma.marketplaceListing.count({ where: { createdAt: { gt: odPijaca } } }),
    brojNovoNaPocetnoj(userId, Boolean(meUser?.maloletan), odPocetna),
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
      pokrovitelji, donacije, prigovori, prijaveOglasa, prviOglasi, prijaveRazmene,
    ] = await Promise.all([
      prisma.programEnrollment.count({ where: { status: "PENDING" } }),
      prisma.oglasPrijava.count({ where: { status: "PENDING" } }),
      prisma.oglasEvidencija.count({ where: { status: "PENDING" } }),
      // Dok je pokroviteljstvo ugašeno, taba nema pa se prijave ne mogu ni rešiti —
      // brojanje bi ostavilo badge koji ne pada ni na jednu radnju.
      POKROVITELJSTVO_AKTIVNO
        ? prisma.pokroviteljPrijava.count({ where: { status: "POTPISANA" } })
        : Promise.resolve(0),
      prisma.donationRecord.count({ where: { status: "PENDING" } }),
      prisma.prigovorNaOdluku.count({ where: { status: { in: ["PENDING", "U_OBRADI"] } } }),
      // Prijavljeni oglasi na Pijaci — red čekanja za moderaciju (Uslovi čl. 25).
      prisma.prijavaOglasa.count({ where: { status: "OTVORENA" } }),
      // Prvi oglasi naloga bez potvrde — čekaju odobrenje doprinosa (čl. 40a st. 4).
      prisma.doprinosSadrzaju.count({ where: { status: "ZABELEZEN" } }),
      // Prijave neispunjene razmene — čekaju odluku o poništenju prepisa.
      prisma.prijavaRazmene.count({ where: { status: "OTVORENA" } }),
    ]);
    adminCekanje =
      programi + oglasPrijave + oglasEvidencije +
      pokrovitelji + donacije + prigovori + prijaveOglasa + prviOglasi + prijaveRazmene;
  }

  return { pocetna, novcanik, pijaca, adminCekanje };
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
