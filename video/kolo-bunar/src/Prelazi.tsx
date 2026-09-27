// Prelazi između otisaka.
//  „valjak“: preko kadra prelazi valjak sa mastilom (kao pri štampanju), iza njega ostaje nov otisak.
//  „rastapanje“: nov otisak se pojavi preko starog.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { Defs, Linija } from "./alat";

export type Prelaz = { tip: "valjak" | "rastapanje"; pola: number };
// prelaz posle scene i (i = 0 → između scene 1 i 2)
export const PRELAZI: Prelaz[] = [
  { tip: "rastapanje", pola: 9 }, // 1 → 2
  { tip: "valjak", pola: 14 }, // 2 → 3: propadanje
  { tip: "valjak", pola: 16 }, // 3 → 4: obrt, Ostrom
  { tip: "rastapanje", pola: 10 }, // 4 → 5
  { tip: "valjak", pola: 14 }, // 5 → 6: kada propada
  { tip: "rastapanje", pola: 10 }, // 6 → 7
  { tip: "valjak", pola: 14 }, // 7 → 8: danas
  { tip: "valjak", pola: 16 }, // 8 → 9: pravo da se udružimo
  { tip: "rastapanje", pola: 10 }, // 9 → 10
];

/** Položaj valjka (x) za napredak p — ide zdesna nalevo. */
export const xValjka = (p: number) => interpolate(Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, p))), [0, 1], [1080 + 120, -120]);
export const napredakValjka = (f: number, rez: number, pola: number) => (f - (rez - pola)) / (2 * pola);

/** CSS clip-path za NOVU scenu: vidi se samo deo desno od valjka. */
export const clipNovog = (f: number, rez: number, pola: number): string | undefined => {
  const p = napredakValjka(f, rez, pola);
  if (p >= 1) return undefined;
  if (p <= 0) return "polygon(0 0, 0 0, 0 0)";
  const x = xValjka(p);
  return `polygon(${x.toFixed(1)}px 0px, 1080px 0px, 1080px 1920px, ${x.toFixed(1)}px 1920px)`;
};

export const Valjak: React.FC = () => {
  const f = useCurrentFrame();
  const i = PRELAZI.findIndex((pr, k) => pr.tip === "valjak" && Math.abs(f - plan.scene[k + 1].odF) < pr.pola);
  if (i < 0) return null;
  const pr = PRELAZI[i];
  const p = napredakValjka(f, plan.scene[i + 1].odF, pr.pola);
  const x = xValjka(p);
  const rot = f * 26;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <defs>
        <linearGradient id="valjakG" x1="0" x2="1">
          <stop offset="0" stopColor="#0d0b09" />
          <stop offset="0.35" stopColor="#3a332c" />
          <stop offset="0.5" stopColor="#6b625a" />
          <stop offset="0.65" stopColor="#2a241f" />
          <stop offset="1" stopColor="#0d0b09" />
        </linearGradient>
        <linearGradient id="tragMastila" x1="0" x2="1">
          <stop offset="0" stopColor={P.mastilo} stopOpacity="0" />
          <stop offset="1" stopColor={P.mastilo} stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {/* svež trag mastila odmah iza valjka */}
      <rect x={x + 40} y={0} width={120} height={1920} fill="url(#tragMastila)" transform={`scale(-1 1) translate(${-2 * (x + 100)} 0)`} />
      {/* senka valjka */}
      <rect x={x - 70} y={0} width={60} height={1920} fill={P.mastilo} opacity={0.18} filter="url(#blur6)" />
      {/* valjak */}
      <rect x={x - 46} y={-20} width={92} height={1960} rx={40} fill="url(#valjakG)" />
      {Array.from({ length: 14 }).map((_, k) => {
        const y = ((k * 150 + rot) % 2100) - 90;
        return <Linija key={k} d={`M${x - 30},${y} L${x + 30},${y + 20}`} boja="#8b8178" debljina={2} opacity={0.35} />;
      })}
      <rect x={x - 46} y={-20} width={92} height={1960} rx={40} fill="none" stroke="#000" strokeWidth={3} opacity={0.6} />
    </svg>
  );
};
