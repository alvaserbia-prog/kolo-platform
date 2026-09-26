// Scena 10 — poziv. „Znaš nešto da napraviš?“: uskaču četiri medaljona domaćih stvari.
// „Neko u tvom kraju baš to traži.“: ispod se pojavi red kuća sa zelenim tačkama i isprekidane
// niti ka medaljonima. „Pridruži se besplatno na ekolo.rs.“: znak KOLO, krupno ekolo.rs, dugme,
// a oko znaka zaigra kolo malih likova iz priče.
import React from "react";
import { Easing, interpolate, staticFile } from "remotion";
import { P } from "../paleta";
import { NASLOV, RUKOPIS, SANS } from "../fontovi";
import { Hrapavo, Kadar, Oblik, Pop, elipsa, kutija, napredak, useF, usePop } from "../alat";
import { Hleb, Kuca, Tegla } from "../predmeti";
import { CERKA, KOMSIJA, KOMSINICA, Lik, MILICA, MLADIC1, MLADIC2, MUZ, SIN } from "../likovi";
import { kad } from "../vreme";

const Pita: React.FC = () => (
  <g>
    <Oblik d={elipsa(0, 0, 90, 34)} boja="#D9A25A" />
    <Oblik d={elipsa(0, -10, 80, 26)} boja="#E8BD74" />
    {[-50, -20, 10, 40].map((x) => (
      <path key={x} d={`M${x},-30 L${x + 20},10`} stroke={P.drvo} strokeWidth={5} />
    ))}
    {[-50, -20, 10, 40].map((x) => (
      <path key={x} d={`M${x + 20},-30 L${x},10`} stroke={P.drvo} strokeWidth={5} />
    ))}
  </g>
);
const Carape: React.FC = () => (
  <g>
    {[-34, 34].map((x, i) => (
      <g key={x} transform={`translate(${x} 0) rotate(${i ? 8 : -8})`}>
        <Oblik d="M-24,-80 L24,-80 L24,10 C24,40 60,40 60,60 C60,80 0,82 -20,70 C-30,60 -24,40 -24,10Z" boja={i ? P.ajvar : P.plava} />
        <path d="M-24,-60 L24,-60 M-24,-40 L24,-40" stroke={P.krem} strokeWidth={6} />
      </g>
    ))}
  </g>
);
const Med: React.FC = () => (
  <g>
    <Tegla vrsta="sok" s={1} />
  </g>
);

const STVARI: { el: React.ReactNode; natpis: string }[] = [
  { el: <g transform="translate(0 60)"><Tegla vrsta="ajvar" natpis="ajvar" s={1.1} /></g>, natpis: "zimnica" },
  { el: <g transform="translate(0 10)"><Pita /></g>, natpis: "pita" },
  { el: <g transform="translate(-6 20)"><Carape /></g>, natpis: "čarape" },
  { el: <g transform="translate(0 30)"><Hleb /></g>, natpis: "hleb" },
];
const MESTA: [number, number][] = [
  [300, 640],
  [780, 640],
  [300, 1060],
  [780, 1060],
];

const KOLO_LIKOVI = [MILICA, KOMSIJA, MLADIC1, KOMSINICA, MUZ, CERKA, MLADIC2, SIN];

