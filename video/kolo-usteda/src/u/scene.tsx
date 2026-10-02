// Scene videa 13 „Ušteda“ (tekst: snimak My_recording_65 + umetak iz 66; scenario
// video/kolo-usteda/scenario.md). Svaka animacija se kači na izgovorenu reč (kad), a reč
// stiže 1 s posle slike (PREDNOST u plan.json). Tekst na ekranu je samo deo slike (sveska,
// oglas, zapis, završna kartica): pravilo „Natpisi“ u video/README.md.
import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RUKOPIS, SANS } from "../fontovi";
import { P } from "../kolaz/paleta";
import { Crta, Defs, Isecak, Pop, krugTacke, napredak, pravougaonik } from "../kolaz/papir";
import { Drvo, Korpa, Oblak, Sunce } from "../kolaz/likovi";
import { Iskre, KutijaAlata } from "../kolaz/prica";
import { Kapija, RukaMase } from "../kolaz/selo";
import {
  Auto, BAKA, BOJA_ZORAN, CERKA, Dugme, Evidencija, Fabrika, Figura, KOL_DIN, KOL_KOLO, KOMSINICA, Kamion, Kofer, List, Novcanica,
  Novcanik, Osiguraci, PecatRed, Precrta, RED, Rukopis, SIN, STAVKE, SVESKA, Sijalica, Stavka, Suncobran, Sveca, Telefon, Uticnica,
  TEKST_X, Vinjeta, ZENA, ZORAN, redY,
} from "./stvari";
import { kad } from "./vreme";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);
const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── 1. Kuka: porodica ide na more ────────────────────────────────────
const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const kofer = kad(1, "porodicu");
  const more = kad(1, "more");
  const stik = kad(1, "uštedeo");
  return (
    <Svg>
      <Pop at={2} x={880} y={250}><Sunce seed="s1-sunce" /></Pop>
      <Pop at={6} x={240} y={260} njihanje={2}><Oblak seed="s1-ob" /></Pop>
      <Isecak pts={pravougaonik(-20, 1010, 1120, 330)} boja={P.trava} seed="s1-trava" amp={4} korak={40} />
      <Pop at={4} x={110} y={1030}><Drvo seed="s1-drvo" visina={1.3} /></Pop>
      <Pop at={10} x={560} y={1000}><Auto seed="s1-auto" /></Pop>
      <Pop at={kofer} x={500} y={798} rot={-3}><Kofer seed="s1-k1" /></Pop>
      <Pop at={kofer + 6} x={650} y={800} rot={4}><Kofer seed="s1-k2" boja={P.nebo} /></Pop>
      <Pop at={more} x={940} y={1060}><Suncobran seed="s1-sb" visina={300} /></Pop>
      <Pop at={kad(1, "Zoran")} x={250} y={1250}><Figura seed="s1-zoran" glava={ZORAN} boja={BOJA_ZORAN} visina={330} /></Pop>
      <Pop at={kad(1, "vodi")} x={420} y={1250}><Figura seed="s1-zena" glava={ZENA} boja={P.roze} visina={300} /></Pop>
      <Pop at={kad(1, "vodi") + 5} x={720} y={1250}><Figura seed="s1-cerka" glava={CERKA} boja={P.sunce} visina={210} /></Pop>
      <Pop at={kad(1, "vodi") + 9} x={850} y={1250}><Figura seed="s1-sin" glava={SIN} boja={P.trava} visina={190} /></Pop>
      {/* sveska na haubi: „More“, štiklirano */}
      <Pop at={kad(1, "Plata")} x={300} y={520} rot={-4}>
        <Isecak pts={pravougaonik(-170, -110, 340, 220)} boja={P.belo} seed="s1-sv" />
        <Crta pts={[[-120, -100], [-120, 100]]} seed="s1-sv-m" boja={P.korala} debljina={3} amp={0.6} />
        <Rukopis x={-90} y={20} tekst="More" velicina={78} napredak={lin(f, kad(1, "novac"), kad(1, "novac") + 14)} />
        <Crta pts={[[60, 0], [88, 36], [140, -40]]} seed="s1-stik" boja={P.zelena700} debljina={12} napredak={lin(f, stik, stik + 10)} />
      </Pop>
    </Svg>
  );
};

