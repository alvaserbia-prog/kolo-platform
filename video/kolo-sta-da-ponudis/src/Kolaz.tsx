// Glavna kompozicija videa 5: papirna podloga, kuća u preseku (scene 1–5, jedna kamera),
// scene u prvom planu, prelazi, titlovi, zvuk.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { Titlovi } from "./Titlovi";
import { Prelazi } from "./Prelazi";
import { KucaSloj } from "./KucaSloj";
import { Prazna, Scena1, Scena5, Scena6, Scena7, Scena8, Scena9 } from "./scene/Scene";

ucitajFontove();

const SCENE = [Scena1, Prazna, Prazna, Prazna, Scena5, Scena6, Scena7, Scena8, Scena9];

export const Kolaz: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <KucaSloj />
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
