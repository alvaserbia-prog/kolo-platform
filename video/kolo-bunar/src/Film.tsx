// Glavna kompozicija „Bunar koji kopamo zajedno“: deset otisaka (scena), prelazi (valjak sa
// mastilom ili rastapanje), natpisi, titlovi, papir i zrno preko svega, zvuk.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { Titlovi } from "./Titlovi";
import { Natpisi } from "./Natpis";
import { PRELAZI, Valjak, clipNovog } from "./Prelazi";
import { PomakCtx } from "./alat";
import { Otisak } from "./Otisak";
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

const ScenaSloj: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const s = plan.scene[i];
  const ulaz = i > 0 ? PRELAZI[i - 1] : null;
  const izlaz = i < PRELAZI.length ? PRELAZI[i] : null;
  const pre = ulaz ? ulaz.pola : 0;
  const posle = izlaz ? izlaz.pola : 0;
  const S = SCENE[i];
  let opacity = 1;
  let clip: string | undefined;
  if (ulaz && ulaz.tip === "rastapanje") opacity = interpolate(f, [s.odF - pre, s.odF + pre], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (ulaz && ulaz.tip === "valjak") clip = clipNovog(f, s.odF, ulaz.pola);
  return (
    <AbsoluteFill style={{ zIndex: 1000 + i, opacity, clipPath: clip }}>
      <Sequence from={s.odF - pre} durationInFrames={s.doF - s.odF + pre + posle} layout="none">
        <PomakCtx.Provider value={pre}>
          <AbsoluteFill style={{ background: P.papir }}>
            <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
            <S />
          </AbsoluteFill>
        </PomakCtx.Provider>
      </Sequence>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    {plan.scene.map((s, i) => (
      <ScenaSloj key={s.id} i={i} />
    ))}
    <AbsoluteFill style={{ zIndex: 2000 }}>
      <Valjak />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2100 }}>
      <Otisak />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Natpisi />
      <Titlovi />
    </AbsoluteFill>
    <Audio src={staticFile("miks.wav")} />
  </AbsoluteFill>
);
