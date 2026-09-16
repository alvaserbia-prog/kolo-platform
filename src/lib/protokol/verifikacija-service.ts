/**
 * Servis za izvršenje verifikacije (Pravilnik o dokazu stvarnosti v3.5.0, čl. 5–7, 12).
 *
 * Pattern (kolo-platform/CLAUDE.md):
 *   - DB promene unutar prisma.$transaction (atomarno)
 *   - upis POEN-a sekvencijalno VAN transakcije (emitujPoen ima sopstvenu)
 */
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import {
  MAX_INDEKS,
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
  proveriDozvoluVerifikacijeSaIzuzetkom,
  recomputeZonesSaGrafom,
} from "@/lib/protokol/zona";
import { dopuniZonuPosleUpisa, ucitajGrafIZone } from "@/lib/protokol/zona-sinhronizacija";
import { Prisma, TipKorisnika } from "@/generated/prisma/client";
import { probajUpisatiPotvrdu, javiZabelezeno } from "@/lib/protokol/potvrda-poen";
import { probajEvidentiratiKorake, osveziSagovornike } from "@/lib/protokol/doprinos-razmeni";
import { osveziPrijateljstvaDece } from "@/lib/protokol/prijateljstva";
import { PORUKA_DETE_VAN_LANCA, smeULanacPotvrda } from "@/lib/deca-pravila";

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
 * Token važi 24 sata. Vraća { token, brojCifara, expiresAt }.
 */
