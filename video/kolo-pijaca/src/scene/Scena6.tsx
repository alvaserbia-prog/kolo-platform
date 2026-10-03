// Scena 6 — „Piše Radi i sutradan dolazi po teglu. Pri preuzimanju upisao joj je POEN.“
// Papirni avion preleti od Dejana do Radine tezge, odgovor se vrati. Na „sutradan“ sunce izađe nad
// Radinom kapijom, Dejan dođe, na „teglu“ tegla pređe iz ruke u ruku. Na „upisao“ u svesci se ispiše
// red „Dejan → Rada · POEN“ i udari pečat UPISANO.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { DEJAN, Kamera, Kocka, Kuca, Lik, Ploca, RADA, Tegla, iso, napredak, useF, usePop } from "../iso";
import { Zapis } from "../zapis";
import { kad, trajanjeF } from "../vreme";

const Avion: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-40,0 L40,-20 L-10,20 Z" fill="#fff" stroke={P.mastilo} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-10,20 L0,4 L40,-20" fill="#E6EEF4" stroke={P.mastilo} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

const Ograda: React.FC<{ x: number; y: number; d: number }> = ({ x, y, d }) => (
  <g>
    {Array.from({ length: Math.floor(d / 30) }, (_, i) => (
      <Kocka key={i} x={x} y={y + i * 30} w={8} d={14} h={60} boja="#F4F6F8" ivica />
    ))}
  </g>
);

export const Scena6: React.FC = () => {
  const f = useF();
  const kraj = trajanjeF(6);
  const fPise = kad(6, "piše");
  const fSutra = kad(6, "sutradan");
  const fTeglu = kad(6, "teglu");
  const fUpisao = kad(6, "upisao");
  const avion = napredak(f, fPise - 2, fPise + 20);
  const odgovor = napredak(f, fPise + 22, fSutra - 4);
  const dan = napredak(f, fSutra - 6, fSutra + 6);
  const dolazak = napredak(f, fSutra, fTeglu - 4);
  const predaja = napredak(f, fTeglu - 2, fTeglu + 12);
  const zapis = usePop(fUpisao - 6);
  const pero = napredak(f, fUpisao - 2, fUpisao + 18, (x) => x);
  const pecat = napredak(f, fUpisao + 20, fUpisao + 26);
  const zum = interpolate(f, [0, kraj], [1.25, 1.35]);
  // Dejan ide od ivice do kapije
  const dejanX = interpolate(dolazak, [0, 1], [620, 330]);
  const dejanY = interpolate(dolazak, [0, 1], [500, 330]);
  const [rx, ry] = iso(230, 250, 0);
  const [djx, djy] = iso(dejanX, dejanY, 0);
  const [tegX, tegY] = [interpolate(predaja, [0, 1], [rx + 26, djx - 26]), interpolate(predaja, [0, 1], [ry - 92, djy - 92]) - Math.sin(predaja * Math.PI) * 30];
  return (
    <g>
      <rect width={1080} height={1920} fill={P.nebo} />
      {/* sunce izlazi na „sutradan“ */}
      <g transform={`translate(860,${interpolate(dan, [0, 1], [420, 180])})`} opacity={dan}>
        <circle r={70} fill={P.zuta} />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={0} y1={-90} x2={0} y2={-120} stroke={P.zuta} strokeWidth={10} strokeLinecap="round" transform={`rotate(${i * 36 + f})`} />
        ))}
      </g>
      <Kamera x={iso(300, 300)[0]} y={iso(300, 300)[1] - 80} z={zum} cy={800}>
        <Ploca x={-1800} y={-1800} w={4400} d={4400} boja={P.trava} />
        <Ploca x={-1800} y={420} w={4400} d={160} boja={P.kaldrma} />
        <Kuca x={20} y={20} w={200} d={160} h={110} krov={P.crvena} />
        <Ograda x={260} y={30} d={170} />
        <Ograda x={260} y={290} d={130} />
        <g transform={`translate(${rx},${ry})`}>
          <Lik {...RADA} s={1.3} ruka={predaja > 0 && predaja < 1 ? 0.8 : 0} />
        </g>
        <g transform={`translate(${djx},${djy})`}>
          <Lik {...DEJAN} s={1.3} okrenut={-1} hod={dolazak > 0 && dolazak < 1 ? f * 0.7 : 0} ruka={predaja > 0.3 ? 0.7 : 0} />
        </g>
        {f >= fTeglu - 4 && (
          <g transform={`translate(${tegX},${tegY})`}>
            <Tegla s={0.75} />
          </g>
        )}
      </Kamera>
      {/* poruka i odgovor */}
      {avion > 0 && avion < 1 && (
        <g transform={`translate(${interpolate(avion, [0, 1], [-60, 520])},${interpolate(avion, [0, 1], [520, 360]) - Math.sin(avion * Math.PI) * 120}) rotate(-12)`}>
          <Avion s={1.6} />
        </g>
      )}
      {odgovor > 0 && odgovor < 1 && (
        <g transform={`translate(${interpolate(odgovor, [0, 1], [520, 1140])},${interpolate(odgovor, [0, 1], [380, 520]) - Math.sin(odgovor * Math.PI) * 100}) scale(-1,1) rotate(-12)`}>
          <Avion s={1.4} />
        </g>
      )}
      {zapis > 0 && (
        <g transform={`translate(540,330) scale(${zapis})`}>
          <Zapis od="Dejan" ka="Rada" pero={pero} pecat={pecat} />
        </g>
      )}
    </g>
  );
};
