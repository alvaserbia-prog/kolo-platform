// Scena 10 — „Ovde vrednost ostaje kod tebe, a koristi ima cela zajednica.“
// Kolo na saboru; u sredini majstor i njegova puna gomilica „tvoja plata“, koja sija: novac ostaje
// kod njega. Na „koristi“ svetlost pređe na sve igrače, jednog za drugim, i svi se raduju.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, useF, usePop } from "../alat";
import { IGRACI, Kolo, VESNA, Zastavice } from "../kolo";
import { Kuce, Ulica } from "../pozadine";
import { Gomila } from "../plata";
import { Lik, MUZ } from "../likovi";
import { kad } from "../vreme";

export const Scena10: React.FC = () => {
  const f = useF();
  const kKor = kad(10, "koristi");
  const sred = usePop(-4, 120, 11);
  const igraci = [VESNA, ...IGRACI.slice(0, 9)];
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1000} z={1}>
          <Ulica nebo="#EDBB7E" />
          <circle cx={540} cy={700} r={480} fill="url(#toplaSvetlost)" />
          <Kuce y={950} s={0.5} n={8} x0={-220} razmak={220} svetlo={1} />
          <Zastavice x0={-60} x1={1140} y={560} ugib={80} n={15} />
          <ellipse cx={540} cy={1210} rx={560} ry={190} fill={P.drvoSvetlo} opacity={0.35} />
        </Kamera>
      </Hrapavo>
      <Kolo
        cx={540}
        cy={1180}
        rx={400}
        ry={130}
        s={0.42}
        f={f}
        ugao={f * 0.5}
        skok={1}
        igraci={igraci.map((p, i) => ({
          p,
          sjaj: interpolate(f, [kKor + i * 2, kKor + i * 2 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }))}
        centar={
          <g transform={`translate(0 ${(1 - sred) * 40})`} opacity={Math.min(1, sred * 1.5)}>
            <Lik x={440} y={1150} s={0.5} {...MUZ} glava={{ ...MUZ.glava, izraz: "srecna" }} lr={[30, 20]} dr={[60, -20]} />
            <g transform="translate(620 1060) scale(0.8)">
              <Gomila nivo={1} sjaj={0.6 + 0.4 * Math.sin(f / 9) ** 2} />
            </g>
          </g>
        }
      />
    </Kadar>
  );
};
