// Video 3 „Potvrda nosi odgovornost“ u papirnom kolažu, kao prve animacije serije i kao
// „Čiji si ti“ (odluka vlasnika, 29.09.2026: tuš i akvarel je odbačen). Glavni lik je seoski
// bunar sa đeramom: voda u njemu je bistra, zamuti se od lažne potvrde i ponovo se razbistri.
// Animacije se kače na izgovorene reči.
import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { P } from "../v1k/paleta";
import { Crta, Defs, Isecak, Pop, Pt, krugTacke, napredak, pravougaonik, usePop } from "../v1k/papir";
import { Drvo, Etiketa, GlavaCfg, Kuca, Oblak, Osoba, Sunce, Upitnik } from "../v1k/likovi";
import { Govor, Kapija, Ograda, Pecat, Srce } from "../v1k/selo";
import { Kolo, LogoZnak, OSOBE } from "../v1k/kolo";
import { EkranPotvrde } from "../v1/stvari";
import { kad } from "../v3/vreme";
import { RUKOPIS, SANS } from "../fontovi";

type L = { boja: string; glava: GlavaCfg };
const BAKA: L = { boja: P.slezova, glava: { frizura: "marama", naocare: true } };
const DOMACIN: L = { boja: P.zelena700, glava: { frizura: "cela", kosa: P.kosaSeda, brkovi: true } };
const SNAJA: L = { boja: P.korala, glava: { frizura: "rep", kosa: P.kosaSmedja } };
const MOMAK: L = { boja: P.nebo, glava: { frizura: "kratka", kosa: P.kosaSmedja } };
const KOMSIJA: L = { boja: P.narandza, glava: { frizura: "kapa", brkovi: true, koza: P.koza2 } };
const DRUG: L = { boja: P.more, glava: { frizura: "kratka", kosa: P.kosaTamna } };

const VODA = "#5FA8D3";
const MULJ = "#8A6A3C";
const voda = (mutno: number) => interpolateColors(Math.min(1, Math.max(0, mutno)), [0, 1], [VODA, MULJ]);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);

