/**
 * Doprinos sadržaju platforme — osmi kanal evidentiranja POEN-a.
 * Osnov: Pravilnik o KOLO sistemu 4.1.1 čl. 15 tačka 8 i čl. 40a.
 *
 * Suština kanala je u tome što BELEŽENJE i EVIDENTIRANJE nisu isti trenutak —
 * ali samo za nalog čija stvarnost nije potvrđena:
 *
 *   VERIFIKOVAN objavi oglas    →  EVIDENTIRAN odmah (čl. 40a st. 3)
 *
 *   NEVERIFIKOVAN objavi oglas  →  ZABELEZEN (nije zapis POEN-a, ne ulazi ni u
 *                                  jedno stanje, ni u opticaj, ni u agregate)
 *   pa verifikacija ILI primljen POEN  →  EVIDENTIRAN (čl. 40a st. 4)
 *
 * Bez tog razdvajanja bi neko mogao da otvori pedeset praznih naloga, okači
 * pedeset oglasa i time naduva opticaj — a opticaj okida osnivački korak od
 * 24.000 POEN-a i gasi prelazno ograničenje iz čl. 22 Pravilnika o dokazu
 * stvarnosti. Ovako prazan nalog ne pomera nijedan sistemski broj dok mu se
 * neko stvarno ne javi.
 *
 * Čekanje se NE primenjuje na verifikovanog jer tu ne štiti ni od čega: nalog
 * čija je stvarnost potvrđena nije prazan nalog. Ranija verzija čl. 40a nije
 * pravila tu razliku, pa je verifikovanom članu doprinos stajao zabeležen i
 * čekao okidač koji mu je već bio iza leđa (verifikacija) — vidi prelazni stav
 * čl. 40a i `evidentirajZateceneVerifikovane()`.
 *
 * Obrazac poziva (obavezan):
 *   - DB promene u jednoj `prisma.$transaction()`
 *   - `probajEvidentirati()` SEKVENCIJALNO POSLE nje — `emitujPoen()` otvara
 *     sopstvenu transakciju i ne sme da se pozove unutar druge.
 */
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { logAdminAkcija } from "@/lib/audit";
import { DoprinosOkidac, DoprinosStatus, TransactionType } from "@/generated/prisma/client";
import { IZNOS, oglasIspunjavaMinimum, type OglasMinimum } from "@/lib/doprinos-pravila";

// Čista pravila (iznos, sadržinski minimum, ko sme da objavi/pošalje) žive u
// `@/lib/doprinos-pravila` — bez Prisme, da ih forma oglasa može uvesti u
// pretraživaču. Ovde se re-eksportuju da server ima jedan ulaz u kanal.
export * from "@/lib/doprinos-pravila";

// ─── Servisne funkcije ───────────────────────────────────────────────────────

/**
 * Beleži doprinos povodom objavljenog oglasa. Idempotentno: jednokratnost kanala
 * po čoveku obezbeđuje jedinstveni indeks nad `userId`, ne kod — dve paralelne
 * objave ne mogu da zabeleže dva doprinosa.
 *
 * VERIFIKOVANOM korisniku doprinos se odmah i evidentira (čl. 40a st. 3): čekanje
 * na okidač postoji da prazan nalog ne naduva opticaj, a nalog čija je stvarnost
 * potvrđena nije prazan nalog — za njega čekanje ne štiti ni od čega.
 * NEVERIFIKOVANOM ostaje zabeležen dok ne nastupi okidač (st. 4).
 *
 * Ne beleži ništa ako oglas nije ponuda ili ne ispunjava sadržinski minimum.
 * Ne baca: neuspeh beleženja ne sme da obori objavu oglasa koji je već upisan.
 *
 * MORA se zvati VAN `prisma.$transaction()` — evidentiranje vodi u `emitujPoen()`,
 * koji otvara sopstvenu.
 */
