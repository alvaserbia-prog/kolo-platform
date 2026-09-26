// Scena 6 — „Uhvati se i ti u kolo! Registracija traje oko minut. ekolo.rs"
// Kolo se širi: između četvoro poznatih uskaču novi ljudi. Sat odbroji minut,
// pa „ekolo.rs" slovo po slovo; posle glasa ostaje zelena traka sa pozivom.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Defs, Isecak, Pop, napredak, pravougaonik, usePop } from "../papir";
import { SANS, RUKOPIS } from "../fontovi";
import { Kolo, LogoZnak, OSOBE, OsobaCfg } from "../kolo";
import { Sat, OSOBE_KOLA } from "../likovi4";
import { kad, glasF, scena } from "../vreme";

const SLOVA = "ekolo.rs".split("");
// četvoro poznatih na parnim mestima, novi (iz videa 1) između njih
const KOLO8: OsobaCfg[] = [OSOBE_KOLA[0], OSOBE[5], OSOBE_KOLA[1], OSOBE[3], OSOBE_KOLA[2], OSOBE[7], OSOBE_KOLA[3], OSOBE[4]];

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const ti = kad(6, "ti");
  const registracija = kad(6, "Registracija");
  const traje = kad(6, "traje");
  const minut = kad(6, "minut.");
  const sajt = kad(6, "ekolo.rs");
  const krajGlasa = glasF(6, scena(6).glasDo - scena(6).glasOd);
  const cta = usePop(krajGlasa + 4, 150);

  const pojava = KOLO8.map((_, i) => (i % 2 === 0 ? 0 : ti + (i - 1) * 3));
  const satOde = napredak(f, sajt - 8, 10);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <Pop at={2} x={540} y={380} njihanje={1.2}>
        <LogoZnak seed="s6-logo" r={100} />
      </Pop>
      <Kolo seed="s6-kolo" geo={{ cx: 540, cy: 1080, rx: 400, ry: 120, ugao: 225 + (f + 160) * 0.6, skala: 0.82, n: 8 }} pojava={pojava} ruke={ti + 24} osobe={KOLO8} />
      {/* registracija ~ minut */}
      {satOde < 1 && (
        <g opacity={1 - satOde}>
          <Pop at={registracija} x={540} y={680} skala={0.9} njihanje={1}>
            <Sat seed="s6-sat" t={napredak(f, traje, minut - traje + 14)} />
          </Pop>
        </g>
      )}
      {/* ekolo.rs — svako slovo svoj isečak */}
      {SLOVA.map((c, i) => {
        const sirine = SLOVA.map((z) => (z === "." ? 58 : 118));
        const ukupno = sirine.reduce((a, b) => a + b, 0);
        const x = 540 - ukupno / 2 + sirine.slice(0, i).reduce((a, b) => a + b, 0) + sirine[i] / 2;
        const tacka = c === ".";
        return (
          <Pop key={i} at={sajt + i * 2} x={x} y={690} rot={(i % 2 ? 4 : -4) + (i % 3) - 1} njihanje={1.5} faza={i}>
            {!tacka && <Isecak pts={pravougaonik(-56, -96, 112, 150)} boja={P.belo} seed={`s6-l${i}`} amp={2} />}
            <text x={0} y={36} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={140} fill={tacka ? P.zlatna600 : P.zelena700}>
              {c}
            </text>
          </Pop>
        );
      })}
      {/* poziv kad naracija stane (titlovi su tada skinuti) */}
      {cta > 0 && (
        <g transform={`translate(540 1440) rotate(${-2 + (1 - cta) * -8}) scale(${cta.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-420, -96, 840, 200)} boja={P.zelena700} seed="s6-cta" amp={3} />
          <text x={0} y={-6} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={80} fill={P.belo}>
            ekolo.rs
          </text>
          <text x={0} y={66} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={62} fill={P.zlatna400}>
            uhvati se i ti u kolo
          </text>
        </g>
      )}
    </svg>
  );
};
