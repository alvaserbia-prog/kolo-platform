// Scena 7 — „Carstvo Inka imalo je milione stanovnika i gotovo da nije koristilo novac. Sve se vodilo kroz zapise.“
// Mapa Južne Amerike, carstvo uz Ande obojeno. Na „milione stanovnika“ niz carstvo niknu sela. Na „novac“
// pored mape uskoči novčić, pa izbledi i ode u stranu. Na „zapise“ kipui uskoče na sela i glasnik trči
// putem duž Anda.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Hrapavo, Kadar, Linija, Oblik, Pop, napredak, useF } from "../alat";
import { Kipu, Novcic } from "../drevno";
import { kad } from "../vreme";
import { P } from "../paleta";
import { SERIF } from "../fontovi";

const KONTINENT =
  "M335,380 L410,300 L560,330 L710,440 L740,540 L830,590 L965,640 L965,720 L905,840 L875,980 L770,1060 L695,1220 L620,1310 L560,1360 L515,1440 L485,1500 L455,1580 L470,1640 L410,1620 L380,1540 L395,1400 L395,1280 L425,1140 L440,900 L350,820 L275,660 L290,580 L298,520 L328,460Z";
const CARSTVO =
  "M298,520 L335,520 L365,620 L395,720 L440,820 L500,920 L530,1040 L500,1160 L440,1240 L418,1220 L425,1140 L440,900 L350,820 L275,660 L290,580Z";
const SELA: [number, number][] = [[320, 560], [305, 660], [335, 720], [350, 780], [410, 810], [440, 860], [470, 920], [455, 1000], [470, 1080], [440, 1160], [372, 740], [418, 840], [500, 1020]];
const GREBEN: [number, number][] = [[320, 540], [335, 660], [365, 760], [425, 840], [470, 920], [478, 1020], [455, 1140], [432, 1220], [418, 1340], [410, 1460]];
const PUT = "M312,540 L320,660 L350,760 L410,820 L462,900 L470,1020 L448,1140 L432,1200";

export const Scena7: React.FC = () => {
  const f = useF();
  const kM = kad(7, "milione");
  const kN = kad(7, "novac.");
  const kZ = kad(7, "zapise.");
  const kS = kad(7, "Sve");
  const novacOde = napredak(f, kN + 18, 24);
  const glasnik = napredak(f, kS, 70, Easing.linear);
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#9DBFC6" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        {/* talasići okeana */}
        {Array.from({ length: 14 }, (_, i) => (
          <Linija key={i} d={`M${60 + (i % 3) * 70},${300 + i * 105} q20,-10 40,0 t40,0`} boja="#fff" debljina={3} opacity={0.5} />
        ))}
        <Oblik d={KONTINENT} boja="#D9C38E" debljina={5} tekstura={0.4} />
        <Oblik d={CARSTVO} boja="#C7653F" debljina={4} tekstura={0.35} opacity={0.9} />
        {/* Andi: niz vrhova */}
        {GREBEN.map(([x, y], i) => {
          return <path key={i} d={`M${x - 16},${y + 10} L${x},${y - 16} L${x + 16},${y + 10}`} fill="none" stroke={P.mastilo} strokeWidth={3.5} opacity={0.6} />;
        })}
        <Linija d={PUT} boja={P.krem} debljina={5} napredak={napredak(f, kS - 10, 30)} opacity={0.9} />
      </Hrapavo>
      <text x={70} y={1250} fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={52} fill={P.mastilo} opacity={0.85}>
        carstvo Inka
      </text>
      <path d="M200,1210 C260,1160 300,1120 350,1080" fill="none" stroke={P.mastilo} strokeWidth={3} opacity={0.6} />
      {/* sela */}
      {SELA.map(([x, y], i) => (
        <Pop key={i} at={kM - 4 + i * 2} x={x} y={y} skala={0.9}>
          <path d="M-14,10 L-14,-6 L0,-18 L14,-6 L14,10Z" fill={P.belo} stroke={P.mastilo} strokeWidth={3} />
          {f >= kZ - 4 + i && (
            <g transform="translate(30 -14) scale(0.11)">
              <Kipu konci={[{ boja: "#E9B93C", cvorovi: [1, 2, 3] }, { boja: P.ajvar, cvorovi: [0, 2, 2] }, { boja: "#F3ECDD", cvorovi: [1, 1, 3] }]} x0={-200} x1={200} duzina={420} />
            </g>
          )}
        </Pop>
      ))}
      {/* novčić: pojavi se, pa izbledi i ode */}
      {f >= kN - 6 && (
        <g transform={`translate(${interpolate(novacOde, [0, 1], [830, 1200])} ${interpolate(novacOde, [0, 1], [930, 1000])}) rotate(${novacOde * 120})`} opacity={(1 - novacOde) * 0.85}>
          <Pop at={kN - 6} x={0} y={0}>
            <g style={{ filter: "grayscale(0.6)" }}>
              <Novcic s={1.7} />
            </g>
          </Pop>
        </g>
      )}
      {/* glasnik sa kipuom trči putem */}
      {f >= kS && glasnik < 1 && (
        <g transform={`translate(${interpolate(glasnik, [0.0, 0.143, 0.286, 0.429, 0.571, 0.714, 0.857, 1.0], [312, 320, 350, 410, 462, 470, 448, 432])} ${interpolate(glasnik, [0.0, 0.143, 0.286, 0.429, 0.571, 0.714, 0.857, 1.0], [540, 660, 760, 820, 900, 1020, 1140, 1200])})`}>
          <circle r={18} fill={P.ajvar} stroke={P.mastilo} strokeWidth={3.5} />
          <circle cx={0} cy={-26} r={11} fill="#D9A47C" stroke={P.mastilo} strokeWidth={3} />
          <path d={`M-10,14 L${-16 + Math.sin(f / 2) * 8},36 M10,14 L${16 - Math.sin(f / 2) * 8},36`} stroke={P.mastilo} strokeWidth={4} />
        </g>
      )}
    </Kadar>
  );
};
