// Titlovi upisani u video: krupni, u donjoj trećini, čitljivi bez zvuka. Prate izgovorene reči
// (vremena iz prisilnog poravnanja); tekuća reč je zelena, kao u celoj seriji.
// Mehanika je zajednička, a izgled prati stil svakog videa (linorez, naiva, tuš).
import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./fontovi";
import type { Plan, Rec } from "./vreme";

type RecF = Rec & { f: number; ef: number };
export type Komad = { reci: RecF[]; od: number; do: number };
export type IzgledTitla = "linorez" | "naiva" | "tus" | "kolaz";

const MAX_ZNAKOVA = 24;
const UNAPRED_TRAKA = 8;
const UNAPRED_REC = 3;
const ISTAKNUTE = /^(„?KOLO|KOLU|KOLA|POEN|ekolo\.rs)/;
const ZELENA = "#1F8A4C";
// Titl ide PREDNOST_TITLA s ispred izgovorene reči (video 13, vlasnik 03.10.2026: posle ukidanja pravila
// „1 s ispred“ tačno poravnat titl je opet delovao kao da kasni). Pokret i slika ostaju uz reč.
const PREDNOST_TITLA = 0.5;

export const komadiTitlova = (plan: Plan): Komad[] => {
  const out: Komad[] = [];
  for (const s of plan.scene) {
    let tek: RecF[] = [];
    s.reci.forEach((w, i) => {
      const p = (plan.prednost ?? 0) + PREDNOST_TITLA;
      const r = { ...w, f: Math.round((s.glasOd + w.s - p) * plan.fps), ef: Math.round((s.glasOd + w.e - p) * plan.fps) };
      const duzina = tek.map((x) => x.w).join(" ").length;
      if (tek.length && duzina + 1 + w.w.length > MAX_ZNAKOVA) {
        out.push({ reci: tek, od: 0, do: 0 });
        tek = [];
      }
      tek.push(r);
      const sad = tek.map((x) => x.w).join(" ").length;
      const kraj = /[.?!“]$/.test(w.w) || (/[,:]$/.test(w.w) && sad >= 12) || i === s.reci.length - 1;
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

const kes = new WeakMap<Plan, Komad[]>();
const komadiZa = (plan: Plan) => {
  if (!kes.has(plan)) kes.set(plan, komadiTitlova(plan));
  return kes.get(plan)!;
};

const neravno = (seed: string, amp: number) => {
  const pts: string[] = [];
  const N = 18;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${(random(`${seed}t${i}`) * amp).toFixed(2)}%`);
  for (let i = 0; i <= N; i++) pts.push(`${(100 - random(`${seed}r${i}`) * amp * 0.4).toFixed(2)}% ${(i / N) * 100}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(i / N) * 100}% ${(100 - random(`${seed}b${i}`) * amp).toFixed(2)}%`);
  for (let i = N; i >= 0; i--) pts.push(`${(random(`${seed}l${i}`) * amp * 0.4).toFixed(2)}% ${(i / N) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

const IZGLED: Record<IzgledTitla, { kutija: (idx: number) => React.CSSProperties; tekst: string; senka: string; font: number }> = {
  linorez: {
    kutija: (idx) => ({
      background: "#ECE3CF",
      border: "7px solid #1E1A17",
      boxShadow: "10px 10px 0 #1E1A17",
      borderRadius: 4,
      clipPath: undefined,
      transform: `rotate(${idx % 2 ? 0.7 : -0.7}deg)`,
    }),
    tekst: "#1E1A17",
    senka: "none",
    font: 64,
  },
  naiva: {
    kutija: () => ({
      background: "#FFFBEF",
      border: "6px solid #F2B705",
      outline: "6px solid #C8102E",
      borderRadius: 60,
    }),
    tekst: "#1B2F6B",
    senka: "drop-shadow(0 8px 10px rgba(27,47,107,0.35))",
    font: 62,
  },
  kolaz: {
    kutija: (idx) => ({
      background: "#FFFDF7",
      clipPath: neravno(`kz${idx}`, 5),
      transform: `rotate(${idx % 2 ? 1.2 : -1.2}deg)`,
    }),
    tekst: "#1A1A17",
    senka: "drop-shadow(3px 7px 5px rgba(59,42,20,0.3))",
    font: 62,
  },
  tus: {
    kutija: (idx) => ({
      background: "rgba(250,247,240,0.92)",
      clipPath: neravno(`tus${idx}`, 7),
      borderRadius: 8,
    }),
    tekst: "#26272B",
    senka: "drop-shadow(0 6px 12px rgba(20,30,40,0.25))",
    font: 62,
  },
};

export const Titlovi: React.FC<{ plan: Plan; izgled: IzgledTitla }> = ({ plan, izgled }) => {
  const komadi = komadiZa(plan);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = komadi.find((x) => f >= x.od && f < x.do);
  if (!k) return null;
  const idx = komadi.indexOf(k);
  const iz = IZGLED[izgled];
  const s = spring({ frame: f - k.od, fps, config: { damping: 13, stiffness: 240, mass: 0.6 } });
  const tekuca = k.reci.findIndex((w, i) => f >= w.f - UNAPRED_REC && (i === k.reci.length - 1 || f < k.reci[i + 1].f - UNAPRED_REC));
  const ulaz =
    izgled === "linorez"
      ? `scale(${1 + (1 - s) * 0.12})`
      : izgled === "kolaz"
        ? `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})`
      : izgled === "naiva"
        ? `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})`
        : `translateY(${(1 - s) * 14}px)`;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1350, display: "flex", justifyContent: "center", transform: ulaz, opacity: Math.min(1, s * 1.6), filter: iz.senka }}>
      <div
        style={{
          maxWidth: 960,
          padding: "26px 44px 30px",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: iz.font,
          lineHeight: 1.16,
          textAlign: "center",
          color: iz.tekst,
          ...iz.kutija(idx),
        }}
      >
        {k.reci.map((w, i) => (
          <span key={i} style={{ color: i === tekuca || ISTAKNUTE.test(w.w) ? ZELENA : iz.tekst, opacity: f >= w.f - UNAPRED_REC ? 1 : 0.45 }}>
            {w.w}
            {i < k.reci.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};
