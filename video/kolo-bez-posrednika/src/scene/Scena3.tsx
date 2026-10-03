// Scena 3 — „Banka uzme za vođenje računa i proviziju na svaku uplatu, pa i kad pošalješ novac
// deci, supružniku, roditelju.“ Zgrada banke sa stubovima; na „računa“ i „proviziju“ sa nje
// vise cedulje. Na „deci“, „supružniku“, „roditelju“ uskoči po jedan primalac sa kovertom,
// a od koverte se svaki put otkine ugao koji ode banci.
import React from "react";
import { P } from "../paleta";
import { NASLOV } from "../fontovi";
import { Hrapavo, Kadar, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { KOMSINICA, Lik, SIN } from "../likovi";
import { DEDA } from "../kolo";
import { kad } from "../vreme";
import { Cedulja, Soba, Strelica } from "./zajednicko";

export const Koverta: React.FC<{ s?: number; otkinuto?: number }> = ({ s = 1, otkinuto = 0 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-70, -46, 140, 92, 6)} boja={P.belo} debljina={4} tekstura={0.15} />
    <path d="M-70,-46 L0,8 L70,-46" fill="none" stroke={P.mastilo} strokeWidth={3.5} />
    {otkinuto > 0 && <path d={`M${70 - 34 * otkinuto},46 L70,46 L70,${46 - 34 * otkinuto}Z`} fill={P.zid} stroke={P.ajvar} strokeWidth={3} />}
  </g>
);

const Banka: React.FC = () => (
  <g>
    <Oblik d="M-360,-140 L0,-300 L360,-140Z" boja="#B9BEB8" />
    <Oblik d={kutija(-380, -140, 760, 40, 4)} boja="#A5ABA5" />
    {[-290, -150, -10, 130, 270].map((x) => (
      <g key={x}>
        <Oblik d={kutija(x, -100, 40, 360, 6)} boja="#D6D9D2" debljina={3.5} />
      </g>
    ))}
    <Oblik d={kutija(-400, 260, 800, 46, 4)} boja="#A5ABA5" />
    <Oblik d={kutija(-80, 60, 160, 200, 8)} boja={P.teget} />
    <text y={-170} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={70} fill={P.mastilo} letterSpacing={6}>
      BANKA
    </text>
  </g>
);

export const Scena3: React.FC = () => {
  const f = useF();
  const kRac = kad(3, "računa");
  const kProv = kad(3, "proviziju");
  const prim = [
    { rec: "deci,", x: 150, p: SIN, dete: true },
    { rec: "supružniku,", x: 380, p: KOMSINICA, dete: false },
    { rec: "roditelju.", x: 600, p: DEDA, dete: false },
  ];
  return (
    <Kadar>
      <Hrapavo>
        <Soba zid="#BFC8C9" />
        <g transform="translate(470 600) scale(0.92)">
          <Banka />
        </g>
      </Hrapavo>
      <Pop at={kRac - 2} x={250} y={930} rot={-4}>
        <Cedulja tekst="vođenje računa" sirina={360} velicina={36} boja={P.ajvar} />
      </Pop>
      <Pop at={kProv - 2} x={690} y={930} rot={4}>
        <Cedulja tekst="provizija" sirina={260} velicina={36} boja={P.ajvar} />
      </Pop>
      {prim.map((r, i) => {
        const k = kad(3, r.rec);
        if (f < k - 4) return null;
        const otk = napredak(f, k + 8, 12);
        return (
          <g key={i}>
            <Pop at={k - 4} x={r.x} y={1300} odozdo={60}>
              <Lik x={0} y={0} s={r.dete ? 0.85 : 0.55} dete={r.dete} {...(r.p as any)} glava={{ ...(r.p as any).glava, izraz: "mirna" }} lr={[10, 10]} dr={[150, 10]} />
              <g transform={`translate(30 ${r.dete ? -520 : -470})`}>
                <Koverta s={0.8} otkinuto={otk} />
              </g>
            </Pop>
            <Strelica x1={r.x + 70} y1={1300 - (r.dete ? 560 : 510)} x2={470 + (i - 1) * 60} y2={880} luk={-60} napredak={napredak(f, k + 6, 14)} boja={P.ajvar} debljina={4} />
          </g>
        );
      })}
    </Kadar>
  );
};
