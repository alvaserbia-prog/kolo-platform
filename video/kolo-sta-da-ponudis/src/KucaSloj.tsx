// Kuća u preseku kroz scene 1–5: jedan „svet" i jedna kamera, pa se između soba ne seče.
// Na „prošetamo" prednji zid klizne, na „Kuhinja" / „Dvorište" / „Dnevna" pali se svetlo
// i kamera prelazi na tu sobu. Predmeti uskaču na izgovorenu reč, brojač ideja raste do 10.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Defs, Isecak, Pop, napredak, pravougaonik, usePop } from "./papir";
import { Osoba } from "./likovi";
import { Kolaci } from "./selo";
import { Komsija } from "./selo";
import { LIKOVI } from "./prica";
import { TI } from "./ekran";
import { SANS, RUKOPIS } from "./fontovi";
import { gk, scena } from "./vreme";
import {
  AJVAR,
  Auto,
  Kokoska,
  Kosacica,
  KorpaJaja,
  Mesec,
  Mrak,
  Paradajz,
  Prekidac,
  Putokaz,
  Sedi,
  Sijalica,
  SivacaMasina,
  SlavskiKolac,
  Sporet,
  Sto,
  Sveska,
  TeglaSa,
  TelefoncicSvetli,
  Zvezde,
  paljenje,
} from "./kuca";

// ── Svet ────────────────────────────────────────────────────────────────
const L = 70;
const D = 1010;
const ZID = 430;
const SPRAT = 960;
const TLO = 1500;
export const SOBE = {
  dnevna: { x: 100, y: 460, w: 880, h: 480 },
  kuhinja: { x: 100, y: 988, w: 880, h: 488 },
  dvoriste: { x: -900, y: TLO, w: 2880, h: 2400 },
};

type Kam = { s: number; wx: number; wy: number; sx: number; sy: number };
const PREGLED: Kam = { s: 0.6, wx: 540, wy: 1180, sx: 540, sy: 860 };

/** Kamera kroz vreme: niz pokreta {od, trajanje, cilj}. */
const kamera = (f: number, pokreti: { od: number; tr: number; k: Kam }[], pocetna: Kam): Kam => {
  let k = pocetna;
  for (const p of pokreti) {
    if (f <= p.od) break;
    const t = napredak(f, p.od, p.tr, Easing.inOut(Easing.cubic));
    k = {
      s: interpolate(t, [0, 1], [k.s, p.k.s]),
      wx: interpolate(t, [0, 1], [k.wx, p.k.wx]),
      wy: interpolate(t, [0, 1], [k.wy, p.k.wy]),
      sx: interpolate(t, [0, 1], [k.sx, p.k.sx]),
      sy: interpolate(t, [0, 1], [k.sy, p.k.sy]),
    };
  }
  return k;
};

/** Ekranski položaj tačke sveta pri datoj kameri. */
export const naEkranu = (k: Kam, x: number, y: number) => ({ x: k.sx + (x - k.wx) * k.s, y: k.sy + (y - k.wy) * k.s });

const Brojac: React.FC<{ n: number; poslednji: number }> = ({ n, poslednji }) => {
  const f = useCurrentFrame();
  const udar = Math.max(0, 1 - (f - poslednji) / 10);
  return (
    <g transform={`translate(900 150) rotate(4) scale(${(1 + 0.25 * udar).toFixed(3)})`}>
      <Isecak pts={pravougaonik(-140, -62, 280, 124)} boja={P.zelena700} seed="brojac" amp={2} />
      <text x={-18} y={20} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={56} fill={P.zelena100}>
        ideje:
      </text>
      <text x={84} y={26} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={70} fill={P.zlatna400}>
        {n}
      </text>
    </g>
  );
};

const NazivSobe: React.FC<{ at: number; do: number; tekst: string; seed: string }> = ({ at, do: kraj, tekst, seed }) => {
  const f = useCurrentFrame();
  const s = usePop(at, 190);
  if (f < at || f > kraj + 8) return null;
  const ode = napredak(f, kraj, 8, Easing.in(Easing.cubic));
  const w = tekst.length * 50 + 90;
  return (
    <g transform={`translate(${440 - ode * 900} 150) rotate(${-3 + (1 - s) * -10}) scale(${s.toFixed(4)})`}>
      <Isecak pts={pravougaonik(-w / 2, -62, w, 124)} boja={P.belo} seed={`naziv-${seed}`} amp={2.4} />
      <text x={0} y={24} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={72} fill={P.zelena900} letterSpacing={2}>
        {tekst}
      </text>
    </g>
  );
};

