// Scena 8 — „I tako, ako se na kraju meseca pitaš zašto ne možeš da uštediš, dođi u KOLO.“
// Soba se smrkava: kalendar na zidu na poslednjem danu u mesecu, majstor zamišljen, ćup skoro
// prazan. Na „dođi“ kroz prozor svane, a na „KOLO“ usred kadra uskoči znak KOLO sa zracima.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { NASLOV, SANS } from "../fontovi";
import { Hrapavo, Kadar, Oblik, kutija, napredak, useF, usePop } from "../alat";
import { Lik, MUZ } from "../likovi";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { Soba } from "./zajednicko";

export const Scena8: React.FC = () => {
  const f = useF();
  const kDodji = kad(8, "dođi");
  const kKolo = kad(8, "KOLO.");
  const mrak = interpolate(f, [0, kad(8, "uštediš,")], [0.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const svane = napredak(f, kDodji - 6, 30, Easing.out(Easing.cubic));
  const znak = usePop(kKolo - 4, 120, 10);
  return (
    <Kadar>
      <Hrapavo>
        <Soba mrak={mrak * (1 - svane)} />
        {/* prozor */}
        <g transform="translate(760 520)">
          <Oblik d={kutija(-170, -200, 340, 380, 10)} boja={interpolate(svane, [0, 1], [0, 1]) > 0.5 ? "#FFE3A0" : "#2E4257"} />
          <circle cx={60} cy={-90} r={40} fill={P.krem} opacity={1 - svane} />
          <circle cx={0} cy={180 - svane * 260} r={110} fill={P.zlatna} opacity={svane} />
          <path d="M0,-200 L0,180 M-170,-10 L170,-10" stroke={P.drvoTamno} strokeWidth={14} />
          <rect x={-170} y={-200} width={340} height={380} rx={10} fill="none" stroke={P.drvoTamno} strokeWidth={16} />
        </g>
        {/* kalendar */}
        <g transform="translate(260 520) rotate(-3)">
          <Oblik d={kutija(-110, -130, 220, 250, 8)} boja={P.belo} />
          <rect x={-110} y={-130} width={220} height={60} fill={P.ajvar} />
          <text y={-88} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={P.krem}>
            KRAJ MESECA
          </text>
          <text y={70} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={130} fill={P.mastilo}>
            31
          </text>
        </g>
      </Hrapavo>
      <Lik x={330} y={1300} s={0.95} {...MUZ} glava={{ ...MUZ.glava, izraz: svane > 0.3 ? "iznenadjena" : "tuzna", pogled: svane > 0.3 ? [6, -3] : [0, 4] }} lr={[30, 40]} dr={[-30, -40]} nagib={svane > 0.3 ? 0 : 3} />
      {/* svetlost koja preplavi sobu */}
      <rect width={1080} height={1920} fill="#FFE3A0" opacity={svane * 0.45} style={{ mixBlendMode: "screen" }} />
      {znak > 0.01 && (
        <g transform={`translate(560 820) scale(${znak * 0.95})`}>
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d="M0,-230 L18,-420 L-18,-420Z" fill={P.zlatna} opacity={0.75} transform={`rotate(${i * 22.5 + f * 0.6})`} />
          ))}
          <circle r={260} fill="url(#toplaSvetlost)" />
          <ZnakKolo id="znak8" s={0.85} />
        </g>
      )}
    </Kadar>
  );
};
