// Naslovna (cover) za mreže: „Ko krade iz zajedničke kase?“; ulaz zgrade, sveska kase na oglasnoj tabli,
// čika Đura i stanari, upitnik. Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, ucitajFontove } from "./fontovi";
import { Kadar } from "./alat";
import { Lik } from "./likovi";
import { BAKA, DJURA, STANARKA, Upitnik } from "./zgrada";
import { Stranica } from "./Stranica";
import { UlazSaTablom } from "./scene/zajednicko";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Kadar>
      <g transform="translate(0 260)">
        <UlazSaTablom sveska={1} svetlo={1} sveskaProps={{ dodatniRed: 1, zbir: 1 }} />
        <Lik x={140} y={1330} s={0.74} {...STANARKA} glava={{ ...STANARKA.glava, izraz: "zamisljena", pogled: [6, -6] }} />
        <Lik x={560} y={1360} s={0.86} {...DJURA} glava={{ ...DJURA.glava, izraz: "osmeh" }} />
        <Lik x={930} y={1340} s={0.72} okreni {...BAKA} glava={{ ...BAKA.glava, izraz: "zamisljena", pogled: [-6, -6] }} />
      </g>
      <g transform="translate(920 760) rotate(10)">
        <Upitnik s={1.3} />
      </g>
    </Kadar>
    <AbsoluteFill>
      <Stranica />
    </AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 10px 12px rgba(58,42,29,0.35))" }}>
      <rect x={90} y={300} width={900} height={300} rx={30} fill={P.krem} stroke={P.mastilo} strokeWidth={5} />
      <rect x={104} y={314} width={872} height={272} rx={22} fill="none" stroke={P.vez} strokeWidth={3} strokeDasharray="12 7" />
      <text x={540} y={430} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={88} fill={P.mastilo}>
        Ko krade iz
      </text>
      <text x={540} y={530} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={88} fill={P.mastilo}>
        zajedničke kase?
      </text>
      <rect x={300} y={1470} width={480} height={100} rx={22} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
      <text x={540} y={1538} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
