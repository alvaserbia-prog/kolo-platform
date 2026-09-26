// Scene videa 5 „Šta da ponudiš". Kuća (scene 1–5) je poseban sloj (KucaSloj.tsx),
// ovde su samo elementi u prvom planu. Sve animacije su vezane za izgovorene reči (kad).
import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, krugTacke, napredak, pravougaonik, usePop } from "../papir";
import { Etiketa, Osoba, Upitnik } from "../likovi";
import { Kolo, LogoZnak } from "../kolo";
import { Iskre, LIKOVI, OSOBE_KOLA, Lik, Slika, DefsNalepnica } from "../prica";
import { Govor, Pecat, Srce } from "../selo";
import { Cioda, Iks, Konfete, Kvacica, Lupa, OglasKartica, TI, TiLik, otkucano } from "../ekran";
import { KorpaJaja, TeglaSa, AJVAR, Zvezde, paljenje } from "../kuca";
import { SANS, RUKOPIS } from "../fontovi";
import { FPS, kad, scena, trajanjeF } from "../vreme";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);

const Status: React.FC<{ seed: string; tekst: string; zelena?: boolean }> = ({ seed, tekst, zelena }) => (
  <g transform="translate(0 176) rotate(-3)">
    <Etiketa seed={seed} tekst={tekst} velicina={50} boja={zelena ? P.belo : P.zelena900} pozadina={zelena ? P.zelena700 : P.belo} />
  </g>
);

// ── Scena 1 — „Misliš da nemaš šta da ponudiš? Hajde da prošetamo kroz tvoju kuću." ──
export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const hajde = kad(1, "Hajde");
  const kucu = kad(1, "kuću.");
  const ponudis = kad(1, "ponudiš?");
  const ode = napredak(f, hajde - 10, 22, Easing.inOut(Easing.cubic));
  const sleganje = Math.max(0, Math.sin((f - 6) / 5)) * (f < ponudis + 20 ? 1 : 0);
  if (ode >= 1 && f > kucu) return null;
  return (
    <Svg>
      <g opacity={1 - ode} transform={`translate(${-ode * 300} ${ode * 500}) scale(${1 - ode * 0.5})`}>
        <Pop at={-30} x={540} y={470} rot={-2} njihanje={1.2}>
          <Govor seed="s1-gov" tekst="Nemam šta da ponudim." velicina={78} rep={1} />
        </Pop>
        <g transform={`translate(540 ${880 - sleganje * 18}) scale(2.3)`}>
          <Osoba seed="s1-ti" boja={TI.boja} glava={{ ...TI.glava, osmeh: 0 }} />
          {/* ramena gore-dole: sleže ramenima */}
          <Isecak pts={[[-70, 10 - sleganje * 14], [-40, -4 - sleganje * 14], [-30, 14], [-60, 26]]} boja={TI.boja} seed="s1-r1" senka="bez" amp={1} korak={10} />
          <Isecak pts={[[70, 10 - sleganje * 14], [40, -4 - sleganje * 14], [30, 14], [60, 26]]} boja={TI.boja} seed="s1-r2" senka="bez" amp={1} korak={10} />
        </g>
        <Pop at={ponudis - 4} x={820} y={700} skala={0.7} njihanje={4}>
          <Upitnik seed="s1-up" />
        </Pop>
        <Pop at={ponudis} x={260} y={760} skala={0.5} njihanje={4} faza={2}>
          <Upitnik seed="s1-up2" boja={P.korala} />
        </Pop>
      </g>
    </Svg>
  );
};

export const Prazna: React.FC = () => null;

