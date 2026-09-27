// Scene videa „Potvrda nosi odgovornost“ (lavirani tuš i akvarel). Animacije se kače na reči.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, Lavir, NeboTus, Potez, T, TloTus, elipsa, kutija, mesaj, napredak, useF, usePop } from "./tus";
import { BAKA, DRAGAN, LikTus, MOMAK, SELJAK, SELJANKA, SOFIJA, SiluetaTus } from "./likovi";
import { Bunar, KarticaOdgovornosti, MaliTelefonTus, Pleter, VedroIzbliza, ZnakTus } from "./stvari";
import { kad } from "./vreme";
import { CETKA, SANS } from "../fontovi";

const govor = (f: number, od: number, n: number) => (f >= od && f < od + n ? Math.abs(Math.sin((f - od) * 0.5)) * 0.8 : 0);
const Vedrica: React.FC = () => (
  <g transform="translate(0 70)">
    <path d="M-30,-50 L30,-50 L24,0 L-24,0Z" fill={T.oker} opacity={0.7} filter="url(#akv)" />
    <Potez d="M-30,-50 L30,-50 L24,0 L-24,0Z M-30,-50 C-30,-90 30,-90 30,-50" debljina={4} />
  </g>
);

/** Selo oko bunara: nebo, zemlja, bunar sa đeramom. */
const Selo: React.FC<{ f: number; mutno: number; crtanje: number; natpis?: boolean; nagib?: number }> = ({ f, mutno, crtanje, natpis, nagib = 0 }) => (
  <g>
    <NeboTus y1={1100} />
    {/* kuće u daljini, samo nekoliko poteza */}
    {[120, 300, 700, 930].map((x, i) => (
      <g key={x} opacity={0.7}>
        <Lavir d={`M${x - 70},1110 L${x - 70},1030 L${x},980 L${x + 70},1030 L${x + 70},1110Z`} boja={i % 2 ? T.okerSvetli : T.sivaSvetla} jacina={0.5} rub={false} />
        <Potez d={`M${x - 80},1036 L${x},976 L${x + 80},1036 M${x - 70},1036 L${x - 70},1110 M${x + 70},1036 L${x + 70},1110`} debljina={3.5} napredak={crtanje} opacity={0.6} />
      </g>
    ))}
    <TloTus y={1110} />
    <Bunar x={470} y={1330} s={1.05} mutno={mutno} f={f} crtanje={crtanje} natpis={natpis} nagib={nagib} />
  </g>
);

// ── 1 ── Bunar koji smo zajedno iskopali može da se zamuti.
export const Scena1: React.FC = () => {
  const f = useF();
  const kMoze = kad(1, "može");
  const kZamuti = kad(1, "zamuti");
  const crtanje = napredak(f, 0, 34);
  const pad = napredak(f, kMoze - 6, kZamuti - kMoze + 6, Easing.in(Easing.quad));
  const udar = kZamuti;
  const mutno = napredak(f, udar, 46, Easing.out(Easing.cubic));
  const kapY = mesaj(260, 780, pad);
  const z = interpolate(f, [0, 170], [1.0, 1.08]);
  return (
    <Kadar>
      <Kamera y={1000} z={z}>
        <Lavir d="M-100,1250 C300,1220 700,1260 1180,1230 V2100 H-100Z" boja={T.kamen} jacina={0.5} />
        {[80, 260, 470, 690, 900].map((x) => (
          <Potez key={x} d={`M${x},1270 q60,-16 120,0`} debljina={4} opacity={0.5} napredak={crtanje} />
        ))}
        <g transform="translate(540 1050)">
          <VedroIzbliza mutno={mutno} f={f} crtanje={crtanje} />
        </g>
        {/* kap mulja */}
        {pad > 0 && f < udar + 2 && (
          <path d={`M540,${kapY - 40} C528,${kapY - 10} 520,${kapY + 8} 540,${kapY + 14} C560,${kapY + 8} 552,${kapY - 10} 540,${kapY - 40}Z`} fill={T.muljTamni} filter="url(#akv)" />
        )}
        {f >= udar &&
          [0, 1, 2, 3, 4, 5].map((i) => {
            const t = napredak(f, udar, 16, Easing.out(Easing.quad));
            const a = -Math.PI * (0.15 + i * 0.14);
            return t < 1 ? <circle key={i} cx={540 + Math.cos(a) * 90 * t} cy={790 + Math.sin(a) * 120 * t + t * t * 60} r={7 * (1 - t)} fill={T.mulj} /> : null;
          })}
      </Kamera>
    </Kadar>
  );
};

