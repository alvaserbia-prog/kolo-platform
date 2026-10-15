// Scena 9 — „To se zove transparentnost razmene.“ Isti spisak razmena na telefonu u sredini; oko njega
// uskoče još tri ruke sa telefonima na istom spisku: svi potvrđeni članovi vide isto.
import React from "react";
import { Kadar, useF, usePop } from "../alat";
import { SakaSaTelefonom, VelikiTelefon } from "../zgrada";
import { Ekran, RAZMENE } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina, TEL } from "./kolo";

const DRUGI = [
  { x: 170, y: 520, r: -14, rukav: P.roze, koza: P.koza },
  { x: 910, y: 560, r: 12, rukav: P.oker, koza: P.koza2 },
  { x: 880, y: 1130, r: 18, rukav: P.zelenaPrigusena, koza: P.koza },
  { x: 190, y: 1120, r: -16, rukav: P.ajvar, koza: P.koza2 },
];

export const Scena9: React.FC = () => {
  const f = useF();
  const kT = kad(9, "transparentnost");
  const pops = DRUGI.map((_, i) => usePop(kT - 12 + i * 5));
  return (
    <Kadar>
      <KoloPozadina />
      {DRUGI.map((d, i) => (
        <g key={i} transform={`translate(${d.x} ${d.y + (1 - Math.min(1, pops[i])) * 500}) rotate(${d.r}) scale(${0.4 * Math.max(0, pops[i])})`} opacity={f >= kT - 12 + i * 5 ? 1 : 0}>
          <g transform="translate(0 330)">
            <SakaSaTelefonom rukav={d.rukav} koza={d.koza} />
          </g>
          <VelikiTelefon>
            <Ekran id={`r9-${i}`} naslov="Razmene" podnaslov="obavljene, sa osnovom" bezZnaka redovi={RAZMENE} potvrden={1} />
          </VelikiTelefon>
        </g>
      ))}
      <g transform={`translate(${TEL.x} ${TEL.y}) scale(${TEL.s * 0.92})`}>
        <g transform="translate(0 330)">
          <SakaSaTelefonom rukav={P.plava} />
        </g>
        <VelikiTelefon>
          <Ekran id="r9" naslov="Razmene" podnaslov="obavljene, sa osnovom" bezZnaka redovi={RAZMENE} potvrden={1} />
        </VelikiTelefon>
      </g>
    </Kadar>
  );
};