// ── 2. Pre KOLA: plata ode na troškove ───────────────────────────────
const IZGOVORENE: Partial<Record<Stavka, string>> = { pijaca: "pijaca", frizer: "frizer", mehaničar: "mehaničar", struja: "struja", gorivo: "gorivo", porez: "porez" };
const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const plata = kad(2, "celu");
  const posle = kad(2, "porez") + 14;
  const nista = kad(2, "nije");
  // kad koja novčanica odleti: izgovorene na svoju reč, ostale brzo posle „porez“
  const ostale = STAVKE.filter((s) => !IZGOVORENE[s]);
  const leti = (s: Stavka) => (IZGOVORENE[s] ? kad(2, IZGOVORENE[s]!) : posle + ostale.indexOf(s) * 5);
  return (
    <Svg>
      <List seed="s2-list" boja="#F6EFDD" />
      <Rukopis x={SVESKA.x + 150} y={SVESKA.y + 100} tekst="Pre KOLA" velicina={54} boja={P.siva} napredak={lin(f, 2, 14)} />
      <Rukopis x={SVESKA.x + 150} y={SVESKA.y + 205} tekst="Plata: 80.000 din" velicina={76} napredak={lin(f, plata, plata + 16)} />
      {STAVKE.map((s, i) => {
        const y = redY(s);
        const t0 = leti(s);
        const p = napredak(f, t0, 22, Easing.in(Easing.quad));
        return (
          <g key={s}>
            <Rukopis x={TEKST_X} y={y} tekst={s} velicina={52} napredak={lin(f, kad(2, "trošio") + i * 2, kad(2, "trošio") + i * 2 + 6)} />
            {f >= kad(2, "trošio") + i * 2 && p < 1 && (
              <g transform={`translate(${620 + 300 * p} ${y - 14 - 260 * p * p}) rotate(${-6 + 40 * p}) scale(0.55)`} opacity={1 - p * 0.3}>
                <Novcanica seed={`s2-n${i}`} />
              </g>
            )}
          </g>
        );
      })}
      <Rukopis x={TEKST_X} y={SVESKA.y + SVESKA.h - 50} tekst="Ostalo: 0" velicina={64} boja={P.korala600} napredak={lin(f, nista, nista + 10)} />
      <Pop at={nista + 8} x={790} y={1180} rot={6}><Novcanik seed="s2-nov" /></Pop>
    </Svg>
  );
};

// ── 3. Oglas u KOLU ──────────────────────────────────────────────────
const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const o = kad(3, "oglas");
  const e = kad(3, "električarske");
  const p = kad(3, "posle");
  return (
    <Svg>
      <Pop at={0} x={560} y={640}>
        <Telefon seed="s3-tel">
          <Isecak pts={pravougaonik(-200, -250, 400, 380)} boja={P.belo} seed="s3-kart" senka="mala" amp={1.4} />
          <text x={-180} y={-200} fontFamily={SANS} fontWeight={700} fontSize={30} fill={P.siva}>
            Nov oglas
          </text>
          <Rukopis x={-180} y={-120} tekst="Električarske" velicina={52} napredak={lin(f, e - 4, e + 16)} />
          <Rukopis x={-180} y={-60} tekst="popravke" velicina={52} napredak={lin(f, e + 14, e + 26)} />
          <Rukopis x={-180} y={20} tekst="posle posla" velicina={46} boja={P.zelena700} napredak={lin(f, p - 2, p + 12)} />
          {f >= o && f < p + 14 && Math.floor(f / 8) % 2 === 0 && <rect x={-182 + 0} y={60} width={4} height={40} fill={P.tekst} />}
          <Dugme x={0} y={240} w={300} tekst="Objavi" pritisak={lin(f, p + 16, p + 26)} seed="s3-dug" />
        </Telefon>
      </Pop>
      <Pop at={kad(3, "Onda")} x={190} y={1280}><Figura seed="s3-zoran" glava={ZORAN} boja={BOJA_ZORAN} visina={330} /></Pop>
      <Pop at={o} x={880} y={1250}><KutijaAlata seed="s3-alat" /></Pop>
    </Svg>
  );
};

