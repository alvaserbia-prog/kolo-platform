// Sc. 1 — „Nekada je priroda bila zajedničko dobro.“
// Bačka ravnica u zoru: bunar sa đermom, ljudi oko njega, krave u daljini, topole na horizontu.
// Kamera polako prilazi; đeram spušta kofu; ljudi dolaze redom na izgovorene reči.
import React from "react";
import { Hrapavo, Kadar, Kamera, Pop, dah, mesaj, napredak, useF } from "../alat";
import { P } from "../paleta";
import { Bunar, Busen, Covek, Krava, Nebo, Ptica, Ravnica, Salas, Sunce, Topola } from "../motivi";
import { kad, trajanjeF } from "../vreme";

export const Pejzaz: React.FC<{ f: number; sunceY?: number }> = ({ f, sunceY = 560 }) => (
  <>
    <Nebo od={120} do={1010} pomakX={f * 0.4} />
    <g transform={`translate(790 ${sunceY})`}>
      <Sunce r={78} />
    </g>
    <g transform="translate(90 1030)">
      <Topola s={0.55} />
    </g>
    <g transform="translate(150 1036)">
      <Topola s={0.42} />
    </g>
    <g transform="translate(960 1030)">
      <Topola s={0.6} />
    </g>
    <g transform="translate(250 1040)">
      <Salas s={0.42} />
    </g>
    <Ravnica y={1030} />
    {[
      [120, 1140],
      [860, 1180],
      [640, 1110],
      [980, 1300],
      [80, 1420],
      [300, 1600],
      [900, 1650],
    ].map(([x, y], i) => (
      <Busen key={i} x={x} y={y} s={0.9 + (y - 1100) / 700} />
    ))}
  </>
);

export const Scena1: React.FC = () => {
  const f = useF();
  const T = trajanjeF(1);
  const z = mesaj(1.0, 1.1, napredak(f, 0, T));
  const ugao = -22 + 30 * (0.5 - 0.5 * Math.cos((f / 70) * Math.PI));
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1060} z={z}>
          <Pejzaz f={f} />
          <g transform="translate(860 1085)">
            <Krava s={0.32} smer={-1} glavaDole={0.5 + 0.5 * dah(f, 80)} />
          </g>
          <g transform="translate(700 1075)">
            <Krava s={0.26} glavaDole={0.5 + 0.5 * dah(f, 95, 20)} />
          </g>
          <g transform="translate(470 1330)">
            <g transform="scale(1.2)">
              <Bunar ugao={ugao} />
            </g>
          </g>
          <Pop at={kad(1, "Nekada") - 4} x={190} y={1420}>
            <Covek tip="z" boja={P.rdja} boja2={P.oker} ruke={[-6, 8]} predmet="kofa" s={1.05} korak={0} />
          </Pop>
          <Pop at={kad(1, "priroda") - 2} x={830} y={1450}>
            <Covek tip="m" boja={P.travaTamna} smer={-1} ruke={[40, 6]} s={1.08} />
          </Pop>
          <Pop at={kad(1, "zajedničko") - 2} x={690} y={1520}>
            <Covek tip="d" boja={P.oker} boja2={P.rdja} smer={-1} ruke={[70, -10]} s={1.1} />
          </Pop>
          <Pop at={kad(1, "dobro.") - 2} x={330} y={1560}>
            <Covek tip="sta" boja={P.mastiloMeko} boja2={P.okerTamni} ruke={[20, 0]} predmet="korpa" s={1.05} />
          </Pop>
          {[0, 1, 2].map((i) => (
            <Ptica key={i} x={((f * (2.2 + i * 0.4) + i * 180) % 900) + 120} y={430 + i * 46 + Math.sin(f / 20 + i) * 10} s={0.9 - i * 0.15} mah={f / 3 + i} />
          ))}
        </Kamera>
      </Hrapavo>
    </Kadar>
  );
};
