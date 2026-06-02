import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { MAX_INDEKS } from "./dokaz-stvarnosti";
import { ProgramType, TipKorisnika, TransactionType } from "@/generated/prisma/client";

const PROTOKOL_WALLET_ID = "banka-singleton";

// ── Reverifikacija / obustava socijalnih programa (Pravilnik o programima podrške) ──

/** Broj dana do reverifikacije po tipu programa (null = nema periodične revizije). */
export function danaDoReverifikacije(type: ProgramType): number | null {
  if (type === "POSEBNA_BRIGA") return 365; // godišnja revizija (čl. 12)
  if (type === "SKOLOVANJE") return 183; // po studijskoj godini (čl. 13)
  return null; // MAJKAMA/STARIJIMA — stabilne činjenice, bez periodične revizije
}

export type RevizijaRazlog = "revizija" | "indeks";

/**
 * Da li ACTIVE socijalni program treba obustaviti (čista, testabilna odluka):
 *  - "revizija": prošao rok `nextReverifikacija`, status nije ponovo potvrđen (čl. 12);
 *  - "indeks": REGULARNI korisnik ima indeks stvarnosti ispod 100% — osnov na kojem je
 *    program odobren (pun indeks + potvrda svih verifikatora) više ne važi.
 * Vraća null ako program ostaje aktivan.
 */
export function razlogObustaveProgram(
  args: { nextReverifikacija: Date | null; tipKorisnika: TipKorisnika; indeksStvarnosti: number },
  sada: Date
): RevizijaRazlog | null {
  if (args.nextReverifikacija != null && args.nextReverifikacija.getTime() <= sada.getTime()) {
    return "revizija";
  }
  if (args.tipKorisnika === TipKorisnika.REGULARNI && args.indeksStvarnosti < MAX_INDEKS) {
    return "indeks";
  }
  return null;
}

// ── Koeficijenti po rednom broju deteta (Pravilnik o programima podrške) ──────
// Progresivna skala: 1.→1,0 2.→1,2 3.→1,5 4.→2,0 5.→3,0 6.→4,5 7.→6,0 8.→8,0 9.→10,0
// Za 10. dete i dalje progresija se nastavlja korakom +2,0 (10.→12,0 11.→14,0 …).

const KOEF_DECE = [1.0, 1.2, 1.5, 2.0, 3.0, 4.5, 6.0, 8.0, 10.0];

function koeficijentDeteta(index: number): number {
  if (index < KOEF_DECE.length) return KOEF_DECE[index];
  return KOEF_DECE[KOEF_DECE.length - 1] + 2.0 * (index - KOEF_DECE.length + 1);
}

function godinaRazlike(rodjendan: Date, danas: Date): number {
  let god = danas.getFullYear() - rodjendan.getFullYear();
  const m = danas.getMonth() - rodjendan.getMonth();
  if (m < 0 || (m === 0 && danas.getDate() < rodjendan.getDate())) god--;
  return god;
}

// ── Iznosi po programu ────────────────────────────────────────────────────────

type MajkeMetadata = { deca: { datumRodjenja: string }[] };
type StarijiMetadata = { datumRodjenja: string };

export function izracunajMajke(metadata: unknown, danas: Date): number {
  const m = metadata as MajkeMetadata;
  if (!m?.deca?.length) return 0;
  const BAZA = 2000;
  let total = 0;
  for (let i = 0; i < m.deca.length; i++) {
    const god = godinaRazlike(new Date(m.deca[i].datumRodjenja), danas);
    if (god >= 20 || god < 0) continue; // van trajanja
    const bazaSmanjenje = Math.max(0, BAZA - god * 100);
    total += Math.floor(bazaSmanjenje * koeficijentDeteta(i));
  }
  return total;
}

export function izracunajStariji(metadata: unknown, danas: Date): number {
  const m = metadata as StarijiMetadata;
  if (!m?.datumRodjenja) return 0;
  const god = godinaRazlike(new Date(m.datumRodjenja), danas);
  if (god < 50) return 0;
  return 1000 + 100 * (god - 50);
}

export function izracunajDnevniIznos(
  type: ProgramType,
  metadata: unknown,
  _dailyAmount: number | null,
  danas: Date
): number {
  switch (type) {
    case "PODRSKA_MAJKAMA":   return izracunajMajke(metadata, danas);
    case "PODRSKA_STARIJIMA": return izracunajStariji(metadata, danas);
    case "POSEBNA_BRIGA":     return 2000;
    case "SKOLOVANJE":        return 2000;
    case "PED":               return 0; // operativni doprinos ne ide kroz enrollment — raspodela iz OglasEvidencija (čl. 24)
  }
}

// ── Raspodela operativnog doprinosa (Pravilnik o operativnom doprinosu čl. 24) ──
//
// evidentirani POEN = predloženi POEN × min(1, L/P)
//   P = zbir predloženih POEN-a svih potvrđenih verifikacija u periodu
//   L = dnevni limit (10% opticaja, deljen sa socijalnim programima — Pravilnik čl. 15)
//
// Napomena o zajedničkom poolu: master Pravilnik (čl. 15) stavlja operativni doprinos
// i socijalne programe u JEDAN dnevni limit od 10%. Zato se predloženi POEN potvrđenih
// verifikacija ubacuje u isti pool kao socijalni programi, a `raspodelaKoeficijent`
// nad ukupnom potražnjom prirodno daje min(1, L/P) iz čl. 24.

