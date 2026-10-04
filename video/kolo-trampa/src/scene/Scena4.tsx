// Scena 4 — „To je trampa. Razmena može da uspe samo ako oboje imaju ono što treba onom drugom. I to istovremeno.“
// Tabla obrisana. Na „trampa“ kredom se napiše TRAMPA. Milica i obućar licem u lice; iznad svakog pločica
// „ima“ i „treba“. Na „oboje … onom drugom“ strelice se ukrste: cipele obućara idu Milici (zelena kvačica),
// ajvar ne treba obućaru (crveni iks) — razmena ne uspeva. Na „istovremeno“ dva sata, kazaljke se poklope.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { RUKOPIS } from "../fontovi";
import { Kadar, Kreda, Nacrtaj, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { Lik, MILICA, OBUCAR } from "../likovi";
import { Tegla } from "../predmeti";
import { Cipela, Drva, Iks, Kvacica, Sat } from "../stvari";
import { kad } from "../vreme";
import { Pisi, Pod, Strelica } from "./zajednicko";

const Y = 1250;
const LX = 250;
const DX = 830;

/** Pločica „ima“ / „treba“ sa crtežom. */
const Plocica: React.FC<{ naslov: string; children: React.ReactNode }> = ({ naslov, children }) => (
  <g>
    <Oblik d={kutija(-150, -80, 300, 160, 14)} boja={P.tablaTamna} ivica={P.mastilo} debljina={5} tekstura={0} />
    <text x={-130} y={-22} fontFamily={RUKOPIS} fontWeight={700} fontSize={62} fill={P.mastilo}>
      {naslov}
    </text>
    <g transform="translate(78 50)">{children}</g>
  </g>
);

export const Scena4: React.FC = () => {
  const f = useF();
  const kTr = kad(4, "trampa.");
  const kRaz = kad(4, "Razmena");
  const kObo = kad(4, "oboje");
  const kTreba = kad(4, "treba");
  const kDru = kad(4, "drugom.");
  const kIst = kad(4, "istovremeno.");
  const sat = napredak(f, kIst - 10, 34, Easing.inOut(Easing.cubic));
  return (
    <Kadar>
      <Kreda>
        <Pisi tekst="TRAMPA" at={kTr - 4} x={540} y={250} velicina={150} brzina={0.45} podvuci sirina={520} />
        <Pod y={Y + 8} x0={60} x1={1020} />
        <Nacrtaj at={kRaz - 12} trajanje={14} x={0} y={600} w={1080} h={700} id="likovi">
          <Lik x={LX} y={Y} s={0.78} {...MILICA} glava={{ ...MILICA.glava, izraz: f > kDru + 12 ? "zamisljena" : "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={[-20, -30]} drziD={<Tegla vrsta="ajvar" s={0.7} />} />
          <Lik x={DX} y={Y} s={0.78} okreni {...OBUCAR} glava={{ ...OBUCAR.glava, izraz: f > kDru + 12 ? "zamisljena" : "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={[-20, -30]} drziD={<Cipela s={0.34} boja="#A0583A" nova />} />
        </Nacrtaj>
        {/* pločice: ima (gore) i treba (dole) */}
        <Pop at={kRaz} x={LX} y={430} skala={0.9}>
          <Plocica naslov="ima">
            <Tegla vrsta="ajvar" s={0.62} />
          </Plocica>
        </Pop>
        <Pop at={kRaz + 6} x={LX} y={610} skala={0.9}>
          <Plocica naslov="treba">
            <g transform="translate(0 -14)">
              <Cipela s={0.5} boja="#A0583A" nova />
            </g>
          </Plocica>
        </Pop>
        <Pop at={kRaz + 3} x={DX} y={430} skala={0.9}>
          <Plocica naslov="ima">
            <g transform="translate(0 -14)">
              <Cipela s={0.5} boja="#A0583A" nova />
            </g>
          </Plocica>
        </Pop>
        <Pop at={kRaz + 9} x={DX} y={610} skala={0.9}>
          <Plocica naslov="treba">
            <g transform="translate(0 6)">
              <Drva s={0.34} />
            </g>
          </Plocica>
        </Pop>
        {/* ukrštene strelice: šta ko ima ide onome kome treba */}
        {f >= kObo && <Strelica x1={DX - 140} y1={430} x2={LX + 140} y2={610} luk={-10} napredak={napredak(f, kObo, 14)} boja={P.zelenaKreda} />}
        {f >= kTreba && <Strelica x1={LX + 140} y1={430} x2={DX - 140} y2={610} luk={10} napredak={napredak(f, kTreba, 14)} boja={P.ajvar} />}
        {f >= kObo + 16 && (
          <Pop at={kObo + 16} x={LX + 120} y={700} skala={0.8}>
            <Kvacica napredak={napredak(f, kObo + 16, 8)} />
          </Pop>
        )}
        {f >= kDru && (
          <Pop at={kDru} x={DX - 120} y={705} skala={0.8}>
            <Iks napredak={napredak(f, kDru, 10)} />
          </Pop>
        )}
        {/* istovremeno: dva sata, kazaljke se poklope */}
        {f >= kIst - 12 && (
          <>
            <Pop at={kIst - 12} x={LX + 150} y={860} skala={0.8}>
              <Sat min={interpolate(sat, [0, 1], [100, 360])} sati={interpolate(sat, [0, 1], [200, 300])} />
            </Pop>
            <Pop at={kIst - 8} x={DX - 150} y={860} skala={0.8}>
              <Sat min={interpolate(sat, [0, 1], [250, 360])} sati={interpolate(sat, [0, 1], [40, 300])} />
            </Pop>
          </>
        )}
      </Kreda>
    </Kadar>
  );
};
