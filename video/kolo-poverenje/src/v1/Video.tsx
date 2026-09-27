// Video 1 trilogije „Poverenje“: „Čiji si ti“ — linorez.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { ucitajFontove } from "../fontovi";
import { Sekvenca, type Prelaz } from "../Sekvenca";
import { Titlovi } from "../Titlovi";
import { PomakCtx } from "./linorez";
import { List, ListMesanje, Natpisi, PapirPozadina, Valjak, clipValjka, type Natpis } from "./okvir";
import { SCENE } from "./scene";
import { PLAN, glob, scena } from "./vreme";

ucitajFontove();

export const PRELAZI: Prelaz[] = [
  { tip: "brisanje", pola: 12 },
  { tip: "brisanje", pola: 12 },
  { tip: "brisanje", pola: 12 },
  { tip: "brisanje", pola: 12 },
  { tip: "pretapanje", pola: 10 },
  { tip: "brisanje", pola: 12 },
];

const S = (id: number) => scena(id);
export const NATPISI: Natpis[] = [
  { od: 4, do: S(2).odF - 12, redovi: ["Čiji si ti?"] },
  { od: S(2).odF + 12, do: S(3).odF - 12, redovi: ["Svi su se znali"] },
  { od: S(3).odF + 12, do: S(4).odF - 12, redovi: ["Kaže čiji je,", "i zna se ko je"] },
  { od: glob(4, "To") - 4, do: glob(4, "I") - 2, redovi: ["„To je Stevin zet.“"] },
  { od: S(5).odF + 12, do: S(6).odF - 8, redovi: ["Veza po veza"] },
  { od: S(6).odF + 8, do: S(7).odF - 12, redovi: ["Bez lične karte.", "Preko ljudi."] },
  { od: glob(7, "Ko") - 4, do: PLAN.frejmova, redovi: ["Ko tebe zna?"], zelena: true },
];

export const CijiSiTi: React.FC = () => (
  <AbsoluteFill style={{ background: "#ECE3CF" }}>
    <Sekvenca plan={PLAN} scene={SCENE} prelazi={PRELAZI} Pozadina={PapirPozadina} clipBrisanja={clipValjka} PomakCtx={PomakCtx} />
    <AbsoluteFill style={{ zIndex: 2000 }}>
      <Valjak plan={PLAN} prelazi={PRELAZI} />
    </AbsoluteFill>
    <ListMesanje />
    <AbsoluteFill style={{ zIndex: 2150 }}>
      <List oznaka="1/3 · Poverenje · „Čiji si ti“" />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2200 }}>
      <Natpisi natpisi={NATPISI} />
      <Titlovi plan={PLAN} izgled="linorez" />
    </AbsoluteFill>
    <Audio src={staticFile("miks-v1.wav")} />
  </AbsoluteFill>
);
