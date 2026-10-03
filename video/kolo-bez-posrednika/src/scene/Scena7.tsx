// Scena 7 — „A kome ide razlika, kad se mleko od proizvođača otkupljuje po 40, a u prodavnici
// prodaje po 160 dinara?“ Levo proizvođač sa kantom mleka, desno polica prodavnice sa flašom.
// Na „kome“ između njih iskoči veliki upitnik, na „proizvođača“ se iscrta duga strelica,
// na „40“ i „160“ uskoče cedulje.
import React from "react";
import { P } from "../paleta";
import { NASLOV } from "../fontovi";
import { Hrapavo, Kadar, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { KOMSIJA, Lik } from "../likovi";
import { kad } from "../vreme";
import { Cedulja, HLADNO, Strelica } from "./zajednicko";

const KantaMleka: React.FC = () => (
  <g>
    <Oblik d="M-60,0 L-70,-150 C-70,-176 -40,-190 -30,-210 L30,-210 C40,-190 70,-176 70,-150 L60,0Z" boja="#C7CDC8" />
    <Oblik d={kutija(-36, -232, 72, 26, 6)} boja="#A9B1AB" debljina={3.5} />
    <path d="M-50,-120 L50,-120" stroke={P.mastilo} strokeWidth={3} opacity={0.4} />
  </g>
);

const Flasa: React.FC = () => (
  <g>
    <Oblik d="M-34,0 L-34,-110 C-34,-130 -14,-138 -14,-156 L-14,-180 L14,-180 L14,-156 C14,-138 34,-130 34,-110 L34,0Z" boja={P.belo} debljina={4} />
    <rect x={-16} y={-196} width={32} height={18} rx={4} fill={P.plava} stroke={P.mastilo} strokeWidth={3} />
    <rect x={-30} y={-90} width={60} height={46} fill={P.neboTamno} opacity={0.7} />
  </g>
);

export const Scena7: React.FC = () => {
  const f = useF();
  const str = napredak(f, kad(7, "proizvođača") - 2, 26);
  return (
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill={HLADNO.nebo} />
        <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        <rect x={0} y={1060} width={1080} height={900} fill="#9AA27E" />
        {/* prodavnica: tenda i polica */}
        <g transform="translate(790 430)">
          <Oblik d={kutija(-260, 0, 520, 560, 8)} boja="#DCDDD6" />
          <Oblik d="M-290,0 L290,0 L270,-90 L-270,-90Z" boja={P.plava} />
          {[-210, -110, -10, 90, 190].map((x, i) => (
            <path key={x} d={`M${x},0 L${x + 50},0 L${x + 46},-90 L${x + 6},-90Z`} fill={i % 2 ? P.belo : P.plava} stroke={P.mastilo} strokeWidth={2} opacity={0.9} />
          ))}
          <text y={-30} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={40} fill={P.mastilo}>
            PRODAVNICA
          </text>
          {[180, 380].map((y) => (
            <Oblik key={y} d={kutija(-230, y, 460, 18, 3)} boja={P.drvo} debljina={3} />
          ))}
          {[-150, -60, 30, 120].map((x) => (
            <g key={x} transform={`translate(${x} 180) scale(0.7)`}>
              <Flasa />
            </g>
          ))}
        </g>
      </Hrapavo>
      <Lik x={190} y={1300} s={0.78} {...KOMSIJA} glava={{ ...KOMSIJA.glava, izraz: "zamisljena" }} lr={[10, 10]} dr={[-40, -10]} />
      <g transform="translate(400 1300) scale(0.9)">
        <KantaMleka />
      </g>
      <Strelica x1={420} y1={1040} x2={700} y2={660} luk={-120} napredak={str} />
      <Pop at={kad(7, "kome") - 4} x={530} y={700} skala={1.2}>
        <text textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={220} fill={P.ajvar} stroke={P.mastilo} strokeWidth={4}>
          ?
        </text>
      </Pop>
      <Pop at={kad(7, "40,") - 4} x={400} y={1000} rot={-6}>
        <Cedulja tekst="40" sirina={180} velicina={56} />
      </Pop>
      <Pop at={kad(7, "160") - 4} x={760} y={820} rot={5}>
        <Cedulja tekst="160" sirina={200} velicina={56} boja={P.ajvar} />
      </Pop>
    </Kadar>
  );
};