// ── 2 ── KOLO je taj bunar. Iz njega pije svako i svako ga čuva.
export const Scena2: React.FC = () => {
  const f = useF();
  const kPije = kad(2, "pije");
  const kCuva = kad(2, "čuva");
  const crtanje = napredak(f, 0, 30);
  const nagib = f > kPije - 10 ? Math.sin((f - kPije + 10) / 22) * 14 : 0;
  return (
    <Kadar>
      <Kamera x={560} y={1260} z={1.12}>
      <Selo f={f} mutno={0} crtanje={crtanje} natpis nagib={nagib} />
      <LikTus x={700} y={1500} s={0.78} {...SELJANKA} crtanje={crtanje} izraz="osmeh" pogled={[-1, 0]} dr={[20, 30]} drziD={<Vedrica />} />
      <LikTus x={880} y={1520} s={0.8} {...SELJAK} crtanje={crtanje} izraz="osmeh" pogled={[-1, 0]} lr={[-40, -60]} drziL={<Vedrica />} />
      <LikTus x={1030} y={1540} s={0.82} {...BAKA} crtanje={crtanje} izraz="mirna" pogled={[-1, 0]} />
      <LikTus x={180} y={1560} s={0.84} {...MOMAK} crtanje={crtanje} izraz={f > kCuva - 8 ? "srecna" : "osmeh"} pogled={[1, -0.5]} dr={[150 + Math.sin(f * 0.3) * 8, 30]} lr={[160, -30]} />
      </Kamera>
    </Kadar>
  );
};

// ── 3 ── Kad potvrdiš nekoga koga ne znaš ili nekoga ko ne postoji, otvaraš vrata prevari i
//        zloupotrebi. Bunar se muti. Za sve nas.
export const Scena3: React.FC = () => {
  const f = useF();
  const kPotvrdis = kad(3, "potvrdiš");
  const kPostoji = kad(3, "postoji");
  const kVrata = kad(3, "vrata");
  const kZlo = kad(3, "zloupotrebi");
  const kMuti = kad(3, "muti");
  const kZa = kad(3, "Za");
  const telefon = usePop(kPotvrdis - 8, 110, 12);
  const telefonOde = napredak(f, kVrata - 4, 12);
  const otvor = napredak(f, kVrata, 14);
  const xs = f < kVrata ? mesaj(-160, 60, napredak(f, 0, kVrata)) : mesaj(60, 230, napredak(f, kVrata + 6, kZlo - kVrata));
  const hod = f < kZlo ? f / 3.5 : undefined;
  const mutno = napredak(f, kMuti - 10, 40);
  const brinu = f >= kZa - 6;
  return (
    <Kadar>
      <Kamera x={560} y={1260} z={1.12}>
      <Selo f={f} mutno={mutno} crtanje={1} />
      <Pleter x0={-20} x1={260} y={1470} vrata={130} otvor={otvor} />
      <SiluetaTus x={xs} y={1520} s={0.82} hod={hod} treperi={f >= kPostoji - 6 ? 1 : 0} />
      <LikTus x={720} y={1500} s={0.78} {...SELJANKA} izraz={brinu ? "zabrinuta" : "osmeh"} pogled={[-1, 0]} dr={[20, 30]} drziD={<Vedrica />} />
      <LikTus x={880} y={1520} s={0.8} {...SELJAK} izraz={brinu ? "zabrinuta" : "mirna"} pogled={[-1, 0.3]} />
      <LikTus x={1030} y={1540} s={0.82} {...BAKA} izraz={brinu ? "zabrinuta" : "mirna"} pogled={[-1, 0]} />
      {f >= kPotvrdis - 8 && telefonOde < 1 && (
        <g transform={`translate(250 ${640 - telefonOde * 60}) scale(${telefon * 1.25})`} opacity={1 - telefonOde}>
          <MaliTelefonTus potvrdjeno={f >= kPotvrdis + 8 ? 1 : 0} />
          {f >= kPotvrdis + 8 && <Potez d="M-40,160 C-60,260 -120,360 -160,480" debljina={4} boja={T.siva} napredak={napredak(f, kPotvrdis + 8, 14)} />}
        </g>
      )}
      </Kamera>
    </Kadar>
  );
};

