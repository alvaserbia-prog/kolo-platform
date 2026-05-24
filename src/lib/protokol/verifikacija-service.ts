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
import { TipKorisnika, TransactionType } from "@/generated/prisma/client";

export class VerifikacijaGreska extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "VerifikacijaGreska";
  }
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
  potvrdaPrisustva: boolean;
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
  const { verifikatorId, tokenIliBroj, potvrdaPrisustva } = input;

  if (!potvrdaPrisustva) {
    throw new VerifikacijaGreska(
      "Moraš potvrditi fizičko prisustvo i lično poznavanje.",
      400
    );
  }
  if (!tokenIliBroj || tokenIliBroj.trim().length === 0) {
    throw new VerifikacijaGreska("Kod je obavezan.", 400);
  }

  // Faza 1: DB promene u jednoj transakciji
  // Skini sve whitespace karaktere (razmaci, tab, novi red) — QR ekran prikazuje "384 729"
  const trimmed = tokenIliBroj.replace(/\s+/g, "");
  const {
    verifikacijaId,
    verifikatorPseudonim,
    verifikatorWalletId,
    verifikovaniPseudonim,
    verifikovaniWalletId,
    verifikovaniNoviIndeks,
  } = await prisma.$transaction(async (tx) => {
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

      // Provera da verifikovani već nije verifikovan
      if (verifikovani.tipKorisnika !== TipKorisnika.NEVERIFIKOVAN) {
        throw new VerifikacijaGreska(
          "Ovaj korisnik je već verifikovan u sistemu.",
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
        },
      });

      // Ažuriraj verifikovanog: postaje REGULARNI sa indeksom 10
      const brojVerifikacijaVerifikovanog = await tx.verifikacionaVeza.count({
        where: { verifikovaniId: verifikovani.id },
      });
      const noviIndeks = izracunajIndeks(brojVerifikacijaVerifikovanog);
      await tx.user.update({
        where: { id: verifikovani.id },
        data: {
          tipKorisnika: TipKorisnika.REGULARNI,
          indeksStvarnosti: noviIndeks,
          verified: true,
          verifiedAt: new Date(),
        },
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
    });

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
