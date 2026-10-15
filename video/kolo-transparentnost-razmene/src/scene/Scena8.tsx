// Scena 8 — „Svaki potvrđeni član vidi koliko POEN-a imaju drugi članovi i sve razmene koje su obavljene.“
// Telefon u ruci člana. Na „potvrđeni“ u traci zasvetli značka „potvrđen“. Na „koliko“ se upisuje spisak
// članova sa stanjem. Na „razmene“ ekran pređe na spisak razmena: ko je kome prepisao i za šta.
import React from "react";
import { Easing } from "remotion";
import { Kadar, napredak, useF, usePop } from "../alat";
import { SakaSaTelefonom, VelikiTelefon } from "../zgrada";
import { CLANOVI, Ekran, RAZMENE } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina, TEL } from "./kolo";

export const Scena8: React.FC = () => {
  const f = useF();
  const kP = kad(8, "potvrđeni");
  const kK = kad(8, "koliko");
  const kR = kad(8, "razmene");
  const ulaz = usePop(-4, 120, 13);
  const potvrden = napredak(f, kP - 2, 10, Easing.out(Easing.back(2)));
  const pr = napredak(f, kR - 6, 12);
  return (
    <Kadar>
      <KoloPozadina />
      <g transform={`translate(${TEL.x} ${TEL.y + (1 - Math.min(1, ulaz)) * 900}) scale(${TEL.s})`}>
        <g transform="translate(0 330)">
          <SakaSaTelefonom rukav={P.plava} />
        </g>
        <VelikiTelefon>
          <g opacity={1 - pr} transform={`translate(${-pr * 60} 0)`}>
            <Ekran id="clanovi" naslov="Članovi" podnaslov="stanje POEN-a" bezZnaka redovi={CLANOVI} redova={napredak(f, kK - 4, 40, Easing.linear) * 6} potvrden={potvrden} />
          </g>
          {pr > 0 && (
            <g opacity={pr} transform={`translate(${(1 - pr) * 60} 0)`}>
              <Ekran id="razmene" naslov="Razmene" podnaslov="obavljene, sa osnovom" bezZnaka redovi={RAZMENE} redova={2 + napredak(f, kR, 30, Easing.linear) * 4} potvrden={1} />
            </g>
          )}
        </VelikiTelefon>
      </g>
    </Kadar>
  );
};
