// Alat linoreza: ravne površine mastila sa trunjem (gde valjak nije naneo boju), urezi dletom
// (beli, zašiljeni potezi), ivica koja „drhti“ kao ručni otisak, boja koja malo promaši registar.
// Kretanje ide „u dvojkama“ (15 otisaka u sekundi), kao animacija rađena otisak po otisak.
import React, { createContext, useContext } from "react";
import { Easing, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const L = {
  papir: "#ECE3CF",
  papirTopli: "#F2E6CB",
  koza: "#F1E2C4",
  mastilo: "#1E1A17",
  mastiloMeko: "#3A332D",
  crvena: "#B3312A",
  crvenaTamna: "#7E211C",
  oker: "#D39A3A",
  okerSvetli: "#E6BE6A",
  indigo: "#2F4A6B",
  siva: "#8E8983",
  sivaSvetla: "#BDB7AE",
  voda: "#5F8FA3",
  vodaMutna: "#8A7650",
  zelena: "#1F8A4C",
  zelenaTamna: "#135C32",
  zelenaSvetla: "#6CC08B",
  zelenaBleda: "#DDEFE2",
};

// Scena se renderuje nekoliko frejmova pre svog početka (prelaz); animacije se kače na početak scene.
export const PomakCtx = createContext(0);
/** Lokalni frejm, zaokružen na dvojke: pokret ide otisak po otisak. */
export const useF = () => {
  const f = useCurrentFrame() - useContext(PomakCtx);
  return Math.floor(f / 2) * 2;
};
/** Lokalni frejm bez zaokruživanja (za ono što mora glatko: titlovi, valjak). */
export const useFGlatko = () => useCurrentFrame() - useContext(PomakCtx);
/** Ivica „drhti“: nova mapa pomeraja na svaka 4 frejma. */
export const useDrhtaj = () => Math.floor(useCurrentFrame() / 4) % 3;

export const Defs: React.FC = () => (
  <defs>
    {[0, 1, 2].map((i) => (
      <filter key={i} id={`rez${i}`} filterUnits="userSpaceOnUse" x="-20" y="-20" width="1120" height="1960" colorInterpolationFilters="sRGB">
        <feImage href={staticFile(`pomeraj${i}.png`)} x="-20" y="-20" width="1120" height="1960" preserveAspectRatio="none" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    ))}
    {[0, 1, 2].map((i) => (
      <filter key={`l${i}`} id={`rezLok${i}`} x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={i * 7 + 3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    ))}
    <pattern id="trunje" patternUnits="userSpaceOnUse" width="512" height="512">
      <image href={staticFile("trunje.png")} width="512" height="512" />
    </pattern>
    <pattern id="trunjeSitno" patternUnits="userSpaceOnUse" width="200" height="200">
      <image href={staticFile("trunje.png")} width="200" height="200" />
    </pattern>
    <filter id="mekoSenka" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#1E1A17" floodOpacity="0.3" />
    </filter>
    <filter id="sjaj" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
    <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
  </defs>
);

/** Grupa sa urezanom, neravnom ivicom (drhti kao ručni otisak). */
export const Rez: React.FC<{ children: React.ReactNode; opacity?: number; lokalno?: boolean }> = ({ children, opacity, lokalno }) => {
  const d = useDrhtaj();
  return (
    <g filter={`url(#${lokalno ? "rezLok" : "rez"}${d})`} opacity={opacity}>
      {children}
    </g>
  );
};

/** Boja koja malo promaši registar (pomak se menja sa svakim „otiskom“). */
export const Registar: React.FC<{ children: React.ReactNode; jacina?: number; seed?: string }> = ({ children, jacina = 3, seed = "r" }) => {
  const f = Math.floor(useCurrentFrame() / 4);
  const dx = (random(`${seed}x${f}`) - 0.5) * 2 * jacina;
  const dy = (random(`${seed}y${f}`) - 0.5) * 2 * jacina;
  return <g transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`}>{children}</g>;
};

/** Površina: boja + trunje papira + (opciono) ivica mastilom. */
export const Povrs: React.FC<{
  d: string;
  boja: string;
  ivica?: string | false;
  debljina?: number;
  trunje?: number;
  opacity?: number;
  transform?: string;
}> = ({ d, boja, ivica = L.mastilo, debljina = 6, trunje = 0.55, opacity = 1, transform }) => (
  <g opacity={opacity} transform={transform}>
    <path d={d} fill={boja} />
    {trunje > 0 && <path d={d} fill="url(#trunje)" opacity={trunje} />}
    {ivica && <path d={d} fill="none" stroke={ivica} strokeWidth={debljina} strokeLinejoin="round" strokeLinecap="round" />}
  </g>
);

/** Urez dletom: zašiljen potez (sočivo) od (x1,y1) do (x2,y2), najširi u sredini. */
export const urez = (x1: number, y1: number, x2: number, y2: number, w = 8, krivina = 0) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l = Math.hypot(dx, dy) || 1;
  const nx = (-dy / l) * w;
  const ny = (dx / l) * w;
  const mx = (x1 + x2) / 2 + (-dy / l) * krivina;
  const my = (y1 + y2) / 2 + (dx / l) * krivina;
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${(mx + nx).toFixed(1)},${(my + ny).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} Q${(mx - nx).toFixed(1)},${(my - ny).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}Z`;
};

/** Niz ureza (šrafura) u pravougaoniku, pod uglom; seme daje ručnu neravnomernost. */
export const Srafura: React.FC<{ x: number; y: number; w: number; h: number; ugao?: number; razmak?: number; duzina?: number; debljina?: number; boja?: string; seed?: string; opacity?: number }> = ({
  x,
  y,
  w,
  h,
  ugao = -20,
  razmak = 22,
  duzina = 60,
  debljina = 5,
  boja = L.papir,
  seed = "s",
  opacity = 1,
}) => {
  const out: string[] = [];
  const a = (ugao * Math.PI) / 180;
  let i = 0;
  for (let yy = y; yy < y + h; yy += razmak) {
    for (let xx = x + ((i * 17) % razmak); xx < x + w; xx += duzina * 1.5) {
      const r = random(`${seed}${i}-${xx}`);
      const l = duzina * (0.6 + r * 0.6);
      const x1 = xx + r * 12;
      const y1 = yy + (random(`${seed}y${i}-${xx}`) - 0.5) * 8;
      out.push(urez(x1, y1, x1 + Math.cos(a) * l, y1 + Math.sin(a) * l, debljina * (0.6 + r * 0.6)));
    }
    i++;
  }
  return <path d={out.join(" ")} fill={boja} opacity={opacity} />;
};

export const elipsa = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;

export const kutija = (x: number, y: number, w: number, h: number, r = 10) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y}Z`;

export const Linija: React.FC<{ d: string; boja?: string; debljina?: number; napredak?: number; opacity?: number; crtica?: string }> = ({
  d,
  boja = L.mastilo,
  debljina = 6,
  napredak = 1,
  opacity = 1,
  crtica,
}) =>
  napredak <= 0 ? null : (
    <path
      d={d}
      pathLength={crtica ? undefined : 1}
      fill="none"
      stroke={boja}
      strokeWidth={debljina}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={crtica ?? (napredak < 1 ? "1 1" : undefined)}
      strokeDashoffset={!crtica && napredak < 1 ? 1 - napredak : undefined}
      opacity={opacity}
    />
  );

/** Opruga (sa malim odskokom) — kad se nešto „utisne“ u kadar. */
export const usePop = (at: number, tvrdoca = 180, prigusenje = 11) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping: prigusenje, stiffness: tvrdoca, mass: 0.7 } });
};

/** Pojava kao otisak pečata: iz veće razmere u tačnu, bez rotiranja. */
export const Utisni: React.FC<{ at: number; x: number; y: number; skala?: number; children: React.ReactNode; rot?: number }> = ({ at, x, y, skala = 1, rot = 0, children }) => {
  const f = useF();
  const s = usePop(at, 260, 16);
  if (f < at) return null;
  const k = 1 + (1 - Math.min(1, s)) * 0.35;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${(k * skala).toFixed(4)})`} opacity={Math.min(1, s * 2)}>
      {children}
    </g>
  );
};

