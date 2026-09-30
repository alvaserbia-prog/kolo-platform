// Video 1 trilogije „Poverenje“: „Čiji si ti“ — papirni kolaž, u stilu prvih videa serije
// (odluka vlasnika, 27.09.2026: linorez je odbačen). Scene 1–5 su sećanje na selo: sepija,
// vinjeta i treperenje stare fotografije; na „KOLO radi isto“ boje se razbistre.
// Scene se smenjuju papirnim listom koji prebriše kadar (rez je sakriven ispod njega).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ucitajFontove } from "../fontovi";
import { Titlovi } from "../Titlovi";
import { P } from "./paleta";
import { Defs, Isecak, Pt } from "./papir";
import { Natpis } from "./selo";
import { SCENE } from "./scene";
import { PLAN, glob, scena } from "../v1/vreme";

ucitajFontove();

const SEC_OD = glob(6, "KOLO") - 6;
const SEC_DO = glob(6, "KOLO") + 14;

type NatpisK = { od: number; do: number; tekst: string };
const S = (id: number) => scena(id);
export const NATPISI_K: NatpisK[] = [
  { od: 6, do: S(2).odF - 8, tekst: "Čiji si ti?" },
  { od: S(2).odF + 12, do: S(3).odF - 8, tekst: "Svi su se znali" },
  { od: S(3).odF + 12, do: S(4).odF - 8, tekst: "Kaže čiji je, i zna se ko je" },
  { od: glob(4, "To") - 4, do: S(5).odF - 8, tekst: "„To je Stevin zet.“" },
  { od: S(5).odF + 12, do: S(6).odF - 8, tekst: "Veza po veza" },
  { od: S(6).odF + 12, do: S(7).odF - 8, tekst: "Bez lične karte. Preko ljudi." },
  { od: glob(7, "Ko") - 4, do: PLAN.frejmova, tekst: "Ko tebe zna?" },
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

export const CijiSiTi: React.FC = () => {
  const f = useCurrentFrame();
  const sec = interpolate(f, [SEC_OD, SEC_DO], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const treper = sec * (random(`tr${Math.floor(f / 2)}`) - 0.5) * 0.05;
  const filter = sec > 0 ? `sepia(${0.55 * sec}) saturate(${1 - 0.25 * sec}) contrast(${1 - 0.05 * sec}) brightness(${1 + 0.02 * sec + treper})` : undefined;
  return (
    <AbsoluteFill style={{ background: P.papir }}>
      <Img src={staticFile("kolaz/papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      <AbsoluteFill style={{ filter }}>
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
      </AbsoluteFill>
      {sec > 0 && (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(92,62,24,0.5) 100%)", opacity: sec, mixBlendMode: "multiply" }} />
      )}
      <Prelazi />
      <Natpisi />
      <Titlovi plan={PLAN} izgled="kolaz" />
      <Audio src={staticFile("miks-v1.wav")} />
    </AbsoluteFill>
  );
};
