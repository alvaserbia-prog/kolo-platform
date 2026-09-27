// Predmeti tuša: bunar sa đeramom, vedro (i izbliza), pleter i kapija, kartice odgovornosti.
import React from "react";
import { staticFile } from "remotion";
import { Lavir, Potez, T, elipsa, kutija } from "./tus";
import { CETKA, SANS } from "../fontovi";

/** Voda u krugu: bistra (0) ili mutna (1), sa mrljama mulja koje se šire. */
export const Voda: React.FC<{ cx: number; cy: number; rx: number; ry: number; mutno: number; f: number; id: string }> = ({ cx, cy, rx, ry, mutno, f, id }) => (
  <g>
    <defs>
      <clipPath id={`voda${id}`}>
        <path d={elipsa(cx, cy, rx, ry)} />
      </clipPath>
    </defs>
    <path d={elipsa(cx, cy, rx, ry)} fill={T.vodaSvetla} />
    <g clipPath={`url(#voda${id})`}>
      <path d={elipsa(cx, cy + ry * 0.1, rx * 0.95, ry * 0.8)} fill={T.voda} opacity={0.55} filter="url(#akv)" />
      <path d={`M${cx - rx * 0.6},${cy - ry * 0.3} q${rx * 0.3},${-ry * 0.2} ${rx * 0.6},0`} stroke="#fff" strokeWidth={8} fill="none" opacity={0.7 * (1 - mutno)} />
      {[0, 1, 2].map((i) => {
        const r = mutno * (0.6 + i * 0.35) * rx * 1.3;
        return r > 1 ? <path key={i} d={elipsa(cx + (i - 1) * rx * 0.3, cy + (i % 2) * ry * 0.2, r, r * ry / rx)} fill={i ? T.mulj : T.muljTamni} opacity={0.55} filter="url(#akvRub)" /> : null;
      })}
      {mutno > 0 && <path d={elipsa(cx, cy, rx, ry)} fill={T.mulj} opacity={mutno * 0.35} />}
      {/* talasići */}
      {[0, 1].map((i) => {
        const t = ((f / 40 + i * 0.5) % 1);
        return <path key={`t${i}`} d={elipsa(cx, cy, rx * t, ry * t)} fill="none" stroke="#fff" strokeWidth={2.5} opacity={(1 - t) * 0.5} />;
      })}
    </g>
    <Potez d={elipsa(cx, cy, rx, ry)} debljina={4} />
  </g>
);

