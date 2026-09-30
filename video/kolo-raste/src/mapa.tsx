// Stara karta Sombora i okoline (Dunav, sela, putevi) — preuzeta iz videa „Domaćice“, bez kartuše
// (vrh kadra ovde drži natpis scene).
import React from "react";
import { P } from "./paleta";
import { NASLOV, SERIF } from "./fontovi";
import { Linija, Oblik, elipsa } from "./alat";

export const X = (lon: number) => 540 + (lon - 19.15) * 1394;
export const Y = (lat: number) => 950 - (lat - 45.79) * 2000;

export const MESTA: [string, number, number][] = [
  ["Bezdan", 45.853, 18.938],
  ["Apatin", 45.671, 18.985],
  ["Stanišić", 45.938, 19.166],
  ["Riđica", 45.99, 19.103],
  ["Čonoplja", 45.807, 19.27],
  ["Kljajićevo", 45.772, 19.283],
  ["Telečka", 45.79, 19.43],
  ["Gakovo", 45.9, 19.063],
  ["Kolut", 45.897, 18.928],
  ["Bački Monoštor", 45.797, 18.937],
  ["Doroslovo", 45.607, 19.187],
  ["Svetozar Miletić", 45.849, 19.217],
  ["Aleksa Šantić", 45.935, 19.33],
  ["Prigrevica", 45.678, 19.09],
];
export const SOMBOR: [number, number] = [X(19.112), Y(45.774)];
// tačke KOLA: sela + nekoliko u Somboru
export const TACKE: [number, number][] = [
  ...MESTA.map(([, la, lo]): [number, number] => [X(lo), Y(la)]),
  [SOMBOR[0] - 34, SOMBOR[1] - 20],
  [SOMBOR[0] + 30, SOMBOR[1] - 36],
  [SOMBOR[0] + 44, SOMBOR[1] + 26],
  [SOMBOR[0] - 20, SOMBOR[1] + 40],
  [SOMBOR[0] + 6, SOMBOR[1] + 4],
];

export const Karta: React.FC<{ f: number; crtanje: number }> = ({ f, crtanje }) => (
  <g>
    <rect x={-200} y={-200} width={1500} height={2400} fill="#EFE0B9" />
    {/* polja */}
    {[
      [200, 700, 160, 90, P.trava],
      [760, 640, 200, 110, P.oker],
      [380, 1150, 220, 100, P.trava],
      [860, 1120, 160, 120, P.tursija],
      [620, 820, 120, 70, P.oker],
      [300, 520, 140, 70, P.tursija],
    ].map(([x, y, w, h, c], i) => (
      <path key={i} d={elipsa(x as number, y as number, w as number, h as number)} fill={c as string} opacity={0.28} />
    ))}
    <rect x={-200} y={-200} width={1500} height={2400} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
    {/* Dunav */}
    <path d="M150,380 C190,520 120,640 170,760 C220,880 150,1000 200,1120 C240,1230 180,1330 230,1480" fill="none" stroke="#7FA6B5" strokeWidth={34} strokeLinecap="round" />
    <path d="M150,380 C190,520 120,640 170,760 C220,880 150,1000 200,1120 C240,1230 180,1330 230,1480" fill="none" stroke={P.mastilo} strokeWidth={2} strokeDasharray="2 10" opacity={0.5} />
    <text x={118} y={1060} fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={30} fill={P.plava} transform="rotate(-78 118 1060)">
      Dunav
    </text>
    {/* putevi iz Sombora */}
    {MESTA.map(([ime, la, lo], i) => (
      <Linija key={ime} d={`M${SOMBOR[0]},${SOMBOR[1]} Q${(SOMBOR[0] + X(lo)) / 2 + (i % 2 ? 20 : -20)},${(SOMBOR[1] + Y(la)) / 2} ${X(lo)},${Y(la)}`} boja={P.drvo} debljina={4} napredak={crtanje} opacity={0.7} />
    ))}
    {/* sela */}
    {MESTA.map(([ime, la, lo], i) => (
      <g key={ime} transform={`translate(${X(lo)} ${Y(la)})`} opacity={Math.min(1, Math.max(0, crtanje * 1.6 - i * 0.04))}>
        <path d="M-14,0 L-14,-18 L0,-30 L14,-18 L14,0Z" fill={P.zid} stroke={P.mastilo} strokeWidth={2.5} />
        <path d="M-18,-16 L0,-34 L18,-16" fill="none" stroke={P.crep} strokeWidth={5} />
        <text x={0} y={34} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={25} fill={P.mastilo}>
          {ime}
        </text>
      </g>
    ))}
    {/* Sombor */}
    <g transform={`translate(${SOMBOR[0]} ${SOMBOR[1]})`}>
      <Oblik d={elipsa(0, 0, 78, 60)} boja={P.zidZuti} opacity={0.55} ivica={P.mastilo} debljina={2.5} />
      <path d="M-10,-6 L-10,-62 L0,-86 L10,-62 L10,-6Z" fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
      <path d="M-30,-6 L-30,-34 L-16,-44 L-2,-34 L-2,-6Z" fill={P.zid} stroke={P.mastilo} strokeWidth={2.5} />
      <path d="M8,-6 L8,-30 L24,-40 L40,-30 L40,-6Z" fill={P.zid} stroke={P.mastilo} strokeWidth={2.5} />
      <text x={0} y={92} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={44} fill={P.mastilo} letterSpacing={3}>
        SOMBOR
      </text>
    </g>
    {/* ruža vetrova */}
    <g transform="translate(900 1300) rotate(8)" opacity={0.8}>
      <path d="M0,-70 L12,0 L0,70 L-12,0Z" fill={P.ajvar} stroke={P.mastilo} strokeWidth={2.5} />
      <path d="M-70,0 L0,-12 L70,0 L0,12Z" fill={P.krem} stroke={P.mastilo} strokeWidth={2.5} />
      <text y={-80} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} fill={P.mastilo}>
        S
      </text>
    </g>
  </g>
);

