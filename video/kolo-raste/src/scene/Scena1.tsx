// Scena 1 — „Kolo je živo dok ga igramo, a raste svaki put kad se uhvati još neko.“
// Seoski sabor pred veče: zastavice, kuće u daljini, malo kolo od pet igrača koje se okreće.
// Na „raste“ sa desne strane pritrči mlada žena (Vesna); na „uhvati“ se uhvati, krug joj
// napravi mesto i proširi se. Kamera polako prilazi.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, napredak, useF } from "../alat";
import { Ulica, Kuce } from "../pozadine";
import { Drvo } from "../predmeti";
import { IGRACI, Kolo, VESNA, Zastavice } from "../kolo";
import { kad } from "../vreme";

export const Scena1: React.FC = () => {
  const f = useF();
  const kRaste = kad(1, "raste");
  const kUhvati = kad(1, "uhvati");
  const dolazak = napredak(f, kRaste - 6, kUhvati - kRaste + 4, Easing.out(Easing.quad));
  const mesto = napredak(f, kUhvati - 6, 18, Easing.inOut(Easing.cubic));
  const z = interpolate(f, [0, 200], [1.0, 1.12], { extrapolateRight: "clamp" });
  const rx = 300 + 60 * mesto;
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1120} z={z}>
          <Ulica nebo="#E9C79A" />
          {/* toplo sunce na zalasku */}
          <circle cx={820} cy={520} r={130} fill="#F6D48A" opacity={0.8} />
          <circle cx={820} cy={520} r={220} fill="url(#toplaSvetlost)" />
          <Kuce y={900} s={0.55} n={7} x0={-160} razmak={230} svetlo={0.5} />
          <g transform="translate(90 980)">
            <Drvo s={1.1} />
          </g>
          <g transform="translate(1000 990)">
            <Drvo s={0.95} />
          </g>
          <Zastavice x0={-40} x1={1120} y={640} ugib={70} n={14} />
          {/* utabana zemlja na kojoj se igra */}
          <ellipse cx={540} cy={1290} rx={470} ry={150} fill={P.drvoSvetlo} opacity={0.35} />
        </Kamera>
      </Hrapavo>
      <Kamera x={540} y={1120} z={z}>
        <Kolo
          cx={540}
          cy={1270}
          rx={rx}
          ry={104 + 18 * mesto}
          s={0.5}
          f={f}
          ugao={f * 0.9}
          igraci={[
            ...IGRACI.slice(0, 5).map((p) => ({ p })),
            { p: VESNA, tezina: mesto, dolazi: { x: 1260, y: 1420, napredak: dolazak } },
          ]}
        />
      </Kamera>
    </Kadar>
  );
};
