// Titlovi upisani u video: krupni, u donjoj trećini, na beloj zaobljenoj kartici (izometrijski stil).
// Prate izgovorene reči (vremena iz poravnanja); tekuća reč je zelena, kao u celoj seriji.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import plan from "./plan.json";
import { P } from "./paleta";
import { SANS } from "./fontovi";
import { PREDNOST_S, type Rec } from "./vreme";

type RecF = Rec & { f: number; ef: number };
type Komad = { reci: RecF[]; od: number; do: number };

const MAX_ZNAKOVA = 26;
const UNAPRED_TRAKA = 8; // frejmova
const UNAPRED_REC = 3; // frejmova
const ISTAKNUTE = /^(„?KOLO|KOLA|KOLU|POEN|ekolo\.rs)/;

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
  // Traka se pojavi ~0,25 s pre prve reči (oko stigne da pročita), a reč pozeleni ~0,1 s pre
  // izgovora — tako titl deluje „na vreme“; tačno na početku zvuka već deluje zakasnelo.
  out.forEach((k, i) => {
    k.od = k.reci[0].f - UNAPRED_TRAKA;
    const kraj = k.reci[k.reci.length - 1].ef + 12;
    const sled = out[i + 1]?.reci[0].f - UNAPRED_TRAKA;
    k.do = sled !== undefined && sled - kraj < 18 ? sled : kraj;
  });
  return out;
};

export const KOMADI_TITLOVA = komadi();

export const Titlovi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = KOMADI_TITLOVA.find((x) => f >= x.od && f < x.do);
  if (!k) return null;
  const idx = KOMADI_TITLOVA.indexOf(k);
  const s = spring({ frame: f - k.od, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const tekuca = k.reci.findIndex((w, i) => f >= w.f - UNAPRED_REC && (i === k.reci.length - 1 || f < k.reci[i + 1].f - UNAPRED_REC));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1430,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - s) * 26}px) scale(${0.92 + 0.08 * s})`,
        opacity: Math.min(1, s * 1.5),
        filter: "drop-shadow(0px 10px 14px rgba(34,50,74,0.28))",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          padding: "26px 42px 30px",
          background: P.belo,
          borderRadius: 36,
          border: `5px solid ${P.mastilo}`,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.18,
          textAlign: "center",
          color: P.mastilo,
        }}
      >
        {k.reci.map((w, i) => (
          <span
            key={i}
            style={{
              color: i === tekuca || ISTAKNUTE.test(w.w) ? P.zelena500 : P.mastilo,
              fontWeight: 800,
              opacity: f >= w.f - UNAPRED_REC ? 1 : 0.5,
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
