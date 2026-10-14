// Scena 12 — „Postavi svoj prvi oglas na ekolo.rs.“ Završni udarac numere pada odmah posle „ekolo.rs“.
// Telefon sa prvim oglasom koji se ispisuje i objavi; na „ekolo.rs“ krupna adresa, znak KOLO i zraci;
// na završni udarac zraci i adresa blago udare, pa kadar stoji do kraja.
import React from "react";
import { Hrapavo, Kadar, napredak, useF, usePop } from "../alat";
import { EkranOglas, Telefon } from "../predmeti";
import { ZnakKolo } from "../znak";
import { kad, scena } from "../vreme";
import { P } from "../paleta";
import { NASLOV } from "../fontovi";

const UDARAC_S = 83.74; // završni udarci numere u videu (scripts/muzika.py)

export const Scena12: React.FC = () => {
  const f = useF();
  const kO = kad(12, "oglas");
  const kE = kad(12, "ekolo.rs.");
  const udarac = Math.round(UDARAC_S * 30) - scena(12).odF;
  const tel = usePop(-4, 140, 11);
  const adresa = usePop(kE - 3, 150, 10);
  const znak = usePop(kE + 2, 140, 11);
  const puls = f >= udarac ? 1 + 0.08 * Math.exp(-(f - udarac) / 6) * Math.cos((f - udarac) / 2) : 1;
  const zraci = napredak(f, kE - 4, 14);
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#F3E3B8" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <g transform="translate(540 560)" opacity={zraci}>
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d="M0,-260 L24,-620 L-24,-620Z" fill={P.zlatna} opacity={0.45} transform={`rotate(${i * 20 + f * 0.4}) scale(${puls})`} />
        ))}
        <circle r={460} fill="url(#toplaSvetlost)" />
      </g>
      <g transform={`translate(${540 - zraci * 230} ${560 - zraci * 30}) scale(${tel * (1 - zraci * 0.35)}) rotate(${-4 + zraci * -4})`}>
        <Telefon s={1.05}>
          <EkranOglas faza={1} slovaNaslova={napredak(f, 0, kO + 4) * 40} objavljen={napredak(f, kO + 4, 10)} />
        </Telefon>
      </g>
      <g transform={`translate(780 520) scale(${znak * 0.62 * puls})`}>
        <ZnakKolo id="znak12" />
      </g>
      <g transform={`translate(540 1060) scale(${adresa * puls})`}>
        <text textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={170} fill={P.zelena700} letterSpacing={-2}>
          ekolo.rs
        </text>
      </g>
    </Kadar>
  );
};
