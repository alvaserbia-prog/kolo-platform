// Scena 4 — podrum. Milica slaže nove tegle na police; na „deci i unucima“ etikete dobijaju
// imena. Na „Ali oni su dolazili retko“ kalendar lista godine; na „Tegle su stajale“ se hvata
// prašina i paučina, svetlo slabi. Na „počela da baca“ Milica uzme teglu i krene ka izlazu.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { NASLOV, SERIF } from "../fontovi";
import { Hrapavo, Kadar, Kamera, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { Podrum, Police } from "../pozadine";
import { Tegla } from "../predmeti";
import { Lik, MILICA } from "../likovi";
import { kad } from "../vreme";

const IMENA = ["Marku", "Ani", "Luki", "unucima", "Marku", "Ani", "unucima", "Luki"];

export const Scena4: React.FC = () => {
  const f = useF();
  const kPravila = kad(4, "pravila");
  const kDeci = kad(4, "deci");
  const kAli = kad(4, "Ali");
  const kTegle = kad(4, "Tegle");
  const kPocela = kad(4, "počela");
  const prasina = napredak(f, kTegle - 6, 40);
  const svetlo = 1 - prasina * 0.55;
  const godina = Math.floor(interpolate(f, [kAli, kTegle + 10], [2019, 2025.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const list = interpolate(f, [kAli, kTegle + 10], [0, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) % 1;
  const odlazi = napredak(f, kPocela - 6, 70, Easing.inOut(Easing.quad));
  const mx = interpolate(odlazi, [0, 1], [790, 260]);
  const drzi = f > kPocela - 10;
  // tegle u redovima: pojavljuju se jedna po jedna dok ona „pravi“
  const red = (y: number, n: number, pocetak: number, imena: boolean) =>
    Array.from({ length: n }, (_, i) => (
      <Pop key={i} at={pocetak + i * 5} x={140 + i * 112} y={0}>
        <Tegla vrsta={(["ajvar", "tursija", "pekmez", "ajvar"] as const)[(i + y) % 4]} natpis={imena && f >= kDeci + i * 3 ? IMENA[(i + y) % IMENA.length] : ""} prasina={prasina} s={0.92} />
      </Pop>
    ));
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={600 + odlazi * -60} y={980} z={1.3 + interpolate(f, [0, kTegle], [0, 0.05], { extrapolateRight: "clamp" })}>
          <Podrum svetlo={svetlo} />
          <Police x1={690} redovi={[red(0, 5, 2, false), red(1, 5, kPravila - 16, true), red(2, 5, kPravila, true)]} />
          {/* paučina */}
          <g opacity={prasina}>
            <path d="M90,420 L240,420 M90,420 L90,560 M90,420 L200,520 M120,420 Q110,450 90,450 M160,420 Q140,480 90,490 M210,420 Q170,520 90,530" stroke="#E9E2D2" strokeWidth={2.5} fill="none" />
            <path d="M690,420 L560,420 M690,420 L690,560 M690,420 L590,510 M650,420 Q660,450 690,452 M610,420 Q630,480 690,488" stroke="#E9E2D2" strokeWidth={2.5} fill="none" />
          </g>
          {/* kalendar */}
          <g transform="translate(880 470) rotate(3) scale(0.9)">
            <Oblik d={kutija(-110, -20, 220, 250, 8)} boja={P.krem} debljina={4} />
            <Oblik d={kutija(-110, -20, 220, 56, 8)} boja={P.ajvar} debljina={4} />
            <text x={0} y={140} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={84} fill={P.mastilo}>
              {godina}
            </text>
            <text x={0} y={200} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={30} fill={P.mastiloSvetlo}>
              jesen
            </text>
            {list > 0.02 && list < 0.98 && (
              <path
                d={`M-110,36 L110,36 L110,${36 + 194 * (1 - list)} L-110,${36 + 194 * (1 - list) + 30 * list}Z`}
                fill={P.belo}
                stroke={P.mastilo}
                strokeWidth={3}
                opacity={0.95}
              />
            )}
            <circle cx={-60} cy={-6} r={8} fill={P.mastilo} />
            <circle cx={60} cy={-6} r={8} fill={P.mastilo} />
          </g>
          <Lik
            x={mx}
            y={1420}
            s={1.1}
            {...MILICA}
            okreni
            hod={odlazi > 0.02 && odlazi < 0.98 ? f / 3.2 : undefined}
            glava={{ ...MILICA.glava, izraz: f > kTegle ? "tuzna" : "mirna", pogled: f < kAli ? [1, -0.6] : [0, 0] }}
            dr={drzi ? [30, 60] : [150 + Math.sin(f / 10) * 8, 20]}
            lr={[10, 20]}
            drziD={
              drzi ? (
                <g transform="translate(0 30)">
                  <Tegla vrsta="ajvar" prasina={0.8} s={0.8} />
                </g>
              ) : (
                <g transform="translate(0 20)">
                  <Tegla vrsta="ajvar" s={0.8} natpis="" />
                </g>
              )
            }
          />
        </Kamera>
      </Hrapavo>
      <rect width={1080} height={1920} fill="#1d130c" opacity={prasina * 0.28} />
    </Kadar>
  );
};
