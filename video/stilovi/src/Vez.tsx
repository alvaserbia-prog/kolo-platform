// Stil 3 — Narodni vez / goblen „Bod po bod".
// Platno sa rešetkom; svaki bod je krstić koji „pukne". Prvo jedna figura, pa još pet u kolu,
// ruke se spoje, oko kola se izveze šara, u sredini zlatno zrno. Tempo ubrzava.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Muzika, Natpis, Znak, clamp01, ease } from "./zajednicko";

const C = 30; // veličina ćelije
const KOL = 36;
const RED = 64;

type Bod = { x: number; y: number; boja: string; t: number };

// Figura 7×11: glava, telo (suknja), noge. 1 = bod.
const FIGURA = [
  "..111..",
  ".11111.",
  ".11111.",
  "..111..",
  "...1...",
  ".11111.",
  "1111111",
  ".11111.",
  "1111111",
  "1.1.1.1",
  ".1...1.",
];

const BOJE = [P.korala, P.zelena700, P.zlatna600, P.nebo, P.roze, P.zelena500];
const CX = 18;
const CY = 37;
const R = 11;

const polozaji = BOJE.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / BOJE.length;
  return { x: Math.round(CX + Math.cos(a) * R) - 3, y: Math.round(CY + Math.sin(a) * R) - 5 };
});

const figuraBodovi = (ox: number, oy: number, boja: string, od: number, trajanje: number): Bod[] => {
  const b: { x: number; y: number }[] = [];
  FIGURA.forEach((red, y) => [...red].forEach((c, x) => c === "1" && b.push({ x: ox + x, y: oy + y })));
  return b.map((p, i) => ({ ...p, boja, t: od + (i / b.length) * trajanje }));
};

/** Bresenham linija između dve ćelije. */
const linija = (a: [number, number], b: [number, number]) => {
  const out: [number, number][] = [];
  let [x0, y0] = a;
  const [x1, y1] = b;
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    out.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
  return out;
};

const napraviBodove = (): Bod[] => {
  const sve: Bod[] = [];
  // prva figura: sporo (0,5–3 s)
  sve.push(...figuraBodovi(polozaji[0].x, polozaji[0].y, BOJE[0], 14, 70));
  // ostalih pet: sve brže (3–5 s)
  for (let i = 1; i < BOJE.length; i++) sve.push(...figuraBodovi(polozaji[i].x, polozaji[i].y, BOJE[i], 88 + (i - 1) * 11, 14));
  // ruke: od šake do šake suseda (red 6 figure = ramena)
  for (let i = 0; i < BOJE.length; i++) {
    const a = polozaji[i];
    const b = polozaji[(i + 1) % BOJE.length];
    const dir = Math.sign(b.x - a.x) || 1;
    const pa: [number, number] = [a.x + (dir > 0 ? 7 : -1), a.y + 6];
    const pb: [number, number] = [b.x + (dir > 0 ? -1 : 7), b.y + 6];
    linija(pa, pb).forEach(([x, y], j, arr) => sve.push({ x, y, boja: P.zelena900, t: 150 + i * 4 + (j / arr.length) * 10 }));
  }
  // šara: dva pojasa rombova gore i dole + ivica
  const romb = (x: number, y: number) => Math.abs(((x % 6) + 6) % 6 - 3) + Math.abs(y) === 2;
  for (const [y0, boja, od] of [
    [16, P.korala, 170],
    [58, P.korala, 176],
  ] as [number, string, number][]) {
    for (let x = 1; x < KOL - 1; x++) {
      for (let dy = -2; dy <= 2; dy++) {
        if (romb(x, dy)) sve.push({ x, y: y0 + dy, boja, t: od + (x / KOL) * 24 });
      }
      sve.push({ x, y: y0 - 4, boja: P.zelena700, t: od + 4 + (x / KOL) * 24 });
      sve.push({ x, y: y0 + 4, boja: P.zelena700, t: od + 4 + (x / KOL) * 24 });
    }
  }
  // zlatno zrno u sredini
  for (let y = -4; y <= 4; y++) {
    const w = Math.round(2.2 * Math.sqrt(1 - (y / 4.6) ** 2));
    for (let x = -w; x <= w; x++) sve.push({ x: CX + x, y: CY + y, boja: P.zlatna400, t: 214 + (y + 4) * 2 + random(`z${x}${y}`) * 4 });
  }
  return sve;
};

