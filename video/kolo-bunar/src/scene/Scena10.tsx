// Sc. 10 — „Ovaj bunar kopamo zajedno. Pridruži nam se na ekolo.rs.“
// Sombor na horizontu (zvonik i Županija). Ljudi oko bunara u gradnji: kruna raste red po red,
// svako donosi svoj kamen. Na „Pridruži“ prizor se podiže i iznad njega se utiskuje znak KOLA,
// krupno ekolo.rs i dugme „Pridruži se“; na kraju iz bunara zasija zelena voda.
import React from "react";
import { Easing, staticFile } from "remotion";
import { Hrapavo, Kadar, Kamera, Linija, Povrs, Utisak, dah, elipsa, kutija, mesaj, napredak, useF } from "../alat";
import { P } from "../paleta";
import { Covek, Kamen, Nebo, Ravnica, Sunce, Topola } from "../motivi";
import { NASLOV, SANS } from "../fontovi";
import { kad } from "../vreme";

/** Sombor na horizontu: barokni zvonik i dugačka zgrada Županije sa kupolom. */
const Sombor: React.FC = () => (
  <g>
    <Povrs d="M60,0 L60,-70 L200,-70 L200,-96 L230,-110 L260,-96 L260,-70 L420,-70 L420,0 Z" boja={P.okerSvetli} srafura="srafRedak" srafuraOp={0.35} debljina={5} pomak={[3, 2]} />
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d={kutija(78 + i * 42, -56, 16, 26, 7)} fill={P.mastilo} />
    ))}
    <path d="M214,-110 Q230,-150 246,-110 Z" fill={P.mastilo} />
    <Povrs d="M600,0 L600,-150 L620,-170 L620,-230 L636,-250 L636,-290 L646,-300 L656,-290 L656,-250 L672,-230 L672,-170 L692,-150 L692,0 Z" boja={P.krem} srafura="srafRedak" srafuraOp={0.3} debljina={5} pomak={[3, 2]} />
    <path d="M628,-236 Q646,-272 664,-236 Z" fill={P.mastilo} />
    <Linija d="M646,-300 L646,-340 M636,-326 L656,-326" debljina={5} />
    <path d={kutija(634, -210, 24, 36, 12)} fill={P.mastilo} />
    <Povrs d="M692,0 L692,-80 L840,-80 L840,0 Z" boja={P.okerSvetli} srafura="srafRedak" srafuraOp={0.3} debljina={5} pomak={[3, 2]} />
    <Povrs d="M860,0 L860,-50 L960,-50 L960,0 Z M-20,0 L-20,-40 L50,-40 L50,0 Z" boja={P.krem} srafura="srafRedak" srafuraOp={0.3} debljina={5} pomak={[3, 2]} />
  </g>
);

const REDOVI = 4;

