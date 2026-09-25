// Scena 3 — „Šta ako bismo mogli da pomognemo jedni drugima, bez novca?"
// Linije se iscrtavaju između kuća i povezuju ih.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Pop, Pt, napredak } from "../papir";
import { Korpa, Kuca, Kljuc, Pita, Upitnik } from "../likovi";
import { kad } from "../vreme";

const KUCE: { x: number; y: number; boja: string }[] = [
  { x: 230, y: 600, boja: P.sunce },
  { x: 660, y: 540, boja: "#CFE3C0" },
  { x: 900, y: 790, boja: P.narandza },
  { x: 250, y: 960, boja: "#F7DCC8" },
  { x: 740, y: 1060, boja: "#F6E7C8" },
  { x: 480, y: 1250, boja: P.sunce },
];
const VEZE: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [2, 4],
  [3, 4],
  [4, 5],
  [3, 5],
  [1, 3],
];
const centar = (i: number): Pt => [KUCE[i].x, KUCE[i].y - 95];

const luk = (a: Pt, b: Pt, k = 0.18): Pt[] => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c: Pt = [mx - dy * k, my + dx * k];
  return Array.from({ length: 9 }, (_, i): Pt => {
    const t = i / 8;
    return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  });
};

export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const pomognemo = kad(3, "pomognemo");
  const bez = kad(3, "bez");
  // predmeti putuju po vezama kad su linije nacrtane
  const putnici = [
    { veza: 0, od: pomognemo + 14, el: <Pita seed="s3-p" /> },
    { veza: 5, od: pomognemo + 22, el: <Korpa seed="s3-k" paradajza={4} /> },
    { veza: 7, od: pomognemo + 30, el: <Kljuc seed="s3-kl" /> },
  ];
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {VEZE.map(([a, b], i) => {
        const p = napredak(f, pomognemo - 6 + i * 5, 14);
        const deblja = f > bez ? 1 + 0.3 * Math.sin((f - bez) / 3) : 1;
        return <Crta key={i} pts={luk(centar(a), centar(b), i % 2 ? 0.16 : -0.16)} seed={`s3-v${i}`} boja={P.zelena700} debljina={9 * deblja} napredak={p} />;
      })}
      {KUCE.map((k, i) => (
        <Pop key={i} at={3 + i * 3} x={k.x} y={k.y} skala={0.62}>
          <Kuca seed={`s3-k${i}`} fasada={k.boja} krov={i % 2 ? P.korala : P.korala600} kapci={i % 3 ? P.zelena700 : P.nebo} />
        </Pop>
      ))}
      {putnici.map((p, i) => {
        const [a, b] = VEZE[p.veza];
        const put = luk(centar(a), centar(b), p.veza % 2 ? 0.16 : -0.16);
        const t = napredak(f, p.od, 40);
        if (f < p.od) return null;
        const idx = t * (put.length - 1);
        const k = Math.min(put.length - 2, Math.floor(idx));
        const u = idx - k;
        const x = put[k][0] + (put[k + 1][0] - put[k][0]) * u;
        const y = put[k][1] + (put[k + 1][1] - put[k][1]) * u;
        return (
          <Pop key={i} at={p.od} x={x} y={y - 40} skala={0.36}>
            {p.el}
          </Pop>
        );
      })}
      <Pop at={kad(3, "Šta")} x={540} y={250} skala={0.85} njihanje={4}>
        <Upitnik seed="s3-upit" />
      </Pop>
    </svg>
  );
};
