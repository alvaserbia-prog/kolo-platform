/**
 * Doprinos razmeni — putanja prvog kruga (Pravilnik o KOLO sistemu čl. 40a).
 *
 * Nadogradnja osmog kanala: umesto jednokratnih 1.000 POEN-a za prvi oglas,
 * korisnik prolazi lestvicu od pet koraka × 1.000 POEN, uz doživotnu kapu od
 * 5.000 POEN. Korak 1 je ZATEČENI doprinos sadržaju i ostaje netaknut — i po
 * iznosu i po odloženom evidentiranju; ovaj modul vodi korake 2–5.
 *
 * Šta lestvica plaća: širenje mreže razmene. Zato brojač ima tri sita —
 * obostrana potvrda razmene, sagovornik van lanca jemstva, i nepostojanje
 * povratnog toka POEN-a u roku od 60 dana. Bez njih bi se putanja prolazila
 * dogovorom dvoje ljudi za jedno popodne.
 *
 * Obrazac poziva je isti kao kod čl. 40a i OBAVEZAN je:
 *   - DB promene u jednoj `prisma.$transaction()`
 *   - `probajNapredovati()` SEKVENCIJALNO POSLE nje — vodi u `emitujPoen()`,
 *     koji otvara sopstvenu transakciju.
 * Nijedna funkcija odavde ne baca: razmena, prenos POEN-a i objava oglasa su
 * već upisani u trenutku poziva i ne smeju da padnu zbog ovog kanala.
 */
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
import { DoprinosStatus, RazmenaStatus, TransactionType } from "@/generated/prisma/client";
import {
  IZNOS_KORAKA,
  POSLEDNJI_KORAK,
  brojOglasaSaRazlicitimUpitima,
  dostignutKorak,
  sagovorniciUBrojacu,
  type PoenTok,
  type RazmenaZapis,
  type Ucinak,
} from "@/lib/doprinos-razmeni-pravila";

// Čista pravila (pragovi, sita brojača, redosled koraka) žive u
// `@/lib/doprinos-razmeni-pravila` — bez Prisme, da ih prikaz putanje može uvesti
// u pretraživaču. Ovde se re-eksportuju da server ima jedan ulaz u kanal.
export * from "@/lib/doprinos-razmeni-pravila";

/** Korak od koga počinje ova tabela — korak 1 je `DoprinosSadrzaju`. */
const PRVI_KORAK_OVDE = 2;

// ─── Očitavanje učinka ───────────────────────────────────────────────────────

/**
 * Skuplja sve što lestvica broji. Jedan prolaz kroz bazu po pozivu — zove se
 * posle svakog događaja koji može da pomeri brojač (razmena, prenos POEN-a,
 * objava oglasa, upit, verifikacija sagovornika).
 */
export async function preracunajUcinak(userId: string): Promise<Ucinak> {
  const [wallet, prviOglas, razmeneDb, brojOglasa, upiti] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId }, select: { id: true } }),
    // Korak 1 se očitava iz zatečenog kanala. PONISTEN se ne računa — oglas je
    // uklonjen zbog povrede Uslova, pa doprinos ne postoji ni kao zabeležen.
    prisma.doprinosSadrzaju.findFirst({
      where: {
        userId,
        status: { in: [DoprinosStatus.ZABELEZEN, DoprinosStatus.EVIDENTIRAN] },
      },
      select: { id: true },
    }),
    prisma.razmena.findMany({
      where: {
        status: RazmenaStatus.REALIZOVANA,
        OR: [{ oglasivacId: userId }, { sagovornikId: userId }],
      },
      select: {
        oglasivacId: true,
        sagovornikId: true,
        vanLanca: true,
        oglasivac: { select: { tipKorisnika: true } },
        sagovornik: { select: { tipKorisnika: true } },
      },
    }),
    // Oglas uklonjen zbog povrede Uslova se ne broji (Uslovi čl. 25 st. 2) —
    // inače bi se korak 3 prolazio i sadržajem koji je Fondacija skinula.
    prisma.marketplaceListing.count({
      where: { sellerId: userId, status: { not: "UKLONJEN" } },
    }),
    prisma.oglasUpit.findMany({
      where: { oglas: { sellerId: userId, status: { not: "UKLONJEN" } } },
      select: { oglasId: true, posiljacId: true },
    }),
  ]);

  const razmene: RazmenaZapis[] = razmeneDb.map((r) => {
    const jaSamOglasivac = r.oglasivacId === userId;
    const drugi = jaSamOglasivac ? r.sagovornik : r.oglasivac;
    return {
      sagovornikId: jaSamOglasivac ? r.sagovornikId : r.oglasivacId,
      vanLanca: r.vanLanca,
      sagovornikVerifikovan: drugi.tipKorisnika !== "NEVERIFIKOVAN",
    };
  });

  const tokovi = wallet ? await dohvatiPoenTokove(wallet.id) : [];
  const sagovornici = sagovorniciUBrojacu(razmene, tokovi);

  // Korak 2 traži da je POEN otišao KA sagovorniku koji je prošao sva tri sita.
  const poslaoKome = new Set(tokovi.filter((t) => t.smer === "KA").map((t) => t.drugiId));
  const poslaoPoenSagovorniku = [...sagovornici].some((id) => poslaoKome.has(id));

  return {
    prviOglasZabelezen: prviOglas !== null,
    poslaoPoenSagovorniku,
    brojOglasa,
    oglasaSaRazlicitimUpitima: brojOglasaSaRazlicitimUpitima(upiti),
    brojSagovornika: sagovornici.size,
  };
}

