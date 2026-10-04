// Scena 4 — „Odeš kod lekara ili u apoteku, pa opet participacija, a doprinos za zdravstvo si već dao.“
// Apoteka sa zelenim krstom. Na „participacija“ uskoči račun sa crvenim pečatom, na „doprinos“
// pored njega listić „doprinos za zdravstvo“ sa kvačicom: već dato.
import React from "react";
import { P } from "../paleta";
import { NASLOV, SANS } from "../fontovi";
import { Hrapavo, Kadar, Oblik, Pop, kutija, useF } from "../alat";
import { Zig } from "../predmeti";
import { kad } from "../vreme";
import { List, Soba } from "./zajednicko";

const Apoteka: React.FC = () => (
  <g>
    <Oblik d={kutija(-400, -260, 800, 520, 10)} boja="#E7ECE6" />
    <Oblik d={kutija(-420, -300, 840, 70, 8)} boja={P.zelenaTamna} />
    <text y={-250} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={54} fill={P.krem} letterSpacing={4}>
      APOTEKA
    </text>
    <Oblik d={kutija(-330, -170, 260, 300, 8)} boja="#BFD3D6" />
    <Oblik d={kutija(70, -170, 260, 300, 8)} boja="#BFD3D6" />
    {[-260, -200, -140].map((x) => (
      <rect key={x} x={x} y={40} width={36} height={60} rx={6} fill={P.belo} stroke={P.mastilo} strokeWidth={3} />
    ))}
    {/* zeleni krst */}
    <g transform="translate(200 -40)">
      <Oblik d="M-24,-80 L24,-80 L24,-24 L80,-24 L80,24 L24,24 L24,80 L-24,80 L-24,24 L-80,24 L-80,-24 L-24,-24Z" boja={P.zelena500} debljina={4} />
    </g>
  </g>
);

export const Scena4: React.FC = () => {
  useF();
  return (
    <Kadar>
      <Hrapavo>
        <Soba zid="#C3CCC6" />
        <g transform="translate(500 620) scale(0.95)">
          <Apoteka />
        </g>
      </Hrapavo>
      <Pop at={kad(4, "participacija,") - 4} x={200} y={1090} rot={-5}>
        <List w={300} h={260}>
          <text y={-80} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={P.mastilo}>
            RAČUN
          </text>
          {[-40, -5, 30].map((y) => (
            <line key={y} x1={-110} y1={y} x2={110} y2={y} stroke={P.mastilo} strokeWidth={3} opacity={0.35} />
          ))}
          <g transform="translate(10 60) rotate(-12)">
            <text textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.ajvar}>
              participacija
            </text>
          </g>
        </List>
      </Pop>
      <Pop at={kad(4, "doprinos") - 4} x={510} y={1100} rot={4}>
        <List w={300} h={260}>
          <text y={-70} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={28} fill={P.mastilo}>
            doprinos za
          </text>
          <text y={-34} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={28} fill={P.mastilo}>
            zdravstvo
          </text>
          <g transform="translate(0 50)">
            <Zig tekst="DATO" boja={P.plava} s={0.7} />
          </g>
        </List>
      </Pop>
    </Kadar>
  );
};
