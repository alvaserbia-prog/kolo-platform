// Naslovna (cover) za mreže: sabor u sumrak, kolo oko znaka KOLO, krupan naslov.
// Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, SERIF, ucitajFontove } from "./fontovi";
import { Hrapavo, Kadar, Kamera } from "./alat";
import { Kuce, Ulica } from "./pozadine";
import { IGRACI, Kolo, VESNA, Zastavice } from "./kolo";
import { ZnakKolo } from "./scene/Scena2";
import { Stranica } from "./Stranica";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1000} z={1}>
          <Ulica nebo="#E3AE7C" />
          <circle cx={540} cy={700} r={460} fill="url(#toplaSvetlost)" />
          <Kuce y={960} s={0.5} n={8} x0={-220} razmak={220} svetlo={1} />
          <Zastavice x0={-60} x1={1140} y={660} ugib={80} n={15} />
          <ellipse cx={540} cy={1250} rx={560} ry={190} fill={P.drvoSvetlo} opacity={0.35} />
        </Kamera>
      </Hrapavo>
      <Kolo
        cx={540}
        cy={1230}
        rx={380}
        ry={130}
        s={0.42}
        f={40}
        ugao={30}
        skok={0}
        igraci={[VESNA, ...IGRACI.slice(0, 8)].map((p) => ({ p }))}
        centar={
          <g transform="translate(540 930) scale(0.62)">
            <ZnakKolo id="znakN" />
          </g>
        }
      />
    </Kadar>
    <AbsoluteFill>
      <Stranica />
    </AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 10px 12px rgba(58,42,29,0.35))" }}>
      <rect x={90} y={300} width={900} height={300} rx={30} fill={P.krem} stroke={P.mastilo} strokeWidth={5} />
      <rect x={104} y={314} width={872} height={272} rx={22} fill="none" stroke={P.vez} strokeWidth={3} strokeDasharray="12 7" />
      <text x={540} y={430} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={96} fill={P.mastilo}>
        KOLO raste
      </text>
      <text x={540} y={525} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={64} fill={P.zelena700}>
        kad se uhvati još neko
      </text>
      <rect x={170} y={1420} width={740} height={200} rx={26} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
      <text x={540} y={1500} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill={P.mastilo}>
        Uhvati se u KOLO
      </text>
      <text x={540} y={1584} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