export const Pop: React.FC<{ at: number; x: number; y: number; rot?: number; skala?: number; children: React.ReactNode; odozdo?: number }> = ({
  at,
  x,
  y,
  rot = 0,
  skala = 1,
  odozdo = 40,
  children,
}) => {
  const f = useF();
  const s = usePop(at);
  if (f < at) return null;
  return (
    <g transform={`translate(${x} ${y + (1 - Math.min(1, s)) * odozdo}) rotate(${(rot + (1 - s) * -8).toFixed(2)}) scale(${(s * skala).toFixed(4)})`}>
      {children}
    </g>
  );
};

export const napredak = (f: number, od: number, trajanje: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [od, od + trajanje], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const mesaj = (a: number, b: number, t: number) => a + (b - a) * t;
export const dah = (f: number, period = 90, faza = 0) => Math.sin(((f + faza) / period) * Math.PI * 2);

export const Kadar: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, ...style }}>
    <Defs />
    {children}
  </svg>
);

export const Kamera: React.FC<{ x?: number; y?: number; z?: number; rot?: number; children: React.ReactNode }> = ({ x = 540, y = 960, z = 1, rot = 0, children }) => (
  <g transform={`translate(540 960) scale(${z}) rotate(${rot}) translate(${-x} ${-y})`}>{children}</g>
);

