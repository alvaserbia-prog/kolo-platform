// Scena 5 — „Ima i drugih načina da doprineseš. Svi su zapisani u javnim pravilima, istim za sve.“
// Otvorena knjiga pravila; listovi se okreću i na svakom je jedan drugi način doprinosa (rad za
// zajednicu, sadržaj, donacija). Na „javnim“ knjiga zasija i povuče se naviše, a na „istim za sve“
// oko nje uskoče ljudi svih godina — svi čitaju istu knjigu.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { NASLOV, RUKOPIS } from "../fontovi";
import { Hrapavo, Kadar, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { IGRACI, VESNA } from "../kolo";
import { Alat } from "./Scena2";
import { kad } from "../vreme";

const W = 400; // širina jedne strane
const H = 540;

const Pero: React.FC = () => (
  <g transform="rotate(30)">
    <Oblik d="M0,60 C-30,10 -30,-60 0,-110 C30,-60 30,10 0,60Z" boja={P.belo} debljina={4} tekstura={0} />
    <path d="M0,60 L0,-100" stroke={P.mastilo} strokeWidth={3} />
    {[-70, -40, -10, 20].map((y) => (
      <path key={y} d={`M0,${y} L-18,${y - 14} M0,${y} L18,${y - 14}`} stroke={P.mastiloSvetlo} strokeWidth={2} />
    ))}
    <path d="M0,60 L0,90" stroke={P.mastilo} strokeWidth={6} strokeLinecap="round" />
  </g>
);
const Srce: React.FC = () => (
  <g>
    <Oblik d="M0,50 C-60,10 -80,-20 -60,-50 C-40,-78 -8,-66 0,-40 C8,-66 40,-78 60,-50 C80,-20 60,10 0,50Z" boja={P.ajvar} debljina={4} />
    <path d="M-34,-40 C-44,-30 -46,-16 -40,-6" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
  </g>
);

const Crtice: React.FC<{ x: number; y: number; n: number; w?: number }> = ({ x, y, n, w = 300 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M${x},${y + i * 34} l${w * (0.7 + ((i * 37) % 30) / 100)},0`} stroke={P.mastiloSvetlo} strokeWidth={5} strokeLinecap="round" opacity={0.35} />
    ))}
  </g>
);

type Strana = React.ReactNode;
const levo = (naslov: string): Strana => (
  <g>
    <text x={-W / 2} y={-H / 2 + 90} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={44} fill={P.mastilo}>
      {naslov}
    </text>
    <Crtice x={-W + 50} y={-H / 2 + 150} n={9} />
  </g>
);
const desno = (ikona: React.ReactNode, natpis: string): Strana => (
  <g>
    <g transform={`translate(${W / 2} -40) scale(1.5)`}>{ikona}</g>
    <text x={W / 2} y={170} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={50} fill={P.mastilo}>
      {natpis}
    </text>
  </g>
);

const RASPON: [Strana, Strana][] = [
  [levo("Pravila"), <g key="d"><Crtice x={40} y={-H / 2 + 80} n={12} /></g>],
  [levo("Rad"), desno(<Alat />, "rad za zajednicu")],
  [levo("Sadržaj"), desno(<Pero />, "znanje i sadržaj")],
  [levo("Donacija"), desno(<Srce />, "donacija")],
];

const List: React.FC<{ strana: Strana; x: number }> = ({ strana, x }) => (
  <g>
    <Oblik d={kutija(x < 0 ? -W : 0, -H / 2, W, H, 8)} boja={P.belo} debljina={3} tekstura={0.16} />
    {strana}
  </g>
);

export const Scena5: React.FC = () => {
  const f = useF();
  const kIma = kad(5, "Ima");
  const kSvi = kad(5, "Svi");
  const kJavnim = kad(5, "javnim");
  const kIstim = kad(5, "istim");
  // tri okretanja lista tokom prve rečenice
  const okreti = [kIma - 2, kIma + 14, kIma + 30].map((at) => napredak(f, at, 12, Easing.inOut(Easing.cubic)));
  const n = okreti.filter((p) => p >= 1).length; // koliko je listova okrenuto
  const tekuci = okreti.find((p) => p > 0 && p < 1);
  const gore = napredak(f, kJavnim - 6, 22, Easing.inOut(Easing.cubic));
  const sjaj = napredak(f, kJavnim - 4, 14);
  const by = interpolate(gore, [0, 1], [860, 650]);
  const bs = interpolate(gore, [0, 1], [1, 0.76]);
  const ljudi = [VESNA, ...IGRACI.slice(0, 7)];
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#E9D6AC" />
      <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      <circle cx={540} cy={by} r={560} fill="url(#toplaSvetlost)" opacity={0.4 + 0.6 * sjaj} />
      <g transform={`translate(540 ${by}) scale(${bs})`}>
        <Hrapavo lokalno>
          {/* korice ispod */}
          <Oblik d={kutija(-W - 26, -H / 2 - 20, 2 * W + 52, H + 44, 16)} boja={P.ajvarTamni} debljina={5} />
          <List strana={RASPON[n][0]} x={-1} />
          <List strana={RASPON[Math.min(RASPON.length - 1, n + (tekuci !== undefined ? 1 : 0))][1]} x={1} />
          {tekuci !== undefined && (() => {
            const c = Math.cos(Math.PI * tekuci);
            return (
              <g transform={`scale(${c} 1)`}>
                {c > 0 ? <List strana={RASPON[n][1]} x={1} /> : <g transform="scale(-1 1)"><List strana={RASPON[n + 1][0]} x={-1} /></g>}
              </g>
            );
          })()}
          <path d={`M0,${-H / 2} L0,${H / 2}`} stroke={P.mastilo} strokeWidth={4} opacity={0.6} />
          <rect x={-18} y={-H / 2} width={36} height={H} fill={P.senka} opacity={0.12} filter="url(#blur6)" />
          {/* traka za obeležavanje */}
          <path d={`M60,${-H / 2 - 20} L60,${H / 2 + 80} L78,${H / 2 + 62} L96,${H / 2 + 80} L96,${-H / 2 - 20}Z`} fill={P.zelena700} stroke={P.mastilo} strokeWidth={3} />
        </Hrapavo>
        {/* na „javnim“: natpis preko stranice */}
        {sjaj > 0 && (
          <g opacity={sjaj} transform={`translate(0 ${H / 2 + 70})`}>
            <rect x={-250} y={-46} width={500} height={80} rx={40} fill={P.zelena700} stroke={P.mastilo} strokeWidth={4} />
            <text y={12} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={44} fill="#fff">
              javna pravila
            </text>
          </g>
        )}
      </g>
      {/* ljudi oko knjige: isto za sve */}
      {ljudi.map((l, i) => {
        const t = (i + 0.5) / ljudi.length;
        const a = Math.PI * (1 - t);
        const x = 540 + Math.cos(a) * 470;
        const y = 1290 - Math.sin(a) * 90;
        return (
          <Pop key={i} at={kIstim - 6 + Math.abs(i - 3.5) * 2} x={x} y={y}>
            <Lik x={0} y={0} s={0.42} {...l} glava={{ ...l.glava, izraz: "osmeh", pogled: [x < 540 ? 0.6 : -0.6, -1] }} okreni={x > 540} lr={[10, 10]} dr={[-10, -10]} />
          </Pop>
        );
      })}
      {f >= kSvi - 10 && <ellipse cx={540} cy={1300} rx={520} ry={40} fill={P.senka} opacity={0.08} />}
    </Kadar>
  );
};
