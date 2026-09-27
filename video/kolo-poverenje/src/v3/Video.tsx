// Video 3 trilogije „Poverenje“: „Potvrda nosi odgovornost“ — lavirani tuš i akvarel.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { ucitajFontove } from "../fontovi";
import { Sekvenca, type Prelaz } from "../Sekvenca";
import { Titlovi } from "../Titlovi";
import { PomakCtx } from "./tus";
import { AkvarelPozadina, AkvarelPreko, Natpisi, type Natpis } from "./okvir";
import { SCENE } from "./scene";
import { PLAN, glob, scena } from "./vreme";

ucitajFontove();

export const PRELAZI: Prelaz[] = [
  { tip: "pretapanje", pola: 14 },
  { tip: "pretapanje", pola: 10 },
  { tip: "pretapanje", pola: 12 },
  { tip: "pretapanje", pola: 14 },
  { tip: "pretapanje", pola: 14 },
];

const S = (id: number) => scena(id);
export const NATPISI: Natpis[] = [
  { od: 6, do: S(2).odF - 8, redovi: ["Bunar može", "da se zamuti"] },
  { od: S(2).odF + 12, do: S(3).odF - 8, redovi: ["KOLO je naš", "zajednički bunar"] },
  { od: S(3).odF + 12, do: S(4).odF - 8, redovi: ["Lažna potvrda", "muti bunar svima"] },
  { od: glob(4, "Kažeš") - 6, do: S(5).odF - 8, redovi: ["„Znam ga lično.“"], zelena: true },
  { od: S(6).odF + 12, do: glob(6, "ekolo.rs") - 18, redovi: ["Potvrdi samo", "one koje znaš"] },
];

export const PotvrdaOdgovornost: React.FC = () => (
  <AbsoluteFill style={{ background: "#F6F4EE" }}>
    <Sekvenca plan={PLAN} scene={SCENE} prelazi={PRELAZI} Pozadina={AkvarelPozadina} clipBrisanja={() => ""} PomakCtx={PomakCtx} />
    <AkvarelPreko oznaka="3/3 · Poverenje · tuš i akvarel" />
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Natpisi natpisi={NATPISI} />
      <Titlovi plan={PLAN} izgled="tus" />
    </AbsoluteFill>
    <Audio src={staticFile("miks-v3.wav")} />
  </AbsoluteFill>
);
