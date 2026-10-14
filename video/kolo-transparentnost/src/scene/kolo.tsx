// Zajedničko za scene 10–14: pozadina „KOLO“ (topao papir, zelena svetlost) i telefon sa stranicom Sistem.
import React from "react";
import { Hrapavo } from "../alat";
import { P } from "../paleta";

export const KoloPozadina: React.FC<{ sjaj?: number }> = ({ sjaj = 0.6 }) => (
  <g>
    <Hrapavo>
      <rect x={-100} y={-100} width={1300} height={2200} fill="#EFE6CC" />
      <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
    </Hrapavo>
    <circle cx={540} cy={760} r={620} fill={P.zelena100} opacity={sjaj} filter="url(#sjaj)" />
  </g>
);

export const TEL = { x: 540, y: 760, s: 1.08 };
