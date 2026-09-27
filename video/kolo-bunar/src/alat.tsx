// Alat „drvoreza“: otisak u boji sa malim pomakom (kao kad se ploče ne poklope do milimetra),
// urezane šrafure mastilom, neravna ivica otiska koja blago „ključa“, uskakanje sa odskokom.
// Sve je SVG u prostoru 1080×1920.
import React, { createContext, useContext } from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { P } from "./paleta";

// Pomak lokalnog vremena: scena se renderuje nekoliko frejmova pre svog početka (prelaz).
export const PomakCtx = createContext(0);
export const useF = () => useCurrentFrame() - useContext(PomakCtx);

// Ivice otiska „ključaju“ kao u ručnoj animaciji: na svaka 4 frejma.
export const BOIL = 4;
export const useBoil = () => Math.floor(useCurrentFrame() / BOIL) % 3;

/** Šrafura kao pattern: linije pod uglom, razmak i debljina. */
const Srafura: React.FC<{ id: string; ugao: number; razmak: number; debljina: number; boja?: string }> = ({ id, ugao, razmak, debljina, boja = P.mastilo }) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={razmak} height={razmak} patternTransform={`rotate(${ugao})`}>
    <line x1={0} y1={razmak / 2} x2={razmak} y2={razmak / 2} stroke={boja} strokeWidth={debljina} />
  </pattern>
);

/** Zajedničke definicije — ubacuju se jednom u svaki SVG sloj. */
export const Defs: React.FC = () => (
  <defs>
    {[0, 1, 2].map((i) => (
      <filter key={i} id={`hrap${i}`} filterUnits="userSpaceOnUse" x="-20" y="-20" width="1120" height="1960" colorInterpolationFilters="sRGB">
        <feImage href={staticFile(`pomeraj${i}.png`)} x="-20" y="-20" width="1120" height="1960" preserveAspectRatio="none" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    ))}
    <filter id="senkaMeka" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor={P.senka} floodOpacity="0.3" />
    </filter>
    <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="sjaj" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
    <Srafura id="srafD" ugao={-35} razmak={13} debljina={3} />
    <Srafura id="srafD2" ugao={35} razmak={13} debljina={3} />
    <Srafura id="srafG" ugao={-35} razmak={8} debljina={2.6} />
    <Srafura id="srafH" ugao={0} razmak={12} debljina={2.4} />
    <Srafura id="srafV" ugao={90} razmak={11} debljina={2.4} />
    <Srafura id="srafRedak" ugao={-35} razmak={22} debljina={2.6} />
    <Srafura id="srafBelo" ugao={-35} razmak={14} debljina={3} boja={P.krem} />
    <pattern id="mrljaP" patternUnits="userSpaceOnUse" width="512" height="512">
      <image href={staticFile("gvas.png")} width="512" height="512" />
    </pattern>
    <radialGradient id="toplo">
      <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.75" />
      <stop offset="1" stopColor="#FFE3A0" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="zeleniSjaj">
      <stop offset="0" stopColor={P.zelena500} stopOpacity="0.55" />
      <stop offset="1" stopColor={P.zelena500} stopOpacity="0" />
    </radialGradient>
  </defs>
);

/** Grupa sa neravnom ivicom otiska (menja se na 4 frejma). */
export const Hrapavo: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const b = useBoil();
  return (
    <g filter={`url(#hrap${b})`} style={style}>
      {children}
    </g>
  );
};

type PovrsProps = {
  d: string;
  boja?: string | false;
  srafura?: string | false;
  srafuraOp?: number;
  ivica?: string | false;
  debljina?: number;
  opacity?: number;
  transform?: string;
  pomak?: [number, number];
  mrlja?: number;
};

/**
 * Površina otiska: boja (sa pomakom, multiply, kao posebna ploča), urezana šrafura
 * i kontura mastilom. Pomak boje je potpis ručnog otiska.
 */
