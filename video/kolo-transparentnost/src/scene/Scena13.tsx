// Scena 13 — „Na taj način članovi mogu sami da provere da li je bilo zloupotrebe.“
// Na „sami“ prst prelazi preko redova (kao prst stanarke preko table u sceni 6). Na „zloupotrebe“ lupa
// prođe preko spiska; svi redovi dobiju zelenu kvačicu, nijedan ne pocrveni.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, mesaj, napredak, useF } from "../alat";
import { EkranSistem, Lupa, Prst, VelikiTelefon } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina, TEL } from "./kolo";

const redY = (i: number) => TEL.y + TEL.s * (-170 + i * 78 - 8);

export const Scena13: React.FC = () => {
  const f = useF();
  const kS = kad(13, "sami");
  const kZ = kad(13, "zloupotrebe.");
  const kD = kad(13, "da", 2);
  // prst ide red po red (0–3), od „sami“ do drugog „da“
  const t = interpolate(f, [kS - 6, kD], [0, 3.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const red = Math.min(5, Math.floor(t));
  const ist: [number, number] = [red, Math.min(1, (t % 1) * 1.8)];
  const prstY = interpolate(f, [kS - 16, kS - 4, kD + 2, kD + 14], [900, 0, 0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const lupa = napredak(f, kZ - 10, 30, Easing.inOut(Easing.sin));
  const zeleno = napredak(f, kZ + 2, 24, Easing.linear);
  return (
    <Kadar>
      <KoloPozadina />
      <g transform={`translate(${TEL.x} ${TEL.y}) scale(${TEL.s})`}>
        <VelikiTelefon>
          <EkranSistem redova={6} isticanje={f < kD + 6 ? ist : undefined} zeleno={zeleno} />
        </VelikiTelefon>
      </g>
      <g transform={`translate(${TEL.x - 120 + (t % 1) * 160} ${redY(red) + 30 + prstY}) scale(0.5)`}>
        <Prst rukav={P.zelenaPrigusena} />
      </g>
      {lupa > 0 && lupa < 1 && (
        <g transform={`translate(${mesaj(TEL.x - 60, TEL.x + 80, Math.sin(lupa * Math.PI * 2) * 0.5 + 0.5)} ${mesaj(redY(0) - 40, redY(5) + 40, lupa)})`} opacity={Math.min(1, Math.min(lupa, 1 - lupa) * 8)}>
          <Lupa s={1.05} />
        </g>
      )}
    </Kadar>
  );
};
