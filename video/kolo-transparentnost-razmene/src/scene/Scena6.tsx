// Scena 6 — „Tada niko ne može da vara neprimećeno, ni oni koji upravljaju ni bilo ko od nas, jer se za svaki
// POEN zna odakle je došao.“
// Prvi deo: krupna tabla, gore sveska uprave, ispod otvorene sveske stanara. Na „vara“ tamna ruka iz scene 1
// proviri sa ivice i na „neprimećeno“ se povuče. Lupa prelazi: na „upravljaju“ preko sveske uprave, na „nas“
// preko svezaka stanara; uz svaku zelena kvačica.
// Drugi deo (od „jer“): telefon sa računom direktora iz videa 19; red po red se ističe ko je upisao i zašto,
// na „došao“ zelene kvačice.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, mesaj, napredak, useF } from "../alat";
import { EkranSistem, Lupa, VelikiTelefon } from "../zgrada";
import { TamnaRuka } from "../razmena";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina, TEL } from "./kolo";
import { RED_STANARA, SVESKA_UPRAVE, SVESKE_STANARA, TablaSaSveskama } from "./zajednicko20";
import { rez } from "./zajednicko";

const Kvacica: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) =>
  s > 0 ? (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={40} fill={P.zelena500} stroke="#fff" strokeWidth={6} />
      <path d="M-17,0 L-5,12 L19,-14" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ) : null;

export const Scena6: React.FC = () => {
  const f = useF();
  const kV = kad(6, "vara");
  const kNe = kad(6, "neprimećeno,");
  const kU = kad(6, "upravljaju");
  const kNas = kad(6, "nas,");
  const kJ = kad(6, "jer");
  const kO = kad(6, "odakle");
  const kD = kad(6, "došao.");
  const drugi = rez(f, kJ - 4);
  // ruka
  const ruka = interpolate(f, [kV - 14, kV + 4, kNe + 6, kNe + 18], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  // lupa: uprava, pa stanari
  const lx = interpolate(f, [kU - 14, kU + 6, kNas - 14, kNas, kNas + 14], [SVESKA_UPRAVE.x + 220, SVESKA_UPRAVE.x, SVESKE_STANARA[0].x, SVESKE_STANARA[1].x, SVESKE_STANARA[2].x], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ly = interpolate(f, [kU - 14, kU + 6, kNas - 14], [SVESKA_UPRAVE.y + 260, SVESKA_UPRAVE.y, RED_STANARA], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const lupa = interpolate(f, [kU - 18, kU - 8, kNas + 16, kNas + 26], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kvU = napredak(f, kU + 6, 10, Easing.out(Easing.back(2)));
  const kvS = (i: number) => napredak(f, kNas - 12 + i * 12, 10, Easing.out(Easing.back(2)));
  // telefon
  const t = interpolate(f, [kJ + 4, kD], [0, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const red = Math.floor(t);
  return (
    <Kadar>
      {drugi < 1 && (
        <g opacity={1 - drugi}>
          <TablaSaSveskama isticanjeStanara={SVESKE_STANARA.map((_, i) => (f > kNas - 14 + i * 12 && f < kNas + 4 + i * 12 ? 1 : 0))} />
          <Kvacica x={SVESKA_UPRAVE.x + 280} y={SVESKA_UPRAVE.y - 180} s={kvU} />
          {SVESKE_STANARA.map((s, i) => (
            <Kvacica key={i} x={s.x + 120} y={RED_STANARA - 70} s={kvS(i) * 0.8} />
          ))}
          {lupa > 0 && (
            <g transform={`translate(${lx} ${ly})`} opacity={lupa}>
              <Lupa s={1.1} />
            </g>
          )}
          <g transform={`translate(${mesaj(1300, 930, ruka)} 760) rotate(-6)`}>
            <TamnaRuka />
          </g>
        </g>
      )}
      {drugi > 0 && (
        <g opacity={drugi}>
          <KoloPozadina />
          <g transform={`translate(${TEL.x} ${TEL.y}) scale(${TEL.s})`}>
            <VelikiTelefon>
              <EkranSistem redova={6} isticanje={f < kD + 6 ? [red, Math.min(1, (t % 1) * 1.8)] : undefined} zeleno={napredak(f, kO, 30, Easing.linear)} />
            </VelikiTelefon>
          </g>
        </g>
      )}
    </Kadar>
  );
};
