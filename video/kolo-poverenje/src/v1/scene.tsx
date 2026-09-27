// Scene videa „Čiji si ti“ (linorez). Sve animacije se kače na izgovorenu reč (kad).
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { L, Kadar, Kamera, Linija, NeboUrezi, Ograda, Papir, Povrs, Rez, Srafura, Sunce, DrvoL, KucaL, Utisni, Zemlja, elipsa, kutija, mesaj, napredak, urez, useF, usePop, Registar } from "./linorez";
import { BAKA, DEDA, DOMACIN, DOSLJAK, Figura, Glava, LAZA, OTAC, POZNANIK } from "./figure";
import { EkranKod, EkranPotvrde, Klupa, Kosa, LicnaKarta, Medaljon, Pecat, Precrtano, Snop, Telefon, Torba, ZnakKolo } from "./stvari";
import { kad, kadKraj, trajanjeF } from "./vreme";
import { SANS, SLAB } from "../fontovi";

const TLO = 1330;

/** Usta koja se miču dok lik govori (od frejma `od`, `n` frejmova). */
const govor = (f: number, od: number, n: number) => (f >= od && f < od + n ? Math.abs(Math.sin((f - od) * 0.55)) * 0.8 : 0);

/** Ulica pred kućom: nebo urezano, sunce, kuća, ograda, klupa. */
const Ulica: React.FC<{ seed?: string; sunce?: boolean }> = ({ seed = "u", sunce = true }) => (
  <g>
    <Papir />
    <NeboUrezi y0={250} y1={1100} seed={seed} />
    {sunce && (
      <Registar seed={`${seed}s`}>
        <Sunce x={870} y={520} r={78} />
      </Registar>
    )}
    <g transform="translate(1010 1340)">
      <DrvoL s={1.55} seed={seed} />
    </g>
    <g transform="translate(250 1335)">
      <KucaL s={1.75} vrata />
    </g>
    <Ograda x0={570} x1={1080} y={TLO + 6} h={190} />
    <Zemlja y={TLO} seed={seed} />
  </g>
);

