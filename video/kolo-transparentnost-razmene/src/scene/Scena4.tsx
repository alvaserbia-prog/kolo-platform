// Scena 4 — „Ali pravila moraju da važe za sve.“ OBRT: ritam muzike ponovo ulazi na „Ali“.
// Knjiga PRAVILA uskoči u sredinu, iza nje zlatni zraci. Na „sve“ ispod nje stanu jedan do drugog čika Đura i
// stanari, svi iste veličine.
import React from "react";
import { Kadar, Hrapavo, Pop, napredak, useF, usePop } from "../alat";
import { Lik } from "../likovi";
import { BAKA, DJURA, KnjigaPravila, STANAR, STANARKA } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";

const LJUDI = [DJURA, STANARKA, STANAR, BAKA];

export const Scena4: React.FC = () => {
  const f = useF();
  const kA = kad(4, "ali");
  const kS = kad(4, "sve.");
  const zraci = napredak(f, kA - 2, 14);
  const pops = [usePop(kS - 10), usePop(kS - 6), usePop(kS - 2), usePop(kS + 2)];
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#F3E3B8" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <g transform="translate(540 640)" opacity={zraci}>
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d="M0,-220 L22,-640 L-22,-640Z" fill={P.zlatna} opacity={0.45} transform={`rotate(${i * 20 + f * 0.5})`} />
        ))}
        <circle r={420} fill="url(#toplaSvetlost)" />
      </g>
      <Pop at={kA - 4} x={540} y={640} skala={1.35}>
        <KnjigaPravila />
      </Pop>
      {LJUDI.map((l, i) => (
        <g key={i} transform={`translate(0 ${(1 - Math.min(1, pops[i])) * 300})`} opacity={f >= kS - 10 + i * 4 ? 1 : 0}>
          <Lik x={170 + i * 247} y={1330} s={0.56} okreni={i % 2 === 1} {...l} glava={{ ...l.glava, izraz: "osmeh", pogled: [0, -6] }} />
        </g>
      ))}
    </Kadar>
  );
};
