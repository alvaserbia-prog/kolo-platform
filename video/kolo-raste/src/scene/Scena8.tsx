// Scena 8 — poziv. „Uhvati se u KOLO. Postavi svoj prvi oglas na ekolo.rs.“
// Kolo oko znaka KOLO ima jedno prazno mesto; na „Uhvati“ u njega uskoči nov igrač i krug se
// zatvori. Na „Postavi“ ispod uskoči dugme, a na „ekolo.rs“ krupna adresa. Kolo igra do kraja.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { NASLOV, SANS } from "../fontovi";
import { Hrapavo, Kadar, napredak, useF, usePop } from "../alat";
import { IGRACI, Kolo, VESNA } from "../kolo";
import { ZnakKolo } from "./Scena2";
import { kad } from "../vreme";

export const TI = {
  odeca: { tip: "muski", kosulja: P.zelena500, pantalone: P.teget },
  glava: { kosa: "mlad", bojaKose: P.kosaRida, seed: 12 },
};

export const Scena8: React.FC = () => {
  const f = useF();
  const kUhvati = kad(8, "Uhvati");
  const kPostavi = kad(8, "Postavi");
  const kEkolo = kad(8, "ekolo.rs.");
  const naslov = usePop(-4, 120, 12);
  const znak = usePop(-2, 110, 11);
  const ulazak = napredak(f, kUhvati - 8, 20, Easing.out(Easing.quad));
  const mesto = napredak(f, kUhvati + 6, 16, Easing.inOut(Easing.cubic));
  const dugme = usePop(kPostavi - 2, 160, 10);
  const adresa = usePop(kEkolo - 4, 150, 10);
  const igraci = [VESNA, ...IGRACI.slice(0, 9)];
  // prazno mesto (poslednji igrač) je napred tačno kad se kaže „Uhvati“
  const ugao = 90 - (360 * (igraci.length + 0.15)) / (igraci.length + 0.3) + (f - kUhvati) * 0.7;
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#EFE2C2" />
      <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
      <circle cx={540} cy={700} r={520} fill="url(#toplaSvetlost)" opacity={0.8} />
      <g transform={`translate(540 ${250 - (1 - naslov) * 40})`} opacity={Math.min(1, naslov * 1.5)}>
        <text textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={96} fill={P.mastilo}>
          Uhvati se u KOLO
        </text>
        <path d="M-300,40 Q0,62 300,40" fill="none" stroke={P.vez} strokeWidth={5} strokeLinecap="round" />
      </g>
      <Kolo
        cx={540}
        cy={830}
        rx={360}
        ry={116}
        s={0.3}
        f={f}
        ugao={ugao}
        skok={0.8}
        igraci={[
          ...igraci.map((p) => ({ p })),
          {
            p: TI as any,
            nevidljiv: f < kUhvati - 8,
            tezina: 0.3 + 0.7 * mesto,
            dolazi: ulazak < 1 ? { x: 540, y: 1500, napredak: ulazak } : undefined,
            sjaj: interpolate(f, [kUhvati, kUhvati + 20, kUhvati + 60], [0, 1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          },
        ]}
        centar={
          <g transform={`translate(540 530) scale(${znak * 0.74}) rotate(${(1 - znak) * -20})`}>
            <ZnakKolo id="znak8" />
          </g>
        }
      />
      <g transform={`translate(540 1250) scale(${adresa})`}>
        <Hrapavo lokalno>
          <text textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={150} fill={P.zelena700} letterSpacing={-2}>
            ekolo.rs
          </text>
        </Hrapavo>
      </g>
      <g transform={`translate(540 1030) scale(${dugme})`}>
        <rect x={-340} y={-58} width={680} height={116} rx={58} fill={P.zelena500} stroke={P.zelena900} strokeWidth={5} />
        <text y={20} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={52} fill="#fff">
          Postavi svoj prvi oglas
        </text>
      </g>
    </Kadar>
  );
};
