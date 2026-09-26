// Titlovi upisani u video: krupni, u donjoj trećini, na papirnoj traci.
// Prate izgovorene reči (vremena iz poravnanja); tekuća reč je zelena.
import React from "react";
import { random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { SANS } from "./fontovi";
import type { Rec } from "./vreme";

type RecF = Rec & { f: number; ef: number };
type Komad = { reci: RecF[]; od: number; do: number };

const MAX_ZNAKOVA = 27;
const ISTAKNUTE = /^(KOLO|KOLU|POEN-i|ekolo\.rs)/;

const komadi = (): Komad[] => {
  const out: Komad[] = [];
  for (const s of plan.scene) {
    let tek: RecF[] = [];
    const reci = s.reci as Rec[];
    reci.forEach((w, i) => {
      const r = { ...w, f: Math.round((s.glasOd + w.s) * plan.fps), ef: Math.round((s.glasOd + w.e) * plan.fps) };
      const duzina = tek.map((x) => x.w).join(" ").length;
      if (tek.length && duzina + 1 + w.w.length > MAX_ZNAKOVA) {
        out.push({ reci: tek, od: 0, do: 0 });
        tek = [];
      }
      tek.push(r);
      const kraj = /[.?!]$/.test(w.w) || (/,$/.test(w.w) && tek.map((x) => x.w).join(" ").length >= 14) || i === reci.length - 1;
      if (kraj) {
        out.push({ reci: tek, od: 0, do: 0 });
        tek = [];
      }
    });
  }
  // vremena: od početka prve reči (malo ranije) do sledećeg komada ili kraja poslednje reči
  out.forEach((k, i) => {
    k.od = k.reci[0].f - 3;
    const kraj = k.reci[k.reci.length - 1].ef + 12;
    const sled = out[i + 1]?.reci[0].f - 3;
    k.do = sled !== undefined && sled - kraj < 18 ? sled : kraj;
  });
  return out;
};

const KOMADI = komadi();

/** Iscepana ivica trake (clip-path poligon), drugačija za svaki komad. */
const iscepano = (seed: string) => {
  const pts: string[] = [];
  const N = 26;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${(random(`${seed}t${i}`) * 5).toFixed(2)}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(i / N) * 100}% ${(95 + random(`${seed}b${i}`) * 5).toFixed(2)}%`);
  return `polygon(${pts.join(",")})`;
};

export const Titlovi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = KOMADI.find((x) => f >= x.od && f < x.do);
  if (!k) return null;
  const idx = KOMADI.indexOf(k);
  const s = spring({ frame: f - k.od, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const rot = idx % 2 ? 1.2 : -1.2;
  const tekuca = k.reci.findIndex((w, i) => f >= w.f - 1 && (i === k.reci.length - 1 || f < k.reci[i + 1].f - 1));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1330,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s}) rotate(${rot}deg)`,
        opacity: Math.min(1, s * 1.5),
        filter: "drop-shadow(3px 7px 5px rgba(59,42,20,0.3))",
      }}
    >
      <div
        style={{
          maxWidth: 1010,
          padding: "28px 40px 32px",
          background: P.belo,
          backgroundImage: `url(${staticFile("zrno.png")})`,
          backgroundBlendMode: "soft-light",
          clipPath: iscepano(`t${idx}`),
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.22,
          textAlign: "center",
          color: P.tekst,
          letterSpacing: -0.5,
        }}
      >
        {k.reci.map((w, i) => (
          <span
            key={i}
            style={{
              color: i === tekuca ? P.zelena700 : ISTAKNUTE.test(w.w) ? P.zelena700 : P.tekst,
              fontWeight: ISTAKNUTE.test(w.w) ? 900 : 800,
              opacity: f >= w.f - 1 ? 1 : 0.55,
            }}
          >
            {w.w}
            {i < k.reci.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export const KOMADI_TITLOVA = KOMADI;
