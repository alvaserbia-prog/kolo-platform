// Scena 10 — „Svesno se odričemo dela privatnosti da bismo sprečili zloupotrebe u sistemu.“
// Noć, kuća na trgu. Na „odričemo“ ruka iznutra razmakne zavese, ali samo do pola (deo privatnosti): svetlo iz
// sobe padne napolje, unutra se vidi stakleni sanduk. Na „sprečili“ iz mraka krene tamna ruka ka prozoru; na
// „zloupotrebe“ sa obe strane priđu komšije sa fenjerima, ruka uđe u svetlo i povuče se.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, mesaj, napredak, useF } from "../alat";
import { Mrak, N, Nebo, Sanduk } from "../noc";
import { Muskatla, Prozor, TamnaRuka } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";
import { SELJANI, SaFenjerom, plamen } from "./svet";

const PROZOR = { x: 540, y: 700 };

export const Scena10: React.FC = () => {
  const f = useF();
  const kO = kad(10, "odričemo");
  const kS = kad(10, "sprečili");
  const kZ = kad(10, "zloupotrebe");
  const otvor = napredak(f, kO - 4, 24);
  const ruka = interpolate(f, [kS - 10, kS + 12, kZ + 4, kZ + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const komsije = napredak(f, kZ - 12, 18, Easing.out(Easing.cubic));
  const lx = mesaj(-200, 150, komsije);
  const dx = mesaj(1280, 930, komsije);
  const svetla = [
    { x: PROZOR.x, y: PROZOR.y + 80, r: 260 + 260 * otvor },
    { ...plamen(lx + 95, 1330 - 330 * 0.6, 0.8, 300), a: komsije },
    { ...plamen(dx - 95, 1330 - 330 * 0.6, 0.8, 300), a: komsije },
  ];
  return (
    <Kadar>
      <Nebo mesec={false} />
      <rect x={-100} y={180} width={1300} height={1100} fill={N.zid} />
      <rect x={-100} y={180} width={1300} height={1100} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      <rect x={-100} y={1280} width={1300} height={900} fill={N.zemlja} />
      <g transform={`translate(${PROZOR.x} ${PROZOR.y})`}>
        <Prozor
          otvor={otvor}
          unutra={
            <g>
              <rect x={-300} y={-320} width={600} height={640} fill="#E6C98E" />
              <circle cx={0} cy={-120} r={260} fill="url(#plamen)" opacity={0.8} />
              <rect x={-300} y={140} width={600} height={180} fill={P.drvoTamno} />
              <g transform="translate(40 180)">
                <Sanduk s={0.55} staklo={1} pun={0.6} />
              </g>
            </g>
          }
        />
        <g transform="translate(-200 366)">
          <Muskatla />
        </g>
        <g transform="translate(200 366)">
          <Muskatla />
        </g>
      </g>
      <g transform={`translate(${mesaj(1300, PROZOR.x + 240, ruka)} ${PROZOR.y + 210}) rotate(-4)`}>
        <TamnaRuka />
      </g>
      <SaFenjerom p={SELJANI[1]} x={lx} y={1330} s={0.6} tx={lx + 95} ty={1330 - 330 * 0.6} f={f} izraz="odlucna" pogled={[7, -3]} fs={0.8} />
      <SaFenjerom p={SELJANI[0]} x={dx} y={1330} s={0.6} tx={dx - 95} ty={1330 - 330 * 0.6} f={f + 9} okreni izraz="odlucna" pogled={[-7, -3]} fs={0.8} />
      <Mrak id="s10" svetla={svetla} jacina={0.72} />
    </Kadar>
  );
};
