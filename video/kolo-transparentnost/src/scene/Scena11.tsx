// Scena 11 — „POEN se upisuje samo prema pravilima.“ Telefon: račun direktora (upisi od Protokola i
// poneki prepis). Na „prema“ pored telefona uskoči knjiga PRAVILA; iz nje tanka zelena linija dođe do
// novog reda „Protokol · doprinos razmeni · +1.000“, koji se upiše na „pravilima“.
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
  const kPr = kad(11, "prema");
  const linija = napredak(f, kPr + 2, 12, Easing.out(Easing.cubic));
  const red = napredak(f, kP, 10);
  const tx = TEL.x;
  return (
    <Kadar>
      <KoloPozadina />
      <g transform={`translate(${tx} ${TEL.y}) scale(${TEL.s})`}>
        <VelikiTelefon>
          <EkranSistem redova={4 + napredak(f, 0, 16) + red} novi={red} />
        </VelikiTelefon>
      </g>
      <Linija d={`M200,1050 C250,980 300,${TEL.y + 140} ${tx - 190 * TEL.s},${TEL.y + 262 * TEL.s}`} boja={P.zelena500} debljina={7} napredak={linija} />
      <Pop at={kPr - 4} x={150} y={1120} rot={-6}>
        <KnjigaPravila s={0.72} />
      </Pop>
    </Kadar>
  );
};
