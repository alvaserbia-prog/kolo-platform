// Scena 1 — „Danas je lako ukrasti novac, naročito onome ko je na položaju.“ (naslov stoji gore)
// Krupno: otvorena kasa na stolu. Na „ukrasti“ ruka u tamnom rukavu sa zlatnom manžetnom izvuče novčanicu i
// odnese je iz kadra. Na „položaju“ kamera se odmakne: iza stola visoka prazna fotelja. Lice se ne vidi.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Sto } from "../predmeti";
import { Kasa, Novcanica } from "../zgrada";
import { Fotelja, TamnaRuka } from "../razmena";
import { kad } from "../vreme";
import { Soba } from "./zajednicko20";

const KASA = { x: 470, y: 1112 };

export const Scena1: React.FC = () => {
  const f = useF();
  const kU = kad(1, "ukrasti");
  const kP = kad(1, "položaju.");
  // ruka: ulazi zdesna do kase, uhvati, odnese novčanicu udesno
  const ulaz = interpolate(f, [kU - 26, kU - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const izlaz = interpolate(f, [kU + 6, kU + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const rx = mesaj(1300, KASA.x + 40, ulaz) + izlaz * 900;
  const ry = mesaj(880, 960, ulaz) - izlaz * 60;
  const uzeo = f > kU - 2;
  const odmak = napredak(f, kP - 30, 40);
  return (
    <Kadar>
      <Kamera x={mesaj(KASA.x + 40, 540, odmak)} y={mesaj(1000, 880, odmak)} z={mesaj(2.1, 1, odmak)}>
        <Soba />
        <g transform="translate(540 1050)">
          <Fotelja s={1.05} />
        </g>
        <g transform="translate(540 1120)">
          <Sto w={900} h={180} stolnjak="#5E3B26" vez={false} />
        </g>
        <g transform={`translate(${KASA.x} ${KASA.y})`}>
          <Kasa s={0.9} otvor={1} pun={1} natpis="KASA" />
        </g>
        <g transform={`translate(${rx} ${ry}) rotate(${-8 + izlaz * 6})`}>
          {uzeo && (
            <g transform="translate(-30 -6) rotate(-12)">
              <Novcanica s={0.46} />
            </g>
          )}
          <TamnaRuka hvata={uzeo ? 1 : 0} />
        </g>
      </Kamera>
    </Kadar>
  );
};