/**
 * Tokovi POEN-a između korisnika i ostalih ljudi. Uzimaju se SAMO prenosi između
 * korisnika (`TRANSFER`) — emisije Protokola nisu razmena i ne mogu zatvoriti krug.
 * Novčanici Krugova nemaju `userId` i ispadaju sami.
 */
async function dohvatiPoenTokove(walletId: string): Promise<PoenTok[]> {
  const transakcije = await prisma.transaction.findMany({
    where: {
      type: TransactionType.TRANSFER,
      OR: [{ fromWalletId: walletId }, { toWalletId: walletId }],
    },
    select: {
      fromWalletId: true,
      createdAt: true,
      fromWallet: { select: { userId: true } },
      toWallet: { select: { userId: true } },
    },
  });

  const tokovi: PoenTok[] = [];
  for (const t of transakcije) {
    const jaSamPosiljalac = t.fromWalletId === walletId;
    const drugiId = jaSamPosiljalac ? t.toWallet?.userId : t.fromWallet?.userId;
    if (!drugiId) continue;
    tokovi.push({ drugiId, smer: jaSamPosiljalac ? "KA" : "OD", kada: t.createdAt });
  }
  return tokovi;
}

// ─── Napredovanje po lestvici ────────────────────────────────────────────────

/**
 * Očitava učinak i beleži svaki novootključan korak. Idempotentno: jedinstveni
 * indeks nad `(userId, korak)` znači da dva paralelna okidača ne mogu da zabeleže
 * isti korak dvaput, a opseg 2–5 drži doživotnu kapu.
 *
 * Već zabeležen korak se NE poništava kad brojač kasnije padne. Povratni tok
 * POEN-a posle dodeljenog koraka izbacuje sagovornika iz brojača za BUDUĆE
 * korake, ali zapis POEN-a koji je već nastao ne poništava unazad — poništavanje
 * evidencije ima svoj postupak (dokaz stvarnosti Glava VIII) i ne radi se usput.
 *
 * MORA se zvati VAN `prisma.$transaction()`. Ne baca.
 *
 * @returns broj novozabeleženih koraka
 */
