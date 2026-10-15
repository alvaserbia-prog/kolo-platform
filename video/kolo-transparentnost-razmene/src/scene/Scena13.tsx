// Scena 13 — „Uključi se na ekolo.rs.“ Završna kartica: znak KOLO i krupno „ekolo.rs“; poslednji udarac
// numere (88,71 s, scripts/muzika.py) pada odmah posle reči, kadar stoji dok numera zamire.
import React from "react";
import { Kadar, Hrapavo, napredak, useF, usePop } from "../alat";
import { ZnakKolo } from "../znak";
import { kad, scena } from "../vreme";
import { P } from "../paleta";
import { NASLOV } from "../fontovi";

const UDARAC_S = 88.71;

export const Scena13: React.FC = () => {
  const f = useF();
  const kE = kad(13, "ekolo.rs.");
  const udarac = Math.round(UDARAC_S * 30) - scena(13).odF;
  const znak = usePop(-2, 140, 11);
  const adresa = usePop(kE - 3, 150, 10);
  const puls = f >= udarac ? 1 + 0.08 * Math.exp(-(f - udarac) / 6) * Math.cos((f - udarac) / 2) : 1;
  const zraci = napredak(f, kE - 4, 14);
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#F3E3B8" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <g transform="translate(540 640)" opacity={zraci}>
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d="M0,-260 L24,-620 L-24,-620Z" fill={P.zlatna} opacity={0.45} transform={`rotate(${i * 20 + f * 0.4}) scale(${puls})`} />
        ))}
        <circle r={460} fill="url(#toplaSvetlost)" />
      </g>
      <g transform={`translate(540 640) scale(${znak * 0.95 * puls})`}>
        <ZnakKolo id="znak13" />
      </g>
      <g transform={`translate(540 1100) scale(${adresa * puls})`}>
        <text textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={170} fill={P.zelena700} letterSpacing={-2}>
          ekolo.rs
        </text>
      </g>
    </Kadar>
  );
};