// ── 1 ── Čiji si ti? Nekada je to pitanje vredelo više od lične karte.
export const Scena1: React.FC = () => {
  const f = useF();
  const stiglo = 64;
  const x = interpolate(f, [0, stiglo], [1200, 760], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const kCiji = kad(1, "Čiji");
  const kKarte = kad(1, "lične");
  const siva = napredak(f, kad(1, "karte") + 10, 20);
  const z = interpolate(f, [0, trajanjeF(1)], [1.08, 1.0]);
  return (
    <Kadar>
      <Rez>
        <Kamera y={1000} z={z}>
          <Ulica seed="s1" />
          <g transform="translate(300 1335)">
            <Klupa s={1.12} />
          </g>
          <Figura x={300} y={TLO} s={1.08} sedi {...BAKA} glava={{ ...BAKA.glava, pogled: [1, 0], usta: govor(f, kCiji, 26) }} lr={[20, 40]} dr={[-20, -40]} />
          <Figura x={x} y={TLO} s={1.12} {...LAZA} hod={f < stiglo ? f * 0.36 : undefined} glava={{ ...LAZA.glava, pogled: f > stiglo ? [-1, 0] : [0, 0] }} />
        </Kamera>
      </Rez>
      <Utisni at={kKarte} x={560} y={520} rot={-6}>
        <Rez lokalno>
          <LicnaKarta s={0.95} siva={siva} />
        </Rez>
      </Utisni>
    </Kadar>
  );
};

/** Kuća iz ptičje perspektive: zid, krov na četiri vode, sleme. */
const KrovOdozgo: React.FC<{ x: number; y: number; w: number; h: number; rot: number }> = ({ x, y, w, h, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <Povrs d={kutija(-w / 2, -h / 2, w, h, 3)} boja={L.papirTopli} debljina={4} trunje={0.2} />
    <Povrs d={`M${-w / 2 + 6},${-h / 2 + 6} L${-w / 2 + h / 2},0 L${-w / 2 + 6},${h / 2 - 6}Z M${w / 2 - 6},${-h / 2 + 6} L${w / 2 - h / 2},0 L${w / 2 - 6},${h / 2 - 6}Z`} boja={L.mastilo} debljina={3} />
    <path d={`M${-w / 2 + h / 2},0 L${w / 2 - h / 2},0`} stroke={L.mastilo} strokeWidth={5} />
    <path d={`M${-w / 2 + 6},${-h / 2 + 6} L${w / 2 - 6},${-h / 2 + 6} L${w / 2 - h / 2},0 L${-w / 2 + h / 2},0Z`} fill={L.crvena} opacity={0.9} />
    <path d={`M${-w / 2 + 6},${h / 2 - 6} L${w / 2 - 6},${h / 2 - 6} L${w / 2 - h / 2},0 L${-w / 2 + h / 2},0Z`} fill={L.crvenaTamna} />
  </g>
);

// ušoreno vojvođansko selo odozgo: dve glavne ulice u krst, kuće u nizu, bašte iza kuća
const SELO_KUCE: [number, number, number][] = [];
for (let x = 90; x <= 990; x += 100) {
  if (Math.abs(x - 540) < 80) continue;
  SELO_KUCE.push([x, 900 - 78, 0], [x, 900 + 78, 0]);
}
for (let y = 420; y <= 1400; y += 100) {
  if (Math.abs(y - 900) < 90) continue;
  SELO_KUCE.push([540 - 78, y, 90], [540 + 78, y, 90]);
}

// ── 2 ── Selo je bilo malo i svi su se znali. Lična karta nikom nije trebala.
export const Scena2: React.FC = () => {
  const f = useF();
  const kSvi = kad(2, "svi");
  const kLicna = kad(2, "Lična");
  const kNikom = kad(2, "nikom");
  const z = interpolate(f, [0, trajanjeF(2)], [1.0, 1.14]);
  const let_ = napredak(f, kNikom, 34, Easing.in(Easing.quad));
  return (
    <Kadar>
      <Rez>
        <Kamera x={540} y={900} z={z}>
          <Papir boja={L.papirTopli} />
          {/* bašte iza kuća: crne leje sa urezanim redovima */}
          {[
            [0, 560, 460, 200],
            [620, 560, 460, 200],
            [0, 1040, 460, 220],
            [620, 1040, 460, 220],
            [0, 300, 460, 150],
            [620, 300, 460, 150],
            [0, 1300, 460, 200],
            [620, 1300, 460, 200],
          ].map(([x, y, w, h], i) => (
            <g key={i}>
              <Povrs d={kutija(x + 10, y, w - 20, h, 4)} boja={i % 3 === 0 ? L.oker : L.mastilo} debljina={4} trunje={0.3} />
              <Srafura x={x + 20} y={y + 12} w={w - 40} h={h - 24} ugao={i % 2 ? 0 : -90} razmak={22} duzina={70} debljina={3} boja={i % 3 === 0 ? L.mastilo : L.papir} seed={`b${i}`} opacity={0.75} />
            </g>
          ))}
          {/* ulice u krst */}
          <path d="M-100,900 L1180,900 M540,200 L540,1600" stroke={L.mastilo} strokeWidth={96} />
          <path d="M-100,900 L1180,900 M540,200 L540,1600" stroke={L.papir} strokeWidth={76} />
          <path d="M-100,900 L1180,900 M540,200 L540,1600" stroke={L.mastilo} strokeWidth={4} strokeDasharray="6 26" opacity={0.5} />
          {/* drvored uz ulice */}
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <path d={elipsa(40 + i * 90, 900 - 38, 16)} fill={L.mastilo} />
              <path d={elipsa(40 + i * 90 + 45, 900 + 38, 16)} fill={L.mastilo} />
            </g>
          ))}
          {SELO_KUCE.map(([x, y, r], i) => (
            <KrovOdozgo key={i} x={x} y={y} w={74} h={48} rot={r} />
          ))}
          {/* crkva na raskršću */}
          <g transform="translate(640 800)">
            <Povrs d={kutija(-40, -70, 80, 140, 4)} boja={L.papir} debljina={5} />
            <Povrs d={elipsa(0, -84, 30)} boja={L.crvena} debljina={5} />
            <path d="M0,-104 L0,-64 M-16,-84 L16,-84" stroke={L.mastilo} strokeWidth={6} />
          </g>
        </Kamera>
      </Rez>
      {/* medaljon: komšije se javljaju preko ograde */}
      <Utisni at={kSvi - 2} x={540} y={820}>
        <Rez lokalno>
          <Medaljon r={300} id="s2">
            <Papir />
            <NeboUrezi y0={-300} y1={40} seed="m2" gusto={1.3} />
            <Ograda x0={-300} x1={300} y={200} h={150} />
            <Figura x={-130} y={270} s={0.56} {...DOMACIN} dr={[150, 10 + 14 * Math.sin(f * 0.35)]} glava={{ ...DOMACIN.glava, izraz: "srecna" }} />
            <Figura x={140} y={270} s={0.56} {...BAKA} lr={[-150, -10 - 14 * Math.sin(f * 0.35 + 1)]} glava={{ ...BAKA.glava, izraz: "srecna" }} />
            <Zemlja y={268} seed="m2z" />
          </Medaljon>
        </Rez>
      </Utisni>
      {/* lična karta odleti kao list */}
      {f >= kLicna && (
        <g transform={`translate(${mesaj(830, 1300, let_)} ${mesaj(1230, 820, let_) + Math.sin(let_ * 9) * 30}) rotate(${-8 + let_ * 220}) scale(${usePopLocal(f, kLicna) * (1 - let_ * 0.3)})`}>
          <Rez lokalno>
            <LicnaKarta s={0.8} />
          </Rez>
        </g>
      )}
    </Kadar>
  );
};
const usePopLocal = (f: number, at: number) => Math.min(1, Math.max(0, (f - at) / 8));