export async function probajNapredovati(userId: string): Promise<number> {
  try {
    const ucinak = await preracunajUcinak(userId);
    const dostignut = dostignutKorak(ucinak);
    if (dostignut < PRVI_KORAK_OVDE) return 0;

    let novih = 0;
    for (let korak = PRVI_KORAK_OVDE; korak <= Math.min(dostignut, POSLEDNJI_KORAK); korak++) {
      try {
        await prisma.doprinosRazmeni.create({ data: { userId, korak, iznos: IZNOS_KORAKA } });
      } catch (e) {
        // P2002 = korak je već zabeležen (ili ga upravo beleži paralelni okidač).
        if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002")
          continue;
        console.error("[doprinos-razmeni] beleženje koraka nije uspelo", { userId, korak, e });
        continue;
      }
      novih += 1;
      await logAdminAkcija(
        userId,
        "DOPRINOS_RAZMENI_ZABELEZEN",
        userId,
        `korak ${korak}, ${IZNOS_KORAKA} POEN`,
      );
    }

    if (novih === 0) return 0;

    // Isto pravilo kao u čl. 40a: nalogu čija je stvarnost potvrđena doprinos se
    // evidentira odmah, neverifikovanom ostaje zabeležen do verifikacije. Tip
    // naloga se čita IZ BAZE — sesija se osvežava sa zakašnjenjem.
    const korisnik = await prisma.user.findUnique({
      where: { id: userId },
      select: { tipKorisnika: true },
    });
    if (korisnik && korisnik.tipKorisnika !== "NEVERIFIKOVAN") {
      await probajEvidentiratiKorake(userId);
    }
    return novih;
  } catch (e) {
    console.error("[doprinos-razmeni] napredovanje nije uspelo", { userId, e });
    return 0;
  }
}

/**
 * Pretvara zabeležene korake u zapise POEN-a. Poziva se pri verifikaciji i pri
 * primljenom POEN-u — istim okidačima kao čl. 40a, jer je uslov isti: nalog čija
 * stvarnost nije potvrđena ne sme da pomera opticaj.
 *
 * MORA se zvati VAN `prisma.$transaction()`. Ne baca.
 *
 * @returns broj evidentiranih koraka
 */
export async function probajEvidentiratiKorake(userId: string): Promise<number> {
  try {
    const zabelezeni = await prisma.doprinosRazmeni.findMany({
      where: { userId, status: DoprinosStatus.ZABELEZEN },
      orderBy: { korak: "asc" },
      select: { id: true, korak: true, iznos: true },
    });
    if (zabelezeni.length === 0) return 0;

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!wallet) {
      console.error("[doprinos-razmeni] korisnik nema novčanik", { userId });
      return 0;
    }

    let evidentirano = 0;
    for (const d of zabelezeni) {
      // Prvo REZERVIŠI prelaz (uslovan update nad statusom), pa tek onda emituj —
      // ako dva okidača stignu istovremeno, samo jedan dobije count === 1.
      const rezervisano = await prisma.doprinosRazmeni.updateMany({
        where: { id: d.id, status: DoprinosStatus.ZABELEZEN },
        data: { status: DoprinosStatus.EVIDENTIRAN, evidentiranAt: new Date() },
      });
      if (rezervisano.count !== 1) continue;

      let transakcijaId: string;
      try {
        const { transaction } = await emitujPoen(
          wallet.id,
          d.iznos,
          TransactionType.EMISIJA_RAZMENA,
          `Doprinos razmeni — korak ${d.korak}`,
          { kljuc: "transakcije.doprinos_razmeni", parametri: { korak: d.korak } },
        );
        transakcijaId = transaction.id;
      } catch (e) {
        // Emisija pukla — vrati korak u ZABELEZEN da ga sledeći okidač pokupi.
        await prisma.doprinosRazmeni.updateMany({
          where: { id: d.id, status: DoprinosStatus.EVIDENTIRAN },
          data: { status: DoprinosStatus.ZABELEZEN, evidentiranAt: null },
        });
        console.error("[doprinos-razmeni] emisija pukla, korak vraćen u ZABELEZEN", {
          userId,
          korak: d.korak,
          e,
        });
        continue;
      }

      await prisma.doprinosRazmeni.update({
        where: { id: d.id },
        data: { transakcijaId },
      });
      await logAdminAkcija(
        userId,
        "DOPRINOS_RAZMENI_EVIDENTIRAN",
        userId,
        `korak ${d.korak}, ${d.iznos} POEN`,
      );
      await javiEvidentiranKorak(userId, d.id, d.korak, d.iznos);
      evidentirano += 1;
    }
    return evidentirano;
  } catch (e) {
    console.error("[doprinos-razmeni] evidentiranje koraka nije uspelo", { userId, e });
    return 0;
  }
}

/**
 * Javlja korisniku da mu je korak evidentiran i pamti da je javljeno.
 *
 * Zaseban `obavestenAt` iz istog razloga kao kod čl. 40a: zapis POEN-a ne sme da
 * čeka na mejl/push (umeju da padnu), a javljanje ne sme da ode dvaput. Ne baca —
 * korak je već evidentiran i ne poništava se zato što obaveštenje nije prošlo.
 */
