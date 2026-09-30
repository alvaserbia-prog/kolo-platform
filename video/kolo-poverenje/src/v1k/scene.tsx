// Video 1 „Čiji si ti“ u stilu prvih videa serije: papirni kolaž (isečci sa drhtavim ivicama,
// poprsja, polaroid sličice iz sećanja, rukopis). Scene 1–5 su sećanje na selo (sepija, vidi
// Video.tsx); na „KOLO radi isto“ boje se razbistre. Animacije se kače na izgovorene reči.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Defs, Isecak, Pop, Pt, krugTacke, napredak, pravougaonik, usePop } from "./papir";
import { Drvo, Etiketa, GlavaCfg, Kuca, Oblak, Osoba, Sunce, spring01 } from "./likovi";
import { Govor, Kapija, Ograda, Pecat, RukaMase, Slicica, Srce } from "./selo";
import { Kolo, LogoZnak, OSOBE } from "./kolo";
import { Precrtano, Veza } from "./prica";
import { EkranKod, EkranPotvrde } from "../v1/stvari";
import { kad } from "../v1/vreme";
import { SANS } from "../fontovi";

type L = { boja: string; glava: GlavaCfg };
const BAKA: L = { boja: P.slezova, glava: { frizura: "marama", naocare: true } };
const LAZA: L = { boja: P.nebo, glava: { frizura: "kratka", kosa: P.kosaSmedja } };
const OTAC: L = { boja: P.korala600, glava: { frizura: "kratka", kosa: P.kosaTamna, brkovi: true } };
const DEDA: L = { boja: P.more, glava: { frizura: "cela", kosa: P.kosaSeda, brkovi: true, naocare: true, koza: P.koza2 } };
const DOSLJAK: L = { boja: P.narandza, glava: { frizura: "kratka", kosa: P.kosaTamna } };
const DOMACIN: L = { boja: P.zelena700, glava: { frizura: "cela", kosa: P.kosaSeda, brkovi: true } };
const POZNANIK: L = { boja: P.korala, glava: { frizura: "kapa", brkovi: true, koza: P.koza2 } };

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);