export async function zabeleziDoprinos(
  userId: string,
  oglas: OglasMinimum & { id: string },
): Promise<boolean> {
  if (oglas.tip !== "PONUDA") return false;
  if (!oglasIspunjavaMinimum(oglas).ok) return false;

  try {
    await prisma.doprinosSadrzaju.create({
      data: { userId, oglasId: oglas.id, iznos: IZNOS },
    });
  } catch (e) {
    // P2002 = kanal je već iskorišćen (ili ga upravo koristi paralelna objava).
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002")
      return false;
    console.error("[doprinos-sadrzaju] beleženje nije uspelo", { userId, oglasId: oglas.id, e });
    return false;
  }

  await logAdminAkcija(userId, "DOPRINOS_SADRZAJU_ZABELEZEN", oglas.id, `${IZNOS} POEN`);

  // Uslov je TIP NALOGA, ne indeks: ko je jednom verifikovan ostaje verifikovan i
  // ako mu indeks kasnije padne. Čita se iz baze — sesija se osvežava sa zakašnjenjem.
  const korisnik = await prisma.user.findUnique({
    where: { id: userId },
    select: { tipKorisnika: true },
  });
  if (korisnik && korisnik.tipKorisnika !== "NEVERIFIKOVAN") {
    await probajEvidentirati(userId, DoprinosOkidac.OBJAVA_VERIFIKOVAN);
  }

  return true;
}

/**
 * Poništava zabeležen doprinos kad je oglas uklonjen zbog povrede Uslova pre nego
 * što je doprinos evidentiran (čl. 40a st. 4). Već evidentiran doprinos se NE dira —
 * zapis POEN-a je nastao i ne poništava se unazad.
 *
 * Poništenje ne oslobađa kanal: `userId` ostaje zauzet, pa se doprinos ne može
 * ponovo zaraditi drugim oglasom. To je namerno — inače bi uklanjanje spornog
 * oglasa bilo besplatno.
 */
export async function ponistiZabelezen(oglasId: string, adminId?: string): Promise<boolean> {
  const rez = await prisma.doprinosSadrzaju.updateMany({
    where: { oglasId, status: DoprinosStatus.ZABELEZEN },
    data: { status: DoprinosStatus.PONISTEN, ponistenAt: new Date() },
  });
  if (rez.count === 0) return false;

  if (adminId) await logAdminAkcija(adminId, "DOPRINOS_SADRZAJU_PONISTEN", oglasId);
  return true;
}

/**
 * Pokušava da evidentira zabeležen doprinos — poziva se pri verifikaciji i pri
 * svakom primljenom POEN-u. Ako korisnik nema zabeležen doprinos, ne radi ništa.
 *
 * MORA se zvati VAN `prisma.$transaction()` — `emitujPoen()` otvara sopstvenu.
 *
 * Ne baca. Ni verifikacija ni prenos POEN-a ne smeju da puknu zbog ovog kanala;
 * oba su već upisana u trenutku poziva.
 */