const Lik: React.FC<{ l: L; x: number; y: number; s: number; seed: string; osmeh?: number; hod?: boolean }> = ({ l, x, y, s, seed, osmeh = 1, hod }) => {
  const f = useCurrentFrame();
  const dy = hod ? -Math.abs(Math.sin(f / 4)) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${s}) rotate(${hod ? Math.sin(f / 4) * 3 : 0})`}>
      <Osoba seed={seed} boja={l.boja} glava={{ ...l.glava, osmeh }} />
    </g>
  );
};

const Trava: React.FC<{ y: number; seed: string; boja?: string }> = ({ y, seed, boja = P.trava }) => (
  <Isecak pts={[[-40, y], [300, y - 12], [700, y + 6], [1120, y - 8], [1120, y + 240], [-40, y + 240]]} boja={boja} seed={seed} amp={4} korak={40} />
);

/** Kovitlac mulja u vodi: nekoliko smeđih zareza koji se vrte. */
const Kovitlac: React.FC<{ cx: number; cy: number; rx: number; ry: number; jacina: number; seed: string }> = ({ cx, cy, rx, ry, jacina, seed }) => {
  const f = useCurrentFrame();
  if (jacina <= 0.02) return null;
  return (
    <g opacity={Math.min(1, jacina * 1.4)}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = f / 18 + (i / 5) * Math.PI * 2;
        const r = 0.35 + (i % 3) * 0.2;
        const x = cx + Math.cos(a) * rx * r;
        const y = cy + Math.sin(a) * ry * r;
        return <Crta key={i} pts={[[x - 26, y], [x, y - 7], [x + 26, y]]} seed={`${seed}-k${i}`} boja="#5E4524" debljina={6} opacity={0.7} />;
      })}
    </g>
  );
};

/** Seoski bunar sa đeramom (kamen, drvo, konop, vedro). Tačka (0,0) je dno zida bunara. */
const Bunar: React.FC<{ seed: string; mutno: number; nagib?: number; kolo?: number }> = ({ seed, mutno, nagib = 0, kolo = 0 }) => {
  const kamenje: Pt[] = [
    [-150, -40], [-80, -48], [-8, -44], [66, -48], [138, -40],
    [-118, -100], [-44, -104], [30, -100], [104, -104],
    [-150, -158], [-78, -162], [-4, -158], [70, -162], [140, -156],
  ];
  // đeram: stub desno, greda se klacka oko vrha stuba
  const piv: Pt = [300, -560];
  const ugao = -14 + nagib;
  const r = (ugao * Math.PI) / 180;
  const kraj: Pt = [piv[0] - Math.cos(r) * 470, piv[1] + Math.sin(r) * 470];
  const vedroY = Math.min(-230, kraj[1] + 240);
  return (
    <g>
      {/* stub đerma */}
      <Isecak pts={[[282, 0], [318, 0], [312, -560], [288, -560]]} boja="#8A5A34" seed={`${seed}-stub`} />
      <Isecak pts={[[270, -560], [300, -610], [330, -560]]} boja="#6B4424" seed={`${seed}-racva`} senka="mala" />
      {/* greda */}
      <g transform={`translate(${piv[0]} ${piv[1]}) rotate(${-ugao})`}>
        <Isecak pts={pravougaonik(-470, -12, 640, 24)} boja="#A06B3E" seed={`${seed}-greda`} amp={1.6} />
        <Isecak pts={pravougaonik(120, -30, 70, 60)} boja={P.siva} seed={`${seed}-teg`} senka="mala" />
      </g>
      {/* konop i vedro */}
      <Crta pts={[kraj, [kraj[0], vedroY - 40]]} seed={`${seed}-konop`} boja="#5B4630" debljina={4} amp={0.8} />
      <g transform={`translate(${kraj[0]} ${vedroY})`}>
        <Isecak pts={[[-38, -40], [38, -40], [30, 30], [-30, 30]]} boja="#9C7C54" seed={`${seed}-vedro`} senka="mala" />
        <Crta pts={[[-38, -40], [0, -70], [38, -40]]} seed={`${seed}-drska`} boja="#5B4630" debljina={4} />
      </g>
      {/* zid bunara */}
      <Isecak pts={[[-175, 0], [-175, -190], [175, -190], [175, 0]]} boja="#B9B2A5" seed={`${seed}-zid`} amp={2} />
      {kamenje.map(([x, y], i) => (
        <Isecak key={i} pts={krugTacke(x, y, 34, 10, 22)} boja={i % 3 ? "#D2CBBE" : "#A39B8D"} seed={`${seed}-kam${i}`} senka="mala" amp={2} />
      ))}
      {/* otvor i voda */}
      <Isecak pts={krugTacke(0, -196, 190, 26, 52)} boja="#8F887B" seed={`${seed}-venac`} amp={2} />
      <Isecak pts={krugTacke(0, -192, 150, 24, 36)} boja={voda(mutno)} seed={`${seed}-voda`} senka="bez" amp={1.6} zrno={0.3} />
      <Kovitlac cx={0} cy={-192} rx={130} ry={30} jacina={mutno} seed={`${seed}-kov`} />
      {mutno < 0.4 && <path d="M-70,-200 q30,-10 60,0" stroke="#fff" strokeWidth={5} fill="none" opacity={0.7 * (1 - mutno * 2.5)} strokeLinecap="round" />}
      {/* tabla KOLO na zidu */}
      {kolo > 0 && (
        <g transform={`translate(0 -96) rotate(-3) scale(${kolo})`}>
          <Isecak pts={pravougaonik(-120, -44, 240, 88)} boja={P.zelena700} seed={`${seed}-tabla`} amp={1.6} />
          <text y={20} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={58} fill="#fff" letterSpacing={2}>
            KOLO
          </text>
        </g>
      )}
    </g>
  );
};

/** Selo u pozadini: sunce, oblak, kuće, drvo, trava. */
const Selo: React.FC<{ sunce?: boolean }> = ({ sunce = true }) => (
  <g>
    {sunce && (
      <g transform="translate(900 560) scale(0.75)">
        <Sunce seed="s-sunce" />
      </g>
    )}
    <g transform="translate(200 540) scale(0.85)">
      <Oblak seed="s-oblak" />
    </g>
    {[110, 330, 760].map((x, i) => (
      <g key={x} transform={`translate(${x} 1000)`}>
        <Kuca seed={`s-k${i}`} fasada={[P.belo, P.sunce, P.roze][i]} sirina={190} visina={130} />
      </g>
    ))}
    <g transform="translate(990 1020)">
      <Drvo seed="s-drvo" visina={1.4} />
    </g>
    <Trava y={1000} seed="s-trava" />
  </g>
);

/** Voda izbliza u vedru (scena 1). */
const VedroIzbliza: React.FC<{ mutno: number }> = ({ mutno }) => (
  <g>
    <Isecak pts={[[-330, -230], [330, -230], [270, 330], [-270, 330]]} boja="#9C7C54" seed="vi-telo" amp={3} />
    {[-120, 60, 240].map((y, i) => (
      <Isecak key={i} pts={pravougaonik(-330 + (y + 230) * 0.1, y, 660 - (y + 230) * 0.2, 26)} boja="#6E5638" seed={`vi-obruc${i}`} senka="mala" amp={1.4} />
    ))}
    <Isecak pts={krugTacke(0, -230, 330, 30, 78)} boja="#6E5638" seed="vi-ivica" amp={2} />
    <Isecak pts={krugTacke(0, -226, 300, 30, 62)} boja={voda(mutno)} seed="vi-voda" senka="bez" amp={2} zrno={0.3} />
    <Kovitlac cx={0} cy={-226} rx={260} ry={52} jacina={mutno} seed="vi-kov" />
    {mutno < 0.4 && <path d="M-160,-250 q70,-20 140,0 M40,-210 q50,-14 100,0" stroke="#fff" strokeWidth={8} fill="none" opacity={0.75 * (1 - mutno * 2.5)} strokeLinecap="round" />}
  </g>
);

// ── 1 ── Bunar koji smo zajedno iskopali može da se zamuti.
export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const kZajedno = kad(1, "zajedno");
  const kMoze = kad(1, "može");
  const kZamuti = kad(1, "zamuti");
  const pad = napredak(f, kMoze - 4, kZamuti - kMoze + 4, Easing.in(Easing.quad));
  const mutno = napredak(f, kZamuti, 40, Easing.out(Easing.cubic));
  const kapY = interpolate(pad, [0, 1], [160, 700]);
  const talas = f >= kZamuti ? napredak(f, kZamuti, 26) : 0;
  const ruke = [
    { l: DOMACIN, x: 170, y: 520 },
    { l: SNAJA, x: 910, y: 520 },
    { l: BAKA, x: 150, y: 1180 },
    { l: KOMSIJA, x: 930, y: 1180 },
  ];
  return (
    <Svg>
      <g transform="translate(540 1000)">
        <VedroIzbliza mutno={mutno} />
      </g>
      {ruke.map((r, i) => (
        <Pop key={i} at={kZajedno + i * 3} x={r.x} y={r.y} rot={i % 2 ? 6 : -6}>
          <g transform="scale(1.05)">
            <Osoba seed={`s1-o${i}`} boja={r.l.boja} glava={{ ...r.l.glava, osmeh: f >= kZamuti + 10 ? 0 : 1 }} />
          </g>
        </Pop>
      ))}
      {pad > 0 && f < kZamuti + 2 && <Isecak pts={[[540, kapY - 46], [566, kapY + 4], [540, kapY + 22], [514, kapY + 4]]} boja={MULJ} seed="s1-kap" senka="mala" korak={12} />}
      {talas > 0 && talas < 1 && (
        <ellipse cx={540} cy={774} rx={60 + talas * 260} ry={14 + talas * 50} fill="none" stroke="#5E4524" strokeWidth={8 * (1 - talas)} opacity={1 - talas} />
      )}
    </Svg>
  );
};

// ── 2 ── KOLO je taj bunar. Iz njega pije svako i svako ga čuva.
export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const kKolo = kad(2, "KOLO");
  const kPije = kad(2, "pije");
  const kCuva = kad(2, "čuva");
  const kolo = usePop(kKolo + 2);
  const nagib = f > kPije - 8 ? Math.sin((f - kPije + 8) / 14) * 12 : 0;
  const ljudi: [L, number, number][] = [
    [BAKA, 120, 1120],
    [DOMACIN, 270, 1150],
    [SNAJA, 820, 1150],
    [MOMAK, 970, 1120],
  ];
  return (
    <Svg>
      <Selo />
      <g transform="translate(520 1290) scale(1.15)">
        <Bunar seed="b2" mutno={0} nagib={nagib} kolo={f >= kKolo ? kolo : 0} />
      </g>
      {ljudi.map(([l, x, y], i) => (
        <Pop key={i} at={kPije - 6 + i * 3} x={x} y={y}>
          <g transform="scale(1.3)">
            <Osoba seed={`s2-o${i}`} boja={l.boja} glava={l.glava} />
          </g>
        </Pop>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Pop key={i} at={kCuva + i * 3} x={ljudi[i][1] + (i < 2 ? 70 : -70)} y={ljudi[i][2] - 150}>
          <Srce seed={`s2-sr${i}`} r={30} />
        </Pop>
      ))}
    </Svg>
  );
};

// ── 3 ── Kad potvrdiš nekoga koga ne znaš ili nekoga ko ne postoji, otvaraš vrata prevari i
//        zloupotrebi. Bunar se muti. Za sve nas.
const Telefon: React.FC<{ seed: string; children?: React.ReactNode }> = ({ seed, children }) => (
  <g>
    <Isecak pts={pravougaonik(-160, -310, 320, 620)} boja="#2b3a2f" seed={`${seed}-t`} amp={2} />
    <rect x={-134} y={-272} width={268} height={544} rx={18} fill="#FFFDF7" />
    {children}
  </g>
);

/** Neznanac: siva papirna silueta sa upitnikom; `bledi` ga pravi providnim (neko ko ne postoji). */
const Neznanac: React.FC<{ seed: string; bledi: number }> = ({ seed, bledi }) => (
  <g opacity={1 - bledi * 0.65}>
    <Isecak pts={[[-44, 0], [44, 0], [66, 110], [-66, 110]]} boja="#8C877E" seed={`${seed}-t`} />
    <Isecak pts={krugTacke(0, -40, 44, 14)} boja="#A7A298" seed={`${seed}-g`} />
    <text x={0} y={-18} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={70} fill="#fff">
      ?
    </text>
  </g>
);

export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const kPotvrdis = kad(3, "potvrdiš");
  const kZnas = kad(3, "znaš");
  const kPostoji = kad(3, "postoji");
  const kVrata = kad(3, "vrata");
  const kPrevari = kad(3, "prevari");
  const kZlo = kad(3, "zloupotrebi");
  const kMuti = kad(3, "muti");
  const kZa = kad(3, "Za");
  const telefonOde = napredak(f, kVrata - 8, 12);
  const otvor = napredak(f, kVrata, 14);
  const ulaz = napredak(f, kVrata + 6, kMuti - kVrata, Easing.inOut(Easing.quad));
  const mutno = napredak(f, kMuti - 6, 36);
  const brinu = f >= kZa - 4;
  const x1 = interpolate(ulaz, [0, 1], [-80, 330]);
  const tel = usePop(kPotvrdis - 10);
  return (
    <Svg>
      <Selo sunce={false} />
      <g transform="translate(560 1290) scale(1.15)">
        <Bunar seed="b3" mutno={mutno} kolo={1} />
      </g>
      {/* kapija levo, otvara se na „vrata“ */}
      <g transform="translate(-40 1290)">
        <Ograda seed="s3-og" od={0} do={120} visina={130} />
      </g>
      <g transform={`translate(150 1290) scale(${1 - otvor * 0.9} 1)`}>
        <Isecak pts={pravougaonik(-60, -170, 120, 170)} boja="#8A5A34" seed="s3-vr" amp={1.4} />
      </g>
      {f >= kVrata && (
        <g>
          <g transform={`translate(${x1} ${1150}) scale(1.35)`}>
            <Neznanac seed="n1" bledi={0} />
          </g>
          <g transform={`translate(${x1 - 170} ${1170}) scale(1.35)`}>
            <Neznanac seed="n2" bledi={1} />
          </g>
        </g>
      )}
      <Lik l={SNAJA} x={840} y={1130} s={1.3} seed="s3-sn" osmeh={brinu ? 0 : 1} />
      <Lik l={BAKA} x={975} y={1150} s={1.3} seed="s3-ba" osmeh={brinu ? 0 : 1} />
      {f >= kPrevari - 2 && (
        <Pop at={kPrevari - 2} x={400} y={560} rot={-5}>
          <Etiketa seed="s3-e1" tekst="prevara" boja={P.korala600} velicina={62} />
        </Pop>
      )}
      {f >= kZlo - 2 && (
        <Pop at={kZlo - 2} x={700} y={640} rot={4}>
          <Etiketa seed="s3-e2" tekst="zloupotreba" boja={P.korala600} velicina={62} />
        </Pop>
      )}
      {/* telefon: potvrda nekoga koga ne znaš */}
      {telefonOde < 1 && (
        <g transform={`translate(540 ${760 - telefonOde * 80}) scale(${tel * 0.95})`} opacity={1 - telefonOde}>
          <Telefon seed="s3-tel">
            <EkranPotvrde pseudonim="???" kvacica={f >= kZnas ? 1 : 0} pritisak={napredak(f, kPostoji - 4, 8)} gotovo={f >= kPostoji + 6 ? 1 : 0} />
          </Telefon>
        </g>
      )}
      {f >= kZnas - 2 && telefonOde < 1 && (
        <g opacity={1 - telefonOde}>
          <Pop at={kZnas - 2} x={240} y={560}>
            <Upitnik seed="s3-up" velicina={0.8} boja={P.korala} />
          </Pop>
        </g>
      )}
    </Svg>
  );
};

// ── 4 ── Ako nekoga potvrdiš, puštaš ga do našeg bunara. Kažeš: „Znam ga lično.“
export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const kPustas = kad(4, "puštaš");
  const kKazes = kad(4, "Kažeš");
  const kLicno = kad(4, "lično");
  const dolaze = napredak(f, kPustas - 10, 40, Easing.out(Easing.quad));
  const mutno = 1 - napredak(f, kLicno, 40);
  const xd = interpolate(dolaze, [0, 1], [-160, 330]);
  const xm = interpolate(dolaze, [0, 1], [-320, 170]);
  return (
    <Svg>
      <Selo />
      <g transform="translate(610 1290) scale(1.15)">
        <Bunar seed="b4" mutno={mutno} kolo={1} />
      </g>
      <g transform="translate(150 1290)">
        <Isecak pts={pravougaonik(-60, -170, 12, 170)} boja="#8A5A34" seed="s4-vr" amp={1.4} />
      </g>
      <Lik l={BAKA} x={975} y={1150} s={1.3} seed="s4-ba" osmeh={f >= kLicno ? 1 : 0} />
      <Lik l={DRUG} x={xd} y={1130} s={1.4} seed="s4-dr" hod={dolaze > 0 && dolaze < 1} />
      <Lik l={MOMAK} x={xm} y={1120} s={1.45} seed="s4-mo" hod={dolaze > 0 && dolaze < 1} />
      {f >= kKazes - 2 && (
        <Pop at={kKazes - 2} x={420} y={620}>
          <Govor seed="s4-g" tekst="„Znam ga lično.“" velicina={64} rep={-1} />
        </Pop>
      )}
      <Pop at={kLicno + 6} x={250} y={900}>
        <Srce seed="s4-sr" r={46} />
      </Pop>
    </Svg>
  );
};

// ── 5 ── Nisi odgovoran za sve što on kasnije uradi. Ali odgovaraš za jedno: da ga lično poznaješ.
const Kartica: React.FC<{ seed: string; boja: string; tekstBoja: string; naslov: string[]; tekst: string[] }> = ({ seed, boja, tekstBoja, naslov, tekst }) => (
  <g>
    <Isecak pts={pravougaonik(-230, -330, 460, 660)} boja={boja} seed={`${seed}-k`} amp={2} />
    {naslov.map((r, i) => (
      <text key={i} x={0} y={-200 + i * 70} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={60} fill={tekstBoja}>
        {r}
      </text>
    ))}
    <Crta pts={[[-160, -90], [160, -90]]} seed={`${seed}-c`} boja={tekstBoja} debljina={4} opacity={0.5} />
    {tekst.map((r, i) => (
      <text key={i} x={0} y={0 + i * 80} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={72} fill={tekstBoja}>
        {r}
      </text>
    ))}
  </g>
);

export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const kNisi = kad(5, "Nisi");
  const kAli = kad(5, "Ali");
  const kLicno = kad(5, "lično");
  const desno = napredak(f, kAli - 4, 14);
  return (
    <Svg>
      <g opacity={1 - desno * 0.35}>
        <Pop at={kNisi - 4} x={290} y={820} rot={-4}>
          <Kartica seed="s5-a" boja={P.belo} tekstBoja={P.siva} naslov={["NISI", "ODGOVORAN"]} tekst={["za sve što", "on kasnije", "uradi"]} />
        </Pop>
      </g>
      <Pop at={kAli - 4} x={790} y={820} rot={3}>
        <Kartica seed="s5-b" boja={P.zelena700} tekstBoja="#fff" naslov={["ODGOVARAŠ", "za jedno:"]} tekst={["da ga", "lično", "poznaješ"]} />
      </Pop>
      <g transform="translate(790 1230) rotate(-6)">
        <Pecat seed="s5-p" tekst="ZNAM GA" t={napredak(f, kLicno + 4, 10, Easing.out(Easing.cubic))} boja={P.zelena700} velicina={52} />
      </g>
    </Svg>
  );
};

// ── 6 ── Potvrdi samo one koje znaš. Tako bunar ostaje čist za sve koji su pošteni. ekolo.rs
export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const kPotvrdi = kad(6, "Potvrdi");
  const kCist = kad(6, "čist");
  const kEkolo = kad(6, "ekolo.rs");
  const kraj = napredak(f, kEkolo - 18, 14);
  const adresa = usePop(kEkolo - 3);
  const dugme = usePop(kEkolo + 8);
  const iskre = f >= kCist ? napredak(f, kCist, 36) : 0;
  const ljudi: [L, number, number][] = [
    [MOMAK, 110, 1120],
    [DRUG, 250, 1150],
    [BAKA, 830, 1150],
    [DOMACIN, 970, 1120],
  ];
  return (
    <Svg>
      {kraj < 1 && (
        <g opacity={1 - kraj}>
          <Selo />
          <g transform="translate(540 1290) scale(1.15)">
            <Bunar seed="b6" mutno={0} kolo={1} nagib={Math.sin(f / 16) * 6} />
          </g>
          {ljudi.map(([l, x, y], i) => (
            <Lik key={i} l={l} x={x} y={y} s={1.3} seed={`s6-o${i}`} />
          ))}
          {iskre > 0 &&
            Array.from({ length: 6 }, (_, i) => {
              const t = (iskre * 1.6 + i * 0.17) % 1;
              const x = 420 + i * 48;
              const y = 1040 - t * 110;
              return <path key={i} d={`M${x},${y - 16} L${x},${y + 16} M${x - 16},${y} L${x + 16},${y}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={1 - t} />;
            })}
          <Pop at={kPotvrdi} x={540} y={560} rot={-3}>
            <Etiketa seed="s6-e" tekst="samo one koje znaš" boja={P.zelena700} velicina={62} />
          </Pop>
        </g>
      )}
      {kraj > 0 && (
        <g opacity={kraj}>
          <Kolo seed="kolo6" geo={{ cx: 540, cy: 1060, rx: 360, ry: 110, ugao: (f - kEkolo) * 1.2, skala: 1.0, n: 8 }} pojava={OSOBE.map((_, i) => kEkolo - 18 + i * 2)} ruke={kEkolo - 4} />
          <g transform="translate(540 640)">
            <LogoZnak seed="logo6" r={170} />
          </g>
          <g transform={`translate(540 1200) scale(${adresa})`}>
            <text textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={120} fill={P.zelena700} letterSpacing={-2}>
              ekolo.rs
            </text>
          </g>
          <g transform={`translate(540 1290) scale(${dugme})`}>
            <Isecak pts={pravougaonik(-300, -46, 600, 92)} boja={P.zelena700} seed="dugme6" />
            <text y={18} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={46} fill="#fff">
              Potvrdi one koje znaš
            </text>
          </g>
        </g>
      )}
    </Svg>
  );
};

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6];
