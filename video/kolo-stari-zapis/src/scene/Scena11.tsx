// Scena 11 — „Budi i ti deo tog zapisa.“
// Gore niz: glinena pločica → kipu → znak KOLO (isti zapis kroz vreme). Ispod sveska „ZAPIS U KOLU“ sa
// žigovima POEN; na „ti“ se otvori prazan red „ti“ i zeleno pero čeka.
import React from "react";
import { Hrapavo, Kadar, Pop, napredak, useF } from "../alat";
import { Kipu, Plocica } from "../drevno";
import { Sveska } from "../sveska";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { P } from "../paleta";
import { REDOVI_1 } from "./Scena1";
import { KONCI } from "./Scena5";
import { Strelica } from "./zajednicko";

export const Scena11: React.FC = () => {
  const f = useF();
  const kT = kad(11, "ti");
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#F3E3B8" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <Pop at={-6} x={190} y={440}>
        <Plocica w={230} h={170} redovi={REDOVI_1} />
      </Pop>
      <Strelica x1={330} y1={340} x2={420} y2={340} luk={-30} napredak={napredak(f, 0, 12)} />
      <Pop at={2} x={540} y={250} skala={0.24}>
        <Kipu konci={KONCI} x0={-300} x1={300} duzina={440} />
      </Pop>
      <Strelica x1={660} y1={340} x2={750} y2={340} luk={-30} napredak={napredak(f, 8, 12)} />
      <Pop at={10} x={890} y={350} skala={0.38}>
        <ZnakKolo id="znak11" />
      </Pop>
      <g transform="translate(540 1010)">
        <Sveska kolo={1} zig={[1, 1, 1]} prazanRed={napredak(f, kT - 6, 14)} pero={napredak(f, kT, 8)} f={f} />
      </g>
    </Kadar>
  );
};
