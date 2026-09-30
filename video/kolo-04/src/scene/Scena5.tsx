// Scena 5 — „I tako se četvoro ljudi koji se nisu poznavali uhvatilo u isto kolo.
// Jer POEN nije novac. To je zapis o tome šta je ko dao svojoj zajednici."
// Veze iz prethodnih scena se iscrtaju, likovi se uhvate u kolo, oko njih zapisi,
// a kamera se odmakne i pokaže ceo grad.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Pop, Pt, napredak } from "../papir";
import { Drvo, Kuca } from "../likovi";
import { Kolo } from "../kolo";
import { DefsNalepnica, LIKOVI, Lik, LikId, OSOBE_KOLA, Precrtano, Slika, Veza, Zapis } from "../prica";
import { kad } from "../vreme";

const MESTA: Record<LikId, Pt> = { milan: [250, 640], ana: [830, 640], lazar: [830, 1060], marija: [250, 1060] };
const VEZE: [LikId, LikId][] = [
  ["milan", "ana"],
  ["ana", "lazar"],
  ["lazar", "marija"],
  ["marija", "ana"],
];
const ZAPISI: { od: LikId; ka: LikId; iznos: string; x: number; y: number; rot: number }[] = [
  { od: "milan", ka: "ana", iznos: "5.000", x: 190, y: 620, rot: -8 },
  { od: "ana", ka: "lazar", iznos: "4.000", x: 890, y: 610, rot: 7 },
  { od: "lazar", ka: "marija", iznos: "1.000", x: 180, y: 1190, rot: 6 },
  { od: "marija", ka: "ana", iznos: "1.000", x: 900, y: 1200, rot: -6 },
];
const CX = 540;
const CY = 930;
const FASADE = [P.sunce, "#CFE3C0", P.narandza, "#F7DCC8", "#E8DDF3", "#D5E7F2", "#F6E7C8"];

export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const tako = kad(5, "tako");
  const uhvatilo = kad(5, "uhvatilo");
  const kolo = kad(5, "kolo.");
  const poen = kad(5, "POEN");
  const novac = kad(5, "novac.");
  const zapis = kad(5, "zapis");
  const tome = kad(5, "tome");
  const sta = kad(5, "šta");
  const dao = kad(5, "dao");
  const svojoj = kad(5, "svojoj");

  const prelaz = napredak(f, uhvatilo - 4, 12);
  const zum = interpolate(napredak(f, svojoj - 10, 40, Easing.inOut(Easing.cubic)), [0, 1], [1, 0.62]);
  const R = interpolate(napredak(f, kolo - 6, 22), [0, 1], [0, 1]);
  const zapisPoz = [zapis, tome, sta, dao];

  const kuce: { x: number; y: number; i: number }[] = [];
  for (let i = 0; i < 7; i++) kuce.push({ x: -250 + i * 260, y: 1620, i });
  for (let i = 0; i < 3; i++) kuce.push({ x: -250 + i * 250, y: 330, i: i + 7 });
  for (let i = 0; i < 3; i++) kuce.push({ x: 830 + i * 250, y: 330, i: i + 10 });

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <DefsNalepnica />
      <g transform={`translate(${CX} ${CY}) scale(${zum}) translate(${-CX} ${-CY})`}>
        {/* grad oko kola — ulazi u kadar kad se kamera odmakne */}
        {kuce.map((k) => (
          <Pop key={k.i} at={svojoj - 6 + k.i * 1.5} x={k.x} y={k.y} skala={0.8}>
            {k.i % 4 === 3 ? (
              <Drvo seed={`s5-d${k.i}`} boja={k.i % 2 ? P.trava : P.zelena500} />
            ) : (
              <Kuca seed={`s5-k${k.i}`} fasada={FASADE[k.i % FASADE.length]} krov={k.i % 2 ? P.korala : P.korala600} kapci={k.i % 3 ? P.zelena700 : P.nebo} />
            )}
          </Pop>
        ))}
        <Pop at={svojoj - 2} x={-200} y={1060} skala={1}>
          <Slika ime="trg-svetog-trojstva" sirina={480} seed="s5-trg" />
        </Pop>
        <Pop at={svojoj + 2} x={1290} y={1060} skala={1}>
          <Slika ime="crkva-svetog-djordja" sirina={470} seed="s5-crk" />
        </Pop>
        {/* Županija iza kola */}
        <Pop at={kolo - 4} x={CX} y={560} skala={1}>
          <Slika ime="zupanija" sirina={560} seed="s5-zup" />
        </Pop>

        {/* zlatno kolo na podu */}
        {R > 0 &&
          [P.zlatna400, P.zelena700].map((b, k) => (
            <Crta
              key={k}
              pts={Array.from({ length: 49 }, (_, i): Pt => [CX + Math.cos((i / 48) * Math.PI * 2) * 330, CY + 60 + Math.sin((i / 48) * Math.PI * 2) * 135])}
              seed={`s5-kr${k}`}
              boja={b}
              debljina={k ? 8 : 18}
              napredak={R}
              korak={40}
              amp={3}
            />
          ))}

        {/* pre kola: četvoro na razmaku, veze se iscrtavaju */}
        {prelaz < 1 && (
          <g opacity={1 - prelaz}>
            {VEZE.map(([a, b], i) => (
              <Veza key={i} a={[MESTA[a][0], MESTA[a][1] - 60]} b={[MESTA[b][0], MESTA[b][1] - 60]} seed={`s5-v${i}`} napredak={napredak(f, tako + i * 8, 14)} debljina={10} />
            ))}
            {(Object.keys(MESTA) as LikId[]).map((id, i) => (
              <Pop key={id} at={i * 2} x={MESTA[id][0]} y={MESTA[id][1]} skala={1.15 * (1 - 0.3 * prelaz)}>
                <Lik id={id} seed={`s5-${id}`} />
              </Pop>
            ))}
          </g>
        )}
        {/* kolo: ista četiri lika drže se za ruke i igraju */}
        {prelaz > 0 && (
          <g opacity={prelaz}>
            <Kolo
              seed="s5-kolo"
              geo={{ cx: CX, cy: CY + 60, rx: 240, ry: 90, ugao: 30 + (f - uhvatilo) * 1.4, skala: 1.35, n: 4 }}
              pojava={[uhvatilo - 4, uhvatilo - 2, uhvatilo, uhvatilo + 2]}
              ruke={uhvatilo + 8}
              osobe={OSOBE_KOLA}
            />
          </g>
        )}

        {/* „POEN nije novac" */}
        {f >= poen - 2 && f < zapis + 6 && (
          <g opacity={1 - napredak(f, zapis - 4, 10)}>
            <Pop at={poen - 2} x={CX} y={1262} rot={-4}>
              <Precrtano seed="s5-novac" tekst="novac" precrtaj={napredak(f, novac - 2, 10)} velicina={84} />
            </Pop>
          </g>
        )}
        {/* „to je zapis o tome šta je ko dao" — četiri zapisa iz priče */}
        {ZAPISI.map((z, i) => (
          <Pop key={i} at={zapisPoz[i] - 2} x={z.x} y={z.y} rot={z.rot} skala={0.55} njihanje={1.5} faza={i}>
            <Zapis seed={`s5-z${i}`} od={LIKOVI[z.od].ime} ka={LIKOVI[z.ka].ime} iznos={z.iznos} zig={1} />
          </Pop>
        ))}
      </g>
    </svg>
  );
};
