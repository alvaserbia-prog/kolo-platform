// Glavna kompozicija: papirna podloga, šest scena, prelazi, titlovi, zvuk.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { Titlovi } from "./Titlovi";
import { Prelazi } from "./Prelazi";
import { Scena1 } from "./scene/Scena1";
import { Scena2 } from "./scene/Scena2";
import { Scena3 } from "./scene/Scena3";
import { Scena4 } from "./scene/Scena4";
import { Scena5 } from "./scene/Scena5";
import { Scena6 } from "./scene/Scena6";

ucitajFontove();

const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6];

export const Kolaz: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    {plan.scene.map((s, i) => {
      const S = SCENE[i];
      return (
        <Sequence key={s.id} from={s.odF} durationInFrames={s.doF - s.odF} layout="none">
          <AbsoluteFill>
            <S />
          </AbsoluteFill>
        </Sequence>
      );
    })}
    <Prelazi />
    <Titlovi />
    <Audio src={staticFile("miks.wav")} />
  </AbsoluteFill>
);
