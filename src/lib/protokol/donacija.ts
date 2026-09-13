import { prisma } from "@/lib/prisma";
import { TransactionType, DonationStatus } from "@/generated/prisma/client";
import { emitujPoen } from "./emisija";
import {
  izracunajPoenZaDonaciju,
  nivoZaKumulativ,
  trebaIzjavaOPoreklu,
  normalizujUplatioca,
  PROZOR_PRAGA_MESECI,
} from "@/lib/donacija-pravila";
import { generisiUgovorODonaciji } from "@/lib/donacija-ugovor";

// Nivoi, koeficijent i obracun POENA zive u `donacija-pravila.ts` (bez Prisme,
// jer ih uvozi i admin ekran u pretrazivacu). Ovde se re-eksportuju, pa server
// i dalje ima jedan ulaz.
export {
  RANG_TABELA,
  KORAK_KOEFICIJENTA,
  PRAG_PROVERE_POREKLA_RSD,
  PROZOR_PRAGA_MESECI,
  trebaIzjavaOPoreklu,
  nivoZaKumulativ,
  izracunajPoenZaDonaciju,
  pragZaNivo,
  koeficijentZaNivo,
  tabelaZaPrikaz,
  normalizujUplatioca,
  MAX_KARTICNA_UPLATA_RSD,
  MAX_KARTICNIH_UPLATA_DNEVNO,
} from "@/lib/donacija-pravila";

/**
 * Admin evidentira donaciju i emituje POEN iz Protokola (koeficijentni model).
 * Jedna transakcija sa iznosom = nova donacija × koeficijent nivoa.
 *
 * Javna vs anonimna donacija (Pravilnik o pokroviteljstvu i donacijama čl. 3, 5):
 * - `javno = true` (podrazumevano): evidentira se POEN; ime i prezime donatora
 *   SNIMA se na zapis (`donatorIme`) kao trajan podatak i prikazuje u listi
 *   donacija. Ulazi u kumulativni nivo.
 * - `javno = false` (anonimna): POEN se NE evidentira (0), zapis NE ulazi u
 *   kumulativni nivo, ime se ne beleži.
 *
 * Napomena: provera „javna donacija zahteva uneto ime i prezime" radi se na
 * ulaznim tačkama (kartično `zapocni`, admin ruta) PRE naplate/potvrde. Ovde se
 * NE baca greška ako ime nedostaje — da naplaćena donacija ne ostane bez POEN-a;
 * `donatorIme` se snima samo kad ime postoji.
 */
