// Scena 7 — „Sledeća ruka koja se uhvati može da bude tvoja. Svaki tvoj doprinos se nagrađuje.“
// Veliko kolo na saboru u sumrak, sa praznim mestom okrenutim ka gledaocu. Iz praznine se ka
// kameri pruži otvorena šaka. Na „doprinos“ igrači zasijaju jedan za drugim i uzleću iskre.
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, napredak, useF } from "../alat";
import { Ulica, Kuce } from "../pozadine";
import { IGRACI, Kolo, Saka, VESNA, Zastavice } from "../kolo";
import { kad } from "../vreme";

export const Scena7: React.FC = () => {
  const f = useF();
  const kSledeca = kad(7, "Sledeća");
  const kTvoja = kad(7, "tvoja.");
  const kDoprinos = kad(7, "doprinos");
  const ruka = napredak(f, kSledeca - 4, 36, Easing.out(Easing.cubic));
  const mah = Math.sin(f / 9) * 3 * ruka;
  const z = interpolate(f, [-20, kTvoja + 20], [1.12, 1.0], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const igraci = [VESNA, ...IGRACI.slice(0, 9)];
  const RUPA = 1.3;
  // prazno mesto je napred (90°): ugao tako da prvi (nevidljivi) igrač stoji tačno ispred kamere
  const ugao = 90 - (180 * RUPA) / (RUPA + igraci.length) + Math.sin(f / 40) * 4;
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={900} z={z}>
          <Ulica nebo="#D99A6C" />
          <rect x={-600} y={-200} width={2400} height={1100} fill="#6B4A6E" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
          <circle cx={540} cy={640} r={180} fill="#F6C27A" opacity={0.7} />
          <circle cx={540} cy={640} r={420} fill="url(#toplaSvetlost)" />
          <Kuce y={880} s={0.5} n={8} x0={-220} razmak={220} svetlo={1} />
          <Zastavice x0={-60} x1={1140} y={470} ugib={90} n={15} />
          <ellipse cx={540} cy={1060} rx={560} ry={200} fill={P.drvoSvetlo} opacity={0.35} />
        </Kamera>
      </Hrapavo>
      <Kamera x={540} y={900} z={z}>
        <Kolo
          cx={540}
          cy={960}
          rx={390}
          ry={140}
          s={0.42}
          f={f}
          ugao={ugao}
          skok={0.6}
          igraci={[
            { p: VESNA, nevidljiv: true, tezina: RUPA },
            ...igraci.map((p, i) => ({ p, sjaj: napredak(f, kDoprinos - 6 + Math.abs(i - 4.5) * 3, 10) })),
          ]}
        />
        {/* iskre */}
        {f > kDoprinos - 4 &&
          Array.from({ length: 26 }, (_, i) => {
            const t0 = kDoprinos - 4 + random(`i${i}`) * 30;
            const zivot = (f - t0) / 50;
            if (zivot < 0 || zivot > 1) return null;
            const x = 540 + (random(`x${i}`) - 0.5) * 820;
            const y = 900 - zivot * (260 + random(`y${i}`) * 200);
            return <circle key={i} cx={x + Math.sin(f / 8 + i) * 14} cy={y} r={5 + random(`r${i}`) * 6} fill={P.zlatna} opacity={(1 - zivot) * 0.9} />;
          })}
      </Kamera>
      {/* šaka gledaoca: dolazi odozdo i pruža se ka praznom mestu u kolu */}
      {ruka > 0 && (
        <g transform={`translate(${540 + mah} ${interpolate(ruka, [0, 1], [1900, 1250])}) scale(${interpolate(ruka, [0, 1], [1.25, 0.95])}) rotate(${interpolate(ruka, [0, 1], [10, -4]) + mah})`} opacity={Math.min(1, ruka * 3)}>
          <ellipse cx={0} cy={60} rx={260} ry={300} fill="url(#toplaSvetlost)" opacity={0.7} />
          <Hrapavo lokalno>
            <Saka rukav={P.zelenaSvetla} />
          </Hrapavo>
        </g>
      )}
    </Kadar>
  );
};
