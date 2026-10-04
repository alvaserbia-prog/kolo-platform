// Naslovna slika (cover) za mreže: kadar iz scene 1 (porodica kreće na more), preko njega krupan
// natpis. Sav tekst je između y 300 i 1620, jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { RUKOPIS, SANS, ucitajFontove } from "./fontovi";
import { P } from "./kolaz/paleta";
import { Defs, Isecak, pravougaonik } from "./kolaz/papir";
import { SCENE } from "./u/scene";
import { kad, trajanjeF } from "./u/vreme";

ucitajFontove();
const Scena1 = SCENE[0];

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Sequence from={-(trajanjeF(1) - 6)} layout="none">
      <Scena1 />
    </Sequence>
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Defs />
        <g transform="translate(560 1370) rotate(-2)">
          <Isecak pts={pravougaonik(-450, -130, 900, 250)} boja={P.belo} seed="nas1" amp={3} />
          <text y={-12} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={104} fill={P.zelena900}>
            More za 6 meseci
          </text>
          <text y={82} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={50} fill={P.tekst}>
            Ista plata, veća ušteda
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

// Dodatne naslovne (03.10.2026): kadar iz sveske i krupan natpis o ušteđenim dinarima.
const Natpis: React.FC<{ naslov: string; podnaslov: string; y?: number; velicina?: number; pod?: number }> = ({ naslov, podnaslov, y = 1400, velicina = 96, pod = 48 }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    <g transform={`translate(540 ${y}) rotate(-2)`}>
      <Isecak pts={pravougaonik(-470, -130, 940, 250)} boja={P.belo} seed={`nas-${naslov}`} amp={3} />
      <text y={-12} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={velicina} fill={P.zelena900}>
        {naslov}
      </text>
      <text y={82} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={pod} fill={P.tekst}>
        {podnaslov}
      </text>
    </g>
    <g transform={`translate(540 ${y + 190}) rotate(1.5)`}>
      <Isecak pts={pravougaonik(-170, -46, 340, 86)} boja={P.zelena700} seed={`nas-e-${naslov}`} amp={2} />
      <text y={20} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={52} fill={P.belo}>
        ekolo.rs
      </text>
    </g>
  </svg>
);

const Kadar: React.FC<{ scena: number; frejm: number }> = ({ scena, frejm }) => {
  const S = SCENE[scena - 1];
  return (
    <Sequence from={-frejm} layout="none">
      <S />
    </Sequence>
  );
};

const Osnova: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    {children}
  </AbsoluteFill>
);

/** Problem: plata potrošena, „Ostalo: 0“. */
export const Naslovna2: React.FC = () => (
  <Osnova>
    <Kadar scena={2} frejm={trajanjeF(2) - 6} />
    <Natpis naslov="Na kraju meseca ništa?" podnaslov="Ista plata, a može da ostane više" y={1395} />
  </Osnova>
);

/** Sveska u šestom mesecu: „Ostalo: 20.000 din“. */
export const Naslovna3: React.FC = () => (
  <Osnova>
    <Kadar scena={7} frejm={trajanjeF(7) - 6} />
    <Natpis naslov="20.000 dinara svakog meseca" podnaslov="Toliko sada ostane Zoranu" y={1395} velicina={84} />
  </Osnova>
);

/** Sabiranje: 95.000 din za šest meseci. */
export const Naslovna4: React.FC = () => (
  <Osnova>
    <Kadar scena={8} frejm={kad(8, "dovoljno") + 11} />
    <Natpis naslov="95.000 dinara za šest meseci" podnaslov="Bez veće plate, uz KOLO" y={1395} velicina={80} />
  </Osnova>
);

// Varijante prve naslovne (kadar sa porodicom i morem), sa natpisom o uštedi (vlasnik, 03.10.2026).
const More: React.FC<{ naslov: string; podnaslov: string; velicina?: number; pod?: number }> = ({ naslov, podnaslov, velicina = 96, pod = 44 }) => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Sequence from={-(trajanjeF(1) - 6)} layout="none">
      <Scena1 />
    </Sequence>
    <Natpis naslov={naslov} podnaslov={podnaslov} y={1370} velicina={velicina} pod={pod} />
  </AbsoluteFill>
);
export const NaslovnaMore1: React.FC = () => <More naslov="Kako je uštedeo za more?" podnaslov="Ista plata, a svakog meseca ostane više" />;
export const NaslovnaMore2: React.FC = () => <More naslov="Ušteda za more" podnaslov="Ista plata, 95.000 dinara za šest meseci" velicina={110} pod={42} />;
export const NaslovnaMore3: React.FC = () => <More naslov="Svakog meseca ostane više" podnaslov="Za šest meseci skupio je za more" velicina={92} />;
