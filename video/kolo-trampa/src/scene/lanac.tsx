// Lanac potreba (scene 2 i 3): Milica sa teglom, obućar za tezgom, Stevan pored gomile drva.
// Ista slika služi obema scenama: scena 2 je kamera bliže levoj strani (Milica i obućar), scena 3 se
// odmakne i otkrije Stevana. Svaki događaj ima svoj frejm (undefined = još se nije desio).
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { Kamera, Kreda, Nacrtaj, Pop, napredak, useF } from "../alat";
import { Lik, MILICA, OBUCAR, STEVAN } from "../likovi";
import { Tegla, Kuca } from "../predmeti";
import { Cetka, Daska, Drva, Iks, Kofa, Oblacic, ParCipela, Tezga, Upitnik } from "../stvari";
import { Pod, Strelica } from "./zajednicko";

export const Y = 1150; // linija poda
const S = 0.7;
export const MX = 170;
export const OX = 540;
export const SX = 880;

export type Dogadjaji = {
  pruzi?: number; // Milica pruža teglu obućaru
  neO?: number; // obućar odmahne (iks preko tegle)
  oblDrva?: number; // oblačić obućara: drva
  str1?: number; // strelica Milica → obućar
  stevan?: number; // Stevan se nacrta
  str2?: number; // strelica obućar → Stevan
  pruziS?: number; // Milica pruža teglu Stevanu
  neS?: number; // Stevan odmahne
  oblKuca?: number; // oblačić Stevana: kuća, četka, kofa
  upitnik?: number;
};

const vrti = (f: number, od?: number) => (od !== undefined && f >= od && f < od + 24 ? Math.sin((f - od) / 2.2) * 9 * (1 - (f - od) / 24) : 0);

export const Lanac: React.FC<{ d: Dogadjaji; kam: { x: number; y: number; z: number } }> = ({ d, kam }) => {
  const f = useF();
  const ima = (t?: number) => t !== undefined && f >= t;
  // Milica pruža teglu (ka obućaru), pa je vrati posle odbijanja
  const pruzena = (od?: number, ne?: number) => (od === undefined ? 0 : napredak(f, od, 10) * (ne === undefined ? 1 : 1 - napredak(f, ne + 18, 12)));
  const p1 = pruzena(d.pruzi, d.neO);
  const p2 = pruzena(d.pruziS, d.neS);
  const p = Math.max(p1, p2);
  const ruka: [number, number] = [interpolate(p, [0, 1], [-20, 82]), interpolate(p, [0, 1], [-40, 0])];
  return (
    <Kamera x={kam.x} y={kam.y} z={kam.z}>
      <Kreda>
        <Pod y={Y + 8} x0={40} x1={1040} />
        {/* obućareva radnja: polica sa cipelama */}
        <g transform={`translate(${OX + 10} 610)`}>
          <Daska w={360} />
          {[-110, 0, 110].map((x, i) => (
            <g key={i} transform={`translate(${x} -8)`}>
              <ParCipela s={0.36} boja={["#A0583A", "#7E5A3C", "#B5713F"][i]} />
            </g>
          ))}
        </g>
        <Lik x={OX + 30} y={Y - 20} s={S} {...OBUCAR} okreni glava={{ ...OBUCAR.glava, izraz: ima(d.neO) && !ima(d.oblDrva) ? "zamisljena" : "osmeh", pogled: [1, 0] }} glavaNagib={vrti(f, d.neO)} lr={[10, 20]} dr={[20, 40]} />
        <g transform={`translate(${OX + 20} ${Y + 4})`}>
          <Tezga w={330} />
        </g>
        {/* Stevan i drva */}
        {ima(d.stevan) && (
          <Nacrtaj at={d.stevan!} trajanje={14} x={SX - 200} y={300} w={400} h={900} id="stevan">
            <g transform={`translate(${SX + 70} ${Y})`}>
              <Drva s={0.62} />
            </g>
            <Lik x={SX - 30} y={Y} s={S} {...STEVAN} okreni glava={{ ...STEVAN.glava, izraz: ima(d.oblKuca) ? "zamisljena" : "osmeh", pogled: [1, 0] }} glavaNagib={vrti(f, d.neS)} lr={[10, 10]} dr={[10, 20]} />
          </Nacrtaj>
        )}
        {/* Milica sa teglom */}
        <Lik x={MX} y={Y} s={S} {...MILICA} glava={{ ...MILICA.glava, izraz: ima(d.neO) ? "zamisljena" : "osmeh", pogled: [1, 0] }} lr={[12, 8]} dr={ruka} drziD={<Tegla vrsta="ajvar" s={0.75} />} />
        {ima(d.neO) && (
          <Pop at={d.neO!} x={MX + 190} y={Y - 470} skala={1}>
            <Iks s={0.9} napredak={napredak(f, d.neO!, 10)} />
          </Pop>
        )}
        {ima(d.neS) && (
          <Pop at={d.neS!} x={SX - 150} y={Y - 560} skala={1}>
            <Iks s={0.75} napredak={napredak(f, d.neS!, 10)} />
            <g transform="translate(0 70)">
              <Tegla vrsta="ajvar" s={0.5} />
            </g>
          </Pop>
        )}
        {/* oblačići potreba */}
        {ima(d.oblDrva) && (
          <Pop at={d.oblDrva!} x={OX + 60} y={410} skala={0.85}>
            <Oblacic w={280} h={190} rep="levo">
              <g transform="translate(0 70)">
                <Drva s={0.62} />
              </g>
            </Oblacic>
          </Pop>
        )}
        {ima(d.oblKuca) && (
          <Pop at={d.oblKuca!} x={SX - 60} y={410} skala={0.85}>
            <Oblacic w={300} h={200} rep="levo">
              <g transform="translate(-40 82)">
                <Kuca s={0.36} />
              </g>
              <g transform="translate(78 40)">
                <Cetka s={0.6} rot={-25} />
              </g>
              <g transform="translate(86 92)">
                <Kofa s={0.45} />
              </g>
            </Oblacic>
          </Pop>
        )}
        {/* lanac strelica: ko kome treba */}
        {ima(d.str1) && <Strelica x1={MX + 60} y1={Y - 640} x2={OX - 100} y2={Y - 690} luk={-90} napredak={napredak(f, d.str1!, 14)} />}
        {ima(d.str2) && <Strelica x1={OX + 120} y1={Y - 700} x2={SX - 120} y2={Y - 700} luk={-90} napredak={napredak(f, d.str2!, 14)} />}
        {ima(d.upitnik) && (
          <>
            <Strelica x1={SX + 80} y1={330} x2={SX + 110} y2={262} luk={-20} napredak={napredak(f, d.upitnik!, 10)} vrh={false} />
            <Pop at={d.upitnik! + 6} x={SX + 112} y={250} skala={0.75}>
              <Upitnik boja={P.oker} />
            </Pop>
          </>
        )}
      </Kreda>
    </Kamera>
  );
};

export const KAM2 = { x: 360, y: 950, z: 1.42 };
export const KAM3 = { x: 540, y: 960, z: 1 };
export const kamPrelaz = (t: number) => {
  const e = Easing.inOut(Easing.cubic)(t);
  return { x: KAM2.x + (KAM3.x - KAM2.x) * e, y: KAM2.y + (KAM3.y - KAM2.y) * e, z: KAM2.z + (KAM3.z - KAM2.z) * e };
};