// ── 4. Ljudi kojima je majstor trebao ────────────────────────────────
const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const maj = kad(4, "majstor");
  const prep = kad(4, "prepisali");
  const dob = kad(4, "dobili");
  return (
    <Svg>
      <Pop at={0} x={0} y={0}>
        <Vinjeta seed="s4-v1" x={90} y={150} w={900} h={400}>
          <Pop at={4} x={300} y={540}><Figura seed="s4-kom" glava={KOMSINICA} boja={P.slezova} visina={330} osmeh={f > dob ? 1 : 0.2} /></Pop>
          <Pop at={2} x={620} y={330}><Uticnica seed="s4-ut" /></Pop>
          {f < dob && <Iskre seed="s4-isk" x={620} y={330} t={((f % 18) / 18)} r={110} n={7} />}
          <Pop at={maj} x={820} y={560}><Figura seed="s4-zor1" glava={ZORAN} boja={BOJA_ZORAN} visina={330} /></Pop>
          <Pop at={6} x={470} y={220}><Sijalica seed="s4-s1" upaljena={lin(f, dob, dob + 8)} /></Pop>
        </Vinjeta>
      </Pop>
      <Pop at={kad(4, "ljudi")} x={0} y={0}>
        <Vinjeta seed="s4-v2" x={90} y={610} w={900} h={400} boja="#E9DCC0">
          <Pop at={kad(4, "ljudi") + 4} x={330} y={1000}><Figura seed="s4-baka" glava={BAKA} boja={P.zelena500} visina={320} osmeh={f > dob ? 1 : 0.2} /></Pop>
          <Pop at={kad(4, "ljudi") + 2} x={660} y={820}><Osiguraci seed="s4-os" /></Pop>
          <Pop at={kad(4, "ljudi") + 6} x={520} y={990}><Sveca seed="s4-sv" /></Pop>
          <Pop at={maj + 6} x={850} y={1000}><Figura seed="s4-zor2" glava={ZORAN} boja={BOJA_ZORAN} visina={330} /></Pop>
          <Pop at={kad(4, "ljudi") + 8} x={170} y={690}><Sijalica seed="s4-s2" upaljena={lin(f, dob + 4, dob + 12)} /></Pop>
        </Vinjeta>
      </Pop>
      <Pop at={prep - 6} x={540} y={1100}>
        <Evidencija seed="s4-ev" redovi={[{ tekst: "Komšinica → Zoran", od: prep }, { tekst: "Baka iz Bezdana → Zoran", od: prep + 14 }]} />
      </Pop>
    </Svg>
  );
};

// ── 5–7. Sveska mesec po mesec ───────────────────────────────────────
type Udarac = { s: Stavka; t: number; tekst: string; dinari?: boolean };
const SveskaMeseci: React.FC<{
  scena: number;
  mesec: { tekst: string; t: number }[];
  ranije: Stavka[]; // već u KOLU od ranije (bez animacije)
  udarci: Udarac[];
  ostalo: { tekst: string; t: number }[];
  podvuci?: number;
  ikone?: React.ReactNode;
}> = ({ scena, mesec, ranije, udarci, ostalo, podvuci, ikone }) => {
  const f = useCurrentFrame();
  const kolone = scena === 5 ? lin(f, 4, 22) : 1;
  const m = [...mesec].reverse().find((x) => f >= x.t) ?? mesec[0];
  const o = [...ostalo].reverse().find((x) => f >= x.t);
  const pecatT = (t: number) => lin(f, t, t + 7);
  return (
    <Svg>
      <List seed="sv-list" kolone={kolone} />
      <g key={m.tekst}>
        <Pop at={m.t} x={SVESKA.x + 150} y={SVESKA.y + 120}>
          <Rukopis x={0} y={0} tekst={m.tekst} velicina={64} boja={P.zelena900} napredak={scena === 5 ? lin(f, m.t, m.t + 10) : 1} />
        </Pop>
      </g>
      <Rukopis x={KOL_DIN} y={330} tekst="Dinari" velicina={58} sidro="middle" />
      <Rukopis x={KOL_KOLO} y={330} tekst="U KOLU" velicina={56} sidro="middle" boja={P.zelena700} napredak={scena === 5 ? lin(f, 10, 20) : 1} />
      {STAVKE.map((s) => {
        const y = redY(s);
        const u = udarci.find((x) => x.s === s && !x.dinari);
        const uKolu = ranije.includes(s) ? 1 : u ? pecatT(u.t) : 0;
        const d = udarci.find((x) => x.s === s && x.dinari);
        return (
          <g key={s}>
            <g opacity={d ? 1 - pecatT(d.t) : 1}>
              <Rukopis x={TEKST_X} y={y} tekst={s} velicina={52} boja={uKolu > 0.5 ? P.siva : P.tekst} />
            </g>
            {uKolu > 0 && <Precrta x0={TEKST_X - 8} x1={TEKST_X + 14 + s.length * 23} y={y - 14} napredak={ranije.includes(s) ? 1 : lin(f, u!.t, u!.t + 6)} seed={`pc-${s}`} boja={P.siva} />}
            {uKolu > 0 && <PecatRed tekst={(u?.tekst ?? s).toUpperCase()} x={KOL_KOLO} y={y} t={uKolu} seed={`pk-${s}`} />}
            {d && <PecatRed tekst={d.tekst.toUpperCase()} x={KOL_DIN} y={y} velicina={32} t={pecatT(d.t)} boja={P.korala600} seed={`pd-${s}`} />}
          </g>
        );
      })}
      {ikone}
      {o && (
        <g key={o.tekst}>
          <Pop at={o.t} x={TEKST_X} y={SVESKA.y + SVESKA.h - 50}>
            <Rukopis x={0} y={0} tekst={`Ostalo: ${o.tekst}`} velicina={66} boja={P.zelena700} />
          </Pop>
        </g>
      )}
      {podvuci !== undefined && (
        <>
          <Crta pts={[[TEKST_X, SVESKA.y + SVESKA.h - 32], [TEKST_X + 420, SVESKA.y + SVESKA.h - 36]]} seed="pod1" boja={P.zelena700} debljina={6} napredak={lin(f, podvuci, podvuci + 8)} />
          <Crta pts={[[TEKST_X + 4, SVESKA.y + SVESKA.h - 20], [TEKST_X + 416, SVESKA.y + SVESKA.h - 24]]} seed="pod2" boja={P.zelena700} debljina={6} napredak={lin(f, podvuci + 6, podvuci + 14)} />
        </>
      )}
    </Svg>
  );
};

