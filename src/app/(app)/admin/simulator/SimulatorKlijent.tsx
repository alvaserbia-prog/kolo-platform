"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────
// PARAMETRI — sve upisivo, nema fiksnih konstanti
// ─────────────────────────────────────────────────────────────────

interface PreporukaTier { do: number; poen: number; }
interface DonationLevel { t: number; r: number; }
interface ZadrugaBonusPrag { clanovi: number; poen: number; }

interface SimParams {
  // Osnovno
  seed: number;
  pocetnihClanova: number;
  dailyGrowth: number;        // %
  donRSD: number;             // prosečna donacija po članu/dan
  zadrugaRast: number;        // % novih koji ulaze u zadrugu/dan
  novaZadrugaNaDan: number;   // svakih N dana može nova zadruga
  zadrugaStartPoen: number;   // emisija pri osnivanju

  // Verifikacija
  verifPoen: number;

  // Preporuke
  preporukaTiers: PreporukaTier[];  // poslednji red = Infinity

  // Donacioni nivoi
  donationLevels: DonationLevel[];

  // Zadruga bonus pragovi
  zadrugaBonusPragovi: ZadrugaBonusPrag[];

  // Zapošljavanje
  zaposljavnje: boolean;
  zaposljavnjePct: number;    // % zadrugara koji podnose evidenciju/dan
  zaposljavnjeMin: number;
  zaposljavnjeMax: number;

  // Podrška majkama
  majke: boolean;
  majkePct: number;
  majkeBaza: number;           // 2000
  majkeSmanjenjePoGodini: number; // 100
  majkeMaxStarost: number;     // 20 — dete prestaje primati
  koefDece: number[];          // [1.0, 1.2, 1.5, 2.0, ...]

  // Podrška starijima
  stariji: boolean;
  starijiPct: number;
  starijiMinStarost: number;   // 50
  starijiBase: number;         // 1000
  starijiPoGodini: number;     // 100 po godini iznad praga

  // Posebna briga
  posebnaBriga: boolean;
  posebnaBrigaPct: number;
  posebnaBrigaIznos: number;   // 2000/dan

  // Školovanje
  skolovanje: boolean;
  skolovanjePct: number;
  skolovanjeMaxStarost: number; // 28
  skolovanjeMin: number;
  skolovanjeMax: number;

  // ZRNO
  zrnoAktivan: boolean;        // ručno, inače auto pri pragu
  zrnoActivationThreshold: number; // opticaj pri kom se aktivira
  ukupnoZrna: number;
  zrnoMinBalance: number;      // min balans za kupovinu
  zrnoMaxBuyPct: number;       // max % balansa za kupovinu
  zrnoBuyProb: number;         // % članova koji kupuju/dan
  zrnoSellProb: number;        // % šansa da holder proda/dan
  zrnoSellKolicinaPct: number; // % ZRNA koje prodaje
}

const DEFAULT_PARAMS: SimParams = {
  seed: 42,
  pocetnihClanova: 5,
  dailyGrowth: 5,
  donRSD: 200,
  zadrugaRast: 30,
  novaZadrugaNaDan: 30,
  zadrugaStartPoen: 50_000,

  verifPoen: 1_000,

  preporukaTiers: [
    { do: 5,   poen: 1_000 }, { do: 10,  poen: 2_000 }, { do: 15, poen: 3_000 },
    { do: 20,  poen: 4_000 }, { do: 30,  poen: 5_000 }, { do: 40, poen: 6_000 },
    { do: 50,  poen: 7_000 }, { do: 70,  poen: 8_000 }, { do: 100, poen: 9_000 },
    { do: 999999, poen: 10_000 },
  ],

  donationLevels: [
    { t: 2_000, r: 1.0 }, { t: 5_000, r: 1.1 }, { t: 10_000, r: 1.2 },
    { t: 20_000, r: 1.3 }, { t: 50_000, r: 1.4 }, { t: 100_000, r: 1.5 },
    { t: 200_000, r: 1.6 }, { t: 500_000, r: 1.7 }, { t: 1_000_000, r: 1.8 },
    { t: 2_000_000, r: 1.9 }, { t: 5_000_000, r: 2.0 }, { t: 10_000_000, r: 2.5 },
    { t: 20_000_000, r: 3.0 }, { t: 50_000_000, r: 3.5 }, { t: 100_000_000, r: 4.0 },
    { t: 200_000_000, r: 4.2 }, { t: 500_000_000, r: 4.5 }, { t: 1_000_000_000, r: 5.0 },
  ],

  zadrugaBonusPragovi: [
    { clanovi: 10, poen: 100_000 }, { clanovi: 20, poen: 200_000 },
    { clanovi: 50, poen: 500_000 }, { clanovi: 100, poen: 1_000_000 },
    { clanovi: 200, poen: 2_000_000 }, { clanovi: 500, poen: 5_000_000 },
  ],

  zaposljavnje: true,
  zaposljavnjePct: 20,
  zaposljavnjeMin: 5_000,
  zaposljavnjeMax: 15_000,

  majke: true,
  majkePct: 80,
  majkeBaza: 2_000,
  majkeSmanjenjePoGodini: 100,
  majkeMaxStarost: 20,
  koefDece: [1.0, 1.2, 1.5, 2.0],

  stariji: true,
  starijiPct: 80,
  starijiMinStarost: 50,
  starijiBase: 1_000,
  starijiPoGodini: 100,

  posebnaBriga: false,
  posebnaBrigaPct: 5,
  posebnaBrigaIznos: 2_000,

  skolovanje: false,
  skolovanjePct: 30,
  skolovanjeMaxStarost: 28,
  skolovanjeMin: 500,
  skolovanjeMax: 2_000,

  zrnoAktivan: false,
  zrnoActivationThreshold: 1_000_000,
  ukupnoZrna: 1_000_000,
  zrnoMinBalance: 10_000,
  zrnoMaxBuyPct: 1,
  zrnoBuyProb: 5,
  zrnoSellProb: 30,
  zrnoSellKolicinaPct: 50,
};

// ─────────────────────────────────────────────────────────────────
// TIPOVI STANJA
// ─────────────────────────────────────────────────────────────────

interface Clan {
  id: number; bal: number; refs: number; zrno: number; cumDon: number;
  age: number; decaStarosti: number[]; uZadrugu: boolean; joinDay: number;
}
interface Zadruga {
  id: number; foundedDay: number; clanovi: number;
  bonusiPlaceni: Set<number>; bal: number; projekti: number;
}
interface DnevniDogadjaj {
  tip: "verif" | "ref" | "don" | "zadruga" | "prog" | "zrno";
  tekst: string; iznos: number;
}
interface DnevniLog {
  day: number; clanovi: number; zadrugari: number; zadruge: number;
  opticaj: number; cumDonRSD: number;
  em_verif: number; em_ref: number; em_don: number; em_zadruga: number; em_programi: number;
  totalRequested: number; koeficijent: number;
  zrnoUBanci: number; zrnoKodKorisnika: number; zrnoKurs: number;
  dogadjaji: DnevniDogadjaj[];
}
interface SimState {
  members: Clan[]; zadruge: Zadruga[];
  bankaMinus: number; zrnoUBanci: number; cumDonRSD: number;
  log: DnevniLog[]; rngState: number;
}

