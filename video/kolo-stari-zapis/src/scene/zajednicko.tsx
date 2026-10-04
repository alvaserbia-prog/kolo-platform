// Zajedničko za scene videa 17: strelica, cedulja sa natpisom, precrtavanje, list papira.
import React from "react";
import { P } from "../paleta";
import { SANS, RUKOPIS } from "../fontovi";
import { Linija, Oblik, kutija } from "../alat";

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
