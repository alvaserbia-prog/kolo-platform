// Sc. 9 — „Ali i dalje imamo pravo da se udružimo. KOLO je jedan takav bunar, mesto gde
// razmenjujemo i pomažemo jedni drugima, gde sve što uradimo ostaje zapisano, kao svedočanstvo
// da smo već nešto dali.“
// Zora, boje se vraćaju: ljudi se hvataju za ruke i igraju kolo oko bunara. Na „bunar“ kamera
// uranja u vodu bunara, a iz nje izranja telefon sa KOLOM: ponude se razmenjuju, pa se sve
// upisuje u zapis; na „svedočanstvo“ jedan red dobija zeleni pečat ZAPISANO.
import React from "react";
import { Easing, interpolate, staticFile } from "remotion";
import { Hrapavo, Kadar, Kamera, Linija, Povrs, Utisak, dah, elipsa, kutija, mesaj, napredak, useF } from "../alat";
import { P } from "../paleta";
import { Bunar, Covek, Nebo, Ravnica, Sunce, Topola } from "../motivi";
import { NASLOV, SANS, SERIF } from "../fontovi";
import { kad } from "../vreme";
import type { Tip } from "../motivi";

const KOLO_LJUDI: { tip: Tip; boja: string; boja2: string }[] = [
  { tip: "z", boja: P.rdja, boja2: P.oker },
  { tip: "m", boja: P.zelena700, boja2: P.oker },
  { tip: "sta", boja: P.mastiloMeko, boja2: P.okerTamni },
  { tip: "d", boja: P.oker, boja2: P.rdja },
  { tip: "st", boja: P.rdja, boja2: P.oker },
  { tip: "z", boja: P.zelena700, boja2: P.okerSvetli },
  { tip: "m", boja: P.okerTamni, boja2: P.oker },
  { tip: "z", boja: P.rdjaTamna, boja2: P.oker },
];

// telefon
const TX = 250;
const TY = 370;
const TW = 580;
const TH = 950;

const Ikonica: React.FC<{ tip: string }> = ({ tip }) => {
  switch (tip) {
    case "hleb":
      return (
        <g>
          <path d={elipsa(0, 4, 32, 20)} fill={P.okerTamni} stroke={P.mastilo} strokeWidth={4} />
          <Linija d="M-14,-6 L-8,10 M0,-10 L6,8 M12,-8 L18,6" debljina={3} />
        </g>
      );
    case "basta":
      return (
        <g>
          <Linija d="M0,26 L0,-6" boja={P.zelena700} debljina={6} />
          <path d="M0,-4 Q-26,-8 -28,-30 Q-6,-30 0,-4 Z M0,4 Q24,0 28,-22 Q6,-22 0,4 Z" fill={P.zelena500} stroke={P.mastilo} strokeWidth={3} />
          <path d="M-26,26 L26,26" stroke={P.drvo} strokeWidth={8} />
        </g>
      );
    case "lenjir":
      return (
        <g>
          <path d="M-26,24 L-26,-26 L26,24 Z" fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
          <Linija d="M-26,-10 L-18,-10 M-26,4 L-18,4 M-12,24 L-12,16 M4,24 L4,16" debljina={3} />
        </g>
      );
    case "srce":
      return <path d="M0,22 Q-34,-2 -22,-20 Q-10,-32 0,-16 Q10,-32 22,-20 Q34,-2 0,22 Z" fill={P.rdja} stroke={P.mastilo} strokeWidth={4} />;
    default:
      return (
        <g>
          <path d="M-30,10 L-30,-4 L-18,-6 L-8,-20 L16,-20 L26,-6 L32,-4 L32,10 Z" fill={P.rdja} stroke={P.mastilo} strokeWidth={4} />
          <circle cx={-16} cy={12} r={8} fill={P.mastilo} />
          <circle cx={18} cy={12} r={8} fill={P.mastilo} />
        </g>
      );
  }
};

