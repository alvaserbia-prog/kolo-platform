// Scena 6 — „Sipaš gorivo, platiš i akcize.“
// Pumpa sa crevom; na ekranu pumpe stub se puni, a na „akcize“ se njegov veći deo oboji crveno
// i dobije cedulju „akcize“.
import React from "react";
import { P } from "../paleta";
import { NASLOV } from "../fontovi";
import { Hrapavo, Kadar, Linija, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { kad } from "../vreme";
import { Cedulja, HLADNO } from "./zajednicko";

export const Scena6: React.FC = () => {
  const f = useF();
  const kAk = kad(6, "akcize.");
  const puni = napredak(f, kad(6, "Sipaš"), 40);
  const ak = napredak(f, kAk, 14);
  const H = 300;
  return (
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill={HLADNO.nebo} />
        <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        <rect x={0} y={1180} width={1080} height={800} fill="#8F948C" />
        <Oblik d={kutija(-40, 360, 1160, 60, 4)} boja={P.ajvar} />
        <Oblik d={kutija(120, 420, 30, 760, 4)} boja="#9FA59E" />
      </Hrapavo>
      <g transform="translate(470 1180)">
        <Oblik d={kutija(-170, -700, 340, 700, 24)} boja={P.ajvar} />
        <Oblik d={kutija(-130, -640, 260, 380, 12)} boja={P.belo} />
        {/* stub na ekranu: gorivo (zlatno) i akcize (crveno) */}
        <rect x={-50} y={-300 - H * puni} width={100} height={H * puni} fill={P.zlatna} stroke={P.mastilo} strokeWidth={3} />
        <rect x={-50} y={-300 - H * puni} width={100} height={H * puni * 0.55 * ak} fill={P.ajvar} stroke={P.mastilo} strokeWidth={3} />
        <text y={-600} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={38} fill={P.mastilo}>
          GORIVO
        </text>
        <Oblik d={kutija(-190, -40, 380, 40, 6)} boja="#6B6F6A" />
        {/* crevo i pištolj */}
        <Linija d="M170,-420 C260,-420 270,-200 230,-140" debljina={14} boja={P.mastilo} />
        <Oblik d="M210,-160 L270,-150 L262,-110 L220,-118Z" boja="#6B6F6A" debljina={3.5} />
      </g>
      <Pop at={kAk - 2} x={300} y={760} rot={-8}>
        <Cedulja tekst="akcize" sirina={240} velicina={40} boja={P.ajvar} />
      </Pop>
    </Kadar>
  );
};
