// Prelaz između scena: papirni list prebriše kadar (rez je sakriven ispod njega).
import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { Defs, Isecak, Pt } from "./papir";

const BOJE = [P.zelena700, P.zlatna400, P.korala, P.zelenaSvetla, P.nebo];
const SIRINA = 1500;
const POLA = 10; // frejmova pre i posle reza

const list = (x: number): Pt[] => {
  const pts: Pt[] = [];
  for (let y = -40; y <= 1960; y += 80) pts.push([x + (y % 160 ? 18 : -14), y]);
  for (let y = 1960; y >= -40; y -= 80) pts.push([x + SIRINA + (y % 160 ? -16 : 12), y]);
  return pts;
};

export const Prelazi: React.FC = () => {
  const f = useCurrentFrame();
  // samo između scena 1 i 2 — od scene 3 sveska ostaje u kadru bez reza
  const rez = [plan.scene[4].odF, plan.scene[5].odF];
  const i = rez.findIndex((r) => f >= r - POLA && f < r + POLA);
  if (i < 0) return null;
  const r = rez[i];
  const x = interpolate(f, [r - POLA, r + POLA], [1100, -SIRINA - 20], { easing: Easing.inOut(Easing.sin) });
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <Isecak pts={list(x)} boja={BOJE[i % BOJE.length]} seed={`prelaz${i}`} amp={6} korak={60} />
      <image href={staticFile("kolo-icon.png")} x={x + SIRINA / 2 - 110} y={850} width={220} height={207} opacity={0.9} />
    </svg>
  );
};
