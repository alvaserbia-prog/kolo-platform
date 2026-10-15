// Scena 5 — „Ako tražimo da računi uprave budu otvoreni, onda i naši moraju biti otvoreni.“
// Ulaz: na tabli otvorena sveska kase (uprava). Ispred table tri stanara, svako drži svoju zatvorenu svesku
// („stan 1“, „stan 4“, „stan 7“). Na „uprave“ sveska na tabli zasvetli; na „naši“ stanari se pogledaju; na
// drugom „otvoreni“ sve tri sveske se otvore.
import React from "react";
import { Kadar, Kamera, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { BAKA, STANAR, STANARKA } from "../zgrada";
import { LicnaSveska } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";
import { SVESKA_NA_TABLI, UlazSaTablom } from "./zajednicko";
import { SVESKE_STANARA } from "./zajednicko20";

const LJUDI = [STANARKA, STANAR, BAKA];

export const Scena5: React.FC = () => {
  const f = useF();
  const kU = kad(5, "uprave");
  const kN = kad(5, "naši");
  const kO = kad(5, "otvoreni", 2);
  const sjaj = napredak(f, kU - 4, 10) * (1 - napredak(f, kN, 16));
  const otvor = (i: number) => napredak(f, kO - 8 + i * 4, 14);
  const gleda = (i: number): [number, number] => (f > kN && f < kO ? [i === 0 ? 7 : -7, 0] : [0, -6]);
  return (
    <Kadar>
      <Kamera x={540} y={880} z={1.04}>
        <UlazSaTablom sveska={1} svetlo={1} vrata={false} />
        <circle cx={SVESKA_NA_TABLI.x} cy={SVESKA_NA_TABLI.y} r={300} fill={P.zlatna} opacity={0.3 * sjaj} filter="url(#sjaj)" />
        {LJUDI.map((l, i) => (
          <Lik key={i} x={SVESKE_STANARA[i].x} y={1420} s={0.72} okreni={i === 2} {...l} glava={{ ...l.glava, izraz: f > kO ? "osmeh" : "mirna", pogled: gleda(i) }} lr={[-20, -60]} dr={[20, 60]} />
        ))}
        {SVESKE_STANARA.map((s, i) => (
          <g key={i} transform={`translate(${s.x} 1120) scale(${0.5 + otvor(i) * 0.08})`}>
            <LicnaSveska natpis={s.natpis} boja={s.boja} otvor={otvor(i)} />
          </g>
        ))}
      </Kamera>
    </Kadar>
  );
};
