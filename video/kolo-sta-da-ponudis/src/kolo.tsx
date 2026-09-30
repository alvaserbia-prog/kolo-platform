// Kolo ljudi koji se drže za ruke (elipsa u perspektivi), strelica i logo-značka.
import React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, Pt, krugTacke } from "./papir";
import { GlavaCfg, Osoba, spring01 } from "./likovi";

export type OsobaCfg = { boja: string; glava: GlavaCfg };

export const OSOBE: OsobaCfg[] = [
  { boja: P.korala, glava: { frizura: "kratka", kosa: P.kosaTamna } },
  { boja: P.nebo, glava: { frizura: "kapa", brkovi: true, koza: P.koza2 } },
  { boja: P.trava, glava: { frizura: "rep", kosa: P.kosaSmedja } },
  { boja: P.slezova, glava: { frizura: "punda", kosa: P.kosaSeda, naocare: true } },
  { boja: P.sunce, glava: { frizura: "cela", kosa: P.kosaSeda, naocare: true, koza: P.koza2 } },
  { boja: P.more, glava: { frizura: "marama" } },
  { boja: P.narandza, glava: { frizura: "kratka", kosa: P.kosaSmedja, koza: P.koza2 } },
  { boja: P.roze, glava: { frizura: "rep", kosa: P.kosaTamna } },
];

const SIR = 120;
const VIS = 120;

export type Geo = { cx: number; cy: number; rx: number; ry: number; ugao: number; skala: number; n: number };

/** Položaj i veličina i-te osobe (stopala na elipsi; napred = veće). */
export const polozaj = (g: Geo, i: number) => {
  const a = ((g.ugao + (i * 360) / g.n) * Math.PI) / 180;
  const dubina = (Math.sin(a) + 1) / 2; // 0 pozadi, 1 napred
  const s = g.skala * (0.8 + 0.22 * dubina);
  const x = g.cx + Math.cos(a) * g.rx;
  const y = g.cy + Math.sin(a) * g.ry;
  return { x, y, s, dubina, glava: [x, y - VIS * s - 0.28 * VIS * s] as Pt };
};

export const Kolo: React.FC<{
  seed: string;
  geo: Geo;
  pojava: number[]; // frejm kada osoba uskače
  ruke?: number; // frejm kada se uhvate za ruke
  istaknuti?: Record<number, number>; // osoba -> jačina sjaja 0–1
  bobanje?: boolean;
  osobe?: OsobaCfg[]; // ako nije zadato, uzimaju se OSOBE
  prazna?: number[]; // indeksi mesta koja su još prazna (isprekidana silueta)
}> = ({ seed, geo, pojava, ruke = 0, istaknuti = {}, bobanje = true, osobe = OSOBE, prazna = [] }) => {
  const f = useCurrentFrame();
  const poz = Array.from({ length: geo.n }, (_, i) => polozaj(geo, i));
  const skok = (i: number) => (bobanje ? Math.max(0, Math.sin((f + i * 8) / 7)) * 10 * poz[i].s : 0);
  const redosled = poz.map((p, i) => ({ ...p, i })).sort((a, b) => a.y - b.y);
  const rukeP = Math.max(0, Math.min(1, (f - ruke) / 10));
  return (
    <g>
      {/* ruke — iza tela */}
      {poz.map((p, i) => {
        const j = (i + 1) % geo.n;
        const q = poz[j];
        if (f < Math.max(pojava[i], pojava[j]) + 4 || prazna.includes(i) || prazna.includes(j)) return null;
        const smer = Math.sign(q.x - p.x) || 1;
        const ra: Pt = [p.x + smer * SIR * 0.36 * p.s, p.y - VIS * p.s + 22 * p.s - skok(i)];
        const rb: Pt = [q.x - smer * SIR * 0.36 * q.s, q.y - VIS * q.s + 22 * q.s - skok(j)];
        const sred: Pt = [(ra[0] + rb[0]) / 2, (ra[1] + rb[1]) / 2 + 22 * (p.s + q.s) / 2];
        return <Crta key={`r${i}`} pts={[ra, sred, rb]} seed={`${seed}-ruka${i}`} boja={osobe[i % osobe.length].boja} debljina={13 * (p.s + q.s) / 2} napredak={rukeP} korak={14} />;
      })}
      {redosled.map(({ x, y, s, i }) => {
        const pop = spring01(f - pojava[i]);
        if (pop <= 0) return null;
        const cfg = osobe[i % osobe.length];
        const sjaj = istaknuti[i] ?? 0;
        if (prazna.includes(i))
          return (
            <g key={i} transform={`translate(${x} ${y - VIS * s}) scale(${s * pop})`}>
              {sjaj > 0 && <circle cx={0} cy={-10} r={120} fill={P.zlatna400} opacity={0.4 * sjaj} />}
              <Crta pts={[...krugTacke(0, -VIS * 0.28, 46, 16), krugTacke(0, -VIS * 0.28, 46, 16)[0]]} seed={`${seed}-pg${i}`} boja={P.zelena700} debljina={5} isprekidana />
              <Crta pts={[[-SIR * 0.45, VIS], [-SIR * 0.5, VIS * 0.8], [-SIR * 0.32, 0], [SIR * 0.32, 0], [SIR * 0.5, VIS * 0.8], [SIR * 0.45, VIS]]} seed={`${seed}-pt${i}`} boja={P.zelena700} debljina={5} isprekidana />
            </g>
          );
        return (
          <g key={i} transform={`translate(${x} ${y - VIS * s - skok(i)}) scale(${s * pop})`}>
            {sjaj > 0 && <circle cx={0} cy={0} r={120} fill={P.zlatna400} opacity={0.35 * sjaj} />}
            <Osoba seed={`${seed}-o${i}`} boja={cfg.boja} glava={cfg.glava} sirina={SIR} visina={VIS} />
          </g>
        );
      })}
    </g>
  );
};

