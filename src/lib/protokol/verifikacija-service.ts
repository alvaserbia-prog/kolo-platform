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
  MAX_INDEKS,
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
  TOKEN_VAZI_SEKUNDI,
  imaPristupVerifikaciji,
  izracunajIndeks,
  izracunajKapacitet,
  podlezeNadzoru,
  proveriAntiCirkularno,
  proveriPrelaznoOgranicenje,
  raspolozivSlot,
} from "@/lib/protokol/dokaz-stvarnosti";
import {
  dodajVerifikacijuUZonu,
  proveriDozvoluVerifikacije,
  recomputeZonesSaGrafom,
} from "@/lib/protokol/zona";
import { dopuniZonuPosleUpisa, ucitajGrafIZone } from "@/lib/protokol/zona-sinhronizacija";
import { Prisma, TipKorisnika, TransactionType } from "@/generated/prisma/client";

const PROTOKOL_WALLET_ID = "banka-singleton";

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
 * Token važi 2 sata. Vraća { token, brojCifara, expiresAt }.
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
  verifikovaniId: string;
  verifikovaniPseudonim: string;
  verifikatorPseudonim: string;
  verifikovaniNoviIndeks: number;
};

/** Rezultat Faze 1 (unutar transakcije) — nosi i walletId-eve za POEN emisiju u Fazi 2. */
type FazaJedan = {
  verifikacijaId: string;
  verifikatorPseudonim: string;
  verifikatorWalletId: string;
  verifikovaniId: string;
  verifikovaniPseudonim: string;
  verifikovaniWalletId: string;
  verifikovaniNoviIndeks: number;
};

/**
 * Jezgro verifikacije unutar otvorene transakcije: učita oba korisnika, sprovede
 * SVE provere (čl. 4; zabranjena zona čl. 12 u oba smera; početni nije meta,
 * čl. 14; kapacitet/slot; cap 100%), kreira VerifikacionaVeza, proširi i
 * sinhronizuje zabranjenu zonu, podigne indeks verifikovanog, zatvori njegov
 * aktivan zahtev za jemstvo i potroši slot verifikatoru. Ne dira token — to je stvar pozivaoca
 * (token put ga obeleži kao iskorišćen; put sa table jemstva ne koristi token).
 *
 * Deli ga oba ulaza (`izvrsiVerifikaciju` preko tokena i `izvrsiVerifikacijuSaTable`),
 * da anti-malverzacija provere postoje na tačno jednom mestu.
 */
