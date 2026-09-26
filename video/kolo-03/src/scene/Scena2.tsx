// Scena 2 — „Ko je doneo drva. Ko je popravio ogradu. Niko to nije zapisivao,
// ali svi su pamtili." Tri sličice iz sećanja uskaču jedna za drugom: Jova nosi drva,
// Pera popravlja ogradu, Stana nosi kolače. Na „pamtili" iz sličica izlaze srca.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Defs, Pop, Crta, napredak } from "../papir";
import { Cekic, Drva, Kapija, Kolaci, Komsija, Natpis, Ograda, Slicica, Srce } from "../selo";
import { kad } from "../vreme";

/** Položaji sličica — scena 3 kreće iz istih. */
export const SLICICE = [
  { x: 330, y: 520, rot: -5, natpis: "drva" },
  { x: 750, y: 800, rot: 4, natpis: "ograda" },
  { x: 350, y: 1080, rot: -3, natpis: "kolači" },
] as const;

/** Sadržaj sličice i (0 drva, 1 ograda, 2 kolači); `t` = frejm od pojave. */
export const SadrzajSlicice: React.FC<{ i: number; t: number; seed: string }> = ({ i, t, seed }) => {
  if (i === 0) {
    const hod = Math.min(1, t / 40);
    const x = -80 + hod * 60;
    const bob = Math.abs(Math.sin(t / 4)) * -6 * (1 - hod);
    return (
      <g>
        <g transform="translate(150 150) scale(0.62)">
          <Kapija seed={`${seed}-kap`} />
        </g>
        <g transform={`translate(${x} ${40 + bob}) scale(1.05)`}>
          <Komsija id="jova" seed={`${seed}-jova`} />
          <g transform="translate(0 58) scale(0.95)">
            <Drva seed={`${seed}-drva`} />
          </g>
        </g>
      </g>
    );
  }
  if (i === 1) {
    const ciklus = (t % 14) / 14;
    const udarac = ciklus < 0.35 ? ciklus / 0.35 : 1 - (ciklus - 0.35) / 0.65;
    const pogodak = ciklus > 0.3 && ciklus < 0.5;
    return (
      <g>
        <g transform="translate(-60 30) scale(1.05)">
          <Komsija id="pera" seed={`${seed}-pera`} />
        </g>
        <g transform="translate(0 170)">
          <Ograda seed={`${seed}-og`} od={-190} do={210} visina={120} razmak={50} />
        </g>
        <g transform="translate(80 70)">
          <Cekic seed={`${seed}-cek`} udarac={udarac} />
        </g>
        {pogodak &&
          [0, 1, 2].map((k) => (
            <Crta key={k} pts={[[150 + k * 14, 10 - k * 18], [178 + k * 20, -6 - k * 26]]} seed={`${seed}-tuk${k}`} boja={P.zlatna600} debljina={6} />
          ))}
      </g>
    );
  }
  return (
    <g>
      <g transform="translate(-70 30) scale(1.05)">
        <Komsija id="stana" seed={`${seed}-stana`} />
      </g>
      <g transform={`translate(70 ${108 + Math.sin(t / 8) * 3}) scale(0.82)`}>
        <Kolaci seed={`${seed}-kol`} />
      </g>
    </g>
  );
};

export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const doneo = kad(2, "doneo");
  const popravio = kad(2, "popravio");
  const niko = kad(2, "Niko");
  const zapisivao = kad(2, "zapisivao,");
  const pamtili = kad(2, "pamtili.");
  const pojava = [Math.min(doneo - 3, 3), popravio - 3, zapisivao - 6];

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {SLICICE.map((s, i) => (
        <Pop key={i} at={pojava[i]} x={s.x} y={s.y} rot={s.rot} njihanje={1}>
          <Slicica seed={`s2-sl${i}`} natpis={s.natpis}>
            <SadrzajSlicice i={i} t={f - pojava[i]} seed={`s2-c${i}`} />
          </Slicica>
        </Pop>
      ))}
      <Pop at={niko - 2} x={540} y={170} rot={-2}>
        <Natpis seed="s2-n1" tekst="Niko nije zapisivao." duzina={20} />
      </Pop>
      <Pop at={pamtili - 3} x={610} y={290} rot={2}>
        <Natpis seed="s2-n2" tekst="Svi su pamtili." duzina={15} pozadina={P.zlatna100} />
      </Pop>
      {/* srca izlaze iz sličica */}
      {SLICICE.map((s, i) => {
        const t = napredak(f, pamtili + i * 4, 40);
        if (t <= 0) return null;
        return (
          <g key={`h${i}`} opacity={t < 0.75 ? 1 : (1 - t) / 0.25} transform={`translate(${s.x + 150 + Math.sin(t * 6 + i) * 16} ${s.y - 120 - t * 170}) scale(${0.5 + 0.4 * Math.min(1, t * 4)})`}>
            <Srce seed={`s2-srce${i}`} r={38} />
          </g>
        );
      })}
    </svg>
  );
};
