// Scena 9 — povratak. Kuhinja opet u toplom svetlu: Milica peče paprike na šporetu i smeši se,
// sto je pun paprika. Na „ima za koga“ na teglama uskaču etikete sa imenima komšija.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { Kuhinja } from "../pozadine";
import { Paprika, Sporet, Tegla } from "../predmeti";
import { Lik, MILICA } from "../likovi";
import { Secanje } from "./Scena2";
import { kad } from "../vreme";

const IMENA = ["Veri", "Laci", "Stevi", "komšiji"];

export const Scena9: React.FC = () => {
  const f = useF();
  const kIma = kad(9, "ima");
  const kJer = kad(9, "jer");
  const pecenje = napredak(f, 0, 140);
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1110} z={1.22 + interpolate(f, [-10, 160], [0, 0.05])}>
          <Kuhinja sezona="jesen" />
          <g transform="translate(250 1300)">
            <Sporet />
            {[-120, -50, 20, 90].map((x, i) => (
              <g key={x} transform={`translate(${x} -348) rotate(${80 + (i % 2) * 20 + Math.sin((f + i * 11) / 18) * 6})`}>
                <Paprika s={0.55} pecena={pecenje} />
              </g>
            ))}
            {[0, 1].map((i) => {
              const t = ((f + i * 30) % 60) / 60;
              return <path key={i} d={`M${-60 + i * 80},${-380 - t * 140} q20,-30 0,-60`} stroke="#fff" strokeWidth={10} fill="none" opacity={(1 - t) * 0.45} filter="url(#blur6)" />;
            })}
          </g>
          <Lik
            x={560}
            y={1340}
            s={1.05}
            {...MILICA}
            okreni
            glava={{ ...MILICA.glava, izraz: "srecna" }}
            dr={[80 + Math.sin(f / 8) * 10, 30]}
            lr={[40, 40]}
          />
          {/* sto u prvom planu, pun paprika i tegli */}
          <g transform="translate(540 1340)">
            <Oblik d={kutija(-520, -20, 1040, 50, 8)} boja={P.drvo} />
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} transform={`translate(${-470 + i * 44} ${-30 - (i % 3) * 18}) rotate(${-70 + i * 17})`}>
                <Paprika s={0.6} boja={i % 4 === 3 ? P.ajvarTamni : P.paprika} />
              </g>
            ))}
            {IMENA.map((ime, i) => (
              <g key={ime} transform={`translate(${80 + i * 115} -20)`}>
                <Tegla vrsta="ajvar" s={0.95} natpis={f >= kIma - 4 + i * 4 ? ime : ""} />
                <Pop at={kIma - 4 + i * 4} x={0} y={-60}>
                  <g />
                </Pop>
              </g>
            ))}
          </g>
        </Kamera>
      </Hrapavo>
      <Secanje jacina={f > kJer ? 0.9 : 0.6} />
    </Kadar>
  );
};