export async function probajEvidentirati(
  userId: string,
  okidac: DoprinosOkidac,
  okidacKorisnikId?: string,
): Promise<boolean> {
  try {
    const zabelezen = await prisma.doprinosSadrzaju.findFirst({
      where: { userId, status: DoprinosStatus.ZABELEZEN },
      select: { id: true, iznos: true },
    });
    if (!zabelezen) return false;

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!wallet) {
      console.error("[doprinos-sadrzaju] korisnik nema novčanik", { userId });
      return false;
    }

    // Prvo REZERVIŠI prelaz (uslovan update nad statusom), pa tek onda emituj.
    // Ako dva okidača stignu istovremeno (verifikacija i prenos POEN-a u istoj
    // sekundi), samo jedan dobije count === 1 — doprinos se evidentira tačno jednom.
    const rezervisano = await prisma.doprinosSadrzaju.updateMany({
      where: { id: zabelezen.id, status: DoprinosStatus.ZABELEZEN },
      data: {
        status: DoprinosStatus.EVIDENTIRAN,
        okidac,
        okidacKorisnikId: okidacKorisnikId ?? null,
        evidentiranAt: new Date(),
      },
    });
    if (rezervisano.count !== 1) return false;

    let transakcijaId: string;
    try {
      const { transaction } = await emitujPoen(
        wallet.id,
        zabelezen.iznos,
        TransactionType.EMISIJA_SADRZAJ,
        "Doprinos sadržaju platforme",
        { kljuc: "transakcije.doprinos_sadrzaju" },
      );
      transakcijaId = transaction.id;
    } catch (e) {
      // Emisija pukla — vrati doprinos u ZABELEZEN da ga sledeći okidač pokupi.
      // Bez ovoga bi zapis stajao kao evidentiran, a POEN-a ne bi bilo.
      await prisma.doprinosSadrzaju.updateMany({
        where: { id: zabelezen.id, status: DoprinosStatus.EVIDENTIRAN },
        data: {
          status: DoprinosStatus.ZABELEZEN,
          okidac: null,
          okidacKorisnikId: null,
          evidentiranAt: null,
        },
      });
      console.error("[doprinos-sadrzaju] emisija pukla, doprinos vraćen u ZABELEZEN", { userId, e });
      return false;
    }

    await prisma.doprinosSadrzaju.update({
      where: { id: zabelezen.id },
      data: { transakcijaId },
    });

    await logAdminAkcija(
      okidacKorisnikId ?? userId,
      "DOPRINOS_SADRZAJU_EVIDENTIRAN",
      userId,
      `${zabelezen.iznos} POEN, okidač ${okidac}`,
    );
    return true;
  } catch (e) {
    console.error("[doprinos-sadrzaju] evidentiranje nije uspelo", { userId, okidac, e });
    return false;
  }
}

/** Zabeležen doprinos koji korisnik vidi u svom novčaniku (čl. 67). */
export async function dohvatiZabelezen(userId: string): Promise<number> {
  const d = await prisma.doprinosSadrzaju.findFirst({
    where: { userId, status: DoprinosStatus.ZABELEZEN },
    select: { iznos: true },
  });
  return d?.iznos ?? 0;
}

/**
 * Jednokratno evidentiranje zatečenih doprinosa verifikovanih korisnika
 * (čl. 40a, prelazni stav).
 *
 * Do izmene čl. 40a doprinos je verifikovanom korisniku samo BELEŽEN i čekao je
 * okidač — a verifikacija mu je već bila iza leđa, pa mu je ostajao samo primljen
 * POEN. Ovim se ta grupa razrešava; neverifikovani ostaju da čekaju.
 *
 * Ide sekvencijalno kroz `probajEvidentirati` — svaki poziv otvara sopstvenu
 * emisiju, pa se ne sme paralelizovati ni umotati u transakciju. Idempotentno:
 * rezervacija prelaza u `probajEvidentirati` znači da ponovno pokretanje ne može
 * dvaput da evidentira isti doprinos.
 *
 * OPTICAJ SKAČE za 1.000 × broj razrešenih. Pošto se osnivački korak evidentira
 * automatski na svakih 100.000 POEN opticaja, prva noćna emisija posle ovoga može
 * da upali jedan ili više koraka. To je očekivano, nije greška.
 */
export async function evidentirajZateceneVerifikovane(): Promise<{
  ukupnoZabelezenih: number;
  evidentirano: number;
  preskocenoNeverifikovanih: number;
  poenUOpticaj: number;
}> {
  const zabelezeni = await prisma.doprinosSadrzaju.findMany({
    where: { status: DoprinosStatus.ZABELEZEN },
    select: { userId: true, iznos: true, user: { select: { tipKorisnika: true } } },
  });

  let evidentirano = 0;
  let preskoceno = 0;
  let poen = 0;

  for (const d of zabelezeni) {
    if (d.user.tipKorisnika === "NEVERIFIKOVAN") {
      preskoceno += 1;
      continue;
    }
    const uspeh = await probajEvidentirati(d.userId, DoprinosOkidac.OBJAVA_VERIFIKOVAN);
    if (uspeh) {
      evidentirano += 1;
      poen += d.iznos;
    }
  }

  return {
    ukupnoZabelezenih: zabelezeni.length,
    evidentirano,
    preskocenoNeverifikovanih: preskoceno,
    poenUOpticaj: poen,
  };
}