export async function evidentirajDonaciju(
  userId: string,
  novaRSD: number,
  options?: {
    existingRecordId?: string;
    adminId?: string;
    javno?: boolean;
    /**
     * Ime uplatioca iz bankovnog izvoda (čl. 3 Pravilnika o pokroviteljstvu i
     * donacijama). Doprinos se evidentira ISKLJUČIVO korisniku čijim je
     * sredstvima uplata izvršena — ovo polje je trag da je to provereno.
     */
    uplatilac?: string | null;
    /** Uplata sa računa otvorenog u inostranstvu (čl. 13b t. 4). */
    straniPriliv?: boolean;
  }
): Promise<{
  poenEmitted: number;
  noviNivo: number;
  noviKumulativ: number;
  kurs: number;
  /** Zapis donacije — pozivna mesta ga koriste za link na ugovor (čl. 5b). */
  zapisId: string;
}> {
  const javno = options?.javno ?? true;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      podaci: { select: { punoIme: true } },
      // pseudonim ide u ugovor o donaciji (cl. 5b)
      donations: {
        // Samo javne donacije ulaze u kumulativni nivo (anonimne ne nose POEN).
        // Tekući zapis (existingRecordId) se ISKLJUČUJE iz kumulativa — kartični tok
        // ga atomski postavi na CONFIRMED PRE ove funkcije (anti-dupli-callback), pa bi
        // se inače duplo brojao za izračun nivoa.
        where: {
          status: DonationStatus.CONFIRMED,
          javno: true,
          ...(options?.existingRecordId ? { id: { not: options.existingRecordId } } : {}),
        },
        select: { amountRSD: true },
      },
    },
  });

  if (!user) throw new Error("Korisnik nije pronađen.");
  if (!user.wallet) throw new Error("Korisnik nema zapis u Protokolu.");
  // 🔴 Uslov potvrđene stvarnosti je UKLONJEN (R-01, mera M-9): donirati sme i
  // član koga niko nije potvrdio, i POEN mu se evidentira. Time se NE otvara
  // ništa drugo — prepis POEN-a (čl. 28 st. 2), kolektivna nabavka i socijalni
  // programi ostaju zatvoreni, a upisano ZRNO ne nosi glas dok stvarnost ne
  // bude potvrđena. Učinjena donacija NIJE osnov za potvrdu stvarnosti i ne
  // zamenjuje neposredno lično poznavanje (čl. 32, čl. 5 dokaza stvarnosti).

  const dosadaRSD = user.donations.reduce((sum, d) => sum + Number(d.amountRSD), 0);

  // Prag za izjavu o poreklu sredstava (čl. 5b, glava IV) meri se na SVE potvrđene
  // donacije istog donatora u prozoru — i javne i anonimne. Kumulativni nivo iz
  // čl. 4 broji samo javne, pa se ta dva zbira namerno računaju odvojeno.
  const odDatuma = new Date();
  odDatuma.setMonth(odDatuma.getMonth() - PROZOR_PRAGA_MESECI);
  const zbir12m = await prisma.donationRecord.aggregate({
    where: {
      userId,
      status: DonationStatus.CONFIRMED,
      confirmedAt: { gte: odDatuma },
      ...(options?.existingRecordId ? { id: { not: options.existingRecordId } } : {}),
    },
    _sum: { amountRSD: true },
  });
  const izjavaOPoreklu = trebaIzjavaOPoreklu(novaRSD, Number(zbir12m._sum.amountRSD ?? 0));
  const izracun = izracunajPoenZaDonaciju(dosadaRSD, novaRSD);

  // Anonimna donacija ne nosi POEN i ne pomera kumulativni nivo.
  const poen = javno ? izracun.poen : 0;
  const noviKumulativ = javno ? izracun.noviKumulativ : dosadaRSD;
  const noviNivo = javno ? izracun.noviNivo : nivoZaKumulativ(dosadaRSD).nivo;
  const kurs = javno ? izracun.kurs : nivoZaKumulativ(dosadaRSD).kurs;

  // Trajan snapshot imena za javnu donaciju (čl. 5a) — ne menja se kasnije.
  const donatorIme = javno ? user.podaci?.punoIme?.trim() || null : null;

  // Uplatilac iz izvoda (čl. 3). Kad ga pozivno mesto ne prosledi (kartično
  // plaćanje), upisuje se ime samog korisnika — akt traži da platni instrument
  // glasi na donatora, pa je to ono što zapis tvrdi.
  const uplatilac = options?.uplatilac?.trim() || user.podaci?.punoIme?.trim() || null;
  const uplatilacKljuc = normalizujUplatioca(uplatilac);

  // Ugovor o donaciji (čl. 5b) — sačinjava se pri potvrdi i SNIMA se na zapis.
  // Jedno mesto za sva tri puta (ručna evidencija, potvrda PENDING zapisa,
  // kartični callback), jer svi prolaze kroz ovu funkciju.
  const zapisId = options?.existingRecordId ?? crypto.randomUUID();
  const ugovorTekst = generisiUgovorODonaciji({
    ime: donatorIme,
    pseudonim: user.pseudonim,
    iznosRSD: novaRSD,
    poen,
    nivo: noviNivo,
    koeficijent: kurs,
    javno,
    zapisId,
    datum: new Date(),
    uplatilac,
    izjavaOPoreklu,
  });

  if (options?.existingRecordId) {
    await prisma.donationRecord.update({
      where: { id: options.existingRecordId },
      data: {
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: noviNivo,
        poenEmitted: poen,
        javno,
        donatorIme,
        uplatilac,
        uplatilacKljuc,
        straniPriliv: options.straniPriliv ?? false,
        ugovorTekst,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options.adminId ?? null,
      },
    });
  } else {
    await prisma.donationRecord.create({
      data: {
        id: zapisId,
        userId,
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: noviNivo,
        poenEmitted: poen,
        javno,
        donatorIme,
        uplatilac,
        uplatilacKljuc,
        straniPriliv: options?.straniPriliv ?? false,
        ugovorTekst,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options?.adminId ?? null,
      },
    });
  }

  if (poen > 0) {
    // Uplatilac stoji i na zapisu o evidentiranom POEN-u (čl. 3 st. 5). Zapis je
    // javan prijavljenim korisnicima, ali POEN nosi samo JAVNA donacija, čije je
    // ime ionako u listi donacija — anonimna donacija nema transakciju.
    await emitujPoen(
      user.wallet.id,
      poen,
      TransactionType.EMISIJA_DONACIJA,
      uplatilac
        ? `Evidentiran doprinos po donaciji: ${poen.toLocaleString("sr-RS")} POEN — uplatilac: ${uplatilac}`
        : `Evidentiran doprinos po donaciji: ${poen.toLocaleString("sr-RS")} POEN`,
      uplatilac
        ? { kljuc: "transakcije.donacija_uplatilac", parametri: { iznos: poen, uplatilac } }
        : { kljuc: "transakcije.donacija", parametri: { iznos: poen } }
    );
  }

  // Identitet utvrđen na donatorskom putu (mera M-9). Postavlja se JEDNOM, pri
  // prvoj potvrđenoj JAVNOJ donaciji: čovek je uporedio uplatioca iz izvoda sa
  // nalogom, a ime donatora je javno uz sam zapis.
  // 🔴 ANONIMNA DONACIJA NE DAJE OVO SVOJSTVO. Za nju se POEN ne evidentira
  // (čl. 5a st. 2 Pravilnika o pokroviteljstvu i donacijama: upis koji se ne može
  // pripisati licu nije proverljiv), pa ne nastaje ni položaj koji bi proširena
  // prava pratila. Uz to je `identitetUtvrdjen` javna oznaka „donator“ na profilu
  // — postavljena po anonimnoj donaciji, odala bi upravo onoga kome Politika
  // obećava suprotno. Ne vezivati je za uplatioca bez uslova `javno`.
  if (javno && uplatilac && !user.identitetUtvrdjenAt) {
    await prisma.user.updateMany({
      where: { id: userId, identitetUtvrdjenAt: null },
      data: { identitetUtvrdjenAt: new Date() },
    });
  }

  return { poenEmitted: poen, noviNivo, noviKumulativ, kurs, zapisId };
}