/** Bunar sa đeramom (vojvođanski): kameni venac, račva, dugačka motka sa tegom, vedro na motki. */
export const Bunar: React.FC<{ x: number; y: number; s?: number; mutno: number; f: number; nagib?: number; crtanje?: number; natpis?: boolean }> = ({ x, y, s = 1, mutno, f, nagib = 0, crtanje = 1, natpis }) => {
  const piv: [number, number] = [400, -470];
  const a = ((-12 + nagib) * Math.PI) / 180;
  const L1 = 470;
  const L2 = 300;
  const kraj: [number, number] = [piv[0] - Math.cos(a) * L1, piv[1] + Math.sin(a) * L1];
  const teg: [number, number] = [piv[0] + Math.cos(a) * L2, piv[1] - Math.sin(a) * L2];
  const vedroY = Math.min(-40, kraj[1] + 300);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* račva */}
      <Lavir d={`M${piv[0] - 16},0 L${piv[0] - 10},${piv[1] + 30} L${piv[0] + 10},${piv[1] + 30} L${piv[0] + 16},0Z`} boja={T.oker} jacina={0.6} />
      <Potez d={`M${piv[0] - 14},0 L${piv[0] - 8},${piv[1] + 20} L${piv[0] - 28},${piv[1] - 20} M${piv[0] + 14},0 L${piv[0] + 8},${piv[1] + 20} L${piv[0] + 28},${piv[1] - 20}`} debljina={6} napredak={crtanje} />
      {/* motka */}
      <Potez d={`M${kraj[0]},${kraj[1]} L${teg[0]},${teg[1]}`} debljina={10} napredak={crtanje} />
      <Lavir d={elipsa(teg[0] + 10, teg[1] + 6, 40, 30)} boja={T.kamen} jacina={0.7} />
      <Potez d={elipsa(teg[0] + 10, teg[1] + 6, 40, 30)} debljina={4} napredak={crtanje} />
      {/* konopac i vedro */}
      <Potez d={`M${kraj[0]},${kraj[1]} L${kraj[0]},${vedroY - 60}`} debljina={3} napredak={crtanje} />
      <g transform={`translate(${kraj[0]} ${vedroY})`}>
        <Lavir d="M-40,-60 L40,-60 L32,0 L-32,0Z" boja={T.oker} jacina={0.65} />
        <Potez d="M-40,-60 L40,-60 L32,0 L-32,0Z M-38,-44 L38,-44 M-34,-14 L34,-14" debljina={4} napredak={crtanje} />
      </g>
      {/* venac bunara */}
      <Lavir d={`M-150,0 L-150,-150 C-100,-190 100,-190 150,-150 L150,0Z`} boja={T.kamen} jacina={0.55} />
      {[-110, -40, 30, 100].map((xx, i) => (
        <Potez key={i} d={`M${xx},-130 q20,-10 40,0 M${xx - 20},-70 q24,-8 44,2`} debljina={3} napredak={crtanje} opacity={0.6} />
      ))}
      <Potez d="M-150,0 L-150,-150 M150,0 L150,-150" debljina={6} napredak={crtanje} />
      <Voda cx={0} cy={-156} rx={150} ry={36} mutno={mutno} f={f} id={`b${x}`} />
      {natpis && (
        <g transform="translate(0 -60)">
          <rect x={-90} y={-34} width={180} height={60} rx={8} fill="#fff" opacity={0.85} />
          <text y={12} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={40} fill={T.zelena} letterSpacing={3}>
            KOLO
          </text>
        </g>
      )}
    </g>
  );
};

/** Vedro izbliza (prva scena). */
export const VedroIzbliza: React.FC<{ mutno: number; f: number; crtanje: number }> = ({ mutno, f, crtanje }) => (
  <g>
    <Lavir d="M-300,-260 L300,-260 L240,300 L-240,300Z" boja={T.oker} jacina={0.6} />
    {[-200, -60, 80, 210].map((x, i) => (
      <Potez key={i} d={`M${x},-250 L${x * 0.82},290`} debljina={3} napredak={crtanje} opacity={0.5} />
    ))}
    <Lavir d="M-296,-190 L296,-190 L290,-140 L-290,-140Z" boja={T.tusMeki} jacina={0.6} rub={false} />
    <Lavir d="M-262,150 L262,150 L256,200 L-256,200Z" boja={T.tusMeki} jacina={0.6} rub={false} />
    <Potez d="M-300,-260 L-240,300 L240,300 L300,-260" debljina={7} napredak={crtanje} />
    <Voda cx={0} cy={-260} rx={300} ry={80} mutno={mutno} f={f} id="izbliza" />
    <Potez d="M-300,-260 C-300,-560 300,-560 300,-260" debljina={8} napredak={crtanje} />
  </g>
);

/** Pleter (ograda od pruća) sa vratnicama koje se otvaraju. */
export const Pleter: React.FC<{ x0: number; x1: number; y: number; vrata?: number; otvor?: number }> = ({ x0, x1, y, vrata, otvor = 0 }) => (
  <g>
    {Array.from({ length: Math.floor((x1 - x0) / 60) + 1 }, (_, i) => x0 + i * 60).map((x) =>
      vrata !== undefined && x > vrata - 70 && x < vrata + 70 ? null : <Potez key={x} d={`M${x},${y} L${x + 2},${y - 170}`} debljina={6} />,
    )}
    {[0, 1, 2, 3].map((k) => (
      <Lavir key={k} d={`M${x0},${y - 40 - k * 34} C${(x0 + x1) / 2},${y - 50 - k * 34} ${(x0 + x1) / 2},${y - 30 - k * 34} ${x1},${y - 40 - k * 34} L${x1},${y - 26 - k * 34} L${x0},${y - 26 - k * 34}Z`} boja={T.oker} jacina={0.55} rub={false} />
    ))}
    {vrata !== undefined && (
      <g transform={`translate(${vrata - 60} ${y}) scale(${1 - otvor * 0.85} 1)`}>
        <Lavir d="M0,0 L0,-150 L120,-150 L120,0Z" boja={T.oker} jacina={0.5} />
        <Potez d="M0,0 L0,-150 L120,-150 L120,0 M0,-150 L120,0" debljina={5} />
      </g>
    )}
  </g>
);

