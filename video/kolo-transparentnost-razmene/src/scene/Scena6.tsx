// Scena 6 — „Tada niko ne može da vara neprimećeno, ni oni koji upravljaju ni bilo ko od nas, jer se za svaki
// POEN zna odakle je došao.“
// Ceo trg je pod fenjerima na kanapu, svi sanduci su stakleni. Na „vara“ iz mraka sa desne strane proviri
// tamna ruka ka jednom sanduku; na „neprimećeno“ fenjer se zanjiše ka njoj i ruka se povuče. Na „upravljaju“
// zasvetli zajednički sanduk, na „nas“ sanduci seljana. Od „jer“ između sanduka se iscrtavaju zlatne niti: niz
// svaku putuje pločica sa brojem POEN-a, pa se za svaki zna odakle je došao.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, mesaj, napredak, useF } from "../alat";
import { Fenjer, Mrak, Nebo, Nit, Sanduk, Trg } from "../noc";
import { TamnaRuka } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";

const SANDUCI: { x: number; y: number; s: number; natpis?: string }[] = [
  { x: 540, y: 900, s: 0.8, natpis: "ZAJEDNIČKO" },
  { x: 170, y: 1230, s: 0.56 },
  { x: 420, y: 1280, s: 0.56 },
  { x: 670, y: 1280, s: 0.56 },
  { x: 920, y: 1230, s: 0.56 },
];
const KANAP = Array.from({ length: 7 }, (_, i) => [90 + i * 150, 470 + Math.sin((i / 6) * Math.PI) * 90] as [number, number]);
const NITI: { od: number; ka: number; iznos: string }[] = [
  { od: 1, ka: 3, iznos: "+300" },
  { od: 4, ka: 2, iznos: "+500" },
  { od: 2, ka: 1, iznos: "+250" },
  { od: 0, ka: 4, iznos: "+400" },
];

export const Scena6: React.FC = () => {
  const f = useF();
  const kV = kad(6, "vara");
  const kNe = kad(6, "neprimećeno,");
  const kU = kad(6, "upravljaju");
  const kNas = kad(6, "nas,");
  const kJ = kad(6, "jer");
  const kD = kad(6, "došao.");
  const ruka = interpolate(f, [kV - 14, kV + 4, kNe + 2, kNe + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const njihanje = interpolate(f, [kNe - 6, kNe + 4, kNe + 20], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sjajU = napredak(f, kU - 2, 8) * (1 - napredak(f, kNas - 6, 10));
  const sjajN = napredak(f, kNas - 4, 8) * (1 - napredak(f, kJ, 12));
  const niti = (i: number) => interpolate(f, [kJ + i * ((kD - kJ) / 4), kJ + (i + 1) * ((kD - kJ) / 4) + 8], [0, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tamno = mesaj(0.62, 0.45, napredak(f, kJ, 20));
  const svetla = [
    ...KANAP.map(([x, y], i) => ({ x, y: y + 90, r: i === 6 ? 330 + 120 * njihanje : 330 })),
    { x: 540, y: 820, r: 300 + 140 * sjajU },
    ...SANDUCI.slice(1).map((s) => ({ x: s.x, y: s.y - 60, r: 200 + 120 * sjajN })),
  ];
  return (
    <Kadar>
      <Nebo />
      <Trg y={940} prozori={0.8} />
      {SANDUCI.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <Sanduk s={s.s} staklo={1} natpis={s.natpis} pun={i ? 0.5 : 1} />
        </g>
      ))}
      {NITI.map((n, i) => {
        const a = SANDUCI[n.od];
        const b = SANDUCI[n.ka];
        return <Nit key={i} a={[a.x, a.y - 120 * a.s]} b={[b.x, b.y - 120 * b.s]} napredak={niti(i)} iznos={n.iznos} luk={-140} />;
      })}
      {/* tamna ruka iz mraka */}
      <g transform={`translate(${mesaj(1300, 990, ruka)} 1110) rotate(-8)`}>
        <TamnaRuka />
      </g>
      <Mrak id="s6" svetla={svetla} jacina={tamno} />
      {/* kanap sa fenjerima preko trga */}
      <path d={`M-20,430 ${KANAP.map(([x, y]) => `L${x},${y}`).join(" ")} L1100,430`} fill="none" stroke={P.mastilo} strokeWidth={4} />
      {KANAP.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i === 6 ? njihanje * 25 : Math.sin(f / 20 + i) * 3})`}>
          <Fenjer s={0.75} f={f + i * 4} />
        </g>
      ))}
    </Kadar>
  );
};
