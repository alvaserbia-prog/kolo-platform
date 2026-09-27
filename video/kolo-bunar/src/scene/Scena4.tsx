// Sc. 4 — „Ali sela širom sveta pokazuju da ne mora biti tako. Elinor Ostrom ih je proučavala
// i za to dobila Nobelovu nagradu.“
// Prvo globus u drvorezu koji se polako okreće: na njemu se pale sela (kućice sa zelenim krovom)
// i iz svakog nikne zelena vlat. Na „Elinor“ kadar prelazi u sobu: istraživačica sa beležnicom
// sedi za stolom sa seljacima, kroz prozor terase na brdu; beleži; na „Nobelovu“ utisne se medalja.
import React from "react";
import { Easing } from "remotion";
import { Hrapavo, Kadar, Linija, Povrs, Utisak, dah, elipsa, kutija, mesaj, napredak, useF } from "../alat";
import { P } from "../paleta";
import { Covek, Nebo } from "../motivi";
import { NASLOV } from "../fontovi";
import { kad } from "../vreme";

const CX = 540;
const CY = 850;
const R = 330;

// kopno kao grube mrlje, „na traci“ širine 2π·R koja klizi (okretanje globusa)
const KOPNO = [
  "M0,-150 Q60,-210 140,-180 Q210,-130 170,-60 Q200,0 150,60 Q90,90 60,40 Q10,0 -20,-60 Q-40,-110 0,-150 Z",
  "M300,-40 Q360,-90 430,-60 Q470,0 440,80 Q420,170 360,200 Q320,150 330,80 Q280,20 300,-40 Z",
  "M560,-200 Q680,-240 800,-190 Q860,-140 820,-80 Q760,-40 700,-60 Q650,0 600,-30 Q540,-90 560,-200 Z",
  "M880,60 Q950,20 1010,70 Q1030,130 980,160 Q920,170 890,120 Z",
  "M1180,-170 Q1260,-200 1330,-150 Q1380,-80 1330,-20 Q1290,40 1240,10 Q1200,-60 1180,-170 Z",
  "M1500,20 Q1580,-20 1640,40 Q1660,120 1600,190 Q1540,200 1510,130 Q1480,70 1500,20 Z",
  "M1760,-160 Q1840,-190 1900,-130 Q1930,-60 1880,-20 Q1820,0 1790,-60 Z",
];
const SELA = [
  [80, -100],
  [380, 40],
  [640, -130],
  [760, -120],
  [950, 100],
  [1260, -110],
  [1580, 80],
  [1840, -100],
];
const OBIM = 2 * Math.PI * R;

