// Naslovna slika (cover) za mreže: kuća sa upaljenom dnevnom sobom i kuhinjom (kadar 790
// iz scene 4 — renderuje se sa --frame=790, jer Still sa <Freeze> ostaje na frejmu 0) i udica iz prvog kadra. Naslov je u sredini, pa ga ne seče ni
// kvadratni (3:4) isečak u mreži profila.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { KucaSloj } from "./KucaSloj";
import { Defs, Isecak, pravougaonik } from "./papir";
import { SANS, RUKOPIS } from "./fontovi";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <KucaSloj />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <g transform="translate(540 1250) rotate(-2)">
        <Isecak pts={pravougaonik(-480, -170, 960, 340)} boja={P.belo} seed="nas-k" amp={3} />
        <text x={0} y={-30} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={100} fill={P.zelena900}>
          Misliš da nemaš
        </text>
        <text x={0} y={100} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={100} fill={P.zelena700}>
          šta da ponudiš?
        </text>
      </g>
      <g transform="translate(600 1480) rotate(3)">
        <Isecak pts={pravougaonik(-330, -64, 660, 116)} boja={P.zlatna400} seed="nas-t" amp={2} />
        <text x={0} y={18} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={70} fill={P.zelena900}>
          10 ideja iz tvoje kuće
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);
