// Prelazi između scena na tabli.
//  „brisanje“: sunđer briše staru scenu sleva nadesno (u potezima gore-dole); iza njega ostaje vlažan,
//              tamniji trag table koji se suši, a nova scena se crta na obrisanom delu.
//  „rastapanje“: nova scena se pojavi preko stare (nastavak iste slike).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { Defs, Kreda, Oblik, kutija } from "./alat";

export type Prelaz = { tip: "brisanje" | "rastapanje"; pola: number };
// prelaz posle scene i (i = 0 → između scene 1 i 2)
export const PRELAZI: Prelaz[] = [
  { tip: "brisanje", pola: 11 }, // 1 → 2: obućarska radnja
  { tip: "rastapanje", pola: 8 }, // 2 → 3: kadar se širi na Stevana
  { tip: "brisanje", pola: 11 }, // 3 → 4: TRAMPA
  { tip: "brisanje", pola: 11 }, // 4 → 5: dve kolone
  { tip: "rastapanje", pola: 10 }, // 5 → 6: prvi način
  { tip: "rastapanje", pola: 8 }, // 6 → 7: obućar i novac
  { tip: "brisanje", pola: 12 }, // 7 → 8: drugi način, sveska
  { tip: "rastapanje", pola: 8 }, // 8 → 9: Stevan donosi drva
  { tip: "rastapanje", pola: 8 }, // 9 → 10: sveska ostaje, KOLO
  { tip: "brisanje", pola: 12 }, // 10 → 11: završnica
];

const SUSENJE = 45; // frejmova dok se vlažan trag ne osuši

/** Ivica brisanja (x) na visini y za napredak p (0–1): potezi gore-dole daju talasastu ivicu. */
const ivica = (p: number, y: number) => {
  const e = Easing.inOut(Easing.quad)(p);
  return interpolate(e, [0, 1], [-160, 1240]) + Math.sin(y / 170 + p * 9) * 46;
};

const napredak = (f: number, rez: number, pola: number) => (f - (rez - pola)) / (2 * pola);

const poligon = (p: number, levo: boolean) => {
  const pts: string[] = [];
  for (let k = 0; k <= 24; k++) {
    const y = (k / 24) * 1920;
    pts.push(`${ivica(p, y).toFixed(1)}px ${y.toFixed(0)}px`);
  }
  return levo ? `polygon(0px 0px, ${pts.join(",")}, 0px 1920px)` : `polygon(1080px 0px, ${pts.join(",")}, 1080px 1920px)`;
};

/** CSS clip-path za staru scenu: ostaje samo deo desno od sunđera. */
export const clipStarog = (f: number, rez: number, pola: number): string | undefined => {
  const p = napredak(f, rez, pola);
  if (p <= 0) return undefined;
  if (p >= 1) return "polygon(0 0, 0 0, 0 0)";
  return poligon(p, false);
};

/** CSS clip-path za novu scenu: vidi se samo obrisani deo, levo od sunđera (scene su prozirne, tabla je ispod). */
export const clipNovog = (f: number, rez: number, pola: number): string | undefined => {
  const p = napredak(f, rez, pola);
  if (p >= 1) return undefined;
  if (p <= 0) return "polygon(0 0, 0 0, 0 0)";
  return poligon(p, true);
};

/** Vlažan trag na tabli (ispod scena): tamniji deo levo od sunđera, suši se posle brisanja. */
export const VlaznaTabla: React.FC = () => {
  const f = useCurrentFrame();
  const i = PRELAZI.findIndex((pr, k) => pr.tip === "brisanje" && f > plan.scene[k + 1].odF - pr.pola && f < plan.scene[k + 1].odF + pr.pola + SUSENJE);
  if (i < 0) return null;
  const pr = PRELAZI[i];
  const rez = plan.scene[i + 1].odF;
  const p = Math.min(1, napredak(f, rez, pr.pola));
  const kraj = rez + pr.pola;
  const suv = f > kraj ? 1 - (f - kraj) / SUSENJE : 1;
  const d: string[] = [];
  for (let k = 0; k <= 24; k++) {
    const y = (k / 24) * 1920;
    d.push(`${ivica(p, y).toFixed(1)},${y.toFixed(0)}`);
  }
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={`M0,0 L${d.join(" L")} L0,1920Z`} fill={P.senka} opacity={0.32 * suv} />
      {/* pruge od sunđera */}
      {Array.from({ length: 9 }, (_, k) => (
        <path
          key={k}
          d={`M0,${120 + k * 200} C300,${80 + k * 200} 700,${170 + k * 200} 1080,${110 + k * 200}`}
          stroke={P.senka}
          strokeWidth={26}
          opacity={0.12 * suv}
          fill="none"
          clipPath="none"
        />
      ))}
    </svg>
  );
};

/** Sunđer na ivici brisanja (iznad scena). */
export const Sundjer: React.FC = () => {
  const f = useCurrentFrame();
  const i = PRELAZI.findIndex((pr, k) => pr.tip === "brisanje" && Math.abs(f - plan.scene[k + 1].odF) < pr.pola);
  if (i < 0) return null;
  const pr = PRELAZI[i];
  const p = napredak(f, plan.scene[i + 1].odF, pr.pola);
  // sunđer ide gore-dole po ivici
  const y = 960 + Math.sin(p * Math.PI * 5) * 640;
  const x = ivica(p, y) - 40;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <g transform={`translate(${x} ${y}) rotate(${-8 + Math.cos(p * Math.PI * 5) * 10})`}>
        <rect x={-92} y={-138} width={200} height={300} rx={26} fill={P.senka} opacity={0.35} />
        <Oblik d={kutija(-100, -150, 200, 300, 26)} boja="#D8B45E" ivica="#5B4423" debljina={5} tekstura={0} />
        <Oblik d={kutija(-100, 90, 200, 60, 20)} boja="#4E6E5A" ivica="#5B4423" debljina={5} tekstura={0} />
        {[[-50, -90], [10, -110], [50, -40], [-30, -20], [30, 30], [-60, 40], [0, -60]].map(([a, b], k) => (
          <ellipse key={k} cx={a} cy={b} rx={9} ry={6} fill="#A9873F" />
        ))}
      </g>
      <Kreda>
        {/* prah krede iza sunđera */}
        {Array.from({ length: 14 }, (_, k) => (
          <circle key={k} cx={x - 60 - ((k * 37) % 90)} cy={y - 140 + ((k * 53) % 280)} r={3 + (k % 3)} fill={P.mastilo} opacity={0.5} />
        ))}
      </Kreda>
    </svg>
  );
};
