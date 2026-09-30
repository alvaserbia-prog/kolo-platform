// Sc. 5 — „Zajedničko dobro opstaje kad se zna ko je unutra, kad su pravila poštena, kad o njima
// odlučuju oni koji ga koriste. Kad svi vide ko šta radi. I kad svako ko prekrši za to odgovara.“
// Otvorena knjiga pravila: pet redova se ispisuju jedan po jedan, svaki na svoju izgovorenu reč,
// uz sličicu u drvorezu i zelenu kvačicu. Kamera prati red koji se upravo piše.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Hrapavo, Kadar, Linija, Povrs, elipsa, kutija, mesaj, napredak, useF } from "../alat";
import { P } from "../paleta";
import { SERIF } from "../fontovi";
import { kad, trajanjeF } from "../vreme";

const Y0 = 452;
const RED = 168;

const Ikona: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  switch (i) {
    case 0: // zna se ko je unutra: krug ljudi u ogradi
      return (
        <g>
          <circle r={58} fill="none" stroke={P.mastilo} strokeWidth={4} strokeDasharray="10 7" />
          {Array.from({ length: 6 }).map((_, k) => {
            const a = (k / 6) * Math.PI * 2 + f / 90;
            return (
              <g key={k} transform={`translate(${Math.cos(a) * 32} ${Math.sin(a) * 32})`}>
                <circle r={9} fill={P.mastilo} />
                <path d="M-10,20 Q0,4 10,20 Z" fill={P.mastilo} transform="translate(0 -6)" />
              </g>
            );
          })}
        </g>
      );
    case 1: // pravila su poštena: vaga
      return (
        <g>
          <Linija d="M0,-50 L0,44 M-30,44 L30,44" debljina={6} />
          <Linija d="M-48,-34 L48,-34" debljina={6} />
          {[-48, 48].map((x) => (
            <g key={x}>
              <Linija d={`M${x},-34 L${x - 18},6 M${x},-34 L${x + 18},6`} debljina={3} />
              <Povrs d={`M${x - 24},6 Q${x},30 ${x + 24},6 Z`} boja={P.oker} srafura={false} debljina={4} pomak={[2, 2]} />
            </g>
          ))}
          <circle cy={-54} r={7} fill={P.mastilo} />
        </g>
      );
    case 2: // odlučuju oni koji koriste: podignute ruke
      return (
        <g>
          {[-34, 0, 34].map((x, k) => (
            <g key={k} transform={`translate(${x} ${k === 1 ? -8 : 0}) rotate(${(k - 1) * 10})`}>
              <Linija d="M0,50 L0,-10" debljina={14} />
              <path d={kutija(-11, -40, 22, 34, 8)} fill={P.krem} stroke={P.mastilo} strokeWidth={4} />
              <Linija d="M-5,-40 L-5,-50 M3,-40 L3,-52" debljina={4} />
            </g>
          ))}
        </g>
      );
    case 3: // svi vide: oko
      return (
        <g>
          <Povrs d="M-58,0 Q0,-50 58,0 Q0,50 -58,0 Z" boja={P.krem} srafura={false} debljina={6} pomak={[2, 2]} />
          <Povrs d={elipsa(0, 0, 22)} boja={P.zelena700} srafura="srafD" srafuraOp={0.3} debljina={4} pomak={[2, 1]} />
          <circle r={9} fill={P.mastilo} />
          {[-40, -20, 0, 20, 40].map((x, k) => (
            <Linija key={k} d={`M${x},-30 L${x * 1.2},-46`} debljina={3} />
          ))}
        </g>
      );
    default: // ko prekrši, odgovara: znak upozorenja
      return (
        <g>
          <Povrs d="M0,-54 L56,44 L-56,44 Z" boja={P.rdja} srafura="srafD" srafuraOp={0.25} debljina={6} pomak={[3, 2]} />
          <Linija d="M0,-18 L0,14" debljina={10} boja={P.krem} />
          <circle cy={30} r={6} fill={P.krem} />
        </g>
      );
  }
};