async function izvrsiJezgroVerifikacije(
  tx: Prisma.TransactionClient,
  verifikatorId: string,
  verifikovaniId: string,
  oznaka: string | null
): Promise<FazaJedan> {
  if (verifikovaniId === verifikatorId) {
    throw new VerifikacijaGreska("Ne možeš da verifikuješ samog sebe.", 400);
  }

  // Učitaj verifikatora i verifikovanog
  const verifikator = await tx.user.findUnique({ where: { id: verifikatorId } });
  if (!verifikator) {
    throw new VerifikacijaGreska("Verifikator ne postoji.", 404);
  }
  const verifikovani = await tx.user.findUnique({ where: { id: verifikovaniId } });
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

  // Drugi korisnici MOGU da verifikuju nosioce ZRNA (koji NISU početni) po
  // redovnim pravilima lanca jemstva. Njihov indeks raste kao evidencija, ali
  // bez funkcionalnog efekta — pristup i kapacitet proizlaze iz statusa, ne iz
  // indeksa (čl. 17). Status se NE menja u REGULARNI. Početne korisnike
  // (jeOsnivac) blokira zonska provera niže (čl. 14 st. 3, v3.9.2).
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
    throw new VerifikacijaGreska("Nemaš slobodan slot — pričekaj nadzor.", 409);
  }

  // Prelazno ograničenje (čl. 22, v3.9.3): dok ukupan opticaj ne dostigne
  // 100.000 POEN-a, korisnik može primiti najviše jednu verifikaciju — mreža
  // se u početnom periodu širi isključivo pristupanjem novih korisnika.
  // Opticaj = apsolutna vrednost protivzapisa Protokola (minus banke).
  const protokolWallet = await tx.wallet.findUnique({
    where: { id: PROTOKOL_WALLET_ID },
    select: { balance: true },
  });
  const opticaj = Math.max(0, -(protokolWallet?.balance ?? 0));
  const vecPrimljenihVerifikacija = await tx.verifikacionaVeza.count({
    where: { verifikovaniId: verifikovani.id },
  });
  const prelazno = proveriPrelaznoOgranicenje(opticaj, vecPrimljenihVerifikacija);
  if (!prelazno.dozvoljeno) {
    throw new VerifikacijaGreska(prelazno.razlog, 409);
  }

  // Zabranjena zona (čl. 12, v3.9.2) + zabrana verifikovanja početnih (čl. 14).
  // Stanje zone se preračunava iz izvora istine (graf veza) unutar iste
  // SERIALIZABLE transakcije — keš tabela verification_zone se ne konsultuje
  // pri validaciji, samo se dopunjava posle upisa. Zabrana verifikovanja
  // početnog korisnika pokriva i raniju anti-malverzacijsku zabranu
  // osnivač→osnivač (svaka verifikacija KA početnom je blokirana).
  const { zapisi, pocetniIds } = await ucitajGrafIZone(tx);
  const { stanje, graf: zonaGraf } = recomputeZonesSaGrafom(zapisi, pocetniIds);
  const zonaRezultat = proveriDozvoluVerifikacije(
    stanje,
    pocetniIds,
    verifikatorId,
    verifikovani.id
  );
  if (!zonaRezultat.dozvoljeno) {
    throw new VerifikacijaGreska(zonaRezultat.razlog, 403);
  }

  // Invarijanta: staro anti-cirkularno pravilo (čl. 12, v3.9.1) je podskup
  // zabranjene zone — ako zona propusti nešto što ono hvata, to je bug u zoni.
  const acRezultat = proveriAntiCirkularno(verifikatorId, verifikovani.id, zapisi);
  if (!acRezultat.dozvoljeno) {
    console.error(
      "[verifikacija-service] INVARIJANTA PREKRŠENA: zona dozvolila, anti-cirkularno odbilo",
      { verifikatorId, verifikovaniId: verifikovani.id, razlog: acRezultat.razlog }
    );
    throw new VerifikacijaGreska(acRezultat.razlog, 403);
  }

  // Izračunaj redniBroj
  const brojObavljenih = await tx.verifikacionaVeza.count({ where: { verifikatorId } });
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

  // Proširi zabranjenu zonu novom ivicom (čl. 12, v3.9.2) i sinhronizuj keš
  // verification_zone U ISTOJ transakciji sa zapisom. Upis punog stanja sa
  // skipDuplicates je idempotentan i samoisceljujuć (dopuni i redove koji bi
  // nedostajali pre inicijalnog backfill-a).
  dodajVerifikacijuUZonu(stanje, zonaGraf, pocetniIds, verifikatorId, verifikovani.id);
  await dopuniZonuPosleUpisa(tx, stanje);

  // Ažuriraj verifikovanog: indeks = broj veza × 10 (cap 100).
  // Pri prvoj verifikaciji indeks je 10; svaka dodatna podiže za 10 p.p. do 100.
  // Broj veza = stanje pre upisa + upravo kreirana (unikatan par + SERIALIZABLE).
  const izracunatiIndeks = izracunajIndeks(vecPrimljenihVerifikacija + 1);
  // Za nosioce ZRNA indeks je evidencija bez funkcionalnog efekta: zadržavamo
  // status i nikad ne umanjujemo postojeći indeks. (Početni korisnici ovde ne
  // stižu — čl. 14 st. 3 ih blokira kao metu; njihov indeks je fiksno 100.)
  // NEVERIFIKOVAN/REGULARNI postaje (ostaje) REGULARNI.
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

  return {
    verifikacijaId: veza.id,
    verifikatorPseudonim: verifikator.pseudonim,
    verifikatorWalletId: verifikatorWallet.id,
    verifikovaniId: verifikovani.id,
    verifikovaniPseudonim: verifikovani.pseudonim,
    verifikovaniWalletId: verifikovaniWallet.id,
    verifikovaniNoviIndeks: noviIndeks,
  };
}

