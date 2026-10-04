// Alat „stare slikovnice“: gvaš površine sa neravnom ivicom, linije mastila
// koje blago „ključaju“, uskakanje sa odskokom. Sve je SVG u prostoru 1080×1920.
import React, { createContext, useContext } from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { P } from "./paleta";

// Pomak lokalnog vremena: scena se renderuje nekoliko frejmova pre svog početka (prelaz),
// a sve animacije se kače na frejm u odnosu na početak scene iz plana.
export const PomakCtx = createContext(0);
export const useF = () => useCurrentFrame() - useContext(PomakCtx);

// Linije i ivice „ključaju“ kao u ručno crtanoj animaciji: na svaka 4 frejma (7,5 puta u sekundi).
export const BOIL = 4;
export const useBoil = () => Math.floor(useCurrentFrame() / BOIL) % 3;

/** Zajedničke definicije — ubacuju se jednom u svaki SVG sloj. */
export const Defs: React.FC = () => (
  <defs>
    {/* ekranski prostor: filter pokriva samo kadar; šum je unapred izračunata slika (scripts/teksture.py) */}
    {[0, 1, 2].map((i) => (
      <filter key={i} id={`hrap${i}`} filterUnits="userSpaceOnUse" x="-20" y="-20" width="1120" height="1960" colorInterpolationFilters="sRGB">
        <feImage href={staticFile(`pomeraj${i}.png`)} x="-20" y="-20" width="1120" height="1960" preserveAspectRatio="none" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={9} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    ))}
    {[0, 1, 2].map((i) => (
      <filter key={`l${i}`} id={`hrapLok${i}`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves={2} seed={i * 7 + 3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    ))}
    {[0, 1, 2].map((i) => (
      <filter key={`s${i}`} id={`hrapJako${i}`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={i * 11 + 5} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={9} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    ))}
    <filter id="senkaMeka" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor={P.senka} floodOpacity="0.28" />
    </filter>
    <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="blur14" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <filter id="sjaj" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <pattern id="gvasP" patternUnits="userSpaceOnUse" width="512" height="512">
      <image href={staticFile("gvas.png")} width="512" height="512" />
    </pattern>
    <pattern id="gvasS" patternUnits="userSpaceOnUse" width="256" height="256">
      <image href={staticFile("gvas.png")} width="256" height="256" />
    </pattern>
    <radialGradient id="obrazG">
      <stop offset="0" stopColor={P.obraz} stopOpacity="0.55" />
      <stop offset="1" stopColor={P.obraz} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="toplaSvetlost">
      <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.7" />
      <stop offset="1" stopColor="#FFE3A0" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="stakloG" x1="0" x2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.0" />
      <stop offset="0.25" stopColor="#fff" stopOpacity="0.55" />
      <stop offset="0.4" stopColor="#fff" stopOpacity="0.0" />
    </linearGradient>
  </defs>
);

/** Grupa sa neravnom ivicom gvaša (menja se na 4 frejma). */
export const Hrapavo: React.FC<{ jako?: boolean; lokalno?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ jako, lokalno, children, style }) => {
  const b = useBoil();
  return (
    <g filter={`url(#${jako ? "hrapJako" : lokalno ? "hrapLok" : "hrap"}${b})`} style={style}>
      {children}
    </g>
  );
};

type OblikProps = {
  d: string;
  boja: string;
  ivica?: string | false;
  debljina?: number;
  tekstura?: number;
  opacity?: number;
  transform?: string;
  sitna?: boolean;
};

/** Površina gvaša: boja + mrlja (multiply) + ivica mastilom. */
export const Oblik: React.FC<OblikProps> = ({ d, boja, ivica = P.mastilo, debljina = 4, tekstura = 0.32, opacity = 1, transform, sitna }) => (
  <g opacity={opacity} transform={transform}>
    <path d={d} fill={boja} />
    {tekstura > 0 && <path d={d} fill={sitna ? "url(#gvasS)" : "url(#gvasP)"} style={{ mixBlendMode: "multiply" }} opacity={tekstura} />}
    {ivica && <path d={d} fill="none" stroke={ivica} strokeWidth={debljina} strokeLinejoin="round" strokeLinecap="round" />}
  </g>
);

/** Linija mastila; može da se iscrtava (napredak 0–1). */
export const Linija: React.FC<{ d: string; boja?: string; debljina?: number; napredak?: number; opacity?: number; cap?: "round" | "butt" }> = ({
  d,
  boja = P.mastilo,
  debljina = 4,
  napredak = 1,
  opacity = 1,
  cap = "round",
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
      strokeDasharray={napredak < 1 ? "1 1" : undefined}
      strokeDashoffset={napredak < 1 ? 1 - napredak : undefined}
      opacity={opacity}
    />
  );

/** Elipsa kao put (za Oblik). */
export const elipsa = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;

/** Zaobljen pravougaonik kao put. */
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
    <g transform={`translate(${x} ${y + (1 - Math.min(1, s)) * odozdo}) rotate(${(rot + (1 - s) * -10).toFixed(2)}) scale(${(s * skala).toFixed(4)})`}>
      {children}
    </g>
  );
};

/** Napredak 0–1 između dva frejma, sa blagim ubrzanjem/usporenjem. */
export const napredak = (f: number, od: number, trajanje: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [od, od + trajanje], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const mesaj = (a: number, b: number, t: number) => a + (b - a) * t;

/** Blago „disanje“ (0–1 sinus) za mirne kadrove. */
export const dah = (f: number, period = 90, faza = 0) => Math.sin(((f + faza) / period) * Math.PI * 2);

/** Ceo kadar kao SVG sloj. */
export const Kadar: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, ...style }}>
    <Defs />
    {children}
  </svg>
);

/** Kamera: lagani zum/pomak celog kadra (vrednosti se interpoliraju spolja). */
export const Kamera: React.FC<{ x?: number; y?: number; z?: number; rot?: number; children: React.ReactNode }> = ({ x = 540, y = 960, z = 1, rot = 0, children }) => (
  <g transform={`translate(540 960) scale(${z}) rotate(${rot}) translate(${-x} ${-y})`}>{children}</g>
);
