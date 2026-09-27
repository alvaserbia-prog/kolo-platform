// Scena 3 — „Svaki novi član donosi nešto novo. Novu uslugu, novo selo, novi grad.
// Nove mogućnosti za sve.“
// Stara karta Sombora i okoline se iscrta; Sombor svetli. Na „uslugu“ se pali Čonoplja i iznad nje
// medaljon sa alatom, na „selo“ Stanišić sa teglom zimnice, na „grad“ Apatin sa knjigama.
// Na „Nove mogućnosti za sve“ se pale sve tačke i povežu u mrežu.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { RUKOPIS } from "../fontovi";
import { Hrapavo, Kadar, Kamera, Oblik, Pop, elipsa, napredak, useF } from "../alat";
import { Tegla } from "../predmeti";
import { Karta, SOMBOR, TACKE } from "../mapa";
import { Alat, Knjige } from "./Scena2";
import { kad } from "../vreme";

const Medaljon: React.FC<{ natpis: string; children: React.ReactNode }> = ({ natpis, children }) => (
  <g>
    <path d="M0,0 L0,-60" stroke={P.mastilo} strokeWidth={4} />
    <g transform="translate(0 -150)">
      <Hrapavo lokalno>
        <Oblik d={elipsa(0, 0, 90, 90)} boja={P.krem} debljina={5} />
        <circle r={78} fill="none" stroke={P.zelena700} strokeWidth={3} strokeDasharray="10 6" />
        <g transform="translate(0 30)">{children}</g>
      </Hrapavo>
      <text y={128} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.mastilo} stroke={P.krem} strokeWidth={8} paintOrder="stroke">
        {natpis}
      </text>
    </g>
  </g>
);

const Tacka: React.FC<{ f: number; at: number; i: number; velika?: boolean }> = ({ f, at, i, velika }) => {
  const puls = 1 + 0.18 * Math.sin((f - at) / 6 + i);
  return (
    <>
      <circle r={(velika ? 44 : 30) * puls} fill={P.zelena500} opacity={0.22} />
      <circle r={velika ? 18 : 14} fill={P.zelena500} stroke={P.zelena900} strokeWidth={3} />
      <circle r={5} fill="#fff" opacity={0.8} />
    </>
  );
};

// indeksi u TACKE (redosled iz mapa.tsx): Čonoplja 4, Stanišić 2, Apatin 1; 14–18 su u Somboru
const USLUGA = 4;
const SELO = 2;
const GRAD = 1;

export const Scena3: React.FC = () => {
  const f = useF();
  const kSvaki = kad(3, "Svaki");
  const kUslugu = kad(3, "uslugu,");
  const kSelo = kad(3, "selo,");
  const kGrad = kad(3, "grad.");
  const kNove = kad(3, "Nove");
  const crtanje = napredak(f, -12, 36, Easing.out(Easing.cubic));
  const z = interpolate(f, [0, kNove], [1.18, 1.05], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const posebne: [number, number, React.ReactNode, string][] = [
    [USLUGA, kUslugu - 6, <Alat key="a" />, "usluga"],
    [SELO, kSelo - 6, <g key="t" transform="translate(0 30)"><Tegla vrsta="ajvar" s={0.62} /></g>, "selo"],
    [GRAD, kGrad - 6, <g key="k" transform="translate(0 10) scale(0.95)"><Knjige /></g>, "grad"],
  ];
  const vreme = (i: number) => {
    if (i >= 14) return kSvaki + (i - 14) * 3;
    const p = posebne.find((x) => x[0] === i);
    if (p) return p[1];
    return kNove - 4 + ((i * 5) % 11) * 1.6;
  };
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={560} y={930} z={z}>
          <Karta f={f} crtanje={crtanje} />
        </Kamera>
      </Hrapavo>
      <Kamera x={560} y={930} z={z}>
        {/* Sombor svetli */}
        <circle cx={SOMBOR[0]} cy={SOMBOR[1] - 20} r={150} fill="url(#toplaSvetlost)" opacity={napredak(f, kSvaki - 8, 20)} />
        {/* mreža na „Nove mogućnosti“ */}
        {TACKE.map(([x, y], i) =>
          TACKE.slice(i + 1).map(([x2, y2], j) => {
            const d = Math.hypot(x2 - x, y2 - y);
            if (d > 270) return null;
            const p = napredak(f, kNove + 4 + ((i + j) % 7) * 2.5, 14);
            return <line key={`${i}-${j}`} x1={x} y1={y} x2={x + (x2 - x) * p} y2={y + (y2 - y) * p} stroke={P.zelena500} strokeWidth={3} opacity={0.6} strokeDasharray="6 6" />;
          }),
        )}
        {TACKE.map(([x, y], i) => {
          const at = vreme(i);
          return (
            <Pop key={i} at={at} x={x} y={y}>
              <Tacka f={f} at={at} i={i} velika={posebne.some((p) => p[0] === i)} />
            </Pop>
          );
        })}
        {posebne.map(([i, at, el, natpis]) => (
          <Pop key={natpis} at={at + 2} x={TACKE[i][0]} y={TACKE[i][1] - 14} odozdo={60}>
            <Medaljon natpis={natpis}>{el}</Medaljon>
          </Pop>
        ))}
      </Kamera>
    </Kadar>
  );
};
