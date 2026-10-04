// Scena 4 — „Mnoge od tih pločica postoje i danas, posle pet hiljada godina.“
// Muzej danas: vitrina sa pločicom i muzejskom ceduljom; na „Mnoge“ se u pozadini upale još dve
// vitrine sa pločicama; posetioci (devojčica i dečak) gledaju. Na „danas“ zasija svetlo vitrine.
import React from "react";
import { Hrapavo, Kadar, Pop, napredak, useF } from "../alat";
import { CERKA, Lik, SIN } from "../likovi";
import { MuzejCedulja, Plocica, Vitrina } from "../drevno";
import { kad } from "../vreme";
import { P } from "../paleta";
import { REDOVI_1 } from "./Scena1";

export const Scena4: React.FC = () => {
  const f = useF();
  const kM = kad(4, "Mnoge");
  const kD = kad(4, "danas,");
  const svetlo = 0.4 + 0.6 * napredak(f, kD - 4, 14);
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={1400} fill="#9FB3A6" />
        <rect x={-100} y={-100} width={1300} height={1400} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        <rect x={-100} y={1300} width={1300} height={800} fill="#8B7B66" />
        <rect x={-100} y={1300} width={1300} height={800} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        {/* parket */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={-100 + i * 140} y1={1300} x2={-400 + i * 200} y2={2000} stroke={P.mastilo} strokeWidth={2} opacity={0.2} />
        ))}
        {/* dve daleke vitrine */}
        <Pop at={kM - 6} x={130} y={1180} skala={0.36}>
          <Vitrina>
            <g transform="translate(0 -120)">
              <Plocica w={300} h={220} redovi={REDOVI_1.slice(0, 2)} />
            </g>
          </Vitrina>
        </Pop>
        <Pop at={kM + 2} x={950} y={1180} skala={0.36}>
          <Vitrina>
            <g transform="translate(0 -120)">
              <Plocica w={260} h={240} redovi={REDOVI_1.slice(1)} />
            </g>
          </Vitrina>
        </Pop>
      </Hrapavo>
      <g transform="translate(540 1220)">
        <ellipse cx={0} cy={-520} rx={460} ry={360} fill="url(#toplaSvetlost)" opacity={svetlo} />
        <Vitrina w={520} h={520} svetlo={svetlo}>
          <g transform="translate(0 -150)">
            <Plocica w={400} h={290} redovi={REDOVI_1} />
          </g>
          <g transform="translate(40 -112) rotate(-2)">
            <MuzejCedulja w={280} redovi={["glinena pločica", "Uruk, oko 3000. p. n. e."]} />
          </g>
        </Vitrina>
      </g>
      <Lik x={190} y={1760} s={0.75} dete {...CERKA} glava={{ ...CERKA.glava, izraz: "iznenadjena", pogled: [4, -3] }} lr={[10, 10]} dr={[120, 40]} />
      <Lik x={900} y={1780} s={0.75} dete okreni {...SIN} glava={{ ...SIN.glava, izraz: "osmeh", pogled: [4, -3] }} />
    </Kadar>
  );
};