const Kartica: React.FC<{ y: number; naslov: string; ko: string; boja: string; ikona: string; s: number; pomak?: number }> = ({ y, naslov, ko, boja, ikona, s, pomak = 0 }) => (
  <g transform={`translate(${TX + 40 + pomak} ${y}) scale(${s})`} opacity={Math.min(1, s)}>
    <path d={kutija(0, 0, TW - 80, 118, 14)} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
    <path d={kutija(14, 14, 90, 90, 10)} fill={boja} stroke={P.mastilo} strokeWidth={3} />
    <g transform="translate(59 59)">
      <Ikonica tip={ikona} />
    </g>
    <text x={124} y={52} fontFamily={SERIF} fontWeight={700} fontSize={36} fill={P.mastilo}>
      {naslov}
    </text>
    <text x={124} y={92} fontFamily={SANS} fontWeight={700} fontSize={26} fill={P.mastiloMeko}>
      {ko}
    </text>
  </g>
);

export const Scena9: React.FC = () => {
  const f = useF();
  const tKolo = kad(9, "KOLO");
  const tBunar = kad(9, "bunar,");
  const tRaz = kad(9, "razmenjujemo");
  const tPom = kad(9, "pomažemo");
  const tZap = kad(9, "uradimo") ;
  const tSved = kad(9, "svedočanstvo");
  const tDali = kad(9, "dali.");
  // deo A → B: kamera uranja u bunar
  const uron = napredak(f, tKolo - 2, tBunar - tKolo + 14, Easing.in(Easing.cubic));
  const tel = napredak(f, tBunar + 4, 16, Easing.out(Easing.back(1.3)));
  const zapis = napredak(f, tZap - 6, 14, Easing.inOut(Easing.cubic));
  const zora = napredak(f, 0, 40);
  const ugaoKola = f * 0.9;
  return (
    <Kadar>
      {/* ── A: kolo oko bunara ── */}
      {tel < 1 && (
        <Hrapavo>
          <Kamera x={470} y={mesaj(1060, 1180, uron)} z={mesaj(1.0, 5.2, uron)}>
            <Nebo od={120} do={1010} gustina={1} pomakX={f * 0.4} />
            <g transform={`translate(760 ${mesaj(900, 600, zora)})`}>
              <Sunce r={90} boja={P.oker} zraci={zora} />
            </g>
            <g transform="translate(90 1030)">
              <Topola s={0.55} />
            </g>
            <g transform="translate(990 1030)">
              <Topola s={0.6} />
            </g>
            <Ravnica y={1030} boja={P.trava} />
            {/* zadnja polovina kola (iza bunara) */}
            {KOLO_LJUDI.map((c, i) => {
              const a = ((i / KOLO_LJUDI.length) * 360 + ugaoKola) * (Math.PI / 180);
              const x = 470 + Math.cos(a) * 380;
              const y = 1300 + Math.sin(a) * 120;
              if (Math.sin(a) > 0) return null;
              const s = 0.78 + Math.sin(a) * 0.12;
              return (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <Covek tip={c.tip} boja={c.boja} boja2={c.boja2} s={s} ruke={[80, -80]} smer={Math.cos(a) > 0 ? -1 : 1} korak={f * 0.3 + i} />
                </g>
              );
            })}
            <g transform="translate(470 1330) scale(1.2)">
              <Bunar ugao={-22 + 10 * dah(f, 60)} />
            </g>
            {/* zeleni sjaj iz bunara */}
            <ellipse cx={470} cy={1195} rx={140} ry={50} fill="url(#zeleniSjaj)" opacity={napredak(f, tKolo - 6, 12)} />
            {/* prednja polovina kola */}
            {KOLO_LJUDI.map((c, i) => {
              const a = ((i / KOLO_LJUDI.length) * 360 + ugaoKola) * (Math.PI / 180);
              const x = 470 + Math.cos(a) * 380;
              const y = 1300 + Math.sin(a) * 120;
              if (Math.sin(a) <= 0) return null;
              const s = 0.78 + Math.sin(a) * 0.12;
              return (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <Covek tip={c.tip} boja={c.boja} boja2={c.boja2} s={s} ruke={[80, -80]} smer={Math.cos(a) > 0 ? -1 : 1} korak={f * 0.3 + i} />
                </g>
              );
            })}
            {/* ruke u ruci: niz između susednih */}
            {KOLO_LJUDI.map((_, i) => {
              const a1 = ((i / KOLO_LJUDI.length) * 360 + ugaoKola) * (Math.PI / 180);
              const a2 = (((i + 1) / KOLO_LJUDI.length) * 360 + ugaoKola) * (Math.PI / 180);
              if (Math.sin(a1) + Math.sin(a2) < -0.2) return null;
              const p = (a: number) => [470 + Math.cos(a) * 380, 1300 + Math.sin(a) * 120 - 225 * (0.78 + Math.sin(a) * 0.12)];
              const [x1, y1] = p(a1);
              const [x2, y2] = p(a2);
              return <Linija key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + 16} ${x2},${y2}`} debljina={12} napredak={napredak(f, 6 + i * 3, 10)} />;
            })}
          </Kamera>
          <rect x={0} y={0} width={1080} height={1920} fill={P.vodaTamna} opacity={0.8 * napredak(f, tBunar - 4, 12)} />
        </Hrapavo>
      )}
      {/* ── B–E: telefon sa KOLOM ── */}
      {tel > 0 && (
        <g transform={`translate(540 850) scale(${mesaj(0.25, 1, tel)}) translate(-540 -850)`} opacity={Math.min(1, tel * 2)}>
          <rect x={-20} y={-20} width={1120} height={1960} fill={P.papir} opacity={0} />
          <Hrapavo>
            <path d={kutija(TX + 16, TY + 20, TW, TH, 64)} fill={P.mastilo} opacity={0.25} />
            <Povrs d={kutija(TX, TY, TW, TH, 64)} boja={P.mastilo} srafura="srafBelo" srafuraOp={0.12} debljina={8} pomak={[0, 0]} />
            <path d={kutija(TX + 230, TY + 8, 120, 10, 5)} fill={P.mastiloMeko} />
            <path d={kutija(TX + 22, TY + 22, TW - 44, TH - 44, 46)} fill={P.krem} stroke={P.mastilo} strokeWidth={5} />
          </Hrapavo>
          {/* zaglavlje */}
          <path d={`M${TX + 22},${TY + 68} Q${TX + 22},${TY + 22} ${TX + 68},${TY + 22} L${TX + TW - 68},${TY + 22} Q${TX + TW - 22},${TY + 22} ${TX + TW - 22},${TY + 68} L${TX + TW - 22},${TY + 140} L${TX + 22},${TY + 140} Z`} fill={P.zelena700} />
          <image href={staticFile("kolo-icon.png")} x={TX + 50} y={TY + 44} width={76} height={76} />
          <text x={TX + 144} y={TY + 102} fontFamily={NASLOV} fontWeight={900} fontSize={52} fill={P.belo}>
            KOLO
          </text>
          <text x={TX + TW - 50} y={TY + 100} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={30} fill={P.zelena100} opacity={1 - zapis}>
            Pijaca
          </text>
          <text x={TX + TW - 50} y={TY + 100} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={30} fill={P.zelena100} opacity={zapis}>
            Zapis
          </text>
          <defs>
            <clipPath id="ekran">
              <rect x={TX + 22} y={TY + 140} width={TW - 44} height={TH - 186} />
            </clipPath>
          </defs>
          <g clipPath="url(#ekran)">
            {/* Pijaca: ponude */}
            <g transform={`translate(${-zapis * 600} 0)`} opacity={1 - zapis}>
              <Kartica y={TY + 176} naslov="Domaći hleb" ko="Vesna · Sombor" boja={P.okerSvetli} ikona="hleb" s={napredak(f, tBunar + 14, 10, Easing.out(Easing.back(1.6)))} />
              <Kartica y={TY + 316} naslov="Pomoć u bašti" ko="Dragan · Sombor" boja={P.trava} ikona="basta" s={napredak(f, tBunar + 22, 10, Easing.out(Easing.back(1.6)))} />
              <Kartica y={TY + 456} naslov="Časovi matematike" ko="Ruža · Sombor" boja={P.nebo} ikona="lenjir" s={napredak(f, tPom - 6, 10, Easing.out(Easing.back(1.6)))} />
              <Kartica y={TY + 596} naslov="Prevoz do grada" ko="Miloš · Stanišić" boja={P.okerSvetli} ikona="auto" s={napredak(f, tPom + 2, 10, Easing.out(Easing.back(1.6)))} />
              {/* razmena: strelice između hleba i bašte */}
              {f > tRaz + 4 && (
                <g transform={`translate(${TX + TW - 70} ${TY + 300})`} opacity={napredak(f, tRaz + 4, 8)}>
                  <circle r={40} fill={P.zelena500} stroke={P.mastilo} strokeWidth={4} />
                  <g transform={`rotate(${interpolate(f, [tRaz + 4, tRaz + 24], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`}>
                    <Linija d="M-18,-8 A20,20 0 0,1 18,-8 M18,-8 L10,-18 M18,-8 L6,-4" boja={P.belo} debljina={5} />
                    <Linija d="M18,8 A20,20 0 0,1 -18,8 M-18,8 L-10,18 M-18,8 L-6,4" boja={P.belo} debljina={5} />
                  </g>
                </g>
              )}
              {f > tPom && (
                <g transform={`translate(${TX + TW - 70} ${TY + 580})`} opacity={napredak(f, tPom, 8)}>
                  <circle r={40} fill={P.oker} stroke={P.mastilo} strokeWidth={4} />
                  <Ikonica tip="srce" />
                </g>
              )}
            </g>
            {/* Zapis */}
            <g transform={`translate(${(1 - zapis) * 600} 0)`} opacity={zapis}>
              <text x={TX + 56} y={TY + 200} fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={34} fill={P.mastiloMeko}>
                Zapis doprinosa
              </text>
              {[
                { od: "Vesna", ka: "Dragan", sta: "domaći hleb" },
                { od: "Dragan", ka: "Vesna", sta: "pomoć u bašti" },
                { od: "Ruža", ka: "Miloš", sta: "časovi matematike" },
                { od: "Miloš", ka: "Ruža", sta: "prevoz do grada" },
              ].map((r, i) => {
                const y = TY + 240 + i * 150;
                const pis = napredak(f, tZap + i * 7, 12);
                const istaknut = i === 1 && f >= tSved;
                return (
                  <g key={i} opacity={pis}>
                    <path d={kutija(TX + 44, y, TW - 88, 128, 10)} fill={istaknut ? P.zelena100 : P.belo} stroke={istaknut ? P.zelena700 : P.mastilo} strokeWidth={istaknut ? 6 : 3} />
                    <text x={TX + 70} y={y + 52} fontFamily={SERIF} fontWeight={700} fontSize={34} fill={P.mastilo}>
                      {r.od} → {r.ka}
                    </text>
                    <text x={TX + 70} y={y + 96} fontFamily={SANS} fontWeight={700} fontSize={26} fill={P.mastiloMeko}>
                      {r.sta}
                    </text>
                    <Linija d={`M${TX + TW - 110},${y + 64} L${TX + TW - 96},${y + 80} L${TX + TW - 70},${y + 44}`} boja={P.zelena700} debljina={7} napredak={napredak(f, tZap + i * 7 + 8, 8)} />
                  </g>
                );
              })}
            </g>
          </g>
          {/* pečat ZAPISANO */}
          <Utisak at={tSved + 2} x={TX + TW - 150} y={TY + 560} rot={-12}>
            <g opacity={0.92}>
              <path d={kutija(-150, -52, 300, 104, 12)} fill="none" stroke={P.zelena700} strokeWidth={9} />
              <path d={kutija(-138, -40, 276, 80, 8)} fill="none" stroke={P.zelena700} strokeWidth={3} />
              <text y={18} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={52} fill={P.zelena700} letterSpacing={3}>
                ZAPISANO
              </text>
            </g>
          </Utisak>
          {/* zeleni sjaj na kraju */}
          <ellipse cx={540} cy={850} rx={500} ry={560} fill="url(#zeleniSjaj)" opacity={0.3 * napredak(f, tDali, 20)} />
        </g>
      )}
    </Kadar>
  );
};