export const KucaSloj: React.FC = () => {
  const f = useCurrentFrame();

  // reči (globalni frejmovi)
  const hajde = gk(1, "Hajde");
  const prosetamo = gk(1, "prošetamo");
  const kucu = gk(1, "kuću.");
  const kuhinja = gk(2, "Kuhinja.");
  const ajvar = gk(2, "Ajvar,");
  const pekmez = gk(2, "pekmez,");
  const kolaci = gk(2, "kolači");
  const slavu = gk(2, "slavu.");
  const dvoriste = gk(3, "Dvorište.");
  const jaja = gk(3, "Jaja,");
  const paradajz = gk(3, "paradajz");
  const kosenje = gk(3, "Košenje");
  const mesto = gk(3, "Mesto");
  const grad = gk(3, "grad.");
  const dnevna = gk(4, "Dnevna");
  const sijes = gk(4, "Šiješ,");
  const pomazes = gk(4, "pomažeš");
  const matematike = gk(4, "matematike,");
  const pokazujes = gk(4, "pokazuješ");
  const s5 = scena(5).odF;
  const s6 = scena(6).odF;
  if (f < hajde - 8 || f > s6 + 12) return null;

  const k = kamera(
    f,
    [
      { od: hajde - 8, tr: 22, k: PREGLED },
      { od: kuhinja - 6, tr: 20, k: { s: 1.2, wx: 540, wy: 1232, sx: 540, sy: 800 } },
      { od: dvoriste - 6, tr: 22, k: { s: 1.0, wx: 540, wy: 1850, sx: 540, sy: 800 } },
      { od: dnevna - 8, tr: 26, k: { s: 1.2, wx: 540, wy: 700, sx: 540, sy: 800 } },
      { od: s5 - 2, tr: 20, k: PREGLED },
    ],
    { s: 0.3, wx: 540, wy: 1180, sx: 540, sy: 1500 },
  );
  const ulaz = napredak(f, hajde - 8, 20, Easing.out(Easing.back(1.2)));
  const zid = napredak(f, prosetamo, 18, Easing.inOut(Easing.cubic));
  const svetloK = paljenje(f, kuhinja - 2);
  const svetloDv = paljenje(f, dvoriste - 2);
  const svetloDn = paljenje(f, dnevna - 2);
  const nestaje = napredak(f, s6 - 4, 14);

  const IDEJE = [ajvar, pekmez, kolaci, jaja, paradajz, kosenje, mesto, sijes, pomazes, pokazujes];
  const broj = IDEJE.filter((t) => f >= t).length;
  const poslednji = IDEJE.filter((t) => f >= t).pop() ?? 0;

  const tr = `translate(${k.sx - k.wx * k.s} ${k.sy - k.wy * k.s}) scale(${k.s})`;
  const ma = LIKOVI.marija;

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <g opacity={Math.min(1, ulaz * 1.5) * (1 - nestaje)}>
        <g transform={tr}>
          {/* noćno nebo */}
          <rect x={-900} y={-900} width={2880} height={TLO + 900} fill="#26304A" />
          <Zvezde seed="nebo" w={2400} h={1100} n={60} />
          <g transform="translate(900 150)">
            <Mesec seed="mesec" r={62} />
          </g>

          {/* ── krov i zidovi ── */}
          <Isecak pts={[[L - 50, ZID + 10], [540, 150], [D + 50, ZID + 10], [D + 30, ZID + 30], [540, 180], [L - 30, ZID + 30]]} boja={P.korala600} seed="krov-ivica" />
          <Isecak pts={[[L - 20, ZID], [540, 180], [D + 20, ZID]]} boja="#8A3A22" seed="krov" />
          <Isecak pts={pravougaonik(760, 190, 70, 150)} boja="#8A3A22" seed="dimnjak" />
          <Isecak pts={pravougaonik(L, ZID, D - L, TLO - ZID)} boja="#EFE2C4" seed="zidovi" amp={2} />

          {/* ── dnevna soba ── */}
          <Isecak pts={pravougaonik(SOBE.dnevna.x, SOBE.dnevna.y, SOBE.dnevna.w, SOBE.dnevna.h)} boja="#F4E1CC" seed="dn-zid" senka="bez" amp={1.4} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <line key={i} x1={140 + i * 80} y1={470} x2={140 + i * 80} y2={930} stroke="#E8CDB2" strokeWidth={10} />
          ))}
          <Isecak pts={pravougaonik(SOBE.dnevna.x, 900, SOBE.dnevna.w, 40)} boja="#B98A55" seed="dn-pod" senka="bez" amp={1} />
          {/* slika na zidu */}
          <Isecak pts={pravougaonik(470, 520, 150, 110)} boja="#8A5A34" seed="dn-slika" senka="mala" />
          <Isecak pts={pravougaonik(482, 532, 126, 86)} boja="#CFE3EA" seed="dn-slika2" senka="bez" amp={1} />
          <Isecak pts={[[482, 618], [520, 574], [556, 600], [590, 560], [608, 618]]} boja={P.zelena500} seed="dn-slika3" senka="bez" amp={1} korak={12} />
          {/* ćilim */}
          <Isecak pts={[[300, 925], [800, 925], [830, 945], [270, 945]]} boja={P.korala} seed="dn-cilim" senka="bez" amp={1} />
          {/* kauč */}
          <Isecak pts={[[730, 800], [960, 800], [970, 900], [720, 900]]} boja={P.slezova} seed="dn-kauc" />
          <Isecak pts={[[720, 850], [980, 850], [980, 905], [720, 905]]} boja="#7456A6" seed="dn-kauc2" senka="mala" />
          <g transform="translate(540 460)">
            <Sijalica seed="dn-sij" svetlo={svetloDn} duzina={40} />
          </g>
          {/* šivenje */}
          <g transform="translate(250 820)">
            <Sto seed="dn-sto1" w={240} boja={P.more} />
          </g>
          <Pop at={sijes - 3} x={250} y={812} skala={0.95}>
            <SivacaMasina seed="dn-sm" radi={f > sijes} />
          </Pop>
          {/* matematika */}
          <Pop at={pomazes - 4} x={505} y={740} skala={0.72}>
            <Sedi seed="dn-dete" boja={P.nebo} glava={{ frizura: "kapa" }} />
          </Pop>
          <Pop at={pomazes - 1} x={640} y={712} skala={0.86}>
            <Sedi seed="dn-ti" boja={TI.boja} glava={TI.glava} />
          </Pop>
          <g transform="translate(575 830)">
            <Sto seed="dn-sto2" w={250} boja={P.zlatna400} />
          </g>
          <Pop at={pomazes + 2} x={575} y={796} skala={0.62} rot={-3}>
            <Sveska seed="dn-sv" resenje={napredak(f, matematike + 10, 2)} />
          </Pop>
          {/* baka i unuka sa telefonom */}
          <Pop at={pokazujes - 4} x={790} y={740} skala={0.84}>
            <Osoba seed="dn-baka" boja={ma.boja} glava={ma.glava} visina={100} />
          </Pop>
          <Pop at={pokazujes - 1} x={900} y={752} skala={0.72}>
            <Osoba seed="dn-unuka" boja={P.trava} glava={{ frizura: "rep", kosa: P.kosaTamna }} visina={100} />
          </Pop>
          <Pop at={pokazujes + 3} x={846} y={790} skala={0.66} njihanje={3}>
            <TelefoncicSvetli seed="dn-tel" />
          </Pop>
          <Mrak {...SOBE.dnevna} mrak={1 - svetloDn} />

          {/* međuspratna ploča */}
          <Isecak pts={pravougaonik(L, SPRAT - 16, D - L, 30)} boja="#8A5A34" seed="ploca" amp={1.4} />

          {/* ── kuhinja ── */}
          <Isecak pts={pravougaonik(SOBE.kuhinja.x, SOBE.kuhinja.y, SOBE.kuhinja.w, SOBE.kuhinja.h)} boja="#DDEFE4" seed="ku-zid" senka="bez" amp={1.4} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={`h${i}`} x1={100} y1={1010 + i * 60} x2={980} y2={1010 + i * 60} stroke="#C7E2D0" strokeWidth={4} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
            <line key={`v${i}`} x1={100 + i * 60} y1={990} x2={100 + i * 60} y2={1330} stroke="#C7E2D0" strokeWidth={4} />
          ))}
          <Isecak pts={pravougaonik(SOBE.kuhinja.x, 1440, SOBE.kuhinja.w, 36)} boja="#A86A2C" seed="ku-pod" senka="bez" amp={1} />
          {/* prozor na noć */}
          <Isecak pts={pravougaonik(730, 1030, 180, 140)} boja={P.belo} seed="ku-pr" senka="mala" />
          <Isecak pts={pravougaonik(742, 1042, 156, 116)} boja="#26304A" seed="ku-pr2" senka="bez" amp={1} />
          <line x1={820} y1={1042} x2={820} y2={1158} stroke={P.belo} strokeWidth={6} />
          <circle cx={870} cy={1070} r={10} fill="#FFF3C4" />
          <g transform="translate(540 988)">
            <Sijalica seed="ku-sij" svetlo={svetloK} duzina={50} />
          </g>
          <g transform="translate(240 1452)">
            <Sporet seed="ku-sp" krcka={f > kuhinja} />
          </g>
          <g transform="translate(640 1300)">
            <Sto seed="ku-sto" w={330} />
          </g>
          {/* kredenac */}
          <Isecak pts={pravougaonik(820, 1300, 150, 150)} boja="#C9A06A" seed="ku-kr" />
          <Crta pts={[[895, 1310], [895, 1440]]} seed="ku-kr-l" boja="#8A5A34" debljina={4} />
          {[0, 1].map((i) => (
            <Pop key={i} at={ajvar - 3 + i * 3} x={520 + i * 66} y={1236} skala={0.62} rot={i ? 4 : -3}>
              <TeglaSa seed={`ku-aj${i}`} sadrzaj={AJVAR} poklopac={P.zlatna600} natpis={i ? undefined : "ajvar"} natpisVelicina={38} />
            </Pop>
          ))}
          {[P.slezova, P.narandza].map((b, i) => (
            <Pop key={i} at={pekmez - 3 + i * 3} x={700 + i * 66} y={1236} skala={0.62} rot={i ? -4 : 3}>
              <TeglaSa seed={`ku-pk${i}`} sadrzaj={b} poklopac={i ? P.korala : P.zelena500} natpis={i ? undefined : "pekmez"} natpisVelicina={34} />
            </Pop>
          ))}
          <Pop at={kolaci - 3} x={892} y={1286} skala={0.62}>
            <Kolaci seed="ku-kol" />
          </Pop>
          <Pop at={slavu - 4} x={626} y={1284} skala={0.6}>
            <SlavskiKolac seed="ku-sl" />
          </Pop>
          <Mrak {...SOBE.kuhinja} mrak={1 - svetloK} />

          {/* temelj */}
          <Isecak pts={pravougaonik(L - 10, TLO - 20, D - L + 20, 34)} boja="#8E959A" seed="temelj" amp={1.4} />

          {/* ── prednji zid (klizne ulevo na „prošetamo") ── */}
          {zid < 1 && (
            <g transform={`translate(${-zid * 1250} 0) rotate(${-zid * 6} ${L} ${TLO})`}>
              <Isecak pts={pravougaonik(L, ZID, D - L, TLO - ZID)} boja="#F2D98D" seed="fasada" amp={2.4} />
              {[200, 540, 880].map((x, i) => (
                <g key={i}>
                  <Isecak pts={pravougaonik(x - 70, 560, 140, 180)} boja="#2A3550" seed={`fp-g${i}`} senka="bez" />
                  <Isecak pts={pravougaonik(x - 110, 552, 36, 196)} boja={P.zelena700} seed={`fp-gk${i}`} senka="mala" />
                  <Isecak pts={pravougaonik(x + 74, 552, 36, 196)} boja={P.zelena700} seed={`fp-gd${i}`} senka="mala" />
                </g>
              ))}
              {[220, 540].map((x, i) => (
                <g key={i}>
                  <Isecak pts={pravougaonik(x - 70, 1100, 140, 180)} boja="#2A3550" seed={`fp-d${i}`} senka="bez" />
                  <Isecak pts={pravougaonik(x - 110, 1092, 36, 196)} boja={P.zelena700} seed={`fp-dk${i}`} senka="mala" />
                  <Isecak pts={pravougaonik(x + 74, 1092, 36, 196)} boja={P.zelena700} seed={`fp-dd${i}`} senka="mala" />
                </g>
              ))}
              <Isecak pts={pravougaonik(790, 1200, 150, 290)} boja="#8A5A34" seed="fp-vrata" />
              <circle cx={915} cy={1350} r={9} fill={P.zlatna400} />
            </g>
          )}

          {/* ── dvorište ── */}
          <Isecak pts={pravougaonik(-900, TLO, 2880, 2400)} boja="#5E8F3E" seed="trava" senka="bez" amp={2} />
          {Array.from({ length: 26 }, (_, i) => (
            <Crta key={i} pts={[[-40 + i * 45, TLO + 60 + (i % 4) * 150], [-30 + i * 45, TLO + 30 + (i % 4) * 150], [-20 + i * 45, TLO + 60 + (i % 4) * 150]]} seed={`vl${i}`} boja="#7FB24F" debljina={5} />
          ))}
          {/* lampioni preko dvorišta */}
          <Crta pts={[[-20, TLO + 40], [270, TLO + 90], [540, TLO + 70], [810, TLO + 92], [1100, TLO + 40]]} seed="lampioni-k" boja="#2E2B27" debljina={4} korak={40} />
          {[60, 180, 300, 420, 540, 660, 780, 900, 1020].map((x, i) => {
            const y = TLO + 64 + Math.sin((x / 1080) * Math.PI * 2) * 12 + (i % 2) * 6;
            const b = [P.sunce, P.korala, P.more, P.zlatna400, P.roze][i % 5];
            const on = paljenje(f, dvoriste - 2 + i);
            return (
              <g key={i}>
                {on > 0 && <circle cx={x} cy={y + 18} r={60} fill={b} opacity={0.3 * on} />}
                <Isecak pts={[[x - 14, y], [x + 14, y], [x + 18, y + 30], [x - 18, y + 30]]} boja={on > 0.5 ? b : "#55525A"} seed={`lamp${i}`} senka="mala" amp={1} korak={10} />
              </g>
            );
          })}
          <Pop at={jaja - 5} x={200} y={1740} skala={0.9}>
            <Kokoska seed="dv-k1" />
          </Pop>
          <Pop at={jaja - 2} x={360} y={1766} skala={0.8}>
            <Kokoska seed="dv-k2" boja="#C98A4B" smer={-1} />
          </Pop>
          <Pop at={jaja + 2} x={270} y={1860} skala={0.85}>
            <KorpaJaja seed="dv-jaja" />
          </Pop>
          <Pop at={paradajz - 3} x={760} y={1800} skala={0.95}>
            <Paradajz seed="dv-par" />
          </Pop>
          <Pop at={kosenje - 4} x={130} y={1960} skala={0.95}>
            <Komsija id="jova" seed="dv-jova" />
          </Pop>
          {f >= kosenje - 2 && (
            <g transform={`translate(${250 + Math.sin((f - kosenje) / 8) * 26} 2080)`}>
              <Pop at={kosenje - 2} x={0} y={0} skala={0.95}>
                <Kosacica seed="dv-kos" />
              </Pop>
            </g>
          )}
          <Pop at={mesto - 4} x={770} y={2140} skala={1}>
            <Auto seed="dv-auto" prazno={napredak(f, mesto + 4, 10)} />
          </Pop>
          <Pop at={grad - 6} x={420} y={2170} skala={0.9} rot={-3}>
            <Putokaz seed="dv-put" tekst="→ grad" />
          </Pop>
          <Mrak {...SOBE.dvoriste} mrak={(1 - svetloDv) * 0.8} />
        </g>

        {/* ── ekranski sloj ── */}
        {f >= kucu - 4 && f < kuhinja + 14 && (
          <g transform={`translate(860 1150) scale(${(usePopVal(f, kucu - 4) * 2.8).toFixed(3)})`} opacity={1 - napredak(f, kuhinja + 4, 10)}>
            <Prekidac seed="prekidac" ukljucen={f >= kuhinja - 2} />
            <g transform={`translate(${f >= kuhinja - 2 ? 26 : 40} ${f >= kuhinja - 2 ? -6 : 24})`}>
              <Isecak pts={[[0, 0], [60, -14], [70, 8], [12, 22]]} boja={P.koza} seed="prst" senka="mala" amp={1} korak={10} />
            </g>
          </g>
        )}
        <NazivSobe at={kuhinja - 3} do={dvoriste - 6} tekst="KUHINJA" seed="ku" />
        <NazivSobe at={dvoriste - 3} do={dnevna - 6} tekst="DVORIŠTE" seed="dv" />
        <NazivSobe at={dnevna - 3} do={s5 - 2} tekst="DNEVNA SOBA" seed="dn" />
        {f >= kuhinja - 3 && f < s5 + 6 && (
          <g opacity={1 - napredak(f, s5 - 4, 10)}>
            <Pop at={kuhinja - 3} x={0} y={0}>
              <Brojac n={broj} poslednji={poslednji} />
            </Pop>
          </g>
        )}
      </g>
      {/* u sceni 5 kuća se povlači iza papira, da tegla bude u prvom planu */}
      <rect x={0} y={0} width={1080} height={1920} fill={P.papir} opacity={0.93 * napredak(f, gk(5, "tebi") - 4, 12)} />
    </svg>
  );
};

/** Opruga bez hook-a (za uslovno crtanje). */
const usePopVal = (f: number, at: number) => {
  const t = f - at;
  if (t <= 0) return 0;
  return 1 - Math.exp(-t / 5) * Math.cos(t / 2.6);
};
