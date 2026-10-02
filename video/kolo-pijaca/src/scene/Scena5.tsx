// Scena 5 — „Hteo je da napravi palačinke deci, sa domaćim pekmezom, jedva je čekao da se pojavi neko.“
// Dejanova kuhinja kao maketa: šporet i tiganj, dvoje dece za stolom, prazna tegla. Na „palačinke“
// palačinka poleti iz tiganja; na „pekmezom“ prazna tegla se zaljulja. Na „jedva“ uskoči telefon:
// Dejan traži „pekmez“ po mestu, a na „neko“ iskoči Radin oglas iz Čonoplje.
import React from "react";
import { interpolate } from "remotion";
import { P, tamnije } from "../paleta";
import { SANS } from "../fontovi";
import { DEJAN, Kamera, Kartica, Kocka, Lik, Ploca, Tegla, iso, napredak, useF, usePop } from "../iso";
import { Telefon } from "../telefon";
import { kad, trajanjeF } from "../vreme";

const Palacinka: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse rx={44} ry={20} fill="#F2C46D" stroke="#B9822F" strokeWidth={3} />
    <ellipse cx={-10} cy={-4} rx={10} ry={4} fill="#D9A04A" opacity={0.6} />
    <ellipse cx={16} cy={4} rx={8} ry={3} fill="#D9A04A" opacity={0.6} />
  </g>
);

export const Scena5: React.FC = () => {
  const f = useF();
  const kraj = trajanjeF(5);
  const fPal = kad(5, "palačinke");
  const fPek = kad(5, "pekmezom");
  const fJedva = kad(5, "jedva");
  const fNeko = kad(5, "neko");
  const zum = interpolate(f, [0, kraj], [1.3, 1.4]);
  const let_ = napredak(f, fPal, fPal + 18, (x) => x);
  const [tx, ty] = iso(150, 330, 90);
  const ljulja = Math.sin((f - fPek) / 2.2) * 9 * Math.max(0, 1 - Math.max(0, f - fPek) / 30) * (f >= fPek ? 1 : 0);
  const tel = usePop(fJedva - 4);
  const rez = usePop(fNeko);
  const kucanje = Math.min(7, Math.max(0, Math.floor((f - fJedva) / 3)));
  return (
    <g>
      <rect width={1080} height={1920} fill={P.pozadina} />
      <Kamera x={iso(260, 260)[0]} y={iso(260, 260)[1] - 60} z={zum} cy={760}>
        <Ploca x={0} y={0} w={560} d={520} boja="#DCE9F2" />
        {/* pločice */}
        {Array.from({ length: 8 }, (_, i) => (
          <polyline key={i} points={[iso(i * 70, 0), iso(i * 70, 520)].map((p) => p.join(",")).join(" ")} stroke="#C5D6E2" strokeWidth={2} fill="none" />
        ))}
        <polygon points={[iso(0, 0, 0), iso(560, 0, 0), iso(560, 0, 320), iso(0, 0, 320)].map((p) => p.join(",")).join(" ")} fill="#FFF3D9" stroke={tamnije("#FFF3D9", 0.3)} strokeWidth={1.5} />
        <polygon points={[iso(0, 0, 0), iso(0, 520, 0), iso(0, 520, 320), iso(0, 0, 320)].map((p) => p.join(",")).join(" ")} fill="#FCE7C2" stroke={tamnije("#FCE7C2", 0.3)} strokeWidth={1.5} />
        {/* šporet uz zadnji zid */}
        <Kocka x={300} y={10} w={140} d={110} h={95} boja="#F4F6F8" />
        {[[330, 40], [390, 40], [330, 85], [390, 85]].map(([x, y], i) => {
          const [sx, sy] = iso(x, y, 96);
          return <ellipse key={i} cx={sx} cy={sy} rx={22} ry={11} fill="#34495E" />;
        })}
        {/* tiganj i palačinka */}
        <g transform={`translate(${iso(345, 45, 100).join(",")})`}>
          <ellipse rx={34} ry={17} fill="#2C3E50" />
          <path d="M30,0 l60,-14" stroke="#2C3E50" strokeWidth={9} strokeLinecap="round" />
          <g transform={`translate(0,${-Math.sin(let_ * Math.PI) * 150}) rotate(${let_ * 360}) scale(1,${0.5 + 0.5 * Math.cos(let_ * Math.PI * 2)})`}>
            <Palacinka s={0.62} />
          </g>
        </g>
        {/* sto sa decom i praznom teglom */}
        <Kocka x={80} y={270} w={200} d={140} h={88} boja="#E8A65E" />
        <g transform={`translate(${tx},${ty}) rotate(${ljulja})`}>
          <Tegla s={0.85} sadrzaj="#F2F6F8" natpis={false} />
        </g>
        <g transform={`translate(${iso(220, 320, 90).join(",")})`}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0,${-i * 9})`}>
              <Palacinka s={0.55} />
            </g>
          ))}
        </g>
        <g transform={`translate(${iso(110, 460).join(",")})`}>
          <Lik odeca={P.zuta} kosa={P.kosaSmedja} dete s={1.4} />
        </g>
        <g transform={`translate(${iso(260, 450).join(",")})`}>
          <Lik odeca={P.roze} kosa={P.kosaTamna} dete s={1.4} okrenut={-1} />
        </g>
        <g transform={`translate(${iso(470, 250).join(",")})`}>
          <Lik {...DEJAN} s={1.45} okrenut={-1} ruka={tel > 0 ? 0.6 : 0} />
        </g>
        {/* upitnik iznad prazne tegle */}
        <g transform={`translate(${tx + 40},${ty - 110}) scale(${usePop(fPek + 4) * (1 - tel)})`}>
          <circle r={34} fill="#fff" stroke={P.mastilo} strokeWidth={4} />
          <text y={16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill={P.pekmez}>?</text>
        </g>
      </Kamera>
      {/* telefon: pretraga po mestu */}
      {tel > 0 && (
        <g transform={`translate(760,560) scale(${0.95 * tel}) rotate(4)`}>
          <Telefon>
            <rect x={-150} y={-210} width={300} height={60} rx={30} fill="#fff" stroke={P.mastiloSvetlo} strokeWidth={2} />
            <text x={-126} y={-170} fontFamily={SANS} fontWeight={700} fontSize={28} fill={P.mastilo}>{"pekmez".slice(0, kucanje)}</text>
            <rect x={-150} y={-130} width={200} height={48} rx={24} fill={P.zelena100} stroke={P.zelena500} strokeWidth={2} opacity={napredak(f, fJedva + 22, fJedva + 28)} />
            <text x={-50} y={-97} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={24} fill={P.zelena700} opacity={napredak(f, fJedva + 22, fJedva + 28)}>Čonoplja</text>
            {rez > 0 && (
              <g transform={`translate(0,-30) scale(${rez})`}>
                <Kartica redovi={["Domaći pekmez", "Čonoplja", "Po dogovoru"]} s={1.05} rot={0} pecat={1} />
              </g>
            )}
          </Telefon>
        </g>
      )}
    </g>
  );
};