export const Scena10: React.FC = () => {
  const f = useF();
  const tOvaj = kad(10, "Ovaj");
  const tZaj = kad(10, "zajedno.");
  const tPri = kad(10, "Pridruži");
  const tEk = kad(10, "ekolo.rs.");
  // kruna bunara raste red po red između „Ovaj“ i „zajedno“ (+ malo posle)
  const red = (k: number) => napredak(f, tOvaj - 6 + k * ((tZaj - tOvaj + 14) / REDOVI), 10, Easing.out(Easing.back(1.8)));
  const podigni = napredak(f, tPri - 6, 22, Easing.inOut(Easing.cubic));
  const zelenaVoda = napredak(f, tZaj + 4, 20);
  return (
    <Kadar>
      <g transform={`translate(0 ${mesaj(0, 260, podigni)})`}>
        <Hrapavo>
          <Kamera x={540} y={1100} z={mesaj(1.0, 0.96, podigni)}>
            <Nebo od={120} do={1000} gustina={1} pomakX={f * 0.4} />
            <g transform="translate(820 560)">
              <Sunce r={80} />
            </g>
            <g transform="translate(40 1010)">
              <Sombor />
            </g>
            <g transform="translate(1000 1020)">
              <Topola s={0.5} />
            </g>
            <Ravnica y={1010} boja={P.trava} />
            {/* bunar u gradnji */}
            <g transform="translate(540 1330) scale(1.25)">
              <path d={elipsa(0, 6, 160, 20)} fill={P.mastilo} opacity={0.2} />
              <path d={elipsa(0, -8 - REDOVI * 26, 96, 24)} fill={P.mastilo} opacity={red(REDOVI - 1)} />
              <path d={elipsa(0, -6 - REDOVI * 26, 76, 16)} fill={P.zelena500} opacity={zelenaVoda} />
              <ellipse cx={0} cy={-6 - REDOVI * 26} rx={140} ry={60} fill="url(#zeleniSjaj)" opacity={zelenaVoda * (0.7 + 0.3 * dah(f, 30))} />
              {Array.from({ length: REDOVI }).map((_, k) => {
                const t = red(k);
                if (t <= 0) return null;
                return (
                  <g key={k} transform={`translate(0 ${-k * 26 - (1 - Math.min(1, t)) * 60})`} opacity={Math.min(1, t * 2)}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <Povrs
                        key={j}
                        d={kutija(-96 + j * 38.4 + (k % 2) * 12, -26, 36, 26, 5)}
                        boja={(j + k) % 3 === 0 ? P.kamenTamni : P.kamen}
                        srafura="srafD"
                        srafuraOp={0.35}
                        debljina={4}
                        pomak={[2, 2]}
                        mrlja={0.3}
                      />
                    ))}
                  </g>
                );
              })}
            </g>
            {/* ljudi iz Sombora */}
            {[
              { x: 190, y: 1440, tip: "m" as const, boja: P.zelena700, p: "lopata" as const, r: [30, -20] as [number, number], smer: 1 as const, at: tOvaj - 10 },
              { x: 330, y: 1560, tip: "z" as const, boja: P.rdja, p: "kamen" as const, r: [50, 0] as [number, number], smer: 1 as const, at: tOvaj - 4 },
              { x: 880, y: 1450, tip: "st" as const, boja: P.okerTamni, p: "lopata" as const, r: [30, -10] as [number, number], smer: -1 as const, at: tOvaj },
              { x: 740, y: 1580, tip: "d" as const, boja: P.oker, p: "kamen" as const, r: [60, -10] as [number, number], smer: -1 as const, at: kad(10, "kopamo") - 4 },
              { x: 610, y: 1650, tip: "sta" as const, boja: P.rdja, p: "korpa" as const, r: [20, 0] as [number, number], smer: -1 as const, at: kad(10, "kopamo") },
              { x: 450, y: 1680, tip: "z" as const, boja: P.zelena700, p: "kamen" as const, r: [55, 0] as [number, number], smer: 1 as const, at: tZaj - 6 },
            ].map((c, i) => {
              const t = napredak(f, c.at, 12, Easing.out(Easing.back(1.5)));
              if (t <= 0) return null;
              const radi = Math.max(0, dah(f, 26, i * 7)) * 18;
              return (
                <g key={i} transform={`translate(${c.x} ${c.y + (1 - t) * 40})`} opacity={Math.min(1, t * 2)}>
                  <Covek tip={c.tip} boja={c.boja} boja2={P.oker} smer={c.smer} ruke={[c.r[0] + radi, c.r[1]]} predmet={c.p} s={1.02} />
                </g>
              );
            })}
            <g transform="translate(950 1700)">
              <Kamen s={1.2} />
            </g>
            <g transform="translate(120 1760)">
              <Kamen s={1} rot={20} boja={P.kamenTamni} />
            </g>
          </Kamera>
        </Hrapavo>
      </g>
      {/* završna kartica */}
      {podigni > 0 && <rect x={0} y={0} width={1080} height={1920} fill={P.papir} opacity={0.3 * podigni} />}
      <Utisak at={tPri - 6} x={540} y={800}>
        <g filter="url(#senkaMeka)">
          <path d={kutija(-420, -410, 840, 740, 24)} fill={P.mastilo} />
          <path d={kutija(-406, -396, 812, 712, 16)} fill={P.belo} />
          <path d={kutija(-386, -376, 772, 672, 10)} fill="none" stroke={P.mastilo} strokeWidth={2.5} opacity={0.5} />
        </g>
      </Utisak>
      <Utisak at={tPri - 2} x={540} y={620}>
        <g filter="url(#senkaMeka)">
          <path d={kutija(-170, -178, 340, 356, 40)} fill={P.zelena900} stroke={P.mastilo} strokeWidth={6} />
          <image href={staticFile("kolo-hero-logo.png")} x={-150} y={-157} width={300} height={314} />
        </g>
      </Utisak>
      <Utisak at={tEk - 4} x={540} y={930}>
        <text textAnchor="middle" y={0} fontFamily={SANS} fontWeight={900} fontSize={150} fill={P.mastilo} opacity={0.25} transform="translate(6 6)">
          ekolo.rs
        </text>
        <text textAnchor="middle" y={0} fontFamily={SANS} fontWeight={900} fontSize={150} fill={P.zelena700}>
          ekolo.rs
        </text>
      </Utisak>
      <Utisak at={tEk + 10} x={540} y={1060}>
        <g filter="url(#senkaMeka)">
          <path d={kutija(-230, -52, 460, 104, 52)} fill={P.zelena500} stroke={P.mastilo} strokeWidth={6} />
          <text textAnchor="middle" y={18} fontFamily={NASLOV} fontWeight={900} fontSize={54} fill={P.belo}>
            Pridruži se
          </text>
        </g>
      </Utisak>
    </Kadar>
  );
};
