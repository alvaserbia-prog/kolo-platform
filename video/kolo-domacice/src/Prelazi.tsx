// Prelazi između stranica slikovnice.
//  „list“: stranica se okreće — pregib ide zdesna nalevo, stara stranica je odsečena levo od
//          pregiba, desno se vidi poleđina lista (krem, sa senkom), ispod je nova stranica.
//  „rastapanje“: nova stranica se pojavi preko stare, kao da se boja razlila.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { Defs } from "./alat";

export type Prelaz = { tip: "list" | "rastapanje"; pola: number };
// prelaz posle scene i (i = 0 → između scene 1 i 2)
export const PRELAZI: Prelaz[] = [
  { tip: "list", pola: 16 }, // 1 → 2: sećanje
  { tip: "rastapanje", pola: 9 }, // 2 → 3
  { tip: "rastapanje", pola: 9 }, // 3 → 4
  { tip: "list", pola: 14 }, // 4 → 5: jesen, odluka
  { tip: "list", pola: 16 }, // 5 → 6: preokret
  { tip: "rastapanje", pola: 9 }, // 6 → 7
  { tip: "rastapanje", pola: 9 }, // 7 → 8
  { tip: "list", pola: 14 }, // 8 → 9: povratak u kuhinju
  { tip: "rastapanje", pola: 10 }, // 9 → 10
];

type V = [number, number];
/** Pregib za napredak p (0–1): tačka na vrhu i na dnu ekrana. */
const pregib = (p: number): [V, V] => {
  const e = Easing.inOut(Easing.cubic)(p);
  const xt = interpolate(e, [0, 1], [1080 + 40, -900]);
  const xb = xt + interpolate(e, [0, 1], [420, 900]);
  return [
    [xt, 0],
    [xb, 1920],
  ];
};

const odrazi = (q: V, a: V, b: V): V => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const px = a[0] + t * dx;
  const py = a[1] + t * dy;
  return [2 * px - q[0], 2 * py - q[1]];
};

const napredakListanja = (f: number, rez: number, pola: number) => (f - (rez - pola)) / (2 * pola);

/** CSS clip-path za staru stranicu: vidi se samo deo levo od pregiba. */
export const clipStarog = (f: number, rez: number, pola: number): string | undefined => {
  const p = napredakListanja(f, rez, pola);
  if (p <= 0) return undefined;
  if (p >= 1) return "polygon(0 0, 0 0, 0 0)";
  const [a, b] = pregib(p);
  return `polygon(0px 0px, ${a[0].toFixed(1)}px 0px, ${b[0].toFixed(1)}px 1920px, 0px 1920px)`;
};

export const Listanje: React.FC = () => {
  const f = useCurrentFrame();
  const i = PRELAZI.findIndex((pr, k) => pr.tip === "list" && Math.abs(f - plan.scene[k + 1].odF) < pr.pola);
  if (i < 0) return null;
  const pr = PRELAZI[i];
  const p = napredakListanja(f, plan.scene[i + 1].odF, pr.pola);
  const [a, b] = pregib(p);
  // poleđina: odraz desnog dela stranice preko pregiba
  const desno: V[] = [a, [1080, 0], [1080, 1920], b];
  const odraz = desno.map((q) => odrazi(q, a, b));
  const d = `M${odraz.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L")}Z`;
  // senka koju list baca na novu stranicu (desno od pregiba)
  const nx = b[1] - a[1];
  const ny = -(b[0] - a[0]);
  const nl = Math.hypot(nx, ny);
  const sx = (nx / nl) * 90;
  const sy = (ny / nl) * 90;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <defs>
        <linearGradient id="senkaLista" gradientUnits="userSpaceOnUse" x1={a[0]} y1={a[1]} x2={a[0] + sx} y2={a[1] + sy}>
          <stop offset="0" stopColor={P.senka} stopOpacity="0.45" />
          <stop offset="1" stopColor={P.senka} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="poledjina" gradientUnits="userSpaceOnUse" x1={a[0]} y1={a[1]} x2={a[0] - sx * 3} y2={a[1] - sy * 3}>
          <stop offset="0" stopColor="#d9c9a6" />
          <stop offset="0.18" stopColor="#f7eedb" />
          <stop offset="0.7" stopColor="#efe2c4" />
          <stop offset="1" stopColor="#e2cfa6" />
        </linearGradient>
      </defs>
      <path d={`M${a[0]},${a[1]} L${a[0] + sx},${a[1] + sy} L${b[0] + sx},${b[1] + sy} L${b[0]},${b[1]}Z`} fill="url(#senkaLista)" />
      <path d={d} fill="url(#poledjina)" stroke={P.mastiloSvetlo} strokeWidth={2} />
      <path d={d} fill="url(#gvasP)" style={{ mixBlendMode: "multiply" }} opacity={0.18} />
      <path d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`} stroke="#fff" strokeWidth={3} opacity={0.6} />
    </svg>
  );
};
