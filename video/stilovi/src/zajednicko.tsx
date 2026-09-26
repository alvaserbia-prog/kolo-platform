// Zajedničko za svih pet probnih stilova: muzika (10 s isečak), fontovi, znak.
import React from "react";
import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import { ucitajFontove } from "./fontovi";

ucitajFontove();

export const FPS = 30;
export const TRAJANJE = 10 * FPS;

/** Isečak tamburaške muzike: kratko pojačavanje na početku, stišavanje poslednje sekunde. */
export const Muzika: React.FC<{ fajl?: string; odSekunde?: number; jacina?: number }> = ({
  fajl = "muzika.mp3",
  odSekunde = 8.57,
  jacina = 0.9,
}) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <Audio
      src={staticFile(fajl)}
      trimBefore={Math.round(odSekunde * FPS)}
      volume={(f) =>
        jacina *
        interpolate(f, [0, 6, durationInFrames - 30, durationInFrames - 2], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

/** KOLO znak (tri glave oko zrna) kao SVG, iz kolo-znak.svg; r = poluprečnik kruga glava. */
export const Znak: React.FC<{ velicina: number; pozadina?: boolean; napredak?: number }> = ({ velicina, pozadina = true, napredak = 1 }) => {
  const s = velicina / 64;
  const p = (i: number) => Math.max(0, Math.min(1, napredak * 4 - i));
  return (
    <svg width={velicina} height={velicina} viewBox="0 0 64 64" style={{ display: "block" }}>
      {pozadina && <rect width="64" height="64" rx="14" fill="#0F3D20" />}
      <path d="M32 19c6.2 7 6.2 18 0 25-6.2-7-6.2-18 0-25z" fill="#F5B842" style={{ transformOrigin: "32px 31px", transform: `scale(${p(3)})` }} />
      {[
        [32, 13],
        [15.6, 42],
        [48.4, 42],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5 * p(i)} fill="#86C97A" />
      ))}
      {s < 0 && null}
    </svg>
  );
};

export const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/** Natpis koji uskoči (odskok) i ode; od/do u frejmovima. */
export const Natpis: React.FC<{
  f: number;
  od: number;
  do: number;
  children: React.ReactNode;
  boja?: string;
  velicina?: number;
  y?: number;
  font?: string;
  tezina?: number;
  senka?: string;
}> = ({ f, od, do: dok, children, boja = "#FFFDF7", velicina = 76, y = 230, font = "'Noto Sans', sans-serif", tezina = 900, senka }) => {
  if (f < od || f >= dok) return null;
  const ul = clamp01((f - od) / 9);
  const iz = clamp01((dok - f) / 6);
  const s = 0.7 + 0.3 * ease(ul) + Math.sin(ul * Math.PI) * 0.08;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        textAlign: "center",
        color: boja,
        fontFamily: font,
        fontWeight: tezina,
        fontSize: velicina,
        lineHeight: 1.12,
        letterSpacing: -1,
        opacity: Math.min(ul * 2, iz),
        transform: `scale(${s}) translateY(${(1 - iz) * -20}px)`,
        textShadow: senka,
      }}
    >
      {children}
    </div>
  );
};
