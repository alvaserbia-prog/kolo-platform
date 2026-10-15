// Scena 9 — „To se zove transparentnost razmene.“ Kolo odozgo, kao u sceni 7: preko kruga se, od jednog do
// drugog seljaka, iscrtavaju zlatne niti razmena sa brojem POEN-a; sve se vidi iz svakog mesta u krugu.
import React from "react";
import { interpolate } from "remotion";
import { Kadar, Kamera, useF } from "../alat";
import { Nit } from "../noc";
import { kad } from "../vreme";
import { KRUG, KrugOdozgo, tackaKruga } from "./krug";

const PAROVI: [number, number, string][] = [
  [0, 4, "+300"],
  [6, 2, "+500"],
  [3, 8, "+250"],
  [9, 5, "+400"],
  [1, 7, "+200"],
  [5, 0, "+350"],
];

export const Scena9: React.FC = () => {
  const f = useF();
  const kT = kad(9, "transparentnost");
  const ugao = 36 + f * 0.5;
  return (
    <Kadar>
      <Kamera x={540} y={KRUG.cy + 120} z={1}>
        <KrugOdozgo
          ugao={ugao}
          f={f}
          niti={PAROVI.map(([a, b, iznos], i) => {
            const p = interpolate(f, [kT - 30 + i * 8, kT - 30 + i * 8 + 26], [0, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <Nit key={i} a={tackaKruga(a, ugao, KRUG.r - 40)} b={tackaKruga(b, ugao, KRUG.r - 40)} napredak={p} iznos={iznos} luk={0} s={0.85} />;
          })}
        />
      </Kamera>
    </Kadar>
  );
};
