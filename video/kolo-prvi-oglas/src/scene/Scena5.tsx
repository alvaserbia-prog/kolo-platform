// Scena 5 — „Tvoj oglas vide ljudi iz tvog kraja. Neko od njih se javi i obavite razmenu.
// Kad te upozna, može da te potvrdi. Sa prvom potvrdom postaješ redovan član i sam možeš
// da se javljaš na tuđe oglase."
// A: papirna mapa kraja, oglas na čiodi, komšije ga gledaju (isprekidani pogledi), „tvoj kraj".
// B: mapa se povuče; Milan se javi, tegla pređe kod njega, zapis prepisa. Upoznaju se (srce),
//    Milan potvrdi „ti" (zelena kvačica), oznaka „nov član" postaje „redovan član".
// C: gore iskoče tuđi oglasi, „ti" se javlja na njih.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, Pt, krugTacke, napredak, pravougaonik } from "../papir";
import { Drvo, Etiketa, Kljuc, Kuca, Osoba, Pita } from "../likovi";
import { DefsNalepnica, Iskre, LIKOVI, LikId, Slika, Tegla } from "../prica";
import { Govor, Srce } from "../selo";
import { Cioda, Kvacica, OglasKartica, TiLik } from "../ekran";
import { RUKOPIS } from "../fontovi";
import { kad } from "../vreme";
import { TiOznaka } from "./Scena2";

const OGLAS: Pt = [540, 680];
const GLEDAOCI: { id: LikId; x: number; y: number }[] = [
  { id: "milan", x: 240, y: 470 },
  { id: "lazar", x: 850, y: 560 },
  { id: "marija", x: 230, y: 960 },
  { id: "ana", x: 840, y: 1010 },
];
const KUCE: { x: number; y: number; fasada: string; krov: string }[] = [
  { x: 170, y: 330, fasada: "#F4E4C4", krov: P.korala600 },
  { x: 420, y: 330, fasada: "#D5E7F2", krov: P.korala },
  { x: 180, y: 780, fasada: P.sunce, krov: P.korala600 },
  { x: 900, y: 820, fasada: "#F8DCE6", krov: P.korala },
  { x: 430, y: 1130, fasada: "#E6F0D8", krov: P.korala600 },
  { x: 680, y: 1130, fasada: "#F4E4C4", krov: P.korala },
];

