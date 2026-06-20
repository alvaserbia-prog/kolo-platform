/**
 * Servis za izvršenje verifikacije (Pravilnik o dokazu stvarnosti v3.5.0, čl. 5–7, 12).
 *
 * Pattern (kolo-platform/CLAUDE.md):
 *   - DB promene unutar prisma.$transaction (atomarno)
 *   - emitujPoen() pozivi sekvencijalno VAN transakcije (ima sopstvenu)
 */
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "@/lib/protokol/emisija";
import {
  GrafZapis,
  MAX_INDEKS,
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
  TOKEN_VAZI_SEKUNDI,
  imaPristupVerifikaciji,
  izracunajIndeks,
  izracunajKapacitet,
  podlezeNadzoru,
  proveriAntiCirkularno,
  raspolozivSlot,
} from "@/lib/protokol/dokaz-stvarnosti";
import { Prisma, TipKorisnika, TransactionType } from "@/generated/prisma/client";

export class VerifikacijaGreska extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "VerifikacijaGreska";
  }
}

/** Najveća dužina slobodne oznake (nadimka) koju verifikator daje verifikovanome. */
export const MAX_OZNAKA_DUZINA = 80;

/**
 * Normalizuje oznaku verifikatora: trimuje, sažima razmake i seče na MAX_OZNAKA_DUZINA.
 * Prazna/whitespace oznaka → null (briše postojeću).
 */
export function normalizujOznaku(oznaka: unknown): string | null {
  if (typeof oznaka !== "string") return null;
  const ocisceno = oznaka.replace(/\s+/g, " ").trim();
  if (ocisceno.length === 0) return null;
  return ocisceno.slice(0, MAX_OZNAKA_DUZINA);
}

/**
 * Generiše jednokratan token za verifikaciju za datog korisnika.
 * Token važi 60 sekundi. Vraća { token, brojCifara, expiresAt }.
 */
export async function generisiTokenZaVerifikaciju(korisnikId: string) {
  const korisnik = await prisma.user.findUnique({ where: { id: korisnikId } });
  if (!korisnik) {
    throw new VerifikacijaGreska("Korisnik ne postoji", 404);
  }

  // Generiše unique token i 6-cifren broj
  // Retry pri kolizijama (vrlo retke — 32 bajta hex ima 2^256 prostor)
  for (let pokusaj = 0; pokusaj < 5; pokusaj++) {
    const token = crypto.randomBytes(32).toString("hex");
    const brojCifara = String(Math.floor(100000 + Math.random() * 900000));
    try {
      const expiresAt = new Date(Date.now() + TOKEN_VAZI_SEKUNDI * 1000);
      const zapis = await prisma.verifikacijaToken.create({
        data: {
          token,
          brojCifara,
          korisnikId,
          expiresAt,
        },
      });
      return {
        token: zapis.token,
        brojCifara: zapis.brojCifara,
        expiresAt: zapis.expiresAt,
      };
    } catch (e) {
      // Unique violation — pokušaj ponovo
      if (pokusaj === 4) throw e;
    }
  }
  throw new VerifikacijaGreska("Ne mogu da generišem token, pokušaj ponovo", 500);
}

export type IzvrsiVerifikacijuInput = {
  verifikatorId: string;
  tokenIliBroj: string; // 64-char hex ili 6-cifren broj
  potvrdaPoznavanja: boolean;
  oznaka?: string; // opciona slobodna oznaka (nadimak) za verifikovanog — samo verifikator/UO
};

export type IzvrsiVerifikacijuRezultat = {
  verifikacijaId: string;
  verifikovaniPseudonim: string;
  verifikovaniNoviIndeks: number;
};

/**
 * Izvršava verifikaciju: token-match + provere + DB upis + POEN emisija.
 */
