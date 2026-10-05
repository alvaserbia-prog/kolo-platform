// Alat naive (video „Poznaješ li nekoga“), po uzoru na naivno slikarstvo Kovačice: čiste, jarke
// boje bez senki, ravna perspektiva, svaki cvet i list naslikan posebno, tanka tamna kontura.
// Kretanje je glatko i nežno (lutke se njišu), kao živa slika.
import React, { createContext, useContext } from "react";
import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const N = {
  nebo: "#5DA9DD",
  neboSvetlo: "#A8D5F0",
  neboBelo: "#E4F2FA",
  trava: "#5BA83A",
  travaTamna: "#3E7F2A",
  travaSvetla: "#8CC84B",
  zuta: "#F4C22B",
  zutaTamna: "#D99A12",
  crvena: "#D7263D",
  crvenaTamna: "#A3182B",
  roze: "#F28AA0",
  plava: "#2456A6",
  plavaSvetla: "#4E86D8",
  bela: "#FFF8EC",
  zid: "#FBF4E4",
  crep: "#C8452F",
  drvo: "#8B5A2B",
  drvoTamno: "#5C3A1A",
  koza: "#F6D2B0",
  obraz: "#F08A8A",
  kontura: "#3B2A1E",
  ljubicasta: "#7B4BA8",
  narandzasta: "#F07F2A",
  zelena: "#1F8A4C",
  zelenaSvetla: "#7FD39A",
};

export const PomakCtx = createContext(0);
export const useF = () => useCurrentFrame() - useContext(PomakCtx);

export const Defs: React.FC = () => (
  <defs>
    <filter id="nMekoSenka" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1B2F6B" floodOpacity="0.25" />
    </filter>
    <filter id="nSjaj" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <filter id="nPotez" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={4} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={2.5} />
    </filter>
    <linearGradient id="nNebo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={N.nebo} />
      <stop offset="0.7" stopColor={N.neboSvetlo} />
      <stop offset="1" stopColor={N.neboBelo} />
    </linearGradient>
  </defs>
);

/** Ceo kadar. `z` je približavanje celog kadra (video „Poljoprivrednici“: 1,30, da likovi ne budu sitni),
 *  oko tačke (540, 1040) u svetu, koja pada na y = 1000 na ekranu: tlo na 1300 ostaje iznad titla. */
export const Kadar: React.FC<{ children: React.ReactNode; z?: number }> = ({ children, z = 1.3 }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    <g filter="url(#nPotez)">
      <g transform={z === 1 ? undefined : `translate(540 1000) scale(${z}) translate(-540 -1040)`}>{children}</g>
    </g>
  </svg>
);

export const Kamera: React.FC<{ x?: number; y?: number; z?: number; children: React.ReactNode }> = ({ x = 540, y = 960, z = 1, children }) => (
  <g transform={`translate(540 960) scale(${z}) translate(${-x} ${-y})`}>{children}</g>
);

export const napredak = (f: number, od: number, trajanje: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [od, od + trajanje], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
export const mesaj = (a: number, b: number, t: number) => a + (b - a) * t;

export const usePop = (at: number, tvrdoca = 140, prigusenje = 10) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping: prigusenje, stiffness: tvrdoca, mass: 0.8 } });
};

export const Pop: React.FC<{ at: number; x: number; y: number; skala?: number; children: React.ReactNode }> = ({ at, x, y, skala = 1, children }) => {
  const f = useF();
  const s = usePop(at);
  if (f < at) return null;
  return <g transform={`translate(${x} ${y}) scale(${(s * skala).toFixed(4)})`}>{children}</g>;
};