const Mapa: React.FC = () => (
  <g>
    <Isecak pts={pravougaonik(50, 170, 980, 1090)} boja="#E2ECCB" seed="s5-mapa" amp={3} korak={40} />
    {/* ulice */}
    {[
      [[50, 600], [400, 580], [700, 620], [1030, 600]],
      [[560, 170], [540, 500], [560, 900], [540, 1260]],
      [[50, 1010], [330, 980], [760, 1000], [1030, 970]],
      [[300, 170], [320, 600]],
      [[780, 620], [800, 1000]],
    ].map((put, i) => (
      <g key={i}>
        <Crta pts={put as Pt[]} seed={`s5-ul${i}`} boja="#CFC4A8" debljina={58} amp={1.2} korak={40} />
        <Crta pts={put as Pt[]} seed={`s5-ulb${i}`} boja="#F7EEDC" debljina={46} amp={1.2} korak={40} />
      </g>
    ))}
    {KUCE.map((k, i) => (
      <g key={i} transform={`translate(${k.x} ${k.y}) scale(0.42)`}>
        <Kuca seed={`s5-k${i}`} fasada={k.fasada} krov={k.krov} kapci={P.zelena700} />
      </g>
    ))}
    {[[680, 310], [960, 300], [100, 1180], [960, 1180]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(0.5)`}>
        <Drvo seed={`s5-d${i}`} boja={i % 2 ? P.zelena500 : P.trava} />
      </g>
    ))}
    <g transform="translate(850 470)">
      <Slika ime="zupanija" sirina={300} seed="s5-zup" />
    </g>
  </g>
);

export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const vide = kad(5, "vide");
  const kraja = kad(5, "kraja.");
  const neko = kad(5, "Neko");
  const javi = kad(5, "javi");
  const obavite = kad(5, "obavite");
  const razmenu = kad(5, "razmenu.");
  const upozna = kad(5, "upozna,");
  const moze = kad(5, "može");
  const potvrdi = kad(5, "potvrdi.");
  const redovan = kad(5, "redovan");
  const javljas = kad(5, "javljaš");
  const tudje = kad(5, "tuđe");

  const mapaOde = napredak(f, neko - 4, 16, Easing.inOut(Easing.cubic));
  const blizu = napredak(f, upozna - 10, 16, Easing.inOut(Easing.cubic));
  const tiX = 320 + blizu * 70;
  const miX = 780 - blizu * 70;
  const Y = 960;
  const tegla = napredak(f, obavite - 2, 26, Easing.inOut(Easing.cubic));
  const potvrda = napredak(f, moze - 2, potvrdi - moze + 8, Easing.inOut(Easing.cubic));
  const milanOde = napredak(f, javljas - 16, 16, Easing.in(Easing.cubic));

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <DefsNalepnica />

      {/* A: mapa kraja */}
      <g opacity={1 - mapaOde * 0.78} transform={`translate(540 700) scale(${1 - mapaOde * 0.08}) translate(-540 -700)`}>
        <Pop at={-10} x={0} y={0}>
          <Mapa />
        </Pop>
        {/* pogledi ka oglasu */}
        {GLEDAOCI.map((g, i) => (
          <Crta
            key={`v${i}`}
            pts={[[g.x, g.y - 60], [(g.x + OGLAS[0]) / 2, (g.y + OGLAS[1]) / 2 - 60], OGLAS]}
            seed={`s5-pog${i}`}
            boja={P.zlatna600}
            debljina={7}
            napredak={napredak(f, vide + 4 + i * 4, 14)}
            isprekidana
          />
        ))}
        {GLEDAOCI.map((g, i) => (
          <Pop key={g.id} at={vide - 4 + i * 4} x={g.x} y={g.y} skala={0.72} njihanje={2} faza={i}>
            <Osoba seed={`s5-g${g.id}`} boja={LIKOVI[g.id].boja} glava={LIKOVI[g.id].glava} />
          </Pop>
        ))}
        <Pop at={2} x={OGLAS[0]} y={OGLAS[1]} skala={0.7} rot={-3}>
          <OglasKartica seed="s5-oglas" />
          <g transform="translate(0 -232)">
            <Cioda seed="s5-cioda" />
          </g>
        </Pop>
        {/* tvoj kraj */}
        <Crta pts={[...krugTacke(540, 720, 470, 30, 520), krugTacke(540, 720, 470, 30, 520)[0]]} seed="s5-kraj" boja={P.zelena700} debljina={8} napredak={napredak(f, kraja - 14, 22)} isprekidana />
        <Pop at={kraja - 2} x={540} y={215} rot={-2}>
          <Etiketa seed="s5-tk" tekst="tvoj kraj" velicina={70} boja={P.belo} pozadina={P.zelena700} />
        </Pop>
      </g>

      {/* C: tuđi oglasi */}
      <Pop at={tudje - 6} x={300} y={450} skala={0.62} rot={-4} njihanje={1.5}>
        <OglasKartica seed="s5-t1" naslov="Popravke" iznos="po dogovoru" slika={<Kljuc seed="s5-t1k" />} pozadinaSlike="#E4EEF4" />
      </Pop>
      <Pop at={tudje - 2} x={780} y={450} skala={0.62} rot={4} njihanje={1.5} faza={2}>
        <OglasKartica seed="s5-t2" naslov="Burek" iznos="po dogovoru" slika={<g transform="scale(0.8)"><Pita seed="s5-t2p" /></g>} pozadinaSlike="#FCE7D2" />
      </Pop>
      {[300, 780].map((x, i) => (
        <Crta
          key={i}
          pts={[[tiX + (i ? 60 : -20), Y - 170], [(tiX + x) / 2, 700], [x, 630]]}
          seed={`s5-jav${i}`}
          boja={P.zelena700}
          debljina={8}
          napredak={napredak(f, tudje + 2 + i * 5, 14)}
          isprekidana
        />
      ))}

      {/* B: razmena i potvrda */}
      {mapaOde > 0 && (
        <g>
          <g transform={`translate(${miX + milanOde * 700} ${Y})`}>
            <Pop at={neko} x={0} y={0} skala={1.45}>
              <Osoba seed="s5-milan" boja={LIKOVI.milan.boja} glava={LIKOVI.milan.glava} />
              <g transform="translate(0 150) rotate(3)">
                <Etiketa seed="s5-mi-e" tekst="Milan" velicina={42} />
              </g>
            </Pop>
            {f >= javi - 2 && f < obavite + 30 && (
              <Pop at={javi - 2} x={-30} y={-300} skala={1}>
                <Govor seed="s5-gov" tekst="Javljam se za med!" velicina={46} rep={1} />
              </Pop>
            )}
          </g>
          <g transform={`translate(${tiX} ${Y})`}>
            <Pop at={neko + 3} x={0} y={0} skala={1.45}>
              <TiLik seed="s5-ti" popuna={1} />
              <g transform="scale(0.69)">{f < redovan ? <TiOznaka seed="s5-nov" tekst="nov član" /> : null}</g>
            </Pop>
            {f >= redovan && (
              <g transform="scale(1)">
                <Pop at={redovan} x={0} y={0} rot={-2}>
                  <g transform="translate(0 175)">
                    <Etiketa seed="s5-red" tekst="redovan član" velicina={50} boja={P.belo} pozadina={P.zelena700} />
                  </g>
                </Pop>
              </g>
            )}
            {f >= redovan && f < redovan + 32 && <Iskre seed="s5-isk" x={0} y={175} t={napredak(f, redovan, 30)} r={220} n={10} />}
            {f >= javljas - 4 && (
              <Pop at={javljas - 4} x={40} y={-300} skala={1}>
                <Govor seed="s5-gov2" tekst="Javljam se!" velicina={48} rep={-1} />
              </Pop>
            )}
          </g>
          {/* tegla prelazi od „ti" kod Milana */}
          {tegla > 0 && tegla < 1 && (
            <g transform={`translate(${interpolate(tegla, [0, 1], [tiX + 110, miX - 110])} ${Y + 50 - Math.sin(tegla * Math.PI) * 240}) scale(0.7) rotate(${tegla * 360})`}>
              <Tegla seed="s5-tegla" />
            </g>
          )}
          {tegla >= 1 && milanOde < 1 && (
            <g transform={`translate(${miX - 110 + milanOde * 700} ${Y + 50}) scale(0.7)`}>
              <Tegla seed="s5-tegla" />
            </g>
          )}
          {/* zapis prepisa */}
          <Pop at={razmenu + 4} x={540} y={560} rot={-2} skala={1}>
            {f < moze - 4 && (
              <g>
                <Isecak pts={pravougaonik(-270, -56, 540, 112)} boja={P.belo} seed="s5-zap" amp={1.4} />
                <text x={-246} y={18} fontFamily={RUKOPIS} fontWeight={700} fontSize={52} fill={P.tekst}>
                  Milan → Ti ·
                </text>
                <text x={20} y={18} fontFamily={RUKOPIS} fontWeight={700} fontSize={52} fill={P.zelena700}>
                  500 POENA
                </text>
              </g>
            )}
          </Pop>
          {/* upoznali su se */}
          <Pop at={upozna} x={540} y={Y - 170} skala={1.1} njihanje={3}>
            {f < javljas - 16 && <Srce seed="s5-srce" r={46} />}
          </Pop>
          {/* potvrda: zelena kvačica leti od Milana do „ti" */}
          {potvrda > 0 && f < javljas - 12 && (
            <g transform={`translate(${interpolate(potvrda, [0, 1], [miX, tiX])} ${Y - 250 - Math.sin(potvrda * Math.PI) * 160})`}>
              <Isecak pts={krugTacke(0, 0, 52, 16)} boja={P.zelena500} seed="s5-pk" amp={1.4} />
              <g transform="scale(1.2)">
                <Kvacica seed="s5-pkv" t={1} boja={P.belo} />
              </g>
            </g>
          )}
          {f >= potvrdi + 6 && f < javljas - 12 && (
            <Pop at={potvrdi + 6} x={tiX} y={Y - 350} rot={-6}>
              <Etiketa seed="s5-pot" tekst="potvrda" velicina={50} boja={P.zelena900} pozadina={P.zlatna400} />
            </Pop>
          )}
        </g>
      )}
    </svg>
  );
};