// ── 3 ── Kad prođe neko mlađi, pitaju ga: čiji si ti? Kad kaže čiji je, odmah se zna ko je.
const OTAC_P: [number, number] = [600, 500];
const DEDA_P: [number, number] = [880, 450];
export const Scena3: React.FC = () => {
  const f = useF();
  const kPitaju = kad(3, "pitaju");
  const kCiji = kad(3, "čiji");
  const kKaze = kad(3, "Kad", 2);
  const kOdmah = kad(3, "odmah");
  const x = interpolate(f, [0, 50], [1180, 760], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const stablo = napredak(f, kKaze, 30);
  const deda = napredak(f, kKaze + 22, 26);
  const klim = f >= kOdmah ? Math.sin((f - kOdmah) * 0.3) * 5 * Math.max(0, 1 - (f - kOdmah) / 60) : 0;
  const glavaY = TLO - 1.12 * 640;
  return (
    <Kadar>
      <Rez>
        <Ulica seed="s3" sunce={false} />
        <g transform="translate(300 1335)">
          <Klupa s={1.12} />
        </g>
        <Figura
          x={330}
          y={TLO}
          s={0.92}
          sedi
          {...BAKA}
          glavaNagib={klim}
          glava={{ ...BAKA.glava, pogled: [1, -0.3], izraz: f >= kOdmah ? "srecna" : "mirna", usta: govor(f, kPitaju, 16) + govor(f, kCiji, 22) }}
          lr={[20, 40]}
          dr={[-20, -40]}
        />
        <Figura x={x} y={TLO} s={1.12} {...LAZA} hod={f < 50 ? f * 0.36 : undefined} glava={{ ...LAZA.glava, pogled: [-1, 0], usta: govor(f, kKaze + 4, 26), izraz: "osmeh" }} />
        {/* porodično stablo iznad mladićeve glave */}
        <Linija d={`M${x},${glavaY} C${x},${glavaY - 60} ${OTAC_P[0]},${OTAC_P[1] + 140} ${OTAC_P[0]},${OTAC_P[1] + 88}`} debljina={10} napredak={stablo} />
        <Linija d={`M${OTAC_P[0] + 80},${OTAC_P[1] - 30} C${OTAC_P[0] + 150},${OTAC_P[1] - 60} ${DEDA_P[0] - 120},${DEDA_P[1] + 20} ${DEDA_P[0] - 86},${DEDA_P[1] + 6}`} debljina={10} napredak={deda} />
      </Rez>
      {[
        { p: OTAC_P, at: kKaze + 14, lik: OTAC, ime: "Mile" },
        { p: DEDA_P, at: kKaze + 36, lik: DEDA, ime: "Đura" },
      ].map(({ p, at, lik, ime }) => (
        <Utisni key={ime} at={at} x={p[0]} y={p[1]}>
          <Rez lokalno>
            <Medaljon r={84} id={ime} pozadina={L.okerSvetli}>
              <g transform="translate(0 40) scale(0.62)">
                <Glava {...lik.glava} izraz="osmeh" />
              </g>
            </Medaljon>
            <rect x={-62} y={92} width={124} height={50} fill={L.mastilo} />
            <text y={130} textAnchor="middle" fontFamily={SLAB} fontSize={36} fill={L.papir}>
              {ime}
            </text>
          </Rez>
        </Utisni>
      ))}
    </Kadar>
  );
};

// ── 4 ── A kad dođe neko nov iz drugog sela, nađe se neko koga zna. „To je Stevin zet.
//        Radili smo zajedno žetvu.“ I to je bilo dovoljno.
const Kapija: React.FC<{ otvor: number }> = ({ otvor }) => (
  <g>
    <Povrs d="M-200,0 L-200,-340 L-160,-340 L-160,0Z M160,0 L160,-340 L200,-340 L200,0Z" boja={L.mastilo} />
    <Povrs d="M-222,-340 C-120,-410 120,-410 222,-340 L222,-318 C120,-386 -120,-386 -222,-318Z" boja={L.crvena} />
    {[-1, 1].map((st) => (
      <g key={st} transform={`translate(${st * 160} 0) scale(${-st * (1 - otvor * 0.8)} 1)`}>
        <Povrs d="M0,0 L0,-296 C60,-316 160,-316 160,-296 L160,0Z" boja={L.oker} />
        {[32, 64, 96, 128].map((xx) => (
          <path key={xx} d={urez(xx, -290, xx, -8, 4)} fill={L.mastilo} opacity={0.7} />
        ))}
      </g>
    ))}
  </g>
);

export const Scena4: React.FC = () => {
  const f = useF();
  const kNadje = kad(4, "nađe");
  const kTo = kad(4, "To");
  const kRadili = kad(4, "Radili");
  const kI = kad(4, "I");
  const kDovoljno = kad(4, "dovoljno");
  const xd = interpolate(f, [0, kNadje - 6], [-160, 370], { extrapolateRight: "clamp" });
  const xp = interpolate(f, [kNadje - 4, kTo - 4], [1250, 590], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rukovanje = napredak(f, kDovoljno - 14, 14);
  const medaljon = f >= kRadili - 4 && f < kI;
  const otvor = napredak(f, kDovoljno + 6, 24);
  return (
    <Kadar>
      <Rez>
        <Papir />
        <NeboUrezi y0={250} y1={960} seed="s4" />
        <Registar seed="s4s">
          <Sunce x={180} y={560} r={60} />
        </Registar>
        {/* drugo selo na obzorju */}
        {[560, 660, 760, 880].map((x, i) => (
          <g key={x} transform={`translate(${x} 970)`}>
            <KucaL s={0.26 + (i % 2) * 0.04} />
          </g>
        ))}
        <Zemlja y={960} seed="s4z" />
        {/* prašnjav put */}
        <Povrs d="M450,960 C420,1080 220,1240 -60,1340 L-60,1480 C320,1380 540,1150 540,960Z" boja={L.papirTopli} debljina={5} trunje={0.4} />
        <g transform="translate(980 1330)">
          <Kapija otvor={otvor} />
        </g>
        <Ograda x0={1160} x1={1220} y={TLO + 6} h={210} />
        <Figura x={xp} y={TLO - 60} s={0.9} {...POZNANIK} hod={f >= kNadje - 4 && f < kTo - 4 ? f * 0.36 : undefined} glava={{ ...POZNANIK.glava, izraz: "osmeh", pogled: [-1, 0], usta: govor(f, kTo, 40) }} lr={f >= kTo ? [-80, -10] : [10, 8]} />
        <Figura x={930} y={TLO + 10} s={1.02} {...DOMACIN} glava={{ ...DOMACIN.glava, izraz: f >= kDovoljno ? "srecna" : f >= kTo ? "zamisljena" : "sumnja", pogled: [-1, 0] }} lr={[mesaj(10, -60, rukovanje), mesaj(8, 0, rukovanje)]} />
        <Figura x={xd} y={TLO + 16} s={1.02} {...DOSLJAK} hod={f < kNadje - 6 ? f * 0.36 : undefined} glava={{ ...DOSLJAK.glava, izraz: f >= kDovoljno ? "srecna" : "mirna", pogled: [1, 0] }} dr={[mesaj(-10, 60, rukovanje), mesaj(-8, 0, rukovanje)]} lr={[20, 60]} drziL={<Torba />} drziLRot={-10} />
        <Zemlja y={1390} seed="s4z2" visina={700} />
      </Rez>
      {medaljon && (
        <Utisni at={kRadili - 4} x={540} y={640}>
          <Rez lokalno>
            <Medaljon r={250} id="zetva" pozadina={L.okerSvetli}>
              <Sunce x={130} y={-140} r={50} zraci={false} />
              <Srafura x={-260} y={-60} w={520} h={300} ugao={-80} razmak={20} duzina={40} debljina={4} boja={L.oker} seed="zet" />
              {[-170, 170].map((x) => (
                <g key={x} transform={`translate(${x} 170)`}>
                  <Snop s={0.8} />
                </g>
              ))}
              <Figura x={-40} y={240} s={0.4} {...POZNANIK} glava={{ ...POZNANIK.glava, izraz: "srecna" }} dr={[120, 20]} drziD={<Kosa />} drziDRot={-40} />
              <Figura x={70} y={240} s={0.4} {...DOSLJAK} glava={{ ...DOSLJAK.glava, izraz: "srecna" }} lr={[-120, -20]} />
              <Zemlja y={236} seed="zetz" />
            </Medaljon>
          </Rez>
        </Utisni>
      )}
    </Kadar>
  );
};

// ── 5 ── Tako je nastajalo poverenje i novo poznanstvo. Preko nekoga koga već znaš. Veza po veza, selo po selo.
const SELA: [number, number][] = [
  [210, 560],
  [520, 470],
  [860, 560],
  [300, 860],
  [640, 800],
  [920, 930],
  [190, 1160],
  [520, 1130],
  [860, 1220],
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
  const f = useF();
  const pocetak = (w: string, n: number, dod: number) => kad(5, w, n) + dod;
  const z = interpolate(f, [0, trajanjeF(5)], [1.12, 1.0]);
  const spojeno = new Set<number>();
  VEZE.forEach(([a, b, w, n, d]) => {
    if (f >= pocetak(w, n, d) + 8) {
      spojeno.add(a);
      spojeno.add(b);
    }
  });
  return (
    <Kadar>
      <Rez>
        <Kamera y={880} z={z}>
          <Papir boja={L.papirTopli} />
          {/* ravnica: njive */}
          {Array.from({ length: 14 }, (_, i) => {
            const x = -100 + (i % 4) * 330 + random(`r${i}`) * 60;
            const y = 380 + Math.floor(i / 4) * 280 + random(`q${i}`) * 60;
            const c = i % 3 === 0 ? L.oker : i % 3 === 1 ? L.papir : L.sivaSvetla;
            return (
              <g key={i}>
                <path d={kutija(x, y, 280, 220, 10)} fill={c} opacity={0.75} />
                <Srafura x={x + 8} y={y + 12} w={264} h={196} ugao={i % 2 ? 0 : -90} razmak={26} duzina={60} debljina={2.5} boja={L.mastilo} seed={`rv${i}`} opacity={0.35} />
              </g>
            );
          })}
          {/* stari putevi (tanki, mastilom) */}
          {VEZE.map(([a, b], i) => (
            <path key={i} d={`M${SELA[a][0]},${SELA[a][1]} L${SELA[b][0]},${SELA[b][1]}`} stroke={L.mastilo} strokeWidth={3} strokeDasharray="3 14" opacity={0.5} />
          ))}
          {/* veze poverenja */}
          {VEZE.map(([a, b, w, n, d], i) => {
            const p = napredak(f, pocetak(w, n, d), 14);
            if (p <= 0) return null;
            const [x1, y1] = SELA[a];
            const [x2, y2] = SELA[b];
            const mx = (x1 + x2) / 2 + (y2 - y1) * 0.12;
            const my = (y1 + y2) / 2 - (x2 - x1) * 0.12;
            return <Linija key={i} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} boja={L.crvena} debljina={14} napredak={p} />;
          })}
          {SELA.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y + 40})`}>
              <g transform="translate(-44 0)">
                <KucaL s={0.18} />
              </g>
              <g transform="translate(40 6)">
                <KucaL s={0.2} />
              </g>
              <g transform="translate(0 -30)">
                <KucaL s={0.16} />
              </g>
              {spojeno.has(i) && <circle cy={-120} r={16} fill={L.crvena} stroke={L.mastilo} strokeWidth={4} />}
            </g>
          ))}
        </Kamera>
      </Rez>
    </Kadar>
  );
};

// ── 6 ── KOLO radi isto. Ne tražimo ličnu kartu, ne tražimo ni pravo ime.
//        Dovoljno je da te potvrdi neko ko te lično zna.
const Saka: React.FC<{ okreni?: boolean }> = ({ okreni }) => (
  <g transform={`scale(${okreni ? -1 : 1} 1)`}>
    <Povrs d="M-160,120 C-170,40 -120,-10 -60,-10 L60,-10 C90,-10 100,30 70,40 L-10,40 C-40,60 -60,110 -60,200Z" boja={L.koza} debljina={6} trunje={0} />
    <Povrs d="M-200,200 L-60,200 L-40,380 L-230,380Z" boja={L.mastilo} />
  </g>
);

export const Scena6: React.FC = () => {
  const f = useF();
  const kKolo = kad(6, "KOLO");
  const kKartu = kad(6, "ličnu");
  const kIme = kad(6, "pravo");
  const kDovoljno = kad(6, "Dovoljno");
  const kPotvrdi = kad(6, "potvrdi");
  const kLicno = kad(6, "lično");
  const kZna = kad(6, "zna");
  const podela = napredak(f, kDovoljno - 6, 20);
  const precrt1 = napredak(f, kKartu + 12, 14);
  const precrt2 = napredak(f, kIme + 12, 14);
  const skriveno = 1 - napredak(f, kDovoljno - 10, 10);
  const pecat = usePop(kZna + 6, 260, 16);
  const zrak = napredak(f, kPotvrdi - 4, 12);
  const telX = mesaj(540, 290, podela);
  const telS = mesaj(1.4, 1.22, podela);
  return (
    <Kadar>
      <Papir />
      <Rez>
        <Srafura x={-20} y={380} w={1120} h={900} ugao={-30} razmak={60} duzina={90} debljina={3} boja={L.mastilo} seed="s6" opacity={0.18} />
        {/* telefon onoga koga potvrđuju */}
        <g transform={`translate(${telX} ${mesaj(830, 900, podela)})`} filter="url(#mekoSenka)">
          <Telefon s={telS}>
            {podela < 0.5 ? (
              <g opacity={f >= kKolo ? 1 : 0}>
                <rect x={-134} y={-272} width={268} height={62} rx={18} fill={L.zelena} />
                <rect x={-134} y={-240} width={268} height={30} fill={L.zelena} />
                <text x={-112} y={-230} fontFamily={SANS} fontWeight={900} fontSize={27} fill="#fff">
                  KOLO
                </text>
                <circle cx={0} cy={-100} r={62} fill={L.oker} stroke={L.mastilo} strokeWidth={5} />
                <text x={0} y={-80} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={L.mastilo}>
                  L
                </text>
                <text x={0} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={25} fill={L.mastilo}>
                  laza.sa.salasa
                </text>
                <text x={0} y={46} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={17} fill={L.siva}>
                  nadimak, ne pravo ime
                </text>
                {["Lična karta", "Pravo ime"].map((t, i) => (
                  <g key={t} transform={`translate(0 ${110 + i * 64})`} opacity={f >= (i ? kIme : kKartu) ? 1 : 0.25}>
                    <rect x={-112} y={-26} width={224} height={50} rx={10} fill="#fff" stroke={L.sivaSvetla} strokeWidth={3} />
                    <text x={-98} y={7} fontFamily={SANS} fontWeight={800} fontSize={18} fill={L.mastilo}>
                      {t}
                    </text>
                    <text x={98} y={7} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={16} fill={L.crvena}>
                      ne traži se
                    </text>
                  </g>
                ))}
              </g>
            ) : (
              <EkranKod pseudonim="laza.sa.salasa" />
            )}
          </Telefon>
        </g>
        {/* telefon onoga ko potvrđuje (baka) */}
        {podela > 0 && (
          <g transform={`translate(${mesaj(1300, 790, podela)} 900)`}>
            <Telefon s={1.22}>
              <EkranPotvrde pseudonim="laza.sa.salasa" kvacica={f >= kLicno + 4 ? 1 : 0} pritisak={napredak(f, kZna - 2, 8)} gotovo={f >= kZna + 6 ? 1 : 0} />
            </Telefon>
          </g>
        )}
        {zrak > 0 && podela > 0.9 && <Linija d="M680,720 L420,880" boja={L.zelena} debljina={8} crtica="18 14" opacity={zrak * (1 - napredak(f, kLicno, 10))} />}
      </Rez>
      {/* lična karta i pravo ime — precrtano */}
      {f >= kKartu - 2 && (
        <g opacity={skriveno}>
          <Utisni at={kKartu - 2} x={230} y={520} rot={-8}>
            <Rez lokalno>
              <LicnaKarta s={0.8} />
              <Precrtano w={250} h={160} napredak={precrt1} />
            </Rez>
          </Utisni>
        </g>
      )}
      {f >= kIme - 2 && (
        <g opacity={skriveno}>
          <Utisni at={kIme - 2} x={850} y={520} rot={6}>
            <Rez lokalno>
              <Povrs d={kutija(-150, -60, 300, 120, 10)} boja={L.papirTopli} />
              <text y={-14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={22} fill={L.siva}>
                Ime i prezime
              </text>
              <text y={30} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={L.mastilo}>
                Lazar P.
              </text>
              <Precrtano w={260} h={100} napredak={precrt2} />
            </Rez>
          </Utisni>
        </g>
      )}
      {f >= kZna + 6 && (
        <g transform={`translate(540 560) rotate(-12) scale(${1 + (1 - Math.min(1, pecat)) * 0.4})`} opacity={Math.min(1, pecat * 2)}>
          <Rez lokalno>
            <Pecat tekst="POTVRĐEN" s={1} />
          </Rez>
        </g>
      )}
    </Kadar>
  );
};

// ── 7 ── Pa, čiji si ti? Ko tebe zna? Uđi u KOLO. ekolo.rs
const KOLO_LIKOVI = [BAKA, LAZA, DOMACIN, DOSLJAK, POZNANIK, OTAC, DEDA, BAKA];

export const KoloOkoZnaka: React.FC<{ f: number; od: number; likovi: typeof KOLO_LIKOVI; cy?: number }> = ({ f, od, likovi, cy = 930 }) => {
  const ugao = (f - od) * 1.1;
  const pojava = Math.min(1, Math.max(0, (f - od) / 14));
  const lik = (i: number, prednji: boolean) => {
    const a = ((ugao + (i * 360) / likovi.length) * Math.PI) / 180;
    if (prednji !== Math.sin(a) > 0) return null;
    const l = likovi[i];
    const dubina = 0.85 + 0.15 * (Math.sin(a) + 1) / 2;
    return <Figura key={i} x={540 + Math.cos(a) * 320} y={cy + Math.sin(a) * 100} s={0.3 * dubina} {...l} lr={[-80, 0]} dr={[80, 0]} glava={{ ...l.glava, izraz: "srecna" }} hod={f / 4 + i} />;
  };
  return (
    <g opacity={pojava}>
      <ellipse cx={540} cy={cy - 118} rx={320} ry={100} fill="none" stroke={L.mastilo} strokeWidth={18} />
      <ellipse cx={540} cy={cy - 118} rx={320} ry={100} fill="none" stroke={L.koza} strokeWidth={8} />
      {likovi.map((_, i) => lik(i, false))}
      <g transform="translate(540 620)">
        <ZnakKolo vel={340} />
      </g>
      {likovi.map((_, i) => lik(i, true))}
      <path d={`M220,${cy - 118} A320,100 0 0,0 860,${cy - 118}`} fill="none" stroke={L.mastilo} strokeWidth={18} />
      <path d={`M220,${cy - 118} A320,100 0 0,0 860,${cy - 118}`} fill="none" stroke={L.koza} strokeWidth={8} />
    </g>
  );
};

export const Scena7: React.FC = () => {
  const f = useF();
  const kPa = kad(7, "Pa");
  const kCiji = kad(7, "čiji");
  const kKo = kad(7, "Ko");
  const kUdji = kad(7, "Uđi");
  const kEkolo = kad(7, "ekolo.rs");
  const zum = interpolate(f, [0, kKo], [1.8, 1.5], { extrapolateRight: "clamp" });
  const kartica = napredak(f, kUdji - 10, 12);
  const adresa = usePop(kEkolo - 3, 200, 13);
  const dugme = usePop(kEkolo + 8, 200, 13);
  const lica = [LAZA, DOMACIN, DOSLJAK, POZNANIK, OTAC, DEDA];
  return (
    <Kadar>
      {kartica < 1 && (
        <g opacity={1 - kartica}>
          <Rez>
            <Kamera x={300} y={900} z={zum}>
              <Ulica seed="s7" />
              <g transform="translate(300 1335)">
                <Klupa s={1.12} />
              </g>
              <Figura x={300} y={TLO} s={1.08} sedi {...BAKA} glava={{ ...BAKA.glava, pogled: [0, 0.2], usta: govor(f, kCiji - 2, 20) + govor(f, kPa - 2, 8) }} lr={[20, 40]} dr={[-20, -40]} />
            </Kamera>
          </Rez>
          {lica.map((l, i) => {
            const a = (i / lica.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <Utisni key={i} at={kKo + i * 3} x={540 + Math.cos(a) * 390} y={860 + Math.sin(a) * 420}>
                <Rez lokalno>
                  <Medaljon r={78} id={`k7${i}`} pozadina={L.okerSvetli}>
                    <g transform="translate(0 38) scale(0.6)">
                      <Glava {...l.glava} izraz="osmeh" />
                    </g>
                  </Medaljon>
                </Rez>
              </Utisni>
            );
          })}
        </g>
      )}
      {kartica > 0 && (
        <g opacity={kartica}>
          <Papir />
          <Srafura x={-20} y={330} w={1120} h={1000} ugao={-30} razmak={60} duzina={90} debljina={3} boja={L.mastilo} seed="s7k" opacity={0.15} />
          <Rez>
            <KoloOkoZnaka f={f} od={kUdji - 10} likovi={KOLO_LIKOVI} />
          </Rez>
          <g transform={`translate(540 1150) scale(${adresa})`}>
            <text textAnchor="middle" fontFamily={SLAB} fontSize={140} fill={L.zelena}>
              ekolo.rs
            </text>
          </g>
          <g transform={`translate(540 1252) scale(${dugme})`}>
            <Rez lokalno>
              <rect x={-250} y={-50} width={500} height={100} fill={L.mastilo} />
              <text y={20} textAnchor="middle" fontFamily={SLAB} fontSize={54} fill={L.papir}>
                Uđi u KOLO
              </text>
            </Rez>
          </g>
        </g>
      )}
    </Kadar>
  );
};

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7];
export { kadKraj };