const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const pov = kad(5, "povrće");
  const sis = kad(5, "šiša");
  return (
    <SveskaMeseci
      scena={5}
      mesec={[{ tekst: "1. mesec", t: 6 }]}
      ranije={[]}
      udarci={[{ s: "pijaca", t: pov, tekst: "pijaca" }, { s: "frizer", t: sis, tekst: "frizer" }]}
      ostalo={[{ tekst: "5.000 din", t: kad(5, "koja") }]}
      ikone={
        <>
          <Pop at={pov + 4} x={985} y={redY("pijaca") + 20} skala={0.32} rot={8}><Korpa seed="s5-korpa" /></Pop>
          {f > sis + 4 && (
            <Pop at={sis + 4} x={985} y={redY("frizer") - 8} skala={0.9}>
              <g transform="rotate(-20)">
                <Crta pts={[[-30, -20], [30, 20]]} seed="mk1" boja={P.siva} debljina={8} />
                <Crta pts={[[-30, 20], [30, -20]]} seed="mk2" boja={P.siva} debljina={8} />
                <Isecak pts={krugTacke(-40, -26, 12, 10)} boja={P.korala} seed="mk3" senka="mala" amp={1} />
                <Isecak pts={krugTacke(-40, 26, 12, 10)} boja={P.korala} seed="mk4" senka="mala" amp={1} />
              </g>
            </Pop>
          )}
        </>
      }
    />
  );
};

const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const z = kad(6, "Zovu");
  const m2 = kad(6, "što");
  const m3 = kad(6, "toga");
  const zvoni = lin(f, z - 4, z + 2) * (1 - lin(f, m2 - 10, m2 - 2));
  return (
    <>
      <SveskaMeseci
        scena={6}
        mesec={[{ tekst: "1. mesec", t: 0 }, { tekst: "2. mesec", t: m2 - 4 }, { tekst: "3. mesec", t: m3 - 4 }]}
        ranije={["pijaca", "frizer"]}
        udarci={[
          { s: "mehaničar", t: m2 + 4, tekst: "mehaničar" },
          { s: "časovi", t: m2 + 24, tekst: "časovi" },
          { s: "šunka", t: m3 + 4, tekst: "šunka" },
          { s: "zimnica", t: m3 + 24, tekst: "zimnica" },
        ]}
        ostalo={[{ tekst: "5.000 din", t: 0 }, { tekst: "10.000 din", t: m2 + 34 }, { tekst: "20.000 din", t: m3 + 34 }]}
      />
      {zvoni > 0 && (
        <Svg>
          <g opacity={zvoni} transform={`translate(800 900) scale(${0.38 + 0.04 * zvoni})`}>
            <Telefon seed="s6-tel" zvoni={1}>
              {[0, 1, 2].map((i) => (
                <g key={i} opacity={lin(f, z + i * 8, z + i * 8 + 4)}>
                  <Isecak pts={pravougaonik(-170, -220 + i * 150, 340, 110)} boja={P.zelena100} seed={`s6-p${i}`} senka="mala" />
                  <text x={-140} y={-150 + i * 150} fontFamily={RUKOPIS} fontWeight={700} fontSize={56} fill={P.zelena900}>
                    {["Majstore?", "Treba mi…", "Kad možeš?"][i]}
                  </text>
                </g>
              ))}
            </Telefon>
          </g>
          {[0, 1].map((i) => (
            <Crta key={i} pts={[[920 + i * 30, 740 - i * 10], [950 + i * 30, 710 - i * 10]]} seed={`s6-z${i}`} boja={P.korala} debljina={7} opacity={zvoni * (Math.floor(f / 4) % 2)} />
          ))}
        </Svg>
      )}
    </>
  );
};

