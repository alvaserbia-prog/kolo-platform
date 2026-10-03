// Scena 7 — „Dejan nije morao da troši novac. Ti dinari su mu ostali za nešto drugo.“
// Dejanov novčanik ostaje zatvoren, dinari u njemu (ušteda kao dinari koji su ostali kod kuće,
// nikad kao preračun POEN-a). Na „ostali“ novčanik se otvori i dinari se pretvore u ono drugo:
// sveske za školu, lopta i karte za bioskop za decu.
import React from "react";
import { interpolate } from "remotion";
import { P, tamnije } from "../paleta";
import { SANS } from "../fontovi";
import { napredak, useF, usePop } from "../iso";
import { kad, trajanjeF } from "../vreme";

const Novcanica: React.FC<{ rot?: number }> = ({ rot = 0 }) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-80} y={-40} width={160} height={80} rx={6} fill={P.dinar} stroke={P.dinarTamni} strokeWidth={3} />
    <circle cx={-36} cy={0} r={22} fill="none" stroke={P.dinarTamni} strokeWidth={3} />
    <text x={34} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={28} fill={P.dinarTamni}>DIN</text>
  </g>
);

const Sveske = () => (
  <g>
    <rect x={-50} y={-66} width={100} height={130} rx={6} fill={P.plava} stroke={tamnije(P.plava, 0.4)} strokeWidth={3} />
    <rect x={-40} y={-76} width={100} height={130} rx={6} fill={P.zuta} stroke={tamnije(P.zuta, 0.4)} strokeWidth={3} />
    <rect x={-20} y={-50} width={60} height={22} rx={3} fill="#fff" />
  </g>
);
const Lopta = () => (
  <g>
    <circle r={58} fill="#fff" stroke={P.mastilo} strokeWidth={4} />
    <path d="M0,-22 l20,14 l-8,24 l-24,0 l-8,-24 Z" fill={P.mastilo} />
    <path d="M0,-22 L0,-58 M20,-8 L52,-20 M12,16 L32,46 M-12,16 L-32,46 M-20,-8 L-52,-20" stroke={P.mastilo} strokeWidth={3} />
  </g>
);
const Karte = () => (
  <g>
    {[-14, 14].map((r, i) => (
      <g key={i} transform={`rotate(${r}) translate(${i * 30 - 15},0)`}>
        <rect x={-50} y={-30} width={100} height={60} rx={8} fill={P.crvena} stroke={tamnije(P.crvena, 0.4)} strokeWidth={3} />
        <circle cx={-50} cy={0} r={10} fill={P.pozadina} />
        <circle cx={50} cy={0} r={10} fill={P.pozadina} />
        <text x={0} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill="#fff">BIOSKOP</text>
      </g>
    ))}
  </g>
);

export const Scena7: React.FC = () => {
  const f = useF();
  const kraj = trajanjeF(7);
  const fNovac = kad(7, "novac");
  const fOstali = kad(7, "ostali");
  const fDrugo = kad(7, "drugo");
  const otvori = napredak(f, fOstali - 6, fOstali + 6);
  const kljuc = usePop(fNovac - 2);
  const stvari = [usePop(fDrugo - 6), usePop(fDrugo), usePop(fDrugo + 6)];
  const lebdi = Math.sin(f / 9) * 6;
  const zum = interpolate(f, [0, kraj], [1, 1.06]);
  return (
    <g>
      <rect width={1080} height={1920} fill={P.pozadina} />
      <circle cx={540} cy={760} r={420} fill={P.zelena100} />
      <g transform={`translate(540,800) scale(${zum})`}>
        {/* novčanice u novčaniku */}
        {[0, 1, 2].map((i) => {
          const p = napredak(f, fOstali + i * 4, fOstali + 18 + i * 4);
          const cilj = [[-300, -420], [0, -500], [300, -420]][i];
          return (
            <g key={i} transform={`translate(${interpolate(p, [0, 1], [-20 + i * 20, cilj[0]])},${interpolate(p, [0, 1], [-70 - i * 12 - otvori * 50, cilj[1]])}) scale(${1 - p})`} opacity={1 - p}>
              <Novcanica rot={-8 + i * 8} />
            </g>
          );
        })}
        {/* novčanik */}
        <rect x={-240} y={-90} width={480} height={250} rx={34} fill="#8E5B3A" stroke="#5A3721" strokeWidth={5} />
        <path d={`M-240,${-60 - otvori * 90} Q0,${-130 - otvori * 120} 240,${-60 - otvori * 90} L240,10 L-240,10 Z`} fill="#A86E48" stroke="#5A3721" strokeWidth={5} />
        <rect x={150} y={-40} width={110} height={70} rx={20} fill="#A86E48" stroke="#5A3721" strokeWidth={5} />
        <circle cx={220} cy={-5} r={12} fill={P.zuta} stroke="#5A3721" strokeWidth={3} />
        {/* „nije morao da troši“: zeleni znak da su dinari tu */}
        <g transform={`translate(-170,120) scale(${kljuc * (1 - otvori)})`}>
          <circle r={48} fill={P.zelena500} />
          <path d="M-20,0 l14,16 l28,-32" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      {/* ono drugo */}
      {[<Sveske key="s" />, <Lopta key="l" />, <Karte key="k" />].map((x, i) => (
        <g key={i} transform={`translate(${[240, 540, 840][i]},${[380, 300, 380][i] + lebdi * (i % 2 ? 1 : -1)}) scale(${stvari[i] * 1.2})`}>
          {x}
        </g>
      ))}
    </g>
  );
};
