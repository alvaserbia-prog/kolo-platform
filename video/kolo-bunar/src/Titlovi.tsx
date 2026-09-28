// Titlovi upisani u video: krupni, u donjoj trećini, na etiketi ručnog papira sa otisnutim okvirom.
// Prate izgovorene reči (vremena iz poravnanja); tekuća reč je zelena, kao u celoj seriji.
import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { SERIF } from "./fontovi";
import { PREDNOST_S, type Rec } from "./vreme";

type RecF = Rec & { f: number; ef: number };
type Komad = { reci: RecF[]; od: number; do: number };

const MAX_ZNAKOVA = 26;
const UNAPRED_TRAKA = 8; // frejmova
const UNAPRED_REC = 3; // frejmova
const ISTAKNUTE = /^(„?KOLO|KOLU|ekolo\.rs)/;

const komadi = (): Komad[] => {
  const out: Komad[] = [];
  for (const s of plan.scene) {
    let tek: RecF[] = [];
    const reci = s.reci as Rec[];
    reci.forEach((w, i) => {
      const r = { ...w, f: Math.round((s.glasOd + w.s - PREDNOST_S) * plan.fps), ef: Math.round((s.glasOd + w.e - PREDNOST_S) * plan.fps) };
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
    k.od = k.reci[0].f - UNAPRED_TRAKA;
    const kraj = k.reci[k.reci.length - 1].ef + 12;
    const sled = out[i + 1]?.reci[0].f - UNAPRED_TRAKA;
    k.do = sled !== undefined && sled - kraj < 18 ? sled : kraj;
  });
  return out;
};

export const KOMADI_TITLOVA = komadi();

/** Neravna ivica etikete (otisak na grubom papiru). */
const ivica = (seed: string) => {
  const pts: string[] = [];
  const N = 30;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${(random(`${seed}t${i}`) * 3).toFixed(2)}%`);
  for (let i = 0; i <= N; i++) pts.push(`${(100 - random(`${seed}r${i}`) * 0.8).toFixed(2)}% ${(i / N) * 100}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(i / N) * 100}% ${(97 + random(`${seed}b${i}`) * 3).toFixed(2)}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(random(`${seed}l${i}`) * 0.8).toFixed(2)}% ${(i / N) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

export const Titlovi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = KOMADI_TITLOVA.find((x) => f >= x.od && f < x.do);
  if (!k) return null;
  const idx = KOMADI_TITLOVA.indexOf(k);
  const s = spring({ frame: f - k.od, fps, config: { damping: 14, stiffness: 240, mass: 0.6 } });
  const rot = idx % 2 ? 0.6 : -0.6;
  const tekuca = k.reci.findIndex((w, i) => f >= w.f - UNAPRED_REC && (i === k.reci.length - 1 || f < k.reci[i + 1].f - UNAPRED_REC));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1350,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - s) * 22}px) scale(${0.94 + 0.06 * s}) rotate(${rot}deg)`,
        opacity: Math.min(1, s * 1.5),
        filter: "drop-shadow(4px 7px 0px rgba(31,27,23,0.85))",
      }}
    >
      <div style={{ clipPath: ivica(`o${idx}`), background: P.mastilo, padding: 7 }}>
        <div
          style={{
            maxWidth: 960,
            padding: "26px 42px 30px",
            background: P.belo,
            clipPath: ivica(`t${idx}`),
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 66,
            lineHeight: 1.18,
            textAlign: "center",
            color: P.mastilo,
          }}
        >
          {k.reci.map((w, i) => (
            <span key={i} style={{ color: i === tekuca || ISTAKNUTE.test(w.w) ? P.zelena700 : P.mastilo, opacity: f >= w.f - UNAPRED_REC ? 1 : 0.45 }}>
              {w.w}
              {i < k.reci.length - 1 ? " " : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
