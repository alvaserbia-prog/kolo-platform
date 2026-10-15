// Scena 3 — „Samo tako možemo biti sigurni da ništa ne uzima za sebe.“
// Krupno stakleni sanduk pod četiri fenjera: svežanj novčanica i sveska. Svetlo prelazi preko sveske red po red;
// na „sebe“ upravnik raširi prazne ruke iznad sanduka, uz njih zelena kvačica.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF, usePop } from "../alat";
import { Lik } from "../likovi";
import { Fenjer, Mrak, Nebo, Sanduk, Trg } from "../noc";
import { kad } from "../vreme";
import { P } from "../paleta";
import { UPRAVNIK } from "./svet";

const FENJERI: [number, number][] = [
  [250, 560],
  [430, 500],
  [650, 500],
  [830, 560],
];

export const Scena3: React.FC = () => {
  const f = useF();
  const kT = kad(3, "tako");
  const kS = kad(3, "sebe.");
  const ist = interpolate(f, [kT, kS - 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruke = napredak(f, kS - 12, 14, Easing.out(Easing.back(1.5)));
  const kv = usePop(kS - 2);
  const zum = napredak(f, 0, 60);
  return (
    <Kadar>
      <Kamera x={540} y={mesaj(980, 960, zum)} z={mesaj(1.05, 1.12, zum)}>
        <Nebo />
        <Trg y={1220} />
        <Lik x={540} y={1260} s={0.72} {...UPRAVNIK} glava={{ ...UPRAVNIK.glava, izraz: ruke > 0.5 ? "osmeh" : "mirna", pogled: [0, 4] }} lr={[mesaj(10, -120, ruke), mesaj(8, -40, ruke)]} dr={[mesaj(-10, 120, ruke), mesaj(-8, 40, ruke)]} />
        <g transform="translate(540 1260)">
          <Sanduk s={1.25} staklo={1} isticanje={ist} />
        </g>
        {FENJERI.map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x},${y} L${x},${y - 400}`} stroke={P.mastilo} strokeWidth={3} />
            <g transform={`translate(${x} ${y})`}>
              <Fenjer s={0.9} f={f + i * 5} />
            </g>
          </g>
        ))}
        <Mrak id="s3" svetla={[...FENJERI.map(([x, y]) => ({ x, y: y + 80, r: 280 })), { x: 540, y: 1100, r: 520 }]} jacina={0.75} />
      </Kamera>
      {kv > 0 && (
        <g transform={`translate(850 860) scale(${kv})`}>
          <circle r={56} fill={P.zelena500} stroke="#fff" strokeWidth={7} />
          <path d="M-24,0 L-7,17 L26,-19" fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </Kadar>
  );
};
