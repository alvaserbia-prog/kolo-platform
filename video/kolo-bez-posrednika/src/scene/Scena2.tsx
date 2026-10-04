// Scena 2 — „Prvo ti od plate skinu poreze i doprinose.“
// Platni listić: traka „zarada“ je puna; na „poreze“ i „doprinose“ iz nje se odseče deo,
// upiše se crveni red, a traka „na račun“ ostane kraća. Bez iznosa: vidi se samo koliko ode.
import React from "react";
import { P } from "../paleta";
import { NASLOV, SANS } from "../fontovi";
import { Hrapavo, Kadar, napredak, useF } from "../alat";
import { kad } from "../vreme";
import { List, Soba } from "./zajednicko";

export const Scena2: React.FC = () => {
  const f = useF();
  const p1 = napredak(f, kad(2, "poreze"), 14);
  const p2 = napredak(f, kad(2, "doprinose."), 14);
  const W = 460;
  const ostaje = 1 - 0.2 * p1 - 0.19 * p2;
  const red = (y: number, tekst: string, boja: string, sirina: number, p = 1) => (
    <g opacity={p} transform={`translate(${(1 - p) * 30} 0)`}>
      <text x={-260} y={y} fontFamily={SANS} fontWeight={800} fontSize={36} fill={boja}>
        {tekst}
      </text>
      <rect x={-260} y={y + 18} width={W * sirina} height={34} rx={6} fill={boja === P.ajvar ? P.ajvar : P.zlatna} stroke={P.mastilo} strokeWidth={3} />
    </g>
  );
  return (
    <Kadar>
      <Hrapavo>
        <Soba />
      </Hrapavo>
      <g transform="translate(390 820)">
        <List w={600} h={820} rot={-2}>
          <text x={0} y={-320} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={54} fill={P.mastilo}>
            Platni listić
          </text>
          <line x1={-270} y1={-290} x2={270} y2={-290} stroke={P.mastilo} strokeWidth={3} opacity={0.5} />
          {red(-230, "Zarada", P.mastilo, 1)}
          {red(-110, "− porez", P.ajvar, 0.2, p1)}
          {red(10, "− doprinosi", P.ajvar, 0.19, p2)}
          <line x1={-270} y1={110} x2={270} y2={110} stroke={P.mastilo} strokeWidth={3} opacity={0.5} />
          {red(170, "Na račun", P.mastilo, ostaje)}
        </List>
      </g>
    </Kadar>
  );
};
