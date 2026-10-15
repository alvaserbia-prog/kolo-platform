// Scena 5 — „Ako tražimo da računi uprave budu otvoreni, onda i naši moraju biti otvoreni.“
// Seljani u redu, svako sa svojim malim drvenim sandukom pred nogama i fenjerom u ruci; iza njih upravnik i
// stakleni sanduk. Na „uprave“ zajednički sanduk zasvetli; na drugom „otvoreni“ sanduci seljana jedan za drugim
// postanu stakleni.
import React from "react";
import { Kadar, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { Mrak, Nebo, Postolje, Sanduk, Trg } from "../noc";
import { kad } from "../vreme";
import { SELJANI, SaFenjerom, UPRAVNIK, plamen } from "./svet";

const RED = [150, 410, 670, 930];
const Y = 1380;
const S = 0.56;

export const Scena5: React.FC = () => {
  const f = useF();
  const kU = kad(5, "uprave");
  const kO = kad(5, "otvoreni", 2);
  const sjaj = napredak(f, kU - 4, 10);
  const staklo = (i: number) => napredak(f, kO - 10 + i * 6, 12);
  const fenjeri = RED.map((x, i) => ({ tx: x + (i < 2 ? 95 : -95), ty: Y - 330 * S }));
  const svetla = [{ x: 540, y: 880, r: 330 + 60 * sjaj }, ...fenjeri.map((p) => plamen(p.tx, p.ty, 0.75, 280))];
  return (
    <Kadar>
      <Nebo />
      <Trg y={1060} />
      <g transform="translate(540 960)">
        <Postolje h={120} w={380} />
      </g>
      <Lik x={450} y={960} s={0.42} {...UPRAVNIK} glava={{ ...UPRAVNIK.glava, izraz: "mirna" }} />
      <g transform="translate(610 960)">
        <Sanduk s={0.42} staklo={1} />
      </g>
      {RED.map((x, i) => (
        <g key={i}>
          <SaFenjerom p={SELJANI[i]} x={x} y={Y} s={S} tx={fenjeri[i].tx} ty={fenjeri[i].ty} f={f + i * 6} okreni={i >= 2} izraz={staklo(i) > 0.5 ? "osmeh" : "zamisljena"} pogled={[0, 5]} fs={0.75} />
          <g transform={`translate(${x + (i < 2 ? -70 : 70)} ${Y - 10})`}>
            <Sanduk s={0.36} staklo={staklo(i)} svezak={true} pun={0.5} />
          </g>
        </g>
      ))}
      <Mrak id="s5" svetla={svetla} jacina={0.78} />
    </Kadar>
  );
};
