// Redosled scena i prelazi (zajednička mehanika sva tri videa; izgled prelaza daje svaki video).
//  „pretapanje“: nova scena se pojavi preko stare.
//  „brisanje“: stara scena se briše potezom (valjak, četka…) — clip daje svaki video,
//              a crtež poteza (npr. valjak) ide kao `Potez` preko svega.
import React, { createContext } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import type { Plan } from "./vreme";

export type Prelaz = { tip: "pretapanje" | "brisanje" | "rez"; pola: number };
/** Pomak lokalnog vremena: scena se renderuje `pre` frejmova pre svog početka. */
export const PomakScene = createContext(0);

type Props = {
  plan: Plan;
  scene: React.FC[];
  prelazi: Prelaz[]; // prelaz posle scene i
  Pozadina: React.FC; // papir ispod svake scene
  clipBrisanja: (p: number) => string; // CSS clip-path stare scene za napredak p (0–1)
  PomakCtx: React.Context<number>;
};

export const napredakPrelaza = (f: number, rez: number, pola: number) => (f - (rez - pola)) / (2 * pola);

export const Sekvenca: React.FC<Props> = ({ plan, scene, prelazi, Pozadina, clipBrisanja, PomakCtx }) => {
  const f = useCurrentFrame();
  // kod brisanja stari sloj je iznad novog, kod pretapanja novi iznad starog
  const Z: number[] = [1000];
  for (let i = 0; i < scene.length - 1; i++) Z.push(Z[i] + (prelazi[i].tip === "brisanje" ? -1 : 1));
  return (
    <>
      {plan.scene.map((s, i) => {
        const ulaz = i > 0 ? prelazi[i - 1] : null;
        const izlaz = i < prelazi.length ? prelazi[i] : null;
        const pre = ulaz && ulaz.tip !== "rez" ? ulaz.pola : 0;
        const posle = izlaz && izlaz.tip !== "rez" ? izlaz.pola : 0;
        if (f < s.odF - pre || f >= s.doF + posle) return null;
        const S = scene[i];
        let opacity = 1;
        if (ulaz && ulaz.tip === "pretapanje") opacity = interpolate(f, [s.odF - pre, s.odF + pre], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        let clip: string | undefined;
        if (izlaz && izlaz.tip === "brisanje") {
          const p = napredakPrelaza(f, plan.scene[i + 1].odF, izlaz.pola);
          if (p > 0) clip = clipBrisanja(Math.min(1, p));
        }
        return (
          <AbsoluteFill key={s.id} style={{ zIndex: Z[i], opacity, clipPath: clip }}>
            <Sequence from={s.odF - pre} durationInFrames={s.doF - s.odF + pre + posle} layout="none">
              <PomakCtx.Provider value={pre}>
                <AbsoluteFill>
                  <Pozadina />
                  <S />
                </AbsoluteFill>
              </PomakCtx.Provider>
            </Sequence>
          </AbsoluteFill>
        );
      })}
    </>
  );
};

/** Koji prelaz „brisanje“ je u toku i koliko je odmakao (za crtež poteza). */
export const tekuceBrisanje = (f: number, plan: Plan, prelazi: Prelaz[]) => {
  const i = prelazi.findIndex((pr, k) => pr.tip === "brisanje" && Math.abs(f - plan.scene[k + 1].odF) < pr.pola);
  if (i < 0) return null;
  return { i, p: napredakPrelaza(f, plan.scene[i + 1].odF, prelazi[i].pola) };
};
