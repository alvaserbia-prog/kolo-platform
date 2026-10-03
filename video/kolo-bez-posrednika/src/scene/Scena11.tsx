// Scena 11 — „ekolo.rs, čista ušteda!“ Znak KOLO, krupna adresa i „čista ušteda!“ rukopisom,
// ispod puna gomilica „tvoja plata“; iza njih sunce i malo kolo. Pesma se završava udarima, a kadar stoji do kraja.
import React from "react";
import { P } from "../paleta";
import { NASLOV, RUKOPIS } from "../fontovi";
import { Hrapavo, Kadar, useF, usePop } from "../alat";
import { IGRACI, Kolo, VESNA } from "../kolo";
import { ZnakKolo } from "../znak";
import { Gomila } from "../plata";
import { kad } from "../vreme";

export const Scena11: React.FC = () => {
  const f = useF();
  const znak = usePop(-4, 120, 11);
  const adresa = usePop(kad(11, "ekolo.rs,") - 4, 150, 10);
  const usteda = usePop(kad(11, "čista") - 4, 150, 9);
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#EFE2C2" />
      <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
      <g transform="translate(540 470)">
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d="M0,-260 L22,-560 L-22,-560Z" fill={P.zlatna} opacity={0.45} transform={`rotate(${i * 20 + f * 0.4})`} />
        ))}
        <circle r={420} fill="url(#toplaSvetlost)" />
        <g transform={`scale(${znak * 0.72}) rotate(${(1 - znak) * -20})`}>
          <ZnakKolo id="znak11" />
        </g>
      </g>
      <g transform={`translate(540 820) scale(${adresa})`}>
        <Hrapavo lokalno>
          <text textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={160} fill={P.zelena700} letterSpacing={-2}>
            ekolo.rs
          </text>
        </Hrapavo>
      </g>
      <g transform={`translate(540 975) scale(${usteda}) rotate(-3)`}>
        <text textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={120} fill={P.ajvar}>
          čista ušteda!
        </text>
        <path d="M-300,30 Q0,60 300,26" fill="none" stroke={P.ajvar} strokeWidth={7} strokeLinecap="round" />
      </g>
      <g transform="translate(540 1220) scale(0.8)">
        <Gomila nivo={1} sjaj={0.5} />
      </g>
      <Kolo
        cx={540}
        cy={1800}
        rx={420}
        ry={90}
        s={0.26}
        f={f}
        ugao={f * 0.7}
        skok={1}
        igraci={[VESNA, ...IGRACI.slice(0, 9)].map((p) => ({ p }))}
      />
    </Kadar>
  );
};
