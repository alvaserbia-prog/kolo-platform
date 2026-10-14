// Scena 10 — „Tako radi i KOLO.“ Prelaz: tabla iz ulaza se okrene kao karton, a s druge strane je
// telefon; na „KOLO“ na ekranu uskoči znak KOLO.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, useF, usePop } from "../alat";
import { OglasnaTabla, SveskaKase, VelikiTelefon } from "../zgrada";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { KoloPozadina, TEL } from "./kolo";

export const Scena10: React.FC = () => {
  const f = useF();
  const kR = kad(10, "radi");
  const kK = kad(10, "KOLO.");
  const okret = interpolate(f, [kR - 4, kR + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const sx = Math.abs(Math.cos(okret * Math.PI));
  const znak = usePop(kK - 2, 150, 10);
  return (
    <Kadar>
      <KoloPozadina sjaj={okret * 0.6} />
      <g transform={`translate(540 760) scale(${okret < 0.5 ? sx * 1.3 : sx} ${okret < 0.5 ? 1.3 : 1})`}>
        {okret < 0.5 ? (
          <g transform="translate(-320 -210)">
            <OglasnaTabla w={640} h={420} svetlo={1} natpis={false} />
            <g transform="translate(252 252) scale(0.62)">
              <SveskaKase dodatniRed={1} zbir={1} />
            </g>
          </g>
        ) : (
          <g transform={`scale(${TEL.s})`}>
            <VelikiTelefon>
              <rect x={-200} y={-390} width={400} height={780} rx={26} fill="#0F3D20" />
              <g transform={`translate(0 -20) scale(${0.62 * znak})`}>
                <ZnakKolo id="znak10" />
              </g>
            </VelikiTelefon>
          </g>
        )}
      </g>
    </Kadar>
  );
};