const Scena7: React.FC = () => {
  const d = kad(7, "Dinare");
  const s = kad(7, "samo");
  const c = kad(7, "čega");
  const nema = kad(7, "nema");
  return (
    <SveskaMeseci
      scena={7}
      mesec={[{ tekst: "6. mesec", t: 0 }]}
      ranije={["pijaca", "frizer", "mehaničar", "časovi", "šunka", "zimnica"]}
      udarci={[
        { s: "struja", t: d + 4, tekst: "struja", dinari: true },
        { s: "gorivo", t: d + 16, tekst: "gorivo", dinari: true },
        { s: "telefon", t: s, tekst: "telefon", dinari: true },
        { s: "lekovi", t: s + 12, tekst: "lekovi", dinari: true },
        { s: "porez", t: c, tekst: "porez", dinari: true },
      ]}
      ostalo={[{ tekst: "20.000 din", t: 0 }]}
      podvuci={kad(7, "više")}
      ikone={
        <>
          <Pop at={nema - 4} x={KOL_KOLO} y={redY("gorivo") + 50} skala={0.62}><Fabrika seed="s7-fab" /></Pop>
          <Pop at={nema + 4} x={KOL_KOLO + 20} y={redY("porez") + 40} skala={0.6}><Kamion seed="s7-kam" /></Pop>
        </>
      }
    />
  );
};

// ── 8. Ušteđeno, more ────────────────────────────────────────────────
const Scena8: React.FC = () => {
  const f = useCurrentFrame();
  const plaza = kad(8, "cela") - 8;
  const zbir = kad(8, "dovoljno");
  const iznosi = ["5.000", "10.000", "20.000", "20.000", "20.000", "20.000"];
  const p = lin(f, plaza - 8, plaza + 8);
  const razgl = kad(8, "dobija");
  return (
    <Svg>
      {p < 1 && (
        <g opacity={1 - p}>
          <List seed="s8-list" />
          {iznosi.map((x, i) => (
            <g key={i}>
              <Rukopis x={SVESKA.x + 150} y={340 + i * 84} tekst={`${i + 1}. mesec`} velicina={60} boja={P.siva} napredak={lin(f, i * 6, i * 6 + 6)} />
              <Rukopis x={830} y={340 + i * 84} tekst={x} velicina={66} sidro="end" napredak={lin(f, i * 6 + 3, i * 6 + 9)} />
            </g>
          ))}
          <Crta pts={[[SVESKA.x + 140, 340 + 6 * 84 - 40], [860, 340 + 6 * 84 - 44]]} seed="s8-crta" debljina={6} napredak={lin(f, 40, 50)} />
          <Rukopis x={860} y={340 + 7 * 84 + 10} tekst="95.000 din" velicina={100} sidro="end" boja={P.zelena700} napredak={lin(f, zbir - 10, zbir + 4)} />
          <Pop at={zbir + 2} x={700} y={1080} skala={0.7}><Sunce seed="s8-sun" /></Pop>
          <Crta pts={[[520, 1180], [580, 1160], [640, 1180], [700, 1160], [760, 1180], [820, 1160], [880, 1180]]} seed="s8-tal" boja={P.more} debljina={8} napredak={lin(f, zbir + 6, zbir + 16)} />
        </g>
      )}
      {p > 0 && (
        <g opacity={p}>
          <rect x={0} y={0} width={1080} height={1920} fill="#CDE9F2" />
          <Pop at={plaza} x={850} y={250}><Sunce seed="s8-sun2" /></Pop>
          <Isecak pts={[[-20, 640], [1100, 610], [1100, 960], [-20, 980]]} boja={P.more} seed="s8-more" amp={6} korak={40} />
          <Isecak pts={[[-20, 940], [1100, 920], [1100, 1340], [-20, 1340]]} boja="#F1D9A6" seed="s8-pesak" amp={5} korak={40} />
          <Crta pts={[[60, 760], [140, 740], [220, 760], [300, 740]]} seed="s8-t1" boja={P.belo} debljina={6} />
          <Crta pts={[[620, 820], [700, 800], [780, 820], [860, 800]]} seed="s8-t2" boja={P.belo} debljina={6} />
          <Pop at={plaza + 2} x={170} y={1230}><Suncobran seed="s8-sb" visina={360} /></Pop>
          <Pop at={plaza + 6} x={380} y={1300}><Figura seed="s8-zena" glava={ZENA} boja={P.roze} visina={300} /></Pop>
          <Pop at={kad(8, "Zoran")} x={560} y={1300} njihanje={2}><Figura seed="s8-zoran" glava={ZORAN} boja={BOJA_ZORAN} visina={330} /></Pop>
          <Pop at={plaza + 10} x={740} y={1300} njihanje={4} faza={2}><Figura seed="s8-cerka" glava={CERKA} boja={P.sunce} visina={210} /></Pop>
          <Pop at={plaza + 14} x={880} y={1300} njihanje={4} faza={5}><Figura seed="s8-sin" glava={SIN} boja={P.trava} visina={190} /></Pop>
          {/* razglednica iz Sombora: komšinica i baka mašu sa kapije */}
          <Pop at={razgl} x={0} y={0}>
            <g transform="translate(70 360) rotate(-5)">
              <Vinjeta seed="s8-razgl" x={0} y={0} w={420} h={300} boja="#F7E9C8">
                <g transform="translate(210 290) scale(0.95)">
                  <Kapija seed="s8-kap" />
                </g>
                <g transform="translate(90 300) scale(0.62)">
                  <Figura seed="s8-kom" glava={KOMSINICA} boja={P.slezova} visina={330} />
                  <RukaMase seed="s8-kom-r" sx={40} sy={-200} boja={P.slezova} ugao={28} od={razgl + 4} />
                </g>
                <g transform="translate(340 300) scale(0.6)">
                  <Figura seed="s8-baka" glava={BAKA} boja={P.zelena500} visina={320} />
                  <RukaMase seed="s8-baka-r" sx={-40} sy={-190} boja={P.zelena500} ugao={-28} od={razgl + 8} />
                </g>
              </Vinjeta>
            </g>
          </Pop>
        </g>
      )}
    </Svg>
  );
};

