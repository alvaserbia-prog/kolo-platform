// Video „Poljoprivrednici“: naiva po uzoru na Kovačicu. Sedamnaest scena, pretapanje među scenama,
// oslikan ram, platno, titlovi po rečima, zvuk. Boja nosi emociju: sećanje je puno i toplo, prolazak i
// tuga ispiraju boju do sive, a od Đurike se boja vraća (scenario, „Stil“).
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { ucitajFontove } from "./fontovi";
import { Sekvenca, type Prelaz } from "./Sekvenca";
import { Titlovi } from "./Titlovi";
import { Defs, N, PomakCtx, useF } from "./naiva";
import { Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7, Scena8, Scena9 } from "./scene1";
import { Scena10, Scena11, Scena12, Scena13, Scena14, Scena15, Scena16, Scena17 } from "./scene2";
import { PLAN, trajanjeF } from "./vreme";

ucitajFontove();

// zasićenost boje na početku i na kraju scene, i svetlina (1 = bez promene)
const BOJA: Record<number, [number, number, number]> = {
  1: [0.35, 0.3, 0.95],
  2: [1.0, 1.05, 1.03],
  3: [1.05, 1.05, 1.03],
  4: [1.05, 1.0, 1.02],
  5: [0.9, 0.5, 0.98],
  6: [0.45, 0.4, 0.95],
  7: [0.45, 0.4, 0.97],
  8: [0.4, 0.35, 0.96],
  9: [0.3, 0.25, 0.9],
  10: [0.5, 0.95, 1.0],
  11: [1.0, 1.0, 1.0],
  12: [1.0, 1.0, 1.0],
  13: [1.0, 1.0, 1.0],
  14: [1.0, 1.0, 1.0],
  15: [0.75, 1.0, 1.0],
  16: [1.05, 1.1, 1.04],
  17: [1.0, 1.0, 1.0],
};

const obojeno = (S: React.FC, id: number): React.FC => {
  const O: React.FC = () => {
    const f = useF();
    const [a, b, sv] = BOJA[id];
    const sat = interpolate(f, [0, trajanjeF(id)], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ filter: `saturate(${sat.toFixed(3)}) brightness(${sv})` }}>
        <S />
      </AbsoluteFill>
    );
  };
  return O;
};

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7, Scena8, Scena9, Scena10, Scena11, Scena12, Scena13, Scena14, Scena15, Scena16, Scena17].map((S, i) => obojeno(S, i + 1));

export const PRELAZI: Prelaz[] = SCENE.slice(1).map(() => ({ tip: "pretapanje", pola: 9 }));

const Pozadina: React.FC = () => <div style={{ position: "absolute", inset: 0, background: N.bela }} />;

/** Oslikan ram naive: plava traka sa belim tačkama i cvetom u uglovima. */
const Ram: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    <path d="M0,0 H1080 V1920 H0Z M22,22 H1058 V1898 H22Z" fill={N.plava} fillRule="evenodd" />
    {Array.from({ length: 40 }, (_, i) => (
      <g key={i}>
        <circle cx={38 + i * 26.5} cy={11} r={3.5} fill={N.bela} />
        <circle cx={38 + i * 26.5} cy={1909} r={3.5} fill={N.bela} />
      </g>
    ))}
    {Array.from({ length: 72 }, (_, i) => (
      <g key={`v${i}`}>
        <circle cx={11} cy={38 + i * 26.3} r={3.5} fill={N.bela} />
        <circle cx={1069} cy={38 + i * 26.3} r={3.5} fill={N.bela} />
      </g>
    ))}
    {[
      [22, 22],
      [1058, 22],
      [22, 1898],
      [1058, 1898],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={24} fill={N.zuta} stroke={N.kontura} strokeWidth={3} />
    ))}
  </svg>
);

export const Poljoprivrednici: React.FC = () => (
  <AbsoluteFill style={{ background: N.bela }}>
    <Sekvenca plan={PLAN} scene={SCENE} prelazi={PRELAZI} Pozadina={Pozadina} clipBrisanja={() => ""} PomakCtx={PomakCtx} />
    <AbsoluteFill style={{ zIndex: 2100, mixBlendMode: "multiply", opacity: 0.3, backgroundImage: `url(${staticFile("platno.png")})`, backgroundSize: "512px 512px" }} />
    <AbsoluteFill style={{ zIndex: 2150 }}>
      <Ram />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Titlovi plan={PLAN} izgled="naiva" />
    </AbsoluteFill>
    <Audio src={staticFile("miks.wav")} />
  </AbsoluteFill>
);
