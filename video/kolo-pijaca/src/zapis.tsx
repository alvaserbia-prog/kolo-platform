// Zapis u KOLU: sveska sa redom „ko → kome · POEN“ i zelenim pečatom UPISANO. POEN je samo zapis,
// nikad novčić ni novčanica, i bez iznosa.
import React from "react";
import { P } from "./paleta";
import { SANS } from "./fontovi";

export const Zapis: React.FC<{ od: string; ka: string; pero: number; pecat: number }> = ({ od, ka, pero, pecat }) => (
  <g>
    <rect x={-330} y={-150} width={660} height={300} rx={20} fill={P.krem} stroke={P.mastilo} strokeWidth={5} filter="url(#senkaMeka)" />
    <line x1={0} y1={-150} x2={0} y2={150} stroke="#D9C9A8" strokeWidth={3} />
    <text x={-300} y={-92} fontFamily={SANS} fontWeight={900} fontSize={40} fill={P.mastiloSvetlo}>Zapis u KOLU</text>
    {[-40, 30, 100].map((y) => (
      <line key={y} x1={-300} x2={300} y1={y} y2={y} stroke="#E6D8BC" strokeWidth={2} />
    ))}
    <clipPath id="pero">
      <rect x={-310} y={-60} width={620 * pero} height={80} />
    </clipPath>
    <text x={-300} y={8} fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.mastilo} clipPath="url(#pero)">
      {od} → {ka} · POEN
    </text>
    {pecat > 0 && (
      <g transform={`translate(170,78) rotate(-10) scale(${1.6 - 0.6 * pecat})`} opacity={pecat}>
        <rect x={-110} y={-30} width={220} height={60} rx={10} fill="none" stroke={P.zelena500} strokeWidth={6} />
        <text x={0} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={36} letterSpacing={3} fill={P.zelena500}>UPISANO</text>
      </g>
    )}
  </g>
);
