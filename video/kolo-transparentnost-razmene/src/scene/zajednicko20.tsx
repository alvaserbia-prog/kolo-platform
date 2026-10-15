// Zajedničko za scene videa 20: soba sa foteljom (položaj), krupna oglasna tabla sa sveskom uprave i
// sveskama stanara, ograda dvorišta.
import React from "react";
import { P } from "../paleta";
import { Hrapavo, Oblik, kutija } from "../alat";
import { OglasnaTabla, Rajsnegla, SveskaKase } from "../zgrada";
import { LicnaSveska } from "../razmena";

/** Tamnija soba sa tapetom (scena 1). */
export const Soba: React.FC = () => (
  <Hrapavo>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#C9B48E" />
    <rect x={-200} y={-200} width={1480} height={2400} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d={`M${-100 + i * 110},-200 L${-100 + i * 110},1180`} stroke="#A8916B" strokeWidth={14} opacity={0.35} />
    ))}
    <rect x={-200} y={1180} width={1480} height={1000} fill="#6B4A32" />
    <rect x={-200} y={1170} width={1480} height={20} fill="#4A3020" />
  </Hrapavo>
);

/** Krupna tabla: sveska uprave (Đurina sveska kase) gore, tri sveske stanara ispod. */
export const SVESKE_STANARA = [
  { natpis: "stan 1", x: 205, boja: "#7A5A3A" },
  { natpis: "stan 4", x: 540, boja: "#5E7F5A" },
  { natpis: "stan 7", x: 875, boja: "#8C4A4A" },
];
export const TABLA20 = { x: 30, y: 300, w: 1020, h: 980 };
export const SVESKA_UPRAVE = { x: 540, y: 600, s: 0.78 };
export const RED_STANARA = 1050;

export const TablaSaSveskama: React.FC<{ otvor?: number[]; isticanjeUprave?: [number, number][]; isticanjeStanara?: number[]; zbir?: number }> = ({
  otvor = [1, 1, 1],
  isticanjeUprave = [],
  isticanjeStanara = [0, 0, 0],
  zbir = 1,
}) => (
  <g>
    <Hrapavo>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#EFE3C4" />
      <rect x={-200} y={1300} width={1480} height={900} fill="#7C8B6A" />
    </Hrapavo>
    <g transform={`translate(${TABLA20.x} ${TABLA20.y})`}>
      <OglasnaTabla w={TABLA20.w} h={TABLA20.h} svetlo={1} />
    </g>
    <g transform={`translate(${SVESKA_UPRAVE.x} ${SVESKA_UPRAVE.y}) scale(${SVESKA_UPRAVE.s})`}>
      <SveskaKase zbir={zbir} isticanje={isticanjeUprave} />
      {[-360, 360].map((x) => (
        <g key={x} transform={`translate(${x} -240) scale(1.4)`}>
          <Rajsnegla boja={x < 0 ? P.ajvar : P.plava} />
        </g>
      ))}
    </g>
    {SVESKE_STANARA.map((s, i) => (
      <g key={i} transform={`translate(${s.x} ${RED_STANARA}) scale(0.62)`}>
        <LicnaSveska natpis={s.natpis} boja={s.boja} otvor={otvor[i]} isticanje={isticanjeStanara[i]} />
        <g transform="translate(0 -96) scale(1.2)">
          <Rajsnegla boja={i === 1 ? P.oker : P.ajvar} />
        </g>
      </g>
    ))}
  </g>
);

/** Ograda od letava između dva dvorišta; donja ivica na y. */
export const Ograda: React.FC<{ y: number; x0?: number; x1?: number; h?: number }> = ({ y, x0 = -40, x1 = 1120, h = 230 }) => (
  <g>
    <Oblik d={kutija(x0, y - h * 0.75, x1 - x0, 24, 4)} boja={P.drvo} debljina={3.5} tekstura={0.3} />
    <Oblik d={kutija(x0, y - h * 0.3, x1 - x0, 24, 4)} boja={P.drvo} debljina={3.5} tekstura={0.3} />
    {Array.from({ length: Math.ceil((x1 - x0) / 70) }, (_, i) => (
      <Oblik key={i} d={`M${x0 + i * 70 + 10},${y} L${x0 + i * 70 + 10},${y - h + 20} L${x0 + i * 70 + 32},${y - h} L${x0 + i * 70 + 54},${y - h + 20} L${x0 + i * 70 + 54},${y}Z`} boja={P.drvoSvetlo} debljina={3.5} tekstura={0.3} />
    ))}
  </g>
);
