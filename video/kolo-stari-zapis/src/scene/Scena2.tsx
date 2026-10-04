// Scena 2 — „Zapisivali su ko je koliko ovaca, vune i ulja doneo u skladište.“
// Gore velika pločica; dole skladište od opeke. Na „ovaca“ dođe čovek sa ovcama, na „vune“ žena sa
// balom vune, na „ulja“ čovek sa ćupom — i na pločici se upiše red: ko (čovek/žena), šta, koliko.
// Na „skladište“ ulaz zasvetli i roba ode unutra.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Hrapavo, Kadar, Pop, mesaj, napredak, useF } from "../alat";
import { Lik, NOSAC, NOSACICA, PISAR } from "../likovi";
import { Cup, Ovca, Palma, Plocica, Pustinja, Skladiste, Vuna } from "../drevno";
import { kad } from "../vreme";
import { REDOVI_1 } from "./Scena1";

export const Scena2: React.FC = () => {
  const f = useF();
  const kO = kad(2, "ovaca,");
  const kV = kad(2, "vune");
  const kU = kad(2, "ulja");
  const kS = kad(2, "skladište.");
  const red = (k: number) => napredak(f, k - 4, 18, Easing.linear);
  const ulaz = (k: number) => interpolate(f, [k - 14, k + 6], [-260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const unutra = napredak(f, kS, 16);
  const nestaje = 1 - unutra;
  const hod = (k: number) => (f < k + 6 ? f / 3 : undefined);
  return (
    <Kadar>
      <Hrapavo>
        <Pustinja horizont={1000} nebo="#B5D1CE" tlo="#C08A4E" />
        <g transform="translate(-40 1070)">
          <Palma s={0.7} nagib={-14} />
        </g>
        <g transform="translate(540 1250)">
          <Skladiste s={0.85} />
          <path d="M-64,0 L-64,-156 C-64,-202 64,-202 64,-156 L64,0Z" fill="#FFD98A" opacity={0.6 * unutra} />
        </g>
      </Hrapavo>
      <g transform="translate(540 760)">
        <Plocica w={720} h={460} redovi={REDOVI_1} napredak={[red(kO), red(kV), red(kU)]} />
      </g>
      {/* donosioci: stoje iznad trake titla */}
      <g transform={`translate(${ulaz(kO)} 0)`} opacity={f >= kO - 14 ? 1 : 0}>
        <Lik x={150} y={1310} s={0.56} {...NOSAC} hod={hod(kO)} lr={[20, 10]} dr={[50, 30]} />
        <g transform={`translate(${mesaj(290, 470, unutra)} 1320)`} opacity={nestaje}>
          <Ovca s={0.6} hod={f / 3} />
        </g>
      </g>
      <g transform={`translate(${-ulaz(kV)} 0)`} opacity={f >= kV - 14 ? 1 : 0}>
        <Lik x={800} y={1320} s={0.56} okreni {...NOSACICA} hod={hod(kV)} lr={[160, -10]} dr={[165, -10]} />
        <g transform={`translate(${mesaj(800, 610, unutra)} ${mesaj(1000, 1260, unutra)}) scale(${mesaj(0.7, 0.4, unutra)})`} opacity={nestaje}>
          <Vuna />
        </g>
      </g>
      <g transform={`translate(${-ulaz(kU)} 0)`} opacity={f >= kU - 14 ? 1 : 0}>
        <Lik x={960} y={1300} s={0.5} okreni {...PISAR} glava={{ ...PISAR.glava, bojaKose: "#5A4030", seed: 21 }} hod={hod(kU)} lr={[40, 50]} dr={[60, 50]} />
        <g transform={`translate(${mesaj(880, 600, unutra)} ${mesaj(1210, 1270, unutra)}) scale(${mesaj(0.6, 0.4, unutra)})`} opacity={nestaje}>
          <Cup />
        </g>
      </g>
    </Kadar>
  );
};
