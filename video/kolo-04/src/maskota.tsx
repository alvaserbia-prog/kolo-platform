// Maskota „Nikola" — papirni isečak u istom stilu kao ostali likovi,
// crtan po fotografiji: kratko ošišana kosa, tamna brada sa sedom bradicom,
// svetlosiva majica sa V izrezom. Maše i pomera usta dok govori.
// Crta se oko tačke (0,0) = sredina donje ivice poprsja; visina ~500.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, Pt, krugTacke, pravougaonik, useBoil } from "./papir";
import { Etiketa } from "./likovi";

const KOZA = "#EFC3A0";
const KOZA_SENKA = "#DDA684";
const BRADA = "#3B2F28";
const SEDA = "#A8A39A";
const MAJICA = "#D3CFC7";

export const Maskota: React.FC<{
  seed: string;
  usta: number; // 0 zatvorena – 1 otvorena
  mahanje: number; // 0 ruka dole – 1 maše
}> = ({ seed, usta, mahanje }) => {
  const f = useCurrentFrame();
  const b = useBoil();
  const trep = (f + 11) % 84 < 3;
  // ruka: podiže se pa maše oko ramena
  const ugaoRuke = -mahanje * (150 + Math.sin(f / 3.2) * 16);
  const nagib = Math.sin(f / 22) * 2; // glava se blago njiše
  return (
    <g>
      {/* ruka koja maše (iza tela); ne sme da viri ispod poprsja kad se spusti */}
      <clipPath id={`${seed}-ruka-clip`}>
        <rect x={-600} y={-900} width={1200} height={900} />
      </clipPath>
      <g clipPath={`url(#${seed}-ruka-clip)`}>
      <g transform={`translate(165 -175) rotate(${ugaoRuke})`}>
        <Isecak pts={[[-30, -10], [32, -12], [30, 120], [-26, 122]]} boja={MAJICA} seed={`${seed}-rukav`} />
        <Isecak pts={pravougaonik(-20, 115, 40, 90)} boja={KOZA} seed={`${seed}-podl`} senka="mala" />
        <Isecak pts={krugTacke(0, 222, 34, 14)} boja={KOZA} seed={`${seed}-saka`} senka="mala" />
        {[-24, -8, 8, 24].map((x, i) => (
          <Isecak key={i} pts={pravougaonik(x - 7, 232, 14, 38 - Math.abs(x) * 0.4)} boja={KOZA} seed={`${seed}-prst${i}`} senka="bez" amp={0.8} korak={10} />
        ))}
      </g>
      </g>
      {/* telo, majica sa V izrezom */}
      <Isecak
        pts={[[-200, 0], [-190, -140], [-135, -200], [-55, -222], [55, -222], [135, -200], [190, -140], [200, 0]]}
        boja={MAJICA}
        seed={`${seed}-telo`}
      />
      <Isecak pts={pravougaonik(-44, -275, 88, 70)} boja={KOZA_SENKA} seed={`${seed}-vrat`} senka="bez" />
      <Isecak pts={[[-50, -224], [50, -224], [0, -150]]} boja={KOZA_SENKA} seed={`${seed}-v`} senka="bez" amp={1} korak={14} />
      <Crta pts={[[-54, -222], [0, -146], [54, -222]]} seed={`${seed}-vivica`} boja="#B9B4AA" debljina={5} korak={16} />
      {/* ime na majici */}
      <g transform="translate(-95 -85) rotate(-6)">
        <Etiketa seed={`${seed}-ime`} tekst="Nikola" velicina={54} />
      </g>

      {/* glava */}
      <g transform={`rotate(${nagib} 0 -280)`}>
        <Isecak pts={krugTacke(-106, -372, 24, 12)} boja={KOZA_SENKA} seed={`${seed}-uvo1`} senka="mala" />
        <Isecak pts={krugTacke(106, -372, 24, 12)} boja={KOZA_SENKA} seed={`${seed}-uvo2`} senka="mala" />
        <Isecak pts={krugTacke(0, -365, 106, 26, 128)} boja={KOZA} seed={`${seed}-lice`} amp={1.8} />
        {/* kratka kosa, zalisci malo povučeni */}
        <Isecak
          pts={[[-104, -392], [-98, -448], [-62, -482], [0, -494], [62, -482], [98, -448], [104, -392], [88, -420], [52, -446], [0, -452], [-52, -446], [-88, -420]]}
          boja="#5A4A3E"
          seed={`${seed}-kosa`}
          senka="bez"
          amp={1.4}
          opacity={0.7}
        />
        {/* brada */}
        <Isecak
          pts={[[-106, -372], [-100, -300], [-72, -246], [-32, -226], [0, -222], [32, -226], [72, -246], [100, -300], [106, -372], [84, -338], [60, -312], [26, -302], [0, -300], [-26, -302], [-60, -312], [-84, -338]]}
          boja={BRADA}
          seed={`${seed}-brada`}
          senka="mala"
          amp={1.8}
        />
        {/* seda bradica */}
        <Isecak pts={[[-42, -244], [0, -230], [42, -244], [26, -270], [0, -274], [-26, -270]]} boja={SEDA} seed={`${seed}-seda`} senka="bez" amp={1.4} korak={12} />
        {/* usta u bradi */}
        <ellipse cx={0} cy={-292} rx={24} ry={4 + usta * 12} fill="#6B2A22" />
        {usta > 0.3 && <rect x={-14} y={-292 - (4 + usta * 12)} width={28} height={6} fill="#fff" opacity={0.85} rx={2} />}
        {/* brkovi */}
        <Isecak pts={[[-54, -316], [0, -334], [54, -316], [36, -304], [0, -310], [-36, -304]]} boja={BRADA} seed={`${seed}-brk`} senka="bez" amp={1} korak={12} />
        {/* nos */}
        <Crta pts={[[4, -380], [10, -346], [-6, -340]]} seed={`${seed}-nos`} boja={KOZA_SENKA} debljina={6} korak={10} amp={0.6} />
        {/* oči i obrve */}
        {[-40, 40].map((x, i) => (
          <g key={i}>
            <Crta pts={[[x - 26, -408 + (i ? 2 : 0)], [x, -416], [x + 26, -410 - (i ? 0 : 2)]]} seed={`${seed}-obrva${i}-${b % 2}`} boja={BRADA} debljina={9} korak={12} amp={0.8} />
            {trep ? (
              <Crta pts={[[x - 16, -378], [x + 16, -378]]} seed={`${seed}-trep${i}`} boja={P.tekst} debljina={5} amp={0.4} />
            ) : (
              <g>
                <ellipse cx={x} cy={-378} rx={17} ry={12} fill="#fff" />
                <circle cx={x + 2} cy={-377} r={8.5} fill="#2A1F18" />
                <circle cx={x + 5} cy={-380} r={2.6} fill="#fff" />
              </g>
            )}
          </g>
        ))}
        {/* rumeni obrazi */}
        <circle cx={-66} cy={-336} r={14} fill={P.korala} opacity={0.25} />
        <circle cx={66} cy={-336} r={14} fill={P.korala} opacity={0.25} />
      </g>
    </g>
  );
};

/** Koliko su usta otvorena u frejmu f: pomeraju se samo dok traje izgovorena reč. */
export const otvorenostUsta = (f: number, reci: { s: number; e: number }[], odF: number, fps: number) => {
  const t = (f - odF) / fps;
  const w = reci.find((r) => t >= r.s && t < r.e);
  if (!w) return 0;
  return 0.35 + 0.65 * Math.abs(Math.sin(((t - w.s) / 0.16) * Math.PI));
};

export type { Pt };