export const Scena5: React.FC = () => {
  const f = useF();
  const T = trajanjeF(5);
  const PRAVILA = [
    { t: "Zna se ko je unutra", at: kad(5, "zna") - 4 },
    { t: "Pravila su poštena", at: kad(5, "pravila") - 4 },
    { t: "Odlučuju oni koji koriste", at: kad(5, "odlučuju") - 4 },
    { t: "Svi vide ko šta radi", at: kad(5, "vide") - 4 },
    { t: "Ko prekrši, odgovara", at: kad(5, "prekrši") - 4 },
  ];
  const otvori = napredak(f, 0, 16, Easing.out(Easing.cubic));
  // kamera prati tekući red
  const kamY = interpolate(f, PRAVILA.map((p) => p.at), PRAVILA.map((_, i) => mesaj(840, Y0 + i * RED + 40, 0.35)), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = mesaj(1.0, 1.06, napredak(f, 0, T));
  return (
    <Kadar>
      <Hrapavo>
        {/* sto ispod knjige */}
        <Povrs d="M-20,360 L1100,360 L1100,1940 L-20,1940 Z" boja={P.drvo} srafura="srafH" srafuraOp={0.4} ivica={false} pomak={[0, 0]} mrlja={0.6} />
        {Array.from({ length: 9 }).map((_, i) => (
          <Linija key={i} d={`M-20,${420 + i * 180} Q540,${410 + i * 180} 1100,${424 + i * 180}`} debljina={4} opacity={0.5} />
        ))}
        <g transform={`translate(540 ${kamY}) scale(${z}) translate(-540 ${-kamY})`}>
          <g transform={`translate(540 380) scale(${mesaj(0.9, 1, otvori)}) translate(-540 -380)`} opacity={otvori}>
            {/* korice */}
            <Povrs d={kutija(80, 350, 920, 1000, 18)} boja={P.rdjaTamna} srafura="srafG" srafuraOp={0.35} debljina={8} pomak={[6, 6]} />
            {/* list */}
            <Povrs d={kutija(110, 376, 860, 948, 8)} boja={P.krem} srafura={false} debljina={5} pomak={[3, 3]} mrlja={0.25} />
            {/* povez sa bodovima */}
            {Array.from({ length: 9 }).map((_, i) => (
              <Linija key={i} d={`M134,${410 + i * 104} L134,${440 + i * 104}`} debljina={4} opacity={0.7} />
            ))}
            {/* redovi */}
            {PRAVILA.map((p, i) => {
              const y = Y0 + i * RED;
              const pis = napredak(f, p.at, 18, Easing.inOut(Easing.quad));
              const kv = napredak(f, p.at + 14, 10, Easing.out(Easing.cubic));
              const ik = napredak(f, p.at - 2, 8, Easing.out(Easing.back(2)));
              return (
                <g key={i}>
                  <Linija d={`M170,${y + 84} L930,${y + 84}`} debljina={2.5} opacity={0.45} />
                  {f >= p.at - 2 && (
                    <g transform={`translate(230 ${y}) scale(${ik * 0.9})`}>
                      <Ikona i={i} f={f} />
                    </g>
                  )}
                  <defs>
                    <clipPath id={`pis${i}`}>
                      <rect x={300} y={y - 60} width={600 * pis} height={120} />
                    </clipPath>
                  </defs>
                  <text x={310} y={y + 16} fontFamily={SERIF} fontWeight={700} fontSize={44} fill={P.mastilo} clipPath={`url(#pis${i})`}>
                    {p.t}
                  </text>
                  {pis > 0 && pis < 1 && <circle cx={310 + 560 * pis} cy={y + 12} r={5} fill={P.mastilo} />}
                  <Linija d={`M880,${y + 2} L902,${y + 26} L944,${y - 30}`} boja={P.zelena700} debljina={12} napredak={kv} />
                </g>
              );
            })}
          </g>
        </g>
      </Hrapavo>
    </Kadar>
  );
};
