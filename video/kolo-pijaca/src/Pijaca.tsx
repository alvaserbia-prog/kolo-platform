// Glavna kompozicija „Pijaca“: deset izometrijskih scena koje se pretapaju, titlovi, zvuk.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { Titlovi } from "./Titlovi";
import { Defs, PomakCtx } from "./iso";
import { Scena1 } from "./scene/Scena1";
import { Scena2 } from "./scene/Scena2";
import { Scena3 } from "./scene/Scena3";
import { Scena4 } from "./scene/Scena4";
import { Scena5 } from "./scene/Scena5";
import { Scena6 } from "./scene/Scena6";
import { Scena7 } from "./scene/Scena7";
import { Scena8 } from "./scene/Scena8";
import { Scena9 } from "./scene/Scena9";
import { Scena10 } from "./scene/Scena10";

ucitajFontove();

const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7, Scena8, Scena9, Scena10];
const PRELAZ = 9; // frejmova pretapanja (pola pre, pola posle granice)

const ScenaSloj: React.FC<{ i: number }> = ({ i }) => {
  const g = useCurrentFrame();
  const s = plan.scene[i];
  const pre = i > 0 ? PRELAZ : 0;
  const posle = i < SCENE.length - 1 ? PRELAZ : 0;
  const S = SCENE[i];
  const opacity = i > 0 ? interpolate(g, [s.odF - PRELAZ, s.odF + PRELAZ], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ zIndex: 1000 + i, opacity }}>
      <Sequence from={s.odF - pre} durationInFrames={s.doF - s.odF + pre + posle} layout="none">
        <PomakCtx.Provider value={pre}>
          <AbsoluteFill style={{ background: P.pozadina }}>
            <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
              <Defs />
              <S />
            </svg>
          </AbsoluteFill>
        </PomakCtx.Provider>
      </Sequence>
    </AbsoluteFill>
  );
};

export const Pijaca: React.FC = () => (
  <AbsoluteFill style={{ background: P.pozadina }}>
    {plan.scene.map((s, i) => (
      <ScenaSloj key={s.id} i={i} />
    ))}
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Titlovi />
    </AbsoluteFill>
    <Audio src={staticFile("miks.wav")} />
  </AbsoluteFill>
);
