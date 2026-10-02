// Scena 9 — „Dejan je potvrdio Radu kao članicu, i sada ona može da učestvuje u razmeni u potpunosti.“
// Radina kartica krupno, sa pečatom BEZ POTVRDE i natpisom „Nova članica. Još je niko nije potvrdio.“
// Rada i Dejan se rukuju. Na „potvrdio“ pečat se odlepi i padne, kartica zasija zeleno;
// na „potpunosti“ oko nje uskoče tezge pijace na koje sada i ona može da ode.
import React from "react";
import { P } from "../paleta";
import { SANS } from "../fontovi";
import { DEJAN, Kartica, Lik, Natpis, RADA, napredak, useF, usePop } from "../iso";
import { kad } from "../vreme";

export const Scena9: React.FC = () => {
  const f = useF();
  const fPotvrdio = kad(9, "potvrdio");
  const fPotpunosti = kad(9, "potpunosti");
  const skida = napredak(f, fPotvrdio, fPotvrdio + 16, (x) => x * x);
  const sjaj = napredak(f, fPotvrdio + 8, fPotvrdio + 18);
  const rukovanje = Math.sin(f / 3) * (f > 4 && f < fPotvrdio + 20 ? 0.12 : 0);
  const krug = usePop(fPotpunosti - 4);
  const natpis = napredak(f, 2, 12) * (1 - napredak(f, fPotvrdio + 4, fPotvrdio + 12));
  return (
    <g>
      <rect width={1080} height={1920} fill={P.pozadina} />
      <circle cx={540} cy={640} r={400} fill={P.zelena100} opacity={sjaj} />
      {/* kartica */}
      <g transform="translate(540,300)">
        <Kartica redovi={["Domaći pekmez", "Čonoplja", "Po dogovoru"]} s={1.9} rot={-2} pecat={1 - skida > 0.02 ? 1 : 0} sjaj={sjaj} />
      </g>
      {/* pečat koji pada */}
      {skida > 0 && skida < 1 && (
        <g transform={`translate(${780 + skida * 120},${300 + skida * 900}) rotate(${14 + skida * 200}) scale(1.9)`} opacity={1 - skida}>
          <rect x={-72} y={-20} width={144} height={36} rx={6} fill="#FFF8E6" stroke="#C98A0B" strokeWidth={4} />
          <text x={0} y={7} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={19} letterSpacing={1.5} fill="#C98A0B">BEZ POTVRDE</text>
        </g>
      )}
      {sjaj > 0 && (
        <g transform={`translate(840,310) scale(${sjaj})`}>
          <circle r={56} fill={P.zelena500} stroke="#fff" strokeWidth={6} />
          <path d="M-24,0 l16,18 l34,-38" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {/* rukovanje */}
      <g transform={`translate(420,1180) rotate(${rukovanje * 10})`}>
        <Lik {...RADA} s={2.3} ruka={0.75} />
      </g>
      <g transform={`translate(660,1180) rotate(${-rukovanje * 10})`}>
        <Lik {...DEJAN} s={2.3} okrenut={-1} ruka={0.75} />
      </g>
      {/* sada može svuda */}
      {krug > 0 &&
        [P.crvena, P.zuta, P.plava, P.tirkiz].map((c, i) => {
          const a = ([-25, 25, 155, 205][i] * Math.PI) / 180;
          return (
            <g key={i} transform={`translate(${540 + Math.cos(a) * 440 * krug},${720 + Math.sin(a) * 300 * krug}) scale(${1.4 * krug})`}>
              <path d="M-40,0 L40,0 L32,-36 L-32,-36 Z" fill={c} stroke="#fff" strokeWidth={4} />
              <rect x={-30} y={0} width={60} height={30} fill="#D9965B" />
            </g>
          );
        })}
      <Natpis tekst="Nova članica. Još je niko nije potvrdio." y={1290} o={natpis} />
    </g>
  );
};
