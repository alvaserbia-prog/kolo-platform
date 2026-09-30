// Naslovna (cover) za mreže: bunar sa đermom u ravnici i ljudi oko njega, u drvorezu; krupan naslov.
// Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, SERIF, ucitajFontove } from "./fontovi";
import { Hrapavo, Kadar, Kamera, kutija } from "./alat";
import { Bunar, Covek, Krava } from "./motivi";
import { Pejzaz } from "./scene/Scena1";
import { Otisak } from "./Otisak";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1000} z={1.06}>
          <Pejzaz f={0} sunceY={640} />
          <g transform="translate(860 1085)">
            <Krava s={0.32} smer={-1} glavaDole={1} />
          </g>
          <g transform="translate(470 1330) scale(1.2)">
            <Bunar ugao={-18} />
          </g>
          <g transform="translate(190 1420)">
            <Covek tip="z" boja={P.rdja} boja2={P.oker} ruke={[-6, 8]} predmet="kofa" s={1.05} />
          </g>
          <g transform="translate(830 1450)">
            <Covek tip="m" boja={P.zelena700} smer={-1} ruke={[40, 6]} s={1.08} />
          </g>
          <g transform="translate(690 1520)">
            <Covek tip="d" boja={P.oker} boja2={P.rdja} smer={-1} ruke={[70, -10]} s={1.1} />
          </g>
          <g transform="translate(360 1600)">
            <Covek tip="sta" boja={P.mastiloMeko} boja2={P.okerTamni} ruke={[20, 0]} predmet="korpa" s={1.05} />
          </g>
        </Kamera>
      </Hrapavo>
    </Kadar>
    <AbsoluteFill>
      <Otisak />
    </AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={kutija(84, 308, 912, 330, 6)} fill={P.mastilo} opacity={0.25} transform="translate(10 10)" />
      <path d={kutija(84, 308, 912, 330, 6)} fill={P.mastilo} />
      <rect x={104} y={328} width={872} height={290} fill="none" stroke={P.krem} strokeWidth={2} opacity={0.5} />
      <text x={540} y={450} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={92} fill={P.krem}>
        Bunar koji
      </text>
      <text x={540} y={560} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={92} fill={P.okerSvetli}>
        kopamo zajedno
      </text>
      <path d={kutija(150, 1390, 780, 200, 10)} fill={P.mastilo} />
      <path d={kutija(158, 1398, 764, 184, 6)} fill={P.belo} />
      <text x={540} y={1470} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill={P.mastilo}>
        Zašto zajedničko ne mora da propadne
      </text>
      <text x={540} y={1552} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={60} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
