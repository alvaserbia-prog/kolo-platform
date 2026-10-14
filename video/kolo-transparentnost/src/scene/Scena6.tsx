// Scena 6 — „Tada je svaki stanar mogao sam da proveri svaku uplatu i svaki trošak.“
// Krupno tabla sa sveskom. Upitnici iz scene 4 vise u uglovima. Na „uplatu“ prst stanarke prelazi preko
// reda „stan 4 · 2.000“ (njena uplata), na „trošak“ prst stanara preko „sijalica u ulazu · 450“; uz svaku
// proveru po jedan upitnik nestane.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Prst, Upitnik } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";
import { SVESKA_NA_TABLI, TABLA, UlazSaTablom } from "./zajednicko";

// red u svesci na tabli → tačka u kadru (pre kamere)
const RED = (i: number, desno: boolean) => ({
  x: SVESKA_NA_TABLI.x + SVESKA_NA_TABLI.s * (desno ? 170 : -200),
  y: SVESKA_NA_TABLI.y + SVESKA_NA_TABLI.s * (-250 + 132 + i * 74 - 14),
});

export const Scena6: React.FC = () => {
  const f = useF();
  const kP = kad(6, "proveri");
  const kU = kad(6, "uplatu");
  const kT = kad(6, "trošak.");
  const kS = kad(6, "stanar");
  const ist1 = napredak(f, kU - 4, 16, Easing.out(Easing.cubic));
  const ist2 = napredak(f, kT - 4, 16, Easing.out(Easing.cubic));
  const prst1 = interpolate(f, [kU - 18, kU - 2, kT - 14, kT - 2], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const prst2 = interpolate(f, [kT - 16, kT - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const r1 = RED(1, false);
  const r2 = RED(0, true);
  const nestaje = (k: number) => 1 - napredak(f, k, 10);
  const zum = napredak(f, 0, 40);
  return (
    <Kadar>
      <Kamera x={mesaj(560, TABLA.x + TABLA.w / 2, zum)} y={mesaj(900, TABLA.y + TABLA.h / 2 + 60, zum)} z={mesaj(1.3, 1.62, zum)}>
        <UlazSaTablom sveska={1} svetlo={1} sveskaProps={{ isticanje: [[1, ist1], [3, ist2]] }} />
        {/* prst stanarke (roze rukav) i prst stanara (oker rukav) */}
        <g transform={`translate(${r1.x + ist1 * 90} ${r1.y + prst1 * 700}) scale(0.42)`}>
          <Prst rukav={P.roze} rot={-8} />
        </g>
        <g transform={`translate(${r2.x + ist2 * 80} ${r2.y + prst2 * 700}) scale(0.42)`}>
          <Prst rukav={P.oker} koza={P.koza2} rot={6} />
        </g>
      </Kamera>
      {/* upitnici iz scene 4: nestaju jedan po jedan */}
      {[
        [150, 300, kS, -12],
        [930, 330, kP, 10],
        [140, 1180, kU + 6, 8],
        [940, 1160, kT + 6, -10],
      ].map(([x, y, k, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${nestaje(k as number) * 1.1})`} opacity={nestaje(k as number)}>
          <Upitnik />
        </g>
      ))}
    </Kadar>
  );
};
