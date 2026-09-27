// Alat laviranog tuša i akvarela (video „Potvrda nosi odgovornost“): linije četkicom koje se
// iscrtavaju, lavirane površine sa mekom, neravnom ivicom i tamnijim rubom pigmenta, voda
// koja se muti kad u nju padne mulj. Pokret je spor i mek, kao boja koja se širi po mokrom papiru.
import React, { createContext, useContext } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const T = {
  papir: "#F6F4EE",
  tus: "#1D1F24",
  tusMeki: "#4A4E57",
  siva: "#8D9097",
  sivaSvetla: "#C9CBCF",
  indigo: "#3E5F80",
  voda: "#6FA8C8",
  vodaSvetla: "#BFE0EC",
  mulj: "#8A6A3E",
  muljTamni: "#5E4526",
  oker: "#C9A45C",
  okerSvetli: "#E3CB93",
  crvena: "#B5463A",
  ljubicasta: "#6E5A8C",
  koza: "#F0D9C0",
  trava: "#8BA66A",
  travaTamna: "#5E7A45",
  kamen: "#A7A39A",
  zelena: "#1F8A4C",
  zelenaSvetla: "#8FD0A5",
};

export const PomakCtx = createContext(0);
export const useF = () => useCurrentFrame() - useContext(PomakCtx);

export const Defs: React.FC = () => (
  <defs>
    <filter id="akv" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={3} seed={7} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={22} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feGaussianBlur in="d" stdDeviation="1.6" />
    </filter>
    <filter id="akvRub" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={3} seed={7} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={22} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feGaussianBlur in="d" stdDeviation="3" />
    </filter>
    <filter id="cetka" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves={2} seed={3} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="tSjaj" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="24" />
    </filter>
    <filter id="tMeko" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  </defs>
);

export const Kadar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);

export const Kamera: React.FC<{ x?: number; y?: number; z?: number; children: React.ReactNode }> = ({ x = 540, y = 960, z = 1, children }) => (
  <g transform={`translate(540 960) scale(${z}) translate(${-x} ${-y})`}>{children}</g>
);

export const napredak = (f: number, od: number, trajanje: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [od, od + trajanje], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
export const mesaj = (a: number, b: number, t: number) => a + (b - a) * t;
export const usePop = (at: number, tvrdoca = 90, prigusenje = 14) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping: prigusenje, stiffness: tvrdoca, mass: 1 } });
};

export const elipsa = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;
export const kutija = (x: number, y: number, w: number, h: number, r = 10) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y}Z`;

/** Lavirana površina: providna boja sa neravnom ivicom i tamnijim rubom pigmenta. */
export const Lavir: React.FC<{ d: string; boja: string; jacina?: number; rub?: boolean; opacity?: number }> = ({ d, boja, jacina = 0.6, rub = true, opacity = 1 }) => (
  <g opacity={opacity}>
    <path d={d} fill={boja} opacity={jacina} filter="url(#akv)" />
    {rub && <path d={d} fill="none" stroke={boja} strokeWidth={5} opacity={jacina * 0.9} filter="url(#akvRub)" />}
  </g>
);

/** Potez tušem; `napredak` ga iscrtava od početka ka kraju. */
export const Potez: React.FC<{ d: string; debljina?: number; boja?: string; napredak?: number; opacity?: number }> = ({ d, debljina = 5, boja = T.tus, napredak: p = 1, opacity = 1 }) =>
  p <= 0 ? null : (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={boja}
      strokeWidth={debljina}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={p < 1 ? "1 1" : undefined}
      strokeDashoffset={p < 1 ? 1 - p : undefined}
      opacity={opacity}
      filter="url(#cetka)"
    />
  );

/** Nebo: blago indigo pranje odozgo, sa belim mestima (oblaci su ostavljen papir). */
export const NeboTus: React.FC<{ y1?: number; jacina?: number }> = ({ y1 = 1000, jacina = 0.35 }) => (
  <g>
    <Lavir d={`M-100,-100 H1180 V${y1 - 320} C900,${y1 - 360} 700,${y1 - 250} 500,${y1 - 300} C300,${y1 - 340} 100,${y1 - 260} -100,${y1 - 300}Z`} boja={T.indigo} jacina={jacina} />
    <Lavir d={`M-100,-100 H1180 V${y1 - 520} C800,${y1 - 560} 400,${y1 - 470} -100,${y1 - 520}Z`} boja={T.indigo} jacina={jacina * 0.6} rub={false} />
  </g>
);

export const TloTus: React.FC<{ y: number; jacina?: number }> = ({ y, jacina = 0.45 }) => (
  <g>
    <Lavir d={`M-100,${y} C200,${y - 20} 600,${y + 20} 1180,${y - 10} V2100 H-100Z`} boja={T.trava} jacina={jacina} />
    <Lavir d={`M-100,${y + 160} C300,${y + 140} 700,${y + 190} 1180,${y + 150} V2100 H-100Z`} boja={T.travaTamna} jacina={jacina * 0.5} rub={false} />
    {Array.from({ length: 22 }, (_, i) => {
      const x = 20 + i * 50 + (i % 3) * 7;
      const yy = y + 30 + ((i * 37) % 120);
      return <Potez key={i} d={`M${x},${yy} q6,-22 14,-30 M${x + 10},${yy} q2,-18 -6,-26`} debljina={2.5} boja={T.travaTamna} opacity={0.7} />;
    })}
  </g>
);
