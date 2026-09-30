// Scena 1 — udica. Kuhinja, jesen. Milica drži teglu ajvara iznad kante i zastane.
// Na „bacila“ ruka zadrhti, na „prvi“ se podigne poklopac kante, na „teglu ajvara“ kamera
// priđe tegli (krupan plan). Naslov „Prvi put je bacila teglu ajvara.“ stoji od prvog frejma.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, Hrapavo, napredak, useF } from "../alat";
import { Kuhinja } from "../pozadine";
import { Kanta, Tegla } from "../predmeti";
import { Lik, MILICA } from "../likovi";
import { kad } from "../vreme";

export const Scena1: React.FC = () => {
  const f = useF();
  const kBacila = kad(1, "bacila");
  const kPrvi = kad(1, "prvi");
  const kTeglu = kad(1, "teglu");
  const drhtaj = f > kBacila - 6 ? Math.sin(f * 1.7) * 2.2 * napredak(f, kBacila - 6, 10) : 0;
  const poklopac = napredak(f, kPrvi - 4, 14, Easing.out(Easing.back(1.6)));
  const zum = napredak(f, kTeglu - 8, 40, Easing.inOut(Easing.cubic));
  const z = interpolate(f, [0, kTeglu], [1.32, 1.4], { extrapolateRight: "clamp" }) + zum * 0.6;
  const cx = interpolate(zum, [0, 1], [560, 780]);
  const cy = interpolate(zum, [0, 1], [1040, 900]);
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={cx} y={cy} z={z}>
          <Kuhinja sezona="jesen" policaTegle={3} />
          <g transform="translate(790 1300)">
            <Kanta s={1.2} otvor={poklopac} />
          </g>
          <Lik
            x={450}
            y={1310}
            s={1.1}
            {...MILICA}
            glava={{ ...MILICA.glava, izraz: "tuzna", pogled: [1, 0.6] }}
            glavaNagib={8}
            lr={[8, 18]}
            dr={[72 + drhtaj, 18]}
            drziD={
              <g transform="translate(0 124)">
                <Tegla vrsta="ajvar" natpis="ajvar" s={0.95} />
              </g>
            }
            drziDRot={0}
          />
        </Kamera>
      </Hrapavo>
    </Kadar>
  );
};
