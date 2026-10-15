// Scena 12 — „U KOLU pravila važe jednako za sve.“ Gore knjiga PRAVILA; ispod četiri iste kartice računa
// (Direktor, Milica, Zoran, Đura). Na „važe“ iz knjige do svake kartice siđe zelena linija, na „jednako“ sve
// kartice istovremeno dobiju zelenu kvačicu.
import React from "react";
import { Easing } from "remotion";
import { Kadar, Linija, Pop, napredak, useF } from "../alat";
import { KnjigaPravila } from "../zgrada";
import { KarticaRacuna } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina } from "./kolo";

const IMENA = ["Direktor", "Milica", "Zoran", "Đura"];
const X = (i: number) => 165 + i * 250;

export const Scena12: React.FC = () => {
  const f = useF();
  const kP = kad(12, "pravila");
  const kV = kad(12, "važe");
  const kJ = kad(12, "jednako");
  const linija = napredak(f, kV - 4, 14, Easing.out(Easing.cubic));
  const kv = napredak(f, kJ, 10, Easing.out(Easing.back(2)));
  return (
    <Kadar>
      <KoloPozadina sjaj={0.5} />
      {IMENA.map((_, i) => (
        <Linija key={i} d={`M540,640 C540,760 ${X(i)},760 ${X(i)},880`} boja={P.zelena500} debljina={7} napredak={linija} />
      ))}
      <Pop at={-2} x={540} y={470} skala={0.9}>
        <KnjigaPravila />
      </Pop>
      {IMENA.map((ime, i) => (
        <Pop key={ime} at={kP - 10 + i * 3} x={X(i)} y={1040}>
          <KarticaRacuna ime={ime} kv={kv} />
        </Pop>
      ))}
    </Kadar>
  );
};
