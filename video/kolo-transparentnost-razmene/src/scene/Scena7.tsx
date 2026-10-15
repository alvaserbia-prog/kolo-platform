// Scena 7 — „Tako je uređeno KOLO.“ Kamera se digne iznad trga: seljani sa fenjerima su se uhvatili u kolo,
// krug svetla se okreće, a u sredini uskoči znak KOLO.
import React from "react";
import { Kadar, Kamera, mesaj, napredak, useF, usePop } from "../alat";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { KRUG, KrugOdozgo } from "./krug";

export const Scena7: React.FC = () => {
  const f = useF();
  const kK = kad(7, "kolo.");
  const znak = usePop(kK - 8, 150, 10);
  const pojava = napredak(f, -8, 30);
  const z = napredak(f, -8, 70);
  return (
    <Kadar>
      <Kamera x={540} y={KRUG.cy + 120} z={mesaj(1.5, 1, z)} rot={mesaj(-12, 0, z)}>
        <KrugOdozgo
          ugao={f * 0.5}
          f={f}
          pojava={pojava}
          centar={
            <g transform={`translate(${KRUG.cx} ${KRUG.cy}) scale(${znak * 0.8})`}>
              <ZnakKolo id="znak7" />
            </g>
          }
        />
      </Kamera>
    </Kadar>
  );
};
