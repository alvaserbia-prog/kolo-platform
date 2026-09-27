// Naslovne slike (cover) za mreže, po jedna u stilu svakog videa. Kadar iz prve scene
// (Sequence sa negativnim početkom prikazuje zadati frejm), preko njega krupno pitanje.
// Sav tekst je između y 300 i 1620, jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ucitajFontove, OBLO, SANS, CETKA, RUKOPIS } from "./fontovi";
import { Scena1 as V1S1 } from "./v1k/scene";
import { Defs as D1, Isecak, pravougaonik } from "./v1k/papir";
import { P as PK } from "./v1k/paleta";
import { Img, staticFile } from "remotion";
import { Scena1 as V2S1 } from "./v2/scene";
import { Platno, PlatnoPozadina, Ram } from "./v2/okvir";
import { Defs as D2, N } from "./v2/naiva";
import { Scena1 as V3S1 } from "./v3/scene";
import { AkvarelPozadina, AkvarelPreko } from "./v3/okvir";
import { Defs as D3, T } from "./v3/tus";

ucitajFontove();

const Kadar: React.FC<{ frejm: number; children: React.ReactNode }> = ({ frejm, children }) => (
  <Sequence from={-frejm} layout="none">
    {children}
  </Sequence>
);

export const Naslovna1: React.FC = () => (
  <AbsoluteFill style={{ background: PK.papir }}>
    <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <AbsoluteFill style={{ filter: "sepia(0.35) saturate(0.9)" }}>
      <Kadar frejm={120}>
        <V1S1 />
      </Kadar>
    </AbsoluteFill>
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <D1 />
        <g transform="translate(540 300) rotate(-3)">
          <Isecak pts={pravougaonik(-400, -100, 800, 190)} boja={PK.belo} seed="n1" amp={3} />
          <text y={50} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={150} fill={PK.zelena900}>
            Čiji si ti?
          </text>
        </g>
        <g transform="translate(540 1500) rotate(1.5)">
          <Isecak pts={pravougaonik(-420, -110, 840, 210)} boja={PK.belo} seed="n1b" amp={3} />
          <text y={-14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={48} fill={PK.tekst}>
            Zašto KOLO ne traži ličnu kartu
          </text>
          <text y={66} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={62} fill={PK.zelena700}>
            ekolo.rs
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Naslovna2: React.FC = () => (
  <AbsoluteFill>
    <PlatnoPozadina />
    <Kadar frejm={40}>
      <V2S1 />
    </Kadar>
    <Platno />
    <AbsoluteFill style={{ zIndex: 2150 }}>
      <Ram oznaka="2/3 · Poverenje · naiva" />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <D2 />
        <g filter="url(#nMekoSenka)">
          <path d="M110,330 L40,330 L76,430 L40,560 L110,560Z M970,330 L1040,330 L1004,430 L970,560Z" fill={N.crvenaTamna} />
          <rect x={100} y={300} width={880} height={250} rx={20} fill={N.crvena} stroke={N.kontura} strokeWidth={4} />
        </g>
        <text x={540} y={410} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={88} fill={N.bela}>
          Ne poznaješ
        </text>
        <text x={540} y={510} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={88} fill={N.bela}>
          nikoga u KOLU?
        </text>
        <g filter="url(#nMekoSenka)">
          <rect x={150} y={1420} width={780} height={190} rx={95} fill={N.bela} stroke={N.zuta} strokeWidth={8} />
        </g>
        <text x={540} y={1500} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={54} fill={N.plava}>
          Dva puta do KOLA
        </text>
        <text x={540} y={1574} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={52} fill={N.zelena}>
          ekolo.rs
        </text>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Naslovna3: React.FC = () => (
  <AbsoluteFill>
    <AkvarelPozadina />
    <Kadar frejm={172}>
      <V3S1 />
    </Kadar>
    <AkvarelPreko oznaka="3/3 · Poverenje · tuš i akvarel" />
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <D3 />
        <path d="M70,330 C300,300 700,340 1010,315 L1016,590 C700,610 300,580 64,600Z" fill="#fff" opacity={0.88} filter="url(#akv)" />
        <path d="M70,330 C300,300 700,340 1010,315 L1016,590 C700,610 300,580 64,600Z" fill={T.indigo} opacity={0.18} filter="url(#akv)" />
        <text x={540} y={440} textAnchor="middle" fontFamily={CETKA} fontSize={120} fill={T.tus}>
          Bunar može
        </text>
        <text x={540} y={560} textAnchor="middle" fontFamily={CETKA} fontSize={120} fill={T.tus}>
          da se zamuti
        </text>
        <path d="M150,1420 C400,1400 700,1430 930,1410 L936,1610 C700,1630 400,1600 144,1620Z" fill="#fff" opacity={0.85} filter="url(#akv)" />
        <text x={540} y={1500} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill={T.tus}>
          Šta znači kad nekoga potvrdiš
        </text>
        <text x={540} y={1580} textAnchor="middle" fontFamily={CETKA} fontSize={74} fill={T.zelena}>
          ekolo.rs
        </text>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);