/** Koeficijent srazmerne raspodele: min(1, limit/totalRequested). */
export function raspodelaKoeficijent(totalRequested: number, limit: number): number {
  return totalRequested > limit && limit > 0 ? limit / totalRequested : 1.0;
}

/** Evidentirani (stvarni) POEN za jednu potvrđenu verifikaciju. Math.floor — u korist Protokola. */
export function evidentiraniPoen(predlozeniPoen: number, koeficijent: number): number {
  return Math.floor(predlozeniPoen * koeficijent);
}

// ── Nocna emisija ─────────────────────────────────────────────────────────────

type EmisijaItem = {
  walletId: string;
  amount: number;
  type: ProgramType;
  evidencijaId?: string;
};

export async function izvrsiNocnuEmisiju(datum: Date) {
  // Zero out time for date comparison
  const danas = new Date(datum);
  danas.setHours(0, 0, 0, 0);
  const sutra = new Date(danas);
  sutra.setDate(sutra.getDate() + 1);

  // 1. Opticaj i limit
  const protokol = await prisma.wallet.findUnique({ where: { id: PROTOKOL_WALLET_ID } });
  const opticaj = Math.abs(protokol?.balance ?? 0);
  const limit = Math.floor(opticaj * 0.1);

  // 2. Aktivni programi
  const aktivniProgrami = await prisma.protokolProgram.findMany({ where: { isActive: true } });
  const aktivniTipovi = new Set(aktivniProgrami.map((p) => p.type));

  // 3. Automatski programi — aktivni enrollment-i
  const enrollments = await prisma.programEnrollment.findMany({
    where: { status: "ACTIVE" },
    include: { user: { include: { wallet: true } } },
  });

  const items: EmisijaItem[] = [];

  for (const en of enrollments) {
    if (!aktivniTipovi.has(en.type)) continue;
    if (!en.user.wallet) continue;

    const amount = izracunajDnevniIznos(en.type, en.metadata, en.dailyAmount, danas);
    if (amount > 0) {
      items.push({ walletId: en.user.wallet.id, amount, type: en.type });
    }
  }

  // 4. Operativni doprinos — sve potvrđene verifikacije (status APPROVED) ulaze u
  //    raspodelu ovog perioda (čl. 22, 24). Težina je `predlozeniPoen`; stvarni
  //    evidentirani iznos računa se srazmerno dnevnom limitu (čl. 24).
  if (aktivniTipovi.has("PED")) {
    const evidencije = await prisma.oglasEvidencija.findMany({
      where: { status: "APPROVED" },
      include: { user: { include: { wallet: true } } },
    });
    for (const ev of evidencije) {
      if (!ev.user.wallet) continue;
      items.push({ walletId: ev.user.wallet.id, amount: ev.predlozeniPoen, type: "PED", evidencijaId: ev.id });
    }
  }

  if (items.length === 0) {
    // Snimi prazan summary
    await prisma.dailyEmissionSummary.upsert({
      where: { date: danas },
      create: { date: danas, opticaj, limit, totalRequested: 0, totalEmitted: 0, koeficijent: 1, breakdown: {} },
      update: {},
    });
    return { opticaj, limit, totalRequested: 0, totalEmitted: 0, koeficijent: 1, breakdown: {} };
  }

  // 5. Proporcionalno smanjenje (Pravilnik čl. 50; operativni čl. 24: min(1, L/P))
  const totalRequested = items.reduce((s, i) => s + i.amount, 0);
  const koeficijent = raspodelaKoeficijent(totalRequested, limit);

  // 6. Emisije
  const breakdown: Record<string, { count: number; requested: number; emitted: number }> = {};
  let totalEmitted = 0;

  for (const item of items) {
    const emitAmount = evidentiraniPoen(item.amount, koeficijent);

    if (emitAmount > 0) {
      await emitujPoen(
        item.walletId,
        emitAmount,
        TransactionType.EMISIJA_PROGRAM,
        `Program ${labelPrograma(item.type)}`
      );
    }

    // Operativni doprinos: potvrđena verifikacija se uvek označava obrađenom (EMITTED),
    // i kada je emitovani iznos 0 — neevidentirani višak se NE prenosi u naredni period (čl. 24).
    if (item.evidencijaId) {
      await prisma.oglasEvidencija.update({
        where: { id: item.evidencijaId },
        data: { status: "EMITTED", amount: emitAmount },
      });
    }

    if (emitAmount <= 0) continue;

    const key = item.type;
    if (!breakdown[key]) breakdown[key] = { count: 0, requested: 0, emitted: 0 };
    breakdown[key].count++;
    breakdown[key].requested += item.amount;
    breakdown[key].emitted += emitAmount;
    totalEmitted += emitAmount;
  }

  // 7. Summary
  await prisma.dailyEmissionSummary.upsert({
    where: { date: danas },
    create: { date: danas, opticaj, limit, totalRequested, totalEmitted, koeficijent: koeficijent.toFixed(6), breakdown },
    update: { opticaj, limit, totalRequested, totalEmitted, koeficijent: koeficijent.toFixed(6), breakdown },
  });

  return { opticaj, limit, totalRequested, totalEmitted, koeficijent, breakdown };
}

export function labelPrograma(type: ProgramType): string {
  const mapa: Record<ProgramType, string> = {
    PED:       "Operativni doprinos",
    PODRSKA_MAJKAMA:    "Podrška majkama",
    PODRSKA_STARIJIMA:  "Podrška starijima",
    POSEBNA_BRIGA:      "Posebna briga",
    SKOLOVANJE:         "Školovanje",
  };
  return mapa[type];
}
