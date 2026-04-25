import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { ProgramType, TransactionType } from "@/generated/prisma/client";

const BANKA_WALLET_ID = "banka-singleton";

// ── Koeficijenti po rednom broju deteta (Čl. 53) ─────────────────────────────

const KOEF_DECE = [1.0, 1.2, 1.5, 2.0];

function koeficijentDeteta(index: number): number {
  if (index < KOEF_DECE.length) return KOEF_DECE[index];
  return KOEF_DECE[KOEF_DECE.length - 1] + 0.5 * (index - KOEF_DECE.length + 1);
}

function godinaRazlike(rodjendan: Date, danas: Date): number {
  let god = danas.getFullYear() - rodjendan.getFullYear();
  const m = danas.getMonth() - rodjendan.getMonth();
  if (m < 0 || (m === 0 && danas.getDate() < rodjendan.getDate())) god--;
  return god;
}

// ── Iznosi po programu ────────────────────────────────────────────────────────

type MajkeMetadata = { deca: { ime: string; datumRodjenja: string }[] };
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
  dailyAmount: number | null,
  danas: Date
): number {
  switch (type) {
    case "PODRSKA_MAJKAMA":   return izracunajMajke(metadata, danas);
    case "PODRSKA_STARIJIMA": return izracunajStariji(metadata, danas);
    case "POSEBNA_BRIGA":     return 2000;
    case "SKOLOVANJE":        return dailyAmount ?? 0;
    case "PED":      return 600;
  }
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
  const banka = await prisma.wallet.findUnique({ where: { id: BANKA_WALLET_ID } });
  const opticaj = Math.abs(banka?.balance ?? 0);
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

  // 4. Zapošljavanje — odobrene evidencije za danas
  if (aktivniTipovi.has("PED")) {
    const evidencije = await prisma.doprinosEvidencija.findMany({
      where: { date: danas, status: "APPROVED" },
      include: { user: { include: { wallet: true } } },
    });
    for (const ev of evidencije) {
      if (!ev.user.wallet) continue;
      items.push({ walletId: ev.user.wallet.id, amount: ev.amount, type: "PED", evidencijaId: ev.id });
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

  // 5. Proporcionalno smanjenje (Čl. 50)
  const totalRequested = items.reduce((s, i) => s + i.amount, 0);
  const koeficijent = totalRequested > limit && limit > 0 ? limit / totalRequested : 1.0;

  // 6. Emisije
  const breakdown: Record<string, { count: number; requested: number; emitted: number }> = {};
  let totalEmitted = 0;

  for (const item of items) {
    const emitAmount = Math.floor(item.amount * koeficijent);
    if (emitAmount <= 0) continue;

    await emitujPoen(
      item.walletId,
      emitAmount,
      TransactionType.EMISIJA_PROGRAM,
      `Program ${labelPrograma(item.type)}`
    );

    if (item.evidencijaId) {
      await prisma.doprinosEvidencija.update({
        where: { id: item.evidencijaId },
        data: { status: "EMITTED" },
      });
    }

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
    PED:       "Evidencija Doprinosa",
    PODRSKA_MAJKAMA:    "Podrška majkama",
    PODRSKA_STARIJIMA:  "Podrška starijima",
    POSEBNA_BRIGA:      "Posebna briga",
    SKOLOVANJE:         "Školovanje",
  };
  return mapa[type];
}
