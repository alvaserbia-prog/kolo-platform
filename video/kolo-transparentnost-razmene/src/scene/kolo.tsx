// Pozadina za scene sa telefonom u videu 20: noć, toplo svetlo fenjera koji visi iznad telefona.
import React from "react";
import { Hrapavo, useF } from "../alat";
import { P } from "../paleta";
import { Fenjer, N } from "../noc";

export const KoloPozadina: React.FC<{ sjaj?: number; fenjer?: boolean }> = ({ sjaj = 0.6, fenjer = true }) => {
  const f = useF();
  return (
    <g>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill={N.noc} />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "screen" }} />
      </Hrapavo>
      <circle cx={540} cy={700} r={720} fill="url(#plamen)" opacity={0.55 * (0.6 + sjaj * 0.6)} />
      <circle cx={540} cy={760} r={520} fill={P.zlatna} opacity={0.12 * sjaj} filter="url(#sjaj)" />
      {fenjer && (
        <g>
          <path d="M540,-20 L540,150" stroke={P.mastilo} strokeWidth={4} />
          <g transform={`translate(540 150) rotate(${Math.sin(f / 25) * 4})`}>
            <Fenjer s={0.9} f={f} />
          </g>
        </g>
      )}
    </g>
  );
};

export const TEL = { x: 540, y: 820, s: 1.02 };