// ── 4 ── Ako nekoga potvrdiš, puštaš ga do našeg bunara. Kažeš: „Znam ga lično.“
export const Scena4: React.FC = () => {
  const f = useF();
  const kPustas = kad(4, "puštaš");
  const kKazes = kad(4, "Kažeš");
  const kLicno = kad(4, "lično");
  const crtanje = napredak(f, 0, 26);
  const dolaze = napredak(f, 0, kPustas + 30, Easing.out(Easing.quad));
  const mutno = 1 - napredak(f, kLicno - 4, 44);
  const oblacic = usePop(kKazes - 2, 110, 12);
  const sjaj = napredak(f, kLicno, 24);
  const hod = dolaze < 1 ? f / 3.2 : undefined;
  const xd = mesaj(-260, 110, dolaze);
  const xs = mesaj(-80, 280, dolaze);
  return (
    <Kadar>
      <Kamera x={560} y={1260} z={1.12}>
      <Selo f={f} mutno={mutno} crtanje={1} />
      <LikTus x={720} y={1500} s={0.78} {...SELJANKA} izraz={sjaj > 0.5 ? "srecna" : "zabrinuta"} pogled={[-1, 0]} dr={[20, 30]} drziD={<Vedrica />} />
      <LikTus x={880} y={1520} s={0.8} {...SELJAK} izraz={sjaj > 0.5 ? "osmeh" : "zabrinuta"} pogled={[-1, 0.3]} />
      <LikTus x={1030} y={1540} s={0.82} {...BAKA} izraz={sjaj > 0.5 ? "srecna" : "zabrinuta"} pogled={[-1, 0]} />
      {sjaj > 0 && <ellipse cx={xd} cy={1290} rx={170} ry={330} fill={T.zelenaSvetla} opacity={0.45 * sjaj} filter="url(#tSjaj)" />}
      <LikTus x={xd} y={1560} s={0.86} {...DRAGAN} crtanje={crtanje} hod={hod} izraz="osmeh" pogled={[1, 0]} dr={[70, 0]} />
      <LikTus x={xs} y={1570} s={0.84} {...SOFIJA} crtanje={crtanje} hod={hod} izraz="osmeh" pogled={f >= kKazes ? [1, -0.3] : [-1, 0]} lr={[-70, 0]} usta={govor(f, kKazes + 6, 34)} />
      {f >= kKazes - 2 && (
        <g transform={`translate(520 790) scale(${oblacic})`}>
          <path d="M-250,-80 C-250,-150 250,-150 250,-80 C260,-10 250,50 180,60 L60,62 L10,120 L0,62 L-180,60 C-250,50 -260,-10 -250,-80Z" fill="#fff" opacity={0.92} />
          <Potez d="M-250,-80 C-250,-150 250,-150 250,-80 C260,-10 250,50 180,60 L60,62 L10,120 L0,62 L-180,60 C-250,50 -260,-10 -250,-80Z" debljina={5} />
          <text y={10} textAnchor="middle" fontFamily={CETKA} fontSize={78} fill={T.tus}>
            „Znam ga lično.“
          </text>
        </g>
      )}
      </Kamera>
    </Kadar>
  );
};