/** Mapira Prisma greške iz Faze 1 (serijalizacija/dupli par) u čiste poruke. */
function mapTransakcijaGreska(e: unknown): never {
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

/**
 * Faza 2: POEN emisija — VAN transakcije (emitujPoen ima sopstvenu).
 * Koristi se walletId direktno iz Faze 1 (bez ponovnog findUnique-a) da bi se
 * izbegao connection-pool race u kojem novokreirani wallet nije još vidljiv.
 */
async function emitujPoenZaVerifikaciju(
  fazaJedan: FazaJedan
): Promise<IzvrsiVerifikacijuRezultat> {
  const {
    verifikacijaId,
    verifikatorPseudonim,
    verifikatorWalletId,
    verifikovaniId,
    verifikovaniPseudonim,
    verifikovaniWalletId,
    verifikovaniNoviIndeks,
  } = fazaJedan;

  try {
    await emitujPoen(
      verifikatorWalletId,
      POEN_VERIFIKATOR,
      TransactionType.EMISIJA_VERIFIKACIJA,
      `Verifikacija ${verifikovaniPseudonim}`
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
    verifikovaniId,
    verifikovaniPseudonim,
    verifikatorPseudonim,
    verifikovaniNoviIndeks,
  };
}

/**
 * Izvršava verifikaciju preko TOKENA (QR / 6-cifren broj) — verifikacija uživo.
 * Token-match + provere (jezgro) + DB upis + POEN emisija.
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
  let fazaJedan: FazaJedan;
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

      const fj = await izvrsiJezgroVerifikacije(tx, verifikatorId, token.korisnikId, oznaka);

      // Obeleži token kao iskorišćen
      await tx.verifikacijaToken.update({
        where: { id: token.id },
        data: { used: true, usedAt: new Date() },
      });

      return fj;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (e) {
    mapTransakcijaGreska(e);
  }

  return emitujPoenZaVerifikaciju(fazaJedan);
}

export type IzvrsiVerifikacijuSaTableInput = {
  verifikatorId: string;
  jemstvoId: string;
  potvrdaPoznavanja: boolean;
  oznaka?: string;
};

/**
 * Izvršava verifikaciju DIREKTNO SA TABLE JEMSTVA: verifikator je našao osobu na
 * tabli (gde se ona predstavila i time dala pristanak da bude verifikovana) i klikom
 * potvrđuje lično poznavanje. Bez tokena — `verifikovaniId` se uzima iz aktivnog
 * zahteva za jemstvo. Sve provere su iste (deljeno jezgro); odgovornost verifikatora
 * i nadzor (P1–P15) ostaju jedini korektiv, uz naknadnu prijavu od strane verifikovanog.
 */
export async function izvrsiVerifikacijuSaTable(
  input: IzvrsiVerifikacijuSaTableInput
): Promise<IzvrsiVerifikacijuRezultat> {
  const { verifikatorId, jemstvoId, potvrdaPoznavanja } = input;
  const oznaka = normalizujOznaku(input.oznaka);

  if (!potvrdaPoznavanja) {
    throw new VerifikacijaGreska(
      "Moraš potvrditi lično poznavanje i odgovornost za verifikaciju.",
      400
    );
  }

  let fazaJedan: FazaJedan;
  try {
    fazaJedan = await prisma.$transaction(async (tx) => {
      const zahtev = await tx.zahtevZaJemstvo.findUnique({
        where: { id: jemstvoId },
        select: { userId: true, status: true, expiresAt: true },
      });
      if (!zahtev) {
        throw new VerifikacijaGreska("Zahtev za jemstvo ne postoji.", 404);
      }
      if (zahtev.status !== "AKTIVAN" || zahtev.expiresAt.getTime() < Date.now()) {
        throw new VerifikacijaGreska("Zahtev za jemstvo više nije aktivan.", 410);
      }
      return izvrsiJezgroVerifikacije(tx, verifikatorId, zahtev.userId, oznaka);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (e) {
    mapTransakcijaGreska(e);
  }

  return emitujPoenZaVerifikaciju(fazaJedan);
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
