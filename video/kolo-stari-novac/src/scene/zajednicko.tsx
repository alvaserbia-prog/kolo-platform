// Zajedničko za scene videa „Bez posrednika“: hladna soba (svet dinara, scene 1–8) i topla
// pozadina (KOLO, scene 9–11), strelica, cedulja sa natpisom, precrtavanje.
import React from "react";
import { P } from "../paleta";
import { SANS, RUKOPIS } from "../fontovi";
import { Linija, Oblik, kutija } from "../alat";

export const HLADNO = { zid: "#C9CFC8", zidTamni: "#A9B3AE", pod: "#8E8778", nebo: "#9DB0B6" };

/** Soba: zid, lajsna, pod. `mrak` 0–1 zatamnjuje (kraj meseca). */
export const Soba: React.FC<{ zid?: string; pod?: string; mrak?: number }> = ({ zid = HLADNO.zid, pod = HLADNO.pod, mrak = 0 }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={1560} fill={zid} />
    <rect x={-200} y={-200} width={1480} height={1560} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
    {/* tapeta: tanke uspravne pruge */}
    {Array.from({ length: 14 }, (_, i) => (
      <line key={i} x1={40 + i * 76} y1={-200} x2={40 + i * 76} y2={1300} stroke={P.mastilo} strokeWidth={2} opacity={0.06} />
    ))}
    <rect x={-200} y={1300} width={1480} height={20} fill={P.drvoTamno} />
    <rect x={-200} y={1320} width={1480} height={800} fill={pod} />
    <rect x={-200} y={1320} width={1480} height={800} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
    {mrak > 0 && <rect x={-200} y={-200} width={1480} height={2400} fill="#1E2A33" opacity={mrak * 0.6} />}
  </g>
);

/** Strelica mastilom od (x1,y1) do (x2,y2), iscrtava se. */
export const Strelica: React.FC<{ x1: number; y1: number; x2: number; y2: number; luk?: number; napredak?: number; boja?: string; debljina?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  luk = -80,
  napredak = 1,
  boja = P.mastilo,
  debljina = 6,
}) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + luk;
  const ug = Math.atan2(y2 - my, x2 - mx);
  const a = 26;
  return (
    <g>
      <Linija d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} boja={boja} debljina={debljina} napredak={napredak} />
      {napredak >= 0.98 && (
        <path
          d={`M${x2 - a * Math.cos(ug - 0.45)},${y2 - a * Math.sin(ug - 0.45)} L${x2},${y2} L${x2 - a * Math.cos(ug + 0.45)},${y2 - a * Math.sin(ug + 0.45)}`}
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

/** Cedulja (etiketa na kanapu) sa natpisom. */
export const Cedulja: React.FC<{ tekst: string; boja?: string; sirina?: number; velicina?: number; rukopis?: boolean }> = ({ tekst, boja = P.mastilo, sirina = 300, velicina = 40, rukopis }) => (
  <g>
    <Oblik d={`M${-sirina / 2},-40 L${sirina / 2 - 30},-40 L${sirina / 2},0 L${sirina / 2 - 30},40 L${-sirina / 2},40Z`} boja={P.belo} debljina={4} tekstura={0.15} />
    <circle cx={sirina / 2 - 34} cy={0} r={7} fill="none" stroke={P.mastilo} strokeWidth={3} />
    <text x={-12} y={velicina * 0.36} textAnchor="middle" fontFamily={rukopis ? RUKOPIS : SANS} fontWeight={800} fontSize={velicina} fill={boja}>
      {tekst}
    </text>
  </g>
);

/** Crvena crta preko nečega (precrtavanje), iscrtava se. */
export const Precrtaj: React.FC<{ w: number; napredak: number; boja?: string }> = ({ w, napredak, boja = P.ajvar }) => (
  <Linija d={`M${-w / 2},12 Q0,-6 ${w / 2},-10`} boja={boja} debljina={10} napredak={napredak} opacity={0.9} />
);

/** Papir (dokument) sa redovima. */
export const List: React.FC<{ w: number; h: number; rot?: number; children?: React.ReactNode }> = ({ w, h, rot = 0, children }) => (
  <g transform={`rotate(${rot})`}>
    <Oblik d={kutija(-w / 2 + 10, -h / 2 + 12, w, h, 8)} boja={P.senka} ivica={false} opacity={0.25} tekstura={0} />
    <Oblik d={kutija(-w / 2, -h / 2, w, h, 8)} boja={P.belo} debljina={4} tekstura={0.18} />
    {children}
  </g>
);
