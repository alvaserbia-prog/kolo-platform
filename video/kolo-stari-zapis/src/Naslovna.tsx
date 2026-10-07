// Naslovna (cover) za mreže: „Carstvo bez novca / kako su Inke vodile zapis“ (vlasnik, 07.10.2026);
// krupno kipu, uz njega glinena pločica i zajednička sveska na stolu.
// Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, ucitajFontove } from "./fontovi";
import { Hrapavo, Kadar } from "./alat";
import { Kipu, Plocica } from "./drevno";
import { Sveska } from "./sveska";
import { Stranica } from "./Stranica";
import { Sto } from "./scene/Scena8";
import { REDOVI_1 } from "./scene/Scena1";
import { KONCI } from "./scene/Scena5";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Kadar>
      <Hrapavo>
        <Sto />
      </Hrapavo>
      <g transform="translate(540 960)">
        <circle r={620} fill="url(#toplaSvetlost)" />
      </g>
      <g transform="translate(185 1270) rotate(-8)">
        <Plocica w={300} h={220} redovi={REDOVI_1} />
      </g>
      <g transform="translate(560 690) scale(0.95) rotate(3)">
        <Kipu konci={KONCI} x0={-330} x1={330} duzina={470} />
      </g>
      <g transform="translate(640 1340) scale(0.62) rotate(3)">
        <Sveska kolo={1} zig={[1, 1, 1]} />
      </g>
    </Kadar>
    <AbsoluteFill>
      <Stranica />
    </AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 10px 12px rgba(58,42,29,0.35))" }}>
      <rect x={90} y={300} width={900} height={300} rx={30} fill={P.krem} stroke={P.mastilo} strokeWidth={5} />
      <rect x={104} y={314} width={872} height={272} rx={22} fill="none" stroke={P.vez} strokeWidth={3} strokeDasharray="12 7" />
      <text x={540} y={430} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={92} fill={P.mastilo}>
        Carstvo bez novca
      </text>
      <text x={540} y={525} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={58} fill={P.zelena700}>
        kako su Inke vodile zapis
      </text>
      <rect x={300} y={1470} width={480} height={100} rx={22} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
      <text x={540} y={1538} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
