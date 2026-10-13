// Scena 3 — „Ljudi nisu izmislili pismo da bi pisali pesme ili zakone, nego da bi zapisali ko je šta dao.“
// Na polici mala pločica sa zapisom. Na „pesme“ uskoči pločica sa lirom, na „zakone“ pločica sa vagom; obe posive i
// odmaknu se. Na „zapisali“ u sredinu dođe pločica sa redovima ko · šta · koliko i zasija.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Hrapavo, Kadar, Pop, mesaj, napredak, useF } from "../alat";
import { Plocica } from "../drevno";
import { kad } from "../vreme";
import { P } from "../paleta";
import { REDOVI_1 } from "./Scena1";

export const Scena3: React.FC = () => {
  const f = useF();
  const kP = kad(3, "pesme");
  const kZ = kad(3, "zakone,");
  const kN = kad(3, "nego");
  const kZap = kad(3, "zapisali");
  const sklon = napredak(f, kN, 20);
  const glavna = napredak(f, kZap - 6, 22, Easing.out(Easing.back(1.4)));
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#D9C29A" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        {/* zid od opeke */}
        {Array.from({ length: 22 }, (_, r) => (
          <g key={r} opacity={0.18}>
            <line x1={0} y1={r * 60} x2={1080} y2={r * 60} stroke={P.mastilo} strokeWidth={2} />
            {Array.from({ length: 8 }, (_, c) => (
              <line key={c} x1={c * 150 + (r % 2) * 75} y1={r * 60} x2={c * 150 + (r % 2) * 75} y2={r * 60 + 60} stroke={P.mastilo} strokeWidth={2} />
            ))}
          </g>
        ))}
        {/* polica */}
        <rect x={60} y={1120} width={960} height={36} rx={6} fill={P.drvo} stroke={P.mastilo} strokeWidth={4} />
      </Hrapavo>
      <g style={{ filter: `grayscale(${sklon * 0.8})` }} opacity={1 - sklon * 0.35}>
        <Pop at={kP - 4} x={mesaj(230, 170, sklon)} y={mesaj(1120, 1110, sklon)} rot={-4} skala={mesaj(1, 0.8, sklon)}>
          <Plocica w={280} h={230} znaci={["lira"]} />
        </Pop>
        <Pop at={kZ - 4} x={mesaj(850, 910, sklon)} y={mesaj(1120, 1110, sklon)} rot={4} skala={mesaj(1, 0.8, sklon)}>
          <Plocica w={280} h={230} znaci={["vaga"]} />
        </Pop>
      </g>
      {/* pločica sa zapisom stoji na polici od početka, mala; na „zapisali“ izađe napred i zasija */}
      <g transform={`translate(540 ${interpolate(glavna, [0, 1], [1120, 920])}) scale(${0.5 + 0.5 * glavna})`}>
        <Plocica w={600} h={430} redovi={REDOVI_1} sjaj={glavna} />
      </g>
    </Kadar>
  );
};