export const elipsa = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;
export const kutija = (x: number, y: number, w: number, h: number, r = 10) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y}Z`;

/** Naslikana površina: boja + tanka tamna kontura. */
export const Boja: React.FC<{ d: string; boja: string; kontura?: string | false; debljina?: number; opacity?: number }> = ({ d, boja, kontura = N.kontura, debljina = 3, opacity }) => (
  <g opacity={opacity}>
    <path d={d} fill={boja} />
    {kontura && <path d={d} fill="none" stroke={kontura} strokeWidth={debljina} strokeLinejoin="round" />}
  </g>
);

// ── motivi ──────────────────────────────────────────────────────────────
export const Cvet: React.FC<{ x: number; y: number; s?: number; boja?: string; f?: number }> = ({ x, y, s = 1, boja = N.crvena, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(f / 30 + x) * 4})`}>
    <path d="M0,0 L0,30" stroke={N.travaTamna} strokeWidth={3} />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={0} cy={-9} rx={6} ry={10} fill={boja} transform={`rotate(${a})`} />
    ))}
    <circle r={5} fill={N.zuta} />
  </g>
);

/** Livada sa cvećem: gusto, ali pravilno, kao kod naivaca. */
export const Livada: React.FC<{ y: number; h?: number; seed?: string; f?: number; gusto?: number }> = ({ y, h = 1000, seed = "l", f = 0, gusto = 1 }) => {
  const boje = [N.crvena, N.bela, N.zuta, N.roze, N.ljubicasta, N.plavaSvetla];
  const n = Math.round(90 * gusto * (h / 700));
  return (
    <g>
      <rect x={-300} y={y} width={1680} height={h} fill={N.trava} />
      {Array.from({ length: 26 }, (_, i) => (
        <path key={`p${i}`} d={`M-300,${y + 20 + i * 40} Q540,${y + 5 + i * 40} 1380,${y + 20 + i * 40}`} stroke={i % 2 ? N.travaTamna : N.travaSvetla} strokeWidth={2} opacity={0.35} fill="none" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const cx = -40 + random(`${seed}x${i}`) * 1160;
        const cy = y + 30 + random(`${seed}y${i}`) * (h - 60);
        return <Cvet key={i} x={cx} y={cy} s={0.7 + random(`${seed}s${i}`) * 0.6} boja={boje[i % boje.length]} f={f} />;
      })}
    </g>
  );
};

export const Oblak: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-130,0 C-150,-40 -100,-70 -60,-50 C-40,-100 40,-100 60,-56 C100,-76 150,-40 130,0Z" boja={N.bela} kontura={N.plavaSvetla} />
  </g>
);

