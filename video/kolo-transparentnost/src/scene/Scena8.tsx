// Scena 8 — „Kada je evidencija dostupna svima, svako ima uvid da onaj ko upravlja ne uzima ništa za sebe.“
// Tabla bliže. Na „evidencija“ iznad sveske uskoči rukom pisana cedulja „EVIDENCIJA“. Na „svima“ pred tablom
// je sve više ljudi (deca, baka). Na „ne uzima“ ispod kolona se ispiše „ostalo u kasi: 2.850“, a pored table
// otvorena kasa sa istim brojem na cedulji: ništa ne fali.
import React from "react";
import { Easing } from "remotion";
import { Kadar, Kamera, Oblik, Pop, kutija, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { BAKA, DEVOJCICA, Kasa, MLADI_STANAR, STANAR, STANARKA } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";
import { RUKOPIS } from "../fontovi";
import { SVESKA_NA_TABLI, TABLA, UlazSaTablom } from "./zajednicko";

export const Cedulja: React.FC<{ tekst: string; w?: number; boja?: string; fs?: number }> = ({ tekst, w = 420, boja = P.mastilo, fs = 58 }) => (
  <g>
    <Oblik d={kutija(-w / 2, -50, w, 96, 4)} boja="#F6E9A8" debljina={3.5} tekstura={0.15} />
    <text y={20} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={fs} fill={boja}>
      {tekst}
    </text>
    <circle cx={0} cy={-38} r={9} fill={P.zelena500} stroke={P.mastilo} strokeWidth={2.5} />
  </g>
);

export const Scena8: React.FC = () => {
  const f = useF();
  const kE = kad(8, "evidencija");
  const kSv = kad(8, "svima,");
  const kSvako = kad(8, "svako");
  const kNe = kad(8, "ne");
  const kNi = kad(8, "ništa");
  const zum = napredak(f, 0, 50, Easing.inOut(Easing.cubic));
  return (
    <Kadar>
      <Kamera x={mesaj(540, 560, zum)} y={mesaj(960, 880, zum)} z={mesaj(1, 1.12, zum)}>
        <UlazSaTablom sveska={1} svetlo={1} sveskaProps={{ dodatniRed: 1, zbir: napredak(f, kNe - 2, 18, Easing.linear) }} />
        <Pop at={kE - 2} x={SVESKA_NA_TABLI.x} y={TABLA.y + 46} rot={-2}>
          <Cedulja tekst="EVIDENCIJA" w={200} fs={36} />
        </Pop>
        <Pop at={kNi - 2} x={940} y={1250}>
          <g>
            <Kasa s={0.8} otvor={1} pun={1} />
            <g transform="translate(0 -250) rotate(5)">
              <Cedulja tekst="2.850" w={200} fs={52} />
            </g>
          </g>
        </Pop>
        <Lik x={130} y={1330} s={0.74} {...STANARKA} glava={{ ...STANARKA.glava, izraz: "osmeh", pogled: [6, -6] }} />
        {f >= kSv - 8 && (
          <Pop at={kSv - 8} x={0} y={0} odozdo={60}>
            <Lik x={330} y={1360} s={0.6} {...DEVOJCICA} dete glava={{ ...DEVOJCICA.glava, izraz: "srecna" }} />
          </Pop>
        )}
        {f >= kSv && (
          <Pop at={kSv} x={0} y={0} odozdo={60}>
            <Lik x={520} y={1350} s={0.72} {...BAKA} glava={{ ...BAKA.glava, izraz: "osmeh", pogled: [0, -6] }} />
          </Pop>
        )}
        {f >= kSvako - 4 && (
          <Pop at={kSvako - 4} x={0} y={0} odozdo={60}>
            <Lik x={720} y={1340} s={0.74} {...MLADI_STANAR} glava={{ ...MLADI_STANAR.glava, izraz: "osmeh", pogled: [-4, -6] }} />
          </Pop>
        )}
        <Lik x={-20} y={1360} s={0.76} {...STANAR} glava={{ ...STANAR.glava, izraz: "osmeh", pogled: [8, -6] }} />
      </Kamera>
    </Kadar>
  );
};