export const Povrs: React.FC<PovrsProps> = ({
  d,
  boja = P.oker,
  srafura = false,
  srafuraOp = 0.85,
  ivica = P.mastilo,
  debljina = 5,
  opacity = 1,
  transform,
  pomak = [4, 3],
  mrlja = 0.5,
}) => (
  <g opacity={opacity} transform={transform}>
    {boja && (
      <g transform={`translate(${pomak[0]} ${pomak[1]})`}>
        <path d={d} fill={boja} />
        {mrlja > 0 && <path d={d} fill="url(#mrljaP)" style={{ mixBlendMode: "multiply" }} opacity={mrlja} />}
      </g>
    )}
    {srafura && <path d={d} fill={`url(#${srafura})`} opacity={srafuraOp} />}
    {ivica && <path d={d} fill="none" stroke={ivica} strokeWidth={debljina} strokeLinejoin="round" strokeLinecap="round" />}
  </g>
);

/** Puna mrlja mastila (crni deo otiska). */
export const Mastilo: React.FC<{ d: string; boja?: string; opacity?: number; transform?: string }> = ({ d, boja = P.mastilo, opacity = 1, transform }) => (
  <path d={d} fill={boja} opacity={opacity} transform={transform} />
);

/** Linija mastila; može da se iscrtava (napredak 0–1). */
export const Linija: React.FC<{ d: string; boja?: string; debljina?: number; napredak?: number; opacity?: number; cap?: "round" | "butt"; dash?: string }> = ({
  d,
  boja = P.mastilo,
  debljina = 5,
  napredak = 1,
  opacity = 1,
  cap = "round",
  dash,
}) =>
  napredak <= 0 ? null : (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={boja}
      strokeWidth={debljina}
      strokeLinecap={cap}
      strokeLinejoin="round"
      strokeDasharray={napredak < 1 ? "1 1" : dash}
      strokeDashoffset={napredak < 1 ? 1 - napredak : undefined}
      opacity={opacity}
    />
  );

export const elipsa = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;

export const kutija = (x: number, y: number, w: number, h: number, r = 10) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y}Z`;

/** Opruga sa malim odskokom — kad element „uskoči“. */
export const usePop = (at: number, tvrdoca = 170, prigusenje = 10) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping: prigusenje, stiffness: tvrdoca, mass: 0.7 } });
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

/** „Utisak“: element se pojavi kao da ga je neko pritisnuo pečatom — kratko preveliki, pa legne. */
export const Utisak: React.FC<{ at: number; x: number; y: number; rot?: number; skala?: number; children: React.ReactNode }> = ({ at, x, y, rot = 0, skala = 1, children }) => {
  const f = useF();
  if (f < at) return null;
  const t = Math.min(1, (f - at) / 7);
  const s = interpolate(t, [0, 0.6, 1], [1.35, 0.96, 1]);
  const o = interpolate(t, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={o} transform={`translate(${x} ${y}) rotate(${rot}) scale(${(s * skala).toFixed(4)})`}>
      {children}
    </g>
  );
};

export const napredak = (f: number, od: number, trajanje: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [od, od + trajanje], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const mesaj = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mešanje dve boje (#rrggbb). */
export const mesajBoju = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
};

export const dah = (f: number, period = 90, faza = 0) => Math.sin(((f + faza) / period) * Math.PI * 2);

/** Ceo kadar kao SVG sloj. */
export const Kadar: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, ...style }}>
    <Defs />
    {children}
  </svg>
);

/** Kamera: lagani zum/pomak celog kadra. */
export const Kamera: React.FC<{ x?: number; y?: number; z?: number; rot?: number; children: React.ReactNode }> = ({ x = 540, y = 960, z = 1, rot = 0, children }) => (
  <g transform={`translate(540 960) scale(${z}) rotate(${rot}) translate(${-x} ${-y})`}>{children}</g>
);

/** Deterministički „slučajan“ broj za raspored (bez Math.random). */
export const rnd = (i: number, s = 1) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
