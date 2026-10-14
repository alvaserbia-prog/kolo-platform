// Scena 5 — „Narod Inka u Južnoj Americi nije imao pismo. Zapisivali su čvorovima na užetu.“
// Listanje: Andi, terase, lama. Na „Inka“ uskoči kartuša sa narodom, mestom i vremenom. Čuvar kipua
// stoji na sredini; na „čvorovima“ iz njegovih ruku se razvije kipu i na koncima se pojave čvorovi.
import React from "react";
import { Hrapavo, Kadar, Pop, napredak, useF } from "../alat";
import { ANDI_ZENA, KIPUKAMAJOK, Lik } from "../likovi";
import { Andi, Kipu, Lama, MestoVreme, Terase } from "../drevno";
import { kad } from "../vreme";
import { P } from "../paleta";

export const KONCI = [
  { boja: "#E9B93C", cvorovi: [1, 3, 5] }, // kukuruz
  { boja: "#F3ECDD", cvorovi: [0, 4, 2] }, // vuna
  { boja: "#9C6B43", cvorovi: [2, 1, 3] }, // krompir
  { boja: P.ajvar, cvorovi: [0, 2, 4] },
  { boja: P.zelenaPrigusena, cvorovi: [1, 0, 6] },
];

export const Scena5: React.FC = () => {
  const f = useF();
  const kI = kad(5, "Inka");
  const kC = kad(5, "čvorovima");
  const kU = kad(5, "užetu.");
  return (
    <Kadar>
      <Hrapavo>
        <Andi />
        <Terase x={760} y={1080} s={0.7} />
        <g transform="translate(900 1330)">
          <Lama s={0.62} okreni />
        </g>
      </Hrapavo>
      <Lik x={540} y={1320} s={0.78} {...KIPUKAMAJOK} glava={{ ...KIPUKAMAJOK.glava, izraz: "mirna", pogled: [0, 3] }} lr={[110, -40]} dr={[-110, 40]} />
      <Lik x={190} y={1310} s={0.62} {...ANDI_ZENA} glava={{ ...ANDI_ZENA.glava, izraz: "osmeh", pogled: [4, 1] }} />
      <g transform="translate(540 930) scale(0.8)">
        <Kipu
          konci={KONCI.map((k, i) => ({ ...k, napredak: napredak(f, kC - 6 + i * 4, 18), cvorNapredak: napredak(f, kU - 6, 26) }))}
          x0={-300}
          x1={300}
          duzina={420}
        />
      </g>
      <Pop at={kI - 4} x={540} y={250} rot={2}>
        <MestoVreme mesto="INKE" vreme="Južna Amerika, XV i XVI vek" />
      </Pop>
    </Kadar>
  );
};