// ── 5 ── Nisi odgovoran za sve što on kasnije uradi. Ali odgovaraš za jedno: da ga lično poznaješ.
export const Scena5: React.FC = () => {
  const f = useF();
  const kNisi = kad(5, "Nisi");
  const kAli = kad(5, "Ali");
  const levo = napredak(f, kNisi - 6, 22, Easing.out(Easing.cubic));
  const desno = napredak(f, kAli - 6, 22, Easing.out(Easing.cubic));
  return (
    <Kadar>
      <Lavir d="M-100,300 C300,260 700,330 1180,280 V1500 C800,1540 300,1470 -100,1520Z" boja={T.indigo} jacina={0.12} />
      <g transform={`translate(290 880)`} opacity={1 - desno * 0.3}>
        <KarticaOdgovornosti naslov={["NISI", "ODGOVORAN"]} tekst={["za sve što", "kasnije", "uradi"]} p={levo} />
      </g>
      <g transform={`translate(790 880) scale(${1 + desno * 0.04})`}>
        <KarticaOdgovornosti zelena naslov={["", "ODGOVARAŠ"]} tekst={["da ga", "lično", "poznaješ"]} p={desno} />
      </g>
    </Kadar>
  );
};

// ── 6 ── Potvrdi samo one koje znaš. Tako bunar ostaje čist za sve koji su pošteni. ekolo.rs
export const Scena6: React.FC = () => {
  const f = useF();
  const kCist = kad(6, "čist");
  const kEkolo = kad(6, "ekolo.rs");
  const kraj = napredak(f, kEkolo - 16, 16);
  const adresa = usePop(kEkolo - 2, 120, 12);
  const dugme = usePop(kEkolo + 10, 120, 12);
  const iskre = f >= kCist ? napredak(f, kCist, 30) : 0;
  return (
    <Kadar>
      {kraj < 1 && (
        <g opacity={1 - kraj}>
          <Kamera x={560} y={1260} z={1.12}>
          <Selo f={f} mutno={0} crtanje={1} natpis />
          {iskre > 0 &&
            Array.from({ length: 7 }, (_, i) => {
              const t = (iskre + i * 0.13) % 1;
              return <path key={i} d={`M${320 + i * 26},${1170 - t * 40} l0,-18 M${311 + i * 26},${1161 - t * 40} l18,0`} stroke="#fff" strokeWidth={4} opacity={1 - t} />;
            })}
          <LikTus x={110} y={1560} s={0.84} {...DRAGAN} izraz="srecna" pogled={[1, 0]} />
          <LikTus x={280} y={1580} s={0.82} {...SOFIJA} izraz="srecna" pogled={[1, 0]} />
          <LikTus x={720} y={1500} s={0.78} {...SELJANKA} izraz="srecna" pogled={[-1, 0]} dr={[20, 30]} drziD={<Vedrica />} />
          <LikTus x={880} y={1520} s={0.8} {...SELJAK} izraz="osmeh" pogled={[-1, 0.3]} />
          <LikTus x={1030} y={1540} s={0.82} {...BAKA} izraz="srecna" pogled={[-1, 0]} />
          </Kamera>
        </g>
      )}
      {kraj > 0 && (
        <g opacity={kraj}>
          <Lavir d="M-100,420 C300,380 700,450 1180,400 V1420 C800,1460 300,1390 -100,1440Z" boja={T.voda} jacina={0.22} />
          <g transform="translate(540 760)">
            <ZnakTus vel={320} />
          </g>
          <g transform={`translate(540 1160) scale(${adresa})`}>
            <text textAnchor="middle" fontFamily={CETKA} fontSize={180} fill={T.zelena}>
              ekolo.rs
            </text>
          </g>
          <g transform={`translate(540 1285) scale(${dugme})`}>
            <path d={kutija(-330, -54, 660, 108, 54)} fill={T.zelena} opacity={0.85} filter="url(#akv)" />
            <text y={18} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={46} fill="#fff">
              Potvrdi one koje znaš
            </text>
          </g>
          <path d={elipsa(540, 1560, 1, 1)} fill="none" />
        </g>
      )}
    </Kadar>
  );
};

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6];
