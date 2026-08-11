/**
 * Doprinos sadržaju platforme — osmi kanal evidentiranja POEN-a.
 * Osnov: Pravilnik o KOLO sistemu 4.1.1 čl. 15 tačka 8 i čl. 40a.
 *
 * 🔴 ČEKANJA VIŠE NEMA (odluka vlasnika, 2026-08-11). Svakom korisniku — i onom
 * čija stvarnost još nije potvrđena — doprinos se evidentira u trenutku objave
 * kvalifikovanog oglasa:
 *
 *   BILO KO objavi kvalifikovanu ponudu  →  EVIDENTIRAN odmah (čl. 40a st. 3)
 *
 * Do ove izmene je neverifikovanom korisniku doprinos samo BELEŽEN, pa je zapis
 * POEN-a nastajao tek kad nastupi okidač (verifikacija ili primljen POEN). Svrha
 * tog čekanja bila je da pedeset praznih naloga sa pedeset oglasa ne naduva
 * opticaj — a opticaj okida osnivački korak od 24.000 POEN-a i gasi prelazno
 * ograničenje iz čl. 22 Pravilnika o dokazu stvarnosti. Vlasnik je ocenio da je
 * važnije da novi čovek odmah vidi šta je dobio za objavljen oglas; ta izloženost
 * je svesno prihvaćena i ostaje samo u sadržinskom minimumu i u ograničenju od
 * tri aktivna oglasa (Uslovi), koje prazan nalog mora da ispuni.
 *
 * `DoprinosStatus.ZABELEZEN` zato više ne nastaje redovnim putem. Ostaje kao
 * prelazno stanje unutar `probajEvidentirati()` (rezervacija pre emisije, povratak
 * ako emisija pukne) i za zatečene redove iz vremena čekanja — njih razrešava
 * `evidentirajZatecene()`, a usput ih pokupi i svaki okidač koji je i ranije
 * postojao (verifikacija, primljen POEN).
 *
 * Obrazac poziva (obavezan):
 *   - DB promene u jednoj `prisma.$transaction()`
 *   - `probajEvidentirati()` SEKVENCIJALNO POSLE nje — `emitujPoen()` otvara
 *     sopstvenu transakciju i ne sme da se pozove unutar druge.
 */
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
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
 * Doprinos se odmah i evidentira (čl. 40a st. 3), bez obzira na to da li je
 * korisnikova stvarnost potvrđena. Beleženje i evidentiranje su od 2026-08-11 isti
 * trenutak; `ZABELEZEN` ostaje samo kao prelazno stanje unutar `probajEvidentirati()`
 * (i za zatečene redove iz vremena kad se čekalo na okidač).
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

  // Bez provere tipa naloga: od 2026-08-11 doprinos se evidentira svakome u trenutku
  // objave. Ne baca — ako emisija pukne, doprinos ostaje ZABELEZEN i pokupi ga prvi
  // sledeći okidač (verifikacija, primljen POEN) ili admin dugme.
  await probajEvidentirati(userId, DoprinosOkidac.OBJAVA);

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
 * Javlja korisniku da mu je doprinos evidentiran i pamti da je javljeno.
 *
 * Zašto zaseban `obavestenAt`, a ne `evidentiranAt`: zapis POEN-a ne sme da čeka
 * na obaveštenje (mejl/push idu van transakcije i umeju da padnu), a obaveštenje
 * ne sme da ode dvaput. `EVIDENTIRAN` uz `obavestenAt: null` znači „duguje se
 * javljanje" — to stanje `evidentirajZatecene()` naknadno pokupi.
 *
 * Ne baca: doprinos je već evidentiran u trenutku poziva i ne poništava se zato
 * što obaveštenje nije prošlo.
 */