// ── Scena 5 — „Ono što tebi deluje obično, nekome je baš ono što traži." ──
export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const tebi = kad(5, "tebi");
  const obicno = kad(5, "obično,");
  const nekome = kad(5, "nekome");
  const bas = kad(5, "baš");
  const trazi = kad(5, "traži.");
  // tegla izleti iz kuhinje (pregled kuće: ekranski ~ (528, 894), mala) u prvi plan
  const let_ = napredak(f, tebi - 6, 20, Easing.out(Easing.back(1.1)));
  const x = interpolate(let_, [0, 1], [528, 520]);
  const y = interpolate(let_, [0, 1], [894, 760]);
  const s = interpolate(let_, [0, 1], [0.37, 2.5]);
  const okret = napredak(f, bas - 2, 12, Easing.inOut(Easing.cubic));
  const tresi = f >= obicno && f < obicno + 14 ? Math.sin(f) * 3 : 0;
  if (f < tebi - 6) return null;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) rotate(${(1 - let_) * 30 + tresi + Math.sin(f / 16) * 1.5}) scale(${s})`}>
        <TeglaSa seed="s5-tegla" sadrzaj={AJVAR} poklopac={P.zlatna600} natpis="ništa posebno" natpisVelicina={24} okret={okret} natpis2="baš ovo tražim!" />
      </g>
      {f >= bas && f < bas + 36 && <Iskre seed="s5-isk" x={520} y={800} t={napredak(f, bas + 2, 32)} r={420} n={12} />}
      <Pop at={tebi} x={200} y={1130} skala={1.35}>
        <Osoba seed="s5-ti" boja={TI.boja} glava={{ ...TI.glava, osmeh: f > bas + 6 ? 1 : 0.1 }} />
      </Pop>
      <Pop at={nekome - 3} x={880} y={1110} skala={1.45}>
        <Lik id="marija" seed="s5-marija" ime={false} />
      </Pop>
      <Pop at={nekome + 2} x={780} y={820} skala={1} rot={-4}>
        <Govor seed="s5-gov" tekst="Taman to!" velicina={66} rep={1} />
      </Pop>
      {[0, 1, 2].map((i) => (
        <Pop key={i} at={trazi - 2 + i * 4} x={760 + i * 70} y={960 - (i % 2) * 40} skala={0.5 + (i % 2) * 0.15} njihanje={6} faza={i}>
          <Srce seed={`s5-sr${i}`} />
        </Pop>
      ))}
    </Svg>
  );
};

// ── Scena 6 — „Napravi svoj prvi oglas. Dodaj sliku, šta nudiš i gde si. Iznos u POENIMA predlažeš ti." ──
const KARTA6 = { x: 540, y: 640, s: 1.5 };
const StavkaListe: React.FC<{ at: number; y: number; tekst: string; seed: string }> = ({ at, y, tekst, seed }) => {
  const f = useCurrentFrame();
  return (
    <Pop at={at - 2} x={300} y={y} rot={-1}>
      <Isecak pts={krugTacke(0, 0, 32, 12)} boja={P.zelena100} seed={`${seed}-k`} senka="mala" amp={1} korak={10} />
      <Kvacica seed={`${seed}-kv`} t={napredak(f, at, 8)} velicina={1.1} />
      <text x={56} y={22} fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={P.zelena900}>
        {tekst}
      </text>
    </Pop>
  );
};

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const napravi = kad(6, "Napravi");
  const sliku = kad(6, "sliku,");
  const nudis = kad(6, "nudiš");
  const gde = kad(6, "gde");
  const iznos = kad(6, "Iznos");
  const poenima = kad(6, "POENIMA");
  const ti = kad(6, "ti.");
  // tegla iz scene 5 (540, 760, 2.5) sleti u prozor za fotografiju kartice
  const sletanje = napredak(f, 0, 18, Easing.inOut(Easing.cubic));
  const karta = napredak(f, 2, 16, Easing.out(Easing.back(1.2)));
  const tx = interpolate(sletanje, [0, 1], [520, KARTA6.x]);
  const ty = interpolate(sletanje, [0, 1], [760, KARTA6.y + -84 * KARTA6.s]);
  const ts = interpolate(sletanje, [0, 1], [2.5, 0.8 * KARTA6.s]);
  const blic = napredak(f, sliku - 1, 8);
  const naslov = otkucano("Domaći ajvar", f, nudis - 2, 0.8);
  const mesto = f >= gde - 1 ? "Sombor" : "";
  const broj = Math.round(interpolate(f, [poenima - 2, ti + 4], [0, 800], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const k = KARTA6.s;
  return (
    <Svg>
      {/* još dva mesta za oglase */}
      {[-1, 1].map((str, i) => (
        <Pop key={i} at={napravi + 10 + i * 4} x={540 + str * 380} y={680} rot={str * 9} skala={0.95}>
          <Crta pts={[[-150, -200], [150, -200], [150, 200], [-150, 200], [-150, -200]]} seed={`s6-pr${i}`} boja={P.zelena700} debljina={6} isprekidana opacity={0.8} />
          <text x={str * 60} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={120} fill={P.zelena700} opacity={0.5}>
            +
          </text>
          <text x={str * 60} y={90} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={48} fill={P.zelena700} opacity={0.8}>
            {i ? "3." : "2."}
          </text>
        </Pop>
      ))}
      {/* kartica */}
      <g transform={`translate(${KARTA6.x} ${KARTA6.y + (1 - karta) * 80}) scale(${(k * Math.min(1.05, karta)).toFixed(4)}) rotate(${(1 - karta) * -6 + Math.sin(f / 26) * 0.6})`}>
        <Isecak pts={pravougaonik(-180, -220, 360, 440)} boja={P.belo} seed="s6-k" amp={1.6} />
        <Isecak pts={pravougaonik(-160, -200, 320, 220)} boja="#F7E2D6" seed="s6-ks" senka="bez" amp={1} />
        <text x={-156} y={72} fontFamily={SANS} fontWeight={800} fontSize={42} fill={P.tekst}>
          {naslov}
        </text>
        {!naslov && <Crta pts={[[-156, 58], [120, 58]]} seed="s6-l1" boja={P.ivica} debljina={14} />}
        {mesto ? (
          <g>
            <g transform="translate(-142 112) scale(0.55)">
              <Cioda seed="s6-pin" />
            </g>
            <text x={-120} y={122} fontFamily={SANS} fontWeight={600} fontSize={30} fill={P.siva}>
              {mesto}
            </text>
          </g>
        ) : (
          <Crta pts={[[-156, 112], [40, 112]]} seed="s6-l2" boja={P.ivica} debljina={12} />
        )}
        {f >= poenima - 2 ? (
          <text x={-156} y={180} fontFamily={SANS} fontWeight={900} fontSize={38} fill={P.zelena700}>
            {broj.toLocaleString("sr-RS")} POENA
          </text>
        ) : (
          <Crta pts={[[-156, 168], [-20, 168]]} seed="s6-l3" boja={P.ivica} debljina={12} />
        )}
      </g>
      {/* tegla u prozoru za fotografiju */}
      <g transform={`translate(${tx} ${ty}) scale(${ts})`}>
        <TeglaSa seed="s5-tegla" sadrzaj={AJVAR} poklopac={P.zlatna600} natpis2="baš ovo tražim!" natpisVelicina={24} okret={1} />
      </g>
      {blic > 0 && blic < 1 && <rect x={0} y={0} width={1080} height={1920} fill="#fff" opacity={(1 - blic) * 0.7} />}
      <Pop at={napravi - 3} x={540} y={170} rot={-2}>
        <Isecak pts={pravougaonik(-400, -74, 800, 148)} boja={P.zelena700} seed="s6-nas" amp={3} />
        <text x={0} y={26} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={74} fill={P.belo} letterSpacing={1}>
          TVOJ PRVI OGLAS
        </text>
      </Pop>
      {/* lista */}
      <StavkaListe at={sliku} y={1030} tekst="fotografija" seed="s6-c1" />
      <StavkaListe at={nudis} y={1102} tekst="šta nudiš" seed="s6-c2" />
      <StavkaListe at={gde} y={1174} tekst="mesto" seed="s6-c3" />
      <StavkaListe at={iznos + 4} y={1246} tekst="iznos u POENIMA" seed="s6-c4" />
    </Svg>
  );
};

// ── Scena 7 — „Za prvi oglas, kad prođe pregled, upisuje ti se hiljadu POENA." ──
export const Scena7: React.FC = () => {
  const f = useCurrentFrame();
  const prodje = kad(7, "prođe");
  const pregled = kad(7, "pregled,");
  const upisuje = kad(7, "upisuje");
  const hiljadu = kad(7, "hiljadu");
  const poena = kad(7, "POENA.");
  const kn = napredak(f, 0, 16, Easing.out(Easing.back(1.1)));
  const karta = napredak(f, 0, 18, Easing.inOut(Easing.cubic));
  const lupa = napredak(f, prodje - 6, pregled - prodje + 8, Easing.inOut(Easing.sin));
  const lupaOde = napredak(f, pregled + 8, 12, Easing.in(Easing.cubic));
  const zig = napredak(f, pregled + 3, 8);
  const pis1 = napredak(f, upisuje - 2, 16, Easing.linear);
  const pis2 = napredak(f, hiljadu - 2, poena - hiljadu + 14, Easing.linear);
  const poenZig = napredak(f, poena + 8, 8);
  const pero = f < upisuje - 2 ? null : pis2 > 0 && pis2 < 1 ? { x: 610 + pis2 * 330, y: 840 } : pis1 < 1 ? { x: 610 + pis1 * 300, y: 740 } : null;
  return (
    <Svg>
      {/* otvorena knjiga */}
      <g transform={`translate(540 ${760 + (1 - kn) * 900}) rotate(${(1 - kn) * 8})`}>
        <Isecak pts={[[-470, -300], [0, -280], [470, -300], [470, 300], [0, 320], [-470, 300]]} boja="#8A3A22" seed="s7-kor" amp={2} />
        <Isecak pts={[[-450, -290], [-6, -270], [-6, 300], [-450, 286]]} boja={P.belo} seed="s7-l" amp={1.6} />
        <Isecak pts={[[6, -270], [450, -290], [450, 286], [6, 300]]} boja={P.belo} seed="s7-d" amp={1.6} />
        <Crta pts={[[0, -276], [0, 310]]} seed="s7-hrb" boja="#C9B89A" debljina={6} />
        {[-120, -20, 80, 180].map((y, i) => (
          <Crta key={i} pts={[[40, y], [420, y - 4]]} seed={`s7-r${i}`} boja="#9DB7D5" debljina={3} amp={0.6} />
        ))}
        <text x={40} y={-200} fontFamily={RUKOPIS} fontWeight={700} fontSize={50} fill={P.siva}>
          zapis
        </text>
      </g>
      {/* kartica oglasa sleti na levu stranu */}
      <g transform={`translate(${interpolate(karta, [0, 1], [540, 300])} ${interpolate(karta, [0, 1], [640, 760])}) scale(${interpolate(karta, [0, 1], [1.5, 0.92])}) rotate(${-3 * karta})`}>
        <OglasKartica seed="s7-ogl" naslov="Domaći ajvar" iznos="800 POENA" pozadinaSlike="#F7E2D6" slika={<g transform="scale(0.8)"><TeglaSa seed="s7-t" sadrzaj={AJVAR} poklopac={P.zlatna600} /></g>} />
        <g transform="translate(10 -40) rotate(-14)">
          <Pecat seed="s7-pr" tekst="PREGLEDANO" t={zig} boja={P.zelena700} velicina={34} />
        </g>
      </g>
      {/* rukopis na desnoj strani */}
      <g clipPath="url(#s7-c1)">
        <text x={600} y={752} fontFamily={RUKOPIS} fontWeight={700} fontSize={70} fill={P.tekst}>
          Prvi oglas
        </text>
      </g>
      <clipPath id="s7-c1">
        <rect x={590} y={660} width={330 * pis1} height={120} />
      </clipPath>
      <clipPath id="s7-c2">
        <rect x={590} y={770} width={380 * pis2} height={120} />
      </clipPath>
      <g clipPath="url(#s7-c2)">
        <text x={600} y={858} fontFamily={RUKOPIS} fontWeight={700} fontSize={84} fill={P.zelena700}>
          1.000 POENA
        </text>
      </g>
      {pero && (
        <g transform={`translate(${pero.x} ${pero.y + Math.sin(f * 1.3) * 6}) rotate(-35)`}>
          <Isecak pts={[[0, 0], [16, -30], [36, -180], [20, -186], [-2, -40]]} boja={P.zlatna400} seed="s7-pero" senka="mala" />
          <Crta pts={[[4, -6], [12, -24]]} seed="s7-vrh" boja={P.tekst} debljina={6} />
        </g>
      )}
      {poenZig > 0 && (
        <g transform="translate(900 960) rotate(-12)">
          <Pecat seed="s7-poen" tekst="POEN" t={poenZig} boja={P.zelena700} velicina={44} />
        </g>
      )}
      {lupaOde < 1 && f >= prodje - 6 && (
        <g transform={`translate(${interpolate(lupa, [0, 1], [1200, 310]) + Math.sin(lupa * Math.PI * 3) * 70 + lupaOde * 900} ${interpolate(lupa, [0, 1], [400, 640]) + Math.cos(lupa * Math.PI * 3) * 50}) rotate(-8) scale(1.15)`}>
          <Lupa seed="s7-lupa" />
        </g>
      )}
      <Pop at={poena + 12} x={540} y={1180} rot={-2}>
        <Etiketa seed="s7-zod" tekst="zapis o doprinosu" velicina={58} boja={P.zelena900} />
      </Pop>
    </Svg>
  );
};

// ── Scena 8 — „KOLO prima samo ljude koji su stvarni. Dok te niko ne potvrdi, ne možeš da se
// javljaš na tuđe oglase, ali drugi mogu da se jave tebi. Zato je tvoj prvi oglas ulaz u KOLO." ──
const Vrata: React.FC<{ seed: string; otvorena: number; children?: React.ReactNode }> = ({ seed, otvorena, children }) => (
  <g>
    <Isecak pts={pravougaonik(-190, -330, 380, 660)} boja="#EFE2C4" seed={`${seed}-zid`} amp={2} />
    <Isecak pts={pravougaonik(-150, -290, 300, 620)} boja="#3A2A1E" seed={`${seed}-otvor`} senka="bez" amp={1.4} />
    {/* toplo svetlo iznutra */}
    <rect x={-150} y={-290} width={300} height={620} fill={P.sunce} opacity={0.5 * otvorena} />
    {children}
    <g transform={`translate(-150 0) scale(${(1 - otvorena * 0.82).toFixed(3)} 1) translate(150 0)`}>
      <Isecak pts={pravougaonik(-150, -290, 300, 620)} boja="#9A5F32" seed={`${seed}-krilo`} amp={1.6} />
      <Isecak pts={pravougaonik(-116, -250, 232, 240)} boja="#8A5024" seed={`${seed}-p1`} senka="bez" amp={1} />
      <Isecak pts={pravougaonik(-116, 30, 232, 250)} boja="#8A5024" seed={`${seed}-p2`} senka="bez" amp={1} />
      <circle cx={110} cy={20} r={13} fill={P.zlatna400} />
    </g>
  </g>
);

export const Scena8: React.FC = () => {
  const f = useCurrentFrame();
  const kolo = kad(8, "KOLO");
  const stvarni = kad(8, "stvarni.");
  const dok = kad(8, "Dok");
  const javljas = kad(8, "javljaš");
  const tudje = kad(8, "tuđe");
  const ali = kad(8, "ali");
  const drugi = kad(8, "drugi");
  const jave = kad(8, "jave");
  const zato = kad(8, "Zato");
  const ulaz = kad(8, "ulaz");
  const kolo2 = kad(8, "KOLO.", 2);
  const deo1 = f < dok - 4;
  const deo2 = f >= dok - 12 && f < ali;
  const deo3 = f >= ali - 12;
  const ode1 = napredak(f, dok - 12, 14, Easing.in(Easing.cubic));
  const ode2 = napredak(f, ali - 8, 12, Easing.in(Easing.cubic));
  const ulaz3 = napredak(f, ali - 8, 16, Easing.out(Easing.back(1.1)));
  const otvori = napredak(f, zato, 14, Easing.out(Easing.cubic));
  const prilazi = napredak(f, ulaz - 8, 14, Easing.inOut(Easing.cubic));
  const koloKraj = napredak(f, kolo2 - 6, 16, Easing.out(Easing.cubic));
  const ml = LIKOVI.milan;
  return (
    <Svg>
      {/* 1: kolo stvarnih ljudi */}
      {(deo1 || ode1 < 1) && (
        <g transform={`translate(0 ${-ode1 * 900})`} opacity={1 - ode1}>
          <Pop at={kolo - 4} x={540} y={420} skala={0.62} njihanje={1.5}>
            <LogoZnak seed="s8-logo" r={110} />
          </Pop>
          <Kolo seed="s8-kolo" geo={{ cx: 540, cy: 900, rx: 340, ry: 120, ugao: 200, skala: 1.1, n: 6 }} pojava={[0, 1, 2, 3, 4, 5].map((i) => kolo + i * 3)} ruke={kolo + 20} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = ((200 + i * 60) * Math.PI) / 180;
            const x = 540 + Math.cos(a) * 340;
            const y = 900 + Math.sin(a) * 120 - 250;
            return (
              <Pop key={i} at={stvarni - 4 + i * 2} x={x} y={y} skala={0.8}>
                <Isecak pts={krugTacke(0, 0, 30, 12)} boja={P.belo} seed={`s8-kk${i}`} senka="mala" amp={1} korak={10} />
                <Kvacica seed={`s8-kv${i}`} t={napredak(f, stvarni - 2 + i * 2, 6)} velicina={0.9} />
              </Pop>
            );
          })}
          <Pop at={stvarni} x={540} y={1180} rot={-2}>
            <Etiketa seed="s8-stv" tekst="stvarni ljudi" velicina={64} boja={P.zelena900} />
          </Pop>
        </g>
      )}
      {/* 2: nov član ne može sam da se javi */}
      {deo2 && (
        <g transform={`translate(${-ode2 * 1100} 0)`}>
          <Pop at={dok - 8} x={260} y={900} skala={1.55}>
            <TiLik seed="s8-ti" popuna={1} osmeh={f > tudje ? 0 : 1} />
            <Status seed="s8-nov" tekst="nov član" />
          </Pop>
          <Pop at={dok - 4} x={780} y={760} skala={1.05} rot={4}>
            <OglasKartica seed="s8-jaja" naslov="Domaća jaja" iznos="po dogovoru" pozadinaSlike="#E6F0D8" slika={<g transform="scale(0.8) translate(0 50)"><KorpaJaja seed="s8-kj" /></g>} />
          </Pop>
          <Pop at={javljas - 3} x={340} y={560} rot={-3}>
            <Govor seed="s8-gov" tekst="Javljam se!" velicina={56} rep={-1} />
          </Pop>
          {f >= tudje && (
            <g transform="translate(340 560)">
              <Iks seed="s8-iks" t={napredak(f, tudje, 10)} w={150} h={70} />
            </g>
          )}
        </g>
      )}
      {/* 3: drugi se javljaju tebi — vrata, kuc-kuc, rukovanje, kolo */}
      {deo3 && (
        <g transform={`translate(${(1 - ulaz3) * 1100} 0)`} opacity={1 - koloKraj * 0.9}>
          <g transform="translate(360 830)">
            <Vrata seed="s8-vr" otvorena={otvori}>
              {otvori > 0.2 && (
                <g transform={`translate(${prilazi * 110} ${150}) scale(1.3)`} opacity={Math.min(1, (otvori - 0.2) * 3)}>
                  <TiLik seed="s8-ti3" popuna={1} />
                </g>
              )}
            </Vrata>
            {/* oglas na vratima */}
            <g transform={`translate(${otvori * -100} -110) rotate(${-4 + otvori * -8}) scale(${0.52 * (1 - otvori * 0.3)})`}>
              <OglasKartica seed="s8-ogl" naslov="Domaći ajvar" iznos="800 POENA" pozadinaSlike="#F7E2D6" slika={<g transform="scale(0.8)"><TeglaSa seed="s8-t" sadrzaj={AJVAR} poklopac={P.zlatna600} /></g>} />
            </g>
          </g>
          <g transform={`translate(${860 - prilazi * 150} 920)`}>
            <Pop at={drugi - 4} x={0} y={0} skala={1.5}>
              <Osoba seed="s8-milan" boja={ml.boja} glava={ml.glava} />
            </Pop>
          </g>
          {[0, 1].map((i) => (
            <Pop key={i} at={drugi + 2 + i * 6} x={600 + i * 40} y={560 - i * 70} rot={i ? 8 : -6} skala={0.9}>
              <text x={0} y={0} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={72} fill={P.korala600}>
                kuc!
              </text>
            </Pop>
          ))}
          {f < zato + 10 && (
            <Pop at={jave - 3} x={780} y={620} rot={3}>
              <Govor seed="s8-gov2" tekst="Javljam se za ajvar!" velicina={48} rep={1} />
            </Pop>
          )}
          {f >= ulaz && (
            <g>
              <Pop at={ulaz} x={600} y={720} skala={1.1}>
                <Isecak pts={krugTacke(0, 0, 50, 14)} boja={P.belo} seed="s8-kvk" senka="mala" amp={1} korak={10} />
                <Kvacica seed="s8-kv" t={napredak(f, ulaz + 2, 8)} velicina={1.4} />
              </Pop>
            </g>
          )}
        </g>
      )}
      {koloKraj > 0 && (
        <g opacity={koloKraj}>
          <Kolo
            seed="s8-kolo2"
            geo={{ cx: 540, cy: 960, rx: 340, ry: 120, ugao: 200, skala: 1.1, n: 6 }}
            pojava={[0, 1, 2, 3, 4, 5].map((i) => kolo2 - 6 + i * 2)}
            ruke={kolo2 + 8}
            osobe={[OSOBE_KOLA[0], OSOBE_KOLA[1], TI, OSOBE_KOLA[2], OSOBE_KOLA[3], { boja: P.more, glava: { frizura: "marama" } }]}
            istaknuti={{ 2: 1 }}
          />
          {f < kolo2 + 40 && <Iskre seed="s8-isk" x={540} y={820} t={napredak(f, kolo2 + 6, 34)} r={480} n={12} />}
        </g>
      )}
      {/* natpis ostaje i kad vrata izblede u kolo */}
      <Pop at={ulaz + 6} x={560} y={1210} rot={-3}>
        <Etiketa seed="s8-ulaz" tekst="ulaz u KOLO" velicina={64} boja={P.belo} pozadina={P.zelena700} />
      </Pop>
    </Svg>
  );
};

// ── Scena 9 — „Pali svetlo u svojoj kući. Uđi u KOLO, registracija je besplatna. ekolo.rs" ──
const KUCICE: { x: number; y: number; s: number }[] = (() => {
  const out: { x: number; y: number; s: number }[] = [];
  for (let i = 0; i < 70; i++) {
    const x = 60 + random(`kx${i}`) * 960;
    const y = 220 + random(`ky${i}`) * 1640;
    if (Math.hypot(x - 540, y - 980) < 150 || Math.hypot(x - 800, y - 330) < 170 || out.some((o) => Math.hypot(o.x - x, o.y - y) < 95)) continue;
    out.push({ x, y, s: 0.7 + ((i * 31) % 10) / 20 });
  }
  return out;
})();
const MOJA = { x: 540, y: 980 };

const Kucica: React.FC<{ seed: string; svetlo: number; boja?: string }> = ({ seed, svetlo, boja = "#3E4A66" }) => (
  <g>
    {svetlo > 0 && <circle cx={0} cy={-30} r={80} fill={P.sunce} opacity={0.28 * svetlo} />}
    <Isecak pts={[[-44, -50], [0, -88], [44, -50]]} boja={svetlo > 0.5 ? P.korala600 : "#4A3A44"} seed={`${seed}-k`} senka="mala" amp={1} korak={12} />
    <Isecak pts={pravougaonik(-36, -52, 72, 56)} boja={svetlo > 0.5 ? "#EFE2C4" : boja} seed={`${seed}-z`} senka="mala" amp={1} korak={12} />
    <Isecak pts={pravougaonik(-16, -38, 32, 26)} boja={svetlo > 0.5 ? "#FFE58A" : "#1C2233"} seed={`${seed}-p`} senka="bez" amp={0.6} korak={8} />
  </g>
);

export const Scena9: React.FC = () => {
  const f = useCurrentFrame();
  const svetlo = kad(9, "svetlo");
  const udji = kad(9, "Uđi");
  const besplatna = kad(9, "besplatna.");
  const ekolo = kad(9, "ekolo.rs");
  const AKORD = Math.round(66.43 * FPS) - scena(9).odF;
  const zum = napredak(f, svetlo, besplatna - svetlo + 10, Easing.inOut(Easing.cubic));
  const s = interpolate(zum, [0, 1], [2.3, 1]);
  const sy = interpolate(zum, [0, 1], [760, MOJA.y]);
  const tr = `translate(${540 - MOJA.x * s} ${sy - MOJA.y * s}) scale(${s})`;
  const moja = paljenje(f, svetlo - 1);
  const kraj = napredak(f, ekolo - 8, 14);
  const cta = usePop(ekolo - 2, 150);
  const udar = Math.max(0, 1 - Math.abs(f - AKORD) / 8);
  return (
    <Svg>
      <DefsNalepnica />
      <rect x={0} y={0} width={1080} height={1920} fill="#1E2740" />
      <Zvezde seed="s9-z" w={1080} h={1920} n={70} />
      <g transform={tr}>
        {/* papirna mapa kraja */}
        <Isecak pts={[[-40, 140], [1120, 120], [1120, 1960], [-40, 1960]]} boja="#2E3D5C" seed="s9-mapa" amp={4} korak={40} />
        <Crta pts={[[60, 140], [140, 600], [90, 900], [180, 1300], [110, 1700], [160, 1960]]} seed="s9-reka" boja="#4C7FB0" debljina={40} korak={60} amp={4} />
        {[
          [[0, 980], [1080, 960]],
          [[540, 140], [560, 1960]],
          [[200, 300], [1000, 1800]],
          [[950, 200], [200, 1900]],
        ].map((p, i) => (
          <Crta key={i} pts={p as [number, number][]} seed={`s9-put${i}`} boja="#56668A" debljina={10} korak={60} amp={3} />
        ))}
        <g transform="translate(800 330)">
          <Slika ime="zupanija" sirina={300} seed="s9-zup" />
        </g>
        <g transform="translate(800 380) rotate(-3)">
          <Etiketa seed="s9-sombor" tekst="Sombor" velicina={44} boja={P.zelena900} />
        </g>
        {KUCICE.map((k, i) => {
          const d = Math.hypot(k.x - MOJA.x, k.y - MOJA.y) / 900;
          const at = udji - 4 + d * (besplatna - udji + 14) + (i % 3) * 2;
          return (
            <g key={i} transform={`translate(${k.x} ${k.y}) scale(${k.s})`}>
              <Kucica seed={`s9-k${i}`} svetlo={paljenje(f, Math.round(at))} />
            </g>
          );
        })}
        <g transform={`translate(${MOJA.x} ${MOJA.y}) scale(1.6)`}>
          <Kucica seed="s9-moja" svetlo={moja} />
        </g>
        {moja > 0 && f < udji + 20 && (
          <g transform={`translate(${MOJA.x} ${MOJA.y + 50}) rotate(-3)`}>
            <Etiketa seed="s9-ti" tekst="ti" velicina={40} boja={P.zelena900} />
          </g>
        )}
      </g>
      {/* završna kartica */}
      {kraj > 0 && <rect x={0} y={0} width={1080} height={1920} fill="#1E2740" opacity={0.62 * kraj} />}
      {cta > 0 && (
        <g>
          <g transform={`translate(540 520) scale(${(cta * 0.7 * (1 + 0.12 * udar)).toFixed(4)})`}>
            <LogoZnak seed="s9-logo" r={120} />
          </g>
          <g transform={`translate(540 790) rotate(${-2 + (1 - cta) * -6}) scale(${cta.toFixed(4)})`}>
            <text x={0} y={0} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={96} fill={P.zlatna400}>
              Uđi u KOLO
            </text>
          </g>
          <g transform={`translate(540 1000) rotate(${-1.5 + (1 - cta) * 8}) scale(${(cta * (1 + 0.08 * udar)).toFixed(4)})`}>
            <Isecak pts={pravougaonik(-440, -110, 880, 200)} boja={P.zelena700} seed="s9-cta" amp={3} />
            <text x={0} y={36} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={124} fill={P.belo}>
              ekolo.rs
            </text>
          </g>
          <Pop at={ekolo + 8} x={540} y={1180} rot={2}>
            <Etiketa seed="s9-bes" tekst="registracija je besplatna" velicina={56} boja={P.zelena900} pozadina={P.zlatna400} />
          </Pop>
        </g>
      )}
      <Konfete seed="s9-konf" x={540} y={1000} t={napredak(f, AKORD, 50, Easing.out(Easing.quad))} n={28} r={620} />
    </Svg>
  );
};

export const trajanje = trajanjeF;
