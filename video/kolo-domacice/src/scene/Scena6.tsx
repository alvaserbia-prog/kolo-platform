// Scena 6 — preokret. Stara karta Sombora i okoline (Dunav, sela, putevi). Na „KOLU“ se pale
// zelene tačke i povezuju u mrežu; na „zimnica“ iznad Miličine tačke uskoči tegla.
// Na „Tu se nađe neko“ iz jedne tačke se otvori medaljon: komšija gleda praznu policu;
// na „prisetio“ se iznad njega pojavi oblačić sećanja — dečak, hleb sa ajvarom.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { NASLOV, SERIF } from "../fontovi";
import { Hrapavo, Kadar, Kamera, Linija, Oblik, Pop, elipsa, kutija, napredak, useF, usePop } from "../alat";
import { Tegla } from "../predmeti";
import { KOMSIJA, Lik, SIN } from "../likovi";
import { Secanje } from "./Scena2";
import { kad } from "../vreme";

const X = (lon: number) => 540 + (lon - 19.15) * 1394;
const Y = (lat: number) => 950 - (lat - 45.79) * 2000;

export const MESTA: [string, number, number][] = [
  ["Bezdan", 45.853, 18.938],
  ["Apatin", 45.671, 18.985],
  ["Stanišić", 45.938, 19.166],
  ["Riđica", 45.99, 19.103],
  ["Čonoplja", 45.807, 19.27],
  ["Kljajićevo", 45.772, 19.283],
  ["Telečka", 45.79, 19.43],
  ["Gakovo", 45.9, 19.063],
  ["Kolut", 45.897, 18.928],
  ["Bački Monoštor", 45.797, 18.937],
  ["Doroslovo", 45.607, 19.187],
  ["Svetozar Miletić", 45.849, 19.217],
  ["Aleksa Šantić", 45.935, 19.33],
  ["Prigrevica", 45.678, 19.09],
];
const SOMBOR: [number, number] = [X(19.112), Y(45.774)];
// tačke KOLA: sela + nekoliko u Somboru
const TACKE: [number, number][] = [
  ...MESTA.map(([, la, lo]): [number, number] => [X(lo), Y(la)]),
  [SOMBOR[0] - 34, SOMBOR[1] - 20],
  [SOMBOR[0] + 30, SOMBOR[1] - 36],
  [SOMBOR[0] + 44, SOMBOR[1] + 26],
  [SOMBOR[0] - 20, SOMBOR[1] + 40],
  [SOMBOR[0] + 6, SOMBOR[1] + 4],
];
const MILICA_T = 14; // indeks Miličine tačke
const KOMSIJA_T = 16; // tačka iz koje se otvara medaljon