export async function izvrsiVerifikaciju(
  input: IzvrsiVerifikacijuInput
): Promise<IzvrsiVerifikacijuRezultat> {
  const { verifikatorId, tokenIliBroj, potvrdaPoznavanja } = input;
  const oznaka = normalizujOznaku(input.oznaka);

  if (!potvrdaPoznavanja) {
    throw new VerifikacijaGreska(
      "Moraš potvrditi lično poznavanje i odgovornost za verifikaciju.",
      400
    );
  }
  if (!tokenIliBroj || tokenIliBroj.trim().length === 0) {
    throw new VerifikacijaGreska("Kod je obavezan.", 400);
  }

  // Faza 1: DB promene u jednoj transakciji
  // Skini sve whitespace karaktere (razmaci, tab, novi red) — QR ekran prikazuje "384 729"
  const trimmed = tokenIliBroj.replace(/\s+/g, "");

  // K6: SERIALIZABLE izolacija + jedinstven par (verifikatorId, verifikovaniId).
  // Time se sprečava da dve istovremene verifikacije (npr. recipročno A→B i B→A, ili
  // dupli A→B) obe prođu anti-cirkularnu proveru protiv grafa koji još ne sadrži onu
  // drugu vezu. Konflikt serijalizacije (P2034) ili dupli par (P2002) → čista poruka.
  let fazaJedan: {
    verifikacijaId: string;
    verifikatorPseudonim: string;
    verifikatorWalletId: string;
    verifikovaniPseudonim: string;
    verifikovaniWalletId: string;
    verifikovaniNoviIndeks: number;
  };
  try {
    fazaJedan = await prisma.$transaction(async (tx) => {
      // Pronađi token: bilo po 64-char hex ili 6-cifrenom broju
      const token = await tx.verifikacijaToken.findFirst({
        where: {
          OR: [{ token: trimmed }, { brojCifara: trimmed }],
        },
      });
      if (!token) {
        if (process.env.NODE_ENV !== "production") {
          // Dev-only dijagnostika
          const aktivniTokeni = await tx.verifikacijaToken.findMany({
            where: { used: false, expiresAt: { gt: new Date() } },
            select: { brojCifara: true, expiresAt: true, korisnikId: true },
            take: 5,
          });
          console.warn(
            "[verifikacija] Token NIJE pronađen. Unos:",
            JSON.stringify(trimmed),
            "dužina:",
            trimmed.length,
            "Aktivni tokeni u bazi:",
            aktivniTokeni.map((t) => ({
              brojCifara: t.brojCifara,
              istice: t.expiresAt.toISOString(),
            }))
          );
        }
        throw new VerifikacijaGreska(
          `Nevažeći kod (uneseno: "${trimmed}"). Proveri da li si tačno preneo cifre.`,
          404
        );
      }
      if (token.used) {
        throw new VerifikacijaGreska("Kod je već iskorišćen.", 409);
      }
      if (token.expiresAt.getTime() < Date.now()) {
        throw new VerifikacijaGreska(
          "Kod je istekao. Neka osoba generiše novi.",
          410
        );
      }
      if (token.korisnikId === verifikatorId) {
        throw new VerifikacijaGreska("Ne možeš da verifikuješ samog sebe.", 400);
      }

      // Učitaj verifikatora i verifikovanog
      const verifikator = await tx.user.findUnique({
        where: { id: verifikatorId },
      });
      if (!verifikator) {
        throw new VerifikacijaGreska("Verifikator ne postoji.", 404);
      }
      const verifikovani = await tx.user.findUnique({
        where: { id: token.korisnikId },
      });
      if (!verifikovani) {
        throw new VerifikacijaGreska("Verifikovani korisnik ne postoji.", 404);
      }

      // Provera prava verifikatora (čl. 4)
      if (!imaPristupVerifikaciji(verifikator.tipKorisnika, verifikator.indeksStvarnosti)) {
        throw new VerifikacijaGreska(
          "Nemaš pravo da verifikuješ druge (indeks ispod 10% ili nisi verifikovan).",
          403
        );
      }

      // Dokaz stvarnosti čl. 15: drugi korisnici MOGU da verifikuju nosioce ZRNA
      // po redovnim pravilima lanca jemstva. Njihov indeks raste kao evidencija,
      // ali bez funkcionalnog efekta — pristup i kapacitet proizlaze iz statusa,
      // ne iz indeksa (čl. 17). Status se NE menja u REGULARNI.
      const verifikovaniJePoseban =
        verifikovani.tipKorisnika === TipKorisnika.NOSILAC_ZRNA;

      // REGULARNI korisnik sa punim indeksom (100%) nema šta da dobije dodatnom
      // verifikacijom. Posebni statusi nemaju gornju granicu evidencije (cap je 100).
      if (
        verifikovani.tipKorisnika === TipKorisnika.REGULARNI &&
        verifikovani.indeksStvarnosti >= MAX_INDEKS
      ) {
        throw new VerifikacijaGreska(
          "Ovaj korisnik već ima maksimalan indeks stvarnosti (100%).",
          409
        );
      }

      // Provera kapaciteta / slota
      const kapacitet = izracunajKapacitet(
        verifikator.tipKorisnika,
        verifikator.indeksStvarnosti
      );
      if (!raspolozivSlot(kapacitet, verifikator.slotoviPotroseni)) {
        throw new VerifikacijaGreska(
          "Nemaš slobodan slot — pričekaj nadzor.",
          409
        );
      }

      // Anti-malverzacija: početni nosioci ZRNA (osnivači) NE smeju da verifikuju
      // jedan drugog. Mogu da verifikuju sve ostale (bootstrap lanca jemstva), ali
      // međusobna verifikacija bi im veštački napumpala indeks/poverenje u zatvorenom
      // krugu. Osnivače razlikuje marker `jeOsnivac` (ne tipKorisnika — NOSILAC_ZRNA
      // status može steći i običan korisnik upisom ZRNA).
      if (verifikator.jeOsnivac && verifikovani.jeOsnivac) {
        throw new VerifikacijaGreska(
          "Početni nosioci ZRNA (osnivači) ne mogu verifikovati jedan drugog.",
          403
        );
      }

      // Anti-cirkularno (čl. 12)
      const grafRaw = await tx.verifikacionaVeza.findMany({
        select: { verifikatorId: true, verifikovaniId: true },
      });
      const graf: GrafZapis[] = grafRaw.map((g) => ({
        verifikatorId: g.verifikatorId,
        verifikovaniId: g.verifikovaniId,
      }));
      const acRezultat = proveriAntiCirkularno(verifikatorId, verifikovani.id, graf);
      if (!acRezultat.dozvoljeno) {
        throw new VerifikacijaGreska(acRezultat.razlog, 403);
      }

      // Izračunaj redniBroj
      const brojObavljenih = await tx.verifikacionaVeza.count({
        where: { verifikatorId },
      });
      const redniBroj = brojObavljenih + 1;
      const treboNadzor = podlezeNadzoru(verifikator.tipKorisnika);

      // Kreiraj VerifikacionaVeza zapis
      const veza = await tx.verifikacionaVeza.create({
        data: {
          verifikatorId,
          verifikovaniId: verifikovani.id,
          redniBroj,
          podlezeNadzoru: treboNadzor,
          oznakaVerifikatora: oznaka,
        },
      });

      // Ažuriraj verifikovanog: indeks = broj veza × 10 (cap 100).
      // Pri prvoj verifikaciji indeks je 10; svaka dodatna podiže za 10 p.p. do 100.
      const brojVerifikacijaVerifikovanog = await tx.verifikacionaVeza.count({
        where: { verifikovaniId: verifikovani.id },
      });
      const izracunatiIndeks = izracunajIndeks(brojVerifikacijaVerifikovanog);
      // Za posebne statuse (POCETNI/NOSILAC_ZRNA) indeks je evidencija bez
      // funkcionalnog efekta: zadržavamo status i nikad ne umanjujemo postojeći
      // indeks (npr. bootstrap 10% početnog korisnika iz čl. 14, koji ne potiče iz
      // lanca jemstva). NEVERIFIKOVAN/REGULARNI postaje (ostaje) REGULARNI.
      const noviIndeks = verifikovaniJePoseban
        ? Math.max(verifikovani.indeksStvarnosti, izracunatiIndeks)
        : izracunatiIndeks;
      await tx.user.update({
        where: { id: verifikovani.id },
        data: {
          tipKorisnika: verifikovaniJePoseban
            ? verifikovani.tipKorisnika
            : TipKorisnika.REGULARNI,
          indeksStvarnosti: noviIndeks,
          verified: true,
          // Zadrži datum prve verifikacije pri dodatnim verifikacijama.
          verifiedAt: verifikovani.verifiedAt ?? new Date(),
        },
      });

      // Sprovedena verifikacija zatvara aktivan zahtev na tabli jemstva (ZAVRSEN).
      await tx.zahtevZaJemstvo.updateMany({
        where: { userId: verifikovani.id, status: "AKTIVAN" },
        data: { status: "ZAVRSEN" },
      });

      // REGULARNI verifikator: slotoviPotroseni += 1
      if (verifikator.tipKorisnika === TipKorisnika.REGULARNI) {
        await tx.user.update({
          where: { id: verifikatorId },
          data: { slotoviPotroseni: { increment: 1 } },
        });
      }

      // Osiguraj wallet za verifikovanog ako ga nema
      let verifikovaniWallet = await tx.wallet.findUnique({
        where: { userId: verifikovani.id },
      });
      if (!verifikovaniWallet) {
        verifikovaniWallet = await tx.wallet.create({
          data: { userId: verifikovani.id, type: "USER", balance: 0 },
        });
      }
      // Osiguraj wallet za verifikatora (sanity — trebao bi da postoji)
      let verifikatorWallet = await tx.wallet.findUnique({
        where: { userId: verifikator.id },
      });
      if (!verifikatorWallet) {
        verifikatorWallet = await tx.wallet.create({
          data: { userId: verifikator.id, type: "USER", balance: 0 },
        });
      }

      // Obeleži token kao iskorišćen
      await tx.verifikacijaToken.update({
        where: { id: token.id },
        data: { used: true, usedAt: new Date() },
      });

      return {
        verifikacijaId: veza.id,
        verifikatorPseudonim: verifikator.pseudonim,
        verifikatorWalletId: verifikatorWallet.id,
        verifikovaniPseudonim: verifikovani.pseudonim,
        verifikovaniWalletId: verifikovaniWallet.id,
        verifikovaniNoviIndeks: noviIndeks,
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (e) {
    if (e instanceof VerifikacijaGreska) throw e;
    const code = e && typeof e === "object" && "code" in e ? (e as { code?: string }).code : undefined;
    if (code === "P2002") {
      throw new VerifikacijaGreska("Ova verifikacija već postoji.", 409);
    }
    if (code === "P2034") {
      throw new VerifikacijaGreska("Verifikacija je u toku — pokušaj ponovo.", 409);
    }
    throw e;
  }
  const {
    verifikacijaId,
    verifikatorPseudonim,
    verifikatorWalletId,
    verifikovaniPseudonim,
    verifikovaniWalletId,
    verifikovaniNoviIndeks,
  } = fazaJedan;

  // Faza 2: POEN emisija — VAN transakcije (emitujPoen ima sopstvenu).
  // Koristi se walletId direktno iz Faze 1 (bez ponovnog findUnique-a) da bi se
  // izbegao connection-pool race u kojem novokreirani wallet nije još vidljiv.
  try {
    await emitujPoen(
      verifikatorWalletId,
      POEN_VERIFIKATOR,
      TransactionType.EMISIJA_VERIFIKACIJA,
      `Verifikacija ${verifikovaniPseudonim} (čl. 7 Pravilnika o dokazu stvarnosti)`
    );
    await emitujPoen(
      verifikovaniWalletId,
      POEN_VERIFIKOVANI,
      TransactionType.EMISIJA_VERIFIKACIJA,
      `Primljena verifikacija od ${verifikatorPseudonim}`
    );
  } catch (e) {
    console.error("[verifikacija-service] POEN emisija pukla posle Faze 1 — incident", {
      verifikacijaId,
      verifikatorWalletId,
      verifikovaniWalletId,
      error: e,
    });
    // Verifikacija je u bazi, slot iskorišćen, ali POEN nije emitovan.
    // Bacamo dalje da UI moze da prikaze upozorenje korisniku.
    throw new VerifikacijaGreska(
      "Verifikacija je evidentirana, ali emisija POEN-a je pukla. Kontaktiraj administratora.",
      500
    );
  }

  return {
    verifikacijaId,
    verifikovaniPseudonim,
    verifikovaniNoviIndeks,
  };
}

/**
 * Postavlja/menja/briše oznaku verifikatora za jednu verifikacionu vezu.
 * Sme je menjati ISKLJUČIVO verifikator koji je obavio tu verifikaciju (vlasnik veze).
 * Prazna oznaka briše postojeću (postavlja na null).
 */
export async function postaviOznakuVerifikatora(input: {
  verifikatorId: string;
  verifikacijaId: string;
  oznaka: string;
}): Promise<{ verifikacijaId: string; oznaka: string | null }> {
  const { verifikatorId, verifikacijaId } = input;
  const oznaka = normalizujOznaku(input.oznaka);

  const veza = await prisma.verifikacionaVeza.findUnique({
    where: { id: verifikacijaId },
    select: { verifikatorId: true },
  });
  if (!veza) {
    throw new VerifikacijaGreska("Verifikacija ne postoji.", 404);
  }
  if (veza.verifikatorId !== verifikatorId) {
    throw new VerifikacijaGreska(
      "Oznaku može da menja samo verifikator koji je obavio verifikaciju.",
      403
    );
  }

  await prisma.verifikacionaVeza.update({
    where: { id: verifikacijaId },
    data: { oznakaVerifikatora: oznaka },
  });

  return { verifikacijaId, oznaka };
}

/**
 * Čisti istekle, neiskorišćene tokene starije od 1h.
 * Poziva se iz cron-a (ili pre svakog generate-a kao garbage collection).
 */
export async function ocistiIstekleTokene(): Promise<{ obrisano: number }> {
  const cutoff = new Date(Date.now() - 60 * 60 * 1000);
  const rez = await prisma.verifikacijaToken.deleteMany({
    where: { expiresAt: { lt: cutoff } },
  });
  return { obrisano: rez.count };
}
