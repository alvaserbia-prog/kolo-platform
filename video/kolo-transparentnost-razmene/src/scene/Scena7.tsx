// Scena 7 — „Tako je uređeno KOLO.“ Znak KOLO uskoči na zelenoj svetlosti.
import React from "react";
import { Kadar, napredak, useF, usePop } from "../alat";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina } from "./kolo";

export const Scena7: React.FC = () => {
  const f = useF();
  const kK = kad(7, "tako");
  const znak = usePop(kK - 2, 150, 10);
  const zraci = napredak(f, kK - 2, 14);
  return (
    <Kadar>
      <KoloPozadina sjaj={0.8} />
      <g transform="translate(540 720)" opacity={zraci}>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M0,-240 L20,-600 L-20,-600Z" fill={P.zelenaSvetla} opacity={0.4} transform={`rotate(${i * 22.5 + f * 0.6})`} />
        ))}
      </g>
      <g transform={`translate(540 720) scale(${znak * 1.05})`}>
        <ZnakKolo id="znak7" />
      </g>
    </Kadar>
  );
};
