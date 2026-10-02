// Scena 1 — „Od trideset tegli pekmeza koje napravi, Rada i muž pojedu samo deset.
// Nešto podeli, a ostatak joj propadne.“
// Radina ostava kao maketa: na „trideset“ police se pune teglama; na „Rada i muž“ uđu njih dvoje;
// na „deset“ deset tegli sklizne na sto; na „podeli“ nekoliko tegli ode u korpu za komšije;
// na „propadne“ ostale tegle sivi prašina, a svetlo u ostavi slabi.
import React from "react";
import { interpolate } from "remotion";
import { P, tamnije } from "../paleta";
import { Kamera, Kocka, Lik, MUZ, Ploca, RADA, Tegla, iso, napredak, useF, usePop } from "../iso";
import { kad, trajanjeF } from "../vreme";
import { SANS } from "../fontovi";

// police uz zadnji zid (ravan y = 0), tri reda po deset tegli
const POLICE_Z = [70, 160, 250];
const TEGLE = POLICE_Z.flatMap((z, r) => Array.from({ length: 10 }, (_, k) => ({ x: 40 + k * 46, z, r, k })));
// koje tegle šta: gornji red (10) ide na sto, pet iz srednjeg u korpu, ostalo propada
const NA_STO = TEGLE.filter((t) => t.r === 2);
const U_KORPU = TEGLE.filter((t) => t.r === 1 && t.k >= 5);

const Sto: React.FC = () => (
  <g>
    <Kocka x={140} y={250} w={260} d={130} h={70} boja={P.drvo} />
  </g>
);

export const Scena1: React.FC = () => {
  const f = useF();
  const fTrideset = kad(1, "trideset");
  const fRada = kad(1, "rada");
  const fDeset = kad(1, "deset");
  const fPodeli = kad(1, "podeli");
  const fPropadne = kad(1, "propadne");
  const kraj = trajanjeF(1);
  const zum = interpolate(f, [0, kraj], [1.32, 1.45]);
  const sivo = napredak(f, fPropadne, fPropadne + 24);
  const korpa = napredak(f, fPodeli + 8, fPodeli + 34);
  const korpaOde = napredak(f, fPodeli + 40, fPodeli + 62);
  const nRada = usePop(fRada);
  const nMuz = usePop(fRada + 8);

  return (
    <g>
      <rect width={1080} height={1920} fill={P.pozadina} />
      <Kamera x={180} y={230} z={zum} cy={760}>
        {/* pod i dva zida */}
        <Ploca x={0} y={0} w={560} d={460} boja="#E9D2B0" />
        <polygon points={[iso(0, 0, 0), iso(560, 0, 0), iso(560, 0, 340), iso(0, 0, 340)].map((p) => p.join(",")).join(" ")} fill="#F7E3C4" stroke={tamnije("#F7E3C4", 0.3)} strokeWidth={1.5} />
        <polygon points={[iso(0, 0, 0), iso(0, 460, 0), iso(0, 460, 340), iso(0, 0, 340)].map((p) => p.join(",")).join(" ")} fill="#EED6B2" stroke={tamnije("#EED6B2", 0.3)} strokeWidth={1.5} />
        {/* prozorče sa svetlom */}
        <g>
          <polygon points={[iso(0, 300, 200), iso(0, 380, 200), iso(0, 380, 280), iso(0, 300, 280)].map((p) => p.join(",")).join(" ")} fill="#BFE3F0" stroke={P.drvoTamno} strokeWidth={4} />
        </g>
        {/* police */}
        {POLICE_Z.map((z) => (
          <Kocka key={z} x={20} y={0} z={z - 10} w={480} d={44} h={10} boja={P.drvo} />
        ))}
        <Sto />
        {/* tegle */}
        {TEGLE.map((t, i) => {
          const pojava = fTrideset + i * 0.8;
          const s = f < pojava ? 0 : Math.min(1, (f - pojava) / 6);
          if (s <= 0) return null;
          let [sx, sy] = iso(t.x, 22, t.z);
          const naSto = NA_STO.indexOf(t);
          const uKorpu = U_KORPU.indexOf(t);
          if (naSto >= 0) {
            const p = napredak(f, fDeset - 6 + naSto * 1.5, fDeset + 14 + naSto * 1.5);
            const [tx, ty] = iso(170 + (naSto % 5) * 46, 290 + Math.floor(naSto / 5) * 46, 70);
            sx = interpolate(p, [0, 1], [sx, tx]);
            sy = interpolate(p, [0, 1], [sy, ty]) - Math.sin(p * Math.PI) * 60;
          }
          if (uKorpu >= 0) {
            const p = napredak(f, fPodeli + uKorpu * 3, fPodeli + 16 + uKorpu * 3);
            const [tx, ty] = iso(470 + (uKorpu % 3) * 22 + korpaOde * 260, 400 + korpaOde * 160, 26 + Math.floor(uKorpu / 3) * 10);
            sx = interpolate(p, [0, 1], [sx, tx]);
            sy = interpolate(p, [0, 1], [sy, ty]) - Math.sin(p * Math.PI) * 50;
          }
          const ostaje = naSto < 0 && uKorpu < 0;
          return (
            <g key={i} transform={`translate(${sx},${sy})`}>
              <Tegla s={0.62 * s} prasina={ostaje ? sivo : 0} natpis={false} />
            </g>
          );
        })}
        {/* korpa za komšije */}
        {korpa > 0 && (
          <g transform={`translate(${iso(480 + korpaOde * 260, 410 + korpaOde * 160, 0).join(",")}) scale(${korpa})`}>
            <path d="M-46,-40 L46,-40 L36,0 L-36,0 Z" fill="#C98B4E" stroke="#7A4E25" strokeWidth={2.5} />
            <path d="M-40,-40 Q0,-100 40,-40" stroke="#7A4E25" strokeWidth={5} fill="none" />
            <path d="M-42,-28 L42,-28 M-39,-14 L39,-14" stroke="#7A4E25" strokeWidth={1.5} />
          </g>
        )}
        {/* Rada i muž */}
        <g transform={`translate(${iso(470, 210).join(",")}) scale(${nRada})`}>
          <Lik {...RADA} s={1.5} okrenut={-1} ruka={napredak(f, fPodeli - 4, fPodeli + 6) * (1 - korpaOde)} />
        </g>
        <g transform={`translate(${iso(430, 300).join(",")}) scale(${nMuz})`}>
          <Lik {...MUZ} s={1.55} okrenut={-1} />
        </g>
        {/* svetlo ostave slabi kad tegle propadaju */}
        <rect x={-2000} y={-2000} width={4000} height={4000} fill="#2B2A3A" opacity={0.16 * sivo} />
      </Kamera>
      {/* brojke: koliko ih je, koliko pojedu */}
      <g transform={`translate(860,330) scale(${usePop(fTrideset)})`} opacity={1 - napredak(f, fDeset - 4, fDeset + 4)}>
        <circle r={78} fill={P.pekmez} />
        <text y={26} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={80} fill="#fff">30</text>
      </g>
      <g transform={`translate(860,330) scale(${usePop(fDeset)})`} opacity={1 - napredak(f, fPodeli, fPodeli + 8)}>
        <circle r={78} fill={P.zelena500} />
        <text y={26} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={80} fill="#fff">10</text>
      </g>
    </g>
  );
};
