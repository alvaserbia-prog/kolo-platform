// Scene 6–7: školjke. 6) mapa Starog sveta: na „Africi“, „Indiji“, „Kini“ niču školjke sa imenima,
// pa jedna kauri krupno; 7) kineski znak 贝 (školjka) ispisan kičicom pored školjke, pa znaci
// 货 (roba, novac) i 财 (imetak) u kojima je isti znak, istaknut zeleno.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { KINESKI, RUKOPIS, SERIF } from "../fontovi";
import { Hrapavo, Kadar, Linija, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { kad } from "../vreme";
import { Mapa, Skoljka } from "../drevno";
import { Strelica } from "./zajednicko";

const Igla: React.FC<{ ime: string; levo?: boolean }> = ({ ime, levo }) => (
  <g>
    <Skoljka s={0.9} rot={-20} />
    <g transform={`translate(${levo ? -60 : 60} -54)`}>
      <Oblik d={kutija(levo ? -230 : 0, -40, 230, 64, 14)} boja={P.belo} debljina={3.5} tekstura={0.15} />
      <text x={levo ? -115 : 115} y={6} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={42} fill={P.mastilo}>
        {ime}
      </text>
    </g>
  </g>
);

// ── Scena 6 — „U Africi, Indiji i Kini koristile su se male školjke.“ ───────────
export const Scena6: React.FC = () => {
  const f = useF();
  const kAf = kad(6, "Africi,");
  const kIn = kad(6, "Indiji");
  const kKi = kad(6, "Kini");
  const kSk = kad(6, "školjke.");
  const krupno = napredak(f, kSk - 8, 16);
  return (
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill="#E2CFA2" />
        <Mapa />
      </Hrapavo>
      <g opacity={1 - krupno * 0.65}>
        <Pop at={kAf - 3} x={420} y={760}>
          <Igla ime="Afrika" levo />
        </Pop>
        <Pop at={kIn - 3} x={720} y={720}>
          <Igla ime="Indija" />
        </Pop>
        <Pop at={kKi - 3} x={880} y={470}>
          <Igla ime="Kina" levo />
        </Pop>
      </g>
      {krupno > 0 && (
        <g transform={`translate(540 ${interpolate(krupno, [0, 1], [1300, 900])}) scale(${krupno * 4.2}) rotate(${(1 - krupno) * 40 - 12})`}>
          <circle r={70} fill="url(#toplaSvetlost)" />
          <Skoljka />
        </g>
      )}
    </Kadar>
  );
};

/** Znak ispisan kičicom: otkriva se odozgo nadole (`p` 0–1). */
const Znak: React.FC<{ z: string; p: number; x: number; y: number; vel: number; id: string; boja?: string }> = ({ z, p, x, y, vel, id, boja = P.mastilo }) =>
  p <= 0 ? null : (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x - vel} y={y - vel} width={vel * 2} height={vel * 2 * p} />
        </clipPath>
      </defs>
      <text x={x} y={y + vel * 0.36} textAnchor="middle" fontFamily={KINESKI} fontSize={vel} fill={boja} clipPath={`url(#${id})`}>
        {z}
      </text>
    </g>
  );

// ── Scena 7 — „U kineskom pismu znakovi za novac i danas sadrže znak za školjku.“ ──
export const Scena7: React.FC = () => {
  const f = useF();
  const kPis = kad(7, "pismu");
  const kZn = kad(7, "znakovi");
  const kSad = kad(7, "sadrže");
  const kSk = kad(7, "školjku.");
  const p1 = napredak(f, kPis - 6, 16);
  const p2 = napredak(f, kZn, 14);
  const p3 = napredak(f, kZn + 10, 14);
  const ist = napredak(f, kSad, 10);
  const strel = napredak(f, kSk - 4, 14);
  return (
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill="#E9DDBF" />
        {/* svitak papira */}
        <Oblik d={kutija(110, 170, 860, 1100, 12)} boja="#F6EEDB" debljina={4} tekstura={0.2} />
        <Oblik d={kutija(80, 150, 920, 40, 18)} boja={P.drvo} debljina={4} />
        <Oblik d={kutija(80, 1250, 920, 40, 18)} boja={P.drvo} debljina={4} />
      </Hrapavo>
      {/* školjka i znak 贝 jedno pored drugog */}
      <Pop at={-2} x={300} y={480}>
        <Skoljka s={2.6} rot={90} />
      </Pop>
      <Znak z="贝" p={p1} x={720} y={480} vel={300} id="z1" />
      <Strelica x1={430} y1={480} x2={560} y2={480} luk={-50} napredak={strel} boja={P.zelena700} debljina={7} />
      {/* znaci za robu (novac) i imetak, sa istaknutim delom 贝 */}
      {[
        { z: "货", x: 360, p: p2, id: "z2", zn: "roba, novac" },
        { z: "财", x: 720, p: p3, id: "z3", zn: "imetak" },
      ].map((o) => (
        <g key={o.z}>
          <Znak z={o.z} p={o.p} x={o.x} y={930} vel={250} id={o.id} />
          {o.p > 0.9 && (
            <text x={o.x} y={1140} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={50} fill={P.mastiloSvetlo}>
              {o.zn}
            </text>
          )}
          {ist > 0 && (
            <ellipse
              cx={o.z === "货" ? o.x : o.x - 62}
              cy={o.z === "货" ? 990 : 940}
              rx={o.z === "货" ? 90 : 72}
              ry={o.z === "货" ? 80 : 120}
              fill="none"
              stroke={P.zelena500}
              strokeWidth={10}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - ist}
              opacity={0.9}
            />
          )}
        </g>
      ))}
      <Linija d="M200,1210 L880,1210" debljina={2} opacity={0} />
    </Kadar>
  );
};
