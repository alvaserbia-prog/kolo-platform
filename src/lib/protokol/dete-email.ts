/**
 * Imejl adresa maloletnog korisnika — upis, potvrda i uklanjanje.
 *
 * ─── Zašto adresa uopšte postoji ────────────────────────────────────────────
 *
 * Nalog deteta po pravilu nema imejl: pri samostalnoj registraciji dete unosi
 * adresu SVOG RODITELJA, i ona se namerno ne upisuje u `User.email` (čl. 4a,
 * `deca-poziv.ts`). Posledica je bila da detetu tok „zaboravljena lozinka" ne
 * stoji na raspolaganju — a taj tok traži imejl. Zaboravljena lozinka je značila
 * trajno zaključan nalog, sa prijateljstvima i POEN-om u njemu.
 *
 * Otud dva izlaza, i oba su potrebna:
 *  - roditelj postavlja novu lozinku (`postaviLozinkuDeteta` u `deca.ts`) — radi uvek;
 *  - starije dete koje ima svoju adresu upiše je ovde i dalje se snalazi samo.
 *
 * ─── Zašto potvrda, a ne prost upis ─────────────────────────────────────────
 *
 * 🔴 Adresa se NE upisuje u `User.email` u trenutku unosa nego tek kad se klikne
 * link poslat NA NJU. Reset lozinke ide na upisanu adresu, pa bi jedno pogrešno
 * otkucano slovo dalo nepoznatoj osobi trajan ključ od dečjeg naloga — i to bez
 * ijednog znaka da se išta desilo. Sa potvrdom omaška ne pravi štetu: link ode
 * nekom trećem, taj ga ignoriše, adresa se nikad ne upiše.
 *
 * ─── Adresa NE otvara kanal obaveštenja ─────────────────────────────────────
 *
 * 🔴 Pri potvrdi se `emailObavestenja` postavlja na `false`. Adresa se prikuplja
 * radi povratka u nalog, ne radi pošte — obim obrade se ne širi preko svrhe zbog
 * koje je podatak dat. Dete kasnije može da uključi obaveštenja u podešavanjima,
 * ali podrazumevano ćutimo.
 *
 * 🟡 AKTI OVO JOŠ NE POZNAJU. Pravilnik o učešću dece čl. 7 nabraja podatke koje
 * dete navodi (datum rođenja upisuje roditelj, školu bira dete); imejl deteta nije
 * među njima, a Politika privatnosti 4.7 i Registar radnji obrade (radnja br. 11)
 * govore o adresi RODITELJA, po legitimnom interesu. Pre puštanja u rad ovome
 * treba odredba: dobrovoljnost, svrha (isključivo povratak u nalog), brisanje pri
 * punoletstvu i pri gašenju naloga. Do tada je ovo mogućnost koju sistem nudi, a
 * akti ne opisuju.
 */
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/passwordReset";
import { bazniUrl, emailLayout, esc, posaljiEmailRaw } from "@/lib/email";
import { normalizujEmail, validanEmail } from "@/lib/validacija";

const TOKEN_BYTES = 32;

/**
 * Koliko važi link za potvrdu adrese.
 *
 * Duže od sata koji važi za reset lozinke: dete ne sedi nad sandučetom i adresu
 * često proverava tek uveče. Kraće od sedam dana koliko važi poziv roditelju —
 * ovde nema ničega što bi čekalo tuđu odluku.
 */
export const ROK_POTVRDE_SATI = 24;

export class EmailGreska extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = "EmailGreska";
  }
}

/** Stanje adrese kako ga vidi ekran deteta. */
export type StanjeEmaila = {
  /** Potvrđena adresa upisana na nalogu, ako je ima. */
  email: string | null;
  /** Adresa koja čeka potvrdu, ako je ima. */
  naCekanju: string | null;
};

async function deteIliBaci(userId: string) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, maloletan: true, pseudonim: true, email: true, jezik: true },
  });
  if (!u) throw new EmailGreska("Korisnik nije pronađen.", 404);
  if (!u.maloletan) {
    // Punoletni nalozi imejl dobijaju pri registraciji i menjaju ga drugim putem;
    // ova ruta postoji zbog naloga koji je otvoren bez adrese.
    throw new EmailGreska("Ova mogućnost je za naloge maloletnih korisnika.", 403);
  }
  return u;
}

export async function stanjeEmaila(userId: string): Promise<StanjeEmaila> {
  const u = await deteIliBaci(userId);
  const cekanje = await prisma.emailPotvrda.findFirst({
    where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: { email: true },
  });
  return { email: u.email, naCekanju: cekanje?.email ?? null };
}