const Karta: React.FC<{ f: number; crtanje: number }> = ({ f, crtanje }) => (
  <g>
    <rect x={-200} y={-200} width={1500} height={2400} fill="#EFE0B9" />
    {/* polja */}
    {[
      [200, 700, 160, 90, P.trava],
      [760, 640, 200, 110, P.oker],
      [380, 1150, 220, 100, P.trava],
      [860, 1120, 160, 120, P.tursija],
      [620, 820, 120, 70, P.oker],
      [300, 520, 140, 70, P.tursija],
    ].map(([x, y, w, h, c], i) => (
      <path key={i} d={elipsa(x as number, y as number, w as number, h as number)} fill={c as string} opacity={0.28} />
    ))}
    <rect x={-200} y={-200} width={1500} height={2400} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
    {/* Dunav */}
    <path d="M150,380 C190,520 120,640 170,760 C220,880 150,1000 200,1120 C240,1230 180,1330 230,1480" fill="none" stroke="#7FA6B5" strokeWidth={34} strokeLinecap="round" />
    <path d="M150,380 C190,520 120,640 170,760 C220,880 150,1000 200,1120 C240,1230 180,1330 230,1480" fill="none" stroke={P.mastilo} strokeWidth={2} strokeDasharray="2 10" opacity={0.5} />
    <text x={118} y={1060} fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={30} fill={P.plava} transform="rotate(-78 118 1060)">
      Dunav
    </text>
    {/* putevi iz Sombora */}
    {MESTA.map(([ime, la, lo], i) => (
      <Linija key={ime} d={`M${SOMBOR[0]},${SOMBOR[1]} Q${(SOMBOR[0] + X(lo)) / 2 + (i % 2 ? 20 : -20)},${(SOMBOR[1] + Y(la)) / 2} ${X(lo)},${Y(la)}`} boja={P.drvo} debljina={4} napredak={crtanje} opacity={0.7} />
    ))}
    {/* sela */}
    {MESTA.map(([ime, la, lo], i) => (
      <g key={ime} transform={`translate(${X(lo)} ${Y(la)})`} opacity={Math.min(1, Math.max(0, crtanje * 1.6 - i * 0.04))}>
        <path d="M-14,0 L-14,-18 L0,-30 L14,-18 L14,0Z" fill={P.zid} stroke={P.mastilo} strokeWidth={2.5} />
        <path d="M-18,-16 L0,-34 L18,-16" fill="none" stroke={P.crep} strokeWidth={5} />
        <text x={0} y={34} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={25} fill={P.mastilo}>
          {ime}
        </text>
      </g>
    ))}
    {/* Sombor */}
    <g transform={`translate(${SOMBOR[0]} ${SOMBOR[1]})`}>
      <Oblik d={elipsa(0, 0, 78, 60)} boja={P.zidZuti} opacity={0.55} ivica={P.mastilo} debljina={2.5} />
      <path d="M-10,-6 L-10,-62 L0,-86 L10,-62 L10,-6Z" fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
      <path d="M-30,-6 L-30,-34 L-16,-44 L-2,-34 L-2,-6Z" fill={P.zid} stroke={P.mastilo} strokeWidth={2.5} />
      <path d="M8,-6 L8,-30 L24,-40 L40,-30 L40,-6Z" fill={P.zid} stroke={P.mastilo} strokeWidth={2.5} />
      <text x={0} y={92} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={44} fill={P.mastilo} letterSpacing={3}>
        SOMBOR
      </text>
    </g>
    {/* ruža vetrova */}
    <g transform="translate(900 1300) rotate(8)" opacity={0.8}>
      <path d="M0,-70 L12,0 L0,70 L-12,0Z" fill={P.ajvar} stroke={P.mastilo} strokeWidth={2.5} />
      <path d="M-70,0 L0,-12 L70,0 L0,12Z" fill={P.krem} stroke={P.mastilo} strokeWidth={2.5} />
      <text y={-80} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} fill={P.mastilo}>
        S
      </text>
    </g>
    {/* kartuša karte */}
    <g transform="translate(540 330)" opacity={Math.min(1, crtanje * 1.5)}>
      <path d="M-250,-54 L250,-54 L280,0 L250,54 L-250,54 L-280,0Z" fill={P.krem} stroke={P.mastilo} strokeWidth={4} />
      <path d="M-236,-42 L236,-42 L262,0 L236,42 L-236,42 L-262,0Z" fill="none" stroke={P.vez} strokeWidth={2} strokeDasharray="8 5" />
      <text y={16} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={48} fill={P.mastilo}>
        Sombor i okolina
      </text>
    </g>
    <text x={540} y={f < 0 ? 0 : 0} />
  </g>
);

const Medaljon: React.FC<{ f: number; kPrisetio: number }> = ({ f, kPrisetio }) => {
  const oblacic = usePop(kPrisetio - 4, 140, 12);
  return (
    <g>
      <rect x={-400} y={-400} width={800} height={800} fill="#E6D2A8" />
      <rect x={-400} y={-400} width={800} height={800} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      <rect x={-400} y={160} width={800} height={300} fill={P.drvoSvetlo} />
      {/* prazna polica */}
      <g transform="translate(150 -60)">
        <Oblik d={kutija(-150, 0, 300, 20, 4)} boja={P.drvo} />
        <Oblik d={kutija(-150, 140, 300, 20, 4)} boja={P.drvo} />
        <Oblik d="M-140,0 L-140,300 L-120,300 L-120,0Z" boja={P.drvoTamno} debljina={3} />
        <Oblik d="M120,0 L120,300 L140,300 L140,0Z" boja={P.drvoTamno} debljina={3} />
        <path d="M-90,-4 L-40,-20 M40,136 L90,122" stroke={P.mastiloSvetlo} strokeWidth={2} opacity={0.5} />
      </g>
      <Lik x={-110} y={330} s={0.7} {...KOMSIJA} glava={{ ...KOMSIJA.glava, izraz: f > kPrisetio ? "osmeh" : "zamisljena", pogled: f > kPrisetio ? [0.3, -1] : [1, 0] }} dr={[160, 70]} lr={[10, 20]} glavaNagib={-6} />
      {f >= kPrisetio - 4 && (
        <g transform={`translate(-40 -250) scale(${oblacic})`}>
          <circle cx={-70} cy={150} r={10} fill={P.belo} stroke={P.mastilo} strokeWidth={3} />
          <circle cx={-50} cy={120} r={16} fill={P.belo} stroke={P.mastilo} strokeWidth={3} />
          <Oblik d="M-190,20 C-230,-40 -170,-110 -100,-100 C-70,-150 60,-150 90,-100 C160,-110 200,-40 170,20 C190,80 110,110 60,90 C20,120 -80,120 -110,90 C-170,110 -220,70 -190,20Z" boja={P.belo} debljina={4} tekstura={0.15} />
          <g>
            <Lik x={-50} y={115} s={0.3} {...SIN} glava={{ ...SIN.glava, izraz: "srecna" }} dr={[150, 30]} drziD={<g transform="scale(1.6)"><Oblik d={kutija(-30, -44, 60, 40, 12)} boja={P.oker} debljina={3} /><Oblik d={kutija(-26, -50, 52, 14, 6)} boja={P.ajvar} debljina={2} /></g>} />
            <g transform="translate(90 80)">
              <Tegla vrsta="ajvar" s={0.75} natpis="ajvar" />
            </g>
          </g>
          <g transform="translate(0 0)">
            <rect x={-230} y={-160} width={460} height={290} fill="#E9B26A" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
          </g>
        </g>
      )}
    </g>
  );
};