// ── 9. Poziv ─────────────────────────────────────────────────────────
const Scena9: React.FC = () => {
  const f = useCurrentFrame();
  const post = kad(9, "Postavi");
  const kraj = kad(9, "ekolo.rs") - 6;
  const k = lin(f, kraj, kraj + 12, 0, 1);
  return (
    <Svg>
      <g opacity={1 - k} transform={`translate(0 ${-60 * k})`}>
        <Pop at={0} x={540} y={680} skala={1.1}>
          <Telefon seed="s9-tel">
            <Isecak pts={pravougaonik(-200, -250, 400, 380)} boja={P.belo} seed="s9-kart" senka="mala" amp={1.4} />
            <text x={-180} y={-200} fontFamily={SANS} fontWeight={700} fontSize={30} fill={P.siva}>
              Nov oglas
            </text>
            <text x={-180} y={-120} fontFamily={RUKOPIS} fontWeight={700} fontSize={52} fill={P.siva} opacity={0.6}>
              Šta nudiš?
            </text>
            {Math.floor(f / 8) % 2 === 0 && <rect x={-182} y={-100} width={4} height={44} fill={P.tekst} />}
            <Dugme x={0} y={240} w={360} tekst="Postavi oglas" pritisak={lin(f, post, post + 10)} seed="s9-dug" />
          </Telefon>
        </Pop>
      </g>
      {k > 0 && (
        <g opacity={k} transform={`translate(540 760) scale(${0.8 + 0.2 * k})`}>
          <image href={staticFile("kolo-hero-logo.png")} x={-160} y={-370} width={320} height={335} />
          <Isecak pts={pravougaonik(-400, 20, 800, 300)} boja={P.belo} seed="s9-kartica" amp={2} />
          <text x={0} y={120} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={P.zelena900}>
            Postavi svoj prvi oglas
          </text>
          <text x={0} y={250} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={96} fill={P.zelena700}>
            ekolo.rs
          </text>
        </g>
      )}
    </Svg>
  );
};

export const SCENE: React.FC[] = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7, Scena8, Scena9];
