// Naslovna (cover) za mreže: glinena pločica, kipu i zajednička sveska na stolu, krupan naslov.
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
      <g transform="translate(290 1010) rotate(-7)">
        <Plocica w={420} h={300} redovi={REDOVI_1} />
      </g>
      <g transform="translate(790 700) scale(0.5) rotate(5)">
        <Kipu konci={KONCI} x0={-300} x1={300} duzina={460} />
      </g>
      <g transform="translate(560 1330) scale(0.78) rotate(2)">
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
        Ko je šta dao?
      </text>
      <text x={540} y={525} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={58} fill={P.zelena700}>
        zapis star 5.000 godina
      </text>
      <rect x={300} y={1470} width={480} height={100} rx={22} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
      <text x={540} y={1538} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
