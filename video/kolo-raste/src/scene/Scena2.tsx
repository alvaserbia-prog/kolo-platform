// Scena 2 — „Tako je i sa našim KOLOM. Postoji da bi nam razmena bila lakša.
// A lakša je kad je ponuda raznovrsna.“
// Isto kolo, bliže; na „KOLOM“ u sredini kruga uskoči znak KOLO. Na „Postoji“ se slika rastopi
// u pijacu sa tri tezge; na „razmena“ tegla preleti sa jedne tezge na drugu, a hleb nazad.
// Na „ponuda raznovrsna“ tezge uskaču jedna za drugom dok se pijaca ne napuni.
import React from "react";
import { Easing, interpolate, staticFile } from "remotion";
import { P } from "../paleta";
import { RUKOPIS } from "../fontovi";
import { Hrapavo, Kadar, Kamera, Oblik, Pop, elipsa, kutija, napredak, useF, usePop } from "../alat";
import { Ulica } from "../pozadine";
import { Hleb, Paprika, Tegla } from "../predmeti";
import { Lik } from "../likovi";
import { IGRACI, Kolo, VESNA, Zastavice } from "../kolo";
import { kad } from "../vreme";

export const ZnakKolo: React.FC<{ s?: number; id?: string }> = ({ s = 1, id = "znak" }) => (
  <g transform={`scale(${s})`}>
    <defs>
      <clipPath id={`${id}Clip`}>
        <rect x={-190} y={-190} width={380} height={380} rx={70} />
      </clipPath>
    </defs>
    <rect x={-196} y={-180} width={392} height={392} rx={74} fill={P.senka} opacity={0.3} filter="url(#blur14)" />
    <g clipPath={`url(#${id}Clip)`}>
      <rect x={-190} y={-190} width={380} height={380} fill={P.zelena900} />
      <image href={staticFile("kolo-hero-logo.png")} x={-190} y={-199} width={380} height={398} />
    </g>
    <rect x={-190} y={-190} width={380} height={380} rx={70} fill="none" stroke={P.mastilo} strokeWidth={5} />
  </g>
);

