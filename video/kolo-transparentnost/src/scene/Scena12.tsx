// Scena 12 — „Svaki upisani POEN vidljiv je svima na platformi.“
// Račun direktora sa svim upisima. Na „svima“ oko telefona se pojave još tri ruke sa telefonima na istom
// računu: drugi članovi gledaju direktorov zapis (prijavljeni članovi, ne ceo internet).
import React from "react";
import { Kadar, napredak, useF, usePop } from "../alat";
import { EkranSistem, SakaSaTelefonom, VelikiTelefon } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina, TEL } from "./kolo";

const DRUGI = [
  { x: 170, y: 520, r: -14, rukav: P.roze, koza: P.koza },
  { x: 910, y: 560, r: 12, rukav: P.oker, koza: P.koza2 },
  { x: 880, y: 1130, r: 18, rukav: P.plava, koza: P.koza },
];

export const Scena12: React.FC = () => {
  const f = useF();
  const kS = kad(12, "svima");
  const kU = kad(12, "upisani");
  const redova = 6;
  const z = napredak(f, kS - 6, 16);
  const pops = [usePop(kS - 4), usePop(kS + 2), usePop(kS + 8)];
  return (
    <Kadar>
      <KoloPozadina />
      {DRUGI.map((d, i) => (
        <g key={i} transform={`translate(${d.x} ${d.y + (1 - Math.min(1, pops[i])) * 500}) rotate(${d.r}) scale(${0.42 * Math.max(0, pops[i])})`} opacity={f >= kS - 4 + i * 6 ? 1 : 0}>
          <g transform="translate(0 330)">
            <SakaSaTelefonom rukav={d.rukav} koza={d.koza} />
          </g>
          <VelikiTelefon>
            <EkranSistem redova={redova} />
          </VelikiTelefon>
        </g>
      ))}
      <g transform={`translate(${TEL.x} ${TEL.y}) scale(${TEL.s * (1 - z * 0.12)})`}>
        <VelikiTelefon>
          <EkranSistem redova={redova} novi={1 - napredak(f, kU, 20)} />
        </VelikiTelefon>
      </g>
    </Kadar>
  );
};
