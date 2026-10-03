// Scena 8 — „Sada više ne kupuje industrijski džem. Zna gde u svom kraju nalazi domaći pekmez, u razmeni.“
// Polica prodavnice sa fabričkim džemom se udaljava i bledi. Na „Zna“ pojavi se mala karta okoline:
// zelena nit od Sombora do Čonoplje; na „domaći“ na Čonoplji uskoči Radina tegla, a na „razmeni“
// pored nje Dejanova sijalica, jer se i on ima čime razmeniti.
import React from "react";
import { interpolate } from "remotion";
import { P, tamnije } from "../paleta";
import { SANS } from "../fontovi";
import { Dzem, Kocka, Tegla, iso, napredak, useF, usePop } from "../iso";
import { Sijalica } from "../svet";
import { kad } from "../vreme";

const MESTA = [
  { ime: "Sombor", x: 0, y: 0, glavno: true },
  { ime: "Čonoplja", x: 380, y: -260, glavno: true },
  { ime: "Stanišić", x: -320, y: -300 },
  { ime: "Apatin", x: -120, y: 360 },
  { ime: "Gakovo", x: -360, y: 40 },
  { ime: "Kljajićevo", x: 360, y: 120 },
];

export const Scena8: React.FC = () => {
  const f = useF();
  const fDzem = kad(8, "džem");
  const fZna = kad(8, "zna");
  const fDomaci = kad(8, "domaći");
  const fRazmeni = kad(8, "razmeni");
  const odlazi = napredak(f, fDzem - 8, fZna);
  const karta = napredak(f, fZna - 6, fZna + 8);
  const nit = napredak(f, fZna + 4, fDomaci, (x) => x);
  const tegla = usePop(fDomaci);
  const sijalica = usePop(fRazmeni);
  const crta = napredak(f, fDzem - 2, fDzem + 8);
  return (
    <g>
      <rect width={1080} height={1920} fill={P.pozadina} />
      {/* polica prodavnice */}
      {odlazi < 1 && (
        <g transform={`translate(${540 - odlazi * 300},${700 - odlazi * 200}) scale(${1.4 - odlazi * 0.9})`} opacity={1 - odlazi}>
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <Kocka x={-200} y={-60} z={r * 110} w={400} d={60} h={12} boja="#BDC3C7" />
              {Array.from({ length: 7 }, (_, k) => {
                const [sx, sy] = iso(-180 + k * 56, -30, r * 110 + 12);
                return (
                  <g key={k} transform={`translate(${sx},${sy})`}>
                    <Dzem s={0.75} />
                  </g>
                );
              })}
            </g>
          ))}
          <path d="M-260,-260 L260,120 M260,-260 L-260,120" stroke={P.crvena} strokeWidth={22} strokeLinecap="round" opacity={crta * 0.9} />
        </g>
      )}
      {/* karta okoline */}
      {karta > 0 && (
        <g transform={`translate(460,800) scale(${0.85 + 0.15 * karta})`} opacity={karta}>
          <path d="M-520,-480 L540,-480 L560,470 L-500,500 Z" fill="#DCEFC8" stroke={tamnije("#DCEFC8", 0.3)} strokeWidth={4} />
          <path d="M-520,300 Q-200,200 -60,420 Q60,520 120,500" stroke="#9FD3E6" strokeWidth={30} fill="none" strokeLinecap="round" />
          {MESTA.map((m) => (
            <g key={m.ime} transform={`translate(${m.x},${m.y})`}>
              <circle r={m.glavno ? 22 : 13} fill={m.glavno ? P.zelena500 : "#fff"} stroke={P.mastilo} strokeWidth={4} />
              <text y={m.glavno ? 72 : 52} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={m.glavno ? 52 : 36} fill={P.mastilo}>{m.ime}</text>
            </g>
          ))}
          <path d="M0,0 Q260,-60 380,-260" stroke={P.zelena500} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${nit} 1`} />
          <g transform={`translate(380,-290) scale(${tegla * 1.7})`}>
            <Tegla />
          </g>
          <g transform={`translate(-10,-40) scale(${sijalica * 1.3})`}>
            <Sijalica svetli={1} />
          </g>
        </g>
      )}
      <g opacity={interpolate(f, [0, 10], [0, 1])} />
    </g>
  );
};
