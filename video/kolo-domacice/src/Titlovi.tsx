// Titlovi upisani u video: krupni, u donjoj trećini, na traci starog papira (iscepane ivice).
// Prate izgovorene reči (vremena iz poravnanja); tekuća reč je zelena, kao u celoj seriji.
import React from "react";
import { random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { SERIF } from "./fontovi";
import type { Rec } from "./vreme";

type RecF = Rec & { f: number; ef: number };
type Komad = { reci: RecF[]; od: number; do: number };

const MAX_ZNAKOVA = 26;
const ISTAKNUTE = /^(„?KOLO|KOLU|POEN|ekolo\.rs)/;

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
      const sad = tek.map((x) => x.w).join(" ").length;
      const kraj = /[.?!]$/.test(w.w) || (/[,:]$/.test(w.w) && sad >= 12) || i === reci.length - 1;
      if (kraj) {
        out.push({ reci: tek, od: 0, do: 0 });
        tek = [];
      }
    });
  }
  out.forEach((k, i) => {
    k.od = k.reci[0].f - 3;
    const kraj = k.reci[k.reci.length - 1].ef + 12;
    const sled = out[i + 1]?.reci[0].f - 3;
    k.do = sled !== undefined && sled - kraj < 18 ? sled : kraj;
  });
  return out;
};

export const KOMADI_TITLOVA = komadi();

const iscepano = (seed: string) => {
  const pts: string[] = [];
  const N = 26;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${(random(`${seed}t${i}`) * 6).toFixed(2)}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(i / N) * 100}% ${(94 + random(`${seed}b${i}`) * 6).toFixed(2)}%`);
  return `polygon(${pts.join(",")})`;
};

export const Titlovi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = KOMADI_TITLOVA.find((x) => f >= x.od && f < x.do);
  if (!k) return null;
  const idx = KOMADI_TITLOVA.indexOf(k);
  const s = spring({ frame: f - k.od, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const rot = idx % 2 ? 0.9 : -0.9;
  const tekuca = k.reci.findIndex((w, i) => f >= w.f - 1 && (i === k.reci.length - 1 || f < k.reci[i + 1].f - 1));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1340,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - s) * 26}px) scale(${0.92 + 0.08 * s}) rotate(${rot}deg)`,
        opacity: Math.min(1, s * 1.5),
        filter: "drop-shadow(3px 8px 6px rgba(58,42,29,0.35))",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          padding: "30px 44px 34px",
          background: P.belo,
          backgroundImage: `url(${staticFile("gvas.png")})`,
          backgroundSize: "380px 380px",
          backgroundBlendMode: "soft-light",
          clipPath: iscepano(`t${idx}`),
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 66,
          lineHeight: 1.18,
          textAlign: "center",
          color: P.mastilo,
        }}
      >
        {k.reci.map((w, i) => (
          <span
            key={i}
            style={{
              color: i === tekuca || ISTAKNUTE.test(w.w) ? P.zelena700 : P.mastilo,
              fontWeight: 700,
              opacity: f >= w.f - 1 ? 1 : 0.5,
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
