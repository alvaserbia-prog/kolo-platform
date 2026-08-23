/**
 * Doprinos razmeni — putanja prvog kruga (Pravilnik o KOLO sistemu čl. 40a).
 *
 * Nadogradnja osmog kanala: umesto jednokratnih 1.000 POEN-a za prvi oglas,
 * korisnik prolazi lestvicu od pet koraka × 1.000 POEN, uz doživotnu kapu od
 * 5.000 POEN. Korak 1 je ZATEČENI doprinos sadržaju iz čl. 40a i ostaje netaknut —
 * i po iznosu i po odloženom evidentiranju; ovaj modul vodi korake 2–5.
 *
 * 🔴 Razmena se NE označava i NE vodi kao zaseban zapis. Brojač čita same upise
 * POEN-a (`TransactionType.TRANSFER`): svaki čovek van kruga poznanstava sa kojim
 * je POEN prošao broji se jednom. Upis POEN-a već jeste izjava obe strane, pa
 * dodatna potvrda ne bi donela nijedan podatak koji transakcija sama ne nosi.
 *
 * Šta lestvica plaća: širenje mreže razmene. Otud dva sita — sagovornik mora
 * biti van lanca potvrda (graf verifikacija) i verifikovan.
 *
 * Obrazac poziva je isti kao kod čl. 40a i OBAVEZAN je:
 *   - DB promene u jednoj `prisma.$transaction()`
 *   - `probajNapredovati()` SEKVENCIJALNO POSLE nje — vodi u `emitujPoen()`,
 *     koji otvara sopstvenu transakciju.
 * Nijedna funkcija odavde ne baca: prenos POEN-a i objava oglasa su već upisani
 * u trenutku poziva i ne smeju da padnu zbog ovog kanala.
 */
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
import { DoprinosStatus, TransactionType } from "@/generated/prisma/client";
import {
  IZNOS_KORAKA,
  MIN_IZNOS_TRANSAKCIJE,
  POSLEDNJI_KORAK,
  brojOglasaSaRazlicitimUpitima,
  dostignutKorak,
  sagovorniciUBrojacu,
  upisaoSagovorniku,
  type PoenSagovornik,
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
 * Ljudi sa kojima je korisnik razmenio POEN, spojeni po čoveku (ne po
 * transakciji) i obogaćeni sa dva sita: da li su van kruga poznanstava i da li
 * su verifikovani.
 *
 * Novčanici Krugova nemaju `userId` i ispadaju sami. Emisije Protokola se ne
 * gledaju — POEN koji je nastao, a nije prešao između dvoje ljudi, nije razmena.
 */
async function dohvatiSagovornike(userId: string): Promise<PoenSagovornik[]> {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!wallet) return [];

  const transakcije = await prisma.transaction.findMany({
    where: {
      type: TransactionType.TRANSFER,
      OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }],
    },
    select: {
      fromWalletId: true,
      amount: true,
      fromWallet: { select: { userId: true } },
      toWallet: { select: { userId: true } },
    },
  });

  // Spajanje po čoveku: sagovornik se za celu lestvicu broji jednom, bez obzira
  // na broj transakcija. Prag se meri PO TRANSAKCIJI — sitni upisi se ne
  // sabiraju u jednu „pravu" razmenu, jer bi se prag time zaobišao deljenjem.
  const poCoveku = new Map<string, { pravaTransakcija: boolean; jaSamUpisao: boolean }>();
  for (const t of transakcije) {
    const jaSamPosiljalac = t.fromWalletId === wallet.id;
    const drugiId = jaSamPosiljalac ? t.toWallet?.userId : t.fromWallet?.userId;
    if (!drugiId || drugiId === userId) continue;
    const prava = t.amount >= MIN_IZNOS_TRANSAKCIJE;
    const zapis = poCoveku.get(drugiId);
    if (zapis) {
      zapis.pravaTransakcija ||= prava;
      zapis.jaSamUpisao ||= prava && jaSamPosiljalac;
    } else {
      poCoveku.set(drugiId, {
        pravaTransakcija: prava,
        jaSamUpisao: prava && jaSamPosiljalac,
      });
    }
  }
  if (poCoveku.size === 0) return [];

  const ids = [...poCoveku.keys()];
  const [korisnici, uLancu] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, tipKorisnika: true },
    }),
    // Krug poznanstava = zabranjena zona verifikacije, u OBA smera. Ista tabela
    // po kojoj se sudi ko koga sme da verifikuje: uzlazna i silazna linija,
    // braća i preuzete zone. Ko nije ni u čijoj zoni — van je kruga.
    prisma.verifikacionaZona.findMany({
      where: {
        OR: [
          { userId, forbiddenUserId: { in: ids } },
          { userId: { in: ids }, forbiddenUserId: userId },
        ],
      },
      select: { userId: true, forbiddenUserId: true },
    }),
  ]);

  const tipovi = new Map(korisnici.map((k) => [k.id, k.tipKorisnika]));
  const uKrugu = new Set<string>();
  for (const z of uLancu) uKrugu.add(z.userId === userId ? z.forbiddenUserId : z.userId);

  return ids.map((drugiId) => {
    const tok = poCoveku.get(drugiId)!;
    const tip = tipovi.get(drugiId);
    return {
      drugiId,
      pravaTransakcija: tok.pravaTransakcija,
      vanLanca: !uKrugu.has(drugiId),
      verifikovan: tip !== undefined && tip !== "NEVERIFIKOVAN",
      jaSamUpisao: tok.jaSamUpisao,
    };
  });
}

