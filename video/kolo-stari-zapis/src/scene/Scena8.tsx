// Scena 8 — „Zapis se ne koristi kao sredstvo za razmenu. On pokazuje ko je šta dao.“
// Listanje: drveni sto. Gore levo glinena pločica, gore desno kipu, u sredini otvorena zajednička
// sveska iz videa 15. Na „sredstvo“ između njih uskoče žito, so, školjka i novčić (sredstva iz videa 16),
// a na „razmenu“ posive i odu. Na „pokazuje“ se u svesci ispišu redovi ko je šta dao.
import React from "react";
import { Easing } from "remotion";
import { Hrapavo, Kadar, Oblik, Pop, elipsa, napredak, useF } from "../alat";
import { Kipu, Novcic, Plocica } from "../drevno";
import { Sveska } from "../sveska";
import { kad } from "../vreme";
import { P } from "../paleta";
import { REDOVI_1 } from "./Scena1";
import { KONCI } from "./Scena5";

export const Sto: React.FC = () => (
  <g>
    <rect x={-100} y={-100} width={1300} height={2200} fill="#9A6A45" />
    <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M-100,${i * 240 + 40} C300,${i * 240 + 20} 700,${i * 240 + 60} 1200,${i * 240 + 30}`} fill="none" stroke={P.drvoTamno} strokeWidth={3} opacity={0.35} />
    ))}
  </g>
);

const Sredstvo: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0)
    return (
      <g>
        <Oblik d="M-40,0 C-50,-40 -40,-70 -20,-80 L20,-80 C40,-70 50,-40 40,0Z" boja="#D9BE86" debljina={3.5} />
        <path d="M-20,-80 L-28,-96 M20,-80 L28,-96" stroke={P.mastilo} strokeWidth={3} />
      </g>
    );
  if (i === 1) return <Oblik d="M-34,0 L-34,-60 L34,-60 L34,0Z" boja="#F4F1EA" debljina={3.5} />;
  if (i === 2) return <Oblik d={`M0,0 C-40,-10 -44,-56 0,-70 C44,-56 40,-10 0,0Z`} boja="#E8C7B0" debljina={3.5} />;
  return (
    <g transform="translate(0 -36)">
      <Novcic s={0.6} />
    </g>
  );
};

export const Scena8: React.FC = () => {
  const f = useF();
  const kSr = kad(8, "sredstvo");
  const kR = kad(8, "razmenu.");
  const kP = kad(8, "pokazuje");
  const odlaze = napredak(f, kR + 6, 14);
  const pis = (i: number) => napredak(f, kP - 4 + i * 12, 18, Easing.linear);
  return (
    <Kadar>
      <Hrapavo>
        <Sto />
      </Hrapavo>
      <g transform="translate(230 470) rotate(-6)">
        <Plocica w={300} h={220} redovi={REDOVI_1} />
      </g>
      <g transform="translate(830 290) scale(0.36) rotate(4)">
        <Kipu konci={KONCI} x0={-300} x1={300} duzina={440} />
      </g>
      <g opacity={1 - odlaze} style={{ filter: `grayscale(${odlaze})` }} transform={`translate(0 ${-odlaze * 60})`}>
        {[0, 1, 2, 3].map((i) => (
          <Pop key={i} at={kSr - 4 + i * 4} x={225 + i * 210} y={650} skala={1.35}>
            <Oblik d={elipsa(0, -36, 66, 60)} boja={P.krem} debljina={3} tekstura={0.1} opacity={0.85} />
            <Sredstvo i={i} />
          </Pop>
        ))}
      </g>
      <g transform="translate(540 1010)">
        <Sveska pisanje={[pis(0), pis(1), pis(2)]} />
      </g>
    </Kadar>
  );
};