async function javiEvidentiran(userId: string, doprinosId: string, iznos: number): Promise<boolean> {
  try {
    await obavesti(userId, {
      tip: "doprinos_sadrzaju",
      kljuc: "notifikacije.doprinos_sadrzaju",
      parametri: { iznos: iznos.toLocaleString("sr-RS") },
      naslov: `Evidentiran ti je doprinos od ${iznos.toLocaleString("sr-RS")} POEN`,
      tekst:
        `Za oglas kojim nudiš dobro ili uslugu evidentiran ti je doprinos sadržaju ` +
        `platforme — ${iznos.toLocaleString("sr-RS")} POEN (Pravilnik čl. 40a).`,
      link: "/novcanik",
    });
    await prisma.doprinosSadrzaju.update({
      where: { id: doprinosId },
      data: { obavestenAt: new Date() },
    });
    return true;
  } catch (e) {
    console.error("[doprinos-sadrzaju] obaveštenje nije poslato", { userId, doprinosId, e });
    return false;
  }
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

    // Čovek mora da sazna da mu je POEN evidentiran — inače mu se stanje promeni
    // bez ijednog traga u zvoncetu. Ide POSLE emisije, jer se javlja o svršenom činu.
    await javiEvidentiran(userId, zabelezen.id, zabelezen.iznos);
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
 * Jednokratno evidentiranje SVIH zatečenih doprinosa (čl. 40a, prelazni stav).
 *
 * Dva talasa zatečenih redova, oba iz vremena kad se čekalo na okidač:
 *  - verifikovani, kojima je okidač već bio iza leđa (razrešeno 2026-08-09);
 *  - neverifikovani, koji od 2026-08-11 više nemaju šta da čekaju — doprinos se
 *    svakome evidentira u trenutku objave, pa im se duguje unazad.
 * Nijedan zabeležen doprinos se više ne preskače.
 *
 * Ide sekvencijalno kroz `probajEvidentirati` — svaki poziv otvara sopstvenu
 * emisiju, pa se ne sme paralelizovati ni umotati u transakciju. Idempotentno:
 * rezervacija prelaza u `probajEvidentirati` znači da ponovno pokretanje ne može
 * dvaput da evidentira isti doprinos.
 *
 * OPTICAJ SKAČE za 1.000 × broj razrešenih. Pošto se osnivački korak evidentira
 * automatski na svakih 100.000 POEN opticaja, prva noćna emisija posle ovoga može
 * da upali jedan ili više koraka. To je očekivano, nije greška.
 *
 * Uz razrešavanje, dugme NAKNADNO JAVLJA i onima kojima je doprinos već evidentiran
 * a obaveštenje nije otišlo (`EVIDENTIRAN` + `obavestenAt: null`) — to je tačno
 * stanje koje je nastalo prvim pritiskom na dugme, pre nego što je obaveštenje
 * postojalo. Ponovni pritisak je bezopasan: ništa se ne emituje dvaput i nikome
 * se ne javlja dvaput.
 */
export async function evidentirajZatecene(): Promise<{
  ukupnoZabelezenih: number;
  evidentirano: number;
  poenUOpticaj: number;
  naknadnoObavesteno: number;
}> {
  const zabelezeni = await prisma.doprinosSadrzaju.findMany({
    where: { status: DoprinosStatus.ZABELEZEN },
    select: { userId: true, iznos: true },
  });

  let evidentirano = 0;
  let poen = 0;

  for (const d of zabelezeni) {
    const uspeh = await probajEvidentirati(d.userId, DoprinosOkidac.OBJAVA);
    if (uspeh) {
      evidentirano += 1;
      poen += d.iznos;
    }
  }

  // Zaostala obaveštenja. Upit ide POSLE petlje, pa hvata i one koje je ona upravo
  // evidentirala a kojima javljanje nije prošlo (mejl/push umeju da padnu).
  const neobavesteni = await prisma.doprinosSadrzaju.findMany({
    where: { status: DoprinosStatus.EVIDENTIRAN, obavestenAt: null },
    select: { id: true, userId: true, iznos: true },
  });
  let naknadnoObavesteno = 0;
  for (const d of neobavesteni) {
    if (await javiEvidentiran(d.userId, d.id, d.iznos)) naknadnoObavesteno += 1;
  }

  return {
    ukupnoZabelezenih: zabelezeni.length,
    evidentirano,
    poenUOpticaj: poen,
    naknadnoObavesteno,
  };
}