/**
 * Upisuje adresu u red čekanja i šalje link za potvrdu.
 *
 * Zauzetost adrese proverava se i ovde i pri potvrdi: između dva trenutka može
 * proći ceo dan, a `User.email` je jedinstven, pa bi se potvrda inače srušila na
 * bazi, sa porukom koju čovek ne razume.
 */
export async function zatraziPotvrduEmaila(
  userId: string,
  unos: unknown,
  requestOrigin?: string
): Promise<{ poslato: true; email: string }> {
  const dete = await deteIliBaci(userId);

  if (!validanEmail(unos)) throw new EmailGreska("Unesi ispravnu imejl adresu.", 400);
  const email = normalizujEmail(unos);

  if (dete.email === email) {
    throw new EmailGreska("Ta adresa je već upisana na tvom nalogu.", 400);
  }
  const zauzeta = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (zauzeta) throw new EmailGreska("Ta adresa se već koristi na drugom nalogu.", 409);

  // Jedan živ link po nalogu — inače bi svaki pokušaj ostavljao još jednu
  // upotrebljivu adresu za sobom, pa bi potvrda mogla da upiše onu koju je dete
  // u međuvremenu ispravilo.
  await prisma.emailPotvrda.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  const token = randomBytes(TOKEN_BYTES).toString("hex");
  await prisma.emailPotvrda.create({
    data: {
      userId,
      email,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + ROK_POTVRDE_SATI * 60 * 60 * 1000),
    },
  });

  const link = `${bazniUrl(requestOrigin)}/potvrdi-email/${token}`;
  await posaljiEmailRaw(
    email,
    "Potvrdi svoju adresu — KOLO",
    emailLayout({
      naslov: "Potvrdi svoju adresu",
      pozdrav: dete.pseudonim,
      telo: [
        `Ova adresa je upisana na nalog <strong>${esc(dete.pseudonim)}</strong> na KOLU.`,
        "Ako si to ti, potvrdi je. Služi samo za jedno: da možeš da postaviš novu lozinku ako je zaboraviš. Obaveštenja ti na nju ne šaljemo.",
        `Link važi ${ROK_POTVRDE_SATI} sata.`,
        "Ako ovo nisi ti, nemoj ništa da radiš. Bez potvrde se adresa nigde ne upisuje.",
      ],
      dugme: { tekst: "Potvrdi adresu", link },
      jezik: dete.jezik,
    })
  );

  return { poslato: true, email };
}

/**
 * Potvrđuje adresu i upisuje je na nalog.
 *
 * Radi i bez prijave: link stiže u sanduče, a dete koje ga otvara na tuđem
 * uređaju ili u drugom pretraživaču nije prijavljeno. Sam token je dokaz da je
 * onaj ko ga drži pristupio adresi.
 */
export async function potvrdiEmail(token: unknown): Promise<{ pseudonim: string; email: string }> {
  if (typeof token !== "string" || token.length < 32) {
    throw new EmailGreska("Link nije važeći.", 400);
  }
  const zapis = await prisma.emailPotvrda.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      email: true,
      usedAt: true,
      expiresAt: true,
      user: { select: { id: true, pseudonim: true, maloletan: true, deaktiviranAt: true } },
    },
  });
  if (!zapis || zapis.usedAt || zapis.expiresAt < new Date()) {
    throw new EmailGreska("Link nije važeći ili je istekao. Upiši adresu ponovo.", 400);
  }
  if (!zapis.user.maloletan || zapis.user.deaktiviranAt) {
    throw new EmailGreska("Link nije važeći.", 400);
  }

  const zauzeta = await prisma.user.findUnique({
    where: { email: zapis.email },
    select: { id: true },
  });
  if (zauzeta && zauzeta.id !== zapis.user.id) {
    throw new EmailGreska("Ta adresa se u međuvremenu upisala na drugi nalog.", 409);
  }

  await prisma.$transaction(async (tx) => {
    // Rezerviši token pre upisa: dva klika na isti link ne smeju da prođu oba.
    const uzeto = await tx.emailPotvrda.updateMany({
      where: { id: zapis.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (uzeto.count === 0) throw new EmailGreska("Link je već upotrebljen.", 409);

    await tx.user.update({
      where: { id: zapis.user.id },
      // 🔴 `emailObavestenja: false` — adresa služi povratku u nalog, ne pošti.
      // Vidi zaglavlje fajla.
      data: { email: zapis.email, emailObavestenja: false },
    });
  });

  return { pseudonim: zapis.user.pseudonim, email: zapis.email };
}

/** Uklanjanje adrese sa naloga. Poništava i sve linkove koji još čekaju. */
export async function ukloniEmail(userId: string): Promise<{ ok: true }> {
  await deteIliBaci(userId);
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { email: null } }),
    prisma.emailPotvrda.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
  ]);
  return { ok: true };
}
