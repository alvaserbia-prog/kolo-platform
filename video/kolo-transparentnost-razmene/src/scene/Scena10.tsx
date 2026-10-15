// Scena 10 — „Svesno se odričemo dela privatnosti da bismo sprečili zloupotrebe u sistemu.“
// Zid kuće sa prozorom, zavese navučene. Na „odričemo“ ruka razmakne zavese, ali samo do pola (deo
// privatnosti): unutra sto, otvorena sveska računa i kasa. Na „sprečili“ tamna ruka iz scene 1 krene ka kasi;
// na „zloupotrebe“ sa strane proviruju komšije, ruka se povuče. Niko ništa ne uzme.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Hrapavo, Kadar, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { Kasa, STANAR, BAKA } from "../zgrada";
import { LicnaSveska, Muskatla, Prozor, TamnaRuka } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";

const PROZOR = { x: 540, y: 700 };

export const Scena10: React.FC = () => {
  const f = useF();
  const kO = kad(10, "odričemo");
  const kS = kad(10, "sprečili");
  const kZ = kad(10, "zloupotrebe");
  const otvor = napredak(f, kO - 4, 24);
  const ruka = interpolate(f, [kS - 10, kS + 12, kZ + 4, kZ + 18], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const komsije = napredak(f, kZ - 8, 14, Easing.out(Easing.back(1.4)));
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill={P.zid} />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        <rect x={-100} y={1240} width={1300} height={900} fill={P.trava} />
      </Hrapavo>
      <g transform={`translate(${PROZOR.x} ${PROZOR.y})`}>
        <Prozor
          otvor={otvor}
          unutra={
            <g>
              <rect x={-300} y={-320} width={600} height={640} fill="#D8C59C" />
              <rect x={-300} y={120} width={600} height={200} fill={P.drvoTamno} />
              <g transform="translate(-80 150) scale(0.62)">
                <LicnaSveska natpis="račun" otvor={1} boja={P.plava} />
              </g>
              <g transform="translate(150 190)">
                <Kasa s={0.55} otvor={1} pun={1} natpis="KUĆA" />
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
      {/* tamna ruka sa desne strane, ka kasi kroz prozor */}
      <g transform={`translate(${mesaj(1300, PROZOR.x + 230, ruka)} ${PROZOR.y + 150}) rotate(-4)`}>
        <TamnaRuka />
      </g>
      {/* komšije proviruju sa strane */}
      <g transform={`translate(${mesaj(-260, 0, komsije)} 0)`}>
        <Lik x={120} y={1460} s={0.68} {...STANAR} glava={{ ...STANAR.glava, izraz: "odlucna", pogled: [7, -2] }} />
      </g>
      <g transform={`translate(${mesaj(260, 0, komsije)} 0)`}>
        <Lik x={960} y={1470} s={0.66} okreni {...BAKA} glava={{ ...BAKA.glava, izraz: "odlucna", pogled: [-7, -2] }} />
      </g>
    </Kadar>
  );
};
