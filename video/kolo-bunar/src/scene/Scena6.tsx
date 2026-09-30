// Sc. 6 — „Propada kad svako uzima, a niko ne odgovara, i kad niko ne može da spreči zloupotrebu.“
// Zapušten pašnjak pod teškim nebom: đeram je pao, oko bunara čičak, na sohi vrana. Sa ivica
// kadra posežu crne ruke i grabe; knjiga pravila leži u travi i vetar joj otkida listove.
import React from "react";
import { Easing } from "remotion";
import { Hrapavo, Kadar, Kamera, Linija, Povrs, dah, elipsa, kutija, mesaj, napredak, rnd, useF } from "../alat";
import { P } from "../paleta";
import { Bunar, Nebo, Ptica, Ravnica, Topola } from "../motivi";
import { kad, trajanjeF } from "../vreme";

const Cicak: React.FC<{ x: number; y: number; s: number; rast: number }> = ({ x, y, s, rast }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Linija d="M0,0 Q-6,-80 4,-170" debljina={6} napredak={rast} />
    <Linija d="M2,-60 Q-30,-90 -44,-120 M0,-100 Q30,-120 40,-150" debljina={5} napredak={rast} />
    {rast > 0.9 && (
      <>
        <path d={elipsa(4, -178, 14, 12)} fill={P.mastilo} />
        <Linija d="M-8,-188 L-14,-202 M4,-190 L4,-206 M16,-188 L22,-202" boja={P.rdja} debljina={5} />
        <path d="M-30,-40 L-6,-52 L-20,-30 Z M10,-80 L40,-90 L22,-70 Z" fill={P.mastilo} />
      </>
    )}
  </g>
);

/** Ruka koja poseže sa ivice kadra. */
const Ruka: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number }> = ({ x0, y0, x1, y1, t }) => {
  const x = mesaj(x0, x1, t);
  const y = mesaj(y0, y1, t);
  const ug = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return (
    <g>
      <path d={`M${x0},${y0} L${x},${y}`} stroke={P.mastilo} strokeWidth={46} strokeLinecap="round" />
      <path d={`M${x0},${y0 - 12} L${x},${y - 12}`} stroke={P.krem} strokeWidth={3} opacity={0.5} />
      <g transform={`translate(${x} ${y}) rotate(${ug})`}>
        <path d="M0,-26 Q40,-34 58,-18 L70,-22 L72,-10 L58,-6 L74,0 L72,12 L56,10 L66,20 L58,30 Q30,32 0,26 Z" fill={P.mastilo} />
      </g>
    </g>
  );
};

export const Scena6: React.FC = () => {
  const f = useF();
  const T = trajanjeF(6);
  const tUz = kad(6, "uzima,");
  const tNiko = kad(6, "niko");
  const tZlo = kad(6, "zloupotrebu.");
  const z = mesaj(1.08, 1.16, napredak(f, 0, T));
  const vetar = f * 1.4;
  const ruke = napredak(f, tUz - 10, 16, Easing.out(Easing.cubic)) - napredak(f, tNiko + 6, 18, Easing.in(Easing.cubic));
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1150} z={z}>
          <Nebo od={100} do={1020} gustina={1.5} op={1} pomakX={vetar * 2} />
          <rect x={-40} y={80} width={1160} height={950} fill={P.sivo} opacity={0.35} style={{ mixBlendMode: "multiply" }} />
          <g transform="translate(120 1030)">
            <Topola s={0.6} golo={1} />
          </g>
          <g transform="translate(940 1030)">
            <Topola s={0.5} golo={1} />
          </g>
          <Ravnica y={1030} boja={P.suvo} vlati={0.5} />
          <g transform="translate(470 1330) scale(1.2)">
            <Bunar ugao={-10} slomljen={1} suv={1} />
          </g>
          {/* vrana na sohi */}
          <g transform={`translate(${470 + 230 * 1.2} ${1330 - 440 * 1.2})`}>
            <path d="M-30,0 Q-10,-30 20,-24 L40,-30 L30,-18 Q30,6 0,8 L-40,14 Z" fill={P.mastilo} />
            <circle cx={24} cy={-20} r={3} fill={P.krem} />
          </g>
          {[
            [180, 1480, 1.3, 0],
            [330, 1560, 1.6, 8],
            [760, 1500, 1.4, 4],
            [900, 1620, 1.8, 12],
            [620, 1660, 1.2, 16],
          ].map(([x, y, s, d], i) => (
            <Cicak key={i} x={x} y={y} s={s} rast={napredak(f, d, 40)} />
          ))}
          {/* knjiga pravila u travi */}
          <g transform="translate(540 1720) rotate(-6)">
            <Povrs d={kutija(-220, -40, 440, 150, 10)} boja={P.rdjaTamna} srafura="srafG" srafuraOp={0.3} debljina={6} />
            <Povrs d="M-200,-30 L0,-10 L200,-30 L200,90 L0,110 L-200,90 Z" boja={P.krem} srafura="srafRedak" srafuraOp={0.2} debljina={5} pomak={[2, 2]} />
            {[0, 1, 2, 3].map((i) => (
              <Linija key={i} d={`M-170,${0 + i * 22} L-30,${10 + i * 22} M30,${10 + i * 22} L170,${0 + i * 22}`} debljina={3} opacity={0.6} />
            ))}
          </g>
          {/* listovi koje vetar nosi */}
          {[0, 1, 2, 3, 4].map((i) => {
            const t0 = tNiko - 4 + i * 7;
            if (f < t0) return null;
            const t = (f - t0) / 40;
            const x = 540 - t * (700 + i * 60);
            const y = 1700 - t * (500 + rnd(i, 3) * 300) + Math.sin(t * 8 + i) * 40;
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${t * 300 + i * 40})`} opacity={Math.max(0, 1 - t * 0.6)}>
                <Povrs d={kutija(-44, -30, 88, 60, 3)} boja={P.krem} srafura="srafRedak" srafuraOp={0.2} debljina={4} pomak={[2, 1]} />
              </g>
            );
          })}
          {/* pukotina kroz krunu bunara na „zloupotrebu“ */}
          <g transform="translate(470 1330) scale(1.2)">
            <Linija d="M-10,-130 L10,-90 L-6,-60 L14,-30 L0,0" debljina={6} napredak={napredak(f, tZlo - 2, 12)} />
          </g>
          {[0, 1].map((i) => (
            <Ptica key={i} x={((f * (3 + i) + i * 300) % 1000) + 40} y={500 + i * 60 + dah(f, 20, i * 10) * 12} s={1} mah={f / 3 + i} />
          ))}
        </Kamera>
      </Hrapavo>
      {ruke > 0.01 && (
        <Hrapavo>
          <Ruka x0={-80} y0={1180} x1={330} y1={1230} t={ruke} />
          <Ruka x0={1160} y0={1100} x1={640} y1={1180} t={ruke * 0.95} />
          <Ruka x0={-60} y0={760} x1={300} y1={1050} t={ruke * 0.85} />
          <Ruka x0={1140} y0={1500} x1={740} y1={1350} t={ruke * 0.9} />
        </Hrapavo>
      )}
    </Kadar>
  );
};
