// Glavna kompozicija „Trampa“: školska tabla, jedanaest scena crtanih kredom, prelazi (sunđer ili
// rastapanje), titlovi na traci papira, zvuk.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { Titlovi } from "./Titlovi";
import { PRELAZI, Sundjer, VlaznaTabla, clipNovog, clipStarog } from "./Prelazi";
import { PomakCtx } from "./alat";
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
import { Scena11 } from "./scene/Scena11";

ucitajFontove();

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7, Scena8, Scena9, Scena10, Scena11];

// Scene su prozirne (kreda na providnom), a tabla je jedan sloj ispod svih. Zato se pri brisanju stara scena
// seče desno od sunđera, a nova levo od njega; pri rastapanju stara bledi dok se nova pojavljuje.

const ScenaSloj: React.FC<{ i: number }> = ({ i }) => {
  const g = useCurrentFrame();
  const s = plan.scene[i];
  const ulaz = i > 0 ? PRELAZI[i - 1] : null;
  const izlaz = i < PRELAZI.length ? PRELAZI[i] : null;
  const pre = ulaz ? ulaz.pola : 0;
  const posle = izlaz ? izlaz.pola : 0;
  const S = SCENE[i];
  let opacity = 1;
  const k = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  if (ulaz && ulaz.tip === "rastapanje") opacity *= interpolate(g, [s.odF - pre, s.odF + pre], [0, 1], k);
  if (izlaz && izlaz.tip === "rastapanje") opacity *= interpolate(g, [s.doF - posle, s.doF + posle], [1, 0], k);
  let clip: string | undefined;
  if (izlaz && izlaz.tip === "brisanje" && g >= s.doF - posle) clip = clipStarog(g, s.doF, izlaz.pola);
  if (ulaz && ulaz.tip === "brisanje" && g < s.odF + pre) clip = clipNovog(g, s.odF, ulaz.pola);
  return (
    <AbsoluteFill style={{ zIndex: 1000 + i, opacity, clipPath: clip }}>
      <Sequence from={s.odF - pre} durationInFrames={s.doF - s.odF + pre + posle} layout="none">
        <PomakCtx.Provider value={pre}>
          <S />
        </PomakCtx.Provider>
      </Sequence>
    </AbsoluteFill>
  );
};

export const Tabla: React.FC = () => (
  <AbsoluteFill style={{ background: P.tabla }}>
    <Img src={staticFile("tabla.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <AbsoluteFill style={{ zIndex: 500 }}>
      <VlaznaTabla />
    </AbsoluteFill>
    {plan.scene.map((s, i) => (
      <ScenaSloj key={s.id} i={i} />
    ))}
    <AbsoluteFill style={{ zIndex: 2000 }}>
      <Sundjer />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Titlovi />
    </AbsoluteFill>
    <Audio src={staticFile("miks.wav")} />
  </AbsoluteFill>
);
