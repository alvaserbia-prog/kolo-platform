// Video 13 „Ušteda“ (Zoran, električar): papirni kolaž, kao trilogija „Poverenje“ (src/kolaz).
// Scene se smenjuju papirnim listom koji prebriše kadar, osim između scena 5, 6 i 7: tamo je
// ista Zoranova sveska, pa se samo menja mesec. Posebnih natpisa nema (video/README.md).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ucitajFontove } from "../fontovi";
import { Titlovi } from "../Titlovi";
import { P } from "../kolaz/paleta";
import { Defs, Isecak, Pt } from "../kolaz/papir";
import { SCENE } from "./scene";
import { PLAN } from "./vreme";

ucitajFontove();

const BOJE = [P.zelena700, P.zlatna400, P.korala, P.zelenaSvetla, P.nebo, P.zlatna400, P.korala, P.zelena700];
const BEZ_LISTA = new Set([6, 7]); // ulaz u scene 6 i 7: ista sveska
const SIRINA = 1500;
const POLA = 10;
const list = (x: number): Pt[] => {
  const pts: Pt[] = [];
  for (let y = -40; y <= 1960; y += 80) pts.push([x + (y % 160 ? 18 : -14), y]);
  for (let y = 1960; y >= -40; y -= 80) pts.push([x + SIRINA + (y % 160 ? -16 : 12), y]);
  return pts;
};
const Prelazi: React.FC = () => {
  const f = useCurrentFrame();
  const rez = PLAN.scene.slice(1).filter((s) => !BEZ_LISTA.has(s.id)).map((s) => s.odF);
  const i = rez.findIndex((r) => f >= r - POLA && f < r + POLA);
  if (i < 0) return null;
  const r = rez[i];
  const x = interpolate(f, [r - POLA, r + POLA], [1100, -SIRINA - 20], { easing: Easing.inOut(Easing.sin) });
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <Isecak pts={list(x)} boja={BOJE[i % BOJE.length]} seed={`prelaz${i}`} amp={6} korak={60} />
      <image href={staticFile("kolo-icon.png")} x={x + SIRINA / 2 - 110} y={850} width={220} height={207} opacity={0.9} />
    </svg>
  );
};

export const Usteda: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    {PLAN.scene.map((s, i) => {
      const Sc = SCENE[i];
      return (
        <Sequence key={s.id} from={s.odF} durationInFrames={s.doF - s.odF} layout="none">
          <AbsoluteFill>
            <Sc />
          </AbsoluteFill>
        </Sequence>
      );
    })}
    <Prelazi />
    <Titlovi plan={PLAN} izgled="kolaz" />
    <Audio src={staticFile("miks-v1.wav")} />
  </AbsoluteFill>
);
