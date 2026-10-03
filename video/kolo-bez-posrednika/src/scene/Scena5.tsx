// Scena 5 — „Kod zubara ti osiguranje ne važi.“
// Veliki zub i zdravstvena knjižica; na „važi.“ preko knjižice pada crveni pečat „NE VAŽI“.
import React from "react";
import { P } from "../paleta";
import { NASLOV, SANS } from "../fontovi";
import { Hrapavo, Kadar, Oblik, Pop, kutija, useF } from "../alat";
import { kad } from "../vreme";
import { Soba } from "./zajednicko";

export const Scena5: React.FC = () => {
  const f = useF();
  const kVazi = kad(5, "važi.");
  const lj = Math.sin(f / 6) * 2;
  return (
    <Kadar>
      <Hrapavo>
        <Soba zid="#C9D3D3" />
      </Hrapavo>
      <g transform={`translate(470 700) rotate(${lj})`}>
        <Oblik d="M-170,-170 C-230,-170 -250,-80 -220,10 C-200,80 -180,200 -150,260 C-120,300 -90,260 -70,180 C-50,110 50,110 70,180 C90,260 120,300 150,260 C180,200 200,80 220,10 C250,-80 230,-170 170,-170 C110,-170 60,-130 0,-130 C-60,-130 -110,-170 -170,-170Z" boja={P.belo} debljina={6} />
        <circle cx={-70} cy={-40} r={14} fill={P.mastilo} />
        <circle cx={70} cy={-40} r={14} fill={P.mastilo} />
        <path d={f >= kVazi ? "M-60,40 Q0,10 60,40" : "M-60,30 Q0,70 60,30"} fill="none" stroke={P.mastilo} strokeWidth={8} strokeLinecap="round" />
      </g>
      <g transform="translate(380 1120) rotate(-6)">
        <Oblik d={kutija(-200, -120, 400, 240, 14)} boja={P.plava} />
        <text y={-50} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={36} fill={P.krem}>
          ZDRAVSTVENA
        </text>
        <text y={-6} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={36} fill={P.krem}>
          KNJIŽICA
        </text>
        <Pop at={kVazi - 2} x={0} y={60} rot={-10} skala={1.1}>
          <rect x={-150} y={-44} width={300} height={88} rx={10} fill="none" stroke={P.ajvar} strokeWidth={8} />
          <text y={18} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={52} fill={P.ajvar} letterSpacing={3}>
            NE VAŽI
          </text>
        </Pop>
      </g>
    </Kadar>
  );
};
