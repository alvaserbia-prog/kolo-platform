// Scena 6 — „Prvi način je da se dogovore oko jednog sredstva koje će svako primiti. Nekada je to bilo žito,
// so ili školjke, a kasnije zlato i novac.“
// Prvi način na celoj tabli: „1.“ gore levo. Troje ljudi se dogovara; na „primiti“ iznad svakog kvačica.
// Na svaku izgovorenu reč na liniji vremena uskoči crtež: džak žita, kocka soli, niska školjki, zlatnik, novčanica.
import React from "react";
import { Kadar, Kreda, Pop, napredak, useF } from "../alat";
import { Lik, MILICA, OBUCAR, STEVAN } from "../likovi";
import { Kvacica } from "../stvari";
import { kad } from "../vreme";
import { LinijaVremena, Pisi, Pod } from "./zajednicko";

const Y = 1260;
const LJUDI = [
  { p: MILICA, x: 250, okreni: false },
  { p: OBUCAR, x: 540, okreni: false },
  { p: STEVAN, x: 830, okreni: true },
];

export const Scena6: React.FC = () => {
  const f = useF();
  const kDog = kad(6, "dogovore");
  const kSre = kad(6, "sredstva");
  const kPri = kad(6, "primiti.");
  const kNek = kad(6, "Nekada");
  return (
    <Kadar>
      <Kreda>
        <Pisi tekst="1." at={-30} x={130} y={300} velicina={150} brzina={1} />
        <LinijaVremena at={{ linija: kSre - 6, nekad: kNek - 4, kasnije: kad(6, "kasnije"), stvari: [kad(6, "žito,"), kad(6, "so"), kad(6, "školjke,"), kad(6, "zlato"), kad(6, "novac.")] }} />
        <Pod y={Y + 8} x0={60} x1={1020} />
        {LJUDI.map((l, i) => {
          // na „dogovore“ okreću glavu jedni ka drugima; na „primiti“ klimnu
          const klim = f >= kPri && f < kPri + 24 ? Math.sin(((f - kPri) / 24) * Math.PI * 2) * 8 : 0;
          return (
            <Lik
              key={i}
              x={l.x}
              y={Y}
              s={0.6}
              okreni={l.okreni}
              {...l.p}
              glava={{ ...l.p.glava, izraz: "osmeh", pogled: f > kDog ? [i === 0 ? 1 : i === 2 ? 1 : 0, 0] : [0, 0] }}
              glavaNagib={klim}
              lr={[10, 10]}
              dr={f > kSre && f < kPri + 30 ? [70, 30] : [-10, -10]}
            />
          );
        })}
        {LJUDI.map((l, i) =>
          f >= kPri + i * 3 ? (
            <Pop key={i} at={kPri + i * 3} x={l.x} y={Y - 470} skala={0.8}>
              <Kvacica napredak={napredak(f, kPri + i * 3, 8)} />
            </Pop>
          ) : null,
        )}
      </Kreda>
    </Kadar>
  );
};
