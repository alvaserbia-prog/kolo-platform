// Zajedničko za scene videa „Trampa“: pisanje kredom, strelica kredom, pod (linija poda).
import React from "react";
import { Easing } from "remotion";
import { P } from "../paleta";
import { RUKOPIS } from "../fontovi";
import { Linija, Pop, napredak, useF } from "../alat";
import { DzakZita, KockaSoli, Novcanica, Skoljke, Zlatnik } from "../stvari";

/** Tekst koji se piše kredom, slovo po slovo (od frejma `at`, `brzina` slova u frejmu). */
export const Pisi: React.FC<{
  tekst: string;
  at: number;
  x: number;
  y: number;
  velicina?: number;
  boja?: string;
  brzina?: number;
  sidro?: "start" | "middle" | "end";
  rot?: number;
  podvuci?: boolean;
  sirina?: number; // za podvlačenje: procena širine teksta
}> = ({ tekst, at, x, y, velicina = 110, boja = P.mastilo, brzina = 0.7, sidro = "middle", rot = 0, podvuci, sirina }) => {
  const f = useF();
  if (f < at) return null;
  const n = Math.min(tekst.length, Math.floor((f - at) * brzina) + 1);
  const kraj = at + tekst.length / brzina;
  const w = sirina ?? tekst.length * velicina * 0.48;
  const x0 = sidro === "middle" ? x - w / 2 : sidro === "end" ? x - w : x;
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <text x={x} y={y} textAnchor={sidro} fontFamily={RUKOPIS} fontWeight={700} fontSize={velicina} fill={boja}>
        {/* nenapisana slova ostaju nevidljiva, da tekst ne „klizi“ dok se piše */}
        <tspan>{tekst.slice(0, n)}</tspan>
        <tspan opacity={0}>{tekst.slice(n)}</tspan>
      </text>
      {podvuci && f > kraj && <Linija d={`M${x0 - 10},${y + 22} Q${x0 + w / 2},${y + 14} ${x0 + w + 10},${y + 20}`} boja={boja} debljina={8} napredak={napredak(f, kraj, 10, Easing.out(Easing.quad))} />}
    </g>
  );
};

/** Strelica kredom od (x1,y1) do (x2,y2), iscrtava se. */
export const Strelica: React.FC<{ x1: number; y1: number; x2: number; y2: number; luk?: number; napredak?: number; boja?: string; debljina?: number; vrh?: boolean }> = ({
  x1,
  y1,
  x2,
  y2,
  luk = -80,
  napredak: n = 1,
  boja = P.mastilo,
  debljina = 8,
  vrh = true,
}) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + luk;
  const ug = Math.atan2(y2 - my, x2 - mx);
  const a = 34;
  return (
    <g>
      <Linija d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} boja={boja} debljina={debljina} napredak={n} />
      {vrh && n >= 0.98 && (
        <path
          d={`M${x2 - a * Math.cos(ug - 0.5)},${y2 - a * Math.sin(ug - 0.5)} L${x2},${y2} L${x2 - a * Math.cos(ug + 0.5)},${y2 - a * Math.sin(ug + 0.5)}`}
          fill="none"
          stroke={boja}
          strokeWidth={debljina}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};

/** Linija poda kredom (lako „nacrtan“ pod ispod likova). */
export const Pod: React.FC<{ y?: number; x0?: number; x1?: number }> = ({ y = 1290, x0 = 50, x1 = 1030 }) => (
  <g>
    <Linija d={`M${x0},${y} Q${(x0 + x1) / 2},${y - 6} ${x1},${y + 4}`} debljina={6} opacity={0.85} />
    {Array.from({ length: 8 }, (_, i) => (
      <Linija key={i} d={`M${x0 + 40 + i * 120},${y + 18} l60,-2`} debljina={3} opacity={0.35} />
    ))}
  </g>
);

export const useNapredak = (od: number, trajanje: number) => napredak(useF(), od, trajanje);

/** Prvi način: linija vremena sa sredstvima koja su ljudi primali (žito, so, školjke, zlato, novac). */
export const LinijaVremena: React.FC<{ at: { linija: number; nekad: number; kasnije: number; stvari: number[] }; y?: number }> = ({ at, y = 660 }) => {
  const f = useF();
  const el = [<DzakZita s={0.62} />, <KockaSoli s={0.8} />, <Skoljke s={0.72} />, <Zlatnik s={0.95} />, <Novcanica s={0.85} rot={-6} />];
  const xs = [150, 340, 540, 735, 925];
  return (
    <g>
      <Linija d={`M70,${y + 20} Q540,${y + 10} 1010,${y + 20}`} debljina={7} napredak={napredak(f, at.linija, 18)} />
      {f >= at.linija + 16 && <Linija d={`M985,${y} L1012,${y + 20} L985,${y + 40}`} debljina={7} />}
      <Pisi tekst="nekad" at={at.nekad} x={80} y={y + 90} velicina={52} brzina={0.8} sidro="start" boja={P.mastiloSvetlo} />
      <Pisi tekst="kasnije" at={at.kasnije} x={1000} y={y + 90} velicina={52} brzina={0.8} sidro="end" boja={P.mastiloSvetlo} />
      {el.map((e, i) => (
        <Pop key={i} at={at.stvari[i] - 3} x={xs[i]} y={y} skala={1}>
          {e}
        </Pop>
      ))}
    </g>
  );
};
