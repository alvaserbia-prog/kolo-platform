// Scena 11 — „POEN se upisuje samo prema pravilima.“ Telefon sa stranicom Sistem (zapisi).
// Na „pravilima“ pored telefona uskoči knjiga PRAVILA; iz nje tanka zelena linija dođe do novog reda,
// koji se upravo upiše.
import React from "react";
import { Easing } from "remotion";
import { Kadar, Linija, Pop, napredak, useF } from "../alat";
import { EkranSistem, KnjigaPravila, VelikiTelefon } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina, TEL } from "./kolo";

export const Scena11: React.FC = () => {
  const f = useF();
  const kP = kad(11, "pravilima.");
  const linija = napredak(f, kP + 4, 14, Easing.out(Easing.cubic));
  const red = napredak(f, kP + 14, 12);
  const tx = TEL.x + 60;
  return (
    <Kadar>
      <KoloPozadina />
      <g transform={`translate(${tx} ${TEL.y}) scale(${TEL.s})`}>
        <VelikiTelefon>
          <EkranSistem redova={3 + napredak(f, 0, 16) + red} novi={red} />
        </VelikiTelefon>
      </g>
      <Linija d={`M200,1030 C260,960 300,${TEL.y + 140} ${tx - 190},${TEL.y + 72 * TEL.s}`} boja={P.zelena500} debljina={7} napredak={linija} />
      <Pop at={kP - 3} x={170} y={1080} rot={-6}>
        <KnjigaPravila s={0.72} />
      </Pop>
    </Kadar>
  );
};