// ─────────────────────────────────────────────────────────────────
// RNG
// ─────────────────────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = seed;
  function next() {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  return { next, state: () => s };
}

function choosePareto(arr: Clan[], rng: () => number): Clan | null {
  if (!arr.length) return null;
  const w = arr.map((_, i) => 1 / Math.pow(i + 1, 1.5));
  const total = w.reduce((a, b) => a + b, 0);
  let r = rng() * total, acc = 0;
  for (let i = 0; i < arr.length; i++) { acc += w[i]; if (r <= acc) return arr[i]; }
  return arr[arr.length - 1];
}

// ─────────────────────────────────────────────────────────────────
// LOGIKA IZ PARAMETARA
// ─────────────────────────────────────────────────────────────────

function preporukaNagrada(n: number, tiers: PreporukaTier[]) {
  return (tiers.find((r) => n <= r.do) ?? tiers[tiers.length - 1]).poen;
}

function getDonRate(cumRSD: number, levels: DonationLevel[]) {
  let r = 1.0;
  for (const lv of levels) { if (cumRSD >= lv.t) r = lv.r; else break; }
  return r;
}

function koefDeteFromParams(i: number, koefs: number[]) {
  if (i < koefs.length) return koefs[i];
  const last = koefs[koefs.length - 1] ?? 2.0;
  return last + 0.5 * (i - koefs.length + 1);
}

function izracunajMajkeFromParams(decaStarosti: number[], p: SimParams) {
  let total = 0;
  for (let i = 0; i < decaStarosti.length; i++) {
    const age = decaStarosti[i];
    if (age >= p.majkeMaxStarost || age < 0) continue;
    const baza = Math.max(0, p.majkeBaza - age * p.majkeSmanjenjePoGodini);
    total += Math.floor(baza * koefDeteFromParams(i, p.koefDece));
  }
  return total;
}

function izracunajStarijiFromParams(age: number, p: SimParams) {
  if (age < p.starijiMinStarost) return 0;
  return p.starijiBase + p.starijiPoGodini * (age - p.starijiMinStarost);
}

// ─────────────────────────────────────────────────────────────────
// INIT + KORAK
// ─────────────────────────────────────────────────────────────────

function initState(p: SimParams): SimState {
  const rng = makeRng(p.seed);
  const members: Clan[] = [];
  for (let i = 0; i < p.pocetnihClanova; i++) {
    const age = 18 + Math.floor(rng.next() * 57);
    const brDece = rng.next() < 0.3 ? Math.floor(1 + rng.next() * 3) : 0;
    const decaStarosti = Array.from({ length: brDece }, () => Math.floor(rng.next() * 20));
    members.push({ id: i, bal: p.verifPoen, refs: 0, zrno: 0, cumDon: 0, age, decaStarosti, uZadrugu: false, joinDay: 0 });
  }
  return {
    members, zadruge: [],
    bankaMinus: p.pocetnihClanova * p.verifPoen,
    zrnoUBanci: p.ukupnoZrna,
    cumDonRSD: 0, log: [], rngState: rng.state(),
  };
}