export const KarticaOdgovornosti: React.FC<{ zelena?: boolean; naslov: string[]; tekst: string[]; p: number }> = ({ zelena, naslov, tekst, p }) => (
  <g opacity={Math.min(1, p * 1.5)} transform={`translate(0 ${(1 - p) * 40})`}>
    <path d={kutija(-230, -330, 460, 660, 18)} fill="#fff" opacity={0.7} />
    <Lavir d={kutija(-230, -330, 460, 660, 18)} boja={zelena ? T.zelena : T.siva} jacina={zelena ? 0.3 : 0.28} />
    <Potez d={kutija(-230, -330, 460, 660, 18)} debljina={5} napredak={p} boja={zelena ? T.zelena : T.tusMeki} />
    <circle cx={0} cy={-190} r={70} fill={zelena ? T.zelena : T.siva} opacity={0.85} />
    {zelena ? (
      <path d="M-30,-190 L-8,-168 L32,-212" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M-26,-216 L26,-164 M26,-216 L-26,-164" stroke="#fff" strokeWidth={13} strokeLinecap="round" />
    )}
    {naslov.map((n, i) => (
      <text key={`n${i}`} y={-70 + i * 60} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={54} fill={zelena ? T.zelena : T.tusMeki}>
        {n}
      </text>
    ))}
    {tekst.map((t, i) => (
      <text key={i} y={80 + i * 76} textAnchor="middle" fontFamily={CETKA} fontSize={74} fill={T.tus}>
        {t}
      </text>
    ))}
  </g>
);

export const ZnakTus: React.FC<{ vel?: number }> = ({ vel = 320 }) => (
  <g>
    <path d={elipsa(0, 0, vel * 0.85)} fill={T.zelenaSvetla} opacity={0.45} filter="url(#akv)" />
    <defs>
      <clipPath id="znakT">
        <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} rx={vel * 0.2} />
      </clipPath>
    </defs>
    <g clipPath="url(#znakT)">
      <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} fill="#0F3D20" />
      <image href={staticFile("kolo-hero-logo.png")} x={-vel / 2} y={-vel / 2 - vel * 0.025} width={vel} height={vel * 1.05} />
    </g>
    <Potez d={kutija(-vel / 2 - 6, -vel / 2 - 6, vel + 12, vel + 12, vel * 0.22)} debljina={6} />
  </g>
);

export const MaliTelefonTus: React.FC<{ potvrdjeno: number }> = ({ potvrdjeno }) => (
  <g>
    <Lavir d={kutija(-80, -150, 160, 300, 22)} boja={T.tusMeki} jacina={0.8} />
    <rect x={-66} y={-130} width={132} height={260} rx={10} fill="#fff" />
    <rect x={-66} y={-130} width={132} height={34} rx={10} fill={T.zelena} />
    <text x={-54} y={-106} fontFamily={SANS} fontWeight={900} fontSize={16} fill="#fff">
      KOLO
    </text>
    <circle cx={0} cy={-40} r={28} fill={T.sivaSvetla} />
    <text y={20} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={14} fill={T.tusMeki}>
      ???
    </text>
    <rect x={-56} y={60} width={112} height={40} rx={20} fill={potvrdjeno > 0.5 ? "#135C32" : T.zelena} />
    <text y={86} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={15} fill="#fff">
      {potvrdjeno > 0.5 ? "✓ Potvrđeno" : "Potvrdi"}
    </text>
  </g>
);