async function javiEvidentiranKorak(
  userId: string,
  doprinosId: string,
  korak: number,
  iznos: number,
): Promise<boolean> {
  try {
    await obavesti(userId, {
      tip: "doprinos_razmeni",
      kljuc: "notifikacije.doprinos_razmeni",
      parametri: { iznos: iznos.toLocaleString("sr-RS"), korak },
      naslov: `Evidentiran ti je doprinos razmeni — korak ${korak}`,
      tekst:
        `Prošao/la si ${korak}. korak putanje doprinosa razmeni i evidentirano ti je ` +
        `${iznos.toLocaleString("sr-RS")} POEN (Pravilnik čl. 40a).`,
      link: "/novcanik",
    });
    await prisma.doprinosRazmeni.update({
      where: { id: doprinosId },
      data: { obavestenAt: new Date() },
    });
    return true;
  } catch (e) {
    console.error("[doprinos-razmeni] obaveštenje nije poslato", { userId, doprinosId, e });
    return false;
  }
}

// ─── Razmena povodom oglasa ──────────────────────────────────────────────────

export type PotvrdaRezultat =
  | { ok: true; status: RazmenaStatus }
  | { ok: false; razlog: string; status: 400 | 403 | 404 };

/**
 * Označava razmenu povodom oglasa kao realizovanu, iz ugla jedne strane.
 * Razmena postaje `REALIZOVANA` tek kad je označe OBE strane — zapis je
 * evidencija saglasnih izjava, ne potvrda Fondacije (Pravilnik čl. 16: za
 * razmenu odgovaraju sami korisnici, Protokol ne posreduje).
 *
 * Oglašivač može da imenuje samo onoga ko mu se povodom oglasa javio; sagovornik
 * može sam sebe. Time nijedna strana ne može da izmisli razmenu sa nekim ko za
 * oglas ne zna.
 *
 * MORA se zvati VAN `prisma.$transaction()` — po realizaciji vodi u
 * `probajNapredovati()`, a taj u `emitujPoen()`.
 */
export async function potvrdiRazmenu(input: {
  oglasId: string;
  korisnikId: string;
  /** Koga oglašivač imenuje. Ignoriše se kad potvrđuje sagovornik. */
  sagovornikId?: string;
}): Promise<PotvrdaRezultat> {
  const oglas = await prisma.marketplaceListing.findUnique({
    where: { id: input.oglasId },
    select: { id: true, sellerId: true, status: true },
  });
  if (!oglas) return { ok: false, razlog: "Oglas nije pronađen.", status: 404 };
  if (oglas.status === "UKLONJEN")
    return { ok: false, razlog: "Oglas je uklonjen.", status: 400 };

  const jeOglasivac = oglas.sellerId === input.korisnikId;
  const sagovornikId = jeOglasivac ? input.sagovornikId : input.korisnikId;
  if (!sagovornikId)
    return { ok: false, razlog: "Nije naveden sagovornik razmene.", status: 400 };
  if (sagovornikId === oglas.sellerId)
    return { ok: false, razlog: "Razmena traži dve strane.", status: 400 };

  const postojeca = await prisma.razmena.findUnique({
    where: { oglasId_sagovornikId: { oglasId: oglas.id, sagovornikId } },
    select: { id: true, status: true },
  });

  // Oglašivač ne može da izmisli sagovornika: ili se taj već javio povodom
  // oglasa, ili je sam otvorio zapis razmene.
  if (jeOglasivac && !postojeca) {
    const upit = await prisma.oglasUpit.findUnique({
      where: { oglasId_posiljacId: { oglasId: oglas.id, posiljacId: sagovornikId } },
      select: { id: true },
    });
    if (!upit)
      return {
        ok: false,
        razlog: "Taj korisnik se nije javio povodom ovog oglasa.",
        status: 400,
      };
  }

  if (postojeca?.status === RazmenaStatus.ODBIJENA)
    return { ok: false, razlog: "Razmena je već odbijena.", status: 400 };
  if (postojeca?.status === RazmenaStatus.REALIZOVANA)
    return { ok: true, status: RazmenaStatus.REALIZOVANA };

  const sada = new Date();
  const mojaPotvrda = jeOglasivac
    ? { potvrdioOglasivacAt: sada }
    : { potvrdioSagovornikAt: sada };

  const razmena = await prisma.razmena.upsert({
    where: { oglasId_sagovornikId: { oglasId: oglas.id, sagovornikId } },
    create: { oglasId: oglas.id, oglasivacId: oglas.sellerId, sagovornikId, ...mojaPotvrda },
    update: mojaPotvrda,
    select: { id: true, potvrdioOglasivacAt: true, potvrdioSagovornikAt: true },
  });

  if (!razmena.potvrdioOglasivacAt || !razmena.potvrdioSagovornikAt)
    return { ok: true, status: RazmenaStatus.PREDLOZENA };

  // Obe strane su se izjasnile — razmena je realizovana. „Van lanca" se utvrđuje
  // OVDE i trajno pamti: kasniji rast lanca ne poništava izbrojane sagovornike.
  const vanLanca = await suVanLanca(oglas.sellerId, sagovornikId);
  const zatvoreno = await prisma.razmena.updateMany({
    where: { id: razmena.id, status: RazmenaStatus.PREDLOZENA },
    data: { status: RazmenaStatus.REALIZOVANA, realizovanoAt: sada, vanLanca },
  });

  // Napreduju obe strane — razmena je za oboje jedan sagovornik više. Van
  // transakcije i sekvencijalno (svaki poziv vodi u sopstvenu emisiju).
  if (zatvoreno.count === 1) {
    await probajNapredovati(oglas.sellerId);
    await probajNapredovati(sagovornikId);
  }
  return { ok: true, status: RazmenaStatus.REALIZOVANA };
}