function nextDayStep(prev: SimState, p: SimParams): SimState {
  const members: Clan[] = prev.members.map(m => ({ ...m, decaStarosti: [...m.decaStarosti] }));
  const zadruge: Zadruga[] = prev.zadruge.map(z => ({ ...z, bonusiPlaceni: new Set(z.bonusiPlaceni) }));
  let bankaMinus = prev.bankaMinus;
  let zrnoUBanci = prev.zrnoUBanci;
  let cumDonRSD = prev.cumDonRSD;
  const day = prev.log.length + 1;
  const dogadjaji: DnevniDogadjaj[] = [];

  const rng = makeRng(prev.rngState + day * 997);
  const rand = rng.next.bind(rng);

  let em_verif = 0, em_ref = 0, em_don = 0, em_zadruga = 0;
  let em_zaposljavnje = 0, em_majke = 0, em_stariji = 0, em_posebna = 0, em_skolovanje = 0;

  // 1. NOVI ČLANOVI
  const growN = Math.max(1, Math.floor(members.length * p.dailyGrowth / 100));
  for (let i = 0; i < growN; i++) {
    const referrer = choosePareto(members, rand);
    if (referrer) {
      referrer.refs++;
      const nagrada = preporukaNagrada(referrer.refs, p.preporukaTiers);
      referrer.bal += nagrada;
      em_ref += nagrada;
    }
    const age = 18 + Math.floor(rand() * 65);
    const brDece = (rand() < 0.25 && age < 50) ? Math.floor(1 + rand() * 3) : 0;
    const decaStarosti = Array.from({ length: brDece }, () => Math.floor(rand() * 20));
    members.push({ id: members.length, bal: p.verifPoen, refs: 0, zrno: 0, cumDon: 0, age, decaStarosti, uZadrugu: false, joinDay: day });
    em_verif += p.verifPoen;
  }
  bankaMinus += em_verif + em_ref;
  dogadjaji.push({ tip: "verif", tekst: `+${growN} novih članova verifikovano`, iznos: em_verif + em_ref });

  // 2. DONACIJE
  if (p.donRSD > 0) {
    const donorN = Math.max(1, Math.floor(members.length * 0.2));
    const w = Array.from({ length: donorN }, (_, i) => 1 / Math.pow(i + 1, 1.5));
    const tw = w.reduce((a, b) => a + b, 0);
    const ukupnoRSD = members.length * p.donRSD;
    for (let i = 0; i < donorN; i++) {
      const rsd = (ukupnoRSD * w[i]) / tw;
      if (rsd < 1) continue;
      const d = members[i];
      d.cumDon += rsd;
      const poen = Math.floor(rsd * getDonRate(d.cumDon, p.donationLevels));
      d.bal += poen;
      em_don += poen;
      cumDonRSD += rsd;
    }
    bankaMinus += em_don;
    if (em_don > 0) dogadjaji.push({ tip: "don", tekst: `${donorN} donatora · kum. ${Math.round(cumDonRSD).toLocaleString("sr-RS")} RSD`, iznos: em_don });
  }

  // 3. ZADRUGE
  const bezZadruge = members.filter(m => !m.uZadrugu);
  const mozNova = p.novaZadrugaNaDan > 0 ? (day % p.novaZadrugaNaDan === 0 || zadruge.length === 0) : zadruge.length === 0;
  if (bezZadruge.length >= 10 && mozNova) {
    zadruge.push({ id: zadruge.length, foundedDay: day, clanovi: 0, bonusiPlaceni: new Set(), bal: p.zadrugaStartPoen, projekti: 0 });
    em_zadruga += p.zadrugaStartPoen;
    bankaMinus += p.zadrugaStartPoen;
    dogadjaji.push({ tip: "zadruga", tekst: `Nova zadruga #${zadruge.length - 1} osnovana`, iznos: p.zadrugaStartPoen });
  }
  if (zadruge.length > 0) {
    // Projekti rastu ~1 po 7 dana po zadruzi
    for (const z of zadruge) {
      if (day % 7 === z.id % 7 && z.clanovi >= 3) z.projekti++;
    }
    const noviClanovi = members.filter(m => !m.uZadrugu && day - m.joinDay >= 1);
    const ulaze = Math.floor(noviClanovi.length * p.zadrugaRast / 100);
    for (let i = 0; i < ulaze && i < noviClanovi.length; i++) {
      const m = noviClanovi[i];
      const z = zadruge[Math.floor(rand() * zadruge.length)];
      m.uZadrugu = true;
      z.clanovi++;
      for (const prag of p.zadrugaBonusPragovi) {
        if (z.clanovi === prag.clanovi && !z.bonusiPlaceni.has(prag.clanovi)) {
          z.bal += prag.poen;
          z.bonusiPlaceni.add(prag.clanovi);
          em_zadruga += prag.poen;
          bankaMinus += prag.poen;
          dogadjaji.push({ tip: "zadruga", tekst: `Zadruga #${z.id}: bonus prag ${prag.clanovi} članova`, iznos: prag.poen });
        }
      }
    }
  }

  // 4. PROGRAMI
  const limit = Math.floor(bankaMinus * 0.1);
  const zadrugari = members.filter(m => m.uZadrugu);
  const programItems: { m: Clan; iznos: number; tip: string }[] = [];

  if (p.zaposljavnje) {
    for (const m of zadrugari) {
      if (rand() * 100 < p.zaposljavnjePct) {
        const iznos = p.zaposljavnjeMin + Math.floor(rand() * (p.zaposljavnjeMax - p.zaposljavnjeMin));
        programItems.push({ m, iznos, tip: "zaposljavnje" });
      }
    }
  }
  if (p.majke) {
    for (const m of zadrugari.filter(m => m.decaStarosti.length > 0)) {
      if (rand() * 100 < p.majkePct) {
        const iznos = izracunajMajkeFromParams(m.decaStarosti, p);
        if (iznos > 0) programItems.push({ m, iznos, tip: "majke" });
      }
    }
  }
  if (p.stariji) {
    for (const m of zadrugari.filter(m => m.age >= p.starijiMinStarost)) {
      if (rand() * 100 < p.starijiPct) {
        const iznos = izracunajStarijiFromParams(m.age, p);
        if (iznos > 0) programItems.push({ m, iznos, tip: "stariji" });
      }
    }
  }
  if (p.posebnaBriga) {
    for (const m of zadrugari) {
      if (rand() * 100 < p.posebnaBrigaPct) programItems.push({ m, iznos: p.posebnaBrigaIznos, tip: "posebna" });
    }
  }
  if (p.skolovanje) {
    for (const m of zadrugari.filter(m => m.age < p.skolovanjeMaxStarost)) {
      if (rand() * 100 < p.skolovanjePct) {
        const iznos = p.skolovanjeMin + Math.floor(rand() * (p.skolovanjeMax - p.skolovanjeMin));
        programItems.push({ m, iznos, tip: "skolovanje" });
      }
    }
  }

  const totalRequested = programItems.reduce((s, i) => s + i.iznos, 0);
  const koeficijent = totalRequested > limit && limit > 0 ? limit / totalRequested : 1.0;
  let em_prog = 0;
  for (const item of programItems) {
    const emitAmount = Math.floor(item.iznos * koeficijent);
    if (emitAmount <= 0) continue;
    item.m.bal += emitAmount;
    switch (item.tip) {
      case "zaposljavnje": em_zaposljavnje += emitAmount; break;
      case "majke":        em_majke += emitAmount; break;
      case "stariji":      em_stariji += emitAmount; break;
      case "posebna":      em_posebna += emitAmount; break;
      case "skolovanje":   em_skolovanje += emitAmount; break;
    }
    em_prog += emitAmount;
  }
  if (em_prog > 0) {
    bankaMinus += em_prog;
    const det = [
      em_zaposljavnje > 0 ? `Zapoš. ${fmt(em_zaposljavnje)}` : null,
      em_majke > 0 ? `Majke ${fmt(em_majke)}` : null,
      em_stariji > 0 ? `Stariji ${fmt(em_stariji)}` : null,
      em_posebna > 0 ? `Pos.briga ${fmt(em_posebna)}` : null,
      em_skolovanje > 0 ? `Škol. ${fmt(em_skolovanje)}` : null,
    ].filter(Boolean).join(" · ");
    dogadjaji.push({ tip: "prog", tekst: `${det}${koeficijent < 1 ? ` · koef.${koeficijent.toFixed(3)}` : ""}`, iznos: em_prog });
  }

  // 5. ZRNO
  const zrnoAkt = p.zrnoAktivan || bankaMinus >= p.zrnoActivationThreshold;
  const zrnoKodKorisnikaIzracun = p.ukupnoZrna - zrnoUBanci;
  if (zrnoAkt && zrnoUBanci > 0) {
    const kurs = bankaMinus > 0 && zrnoKodKorisnikaIzracun > 0
      ? bankaMinus / zrnoKodKorisnikaIzracun
      : bankaMinus / p.ukupnoZrna;
    let zBought = 0, zSold = 0;
    for (const m of members) {
      if (zrnoUBanci <= 0 || m.bal < p.zrnoMinBalance || rand() * 100 > p.zrnoBuyProb) continue;
      const maxPoen = Math.floor(m.bal * p.zrnoMaxBuyPct / 100);
      if (maxPoen < 1 || kurs <= 0) continue;
      let zDobija = Math.floor(maxPoen / kurs);
      if (zDobija <= 0) continue;
      zDobija = Math.min(zDobija, zrnoUBanci);
      const poenPlaceno = Math.ceil(zDobija * kurs);
      if (poenPlaceno > m.bal) continue;
      m.bal -= poenPlaceno; m.zrno += zDobija;
      zrnoUBanci -= zDobija; bankaMinus -= poenPlaceno;
      zBought += zDobija;
    }
    const holders = members.filter(m => m.zrno > 0);
    if (holders.length > 0 && rand() * 100 < p.zrnoSellProb) {
      const seller = holders[Math.floor(rand() * holders.length)];
      const sellAmt = Math.floor(seller.zrno * p.zrnoSellKolicinaPct / 100);
      if (sellAmt > 0 && kurs > 0) {
        const poen = Math.floor(sellAmt * kurs);
        seller.bal += poen; seller.zrno -= sellAmt;
        zrnoUBanci += sellAmt; bankaMinus += poen;
        zSold += sellAmt;
      }
    }
    if (zBought > 0 || zSold > 0) {
      dogadjaji.push({ tip: "zrno", tekst: `ZRNO kurs ${kurs.toFixed(1)} · kupljeno ${zBought} · prodato ${zSold}`, iznos: 0 });
    }
  }

  const finalZKK = p.ukupnoZrna - zrnoUBanci;
  const zrnoKurs = bankaMinus > 0 && finalZKK > 0 ? bankaMinus / finalZKK : 0;

  return {
    members, zadruge, bankaMinus, zrnoUBanci, cumDonRSD,
    log: [...prev.log, {
      day, clanovi: members.length,
      zadrugari: zadruge.reduce((s, z) => s + z.clanovi, 0),
      zadruge: zadruge.length, opticaj: Math.round(bankaMinus),
      cumDonRSD: Math.round(cumDonRSD),
      em_verif, em_ref, em_don, em_zadruga, em_programi: em_prog,
      totalRequested: Math.round(totalRequested), koeficijent,
      zrnoUBanci, zrnoKodKorisnika: finalZKK, zrnoKurs, dogadjaji,
    }],
    rngState: rng.state(),
  };
}

