// Naslovna slika (cover) za mreže: kadar iz scene 1 (porodica kreće na more), preko njega krupan
// natpis. Sav tekst je između y 300 i 1620, jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { RUKOPIS, SANS, ucitajFontove } from "./fontovi";
import { P } from "./kolaz/paleta";
import { Defs, Isecak, pravougaonik } from "./kolaz/papir";
import { SCENE } from "./u/scene";

ucitajFontove();
const Scena1 = SCENE[0];

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Sequence from={-240} layout="none">
      <Scena1 />
    </Sequence>
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Defs />
        <g transform="translate(560 1370) rotate(-2)">
          <Isecak pts={pravougaonik(-450, -130, 900, 250)} boja={P.belo} seed="nas1" amp={3} />
          <text y={-12} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={104} fill={P.zelena900}>
            More za šest meseci
          </text>
          <text y={82} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={50} fill={P.tekst}>
            Ista plata, ostaje više dinara
          </text>
        </g>
        <g transform="translate(540 1560) rotate(1.5)">
          <Isecak pts={pravougaonik(-190, -52, 380, 96)} boja={P.zelena700} seed="nas2" amp={2} />
          <text y={22} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={58} fill={P.belo}>
            ekolo.rs
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);
