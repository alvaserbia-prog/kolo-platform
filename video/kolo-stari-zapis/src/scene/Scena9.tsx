// Scena 9 — „U KOLU se taj zapis zove POEN.“ (ponovni ulaz muzike pada na „KOLU“)
// Ista sveska. Na „KOLU“ korice pozelene, zaglavlje postane „ZAPIS U KOLU“, gore uskoči znak KOLO, a
// pločica i kipu odu u stranu, a iza sveske zasijaju zraci (pun ulaz). Na „POEN“ uz svaki red udari zeleni žig POEN.
import React from "react";
import { Hrapavo, Kadar, napredak, useF, usePop } from "../alat";
import { Kipu, Plocica } from "../drevno";
import { Sveska } from "../sveska";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { P } from "../paleta";
import { REDOVI_1 } from "./Scena1";
import { KONCI } from "./Scena5";
import { Sto } from "./Scena8";

export const Scena9: React.FC = () => {
  const f = useF();
  const kK = kad(9, "KOLU");
  const kP = kad(9, "POEN.");
  const kolo = napredak(f, kK - 4, 12);
  const odlaze = napredak(f, kK, 18);
  const znak = usePop(kK - 2, 160, 11);
  const zraci = napredak(f, kK + 7, 10); // ponovni ulaz muzike pada na „KOLU“ (~0,3 s posle početka reči)
  const zig = (i: number) => napredak(f, kP - 1 + i * 3, 6);
  return (
    <Kadar>
      <Hrapavo>
        <Sto />
      </Hrapavo>
      <rect x={0} y={0} width={1080} height={1920} fill="#F3E3B8" opacity={0.75 * kolo} />
      <g transform="translate(540 1010)" opacity={zraci}>
        {Array.from({ length: 20 }, (_, i) => (
          <path key={i} d="M0,-380 L28,-900 L-28,-900Z" fill={P.zlatna} opacity={0.5} transform={`rotate(${i * 18 + f * 0.5})`} />
        ))}
        <circle r={560} fill="url(#toplaSvetlost)" />
      </g>
      <g transform={`translate(${230 - odlaze * 420} 470) rotate(-6)`}>
        <Plocica w={300} h={220} redovi={REDOVI_1} />
      </g>
      <g transform={`translate(${830 + odlaze * 420} 290) scale(0.36) rotate(4)`}>
        <Kipu konci={KONCI} x0={-300} x1={300} duzina={440} />
      </g>
      <g transform={`translate(540 410) scale(${znak * 0.5})`}>
        <ZnakKolo id="znak9" />
      </g>
      <g transform={`translate(540 1010) scale(${1 + zraci * 0.03})`}>
        <Sveska kolo={kolo} zig={[zig(0), zig(1), zig(2)]} />
      </g>
    </Kadar>
  );
};