/**
 * Provera duplikata po uplatiocu (mera C-1 uz R-01).
 *
 * Uplatilac je JEDINI spoljni identitet koji sistem uopšte ima: uplata prolazi
 * kroz banku, koja je identifikaciju već sprovela. Dva naloga sa uplatama istog
 * uplatioca su, po pravilu, isti čovek — što Uslovi čl. 8 zabranjuju, a lanac
 * potvrda ne može da otkrije (verifikator ne zna koliko naloga neko ima).
 *
 * 🔴 Ne blokira samo od sebe — vraća nalaz, a odluku donosi čovek. Legitiman
 * slučaj postoji (uplata sa zajedničkog porodičnog računa), pa bi tvrda zabrana
 * pogađala i njega. Poklapanje zaustavlja evidentiranje dok ga čovek izričito
 * ne potvrdi, i to potvrđivanje ide u revizijski dnevnik.
 */
export async function proveriDuplikatUplatioca(
  userId: string,
  uplatilac: string | null | undefined
): Promise<{ sudar: boolean; pseudonimi: string[] }> {
  const kljuc = normalizujUplatioca(uplatilac);
  if (!kljuc) return { sudar: false, pseudonimi: [] };

  const zapisi = await prisma.donationRecord.findMany({
    where: {
      uplatilacKljuc: kljuc,
      status: DonationStatus.CONFIRMED,
      userId: { not: userId },
    },
    select: { user: { select: { pseudonim: true } } },
    take: 20,
  });
  const pseudonimi = [...new Set(zapisi.map((z) => z.user.pseudonim))];
  return { sudar: pseudonimi.length > 0, pseudonimi };
}
