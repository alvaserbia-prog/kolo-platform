// Naslovna (cover) za mreže: polica sa žitom, solju i školjkama, ispod pukotina; naslov „Prokletstvo novca“
// (vlasnik, 06.10.2026: naslov o novcu i njegovoj mani, ne o žitu).
// Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, SERIF, ucitajFontove } from "./fontovi";
import { Hrapavo, Kadar } from "./alat";
import { Polica } from "./scene/mana";
import { Stranica } from "./Stranica";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill="#EAD9B2" />
        <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <circle cx={540} cy={1000} r={600} fill="url(#toplaSvetlost)" />
      <g transform="translate(0 200)">
        <Polica y={1000} pukla={1} f={0} />
      </g>
    </Kadar>
    <AbsoluteFill>
      <Stranica />
    </AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 10px 12px rgba(58,42,29,0.35))" }}>
      <rect x={90} y={300} width={900} height={330} rx={30} fill={P.krem} stroke={P.mastilo} strokeWidth={5} />
      <rect x={104} y={314} width={872} height={302} rx={22} fill="none" stroke={P.vez} strokeWidth={3} strokeDasharray="12 7" />
      <text x={540} y={440} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={96} fill={P.mastilo}>
        Prokletstvo novca
      </text>
      <text x={540} y={550} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={60} fill={P.ajvar}>
        ili ga nema, ili ga ima previše
      </text>
      <rect x={170} y={1440} width={740} height={180} rx={26} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
      <text x={540} y={1512} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={46} fill={P.mastilo}>
        stari oblici novca
      </text>
      <text x={540} y={1588} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