/** Pozadina otiska: ravna boja papira preko celog kadra (papir sam dolazi iz sloja lista). */
export const Papir: React.FC<{ boja?: string }> = ({ boja = L.papir }) => <rect x={-400} y={-400} width={1880} height={2720} fill={boja} />;

// ── Tipični motivi linoreza ──────────────────────────────────────────────

/** Nebo urezano vodoravnim potezima (mastilo ostaje u tankim linijama). */
export const NeboUrezi: React.FC<{ y0?: number; y1?: number; seed?: string; gusto?: number }> = ({ y0 = 0, y1 = 700, seed = "nebo", gusto = 1 }) => {
  const d: string[] = [];
  let i = 0;
  for (let y = y0 + 20; y < y1; y += 34 / gusto) {
    const r = random(`${seed}${i}`);
    const x1 = -60 + r * 300;
    const l = 300 + random(`${seed}l${i}`) * 700;
    d.push(urez(x1, y, x1 + l, y + (random(`${seed}k${i}`) - 0.5) * 12, 2.6 + r * 2.4, (random(`${seed}q${i}`) - 0.5) * 20));
    i++;
  }
  return <path d={d.join(" ")} fill={L.mastilo} opacity={0.85} />;
};

/** Sunce kao crveni disk sa urezanim zracima. */
export const Sunce: React.FC<{ x: number; y: number; r?: number; zraci?: boolean }> = ({ x, y, r = 90, zraci = true }) => (
  <g transform={`translate(${x} ${y})`}>
    {zraci &&
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <path key={i} d={urez(Math.cos(a) * (r + 18), Math.sin(a) * (r + 18), Math.cos(a) * (r + 70 + (i % 2) * 30), Math.sin(a) * (r + 70 + (i % 2) * 30), 7)} fill={L.crvena} />;
      })}
    <Povrs d={elipsa(0, 0, r)} boja={L.crvena} />
    <path d={`${urez(-r * 0.5, -r * 0.2, r * 0.3, -r * 0.5, 6)} ${urez(-r * 0.4, r * 0.25, r * 0.5, 0, 5)}`} fill={L.papir} opacity={0.7} />
  </g>
);

