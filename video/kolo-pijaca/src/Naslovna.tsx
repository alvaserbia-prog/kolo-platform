// Naslovna (cover) za mreže: maketa pijace odozgo, Radina tezga u sredini, krupan naslov.
// Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, ucitajFontove } from "./fontovi";
import { Defs, Kamera, Tegla, iso } from "./iso";
import { SvetPijace, tezga } from "./svet";

ucitajFontove();

export const Naslovna: React.FC = () => {
  const r = tezga("rada");
  const [x, y] = iso(r.x + 85, r.y + 200, 60);
  return (
    <AbsoluteFill style={{ background: P.nebo }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Defs />
        <Kamera x={x} y={y} z={1.05} cy={1080}>
          <SvetPijace pecatRada={1} svetlo={(id) => (id === "rada" ? 1 : 0)} />
        </Kamera>
        <g transform="translate(540,520)">
          <rect x={-420} y={-170} width={840} height={330} rx={60} fill="#fff" stroke={P.mastilo} strokeWidth={8} filter="url(#senkaMeka)" />
          <text y={-10} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={150} fill={P.zelena700}>Pijaca</text>
          <text y={95} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={48} fill={P.mastilo}>ponudi ono što imaš u višku</text>
          <g transform="translate(360,-120) rotate(12)">
            <Tegla s={2} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