/**
 * Skuplja sve što lestvica broji. Zove se posle svakog događaja koji može da
 * pomeri brojač (prenos POEN-a, objava oglasa, upit, verifikacija sagovornika).
 */
export async function preracunajUcinak(userId: string): Promise<Ucinak> {
  const [prviOglas, brojOglasa, upiti, sagovornici] = await Promise.all([
    // Korak 1 se očitava iz zatečenog kanala. PONISTEN se ne računa — oglas je
    // uklonjen zbog povrede Uslova, pa doprinos ne postoji ni kao zabeležen.
    prisma.doprinosSadrzaju.findFirst({
      where: {
        userId,
        status: { in: [DoprinosStatus.ZABELEZEN, DoprinosStatus.EVIDENTIRAN] },
      },
      select: { id: true },
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
    dohvatiSagovornike(userId),
  ]);

  return {
    prviOglasZabelezen: prviOglas !== null,
    upisaoSagovorniku: upisaoSagovorniku(sagovornici),
    brojOglasa,
    oglasaSaRazlicitimUpitima: brojOglasaSaRazlicitimUpitima(upiti),
    brojSagovornika: sagovorniciUBrojacu(sagovornici).size,
  };
}

// ─── Napredovanje po lestvici ────────────────────────────────────────────────

/**
 * Očitava učinak i beleži svaki novootključan korak. Idempotentno: jedinstveni
 * indeks nad `(userId, korak)` znači da dva paralelna okidača ne mogu da zabeleže
 * isti korak dvaput, a opseg 2–5 drži doživotnu kapu.
 *
 * Već zabeležen korak se NE poništava kad brojač kasnije padne. Brojač jeste
 * živa vrednost — ko kasnije verifikuje nekoga sa kim je razmenjivao, tog čoveka
 * gubi iz brojača, jer mu više nije van kruga poznanstava. To utiče na BUDUĆE
 * korake; zapis POEN-a koji je već nastao ne poništava se unazad (poništavanje
 * evidencije ima svoj postupak — dokaz stvarnosti Glava VIII).
 *
 * MORA se zvati VAN `prisma.$transaction()`. Ne baca.
 *
 * @returns broj novozabeleženih koraka
 */
export async function probajNapredovati(userId: string): Promise<number> {
  try {
    // 🔴 Modul Deca, čl. 14 st. 1 — lestvica se na maloletne korisnike ne primenjuje.
    // Koraci 2–5 nose emisiju, a u dečjem prostoru ne nastaje nijedan nov zapis POEN-a.
    const jeDete = await prisma.user.findUnique({
      where: { id: userId },
      select: { maloletan: true },
    });
    if (jeDete?.maloletan) return 0;

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
    //
    // Odobrenje Fondacije (čl. 40a st. 4) se ovde NE traži: koraci 2–5 zahtevaju
    // prepis POEN-a, koji nalog bez potvrde ionako ne sme da inicira (čl. 28 st. 2),
    // pa do njih ne može ni da stigne pre verifikacije.
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
        `Evidentiran ti je ${korak}. korak putanje doprinosa razmeni i upisano ti je ` +
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

/**
 * Preračunava putanju svima sa kojima je ovaj korisnik razmenio POEN.
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
    const sagovornici = await dohvatiSagovornike(userId);
    for (const s of sagovornici) await probajNapredovati(s.drugiId);
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
