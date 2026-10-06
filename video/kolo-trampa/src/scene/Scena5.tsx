// Scena 5 — „Ljudi su taj problem rešavali na dva načina.“
// Kreda povuče uspravnu liniju i podeli tablu na dve kolone; na „dva“ gore se napišu 1. i 2.
import React from "react";
import { Kadar, Kreda, Linija, napredak, useF } from "../alat";
import { kad } from "../vreme";
import { Pisi } from "./zajednicko";

export const Scena5: React.FC = () => {
  const f = useF();
  const kPro = kad(5, "problem");
  const kDva = kad(5, "dva");
  return (
    <Kadar>
      <Kreda>
        <Linija d="M540,170 Q546,700 538,1260" debljina={9} napredak={napredak(f, kPro - 6, 22)} />
        <Pisi tekst="1." at={kDva - 2} x={270} y={330} velicina={190} brzina={0.4} />
        <Pisi tekst="2." at={kDva + 4} x={810} y={330} velicina={190} brzina={0.4} />
      </Kreda>
    </Kadar>
  );
};
