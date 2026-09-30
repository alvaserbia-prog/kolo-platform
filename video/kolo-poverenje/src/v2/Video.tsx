// Video 2 trilogije „Poverenje“: „Poznaješ li nekoga u KOLU?“ — naiva.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { ucitajFontove } from "../fontovi";
import { Sekvenca, type Prelaz } from "../Sekvenca";
import { Titlovi } from "../Titlovi";
import { PomakCtx } from "./naiva";
import { CvetniPrelaz, Natpisi, Platno, PlatnoPozadina, Ram, clipCveta, type Natpis } from "./okvir";
import { SCENE } from "./scene";
import { PLAN, glob, scena } from "./vreme";

ucitajFontove();

export const PRELAZI: Prelaz[] = [
  { tip: "brisanje", pola: 14 },
  { tip: "rez", pola: 0 },
  { tip: "brisanje", pola: 14 },
  { tip: "brisanje", pola: 14 },
  { tip: "brisanje", pola: 14 },
];

const S = (id: number) => scena(id);
export const NATPISI: Natpis[] = [
  { od: 4, do: S(2).odF - 10, redovi: ["Ne poznaješ nikoga", "u KOLU?"] },
  { od: S(2).odF + 10, do: S(3).odF, redovi: ["Poznaješ nekoga?", "On te potvrdi."] },
  { od: S(3).odF + 4, do: S(4).odF - 10, redovi: ["Ne poznaješ nikoga?", "Postavi oglas."] },
  { od: S(4).odF + 10, do: S(5).odF - 10, redovi: ["Razmenite.", "Upoznajte se."] },
  { od: S(5).odF + 10, do: S(6).odF - 10, redovi: ["Dva puta do KOLA"], zelena: true },
  { od: S(6).odF + 10, do: glob(6, "ekolo.rs") - 12, redovi: ["Postavi prvi oglas"] },
];

export const PoznajesLiNekoga: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFF8EC" }}>
    <Sekvenca plan={PLAN} scene={SCENE} prelazi={PRELAZI} Pozadina={PlatnoPozadina} clipBrisanja={clipCveta} PomakCtx={PomakCtx} />
    <AbsoluteFill style={{ zIndex: 2000 }}>
      <CvetniPrelaz plan={PLAN} prelazi={PRELAZI} />
    </AbsoluteFill>
    <Platno />
    <AbsoluteFill style={{ zIndex: 2150 }}>
      <Ram oznaka="2/3 · Poverenje · naiva" />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Natpisi natpisi={NATPISI} />
      <Titlovi plan={PLAN} izgled="naiva" />
    </AbsoluteFill>
    <Audio src={staticFile("miks-v2.wav")} />
  </AbsoluteFill>
);