export const Sunce: React.FC<{ x: number; y: number; r?: number; f?: number }> = ({ x, y, r = 80, f = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.3})`}>
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d={`M${-10},${-r - 8} L0,${-r - 46} L10,${-r - 8}Z`} fill={N.zutaTamna} transform={`rotate(${i * 30})`} />
    ))}
    <Boja d={elipsa(0, 0, r)} boja={N.zuta} kontura={N.zutaTamna} />
  </g>
);

/** Drvo „lizalica“ sa pojedinačno naslikanim listovima i plodovima. */
export const DrvoN: React.FC<{ x: number; y: number; s?: number; plod?: string; seed?: string }> = ({ x, y, s = 1, plod = N.crvena, seed = "d" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-16,0 C-12,-80 -14,-150 -20,-200 L20,-200 C14,-150 12,-80 16,0Z" boja={N.drvo} />
    <Boja d={elipsa(0, -300, 150, 130)} boja={N.travaTamna} />
    {Array.from({ length: 40 }, (_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2;
      const r = Math.sqrt(random(`${seed}r${i}`)) * 120;
      return <ellipse key={i} cx={Math.cos(a) * r} cy={-300 + Math.sin(a) * r * 0.85} rx={11} ry={6} fill={i % 3 ? N.trava : N.travaSvetla} transform={`rotate(${a * 57} ${Math.cos(a) * r} ${-300 + Math.sin(a) * r * 0.85})`} />;
    })}
    {Array.from({ length: 9 }, (_, i) => {
      const a = random(`${seed}pa${i}`) * Math.PI * 2;
      const r = Math.sqrt(random(`${seed}pr${i}`)) * 110;
      return <circle key={`p${i}`} cx={Math.cos(a) * r} cy={-300 + Math.sin(a) * r * 0.8} r={9} fill={plod} stroke={N.kontura} strokeWidth={1.5} />;
    })}
  </g>
);

/** Bela kuća sa plavom sokom, crvenim crepom i cvećem na prozoru. */
export const KucaN: React.FC<{ x: number; y: number; s?: number; zid?: string; prozorLik?: React.ReactNode }> = ({ x, y, s = 1, zid = N.zid, prozorLik }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-190,0 L-190,-230 L190,-230 L190,0Z" boja={zid} />
    <rect x={-190} y={-26} width={380} height={26} fill={N.plava} />
    <Boja d="M-220,-222 L-150,-360 L150,-360 L220,-222Z" boja={N.crep} />
    {Array.from({ length: 5 }, (_, i) => (
      <path key={i} d={`M${-200 + i * 12},${-248 - i * 22} L${200 - i * 12},${-248 - i * 22}`} stroke={N.crvenaTamna} strokeWidth={2.5} opacity={0.6} />
    ))}
    {[-100, 100].map((px) => (
      <g key={px}>
        <Boja d={kutija(px - 48, -180, 96, 100, 4)} boja={N.plavaSvetla} />
        <path d={`M${px},-180 L${px},-80 M${px - 48},-130 L${px + 48},-130`} stroke={N.bela} strokeWidth={6} />
        <Boja d={kutija(px - 64, -186, 18, 112, 3)} boja={N.plava} />
        <Boja d={kutija(px + 46, -186, 18, 112, 3)} boja={N.plava} />
        {px > 0 && prozorLik && (
          <g>
            <rect x={px - 44} y={-176} width={88} height={92} fill={N.neboBelo} />
            <g transform={`translate(${px} -80)`}>{prozorLik}</g>
            <path d={`M${px},-180 L${px},-80`} stroke={N.bela} strokeWidth={6} />
          </g>
        )}
        {[-30, -10, 10, 30].map((cx, j) => (
          <Cvet key={cx} x={px + cx} y={-84} s={0.7} boja={j % 2 ? N.crvena : N.roze} />
        ))}
        <Boja d={kutija(px - 54, -80, 108, 16, 3)} boja={N.drvo} />
      </g>
    ))}
  </g>
);

export const OgradaN: React.FC<{ x0: number; x1: number; y: number; h?: number; boja?: string }> = ({ x0, x1, y, h = 150, boja = N.bela }) => {
  const el: React.ReactNode[] = [];
  for (let x = x0; x <= x1; x += 40) el.push(<Boja key={x} d={`M${x - 12},${y} L${x - 12},${y - h + 14} L${x},${y - h} L${x + 12},${y - h + 14} L${x + 12},${y}Z`} boja={boja} debljina={2.5} />);
  return (
    <g>
      <Boja d={kutija(x0 - 16, y - h * 0.72, x1 - x0 + 32, 14, 3)} boja={boja} debljina={2.5} />
      <Boja d={kutija(x0 - 16, y - h * 0.3, x1 - x0 + 32, 14, 3)} boja={boja} debljina={2.5} />
      {el}
    </g>
  );
};

/** Nebo sa oblacima i suncem (pozadina većine scena). */
export const Nebo: React.FC<{ f: number; sunce?: [number, number] | null }> = ({ f, sunce = [900, 520] }) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={1700} fill="url(#nNebo)" />
    {sunce && <Sunce x={sunce[0]} y={sunce[1]} r={70} f={f} />}
    <Oblak x={200 + ((f * 0.4) % 1400) - 200} y={470} s={0.9} />
    <Oblak x={700 + ((f * 0.25) % 1400) - 200} y={600} s={0.7} />
  </g>
);
