// Glavna kompozicija: papirna podloga, šest scena, prelazi, štoperica, titlovi, zvuk.
// Scene 1–4 teku bez reza (telefon ostaje u kadru); pred scene 5 i 6 papirni list prebriše kadar.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { Titlovi } from "./Titlovi";
import { Prelazi } from "./Prelazi";
import { Defs, napredak, usePop } from "./papir";
import { Stoperica } from "./ekran";
import { Scena1 } from "./scene/Scena1";
import { Scena2 } from "./scene/Scena2";
import { Scena3 } from "./scene/Scena3";
import { Scena4 } from "./scene/Scena4";
import { Scena5 } from "./scene/Scena5";
import { Scena6 } from "./scene/Scena6";
import { kad, scena } from "./vreme";

ucitajFontove();

const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6];

// Štoperica: 0:00 na „ekolo.rs", 1:00 na „unutra" (udar u muzici), 2:00 na „sam." (objavljen oglas).
const S0 = scena(2).odF + kad(2, "ekolo.rs");
const S1 = scena(2).odF + kad(2, "unutra,");
const S2 = scena(3).odF + kad(3, "sam.") + 4;
const S_ODE = scena(4).odF + 26;

const Sat: React.FC = () => {
  const f = useCurrentFrame();
  const ulaz = usePop(S0 - 8, 150);
  if (f < S0 - 8 || f > S_ODE + 20) return null;
  const sek = interpolate(f, [S0, S1, S2], [0, 60, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ode = napredak(f, S_ODE, 18, Easing.in(Easing.cubic));
  const udar = (x: number) => Math.max(0, 1 - Math.abs(f - x) / 8);
  const s = ulaz * (1 + 0.16 * Math.max(udar(S1), udar(S2)));
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <g transform={`translate(${150 - ode * 400} ${330 - ode * 200}) rotate(${-6 + (1 - ulaz) * -20}) scale(${s.toFixed(4)})`}>
        <Stoperica seed="sat" sek={sek} r={86} />
      </g>
    </svg>
  );
};

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
    <Sat />
    <Prelazi />
    <Titlovi />
    <Audio src={staticFile("miks.wav")} />
  </AbsoluteFill>
);
