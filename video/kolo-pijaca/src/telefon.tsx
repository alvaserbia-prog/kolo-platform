// Telefon sa stranicom ekolo.rs (pojednostavljen prikaz, bez preslikavanja stvarnog ekrana).
import React from "react";
import { P } from "./paleta";
import { SANS } from "./fontovi";

export const Telefon: React.FC<{ children?: React.ReactNode; s?: number }> = ({ children, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-190} y={-370} width={380} height={740} rx={54} fill={P.mastilo} filter="url(#senkaMeka)" />
    <rect x={-172} y={-350} width={344} height={700} rx={40} fill={P.krem} />
    <rect x={-50} y={-340} width={100} height={18} rx={9} fill={P.mastilo} />
    <clipPath id="ekran">
      <rect x={-172} y={-350} width={344} height={700} rx={40} />
    </clipPath>
    <g clipPath="url(#ekran)">
      <rect x={-172} y={-350} width={344} height={110} fill={P.zelena700} />
      <text x={0} y={-272} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={48} fill="#fff">ekolo.rs</text>
      {children}
    </g>
  </g>
);

export const Dugme: React.FC<{ tekst: string; y: number; pritisak?: number; boja?: string }> = ({ tekst, y, pritisak = 0, boja = P.zelena500 }) => (
  <g transform={`translate(0,${y}) scale(${1 - 0.08 * pritisak})`}>
    <rect x={-130} y={-36} width={260} height={72} rx={36} fill={boja} />
    <text x={0} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} fill="#fff">{tekst}</text>
  </g>
);

/** Prst koji dodiruje ekran (krug koji se širi). */
export const Dodir: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) =>
  p > 0 && p < 1 ? <circle cx={x} cy={y} r={20 + 40 * p} fill="none" stroke={P.zelena500} strokeWidth={6} opacity={1 - p} /> : null;
