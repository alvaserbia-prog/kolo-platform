// Scena 1 — „Milica ima trideset tegli ajvara. A trebaju joj cipele.“
// Kuka: Milica pred policama; na „trideset“ tegle uskaču jedna za drugom dok se tri police ne napune
// (tačno trideset). Na „cipele“ kamera siđe do njenih nogu: stara cipela, rupa na vrhu, proviri palac.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, Kreda, Nacrtaj, Pop, napredak, useF } from "../alat";
import { Lik, MILICA } from "../likovi";
import { Tegla } from "../predmeti";
import { Cipela, Daska } from "../stvari";
import { kad } from "../vreme";
import { Pod } from "./zajednicko";

const MX = 300; // Milica
const MY = 1270;
const MS = 1.0;

export const Scena1: React.FC = () => {
  const f = useF();
  const kTri = kad(1, "trideset");
  const kAjv = kad(1, "ajvara.");
  const kCip = kad(1, "cipele.");
  const kTreb = kad(1, "trebaju");
  // tegle: 30 komada od „trideset“ do „ajvara“
  const korak = Math.max(1, (kAjv + 6 - kTri) / 30);
  const z = napredak(f, kTreb, 22, Easing.inOut(Easing.cubic));
  const kamX = interpolate(z, [0, 1], [540, MX + 30]);
  const kamY = interpolate(z, [0, 1], [960, MY - 30]);
  const kamZ = interpolate(z, [0, 1], [1, 3.1]);
  const palac = napredak(f, kCip, 10, Easing.out(Easing.back(2)));
  return (
    <Kadar>
      <Kamera x={kamX} y={kamY} z={kamZ}>
        <Kreda>
          <Pod y={MY + 10} />
          {[0, 1, 2].map((red) => (
            <g key={red}>
              <Nacrtaj at={-6 + red * 3} trajanje={14} x={540} y={420 + red * 280} w={520} h={80} id={`d${red}`}>
                <g transform={`translate(785 ${500 + red * 280})`}>
                  <Daska w={490} />
                </g>
              </Nacrtaj>
              {Array.from({ length: 10 }, (_, k) => {
                const i = red * 10 + k;
                return (
                  <Pop key={k} at={Math.round(kTri + i * korak)} x={570 + k * 47} y={500 + red * 280 - 6} skala={0.42}>
                    <Tegla vrsta="ajvar" />
                  </Pop>
                );
              })}
            </g>
          ))}
          <Lik x={MX} y={MY} s={MS} {...MILICA} glava={{ ...MILICA.glava, izraz: f > kCip ? "zamisljena" : "osmeh", pogled: f > kCip ? [0, 1] : [1, 0] }} lr={[14, 10]} dr={f > kAjv + 10 ? [4, 4] : [interpolate(napredak(f, kTri - 6, 10), [0, 1], [4, 75]), interpolate(napredak(f, kTri - 6, 10), [0, 1], [4, 10])]} />
          {/* stara cipela preko prednjeg stopala */}
          <g transform={`translate(${MX + 52 * MS} ${MY - 2})`}>
            <Cipela s={0.5 * MS} boja="#8A6A52" rupa palac={palac} />
          </g>
        </Kreda>
      </Kamera>
    </Kadar>
  );
};
