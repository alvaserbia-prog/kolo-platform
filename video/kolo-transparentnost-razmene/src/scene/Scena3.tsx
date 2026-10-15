// Scena 3 — „Samo tako možemo biti sigurni da ništa ne uzima za sebe.“
// Krupno sveska kase na tabli. Prst prelazi preko uplata i troškova; na „sigurni“ se ispiše „ostalo u kasi:
// 3.150“, a ispod table otvorena kasa ZGRADA sa istim brojem na cedulji. Na „sebe“ pečat „U REDU“.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, Pop, mesaj, napredak, useF } from "../alat";
import { Kasa, Prst } from "../zgrada";
import { Zig } from "../predmeti";
import { kad } from "../vreme";
import { P } from "../paleta";
import { RUKOPIS } from "../fontovi";
import { SVESKA_NA_TABLI, UlazSaTablom } from "./zajednicko";

export const Scena3: React.FC = () => {
  const f = useF();
  const kT = kad(3, "tako");
  const kS = kad(3, "sigurni");
  const kSe = kad(3, "sebe.");
  const t = interpolate(f, [kT, kS], [0, 5.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const red = Math.floor(t);
  const ist: [number, number][] = f < kS + 4 ? [[red, Math.min(1, (t % 1) * 1.6)]] : [];
  const desno = red >= 3;
  const px = SVESKA_NA_TABLI.x + SVESKA_NA_TABLI.s * (desno ? 170 : -200) + (t % 1) * 80;
  const py = SVESKA_NA_TABLI.y + SVESKA_NA_TABLI.s * (-250 + 132 + (red % 3) * 74 - 14);
  const prst = interpolate(f, [kT - 12, kT, kS, kS + 12], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const zbir = napredak(f, kS - 2, 22, Easing.linear);
  const odmak = napredak(f, kS + 10, 26);
  return (
    <Kadar>
      <Kamera x={SVESKA_NA_TABLI.x} y={mesaj(SVESKA_NA_TABLI.y + 80, SVESKA_NA_TABLI.y + 200, odmak)} z={mesaj(1.7, 1.35, odmak)}>
        <UlazSaTablom sveska={1} svetlo={1} vrata={false} sveskaProps={{ isticanje: ist, zbir }} />
        <g transform={`translate(${px} ${py + prst * 1400}) scale(0.4)`}>
          <Prst rukav={P.oker} koza={P.koza2} rot={4} />
        </g>
        <g transform={`translate(${SVESKA_NA_TABLI.x} 1120)`} opacity={odmak}>
          <Kasa s={0.62} otvor={1} pun={1} />
          <g transform="translate(150 -60) rotate(6)">
            <rect x={-70} y={-34} width={140} height={60} rx={6} fill={P.belo} stroke={P.mastilo} strokeWidth={3} />
            <text y={10} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={36} fill={P.mastilo}>
              3.150
            </text>
          </g>
        </g>
      </Kamera>
      <Pop at={kSe - 4} x={800} y={560} rot={-12} skala={1.25}>
        <Zig tekst="U REDU" />
      </Pop>
    </Kadar>
  );
};