/** Odbijanje tvrdnje o razmeni — druga strana kaže da je nije bilo. */
export async function odbijRazmenu(input: {
  oglasId: string;
  korisnikId: string;
  sagovornikId?: string;
}): Promise<PotvrdaRezultat> {
  const oglas = await prisma.marketplaceListing.findUnique({
    where: { id: input.oglasId },
    select: { sellerId: true },
  });
  if (!oglas) return { ok: false, razlog: "Oglas nije pronađen.", status: 404 };

  const jeOglasivac = oglas.sellerId === input.korisnikId;
  const sagovornikId = jeOglasivac ? input.sagovornikId : input.korisnikId;
  if (!sagovornikId)
    return { ok: false, razlog: "Nije naveden sagovornik razmene.", status: 400 };

  // Realizovana razmena se ne obara odbijanjem — po njoj su već mogli nastati
  // zapisi POEN-a, a oni se poništavaju samo propisanim postupkom.
  const odbijeno = await prisma.razmena.updateMany({
    where: {
      oglasId: input.oglasId,
      sagovornikId,
      status: RazmenaStatus.PREDLOZENA,
    },
    data: { status: RazmenaStatus.ODBIJENA, odbioId: input.korisnikId },
  });
  if (odbijeno.count === 0)
    return { ok: false, razlog: "Nema razmene koja čeka izjašnjenje.", status: 400 };
  return { ok: true, status: RazmenaStatus.ODBIJENA };
}

/**
 * Da li su dvoje van međusobnog lanca jemstva. Očitava se iz keša
 * `verification_zone` — iste tabele po kojoj se sudi ko koga sme da verifikuje.
 * Zona obuhvata uzlaznu i silaznu liniju, braću i preuzete zone, pa je „nije ni
 * u čijoj zoni" upravo „van lanca".
 */
async function suVanLanca(a: string, b: string): Promise<boolean> {
  const uZoni = await prisma.verifikacionaZona.count({
    where: {
      OR: [
        { userId: a, forbiddenUserId: b },
        { userId: b, forbiddenUserId: a },
      ],
    },
  });
  return uZoni === 0;
}

/**
 * Preračunava putanju svima koji su sa ovim korisnikom obavili razmenu.
 *
 * Zove se po VERIFIKACIJI: razmena sa neverifikovanim korisnikom se beleži, a u
 * brojač ulazi tek kad on bude verifikovan — pa u tom trenutku tuđi brojači
 * skaču, a njihov vlasnik nije uradio ništa. Bez ovoga bi napredak čekao sledeći
 * slučajan događaj na njihovom nalogu.
 *
 * Sekvencijalno (svaki poziv vodi u sopstvenu emisiju) i ne baca.
 */
