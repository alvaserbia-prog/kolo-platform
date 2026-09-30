// Naslovna slika (cover) za mreže: naslov, komšijska sveska sa redovima i komšije koje
// izviruju iza nje. Bitno je u sredini (y 300–1600), jer Instagram mrežu seče na 3:4.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { SANS, RUKOPIS, ucitajFontove } from "./fontovi";
import { Defs, Isecak, pravougaonik } from "./papir";
import { Osoba } from "./likovi";
import { LogoZnak } from "./kolo";
import { LIKOVI, LikId } from "./prica";
import { KOMSIJE, KomsijaId } from "./selo";
import { Sveska } from "./sveska";
import { ANA_LAZAR, MILAN_ANA, SECANJE } from "./zapisi";

ucitajFontove();

const GLAVE: { id: LikId | KomsijaId; x: number; y: number }[] = [
  { id: "jova", x: 170, y: 800 },
  { id: "ana", x: 355, y: 780 },
  { id: "milan", x: 540, y: 772 },
  { id: "lazar", x: 725, y: 780 },
  { id: "stana", x: 910, y: 800 },
];

export const Naslovna: React.FC = () => {
  const redovi = [...SECANJE, MILAN_ANA, ANA_LAZAR].map((r) => ({ ...r, zig: 1 }));
  return (
    <AbsoluteFill style={{ background: P.papir }}>
      <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <g transform="translate(540 390) rotate(-2)">
          <Isecak pts={pravougaonik(-420, -95, 840, 150)} boja={P.belo} seed="n-naslov" amp={2.4} />
          <text x={0} y={30} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={112} fill={P.zelena900}>
            Komšijska sveska
          </text>
        </g>
        <g transform="translate(540 560) rotate(1.5)">
          <Isecak pts={pravougaonik(-300, -70, 600, 118)} boja={P.zelena700} seed="n-pitanje" amp={2.4} />
          <text x={0} y={22} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={76} fill={P.belo}>
            Šta je POEN?
          </text>
        </g>
        {GLAVE.map((g) => {
          const cfg = g.id in LIKOVI ? LIKOVI[g.id as LikId] : KOMSIJE[g.id as KomsijaId];
          return (
            <g key={g.id} transform={`translate(${g.x} ${g.y}) scale(1.15)`}>
              <Osoba seed={`n-${g.id}`} boja={cfg.boja} glava={cfg.glava} />
            </g>
          );
        })}
        <g transform="translate(540 1200)">
          <Sveska seed="n-sv" redovi={redovi} />
          <g transform="translate(355 -262) rotate(8) scale(0.42)">
            <LogoZnak seed="n-logo" r={110} />
          </g>
        </g>
        <g transform="translate(540 1680) rotate(-1.5)">
          <Isecak pts={pravougaonik(-190, -62, 380, 96)} boja={P.belo} seed="n-adresa" amp={2} />
          <text x={0} y={16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={66} fill={P.zelena700}>
            ekolo<tspan fill={P.zlatna600}>.</tspan>rs
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
