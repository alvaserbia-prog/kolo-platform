// Naslovna slika (1080×1920) složena tako da sve bitno stane u sredinu kadra:
// Instagram mreža seče na 3:4 (y 240–1680), Facebook feed na 4:5 ili kvadrat (y 420–1500).
// Natpis, Ana i tegla su u kvadratu y 420–1500, centrirani po širini.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { ucitajFontove, SANS, RUKOPIS } from "./fontovi";
import { Defs, Isecak, pravougaonik } from "./papir";
import { LogoZnak } from "./kolo";
import { Lik, Pcele, Tegla } from "./prica";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <g transform="translate(540 620) rotate(-2)">
        <Isecak pts={pravougaonik(-450, -125, 900, 250)} boja={P.zelena700} seed="n-udica" amp={3} />
        <text x={0} y={-6} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={104} fill={P.belo}>
          Prvi oglas
        </text>
        <text x={0} y={86} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={86} fill={P.zlatna400}>
          za 2 minuta
        </text>
      </g>
      <g transform="translate(415 1090) scale(2.15)">
        <Lik id="ana" seed="n-ana" />
      </g>
      <g transform="translate(685 1100) rotate(-6) scale(1.25)">
        <Tegla seed="n-tegla" />
      </g>
      <Pcele seed="n-pc" x={690} y={900} n={3} r={150} od={-40} />
      <g transform="translate(775 950) rotate(10) scale(0.5)">
        <LogoZnak seed="n-logo" r={110} />
      </g>
    </svg>
  </AbsoluteFill>
);