const BODOVI = napraviBodove();

const Krstic: React.FC<{ b: Bod; f: number }> = ({ b, f }) => {
  const d = f - b.t;
  if (d < 0) return null;
  const s = d < 2 ? 1.6 - 0.3 * d : 1;
  const x = b.x * C + C / 2;
  const y = b.y * C + C / 2;
  const k = C * 0.36;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M${-k} ${-k} L${k} ${k} M${k} ${-k} L${-k} ${k}`} stroke="rgba(0,0,0,0.22)" strokeWidth={7} strokeLinecap="round" transform="translate(1.5 2)" />
      <path d={`M${-k} ${-k} L${k} ${k}`} stroke={b.boja} strokeWidth={7} strokeLinecap="round" />
      <path d={`M${k} ${-k} L${-k} ${k}`} stroke={b.boja} strokeWidth={7} strokeLinecap="round" style={{ filter: "brightness(1.12)" }} />
    </g>
  );
};

export const Vez: React.FC = () => {
  const f = useCurrentFrame();
  // zum: blizu na prvoj figuri, pa ceo vez, pa blago odzumiranje na kraju
  const z = interpolate(f, [0, 80, 100, 200, 240], [2.1, 1.9, 1, 1, 0.9], { extrapolateRight: "clamp", easing: ease });
  const fokus = polozaji[0];
  const fx = interpolate(f, [80, 100], [(fokus.x + 3.5) * C, 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fy = interpolate(f, [80, 100], [(fokus.y + 5.5) * C, CY * C], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kraj = ease(clamp01((f - 244) / 14));

  return (
    <AbsoluteFill style={{ background: P.papir, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${540 - fx}px, ${1080 - fy}px) scale(${z})`, transformOrigin: `${fx}px ${fy}px`, opacity: 1 - 0.85 * kraj }}>
        <svg width={KOL * C} height={RED * C}>
          <defs>
            <pattern id="platno" width={C} height={C} patternUnits="userSpaceOnUse">
              <rect width={C} height={C} fill="#F1E6CF" />
              <circle cx={0} cy={0} r={2.4} fill="#D9CBAE" />
              <path d={`M0 ${C / 2} H${C} M${C / 2} 0 V${C}`} stroke="#E6D8BC" strokeWidth={1} />
            </pattern>
          </defs>
          <rect width={KOL * C} height={RED * C} fill="url(#platno)" />
          {BODOVI.map((b, i) => (
            <Krstic key={i} b={b} f={f} />
          ))}
        </svg>
      </AbsoluteFill>

      {/* traka za natpis, kao porub */}
      <Natpis f={f} od={0} do={40} boja={P.zelena900}>Jedan bod ne znači mnogo.</Natpis>
      <Natpis f={f} od={40} do={88} boja={P.zelena900}>Jedan komšija.<br />Jedan doprinos.</Natpis>
      <Natpis f={f} od={92} do={150} boja={P.zelena900}>Ali kad se spoje…</Natpis>
      <Natpis f={f} od={150} do={210} boja={P.korala600}>…nastaje šara.</Natpis>
      <Natpis f={f} od={210} do={248} boja={P.zelena900}>Sombor. Srbija.<br />Tvoja ulica.</Natpis>

      {f >= 250 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans', sans-serif" }}>
          <div style={{ borderRadius: 70, overflow: "hidden", transform: `scale(${spring({ frame: f - 250, fps: 30, config: { damping: 10 } })})` }}>
            <Znak velicina={340} />
          </div>
          <div style={{ fontSize: 140, fontWeight: 900, color: P.zelena900, marginTop: 50, letterSpacing: -4, opacity: clamp01((f - 258) / 6) }}>ekolo.rs</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 96, fontWeight: 700, color: P.korala600, opacity: clamp01((f - 266) / 6) }}>Uvezi se.</div>
        </div>
      )}
      <Muzika odSekunde={0.2} />
    </AbsoluteFill>
  );
};