/** Zemlja: crna traka sa urezanom travom. */
export const Zemlja: React.FC<{ y: number; boja?: string; seed?: string; visina?: number }> = ({ y, boja = L.mastilo, seed = "zem", visina = 1400 }) => (
  <g>
    <rect x={-400} y={y} width={1880} height={visina} fill={boja} />
    <rect x={-400} y={y} width={1880} height={visina} fill="url(#trunje)" opacity={0.28} />
    <Srafura x={-380} y={y + 24} w={1840} h={visina} ugao={-70} razmak={46} duzina={34} debljina={4} seed={seed} opacity={0.75} />
  </g>
);

/** Drvo: crna krošnja sa urezanim listovima. */
export const DrvoL: React.FC<{ s?: number; seed?: string }> = ({ s = 1, seed = "d" }) => (
  <g transform={`scale(${s})`}>
    <Povrs d="M-18,0 C-14,-70 -16,-140 -24,-190 L24,-190 C16,-140 14,-70 18,0Z" boja={L.mastilo} />
    <Povrs d="M-130,-200 C-170,-280 -110,-370 -30,-360 C10,-420 130,-400 130,-300 C180,-270 170,-180 100,-170 C60,-140 -80,-140 -130,-200Z" boja={L.mastilo} />
    {Array.from({ length: 14 }, (_, i) => {
      const x = -100 + random(`${seed}x${i}`) * 200;
      const y = -330 + random(`${seed}y${i}`) * 150;
      return <path key={i} d={urez(x, y, x + 26, y - 18, 6, 4)} fill={L.papir} />;
    })}
  </g>
);

/** Vojvođanska kuća sa zabatom na ulicu: beli zid, crni crep urezan u redove. */
export const KucaL: React.FC<{ s?: number; prozor?: string; vrata?: boolean; seed?: string }> = ({ s = 1, prozor = L.oker, vrata = false, seed = "k" }) => (
  <g transform={`scale(${s})`}>
    <Povrs d="M-160,0 L-160,-240 L0,-400 L160,-240 L160,0Z" boja={L.papirTopli} trunje={0.25} />
    <Povrs d="M-190,-222 L0,-424 L190,-222 L160,-222 L0,-390 L-160,-222Z" boja={L.mastilo} />
    <path d={Array.from({ length: 6 }, (_, i) => urez(-140 + i * 10, -236 - i * 26, 140 - i * 10, -236 - i * 26, 3)).join(" ")} fill={L.mastilo} />
    <Povrs d={elipsa(0, -300, 22)} boja={L.crvena} debljina={4} />
    {[-80, 80].map((px) => (
      <g key={px}>
        <Povrs d={kutija(px - 36, -190, 72, 96, 3)} boja={prozor} debljina={5} trunje={0.4} />
        <Linija d={`M${px},-190 L${px},-94 M${px - 36},-142 L${px + 36},-142`} debljina={5} />
      </g>
    ))}
    {vrata && <Povrs d={kutija(-30, -130, 60, 130, 3)} boja={L.mastilo} />}
    <path d={urez(-150, -20, 150, -24, 4)} fill={L.mastilo} opacity={0.6} />
    <text x={0} y={0} fontSize={1} fill="none">
      {seed}
    </text>
  </g>
);

/** Ograda od letvica. */
export const Ograda: React.FC<{ x0: number; x1: number; y: number; h?: number; razmak?: number; boja?: string }> = ({ x0, x1, y, h = 150, razmak = 36, boja = L.mastilo }) => {
  const el: React.ReactNode[] = [];
  for (let x = x0; x <= x1; x += razmak) el.push(<path key={x} d={`M${x - 9},${y} L${x - 9},${y - h + 10} L${x},${y - h} L${x + 9},${y - h + 10} L${x + 9},${y}Z`} fill={boja} />);
  return (
    <g>
      {el}
      <rect x={x0 - 14} y={y - h * 0.72} width={x1 - x0 + 28} height={14} fill={boja} />
      <rect x={x0 - 14} y={y - h * 0.32} width={x1 - x0 + 28} height={14} fill={boja} />
    </g>
  );
};