export const Scena6: React.FC = () => {
  const f = useF();
  const kKolu = kad(6, "KOLU");
  const kZimnica = kad(6, "zimnica");
  const kTu = kad(6, "Tu");
  const kPrisetio = kad(6, "prisetio");
  const crtanje = napredak(f, -10, 40, Easing.out(Easing.cubic));
  const med = napredak(f, kTu - 6, 22, Easing.inOut(Easing.cubic));
  const [tx, ty] = TACKE[KOMSIJA_T];
  const mcx = interpolate(med, [0, 1], [tx, 540]);
  const mcy = interpolate(med, [0, 1], [ty, 800]);
  const mr = interpolate(med, [0, 1], [8, 380]);
  const z = interpolate(f, [-20, kTu], [1.16, 1.24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={570} y={900} z={z}>
          <Karta f={f} crtanje={crtanje} />
        </Kamera>
      </Hrapavo>
      <Kamera x={570} y={900} z={z}>
        {/* mreža: tanke zelene linije između susednih tačaka */}
        {TACKE.map(([x, y], i) =>
          TACKE.slice(i + 1).map(([x2, y2], j) => {
            const d = Math.hypot(x2 - x, y2 - y);
            if (d > 260) return null;
            const p = napredak(f, kKolu + 6 + ((i + j) % 7) * 3, 16);
            return <line key={`${i}-${j}`} x1={x} y1={y} x2={x + (x2 - x) * p} y2={y + (y2 - y) * p} stroke={P.zelena500} strokeWidth={3} opacity={0.55} strokeDasharray="6 6" />;
          }),
        )}
        {TACKE.map(([x, y], i) => {
          const at = kKolu - 4 + ((i * 7) % 17) * 1.4;
          const puls = 1 + 0.15 * Math.sin((f - at) / 6 + i);
          return (
            <Pop key={i} at={at} x={x} y={y}>
              <circle r={30 * puls} fill={P.zelena500} opacity={0.22} />
              <circle r={14} fill={P.zelena500} stroke={P.zelena900} strokeWidth={3} />
              <circle r={5} fill="#fff" opacity={0.8} />
            </Pop>
          );
        })}
        <Pop at={kZimnica} x={TACKE[MILICA_T][0]} y={TACKE[MILICA_T][1] - 26}>
          <g transform="scale(0.5)">
            <Tegla vrsta="ajvar" />
          </g>
        </Pop>
      </Kamera>
      {med > 0 && (
        <g>
          <defs>
            <clipPath id="medaljon">
              <circle cx={mcx} cy={mcy} r={mr} />
            </clipPath>
          </defs>
          <circle cx={mcx} cy={mcy + 10} r={mr + 14} fill={P.senka} opacity={0.3} filter="url(#blur14)" />
          <g clipPath="url(#medaljon)">
            <g transform={`translate(${mcx} ${mcy}) scale(${Math.max(0.02, mr / 380)})`}>
              <Hrapavo lokalno>
                <Medaljon f={f} kPrisetio={kPrisetio} />
              </Hrapavo>
            </g>
          </g>
          <circle cx={mcx} cy={mcy} r={mr} fill="none" stroke={P.mastilo} strokeWidth={8} />
          <circle cx={mcx} cy={mcy} r={mr + 12} fill="none" stroke={P.zelena700} strokeWidth={5} strokeDasharray="14 8" />
        </g>
      )}
      <Secanje jacina={0.25} />
    </Kadar>
  );
};
