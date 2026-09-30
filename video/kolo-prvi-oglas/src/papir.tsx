// Osnovni „kolaž" alat: papirni isečci sa drhtavim ivicama, crtane linije,
// uskakanje sa odskokom. Sve je SVG u prostoru 1080×1920.
import React from "react";
import { random, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export type Pt = [number, number];

// Linije „ključaju" kao u ručno crtanoj animaciji: oblik se menja
// na svaka 4 frejma (7,5 puta u sekundi), ne u svakom frejmu.
export const BOIL = 4;
export const useBoil = () => Math.floor(useCurrentFrame() / BOIL);

const podeli = (pts: Pt[], korak: number, zatvoren: boolean): Pt[] => {
  const out: Pt[] = [];
  const n = pts.length;
  const ivica = zatvoren ? n : n - 1;
  for (let i = 0; i < ivica; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.ceil(d / korak));
    for (let j = 0; j < k; j++) {
      const t = j / k;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  if (!zatvoren) out.push(pts[n - 1]);
  return out;
};

/** Drhtav, blago zaobljen put kroz tačke (isečen makazama, nacrtan rukom). */
export const drhtaviPut = (pts: Pt[], seed: string, amp = 2.4, korak = 22, zatvoren = true): string => {
  const p = podeli(pts, korak, zatvoren).map(([x, y], i): Pt => [
    x + (random(`${seed}-x-${i}`) - 0.5) * 2 * amp,
    y + (random(`${seed}-y-${i}`) - 0.5) * 2 * amp,
  ]);
  const f = (v: number) => v.toFixed(1);
  if (!zatvoren) {
    let d = `M${f(p[0][0])},${f(p[0][1])}`;
    for (let i = 1; i < p.length - 1; i++) {
      const m: Pt = [(p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2];
      d += ` Q${f(p[i][0])},${f(p[i][1])} ${f(m[0])},${f(m[1])}`;
    }
    const z = p[p.length - 1];
    return d + ` L${f(z[0])},${f(z[1])}`;
  }
  const n = p.length;
  const mid = (i: number): Pt => [(p[i % n][0] + p[(i + 1) % n][0]) / 2, (p[i % n][1] + p[(i + 1) % n][1]) / 2];
  const s = mid(0);
  let d = `M${f(s[0])},${f(s[1])}`;
  for (let i = 1; i <= n; i++) {
    const m = mid(i);
    d += ` Q${f(p[i % n][0])},${f(p[i % n][1])} ${f(m[0])},${f(m[1])}`;
  }
  return d + "Z";
};

export const krugTacke = (cx: number, cy: number, r: number, n = 0, ry?: number): Pt[] => {
  const k = n || Math.max(10, Math.round((2 * Math.PI * r) / 22));
  return Array.from({ length: k }, (_, i): Pt => {
    const a = (i / k) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * (ry ?? r)];
  });
};

export const pravougaonik = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** Zajedničke definicije za svaki SVG: senka isečka i zrno papira. */
export const Defs: React.FC = () => (
  <defs>
    <filter id="senka" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="3" dy="6" stdDeviation="3" floodColor="#3b2a14" floodOpacity="0.28" />
    </filter>
    <filter id="senkaMala" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="2" dy="3" stdDeviation="1.6" floodColor="#3b2a14" floodOpacity="0.25" />
    </filter>
    <pattern id="zrno" patternUnits="userSpaceOnUse" width="512" height="512">
      <image href={staticFile("zrno.png")} width="512" height="512" />
    </pattern>
  </defs>
);

type IsecakProps = {
  pts: Pt[];
  boja: string;
  seed: string;
  amp?: number;
  korak?: number;
  senka?: "velika" | "mala" | "bez";
  zrno?: number;
  ivica?: string;
  ivicaDebljina?: number;
  opacity?: number;
};

/** Papirni isečak: boja + zrno papira + senka (odignut od podloge). */
export const Isecak: React.FC<IsecakProps> = ({
  pts,
  boja,
  seed,
  amp = 2.4,
  korak = 22,
  senka = "velika",
  zrno = 0.55,
  ivica,
  ivicaDebljina = 3,
  opacity = 1,
}) => {
  const b = useBoil();
  const d = drhtaviPut(pts, `${seed}-${b}`, amp, korak);
  const filter = senka === "velika" ? "url(#senka)" : senka === "mala" ? "url(#senkaMala)" : undefined;
  return (
    <g opacity={opacity}>
      <path d={d} fill={boja} filter={filter} stroke={ivica} strokeWidth={ivica ? ivicaDebljina : 0} strokeLinejoin="round" />
      {zrno > 0 && <path d={d} fill="url(#zrno)" style={{ mixBlendMode: "overlay" }} opacity={zrno} />}
    </g>
  );
};

/** Linija „olovkom": drhti i može da se iscrtava (napredak 0–1). */
export const Crta: React.FC<{
  pts: Pt[];
  seed: string;
  boja?: string;
  debljina?: number;
  napredak?: number;
  amp?: number;
  korak?: number;
  isprekidana?: boolean;
  opacity?: number;
}> = ({ pts, seed, boja = "#1A1A17", debljina = 5, napredak = 1, amp = 1.8, korak = 26, isprekidana = false, opacity = 1 }) => {
  const b = useBoil();
  if (napredak <= 0) return null;
  const d = drhtaviPut(pts, `${seed}-${b}`, amp, korak, false);
  if (isprekidana) {
    // isprekidana linija koja se iscrtava: maska od pune linije
    const id = `m-${seed}`;
    return (
      <g opacity={opacity}>
        <mask id={id} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000">
          <path d={d} pathLength={1} stroke="#fff" strokeWidth={debljina + 6} fill="none" strokeDasharray="1 1" strokeDashoffset={1 - napredak} strokeLinecap="round" />
        </mask>
        <path d={d} mask={`url(#${id})`} stroke={boja} strokeWidth={debljina} fill="none" strokeDasharray={`${debljina * 3} ${debljina * 2.4}`} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <path
      d={d}
      pathLength={1}
      stroke={boja}
      strokeWidth={debljina}
      fill="none"
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.min(1, napredak)}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
};

/** Opruga sa malim odskokom — kad element „uskoči". */
export const usePop = (at: number, tvrdoca = 170) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping: 9, stiffness: tvrdoca, mass: 0.7 } });
};

/** Grupa koja uskače: skala 0 → 1 sa odskokom, malo zarotirana, pa se smiri. */
export const Pop: React.FC<{
  at: number;
  x: number;
  y: number;
  rot?: number;
  skala?: number;
  njihanje?: number;
  faza?: number;
  children: React.ReactNode;
}> = ({ at, x, y, rot = 0, skala = 1, njihanje = 0, faza = 0, children }) => {
  const f = useCurrentFrame();
  const s = usePop(at);
  if (f < at) return null;
  const r = rot + (1 - s) * -14 + (njihanje ? Math.sin((f + faza * 17) / 14) * njihanje : 0);
  const dy = (1 - Math.min(1, s)) * 50;
  return <g transform={`translate(${x} ${y + dy}) rotate(${r.toFixed(2)}) scale(${(s * skala).toFixed(4)})`}>{children}</g>;
};

/** Napredak 0–1 između dva frejma, sa blagim ubrzanjem/usporenjem. */
export const napredak = (f: number, od: number, trajanje: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [od, od + trajanje], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
