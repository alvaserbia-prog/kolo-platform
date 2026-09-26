// Glavna kompozicija „Domaćice“: stranice slikovnice (10 scena), prelazi (listanje stranice ili
// rastapanje), naslovi, titlovi, papir i zrno preko svega, zvuk.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { Titlovi } from "./Titlovi";
import { Naslovi } from "./Naslov";
import { Listanje, PRELAZI, clipStarog } from "./Prelazi";
import { PomakCtx } from "./alat";
import { Stranica } from "./Stranica";
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

// Raspored slojeva: kod listanja stari list je iznad novog, kod rastapanja novi iznad starog.
const Z: number[] = [1000];
for (let i = 0; i < SCENE.length - 1; i++) Z.push(Z[i] + (PRELAZI[i].tip === "list" ? -1 : 1));

const ScenaSloj: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const s = plan.scene[i];
  const ulaz = i > 0 ? PRELAZI[i - 1] : null;
  const izlaz = i < PRELAZI.length ? PRELAZI[i] : null;
  const pre = ulaz ? ulaz.pola : 0;
  const posle = izlaz ? izlaz.pola : 0;
  const S = SCENE[i];
  // lokalno vreme unutar Sequence-a počinje `pre` frejmova pre scene
  const g = f; // globalni frejm (Sequence ga ne pomera jer je spoljna kompozicija bez pomeraja)
  let opacity = 1;
  if (ulaz && ulaz.tip === "rastapanje") opacity = interpolate(g, [s.odF - pre, s.odF + pre], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clip = izlaz && izlaz.tip === "list" ? clipStarog(g, plan.scene[i + 1].odF, izlaz.pola) : undefined;
  return (
    <AbsoluteFill style={{ zIndex: Z[i], opacity, clipPath: clip }}>
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

export const Slikovnica: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    {plan.scene.map((s, i) => (
      <ScenaSloj key={s.id} i={i} />
    ))}
    <AbsoluteFill style={{ zIndex: 2000 }}>
      <Listanje />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2100 }}>
      <Stranica />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Naslovi />
      <Titlovi />
    </AbsoluteFill>
    <Audio src={staticFile("miks.wav")} />
  </AbsoluteFill>
);
