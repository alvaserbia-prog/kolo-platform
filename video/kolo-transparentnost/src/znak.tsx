// Znak KOLO (zeleni kvadrat sa logotipom), isti kao u ostalim videima serije.
import React from "react";
import { staticFile } from "remotion";
import { P } from "./paleta";

export const ZnakKolo: React.FC<{ s?: number; id?: string }> = ({ s = 1, id = "znak" }) => (
  <g transform={`scale(${s})`}>
    <defs>
      <clipPath id={`${id}Clip`}>
        <rect x={-190} y={-190} width={380} height={380} rx={70} />
      </clipPath>
    </defs>
    <rect x={-196} y={-180} width={392} height={392} rx={74} fill={P.senka} opacity={0.3} filter="url(#blur14)" />
    <g clipPath={`url(#${id}Clip)`}>
      <rect x={-190} y={-190} width={380} height={380} fill={P.zelena900} />
      <image href={staticFile("kolo-hero-logo.png")} x={-190} y={-199} width={380} height={398} />
    </g>
    <rect x={-190} y={-190} width={380} height={380} rx={70} fill="none" stroke={P.mastilo} strokeWidth={5} />
  </g>
);
