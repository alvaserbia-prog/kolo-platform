// Scena 3 — odlazak. Ulica sa drvoredom: odrasla deca u fići sa koferima na krovu odlaze niz
// drum ka ravnici, Milica i muž mašu sa kapije. Na „Velika porodica“ isti dugi sto,
// ali samo dva tanjira, prazne stolice — kamera se polako odmiče.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, Oblik, kutija, napredak, useF } from "../alat";
import { Kuhinja, Ulica } from "../pozadine";
import { Auto, Drvo, Kapija, Kuca, Sto, Tanjir } from "../predmeti";
import { Lik, MILICA, MUZ } from "../likovi";
import { Secanje } from "./Scena2";
import { kad } from "../vreme";

const Stolica: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Oblik d="M-50,0 L-44,-230 L44,-230 L50,0Z" boja={P.drvo} />
    <Oblik d={kutija(-40, -214, 80, 70, 10)} boja={P.drvoSvetlo} />
    <Oblik d="M-34,-130 L34,-130 L34,-110 L-34,-110Z" boja={P.drvoTamno} debljina={3} />
  </g>
);

export const Scena3: React.FC = () => {
  const f = useF();
  const kVelika = kad(3, "Velika");
  const voznja = napredak(f, 0, kVelika + 4, Easing.in(Easing.quad));
  const smena = napredak(f, kVelika - 10, 14);
  const mah = Math.sin(f / 4) * 25;
  // auto odlazi niz drum: od kapije ka horizontu (manji, više)
  const ax = interpolate(voznja, [0, 1], [640, 900]);
  const ay = interpolate(voznja, [0, 1], [1260, 930]);
  const as = interpolate(voznja, [0, 1], [1.05, 0.18]);
  const odmak = interpolate(f, [kVelika, kVelika + 150], [1.5, 1.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Kadar>
      {smena < 1 && (
        <g opacity={1}>
          <Hrapavo>
            <Kamera x={560} y={1000} z={1.25 + voznja * 0.05}>
              <Ulica />
              {/* drvored duž druma */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const t = i / 5;
                return (
                  <g key={i} transform={`translate(${interpolate(t, [0, 1], [1080, 930])} ${interpolate(t, [0, 1], [1320, 900])})`}>
                    <Drvo s={interpolate(t, [0, 1], [1.1, 0.25])} />
                  </g>
                );
              })}
              <path d="M300,1400 C600,1200 820,980 880,900 L940,900 C930,1000 1000,1200 1200,1400Z" fill="#D8C08E" />
              <path d="M300,1400 C600,1200 820,980 880,900 L940,900 C930,1000 1000,1200 1200,1400Z" fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
              <g transform="translate(160 1260)">
                <Kuca s={1.25} zid={P.zidZuti} />
              </g>
              <g transform={`translate(${ax} ${ay}) scale(${as})`}>
                <Auto koferi tockovi={f * 12} />
                {/* ruke dece koje mašu kroz prozore */}
                <g transform={`translate(-60 -200) rotate(${mah})`}>
                  <Oblik d="M-8,0 L-8,-60 L8,-60 L8,0Z" boja={P.koza} debljina={3} />
                </g>
                <g transform={`translate(60 -200) rotate(${-mah})`}>
                  <Oblik d="M-8,0 L-8,-60 L8,-60 L8,0Z" boja={P.koza} debljina={3} />
                </g>
              </g>
              <Lik x={330} y={1400} s={0.95} {...MUZ} glava={{ ...MUZ.glava, bojaKose: P.kosaSedaTamna, izraz: "mirna", pogled: [1, 0] }} dr={[150 + mah * 0.6, 20]} lr={[10, 10]} />
              <Lik
                x={520}
                y={1420}
                s={1}
                {...MILICA}
                glava={{ ...MILICA.glava, bojaKose: P.kosaSmedja, izraz: "tuzna", pogled: [1, -0.2] }}
                dr={[160 - mah * 0.6, 10]}
                lr={[20, 30]}
              />
            </Kamera>
          </Hrapavo>
          <Secanje jacina={0.8} />
        </g>
      )}
      {smena > 0 && (
        <g opacity={smena}>
          <rect width={1080} height={1920} fill={P.papir} />
          <Hrapavo>
            <Kamera x={1800} y={1000} z={odmak}>
              <Kuhinja sezona="jesen" cilim={false} />
              {[1560, 1760, 1960, 2160, 2340].map((x) => (
                <Stolica key={x} x={x} y={1240} />
              ))}
              <Lik x={1600} y={1330} s={0.95} {...MUZ} glava={{ ...MUZ.glava, izraz: "mirna", pogled: [1, 0.3] }} lr={[20, 20]} dr={[30, 50]} />
              <Lik x={1790} y={1330} s={0.95} {...MILICA} glava={{ ...MILICA.glava, izraz: "tuzna", pogled: [-1, 0.3] }} lr={[-30, -50]} dr={[-20, -30]} />
              <g transform="translate(1940 1140)">
                <Sto w={980} h={300} />
                <g transform="translate(-340 2)">
                  <Tanjir />
                </g>
                <g transform="translate(-150 4)">
                  <Tanjir />
                </g>
              </g>
            </Kamera>
          </Hrapavo>
        </g>
      )}
    </Kadar>
  );
};