// ─────────────────────────────────────────────────────────────────
// HELPERS UI
// ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(Math.round(n));
}

function MiniChart({ data, color = "#16a34a", h = 60 }: { data: number[]; color?: string; h?: number }) {
  if (data.length < 2) return <div className="text-xs text-gray-400 py-2 text-center">—</div>;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" className="w-full" style={{ height: h }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

const DOG_CFG: Record<string, { bg: string; text: string; ikona: string }> = {
  verif:   { bg: "bg-blue-50",    text: "text-blue-700",    ikona: "✓" },
  don:     { bg: "bg-amber-50",   text: "text-amber-700",   ikona: "♦" },
  zadruga: { bg: "bg-green-50",   text: "text-green-700",   ikona: "⊕" },
  prog:    { bg: "bg-emerald-50", text: "text-emerald-700", ikona: "₽" },
  zrno:    { bg: "bg-purple-50",  text: "text-purple-700",  ikona: "◆" },
  ref:     { bg: "bg-indigo-50",  text: "text-indigo-700",  ikona: "→" },
};

// Reusable input components
function N({ val, onChange, min = 0, max = 999_999_999, step = 1, cls = "" }: {
  val: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; cls?: string;
}) {
  return (
    <input type="number" value={val} min={min} max={max} step={step}
      onChange={e => onChange(Number(e.target.value))}
      className={`px-2 py-1 border border-gray-200 rounded-lg text-sm font-mono text-right outline-none focus:border-green-600 ${cls}`} />
  );
}

function Tog({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!val)}
      className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${val ? "bg-green-700 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
      {val ? "Aktivno" : "Neaktivno"}
    </button>
  );
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 gap-4">
      <div className="min-w-0">
        <span className="text-sm text-gray-700">{label}</span>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Sekcija({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TABELE ZA NIZOVE
// ─────────────────────────────────────────────────────────────────

function PreporukaTiersEditor({ tiers, onChange }: { tiers: PreporukaTier[]; onChange: (t: PreporukaTier[]) => void }) {
  function update(i: number, key: keyof PreporukaTier, val: number) {
    const next = tiers.map((t, j) => j === i ? { ...t, [key]: val } : t);
    onChange(next);
  }
  function add() { onChange([...tiers, { do: 999999, poen: 10_000 }]); }
  function remove(i: number) { onChange(tiers.filter((_, j) => j !== i)); }
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 px-1">
        <span>Do N-te preporuke</span><span className="text-right">POEN nagrada</span><span />
      </div>
      {tiers.map((t, i) => (
        <div key={i} className="grid grid-cols-3 gap-1 items-center">
          <N val={t.do >= 999999 ? 999999 : t.do} onChange={v => update(i, "do", v)} cls="w-full" />
          <N val={t.poen} onChange={v => update(i, "poen", v)} cls="w-full" />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-green-700 hover:underline mt-1">+ dodaj red</button>
      <p className="text-xs text-gray-400">Poslednji red = maksimalni rang (ostavi 999999 za "i dalje")</p>
    </div>
  );
}

function DonationLevelsEditor({ levels, onChange }: { levels: DonationLevel[]; onChange: (l: DonationLevel[]) => void }) {
  function update(i: number, key: keyof DonationLevel, val: number) {
    onChange(levels.map((l, j) => j === i ? { ...l, [key]: val } : l));
  }
  function add() { onChange([...levels, { t: 0, r: 1.0 }]); }
  function remove(i: number) { onChange(levels.filter((_, j) => j !== i)); }
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 px-1">
        <span>Kumulativ RSD ≥</span><span className="text-right">Kurs (×)</span><span />
      </div>
      {levels.map((l, i) => (
        <div key={i} className="grid grid-cols-3 gap-1 items-center">
          <N val={l.t} onChange={v => update(i, "t", v)} cls="w-full" />
          <N val={l.r} onChange={v => update(i, "r", v)} step={0.1} min={0.1} max={10} cls="w-full" />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-green-700 hover:underline mt-1">+ dodaj nivo</button>
    </div>
  );
}

function ZadrugaBonusEditor({ pragovi, onChange }: { pragovi: ZadrugaBonusPrag[]; onChange: (p: ZadrugaBonusPrag[]) => void }) {
  function update(i: number, key: keyof ZadrugaBonusPrag, val: number) {
    onChange(pragovi.map((p, j) => j === i ? { ...p, [key]: val } : p));
  }
  function add() { onChange([...pragovi, { clanovi: 0, poen: 0 }]); }
  function remove(i: number) { onChange(pragovi.filter((_, j) => j !== i)); }
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 px-1">
        <span>Broj članova</span><span className="text-right">POEN bonus</span><span />
      </div>
      {pragovi.map((prag, i) => (
        <div key={i} className="grid grid-cols-3 gap-1 items-center">
          <N val={prag.clanovi} onChange={v => update(i, "clanovi", v)} cls="w-full" />
          <N val={prag.poen} onChange={v => update(i, "poen", v)} cls="w-full" />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-green-700 hover:underline mt-1">+ dodaj prag</button>
    </div>
  );
}

function KoefDeceEditor({ koefs, onChange }: { koefs: number[]; onChange: (k: number[]) => void }) {
  function update(i: number, val: number) {
    onChange(koefs.map((k, j) => j === i ? val : k));
  }
  function add() { onChange([...koefs, (koefs[koefs.length - 1] ?? 2.0) + 0.5]); }
  function remove(i: number) { onChange(koefs.filter((_, j) => j !== i)); }
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-400 mb-1">Koeficijent po rednom broju deteta (1., 2., 3., ...)</p>
      {koefs.map((k, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-6 text-right">{i + 1}.</span>
          <N val={k} onChange={v => update(i, v)} step={0.1} min={0.1} max={10} cls="w-24" />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-green-700 hover:underline mt-1">+ dodaj</button>
      <p className="text-xs text-gray-400">Za decu dalje od liste, povećava se za 0.5 po detetu</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// KONFIGURACIONI EKRAN
// ─────────────────────────────────────────────────────────────────

const TABS_CONF = ["Osnovno", "Verifikacija i preporuke", "Donacioni nivoi", "Zadruge", "Programi", "ZRNO"] as const;
type TabConf = typeof TABS_CONF[number];

function KonfiguracioniEkran({ onStart }: { onStart: (p: SimParams) => void }) {
  const [p, setP] = useState<SimParams>(DEFAULT_PARAMS);
  const [tab, setTab] = useState<TabConf>("Osnovno");
  const upd = <K extends keyof SimParams>(k: K, v: SimParams[K]) => setP(prev => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Konfiguracija simulacije</h2>
        <p className="text-sm text-gray-400 mt-1">Sve parametre uneseš jednom — za izmenu je potreban reset.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-gray-200 pb-px">
        {TABS_CONF.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t ? "bg-white border border-b-white border-gray-200 text-green-700 -mb-px" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Osnovno */}
      {tab === "Osnovno" && (
        <Sekcija title="Osnovno">
          <Row label="Seed" sub="Isti seed → isti rezultat"><N val={p.seed} onChange={v => upd("seed", v)} cls="w-28" /></Row>
          <Row label="Početnih članova" sub="Svi dobijaju verifPoen na startu"><N val={p.pocetnihClanova} onChange={v => upd("pocetnihClanova", v)} min={1} max={1000} cls="w-24" /></Row>
          <Row label="Dnevni rast novih članova" sub="% trenutnog broja članova">
            <div className="flex items-center gap-1"><N val={p.dailyGrowth} onChange={v => upd("dailyGrowth", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div>
          </Row>
          <Row label="Prosečna donacija po članu/dan" sub="20% članova donira, pareto raspodela">
            <div className="flex items-center gap-1"><N val={p.donRSD} onChange={v => upd("donRSD", v)} cls="w-28" /><span className="text-sm text-gray-400">RSD</span></div>
          </Row>
          <Row label="Ulazak u zadruge" sub="% novih koji su prihvatljivi i ulaze">
            <div className="flex items-center gap-1"><N val={p.zadrugaRast} onChange={v => upd("zadrugaRast", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div>
          </Row>
        </Sekcija>
      )}

      {/* Verifikacija i preporuke */}
      {tab === "Verifikacija i preporuke" && (
        <div className="space-y-4">
          <Sekcija title="Verifikacija">
            <Row label="POEN pri verifikaciji"><N val={p.verifPoen} onChange={v => upd("verifPoen", v)} cls="w-28" /></Row>
          </Sekcija>
          <Sekcija title="Tabela preporuka">
            <PreporukaTiersEditor tiers={p.preporukaTiers} onChange={v => upd("preporukaTiers", v)} />
          </Sekcija>
        </div>
      )}

      {/* Donacioni nivoi */}
      {tab === "Donacioni nivoi" && (
        <Sekcija title="Donacioni nivoi — kurs emisije">
          <DonationLevelsEditor levels={p.donationLevels} onChange={v => upd("donationLevels", v)} />
        </Sekcija>
      )}

      {/* Zadruge */}
      {tab === "Zadruge" && (
        <div className="space-y-4">
          <Sekcija title="Osnivanje zadruge">
            <Row label="Nova zadruga svakih N dana" sub="0 = samo na početku">
              <N val={p.novaZadrugaNaDan} onChange={v => upd("novaZadrugaNaDan", v)} min={0} max={365} cls="w-24" />
            </Row>
            <Row label="POEN emisija pri osnivanju">
              <N val={p.zadrugaStartPoen} onChange={v => upd("zadrugaStartPoen", v)} cls="w-28" />
            </Row>
          </Sekcija>
          <Sekcija title="Bonus pragovi rasta">
            <ZadrugaBonusEditor pragovi={p.zadrugaBonusPragovi} onChange={v => upd("zadrugaBonusPragovi", v)} />
          </Sekcija>
        </div>
      )}

      {/* Programi */}
      {tab === "Programi" && (
        <div className="space-y-4">
          <Sekcija title="Zapošljavanje">
            <Row label="Aktivan"><Tog val={p.zaposljavnje} onChange={v => upd("zaposljavnje", v)} /></Row>
            <Row label="% zadrugara koji podnose evidenciju/dan"><div className="flex items-center gap-1"><N val={p.zaposljavnjePct} onChange={v => upd("zaposljavnjePct", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
            <Row label="Iznos evidencije min/max">
              <div className="flex items-center gap-2">
                <N val={p.zaposljavnjeMin} onChange={v => upd("zaposljavnjeMin", v)} cls="w-24" />
                <span className="text-gray-400">–</span>
                <N val={p.zaposljavnjeMax} onChange={v => upd("zaposljavnjeMax", v)} cls="w-24" />
              </div>
            </Row>
          </Sekcija>

          <Sekcija title="Podrška majkama">
            <Row label="Aktivan"><Tog val={p.majke} onChange={v => upd("majke", v)} /></Row>
            <Row label="% prijavljenih majki/dan"><div className="flex items-center gap-1"><N val={p.majkePct} onChange={v => upd("majkePct", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
            <Row label="Bazni iznos po detetu/dan" sub="Smanjuje se sa starošću deteta"><N val={p.majkeBaza} onChange={v => upd("majkeBaza", v)} cls="w-28" /></Row>
            <Row label="Smanjenje po godini starosti deteta"><N val={p.majkeSmanjenjePoGodini} onChange={v => upd("majkeSmanjenjePoGodini", v)} cls="w-24" /></Row>
            <Row label="Maksimalna starost deteta (god)"><N val={p.majkeMaxStarost} onChange={v => upd("majkeMaxStarost", v)} min={1} max={30} cls="w-20" /></Row>
            <div className="pt-2">
              <KoefDeceEditor koefs={p.koefDece} onChange={v => upd("koefDece", v)} />
            </div>
          </Sekcija>

          <Sekcija title="Podrška starijima">
            <Row label="Aktivan"><Tog val={p.stariji} onChange={v => upd("stariji", v)} /></Row>
            <Row label="% prijavljenih/dan"><div className="flex items-center gap-1"><N val={p.starijiPct} onChange={v => upd("starijiPct", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
            <Row label="Minimalna starost (god)"><N val={p.starijiMinStarost} onChange={v => upd("starijiMinStarost", v)} min={18} max={80} cls="w-20" /></Row>
            <Row label="Bazni iznos (pri min. starosti)"><N val={p.starijiBase} onChange={v => upd("starijiBase", v)} cls="w-28" /></Row>
            <Row label="Dodatak po godini iznad praga"><N val={p.starijiPoGodini} onChange={v => upd("starijiPoGodini", v)} cls="w-24" /></Row>
          </Sekcija>

          <Sekcija title="Posebna briga">
            <Row label="Aktivan"><Tog val={p.posebnaBriga} onChange={v => upd("posebnaBriga", v)} /></Row>
            <Row label="% zadrugara/dan"><div className="flex items-center gap-1"><N val={p.posebnaBrigaPct} onChange={v => upd("posebnaBrigaPct", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
            <Row label="Iznos po korisniku/dan"><N val={p.posebnaBrigaIznos} onChange={v => upd("posebnaBrigaIznos", v)} cls="w-28" /></Row>
          </Sekcija>

          <Sekcija title="Školovanje">
            <Row label="Aktivan"><Tog val={p.skolovanje} onChange={v => upd("skolovanje", v)} /></Row>
            <Row label="% mlađih zadrugara/dan"><div className="flex items-center gap-1"><N val={p.skolovanjePct} onChange={v => upd("skolovanjePct", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
            <Row label="Maksimalna starost (god)"><N val={p.skolovanjeMaxStarost} onChange={v => upd("skolovanjeMaxStarost", v)} min={18} max={40} cls="w-20" /></Row>
            <Row label="Iznos min/max">
              <div className="flex items-center gap-2">
                <N val={p.skolovanjeMin} onChange={v => upd("skolovanjeMin", v)} cls="w-24" />
                <span className="text-gray-400">–</span>
                <N val={p.skolovanjeMax} onChange={v => upd("skolovanjeMax", v)} cls="w-24" />
              </div>
            </Row>
          </Sekcija>
        </div>
      )}

      {/* ZRNO */}
      {tab === "ZRNO" && (
        <div className="space-y-4">
          <Sekcija title="ZRNO tržište">
            <Row label="Aktivan od starta (ručno)"><Tog val={p.zrnoAktivan} onChange={v => upd("zrnoAktivan", v)} /></Row>
            <Row label="Prag automatske aktivacije (opticaj POEN)"><N val={p.zrnoActivationThreshold} onChange={v => upd("zrnoActivationThreshold", v)} cls="w-32" /></Row>
            <Row label="Ukupno ZRNA u sistemu"><N val={p.ukupnoZrna} onChange={v => upd("ukupnoZrna", v)} cls="w-32" /></Row>
          </Sekcija>
          <Sekcija title="Kupovina">
            <Row label="Min. balans za kupovinu (POEN)"><N val={p.zrnoMinBalance} onChange={v => upd("zrnoMinBalance", v)} cls="w-28" /></Row>
            <Row label="Maks. % balansa za kupovinu/dan"><div className="flex items-center gap-1"><N val={p.zrnoMaxBuyPct} onChange={v => upd("zrnoMaxBuyPct", v)} min={0} max={100} step={0.1} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
            <Row label="% članova koji kupuju/dan"><div className="flex items-center gap-1"><N val={p.zrnoBuyProb} onChange={v => upd("zrnoBuyProb", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
          </Sekcija>
          <Sekcija title="Prodaja">
            <Row label="% šansa da holder proda/dan"><div className="flex items-center gap-1"><N val={p.zrnoSellProb} onChange={v => upd("zrnoSellProb", v)} min={0} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
            <Row label="% ZRNA koje prodaje pri prodaji"><div className="flex items-center gap-1"><N val={p.zrnoSellKolicinaPct} onChange={v => upd("zrnoSellKolicinaPct", v)} min={1} max={100} cls="w-20" /><span className="text-sm text-gray-400">%</span></div></Row>
          </Sekcija>
        </div>
      )}

      <button onClick={() => onStart(p)}
        className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors">
        Pokreni simulaciju →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SIMULACIONI EKRAN
// ─────────────────────────────────────────────────────────────────

type SimView = "pregled" | "clanovi" | "zadruge" | "zrno";

const SIM_TABS: { id: SimView; label: string }[] = [
  { id: "pregled", label: "Pregled" },
  { id: "clanovi", label: "Članovi" },
  { id: "zadruge", label: "Zadruge" },
  { id: "zrno", label: "ZRNO" },
];

function SimTabs({ view, setView }: { view: SimView; setView: (v: SimView) => void }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      {SIM_TABS.map(t => (
        <button
          key={t.id}
          onClick={() => setView(t.id)}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            view === t.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ViewClanovi({ members }: { members: Clan[] }) {
  const sorted = [...members].sort((a, b) => b.bal - a.bal);
  const ukupno = members.reduce((s, m) => s + m.bal, 0);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-base font-semibold text-gray-900">Rang lista članova</h3>
        <span className="text-xs text-gray-400">{members.length} članova · ukupno {fmt(ukupno)} P</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="px-3 py-2 text-left font-medium w-8">#</th>
              <th className="px-3 py-2 text-left font-medium">ID</th>
              <th className="px-3 py-2 text-right font-medium">Balans</th>
              <th className="px-3 py-2 text-right font-medium">% od ukupnog</th>
              <th className="px-3 py-2 text-right font-medium">Donacije</th>
              <th className="px-3 py-2 text-right font-medium">Preporuke</th>
              <th className="px-3 py-2 text-right font-medium">ZRNO</th>
              <th className="px-3 py-2 text-right font-medium">God.</th>
              <th className="px-3 py-2 text-center font-medium">Zadr.</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m, i) => (
              <tr key={m.id} className={i % 2 === 0 ? "" : "bg-gray-50/50"}>
                <td className="px-3 py-1.5 text-left text-gray-400 font-mono">{i + 1}</td>
                <td className="px-3 py-1.5 text-left font-mono text-gray-600">#{m.id}</td>
                <td className="px-3 py-1.5 text-right font-mono font-semibold text-green-700">{fmt(m.bal)}</td>
                <td className="px-3 py-1.5 text-right text-gray-500">
                  <div className="flex items-center justify-end gap-1">
                    <div className="h-1.5 bg-green-200 rounded" style={{ width: Math.max(2, (m.bal / (ukupno || 1)) * 80) }} />
                    <span>{ukupno ? ((m.bal / ukupno) * 100).toFixed(1) : "0"}%</span>
                  </div>
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-amber-600">{fmt(m.cumDon)}</td>
                <td className="px-3 py-1.5 text-right">{m.refs}</td>
                <td className="px-3 py-1.5 text-right font-mono text-purple-600">{m.zrno || "—"}</td>
                <td className="px-3 py-1.5 text-right text-gray-400">{m.age}</td>
                <td className="px-3 py-1.5 text-center">{m.uZadrugu ? <span className="text-green-600">✓</span> : <span className="text-gray-300">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViewZadruge({ zadruge, members }: { zadruge: Zadruga[]; members: Clan[] }) {
  const sorted = [...zadruge].sort((a, b) => b.bal - a.bal);
  const [selId, setSelId] = useState<number | null>(null);
  const sel = selId !== null ? zadruge.find(z => z.id === selId) : null;

  if (sel) {
    const clanoviZadruge = members.filter(m => m.uZadrugu).slice(0, sel.clanovi);
    const ukupnoBal = clanoviZadruge.reduce((s, m) => s + m.bal, 0);
    return (
      <div>
        <button onClick={() => setSelId(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4">
          ← Nazad na zadruge
        </button>
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="text-base font-semibold text-gray-900">Zadruga #{sel.id}</h3>
          <span className="text-xs text-gray-400">osnovana dan {sel.foundedDay}</span>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { l: "Balans zadruge", v: fmt(sel.bal), c: "text-green-700" },
            { l: "Članova", v: String(sel.clanovi) },
            { l: "Projekata", v: String(sel.projekti) },
            { l: "Bonusi plaćeni", v: String(sel.bonusiPlaceni.size) },
          ].map(x => (
            <div key={x.l} className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-400">{x.l}</p>
              <p className={`text-xl font-bold font-mono ${x.c ?? "text-gray-900"}`}>{x.v}</p>
            </div>
          ))}
        </div>
        {sel.bonusiPlaceni.size > 0 && (
          <div className="bg-green-50 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-green-700 mb-1">Dostignuti pragovi</p>
            <div className="flex flex-wrap gap-2">
              {[...sel.bonusiPlaceni].sort((a, b) => a - b).map(p => (
                <span key={p} className="bg-white border border-green-200 text-green-700 text-xs font-mono px-2 py-0.5 rounded-lg">{p} čl.</span>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Projekti ({sel.projekti})</p>
          </div>
          {sel.projekti === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-gray-400">Nema projekata (minimum 3 člana, 1 nedeljno)</p>
          ) : (
            Array.from({ length: sel.projekti }).map((_, i) => (
              <div key={i} className={`px-4 py-2.5 flex justify-between items-center text-xs ${i < sel.projekti - 1 ? "border-b border-gray-100" : ""}`}>
                <span className="text-gray-700">Projekat #{i + 1}</span>
                <span className="text-gray-400 font-mono">dan {sel.foundedDay + (i + 1) * 7}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-base font-semibold text-gray-900">Rang lista zadruga</h3>
        <span className="text-xs text-gray-400">{zadruge.length} zadruga</span>
      </div>
      {zadruge.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">Nema zadruga</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {sorted.map((z, i) => (
            <button key={z.id} onClick={() => setSelId(z.id)}
              className={`w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left ${i < sorted.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm text-gray-400 font-mono w-5">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Zadruga #{z.id}</p>
                  <p className="text-xs text-gray-400">osnovana dan {z.foundedDay} · {z.clanovi} članova · {z.projekti} projekata</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-green-700">{fmt(z.bal)}</p>
                  <p className="text-xs text-gray-400">POEN</p>
                </div>
                {z.bonusiPlaceni.size > 0 && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">{z.bonusiPlaceni.size} bonusa</span>
                )}
                <span className="text-gray-300 text-sm">›</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewZrno({ last, log, ukupnoZrna }: { last: DnevniLog; log: DnevniLog[]; ukupnoZrna: number }) {
  const zrnoLog = log.filter(d => d.zrnoKodKorisnika > 0 || d.zrnoKurs > 0);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-base font-semibold text-gray-900">ZRNO — Dan {last.day}</h3>
        <span className="text-xs text-gray-400">ukupno u sistemu: {ukupnoZrna.toLocaleString("sr-RS")}</span>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { l: "Kurs (POEN/ZRNO)", v: last.zrnoKurs > 0 ? last.zrnoKurs.toFixed(2) : "—", c: "text-purple-700" },
          { l: "ZRNO u Banci", v: fmt(last.zrnoUBanci), c: "text-gray-700" },
          { l: "ZRNO kod korisnika", v: fmt(last.zrnoKodKorisnika), c: "text-purple-600" },
          { l: "% distribuirano", v: last.zrnoKodKorisnika > 0 ? ((last.zrnoKodKorisnika / ukupnoZrna) * 100).toFixed(1) + "%" : "0%", c: "text-gray-700" },
        ].map(x => (
          <div key={x.l} className="bg-white rounded-xl border border-gray-200 p-3">
            <p className="text-xs text-gray-400">{x.l}</p>
            <p className={`text-xl font-bold font-mono ${x.c}`}>{x.v}</p>
          </div>
        ))}
      </div>
      {last.zrnoKurs === 0 ? (
        <div className="bg-purple-50 rounded-2xl border border-purple-100 p-6 text-center">
          <p className="text-sm font-semibold text-purple-700">ZRNO tržište neaktivno</p>
          <p className="text-xs text-purple-500 mt-1">Aktivira se automatski pri opticaju ≥ {fmt(1_000_000)} POEN</p>
          <p className="text-xs text-purple-400 mt-0.5">Trenutni opticaj: {fmt(last.opticaj)} POEN</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
            <p className="text-xs text-gray-400 mb-2">Kurs kroz vreme</p>
            <MiniChart data={zrnoLog.map(d => d.zrnoKurs)} color="#8b5cf6" h={70} />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Dan {zrnoLog[0]?.day ?? "—"}</span>
              <span className="font-mono text-purple-600">{last.zrnoKurs.toFixed(2)} POEN/ZRNO</span>
              <span>Dan {last.day}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 mb-3">Raspodela ZRNA</p>
            <div className="space-y-2">
              {[
                { l: "Banka", v: last.zrnoUBanci, total: ukupnoZrna, c: "bg-blue-400" },
                { l: "Korisnici", v: last.zrnoKodKorisnika, total: ukupnoZrna, c: "bg-purple-500" },
              ].map(x => (
                <div key={x.l}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{x.l}</span>
                    <span className="font-mono">{fmt(x.v)} ({((x.v / x.total) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${x.c} rounded-full`} style={{ width: `${(x.v / x.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SimulacioniEkran({ params, onReset }: { params: SimParams; onReset: () => void }) {
  const [state, setState] = useState<SimState>(() => initState(params));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [view, setView] = useState<SimView>("pregled");
  const playRef = useRef(false);

  useEffect(() => { playRef.current = playing; }, [playing]);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (!playRef.current) { clearInterval(id); return; }
      setState(prev => nextDayStep(prev, params));
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed, params]);

  const advance = useCallback((n: number) => {
    setPlaying(false);
    setState(prev => {
      let s = prev;
      for (let i = 0; i < n; i++) s = nextDayStep(s, params);
      return s;
    });
  }, [params]);

  const log = state.log;
  const last = log[log.length - 1];
  const prev2 = log[log.length - 2];
  const deltaOpticaj = last && prev2 ? last.opticaj - prev2.opticaj : 0;

  return (
    <div className="space-y-4">
      <Controls playing={playing} speed={speed} onAdvance={advance} onPlay={() => setPlaying(v => !v)} onReset={onReset} onSpeedChange={setSpeed} log={log} />
      <SimTabs view={view} setView={setView} />

      {view === "clanovi" && <ViewClanovi members={state.members} />}
      {view === "zadruge" && <ViewZadruge zadruge={state.zadruge} members={state.members} />}
      {view === "zrno" && last && <ViewZrno last={last} log={log} ukupnoZrna={params.ukupnoZrna} />}
      {view === "zrno" && !last && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">Pokreni simulaciju da vidiš ZRNO podatke</div>
      )}

      {view === "pregled" && <>
      {/* Stat kartice */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-400">Opticaj</p>
          <p className="text-xl font-bold font-mono text-green-700">{last ? fmt(last.opticaj) : "0"}</p>
          {deltaOpticaj > 0 && <p className="text-xs text-gray-400">+{fmt(deltaOpticaj)} danas</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-400">Članovi</p>
          <p className="text-xl font-bold font-mono text-gray-900">{last ? last.clanovi : params.pocetnihClanova}</p>
          {last && <p className="text-xs text-gray-400">{last.zadrugari} zadrugara</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-400">Zadruge</p>
          <p className="text-xl font-bold font-mono text-gray-900">{last ? last.zadruge : "0"}</p>
          {state.zadruge.length > 0 && <p className="text-xs text-gray-400">{state.zadruge.reduce((s, z) => s + z.projekti, 0)} projekata</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-400">10% limit</p>
          <p className="text-xl font-bold font-mono text-amber-600">{last ? fmt(Math.floor(last.opticaj * 0.1)) : "0"}</p>
          <p className="text-xs text-gray-400">POEN/dan</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-400">ZRNO kurs</p>
          <p className="text-xl font-bold font-mono text-purple-700">{last && last.zrnoKurs > 0 ? last.zrnoKurs.toFixed(1) : "—"}</p>
          <p className="text-xs text-gray-400">{last && last.zrnoKodKorisnika > 0 ? `${fmt(last.zrnoKodKorisnika)} izvan` : "neaktivno"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Opticaj POEN</p>
            <MiniChart data={log.map(d => d.opticaj)} color="#16a34a" h={55} />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Članovi <span className="text-blue-500">●</span>  Zadrugari <span className="text-green-500">●</span></p>
            <MiniChart data={log.map(d => d.clanovi)} color="#3b82f6" h={35} />
            <MiniChart data={log.map(d => d.zadrugari)} color="#16a34a" h={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          {last ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-gray-700">Dan {last.day} — šta se desilo</p>
                {last.koeficijent < 1 && (
                  <span className="text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">koef. {last.koeficijent.toFixed(3)}</span>
                )}
              </div>
              <div className="space-y-1.5">
                {last.dogadjaji.map((d, i) => {
                  const cfg = DOG_CFG[d.tip] ?? { bg: "bg-gray-50", text: "text-gray-600", ikona: "·" };
                  return (
                    <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-xl text-xs ${cfg.bg} ${cfg.text}`}>
                      <span className="opacity-50 shrink-0">{cfg.ikona}</span>
                      <span className="flex-1 leading-snug">{d.tekst}</span>
                      {d.iznos > 0 && <span className="font-mono font-semibold shrink-0">+{fmt(d.iznos)} P</span>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                {[
                  { l: "Verif", v: last.em_verif }, { l: "Prep.", v: last.em_ref },
                  { l: "Donacije", v: last.em_don }, { l: "Zadruge", v: last.em_zadruga },
                  { l: "Programi", v: last.em_programi },
                ].filter(x => x.v > 0).map(x => (
                  <div key={x.l} className="bg-gray-50 rounded-lg px-2 py-1 text-center">
                    <p className="text-gray-400 text-xs">{x.l}</p>
                    <p className="font-mono font-semibold text-green-700 text-xs">{fmt(x.v)}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">Pritisni +1 dan ili ▶ Auto</div>
          )}
        </div>
      </div>

      {log.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between">
            <p className="text-sm font-semibold text-gray-700">Istorija</p>
            <p className="text-xs text-gray-400">{log.length} dana</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  {["Dan", "Čl.", "Zadr.", "Opticaj", "Kum.Don.", "Prog.zatr.", "Koef.", "ZRNO kurs"].map(h => (
                    <th key={h} className="px-3 py-2 text-right font-medium first:text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...log].reverse().slice(0, 15).map((d, i) => (
                  <tr key={d.day} className={i % 2 === 0 ? "" : "bg-gray-50/50"}>
                    <td className="px-3 py-1.5 text-left font-mono text-gray-500">{d.day}</td>
                    <td className="px-3 py-1.5 text-right">{d.clanovi}</td>
                    <td className="px-3 py-1.5 text-right text-blue-600">{d.zadrugari}</td>
                    <td className="px-3 py-1.5 text-right font-mono font-semibold text-green-700">{fmt(d.opticaj)}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-amber-600">{fmt(d.cumDonRSD)}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-gray-600">{d.totalRequested > 0 ? fmt(d.totalRequested) : "—"}</td>
                    <td className={`px-3 py-1.5 text-right font-mono font-semibold ${d.koeficijent < 1 ? "text-red-600" : "text-gray-300"}`}>
                      {d.koeficijent < 1 ? d.koeficijent.toFixed(3) : "1.000"}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono text-purple-600">{d.zrnoKurs > 0 ? d.zrnoKurs.toFixed(1) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>}
    </div>
  );
}

function Controls({ playing, speed, onAdvance, onPlay, onReset, onSpeedChange, log }: {
  playing: boolean; speed: number;
  onAdvance: (n: number) => void; onPlay: () => void;
  onReset: () => void; onSpeedChange: (v: number) => void;
  log: DnevniLog[];
}) {
  const last = log[log.length - 1];
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <span className="text-3xl font-bold font-mono text-green-700">Dan {log.length}</span>
        {last && <span className="text-sm text-gray-400 ml-3">opticaj {fmt(last.opticaj)} POEN</span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onAdvance(1)} className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">+1 dan</button>
        <button onClick={() => onAdvance(7)} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors">+7 dana</button>
        <button onClick={() => onAdvance(30)} className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors">+30 dana</button>
        <button onClick={onPlay}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${playing ? "bg-red-600 text-white hover:bg-red-700" : "bg-purple-600 text-white hover:bg-purple-700"}`}>
          {playing ? "⏸ Pauza" : "▶ Auto"}
        </button>
        {playing && (
          <select value={speed} onChange={e => onSpeedChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none">
            <option value={200}>Brzo</option>
            <option value={600}>Normalno</option>
            <option value={1500}>Polako</option>
          </select>
        )}
        <button onClick={onReset} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">↺ Reset</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────

export default function SimulatorKlijent() {
  const [params, setParams] = useState<SimParams | null>(null);
  if (!params) return <KonfiguracioniEkran onStart={setParams} />;
  return <SimulacioniEkran params={params} onReset={() => setParams(null)} />;
}