/** Ručno crtana strelica po kvadratnoj krivoj a→b, sa vrhom kad stigne. */
export const Strelica: React.FC<{ a: Pt; b: Pt; savij?: number; napredak: number; boja: string; seed: string; debljina?: number }> = ({
  a,
  b,
  savij = 0.35,
  napredak,
  boja,
  seed,
  debljina = 9,
}) => {
  if (napredak <= 0) return null;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c: Pt = [mx + dy * savij, my - Math.abs(dx) * savij];
  const tacka = (t: number): Pt => [
    (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
    (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
  ];
  const pts = Array.from({ length: 14 }, (_, i) => tacka(i / 13));
  const kraj = tacka(Math.min(1, napredak));
  const pre = tacka(Math.max(0, Math.min(1, napredak) - 0.06));
  const ug = Math.atan2(kraj[1] - pre[1], kraj[0] - pre[0]);
  const L = 34;
  const vrh: Pt[] = [
    [kraj[0] + Math.cos(ug) * 10, kraj[1] + Math.sin(ug) * 10],
    [kraj[0] + Math.cos(ug + 2.5) * L, kraj[1] + Math.sin(ug + 2.5) * L],
    [kraj[0] + Math.cos(ug - 2.5) * L, kraj[1] + Math.sin(ug - 2.5) * L],
  ];
  return (
    <g>
      <Crta pts={pts} seed={seed} boja={boja} debljina={debljina} napredak={napredak} korak={30} />
      <Isecak pts={vrh} boja={boja} seed={`${seed}-v`} senka="mala" amp={1} korak={12} />
    </g>
  );
};

/** KOLO znak sa sajta (kolo-hero-logo.png) kao okrugla papirna značka. */
export const LogoZnak: React.FC<{ r?: number; seed: string }> = ({ r = 140, seed }) => {
  const id = `logo-clip-${seed}`;
  const k = (0.93 * r) / 245;
  return (
    <g>
      <Isecak pts={krugTacke(0, 0, r + 16)} boja={P.belo} seed={`${seed}-b`} amp={2} />
      <clipPath id={id}>
        <circle cx={0} cy={0} r={r} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="#0B3D2E" />
        {/* znak u slici: centar ≈ (265, 278), poluprečnik ≈ 245 px */}
        <image href={staticFile("kolo-hero-logo.png")} x={-265 * k} y={-278 * k} width={529 * k} height={554 * k} />
      </g>
    </g>
  );
};
