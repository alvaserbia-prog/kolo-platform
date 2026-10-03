// Scena 4 — „Dejan iz Sombora je već član KOLA. Električar je i sakupio je POENE dajući usluge
// ostalim članovima.“
// Kamera stane kod Dejanove tezge električara; Dejan uz nju. Na „Električar“ upali se sijalica.
// Na „dajući usluge“ od tezge krenu niti do tri kuće, u kojima se upali svetlo, a u Dejanovoj
// svesci se upiše red za svaku (POEN samo kao zapis, bez iznosa).
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { SANS } from "../fontovi";
import { DEJAN, Kamera, Kuca, Lik, iso, napredak, useF, usePop } from "../iso";
import { SvetPijace, tezga } from "../svet";
import { kad, trajanjeF } from "../vreme";

const KUCE = [
  { x: 380, y: 1000, krov: P.crvena, red: "Svetlo u kuhinji" },
  { x: 760, y: 1080, krov: P.narandzasta, red: "Nova utičnica" },
  { x: 1140, y: 1000, krov: P.tirkiz, red: "Popravka bojlera" },
];

export const Scena4: React.FC = () => {
  const f = useF();
  const kraj = trajanjeF(4);
  const fSombora = kad(4, "sombora");
  const fElektricar = kad(4, "električar");
  const fUsluge = kad(4, "dajući");
  const d = tezga("dejan");
  const [dx, dy] = iso(d.x + 85, d.y + 50, 90);
  const prelaz = napredak(f, fUsluge - 12, fUsluge + 8);
  const kx = interpolate(prelaz, [0, 1], [dx, iso(760, 900, 0)[0]]);
  const ky = interpolate(prelaz, [0, 1], [dy + 60, iso(760, 900, 0)[1] - 40]);
  const zum = interpolate(prelaz, [0, 1], [1.35, 0.85]) * interpolate(f, [0, kraj], [1, 1.04]);
  const svetli = napredak(f, fElektricar, fElektricar + 8);
  const niti = KUCE.map((_, i) => napredak(f, fUsluge + i * 8, fUsluge + 14 + i * 8));
  const znak = usePop(fSombora);
  return (
    <g>
      <rect width={1080} height={1920} fill={P.nebo} />
      <Kamera x={kx} y={ky} z={zum} cy={760}>
        <SvetPijace pecatRada={1} svetlo={(id) => (id === "dejan" ? svetli : 0)} />
        {KUCE.map((k, i) => (
          <Kuca key={i} x={k.x} y={k.y} krov={k.krov} svetlo={niti[i] > 0.95 ? 1 : 0} />
        ))}
        {KUCE.map((k, i) => {
          const [ax, ay] = iso(d.x + 85, d.y + 100, 30);
          const [bx, by] = iso(k.x + 60, k.y + 10, 60);
          const p = niti[i];
          if (p <= 0) return null;
          const mx = (ax + bx) / 2;
          const my = Math.min(ay, by) - 120;
          const put = `M${ax},${ay} Q${mx},${my} ${bx},${by}`;
          return <path key={i} d={put} stroke={P.zelena500} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />;
        })}
        <g transform={`translate(${iso(d.x + 230, d.y + 40).join(",")})`}>
          <Lik {...DEJAN} s={1.25} okrenut={-1} ruka={svetli * 0.5} />
        </g>
      </Kamera>
      {/* tabla sa mestom */}
      <g transform={`translate(800,300) scale(${znak * (1 - prelaz)})`}>
        <rect x={-120} y={-44} width={240} height={88} rx={14} fill={P.plava} stroke="#fff" strokeWidth={5} />
        <text x={0} y={16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill="#fff">Sombor</text>
      </g>
      {/* Dejanova sveska: red za svaku uslugu */}
      <g transform={`translate(540,240) scale(${usePop(fUsluge + 4)})`}>
        <rect x={-380} y={-80} width={760} height={340} rx={22} fill={P.krem} stroke={P.mastilo} strokeWidth={4} filter="url(#senkaMeka)" />
        <text x={-345} y={-22} fontFamily={SANS} fontWeight={900} fontSize={40} fill={P.mastilo}>Dejanov zapis u KOLU</text>
        {KUCE.map((k, i) => (
          <g key={i} opacity={niti[i] > 0.95 ? 1 : 0}>
            <line x1={-345} x2={345} y1={18 + i * 74} y2={18 + i * 74} stroke="#D9C9A8" strokeWidth={2} />
            <text x={-345} y={68 + i * 74} fontFamily={SANS} fontWeight={800} fontSize={38} fill={P.mastilo}>{k.red}</text>
            <rect x={190} y={30 + i * 74} width={155} height={52} rx={26} fill={P.zelena500} />
            <text x={267} y={66 + i * 74} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={32} fill="#fff">+ POEN</text>
          </g>
        ))}
      </g>
    </g>
  );
};