export async function osveziSagovornike(userId: string): Promise<void> {
  try {
    const razmene = await prisma.razmena.findMany({
      where: {
        status: RazmenaStatus.REALIZOVANA,
        OR: [{ oglasivacId: userId }, { sagovornikId: userId }],
      },
      select: { oglasivacId: true, sagovornikId: true },
    });
    const drugi = new Set<string>();
    for (const r of razmene) {
      drugi.add(r.oglasivacId === userId ? r.sagovornikId : r.oglasivacId);
    }
    for (const id of drugi) await probajNapredovati(id);
  } catch (e) {
    console.error("[doprinos-razmeni] osvežavanje sagovornika nije uspelo", { userId, e });
  }
}

/**
 * Beleži upit povodom oglasa (korak 3). Idempotentno — ponovljeno javljanje
 * istom oglasu ne umnožava brojač. Ne beleži upit oglašivača na sopstveni oglas.
 * Ne baca: razgovor se otvara i kad ovo padne.
 */
export async function zabeleziUpit(oglasId: string, posiljacId: string): Promise<boolean> {
  try {
    const oglas = await prisma.marketplaceListing.findUnique({
      where: { id: oglasId },
      select: { sellerId: true, status: true },
    });
    if (!oglas || oglas.sellerId === posiljacId || oglas.status === "UKLONJEN") return false;

    await prisma.oglasUpit.create({ data: { oglasId, posiljacId } });
    // Upit može da otključa korak 3 oglašivaču — njegov brojač se pomerio.
    await probajNapredovati(oglas.sellerId);
    return true;
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002")
      return false;
    console.error("[doprinos-razmeni] upit nije zabeležen", { oglasId, posiljacId, e });
    return false;
  }
}

// ─── Prikaz ──────────────────────────────────────────────────────────────────

/** Zbir koraka koji čekaju okidač — prikazuje se uz zabeležen doprinos čl. 40a. */
export async function dohvatiZabelezeneKorake(userId: string): Promise<number> {
  const redovi = await prisma.doprinosRazmeni.findMany({
    where: { userId, status: DoprinosStatus.ZABELEZEN },
    select: { iznos: true },
  });
  return redovi.reduce((z, r) => z + r.iznos, 0);
}

export type PutanjaKorak = {
  korak: number;
  /** `null` = korak još nije dostignut. */
  status: DoprinosStatus | null;
  iznos: number;
};

/**
 * Stanje putanje za prikaz vlasniku naloga (Pravilnik čl. 67 — tuđ napredak se
 * ne prikazuje). Korak 1 se očitava iz `DoprinosSadrzaju`, koraci 2–5 odavde.
 */
export async function dohvatiPutanju(userId: string): Promise<{
  ucinak: Ucinak;
  koraci: PutanjaKorak[];
  evidentirano: number;
  zabelezeno: number;
}> {
  const [ucinak, prvi, ostali] = await Promise.all([
    preracunajUcinak(userId),
    prisma.doprinosSadrzaju.findUnique({
      where: { userId },
      select: { status: true, iznos: true },
    }),
    prisma.doprinosRazmeni.findMany({
      where: { userId },
      select: { korak: true, status: true, iznos: true },
    }),
  ]);

  const poKoraku = new Map(ostali.map((r) => [r.korak, r]));
  const koraci: PutanjaKorak[] = [];
  for (let korak = 1; korak <= POSLEDNJI_KORAK; korak++) {
    const zapis = korak === 1 ? prvi : (poKoraku.get(korak) ?? null);
    koraci.push({
      korak,
      status: zapis?.status ?? null,
      iznos: zapis?.iznos ?? IZNOS_KORAKA,
    });
  }

  const zbir = (status: DoprinosStatus) =>
    koraci.filter((k) => k.status === status).reduce((z, k) => z + k.iznos, 0);

  return {
    ucinak,
    koraci,
    evidentirano: zbir(DoprinosStatus.EVIDENTIRAN),
    zabelezeno: zbir(DoprinosStatus.ZABELEZEN),
  };
}