export async function generisiTokenZaVerifikaciju(korisnikId: string) {
  const korisnik = await prisma.user.findUnique({ where: { id: korisnikId } });
  if (!korisnik) {
    throw new VerifikacijaGreska("Korisnik ne postoji", 404);
  }
  // Detetu se kod ne izdaje (čl. 15). Ekran `/verifikacija` maloletan nalog i
  // inače preusmerava, ali ekran nije poslednja reč — ruta je dostižna svakome
  // ko zna adresu, a kod koji ništa ne otvara je poziv da se pokuša.
  if (!smeULanacPotvrda(korisnik)) {
    throw new VerifikacijaGreska(PORUKA_DETE_VAN_LANCA, 403);
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
  verifikatorId: string;
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
 * sinhronizuje zabranjenu zonu, podigne indeks verifikovanog i potroši slot
 * verifikatoru. Ne dira token — to je stvar pozivaoca.
 *
 * Otkad je tabla zahteva za jemstvo ukinuta, jedini ulaz je jednokratan kod
 * (`izvrsiVerifikaciju`); jezgro ostaje izdvojeno da provere stoje na jednom mestu.
 */
async function izvrsiJezgroVerifikacije(
  tx: Prisma.TransactionClient,
  verifikatorId: string,
  verifikovaniId: string,
  oznaka: string | null
): Promise<FazaJedan> {
  if (verifikovaniId === verifikatorId) {
    throw new VerifikacijaGreska("Ne možeš da potvrdiš samog sebe.", 400);
  }

  // Učitaj verifikatora i verifikovanog
  const verifikator = await tx.user.findUnique({ where: { id: verifikatorId } });
  if (!verifikator) {
    throw new VerifikacijaGreska("Član koji potvrđuje ne postoji.", 404);
  }
  const verifikovani = await tx.user.findUnique({ where: { id: verifikovaniId } });
  if (!verifikovani) {
    throw new VerifikacijaGreska("Član koga potvrđuješ ne postoji.", 404);
  }

  // Maloletni nalog ne ulazi u lanac potvrda — ni sa jedne strane (čl. 15
  // Pravilnika o učešću dece). Provera stoji PRE svih ostalih jer je jedina
  // koju indeks ne može da nadomesti: `verified` i indeks su ono što se
  // potvrdom dobija, pa se njima meta ne može odbiti. Vidi `smeULanacPotvrda`.
  if (!smeULanacPotvrda(verifikator) || !smeULanacPotvrda(verifikovani)) {
    throw new VerifikacijaGreska(PORUKA_DETE_VAN_LANCA, 403);
  }

  // Provera prava verifikatora (čl. 4)
  if (!imaPristupVerifikaciji(verifikator.tipKorisnika, verifikator.indeksStvarnosti)) {
    throw new VerifikacijaGreska(
      "Ne možeš da potvrđuješ druge: indeks stvarnosti ti je ispod 10% ili tebe još niko nije potvrdio.",
      403
    );
  }

  // Drugi korisnici MOGU da verifikuju nosioce ZRNA (koji NISU početni) po
  // redovnim pravilima lanca potvrda. Njihov indeks raste kao evidencija, ali
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

  // Zabranjena zona (čl. 12, v3.9.2) + zabrana verifikovanja početnih (čl. 14)
  // + izuzetak za prvu generaciju (čl. 12 st. 5, v4.0.1: neposredno verifikovani
  // istog početnog korisnika mogu jedni druge, dok ih linija grafa ne poveže).
  // Stanje zone se preračunava iz izvora istine (graf veza) unutar iste
  // SERIALIZABLE transakcije — keš tabela verification_zone se ne konsultuje
  // pri validaciji, samo se dopunjava posle upisa. Zabrana verifikovanja
  // početnog korisnika pokriva i raniju anti-malverzacijsku zabranu
  // osnivač→osnivač (svaka verifikacija KA početnom je blokirana).
  const { zapisi, pocetniIds } = await ucitajGrafIZone(tx);
  const { stanje, graf: zonaGraf } = recomputeZonesSaGrafom(zapisi, pocetniIds);
  const zonaRezultat = proveriDozvoluVerifikacijeSaIzuzetkom(
    stanje,
    zonaGraf,
    pocetniIds,
    verifikatorId,
    verifikovani.id
  );
  if (!zonaRezultat.dozvoljeno) {
    throw new VerifikacijaGreska(zonaRezultat.razlog, 403);
  }

  // Invarijanta: staro anti-cirkularno pravilo (čl. 12, v3.9.1) je podskup
  // zabranjene zone — ako zona propusti nešto što ono hvata, to je bug u zoni.
  // Preskače se kad je verifikacija dozvoljena po izuzetku za prvu generaciju:
  // staro pravilo izuzetak ne poznaje, pa bi braću pogrešno prijavilo.
  if (!zonaRezultat.izuzetak) {
    const acRezultat = proveriAntiCirkularno(verifikatorId, verifikovani.id, zapisi);
    if (!acRezultat.dozvoljeno) {
      console.error(
        "[verifikacija-service] INVARIJANTA PREKRŠENA: zona dozvolila, anti-cirkularno odbilo",
        { verifikatorId, verifikovaniId: verifikovani.id, razlog: acRezultat.razlog }
      );
      throw new VerifikacijaGreska(acRezultat.razlog, 403);
    }
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
  // 🔴 Član koji je ZRNO upisao PRE nego što ga je iko potvrdio (R-01, odluka B)
  // ostaje NEVERIFIKOVAN dok traje to razdoblje, pa ga `zrno.ts` nije unapredio u
  // nosioca ZRNA. Bez ove provere bi zauvek ostao REGULARNI — ispunio bi oba
  // uslova za glas (aktivirano ZRNO i potvrđena stvarnost), a glas ne bi dobio,
  // jer se unapređenje dešava SAMO u trenutku upisa. Status ga sustiže ovde.
  const zrnoStanje = verifikovaniJePoseban
    ? null
    : await tx.zrnoStanje.findUnique({
        where: { userId: verifikovani.id },
        select: { slobodno: true, aktivno: true },
      });
  const drziZrno = (zrnoStanje?.slobodno ?? 0) + (zrnoStanje?.aktivno ?? 0) > 0;

  await tx.user.update({
    where: { id: verifikovani.id },
    data: {
      tipKorisnika: verifikovaniJePoseban
        ? verifikovani.tipKorisnika
        : drziZrno
          ? TipKorisnika.NOSILAC_ZRNA
          : TipKorisnika.REGULARNI,
      indeksStvarnosti: noviIndeks,
      verified: true,
      // Zadrži datum prve verifikacije pri dodatnim verifikacijama.
      verifiedAt: verifikovani.verifiedAt ?? new Date(),
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

  return {
    verifikacijaId: veza.id,
    verifikatorId: verifikator.id,
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
    throw new VerifikacijaGreska("Ova potvrda već postoji.", 409);
  }
  if (code === "P2034") {
    throw new VerifikacijaGreska("Potvrda je u toku, pokušaj ponovo.", 409);
  }
  throw e;
}

/**
 * Faza 2: sve što ide POSLE upisa veze i VAN transakcije iz Faze 1 — upis POEN-a po
 * potvrdi, koraci putanje razmene, dečji kanal i postupak potvrde postojanja deteta.
 *
 * 🔴 Ranije se zvala `emitujPoenZaVerifikaciju` i sama je emitovala 1.000 + 1.000. Od
 * seta 4.6.4 upis vodi `potvrda-poen.ts` i on čeka trag stvarnog učešća potvrđenog
 * korisnika, pa ime „emituj" više ne bi bilo tačno.
 */
async function dovrsiVerifikaciju(
  fazaJedan: FazaJedan
): Promise<IzvrsiVerifikacijuRezultat> {
  const {
    verifikacijaId,
    verifikatorPseudonim,
    verifikovaniId,
    verifikovaniPseudonim,
    verifikovaniNoviIndeks,
  } = fazaJedan;

  // 🔴 POEN PO POTVRDI VIŠE NE NASTAJE SAMIM ČINOM POTVRDE (set 4.6.4, dokaz
  // stvarnosti čl. 7). Upisuje se kad potvrđeni ostvari doprinos koji je NEKO
  // POTVRDIO: odobren prvi oglas, javna donacija, pokroviteljstvo ili verifikovan
  // operativni doprinos. Ako je uslov već ispunjen u trenutku potvrde — a to je čest
  // slučaj, jer ljudi po pravilu prvo objave ponudu pa ih neko potvrdi — upis je
  // trenutan i ništa se ne menja u odnosu na ranije.
  //
  // 🔴 SAM ČIN POTVRDE SE NE MENJA I NE SME DA SE VEŽE ZA USLOV: indeks je već upisan
  // u Fazi 1, nalog je redovan član istog časa, pun pristup odmah. Čeka SAMO zapis
  // POEN-a. Bez toga čovek koji tek uđe ne bi mogao ni da se javi nekome kako bi
  // dogovorio razmenu kojom bi uslov ispunio.
  //
  // Ne baca: potvrda je u bazi i slot je iskorišćen, pa upis POEN-a ne sme da je obori.
  // Raniji kod je ovde bacao `VerifikacijaGreska` kad emisija pukne; sada pad emisije
  // ostavlja potvrdu u stanju ZABELEZEN i sledeći okidač je pokupi.
  const upis = await probajUpisatiPotvrdu(verifikacijaId);
  if (!upis.upisano) {
    // Obe strane moraju da saznaju da POEN čeka i šta ga otključava — inače potvrda
    // izgleda kao kvar: indeks skoči, POEN-a nema, i niko ne kaže zašto.
    await javiZabelezeno(verifikacijaId);
  }

  // 🔴 VERIFIKACIJA VIŠE NIJE OKIDAČ ZA ČL. 40a. Od seta 4.6.4 svaki prvi oglas ide na
  // odobrenje Fondacije; da potvrda i dalje evidentira doprinos, odobrenje bi bilo
  // šupljikavo (oglas koji niko nije pogledao) i nastao bi krug — potvrda otključava
  // čl. 40a, a čl. 40a otključava POEN po potvrdi.

  // Koraci 2–5 putanje doprinosa razmeni (čl. 40b) nisu dirani ovom izmenom.
  await probajEvidentiratiKorake(verifikovaniId);
  // Modul Deca: čim roditelj postane redovan član, sva njegova deca prelaze u stanje
  // `AKTIVNO`, pa prijateljstva koja su čekala drugu stranu sazrevaju (čl. 14b st. 2).
  // Ne baca — verifikacija je već upisana i ne sme da padne zbog dečjeg kanala.
  await osveziPrijateljstvaDece(verifikovaniId);
  // Čl. 6 st. 5 Pravilnika o učešću dece: svakom novom potvrdom stvarnosti
  // roditelja postupak potvrde postojanja deteta sprovodi se ponovo. Odredba
  // postoji od prve verzije akta; do seta 4.5.2 je kod nije sprovodio, pa onaj ko
  // roditelja potvrdi POSLE otvaranja dečjeg naloga nikad nije bio upitan — a
  // upravo je on jedini potvrđivač koji o detetu ništa nije rekao.
  // Ne baca — potvrda je već upisana i ne sme da padne zbog ovog postupka.
  try {
    const { otvoriPostupakZaNovogPotvrdjivaca } = await import("@/lib/protokol/deca");
    await otvoriPostupakZaNovogPotvrdjivaca(verifikovaniId, fazaJedan.verifikatorId);
  } catch {
    /* postupak potvrde ne obara verifikaciju */
  }
  // Verifikacija pomera i TUĐE brojače: razmena sa neverifikovanim korisnikom se
  // beleži, a u brojač ulazi tek kad on bude verifikovan. Zato se preračunavaju
  // svi koji su sa njim već obavili razmenu. Sekvencijalno — svaki poziv vodi u
  // sopstvenu emisiju; ne baca, verifikacija je već upisana.
  await osveziSagovornike(verifikovaniId);

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
      "Moraš potvrditi da osobu lično poznaješ i da preuzimaš odgovornost za potvrdu.",
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

  return dovrsiVerifikaciju(fazaJedan);
}


/**
 * Verifikacija BEZ jednokratnog koda — jedini put kojim ne upravlja čovek pred
 * ekranom, nego sam sistem.
 *
 * 🔴 Postoji ISKLJUČIVO zbog prelaska maloletnog naloga u punoletni (Modul Deca,
 * čl. 19 st. 3): tog dana dete dobija potvrde stvarnosti od svojih roditelja — dve,
 * po jednu od svakog, ili jednu ako su oba u istom lancu potvrda. Kod bi ovde bio
 * prazna forma: roditelj svoje dete poznaje bolje nego iko koga bi na ekranu
 * potvrdio, a njegova izjava o postojanju deteta stoji u sistemu od otvaranja naloga.
 *
 * 🔴 NE otvarati ovaj put ničemu drugom. Sve ostale verifikacije idu kroz
 * `izvrsiVerifikaciju`, gde jednokratni kod dokazuje da su se dvoje stvarno našli.
 *
 * Sve provere jezgra ostaju na snazi — zabranjena zona (pa i ona koja spreči drugog
 * roditelja kad su roditelji u istom lancu), slot, prelazno ograničenje iz čl. 22.
 * Pozivalac hvata `VerifikacijaGreska` i preskače tu potvrdu.
 */
export async function izvrsiVerifikacijuBezTokena(
  verifikatorId: string,
  verifikovaniId: string,
  oznaka?: string
): Promise<IzvrsiVerifikacijuRezultat> {
  let fazaJedan: FazaJedan;
  try {
    fazaJedan = await prisma.$transaction(
      async (tx) => izvrsiJezgroVerifikacije(tx, verifikatorId, verifikovaniId, normalizujOznaku(oznaka)),
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (e) {
    mapTransakcijaGreska(e);
  }
  return dovrsiVerifikaciju(fazaJedan);
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
    throw new VerifikacijaGreska("Potvrda ne postoji.", 404);
  }
  if (veza.verifikatorId !== verifikatorId) {
    throw new VerifikacijaGreska(
      "Oznaku može da menja samo član koji je dao potvrdu.",
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
