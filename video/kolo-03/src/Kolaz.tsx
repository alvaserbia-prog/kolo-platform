// Glavna kompozicija: papirna podloga, šest scena, prelaz, titlovi, zvuk.
// Scene 1–2 su sećanje: izbledele (sepija), sa vinjetom i blagim treperenjem kao stara
// fotografija. Na „KOLO to pamćenje zapisuje" boje se razbistre — od tada je sadašnjost.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
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
import { kad, scena } from "./vreme";

ucitajFontove();

const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6];
const SEC_OD = scena(3).odF + kad(3, "KOLO");
const SEC_DO = scena(3).odF + kad(3, "zapisuje.") + 10;

export const Kolaz: React.FC = () => {
  const f = useCurrentFrame();
  const sec = interpolate(f, [SEC_OD, SEC_DO], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const treper = sec * (random(`tr${Math.floor(f / 2)}`) - 0.5) * 0.05;
  const filter = sec > 0 ? `sepia(${0.62 * sec}) saturate(${1 - 0.3 * sec}) contrast(${1 - 0.06 * sec}) brightness(${1 + 0.02 * sec + treper})` : undefined;
  return (
    <AbsoluteFill style={{ background: P.papir }}>
      <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      <AbsoluteFill style={{ filter }}>
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
      </AbsoluteFill>
      {sec > 0 && (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(92,62,24,0.55) 100%)",
            opacity: sec,
            mixBlendMode: "multiply",
          }}
        />
      )}
      <Prelazi />
      <Titlovi />
      <Audio src={staticFile("miks.wav")} />
    </AbsoluteFill>
  );
};