// ── Roba na tezgama ──────────────────────────────────────────────────────
export const Jabuke = () => (
  <g>
    {[[-40, 0], [0, -6], [40, 0], [-20, -34], [20, -34]].map(([x, y], i) => (
      <g key={i}>
        <Oblik d={elipsa(x, y, 22, 20)} boja={i % 2 ? P.paprika : "#C2482E"} debljina={3} sitna />
        <path d={`M${x},${y - 18} l3,-10`} stroke={P.drvoTamno} strokeWidth={3} />
      </g>
    ))}
  </g>
);
const Jaja = () => (
  <g>
    <Oblik d="M-60,0 L60,0 L48,34 L-48,34Z" boja={P.drvoSvetlo} debljina={3} />
    {[-36, -12, 12, 36, -24, 0, 24].map((x, i) => (
      <Oblik key={i} d={elipsa(x, i < 4 ? -8 : -30, 13, 17)} boja={P.belo} debljina={2.5} tekstura={0.1} />
    ))}
  </g>
);
export const Knjige = () => (
  <g>
    {[P.plava, P.ajvar, P.zelenaPrigusena, P.oker].map((b, i) => (
      <Oblik key={i} d={kutija(-56 + i * 4, -18 - i * 22, 112, 20, 3)} boja={b} debljina={3} sitna />
    ))}
  </g>
);
export const Alat = () => (
  <g>
    <g transform="rotate(-30)">
      <Oblik d={kutija(-8, -60, 16, 110, 4)} boja={P.drvoSvetlo} debljina={3} />
      <Oblik d={kutija(-34, -78, 68, 26, 4)} boja="#8C8F93" debljina={3} />
    </g>
    <g transform="translate(34 0) rotate(28)">
      <Oblik d="M-7,-50 L7,-50 L7,40 L-7,40Z" boja="#8C8F93" debljina={3} />
      <Oblik d="M-22,-70 C-26,-50 -12,-44 0,-44 C12,-44 26,-50 22,-70 L10,-62 L0,-72 L-10,-62Z" boja="#8C8F93" debljina={3} />
    </g>
  </g>
);
export const Pletivo = () => (
  <g>
    <Oblik d={elipsa(0, -24, 38, 36)} boja={P.roze} debljina={3} sitna />
    <path d="M-30,-40 C-10,-20 10,-50 30,-20 M-34,-20 C-10,0 10,-30 34,0" fill="none" stroke={P.mastilo} strokeWidth={2} opacity={0.5} />
    <path d="M-10,-70 L30,10 M10,-72 L-20,8" stroke={P.drvo} strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const Cvece = () => (
  <g>
    <Oblik d="M-20,0 L20,0 L26,-50 L-26,-50Z" boja={P.plava} debljina={3} />
    {[[-24, -86, P.ajvar], [0, -100, P.oker], [24, -84, P.roze], [-8, -70, P.belo]].map(([x, y, c], i) => (
      <g key={i}>
        <path d={`M0,-50 L${x},${(y as number) + 10}`} stroke={P.zelenaTamna} strokeWidth={4} />
        <Oblik d={elipsa(x as number, y as number, 14, 14)} boja={c as string} debljina={2.5} sitna />
        <circle cx={x as number} cy={y as number} r={5} fill={P.oker} />
      </g>
    ))}
  </g>
);
const Paprike = () => (
  <g>
    {[-40, 0, 40].map((x, i) => (
      <g key={i} transform={`translate(${x} -20) rotate(${i * 20 - 20})`}>
        <Paprika s={0.55} boja={i === 1 ? P.oker : P.paprika} />
      </g>
    ))}
  </g>
);

const ROBA: React.ReactNode[] = [
  <g key="t"><g transform="translate(-40 0)"><Tegla vrsta="ajvar" s={0.5} /></g><g transform="translate(20 0)"><Tegla vrsta="pekmez" s={0.5} /></g></g>,
  <g key="h" transform="translate(0 -14) scale(0.9)"><Hleb /></g>,
  <Jabuke key="j" />,
  <Jaja key="e" />,
  <Knjige key="k" />,
  <Alat key="a" />,
  <Pletivo key="p" />,
  <Cvece key="c" />,
  <Paprike key="pa" />,
];
const NATPISI = ["zimnica", "hleb", "jabuke", "jaja", "knjige", "popravke", "pletivo", "cveće", "paprike"];
const TENDE = [P.ajvar, P.zelenaPrigusena, P.plava, P.oker, P.roze, P.teget, P.pekmez, P.zelenaTamna, P.senf];

const Tezga: React.FC<{ i: number; prodavac?: React.ReactNode }> = ({ i, prodavac }) => (
  <g>
    {prodavac}
    {/* stubovi i tenda na pruge */}
    <path d="M-150,0 L-150,-300 M150,0 L150,-300" stroke={P.mastilo} strokeWidth={14} />
    <path d="M-150,0 L-150,-300 M150,0 L150,-300" stroke={P.drvo} strokeWidth={8} />
    <Oblik d="M-180,-300 L180,-300 L200,-230 L-200,-230Z" boja={P.belo} debljina={4} />
    {[-160, -80, 0, 80].map((x) => (
      <path key={x} d={`M${x - 10},-300 L${x + 30},-300 L${x + 34 + (x + 30) * 0.06},-230 L${x - 6 + (x - 10) * 0.06},-230Z`} fill={TENDE[i % TENDE.length]} opacity={0.9} />
    ))}
    <path d="M-200,-230 Q-175,-205 -150,-230 Q-125,-205 -100,-230 Q-75,-205 -50,-230 Q-25,-205 0,-230 Q25,-205 50,-230 Q75,-205 100,-230 Q125,-205 150,-230 Q175,-205 200,-230" fill={TENDE[i % TENDE.length]} stroke={P.mastilo} strokeWidth={4} />
    {/* sto */}
    <Oblik d={kutija(-180, -110, 360, 40, 6)} boja={P.drvoSvetlo} />
    <Oblik d="M-170,-70 L170,-70 L160,0 L-160,0Z" boja={P.drvo} />
    <g transform="translate(0 -110)">{ROBA[i % ROBA.length]}</g>
    <g transform="translate(0 -40)">
      <rect x={-78} y={-24} width={156} height={44} rx={6} fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
      <text y={10} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={32} fill={P.mastilo}>
        {NATPISI[i % NATPISI.length]}
      </text>
    </g>
  </g>
);

// raspored tezgi: prvi red (tri), pa dva reda iza
const MESTA: [number, number, number][] = [
  [200, 1250, 1],
  [540, 1280, 1],
  [880, 1250, 1],
  [120, 900, 0.72],
  [370, 920, 0.72],
  [620, 910, 0.72],
  [880, 895, 0.72],
  [250, 700, 0.55],
  [760, 690, 0.55],
];
const RED_CRTANJA = [7, 8, 3, 4, 5, 6, 0, 1, 2];

export const Scena2: React.FC = () => {
  const f = useF();
  const kKolom = kad(2, "KOLOM.");
  const kPostoji = kad(2, "Postoji");
  const kRazmena = kad(2, "razmena");
  const kPonuda = kad(2, "ponuda");
  const znak = usePop(kKolom - 4, 120, 11);
  const pijaca = napredak(f, kPostoji - 12, 16);
  const let1 = napredak(f, kRazmena - 4, 22, Easing.inOut(Easing.quad));
  const let2 = napredak(f, kRazmena + 12, 22, Easing.inOut(Easing.quad));
  const z = interpolate(f, [kPostoji, kPonuda + 60], [1.05, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const likovi = [IGRACI[0], IGRACI[1], IGRACI[3]];
  return (
    <Kadar>
      {pijaca < 1 && (
        <g opacity={1 - pijaca}>
          <Hrapavo>
            <Kamera x={540} y={1130} z={1.12}>
              <Ulica nebo="#E9C79A" />
              <circle cx={820} cy={520} r={220} fill="url(#toplaSvetlost)" />
              <Zastavice x0={-40} x1={1120} y={640} ugib={70} n={14} />
              <ellipse cx={540} cy={1290} rx={470} ry={150} fill={P.drvoSvetlo} opacity={0.35} />
            </Kamera>
          </Hrapavo>
          <Kamera x={540} y={1130} z={1.12}>
            <Kolo
              cx={540}
              cy={1270}
              rx={360}
              ry={122}
              s={0.5}
              f={f + 200}
              ugao={(f + 200) * 0.9}
              igraci={[...IGRACI.slice(0, 5).map((p) => ({ p })), { p: VESNA }]}
              centar={
                f >= kKolom - 4 ? (
                  <g transform={`translate(540 ${990 - znak * 20}) scale(${znak * 0.7}) rotate(${(1 - znak) * -20})`}>
                    <ZnakKolo id="znak2" />
                  </g>
                ) : null
              }
            />
          </Kamera>
        </g>
      )}
      {pijaca > 0 && (
        <g opacity={pijaca}>
          <Hrapavo>
            <Kamera x={540} y={1000} z={z}>
              <Ulica nebo="#D8C7A0" />
              <rect x={-200} y={1000} width={1500} height={900} fill={P.drvoSvetlo} opacity={0.3} />
              <Zastavice x0={-40} x1={1120} y={470} ugib={50} n={14} />
            </Kamera>
          </Hrapavo>
          <Kamera x={540} y={1000} z={z}>
            {RED_CRTANJA.map((i) => {
              const [x, y, s] = MESTA[i];
              const prve = i < 3;
              const at = prve ? kPostoji - 10 + i * 4 : kPonuda - 6 + (i - 3) * 5;
              const lik = prve ? (
                <Lik x={i === 1 ? 110 : -90} y={-40} s={0.5} {...likovi[i]} glava={{ ...likovi[i].glava, izraz: "srecna" }} lr={[20, 20]} dr={[-10, -40]} />
              ) : null;
              return (
                <Pop key={i} at={at} x={x} y={y} skala={s}>
                  <Hrapavo lokalno>
                    <Tezga i={i} prodavac={lik} />
                  </Hrapavo>
                </Pop>
              );
            })}
            {/* razmena: tegla ide sa prve tezge na srednju, hleb nazad */}
            {let1 > 0 && let1 < 1 && (
              <g transform={`translate(${interpolate(let1, [0, 1], [180, 520])} ${interpolate(let1, [0, 1], [1130, 1150]) - Math.sin(let1 * Math.PI) * 230}) rotate(${let1 * 360})`}>
                <Tegla vrsta="ajvar" s={0.55} />
              </g>
            )}
            {let2 > 0 && let2 < 1 && (
              <g transform={`translate(${interpolate(let2, [0, 1], [540, 200])} ${interpolate(let2, [0, 1], [1150, 1130]) - Math.sin(let2 * Math.PI) * 200}) rotate(${-let2 * 300})`}>
                <g transform="scale(0.7)">
                  <Hleb />
                </g>
              </g>
            )}
          </Kamera>
        </g>
      )}
    </Kadar>
  );
};
