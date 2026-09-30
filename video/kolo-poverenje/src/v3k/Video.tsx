// Video 3 trilogije „Poverenje“: „Potvrda nosi odgovornost“ — papirni kolaž, kao „Čiji si ti“
// i prvi videi serije (odluka vlasnika, 29.09.2026: tuš i akvarel je odbačen).
// Scene se smenjuju papirnim listom koji prebriše kadar (rez je sakriven ispod njega).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ucitajFontove } from "../fontovi";
import { Titlovi } from "../Titlovi";
import { P } from "../v1k/paleta";
import { Defs, Isecak, Pt } from "../v1k/papir";
import { Natpis } from "../v1k/selo";
import { SCENE } from "./scene";
import { PLAN, glob, scena } from "../v3/vreme";

ucitajFontove();

type NatpisK = { od: number; do: number; tekst: string };
const S = (id: number) => scena(id);
export const NATPISI_K: NatpisK[] = [
  { od: 6, do: S(2).odF - 8, tekst: "Bunar može da se zamuti" },
  { od: S(2).odF + 12, do: S(3).odF - 8, tekst: "KOLO je naš bunar" },
  { od: S(3).odF + 12, do: S(4).odF - 8, tekst: "Lažna potvrda muti bunar svima" },
  { od: glob(4, "Kažeš") - 6, do: S(5).odF - 8, tekst: "„Znam ga lično.“" },
  { od: S(6).odF + 12, do: glob(6, "ekolo.rs") - 20, tekst: "Potvrdi samo one koje znaš" },
];

const Natpisi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = NATPISI_K.find((x) => f >= x.od && f < x.do);
  if (!n) return null;
  const s = spring({ frame: f - n.od, fps, config: { damping: 10, stiffness: 170, mass: 0.7 } });
  const izlaz = interpolate(f, [n.do - 6, n.do], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - izlaz }}>
      <Defs />
      <g transform={`translate(540 200) rotate(${-2 + (1 - s) * -8}) scale(${s})`}>
        <Natpis seed={`n${n.od}`} tekst={n.tekst} duzina={n.tekst.length} velicina={n.tekst.length > 20 ? 64 : 76} />
      </g>
    </svg>
  );
};

const BOJE = [P.zelena700, P.zlatna400, P.korala, P.zelenaSvetla, P.nebo, P.zlatna400];
const SIRINA = 1500;
const POLA = 10;
const list = (x: number): Pt[] => {
  const pts: Pt[] = [];
  for (let y = -40; y <= 1960; y += 80) pts.push([x + (y % 160 ? 18 : -14), y]);
  for (let y = 1960; y >= -40; y -= 80) pts.push([x + SIRINA + (y % 160 ? -16 : 12), y]);
  return pts;
};
const Prelazi: React.FC = () => {
  const f = useCurrentFrame();
  const rez = PLAN.scene.slice(1).map((s) => s.odF);
  const i = rez.findIndex((r) => f >= r - POLA && f < r + POLA);
  if (i < 0) return null;
  const r = rez[i];
  const x = interpolate(f, [r - POLA, r + POLA], [1100, -SIRINA - 20], { easing: Easing.inOut(Easing.sin) });
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <Isecak pts={list(x)} boja={BOJE[i % BOJE.length]} seed={`prelaz${i}`} amp={6} korak={60} />
      <image href={staticFile("kolo-icon.png")} x={x + SIRINA / 2 - 110} y={850} width={220} height={207} opacity={0.9} />
    </svg>
  );
};

export const PotvrdaOdgovornost: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    {PLAN.scene.map((s, i) => {
      const Sc = SCENE[i];
      return (
        <Sequence key={s.id} from={s.odF} durationInFrames={s.doF - s.odF} layout="none">
          <AbsoluteFill>
            <Sc />
          </AbsoluteFill>
        </Sequence>
      );
    })}
    <Prelazi />
    <Natpisi />
    <Titlovi plan={PLAN} izgled="kolaz" />
    <Audio src={staticFile("miks-v3.wav")} />
  </AbsoluteFill>
);
