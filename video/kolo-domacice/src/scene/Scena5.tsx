// Scena 5 — odluka. Kuhinja u jesen, hladni tonovi, lišće pada iza prozora.
// Na „dosta.“ Milica prevrne veliki lonac naopako (tup udarac), na „Više ne pravim.“ zatvori
// vrata ormarića u kome su tegle. Posle toga tišina, muzika ne svira.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, Oblik, kutija, napredak, useF } from "../alat";
import { Kuhinja } from "../pozadine";
import { Lonac, Tegla } from "../predmeti";
import { Lik, MILICA } from "../likovi";
import { kad } from "../vreme";

export const Scena5: React.FC = () => {
  const f = useF();
  const kDosta = kad(5, "dosta");
  const kVise = kad(5, "Više");
  const prevrni = napredak(f, kDosta - 8, 12, Easing.in(Easing.quad));
  const vrata = napredak(f, kVise, 12, Easing.in(Easing.cubic));
  const udar = Math.max(0, 1 - Math.abs(f - (kDosta + 4)) / 6);
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={560} y={1010 + udar * 4} z={1.38 + interpolate(f, [0, 200], [0, 0.05])}>
          <Kuhinja sezona="jesen" bezPolice />
          {/* gornji ormarić sa teglama */}
          <g transform="translate(220 520)">
            <Oblik d={kutija(-170, -40, 340, 300, 8)} boja="#D9C7A0" />
            <Oblik d={kutija(-156, -26, 312, 272, 6)} boja="#8A6E52" debljina={3} />
            <Oblik d={kutija(-156, 110, 312, 12, 3)} boja={P.drvo} debljina={2.5} />
            {[-110, -40, 30, 100].map((xx, i) => (
              <g key={xx} transform={`translate(${xx} 108)`}>
                <Tegla vrsta={i % 2 ? "pekmez" : "ajvar"} s={0.55} />
              </g>
            ))}
            {[-100, -20, 60].map((xx, i) => (
              <g key={xx} transform={`translate(${xx} 238)`}>
                <Tegla vrsta={i % 2 ? "tursija" : "ajvar"} s={0.55} />
              </g>
            ))}
            {/* dva krila vrata */}
            <g transform={`translate(-156 -26) scale(${Math.max(0.02, vrata)} 1)`}>
              <Oblik d={kutija(0, 0, 156, 272, 5)} boja="#D9C7A0" debljina={3.5} />
              <circle cx={140} cy={136} r={8} fill={P.drvoTamno} />
            </g>
            <g transform={`translate(156 -26) scale(${-Math.max(0.02, vrata)} 1)`}>
              <Oblik d={kutija(0, 0, 156, 272, 5)} boja="#D9C7A0" debljina={3.5} />
              <circle cx={140} cy={136} r={8} fill={P.drvoTamno} />
            </g>
          </g>
          {/* lonac na radnoj ploči: prevrće se */}
          <g transform={`translate(640 ${1070 - Math.sin(prevrni * Math.PI) * 120}) rotate(${prevrni * 180} 0 -90)`}>
            {prevrni < 0.5 ? <Lonac s={0.9} /> : <g transform="rotate(180 0 -90)"><Lonac s={0.9} naopako /></g>}
          </g>
          <Lik
            x={400}
            y={1440}
            s={1.12}
            {...MILICA}
            glava={{ ...MILICA.glava, izraz: f > kDosta - 4 ? "odlucna" : "zamisljena", pogled: f > kVise ? [-1, -0.5] : [1, 0], zmurka: f > kDosta - 2 && f < kDosta + 6 }}
            dr={f < kDosta + 6 ? [60 + prevrni * 60, 40 - prevrni * 30] : [30, 30]}
            lr={f > kVise - 6 ? [-150 + vrata * 40, -20] : [10, 20]}
          />
        </Kamera>
      </Hrapavo>
      {/* hladni tonovi */}
      <rect width={1080} height={1920} fill="#6F8FA6" opacity={0.42} style={{ mixBlendMode: "color" }} />
      <rect width={1080} height={1920} fill="#C3D0D8" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
    </Kadar>
  );
};
