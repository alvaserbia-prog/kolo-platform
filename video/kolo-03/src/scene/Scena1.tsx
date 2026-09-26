// Scena 1 — „Nekada se u komšiluku znalo ko je kome pomogao."
// Ulica u somborskom selu: vojvođanske kuće i kapije, ograda; Jova i Stana se preko
// ograde pozdravljaju. Na „pomogao" između njih luk sa srcem i Stanino „Hvala, komšija!".
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, Pt, napredak, pravougaonik } from "../papir";
import { Drvo, Etiketa, Kuca, Oblak, Sunce } from "../likovi";
import { DefsNalepnica, Slika } from "../prica";
import { Govor, Kapija, Komsija, Ograda, Srce } from "../selo";
import { kad } from "../vreme";

export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const nekada = kad(1, "Nekada");
  const komsiluku = kad(1, "komšiluku");
  const znalo = kad(1, "znalo");
  const kome = kad(1, "kome");
  const pomogao = kad(1, "pomogao.");
  const zum = 1 + f * 0.0005;
  const Y = 930; // linija kuća

  const luk = napredak(f, kome - 2, 14);
  const a: Pt = [370, 850];
  const b: Pt = [715, 850];
  const lukPts: Pt[] = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    return [a[0] + (b[0] - a[0]) * t, a[1] - Math.sin(t * Math.PI) * 120];
  });

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <DefsNalepnica />
      <g transform={`translate(540 950) scale(${zum}) translate(-540 -950)`}>
        <Pop at={2} x={880} y={250} skala={0.72}>
          <Sunce seed="s1-sunce" />
        </Pop>
        <g transform={`translate(${f * 0.4} 0)`}>
          <Pop at={5} x={180} y={260} skala={0.62}>
            <Oblak seed="s1-ob1" />
          </Pop>
          <Pop at={9} x={590} y={200} skala={0.48}>
            <Oblak seed="s1-ob2" />
          </Pop>
        </g>
        {/* toranj seoske crkve u daljini */}
        <Pop at={6} x={540} y={Y - 150} skala={1}>
          <Slika ime="crkva-svetog-djordja" sirina={360} seed="s1-crk" />
        </Pop>
        <Pop at={nekada} x={540} y={420} rot={-3} njihanje={1.2}>
          <Etiketa seed="s1-nekad" tekst="Sombor, nekad" velicina={78} boja={P.zelena900} />
        </Pop>
        {/* travnjak */}
        <Pop at={0} x={540} y={Y + 40}>
          <Isecak pts={pravougaonik(-620, -40, 1240, 460)} boja={P.trava} seed="s1-trava" />
        </Pop>
        {/* ulica: kuća – kapija – kuća – kapija – kuća */}
        <Pop at={3} x={120} y={Y} skala={0.95}>
          <Kuca seed="s1-k1" fasada="#F4E4C4" krov={P.korala600} kapci={P.zelena700} />
        </Pop>
        <Pop at={7} x={335} y={Y} skala={0.92}>
          <Kapija seed="s1-kap1" />
        </Pop>
        <Pop at={11} x={560} y={Y} skala={0.95}>
          <Kuca seed="s1-k2" fasada={P.sunce} krov={P.korala} kapci={P.zelena700} />
        </Pop>
        <Pop at={15} x={775} y={Y} skala={0.92}>
          <Kapija seed="s1-kap2" boja="#7A5230" />
        </Pop>
        <Pop at={19} x={1000} y={Y} skala={0.95}>
          <Kuca seed="s1-k3" fasada="#D5E7F2" krov={P.korala600} kapci={P.nebo} />
        </Pop>
        <Pop at={21} x={-20} y={Y + 10} skala={0.7}>
          <Drvo seed="s1-d1" boja={P.zelena700} />
        </Pop>
        {/* komšije iza ograde */}
        <Pop at={komsiluku - 4} x={330} y={1010} skala={1.45}>
          <Komsija id="jova" seed="s1-jova" mase={znalo} strana={1} />
        </Pop>
        <Pop at={komsiluku + 2} x={760} y={1010} skala={1.45}>
          <Komsija id="stana" seed="s1-stana" mase={znalo + 4} strana={-1} />
        </Pop>
        <Pop at={0} x={0} y={1255}>
          <Ograda seed="s1-ograda" od={-20} do={1100} visina={150} />
        </Pop>
        {/* ko je kome pomogao */}
        {luk > 0 && <Crta pts={lukPts} seed="s1-luk" boja={P.zlatna600} debljina={8} napredak={luk} korak={24} isprekidana />}
        <Pop at={kome + 6} x={542} y={742} skala={0.9} njihanje={4}>
          <Srce seed="s1-srce" r={38} />
        </Pop>
        <Pop at={pomogao} x={800} y={690} rot={3} skala={0.9}>
          <Govor seed="s1-hvala" tekst="Hvala, komšija!" velicina={50} rep={-1} />
        </Pop>
      </g>
    </svg>
  );
};
