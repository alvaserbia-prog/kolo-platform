// Scena 7 — „I Đura više nije morao da se pravda.“
// Ulaz: Đura prolazi uspravno, sa osmehom; stanar ga pozdravi podignutom rukom, stanarka se nasmeje.
// U prolazu Đura dopiše nov red u svesku na tabli („metla i krpe · 300“).
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, napredak, useF } from "../alat";
import { Lik, ikRuka } from "../likovi";
import { DJURA, STANAR, STANARKA } from "../zgrada";
import { kad } from "../vreme";
import { SVESKA_NA_TABLI, UlazSaTablom } from "./zajednicko";

export const Scena7: React.FC = () => {
  const f = useF();
  const kV = kad(7, "više");
  const kN = kad(7, "nije");
  const kP = kad(7, "pravda.");
  const stoj = f >= kN - 4 && f < kP + 4;
  const x = interpolate(f, [0, kN - 4, kP + 4, kP + 60], [120, 470, 470, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const red = napredak(f, kN, 22, Easing.linear);
  const pise = ikRuka(x, 1360, 0.84, SVESKA_NA_TABLI.x + 60, SVESKA_NA_TABLI.y + 90);
  return (
    <Kadar>
      <UlazSaTablom sveska={1} svetlo={1} sveskaProps={{ dodatniRed: red }} />
      <Lik x={830} y={1330} s={0.76} okreni {...STANAR} glava={{ ...STANAR.glava, izraz: "osmeh", pogled: [-6, 0] }} dr={f > kV ? [150, 20] : [-10, -6]} />
      <Lik x={970} y={1350} s={0.72} okreni {...STANARKA} glava={{ ...STANARKA.glava, izraz: f > kV + 6 ? "srecna" : "osmeh", pogled: [-6, 0] }} />
      <Lik x={x} y={1360} s={0.84} {...DJURA} glava={{ ...DJURA.glava, izraz: "osmeh", pogled: stoj ? [4, -6] : [6, 0] }} glavaNagib={-3} hod={stoj ? undefined : f / 3} dr={stoj ? pise : [-12, -8]} />
    </Kadar>
  );
};