export const Scena4: React.FC = () => {
  const f = useF();
  const tSela = kad(4, "sela");
  const tPok = kad(4, "pokazuju");
  const tEl = kad(4, "Elinor");
  const tPro = kad(4, "proučavala");
  const tNob = kad(4, "Nobelovu");
  const smena = napredak(f, tEl - 10, 14, Easing.inOut(Easing.cubic));
  const okret = f * 3.2;
  return (
    <Kadar>
      {/* ── deo A: globus ── */}
      {smena < 1 && (
        <g opacity={1 - smena} transform={`translate(${CX} ${CY}) scale(${mesaj(1, 0.7, smena)}) translate(${-CX} ${-CY - smena * 200})`}>
          <Hrapavo>
            <Nebo od={360} do={1300} gustina={0.8} op={0.35} pomakX={f * 0.5} />
            <defs>
              <clipPath id="globus">
                <circle cx={CX} cy={CY} r={R} />
              </clipPath>
            </defs>
            <Povrs d={elipsa(CX, CY, R)} boja={P.voda} srafura="srafH" srafuraOp={0.45} debljina={9} pomak={[6, 4]} />
            <g clipPath="url(#globus)">
              {[0, 1].map((k) => (
                <g key={k} transform={`translate(${CX - R - (okret % OBIM) + k * OBIM} ${CY})`}>
                  {KOPNO.map((d, i) => (
                    <Povrs key={i} d={d} boja={P.trava} srafura="srafD" srafuraOp={0.35} debljina={6} pomak={[4, 3]} />
                  ))}
                  {SELA.map(([x, y], i) => {
                    const at = tSela - 6 + i * 4;
                    if (f < at) return null;
                    const s = Math.min(1, (f - at) / 6);
                    const vlat = napredak(f, tPok + i * 3, 14);
                    return (
                      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                        <circle r={34} fill={P.zelena500} opacity={0.25 + 0.2 * dah(f, 24, i * 5)} />
                        <path d="M-16,8 L-16,-8 L0,-20 L16,-8 L16,8 Z" fill={P.krem} stroke={P.mastilo} strokeWidth={4} />
                        <path d="M-20,-6 L0,-24 L20,-6" fill="none" stroke={P.zelena700} strokeWidth={7} strokeLinecap="round" />
                        <Linija d="M22,8 Q24,-8 20,-22" boja={P.zelena700} debljina={4} napredak={vlat} />
                        <Linija d="M22,-4 Q30,-10 34,-18" boja={P.zelena700} debljina={4} napredak={vlat} />
                      </g>
                    );
                  })}
                </g>
              ))}
              {/* senka lopte */}
              <circle cx={CX + 110} cy={CY + 40} r={R + 40} fill="none" stroke={P.mastilo} strokeWidth={120} opacity={0.18} />
            </g>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={P.mastilo} strokeWidth={9} />
            {/* meridijani */}
            {[-0.6, -0.2, 0.2, 0.6].map((k, i) => (
              <ellipse key={i} cx={CX} cy={CY} rx={Math.abs(Math.sin(((okret / OBIM) * 2 + k) * Math.PI)) * R} ry={R} fill="none" stroke={P.mastilo} strokeWidth={2} opacity={0.35} />
            ))}
            <Linija d={`M${CX - R},${CY} Q${CX},${CY + 30} ${CX + R},${CY}`} debljina={2} opacity={0.35} />
            {/* postolje */}
            <Povrs d={`M${CX - 30},${CY + R + 6} L${CX + 30},${CY + R + 6} L${CX + 80},${CY + R + 90} L${CX - 80},${CY + R + 90} Z`} boja={P.drvo} srafura="srafV" srafuraOp={0.5} />
            <Linija d={`M${CX - R - 30},${CY + 60} A${R + 30},${R + 30} 0 0,0 ${CX + R + 10},${CY - 120}`} debljina={10} />
          </Hrapavo>
        </g>
      )}
      {/* ── deo B: Elinor Ostrom sa seljacima ── */}
      {smena > 0 && (
        <g opacity={smena} transform={`translate(0 ${(1 - smena) * 80})`}>
          <Hrapavo>
            {/* zid i prozor */}
            <Povrs d="M-20,360 L1100,360 L1100,1180 L-20,1180 Z" boja={P.okerSvetli} srafura="srafRedak" srafuraOp={0.25} ivica={false} pomak={[0, 0]} mrlja={0.6} />
            <g transform="translate(540 700)">
              <Povrs d={kutija(-230, -250, 460, 340, 6)} boja={P.nebo} srafura={false} debljina={10} pomak={[4, 3]} />
              <defs>
                <clipPath id="prozor">
                  <rect x={-230} y={-250} width={460} height={340} />
                </clipPath>
              </defs>
              <g clipPath="url(#prozor)">
                <Nebo od={-250} do={-60} gustina={1.5} op={0.6} pomakX={f * 0.3} />
                <Povrs d="M-260,-40 L-120,-190 L-20,-90 L80,-210 L260,-30 L260,120 L-260,120 Z" boja={P.kamenTamni} srafura="srafD" srafuraOp={0.4} debljina={5} />
                {[0, 1, 2, 3, 4].map((i) => (
                  <Povrs key={i} d={`M-260,${-10 + i * 28} Q0,${-30 + i * 28} 260,${-10 + i * 28} L260,${14 + i * 28} Q0,${-6 + i * 28} -260,${14 + i * 28} Z`} boja={i % 2 ? P.trava : P.travaTamna} srafura={false} debljina={4} pomak={[2, 2]} />
                ))}
              </g>
              <Linija d="M0,-250 L0,90 M-230,-80 L230,-80" debljina={9} />
            </g>
            {/* pod */}
            <Povrs d="M-20,1180 L1100,1180 L1100,1940 L-20,1940 Z" boja={P.zemljaSvetla} srafura="srafH" srafuraOp={0.35} debljina={6} pomak={[0, 3]} />
            <g transform="translate(540 1400) scale(1.42) translate(-540 -1330)">
            {/* sto */}
            <Povrs d="M60,1190 L1020,1190 L1000,1250 L80,1250 Z" boja={P.drvo} srafura="srafH" srafuraOp={0.55} debljina={7} />
            {/* ljudi za stolom (sede — noge iza stola) */}
            <g transform="translate(330 1330)">
              <Covek tip="o" boja={P.okerTamni} ruke={[48, 28]} s={1.05} glavaNagib={14} />
            </g>
            <g transform="translate(700 1330)">
              <Covek tip="st" boja={P.rdja} smer={-1} ruke={[40 + 45 * Math.max(0, dah(f, 22)), 18]} s={1.05} />
            </g>
            <g transform="translate(830 1330)">
              <Covek tip="sta" boja={P.rdja} boja2={P.oker} smer={-1} ruke={[10, 4]} s={1.0} glavaNagib={-6} />
            </g>
            <Povrs d="M40,1230 L1040,1230 L1040,1320 L40,1320 Z" boja={P.drvo} srafura="srafH" srafuraOp={0.6} debljina={7} />
            {/* beležnica na stolu, beleške se ispisuju */}
            <g transform="translate(480 1205) rotate(-4)">
              <Povrs d="M-110,-10 L110,-10 L120,30 L-120,30 Z" boja={P.belo} srafura={false} debljina={5} pomak={[3, 2]} />
              {[0, 1, 2].map((i) => (
                <Linija key={i} d={`M${-90 + i * 4},${0 + i * 9} L${80 - i * 10},${0 + i * 9}`} debljina={3} napredak={napredak(f, tPro + i * 10, 14)} />
              ))}
            </g>
            </g>
          </Hrapavo>
          {/* medalja */}
          <Utisak at={tNob - 2} x={860} y={560} rot={-8}>
            <g filter="url(#senkaMeka)">
              {[-1, 1].map((sm) => (
                <g key={sm} transform={`scale(${sm} 1)`}>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const a = (Math.PI * (0.62 + i * 0.1));
                    return <path key={i} d={elipsa(Math.cos(a) * 118, Math.sin(a) * 118, 12, 22)} transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 118} ${Math.sin(a) * 118})`} fill={P.zelena700} stroke={P.mastilo} strokeWidth={3} />;
                  })}
                </g>
              ))}
              <Povrs d={elipsa(0, 0, 96)} boja={P.zlatna} srafura="srafH" srafuraOp={0.25} debljina={7} pomak={[3, 3]} />
              <circle r={78} fill="none" stroke={P.mastilo} strokeWidth={3} opacity={0.6} />
              <text y={-14} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={30} fill={P.mastilo}>
                NOBEL
              </text>
              <text y={34} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={44} fill={P.mastilo}>
                2009
              </text>
            </g>
          </Utisak>
          {/* pero: tačka koja „piše“ */}
          
        </g>
      )}
    </Kadar>
  );
};