/** Poprsje sa glavom; `hod` daje blago poskakivanje u hodu. */
const Lik: React.FC<{ l: L; x: number; y: number; s: number; seed: string; osmeh?: number; hod?: boolean }> = ({ l, x, y, s, seed, osmeh = 1, hod }) => {
  const f = useCurrentFrame();
  const dy = hod ? -Math.abs(Math.sin(f / 4)) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${s}) rotate(${hod ? Math.sin(f / 4) * 3 : 0})`}>
      <Osoba seed={seed} boja={l.boja} glava={{ ...l.glava, osmeh }} />
    </g>
  );
};

const Trava: React.FC<{ y: number; seed: string }> = ({ y, seed }) => (
  <Isecak pts={[[-40, y], [300, y - 12], [700, y + 6], [1120, y - 8], [1120, y + 120], [-40, y + 120]]} boja={P.trava} seed={seed} amp={4} korak={40} />
);

const Klupa: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(-190, -8, 22, 90)} boja="#8A5A34" seed={`${seed}-n1`} senka="mala" />
    <Isecak pts={pravougaonik(168, -8, 22, 90)} boja="#8A5A34" seed={`${seed}-n2`} senka="mala" />
    <Isecak pts={pravougaonik(-220, -30, 440, 34)} boja="#C99B62" seed={`${seed}-d`} />
  </g>
);

const LicnaKarta: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(-150, -95, 300, 190)} boja="#DDE6EC" seed={`${seed}-k`} amp={1.6} />
    <Isecak pts={pravougaonik(-128, -60, 90, 110)} boja="#B9C6CF" seed={`${seed}-f`} senka="bez" amp={1} />
    <Isecak pts={krugTacke(-83, -20, 22, 10)} boja={P.siva} seed={`${seed}-g`} senka="bez" amp={1} />
    {[-40, -10, 20].map((y, i) => (
      <Crta key={i} pts={[[-18, y], [120 - (i % 2) * 40, y]]} seed={`${seed}-l${i}`} boja={P.siva} debljina={4} amp={0.6} />
    ))}
    <text x={0} y={-68} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill={P.siva} letterSpacing={3}>
      LIČNA KARTA
    </text>
  </g>
);

/** Ulica pred kućom: kuća, drvo, trava, klupa (scene 1, 3, 7). */
const Ulica: React.FC<{ sunce?: boolean }> = ({ sunce = true }) => (
  <g>
    {sunce && (
      <g transform="translate(900 470) scale(0.8)">
        <Sunce seed="u-s" />
      </g>
    )}
    <g transform="translate(170 420) scale(0.9)">
      <Oblak seed="u-o" />
    </g>
    <g transform="translate(330 1130)">
      <Kuca seed="u-k" fasada={P.sunce} sirina={460} visina={300} />
    </g>
    <g transform="translate(960 1150)">
      <Drvo seed="u-d" visina={1.9} />
    </g>
    <Trava y={1120} seed="u-t" />
  </g>
);

// ── 1 ── Čiji si ti? Nekada je to pitanje vredelo više od lične karte.
export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 60], [1200, 770], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (
    <Svg>
      <Ulica />
      <g transform="translate(330 1100)">
        <Klupa seed="k1" />
      </g>
      <Lik l={BAKA} x={330} y={872} s={1.85} seed="baka1" />
      <g transform="translate(330 1100)">
        <Isecak pts={pravougaonik(-220, -30, 440, 34)} boja="#C99B62" seed="k1-d2" />
      </g>
      <Lik l={LAZA} x={x} y={840} s={2.0} seed="laza1" hod={f < 60} osmeh={0.6} />
      <Pop at={kad(1, "Čiji")} x={480} y={640}>
        <Govor seed="g1" tekst="Čiji si ti?" velicina={58} rep={-1} />
      </Pop>
      <Pop at={kad(1, "lične")} x={760} y={470} rot={-6}>
        <LicnaKarta seed="lk1" />
      </Pop>
    </Svg>
  );
};

// ── 2 ── Selo je bilo malo i svi su se znali. Lična karta nikom nije trebala.
export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const kSvi = kad(2, "svi");
  const kLicna = kad(2, "Lična");
  const kNikom = kad(2, "nikom");
  const odlet = napredak(f, kNikom, 30, Easing.in(Easing.quad));
  const fasade = [P.sunce, P.belo, P.roze, "#BFD9E6"];
  const glave: GlavaCfg[] = [
    { frizura: "marama" },
    { frizura: "cela", kosa: P.kosaSeda, brkovi: true },
    { frizura: "rep", kosa: P.kosaSmedja },
    { frizura: "kapa", brkovi: true, koza: P.koza2 },
  ];
  return (
    <Svg>
      <g transform="translate(880 440) scale(0.7)">
        <Sunce seed="s2-s" />
      </g>
      <g transform="translate(260 430) scale(0.8)">
        <Oblak seed="s2-o" />
      </g>
      {fasade.map((fa, i) => (
        <g key={i} transform={`translate(${160 + i * 253} 1000)`}>
          <Kuca seed={`s2-k${i}`} fasada={fa} sirina={230} visina={170} prozori={[{ glava: glave[i], od: kSvi + i * 5 }, { glava: glave[(i + 2) % 4], od: kSvi + 10 + i * 5 }]} />
        </g>
      ))}
      <Trava y={1000} seed="s2-t" />
      <g transform="translate(0 1180)">
        <Ograda seed="s2-og" od={20} do={1060} visina={140} />
      </g>
      <Lik l={DOMACIN} x={300} y={960} s={1.5} seed="s2-a" />
      <RukaMase seed="s2-ra" sx={300 + 60} sy={985} boja={DOMACIN.boja} ugao={28} od={kSvi + 4} />
      <Lik l={BAKA} x={780} y={960} s={1.5} seed="s2-b" />
      <RukaMase seed="s2-rb" sx={780 - 60} sy={985} boja={BAKA.boja} ugao={-28} od={kSvi + 8} />
      {f >= kLicna && (
        <g transform={`translate(${540 + odlet * 700} ${560 - odlet * 260}) rotate(${-6 + odlet * 260}) scale(${spring01(f - kLicna) * (1 - odlet * 0.4)})`} opacity={1 - odlet * 0.6}>
          <LicnaKarta seed="lk2" />
        </g>
      )}
    </Svg>
  );
};

// ── 3 ── Kad prođe neko mlađi, pitaju ga: čiji si ti? Kad kaže čiji je, odmah se zna ko je.
export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const kCiji = kad(3, "čiji");
  const kKaze = kad(3, "Kad", 2);
  const kOdmah = kad(3, "odmah");
  const x = interpolate(f, [0, 50], [1200, 760], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const glavaLaze: Pt = [760, 780];
  return (
    <Svg>
      <Ulica sunce={false} />
      <g transform="translate(330 1100)">
        <Klupa seed="k3" />
      </g>
      <Lik l={BAKA} x={330} y={872} s={1.85} seed="baka3" osmeh={f >= kOdmah ? 1 : 0.4} />
      <Lik l={LAZA} x={x} y={840} s={2.0} seed="laza3" hod={f < 50} />
      <Pop at={kCiji - 2} x={470} y={640}>
        <Govor seed="g3" tekst="Čiji si ti?" velicina={54} rep={-1} />
      </Pop>
      {f >= kKaze && f < kOdmah + 30 && (
        <Pop at={kKaze} x={800} y={600}>
          <Govor seed="g3b" tekst="Milin, Đurin unuk." velicina={48} rep={1} />
        </Pop>
      )}
      <Veza a={glavaLaze} b={[590, 520]} seed="v3a" napredak={napredak(f, kKaze + 6, 16)} />
      <Veza a={[590, 520]} b={[860, 400]} seed="v3b" napredak={napredak(f, kKaze + 22, 16)} />
      <Pop at={kKaze + 12} x={560} y={440} rot={-5}>
        <Slicica seed="sl-otac" w={200} h={160} natpis="Mile" nebo="#E8D9B8">
          <g transform="translate(0 30) scale(0.9)">
            <Osoba seed="otac" boja={OTAC.boja} glava={OTAC.glava} />
          </g>
        </Slicica>
      </Pop>
      <Pop at={kKaze + 28} x={860} y={380} rot={6}>
        <Slicica seed="sl-deda" w={200} h={160} natpis="Đura" nebo="#E8D9B8">
          <g transform="translate(0 30) scale(0.9)">
            <Osoba seed="deda" boja={DEDA.boja} glava={DEDA.glava} />
          </g>
        </Slicica>
      </Pop>
      <Pop at={kOdmah + 6} x={200} y={640}>
        <Srce seed="s3-srce" r={46} />
      </Pop>
    </Svg>
  );
};

// ── 4 ── A kad dođe neko nov iz drugog sela, nađe se neko koga zna. „To je Stevin zet.
//        Radili smo zajedno žetvu.“ I to je bilo dovoljno.
export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const kNadje = kad(4, "nađe");
  const kTo = kad(4, "To");
  const kRadili = kad(4, "Radili");
  const kI = kad(4, "I");
  const kDovoljno = kad(4, "dovoljno");
  const xd = interpolate(f, [0, kNadje - 6], [-150, 250], { extrapolateRight: "clamp" });
  const xp = interpolate(f, [kNadje - 4, kTo - 4], [1250, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Svg>
      <g transform="translate(180 430) scale(0.7)">
        <Sunce seed="s4-s" />
      </g>
      {[560, 700, 840].map((x, i) => (
        <g key={x} transform={`translate(${x} 760)`}>
          <Kuca seed={`s4-dk${i}`} fasada={[P.belo, P.roze, P.sunce][i]} sirina={110} visina={80} />
        </g>
      ))}
      <g transform="translate(700 650) rotate(-3)">
        <Etiketa seed="s4-e" tekst="drugo selo" velicina={44} />
      </g>
      <Isecak pts={[[-40, 760], [1120, 740], [1120, 1200], [-40, 1200]]} boja="#CFE0A2" seed="s4-p" amp={4} korak={40} />
      <Isecak pts={[[380, 760], [520, 760], [760, 1200], [-40, 1200], [-40, 1100]]} boja="#E6D2A8" seed="s4-put" amp={4} korak={40} />
      <g transform="translate(900 1100)">
        <Kapija seed="s4-kap" sirina={280} visina={220} />
      </g>
      <Lik l={DOMACIN} x={900} y={880} s={1.7} seed="s4-dom" osmeh={f >= kDovoljno ? 1 : 0} />
      <Lik l={POZNANIK} x={xp} y={870} s={1.6} seed="s4-poz" hod={f >= kNadje - 4 && f < kTo - 4} />
      <Lik l={DOSLJAK} x={xd} y={890} s={1.75} seed="s4-dos" hod={f < kNadje - 6} osmeh={f >= kDovoljno ? 1 : 0.5} />
      <g transform={`translate(${xd + 110} 1010) rotate(-8)`}>
        <Isecak pts={[[-40, -40], [40, -40], [50, 50], [-50, 50]]} boja="#9A6436" seed="s4-torba" senka="mala" />
        <Crta pts={[[-30, -40], [0, -80], [30, -40]]} seed="s4-dr" boja="#6B4424" debljina={7} />
      </g>
      {f >= kTo && f < kRadili + 4 && (
        <Pop at={kTo} x={560} y={600}>
          <Govor seed="g4" tekst="To je Stevin zet." velicina={52} rep={-1} />
        </Pop>
      )}
      {f >= kRadili - 2 && f < kI && (
        <Pop at={kRadili - 2} x={540} y={540} rot={-3}>
          <Slicica seed="sl-zetva" w={460} h={320} natpis="žetva" nebo="#F2D8A0">
            <g transform="translate(150 -90) scale(0.5)">
              <Sunce seed="z-s" />
            </g>
            {[-170, -60, 60, 170].map((x, i) => (
              <g key={x} transform={`translate(${x} ${100 + (i % 2) * 10})`}>
                <Isecak pts={[[-26, 0], [-12, -90], [12, -90], [26, 0]]} boja={P.zlatna400} seed={`sn${i}`} senka="mala" />
                <Isecak pts={pravougaonik(-24, -52, 48, 12)} boja={P.korala600} seed={`snv${i}`} senka="bez" />
              </g>
            ))}
            <g transform="translate(-40 60) scale(0.55)">
              <Osoba seed="z-a" boja={POZNANIK.boja} glava={POZNANIK.glava} />
            </g>
            <g transform="translate(60 60) scale(0.55)">
              <Osoba seed="z-b" boja={DOSLJAK.boja} glava={DOSLJAK.glava} />
            </g>
          </Slicica>
        </Pop>
      )}
      <Pop at={kDovoljno} x={600} y={720}>
        <Srce seed="s4-srce" r={50} />
      </Pop>
    </Svg>
  );
};

// ── 5 ── Tako je nastajalo poverenje i novo poznanstvo. Preko nekoga koga već znaš.
//        Veza po veza, selo po selo.
const SELA: Pt[] = [
  [230, 520],
  [540, 460],
  [860, 540],
  [300, 820],
  [650, 780],
  [900, 900],
  [200, 1110],
  [540, 1090],
  [860, 1180],
];
const VEZE: [number, number, string, number, number][] = [
  [3, 4, "poverenje", 1, 0],
  [4, 1, "poznanstvo", 1, 0],
  [1, 0, "Preko", 1, 0],
  [1, 2, "znaš", 1, 0],
  [4, 5, "veza", 1, 0],
  [5, 8, "veza", 2, 0],
  [4, 7, "veza", 2, 8],
  [0, 3, "selo", 1, 0],
  [3, 6, "selo", 1, 6],
  [6, 7, "selo", 2, 0],
  [7, 8, "selo", 2, 5],
  [2, 5, "selo", 2, 10],
];
export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const boje = [P.sunce, P.belo, P.roze, "#BFD9E6"];
  return (
    <Svg>
      {VEZE.map(([a, b, w, n, d], i) => (
        <Veza key={i} a={[SELA[a][0], SELA[a][1] - 40]} b={[SELA[b][0], SELA[b][1] - 40]} seed={`v5-${i}`} napredak={napredak(f, kad(5, w, n) + d, 14)} boja={P.zlatna600} debljina={10} />
      ))}
      {SELA.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <Isecak pts={krugTacke(0, 10, 120, 16, 40)} boja="#CFE0A2" seed={`sz${i}`} senka="bez" amp={3} />
          <g transform="translate(-50 20)">
            <Kuca seed={`s5k${i}a`} fasada={boje[i % 4]} sirina={80} visina={56} />
          </g>
          <g transform="translate(46 26)">
            <Kuca seed={`s5k${i}b`} fasada={boje[(i + 1) % 4]} sirina={80} visina={56} />
          </g>
        </g>
      ))}
    </Svg>
  );
};

// ── 6 ── KOLO radi isto. Ne tražimo ličnu kartu, ne tražimo ni pravo ime.
//        Dovoljno je da te potvrdi neko ko te lično zna.
const Telefon: React.FC<{ s: number; seed: string; children?: React.ReactNode }> = ({ s, seed, children }) => (
  <g transform={`scale(${s})`}>
    <Isecak pts={pravougaonik(-160, -310, 320, 620)} boja="#2b3a2f" seed={`${seed}-t`} amp={2} />
    <rect x={-134} y={-272} width={268} height={544} rx={18} fill="#FFFDF7" />
    {children}
  </g>
);

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const kKolo = kad(6, "KOLO");
  const kKartu = kad(6, "ličnu");
  const kIme = kad(6, "pravo");
  const kDovoljno = kad(6, "Dovoljno");
  const kPotvrdi = kad(6, "potvrdi");
  const kLicno = kad(6, "lično");
  const kZna = kad(6, "zna");
  const podela = napredak(f, kDovoljno - 6, 20);
  const skriveno = 1 - napredak(f, kDovoljno - 10, 10);
  const pecat = napredak(f, kZna + 4, 10, Easing.out(Easing.cubic));
  const telX = 540 + (300 - 540) * podela;
  const telS = 1.35 + (1.12 - 1.35) * podela;
  return (
    <Svg>
      <Pop at={kKolo - 6} x={telX} y={880} skala={1}>
        <Telefon s={telS} seed="t6a">
          {podela < 0.5 ? (
            <g>
              <rect x={-134} y={-272} width={268} height={62} rx={18} fill={P.zelena700} />
              <rect x={-134} y={-240} width={268} height={30} fill={P.zelena700} />
              <text x={-112} y={-230} fontFamily={SANS} fontWeight={900} fontSize={27} fill="#fff">
                KOLO
              </text>
              <circle cx={0} cy={-100} r={62} fill={P.zlatna400} />
              <text x={0} y={-80} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.tekst}>
                L
              </text>
              <text x={0} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={25} fill={P.tekst}>
                laza.sa.salasa
              </text>
              <text x={0} y={46} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={17} fill={P.siva}>
                nadimak, ne pravo ime
              </text>
            </g>
          ) : (
            <EkranKod pseudonim="laza.sa.salasa" />
          )}
        </Telefon>
      </Pop>
      {podela > 0 && (
        <g transform={`translate(${1300 + (790 - 1300) * podela} 880)`}>
          <Telefon s={1.12} seed="t6b">
            <EkranPotvrde pseudonim="laza.sa.salasa" kvacica={f >= kLicno + 4 ? 1 : 0} pritisak={napredak(f, kZna - 2, 8)} gotovo={f >= kZna + 6 ? 1 : 0} />
          </Telefon>
        </g>
      )}
      {podela > 0.9 && f >= kPotvrdi - 4 && f < kLicno + 10 && <Crta pts={[[690, 740], [420, 860]]} seed="zrak" boja={P.zelena500} debljina={8} napredak={napredak(f, kPotvrdi - 4, 10)} isprekidana />}
      <g opacity={skriveno}>
        <Pop at={kKartu - 2} x={250} y={480} rot={-6}>
          <Precrtano seed="p6a" tekst="lična karta" precrtaj={napredak(f, kKartu + 10, 12)} velicina={62} />
        </Pop>
        <Pop at={kIme - 2} x={830} y={480} rot={5}>
          <Precrtano seed="p6b" tekst="pravo ime" precrtaj={napredak(f, kIme + 10, 12)} velicina={62} />
        </Pop>
      </g>
      <g transform="translate(540 520) rotate(-8)">
        <Pecat seed="pec6" tekst="POTVRĐEN" t={pecat} boja={P.zelena700} velicina={58} />
      </g>
    </Svg>
  );
};

// ── 7 ── Pa, čiji si ti? Ko tebe zna? Uđi u KOLO. ekolo.rs
export const Scena7: React.FC = () => {
  const f = useCurrentFrame();
  const kPa = kad(7, "Pa");
  const kKo = kad(7, "Ko");
  const kUdji = kad(7, "Uđi");
  const kEkolo = kad(7, "ekolo.rs");
  const kraj = napredak(f, kUdji - 8, 12);
  const adresa = usePop(kEkolo - 3);
  const dugme = usePop(kEkolo + 8);
  const lica: L[] = [LAZA, DOMACIN, DOSLJAK, POZNANIK, OTAC, DEDA];
  return (
    <Svg>
      {kraj < 1 && (
        <g opacity={1 - kraj}>
          <Lik l={BAKA} x={540} y={820} s={3.0} seed="baka7" />
          <Pop at={kPa} x={560} y={430}>
            <Govor seed="g7" tekst="Pa, čiji si ti?" velicina={62} rep={-1} />
          </Pop>
          {lica.map((l, i) => {
            const a = -Math.PI / 6 + (i / (lica.length - 1)) * (Math.PI * 4 / 3);
            return (
              <Pop key={i} at={kKo + i * 3} x={540 + Math.cos(a) * 400} y={860 + Math.sin(a) * 430}>
                <g transform="scale(1.05)">
                  <Osoba seed={`k7-${i}`} boja={l.boja} glava={l.glava} />
                </g>
              </Pop>
            );
          })}
        </g>
      )}
      {kraj > 0 && (
        <g opacity={kraj}>
          <Kolo seed="kolo7" geo={{ cx: 540, cy: 1060, rx: 360, ry: 110, ugao: (f - kUdji) * 1.2, skala: 1.0, n: 8 }} pojava={OSOBE.map((_, i) => kUdji - 8 + i * 2)} ruke={kUdji + 6} />
          <g transform="translate(540 640)">
            <LogoZnak seed="logo7" r={170} />
          </g>
          <g transform={`translate(540 1200) scale(${adresa})`}>
            <text textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={120} fill={P.zelena700} letterSpacing={-2}>
              ekolo.rs
            </text>
          </g>
          <g transform={`translate(540 1290) scale(${dugme})`}>
            <Isecak pts={pravougaonik(-230, -46, 460, 92)} boja={P.zelena700} seed="dugme7" />
            <text y={18} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={50} fill="#fff">
              Uđi u KOLO
            </text>
          </g>
        </g>
      )}
    </Svg>
  );
};

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7];
