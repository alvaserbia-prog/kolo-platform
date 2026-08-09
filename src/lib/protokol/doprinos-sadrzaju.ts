/**
 * Doprinos sadržaju platforme — osmi kanal evidentiranja POEN-a.
 * Osnov: Pravilnik o KOLO sistemu 4.1.0 čl. 15 tačka 8 i čl. 40a.
 *
 * Suština kanala je u tome što BELEŽENJE i EVIDENTIRANJE nisu isti trenutak:
 *
 *   objava oglasa  →  ZABELEZEN   (nije zapis POEN-a, ne ulazi ni u jedno stanje,
 *                                  ni u opticaj, ni u javne agregate)
 *   verifikacija ILI primljen POEN  →  EVIDENTIRAN  (zapis POEN-a u Protokolu)
 *
 * Bez tog razdvajanja bi neko mogao da otvori pedeset praznih naloga, okači
 * pedeset oglasa i time naduva opticaj — a opticaj okida osnivački korak od
 * 24.000 POEN-a i gasi prelazno ograničenje iz čl. 22 Pravilnika o dokazu
 * stvarnosti. Ovako prazan nalog ne pomera nijedan sistemski broj dok mu se
 * neko stvarno ne javi.
 *
 * Obrazac poziva (obavezan):
 *   - DB promene u jednoj `prisma.$transaction()`
 *   - `probajEvidentirati()` SEKVENCIJALNO POSLE nje — `emitujPoen()` otvara
 *     sopstvenu transakciju i ne sme da se pozove unutar druge.
 */
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { logAdminAkcija } from "@/lib/audit";
import { posaljiAdminAlert } from "@/lib/adminAlert";
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
 * Ne beleži ništa ako oglas nije ponuda ili ne ispunjava sadržinski minimum.
 * Ne baca: neuspeh beleženja ne sme da obori objavu oglasa koji je već upisan.
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
    if (okidacKorisnikId) void proveriObrazacOkidaca(okidacKorisnikId);
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

// ─── Brana protiv naduvavanja opticaja (plan, odeljak 05) ────────────────────

/** Koliko različitih naloga u prozoru pali upozorenje. */
export const PRAG_OBRASCA = 3;
const PROZOR_DANA = 7;

/**
 * Okidač je usvojen bez praga: dovoljan je jedan primljen POEN da se doprinos
 * evidentira. Isti verifikovan član zato može da otvori više praznih naloga,
 * okači im oglase i svakom pošalje po 1 POEN — Protokol tada evidentira 1.000
 * POEN-a po nalogu, po ceni od 1.
 *
 * Zaštita je namerno OSMATRANJE, ne blokada: ništa se ne zaustavlja automatski,
 * UO dobija upozorenje i sam procenjuje. Kombinuje se sa privremenim ručnim
 * okidanjem osnivačkog koraka — čovek vidi skok pre nego što 24.000 POEN-a ode.
 */
export async function proveriObrazacOkidaca(okidacKorisnikId: string): Promise<void> {
  try {
    const od = new Date(Date.now() - PROZOR_DANA * 24 * 60 * 60 * 1000);
    const nalozi = await prisma.doprinosSadrzaju.findMany({
      where: {
        okidacKorisnikId,
        status: DoprinosStatus.EVIDENTIRAN,
        evidentiranAt: { gte: od },
      },
      select: { userId: true },
    });
    const razliciti = new Set(nalozi.map((n) => n.userId));
    if (razliciti.size < PRAG_OBRASCA) return;

    const clan = await prisma.user.findUnique({
      where: { id: okidacKorisnikId },
      select: { pseudonim: true },
    });
    await posaljiAdminAlert(
      "Obrazac evidentiranja doprinosa sadržaju",
      `Član „${clan?.pseudonim ?? okidacKorisnikId}" okinuo je evidentiranje doprinosa za ` +
        `${razliciti.size} različitih naloga u poslednjih ${PROZOR_DANA} dana ` +
        `(${razliciti.size * IZNOS} POEN). Ništa nije blokirano — proveriti da li su nalozi stvarni.`,
    );
  } catch (e) {
    console.error("[doprinos-sadrzaju] provera obrasca nije uspela", { okidacKorisnikId, e });
  }
}