export const Scena10: React.FC = () => {
  const f = useF();
  const kZnas = kad(10, "Znaš");
  const kNeko = kad(10, "Neko");
  const kPridruzi = kad(10, "Pridruži");
  const kEkolo = kad(10, "ekolo.rs");
  const odlaze = napredak(f, kPridruzi - 10, 16, Easing.in(Easing.cubic));
  const kraj = napredak(f, kNeko - 6, 20);
  const znak = usePop(kPridruzi - 4, 120, 11);
  const adresa = usePop(kEkolo - 4, 160, 10);
  const dugme = usePop(kEkolo + 8, 160, 10);
  const kolo = usePop(kEkolo + 16, 90, 14);
  const ugao = (f - kEkolo) * 1.1;
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#EFE2C2" />
      <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
      {/* medaljoni domaćih stvari */}
      {odlaze < 1 && (
        <g opacity={1 - odlaze} transform={`translate(540 860) scale(${1 - odlaze * 0.3}) translate(-540 -860)`}>
          {STVARI.map((s, i) => {
            const [x, y] = MESTA[i];
            const yy = interpolate(kraj, [0, 1], [y, y - 120]);
            return (
              <Pop key={s.natpis} at={kZnas + i * 6} x={x} y={yy}>
                <Hrapavo lokalno>
                  <Oblik d={elipsa(0, 0, 190, 190)} boja={P.krem} debljina={6} />
                  <circle r={172} fill="none" stroke={P.vez} strokeWidth={4} strokeDasharray="12 8" />
                  <path d="M-120,196 C-40,230 40,230 120,196" fill="none" />
                  <g transform="translate(0 30) scale(1.45)">{s.el}</g>
                </Hrapavo>
                <text y={165} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={56} fill={P.mastilo}>
                  {s.natpis}
                </text>
              </Pop>
            );
          })}
          {/* kuće tvog kraja sa zelenim tačkama i nitima */}
          {kraj > 0 &&
            [140, 330, 540, 750, 940].map((x, i) => (
              <g key={x}>
                {[0, 1, 2, 3].map((j) => {
                  if ((i + j) % 2) return null;
                  const [mx, my] = MESTA[j];
                  const p = napredak(f, kNeko + i * 3, 16);
                  const ex = x + (mx - x) * p;
                  const ey = 1100 + (my - 120 + 190 - 1100) * p;
                  return <path key={j} d={`M${x},1100 Q${(x + ex) / 2},${(1100 + ey) / 2 - 60} ${ex},${ey}`} fill="none" stroke={P.zelena500} strokeWidth={4} strokeDasharray="8 8" opacity={0.7 * kraj} />;
                })}
                <Pop at={kNeko + i * 4} x={x} y={1260}>
                  <Hrapavo lokalno>
                    <Kuca s={0.34} zid={i % 2 ? P.zidZuti : P.zid} />
                  </Hrapavo>
                  <circle cy={-170} r={16} fill={P.zelena500} stroke={P.zelena900} strokeWidth={3} />
                </Pop>
              </g>
            ))}
        </g>
      )}
      {/* završnica: kolo oko znaka, ekolo.rs, dugme */}
      {f >= kPridruzi - 4 && (
        <g>
          {/* ruke u kolu: prsten na visini šaka */}
          <ellipse cx={540} cy={930 - 108} rx={300} ry={100} fill="none" stroke={P.mastilo} strokeWidth={16} opacity={kolo} />
          <ellipse cx={540} cy={930 - 108} rx={300} ry={100} fill="none" stroke={P.koza} strokeWidth={9} opacity={kolo} />
          {/* zadnja polovina kola */}
          {KOLO_LIKOVI.map((l, i) => {
            const a = ((ugao + (i * 360) / 8) * Math.PI) / 180;
            if (Math.sin(a) > 0) return null;
            return (
              <g key={i} opacity={kolo}>
                <Lik x={540 + Math.cos(a) * 300} y={930 + Math.sin(a) * 100} s={0.24 * (0.85 + 0.15 * (Math.sin(a) + 1) / 2)} {...l} lr={[-80, 0]} dr={[80, 0]} glava={{ ...l.glava, izraz: "srecna" }} hod={f / 4 + i} />
              </g>
            );
          })}
          <g transform={`translate(540 590) scale(${znak * 0.9}) rotate(${(1 - znak) * -20})`}>
            <defs>
              <clipPath id="znakClip">
                <rect x={-190} y={-190} width={380} height={380} rx={70} />
              </clipPath>
            </defs>
            <rect x={-196} y={-190} width={392} height={392} rx={74} fill={P.senka} opacity={0.3} filter="url(#blur14)" />
            <g clipPath="url(#znakClip)">
              <rect x={-190} y={-190} width={380} height={380} fill={P.zelena900} />
              <image href={staticFile("kolo-hero-logo.png")} x={-190} y={-199} width={380} height={398} />
            </g>
            <rect x={-190} y={-190} width={380} height={380} rx={70} fill="none" stroke={P.mastilo} strokeWidth={5} />
          </g>
          {KOLO_LIKOVI.map((l, i) => {
            const a = ((ugao + (i * 360) / 8) * Math.PI) / 180;
            if (Math.sin(a) <= 0) return null;
            return (
              <g key={i} opacity={kolo}>
                <Lik x={540 + Math.cos(a) * 300} y={930 + Math.sin(a) * 100} s={0.28 * (0.85 + 0.15 * (Math.sin(a) + 1) / 2)} {...l} lr={[-80, 0]} dr={[80, 0]} glava={{ ...l.glava, izraz: "srecna" }} hod={f / 4 + i} />
              </g>
            );
          })}
          {/* prednji luk prstena preko znaka */}
          <path d="M240,822 A300,100 0 0,0 840,822" fill="none" stroke={P.mastilo} strokeWidth={16} opacity={kolo} />
          <path d="M240,822 A300,100 0 0,0 840,822" fill="none" stroke={P.koza} strokeWidth={9} opacity={kolo} />
          <g transform={`translate(540 1150) scale(${adresa})`}>
            <text textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={150} fill={P.zelena700} letterSpacing={-2}>
              ekolo.rs
            </text>
          </g>
          <g transform={`translate(540 1262) scale(${dugme})`}>
            <rect x={-330} y={-58} width={660} height={116} rx={58} fill={P.zelena500} stroke={P.zelena900} strokeWidth={5} />
            <text y={20} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={54} fill="#fff">
              Pridruži se besplatno
            </text>
          </g>
        </g>
      )}
    </Kadar>
  );
};
