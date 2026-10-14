// Predmeti i pozadine videa 19 „Ko krade iz zajedničke kase?“: kasa zgrade, dinari, sveska kase
// (uplate i troškovi), komoda sa fiokom, ulaz stambene zgrade sa oglasnom tablom, papirni upitnik,
// telefon sa stranicom Sistem, knjiga pravila, lupa. POEN je samo red u spisku, nikad novčić.
import React from "react";
import { P } from "./paleta";
import { RUKOPIS, SANS, SERIF } from "./fontovi";
import { Linija, Oblik, elipsa, kutija } from "./alat";
import type { GlavaCfg } from "./likovi";

// ── Likovi ───────────────────────────────────────────────────────────────
type Odeca =
  | { tip: "haljina"; haljina: string; dzemper?: string; kecelja?: boolean }
  | { tip: "muski"; kosulja: string; pantalone: string; prsluk?: string; kaput?: boolean }
  | { tip: "suknja"; bluza: string; suknja: string };
export const DJURA = {
  odeca: { tip: "muski", kosulja: "#E4DCC8", pantalone: P.teget, prsluk: P.drvo } as Odeca,
  glava: { kosa: "muz_sed", brkovi: true, naocare: true, bojaKose: P.kosaSeda, seed: 2 } as GlavaCfg,
};
export const STANARKA = {
  odeca: { tip: "suknja", bluza: P.roze, suknja: P.plava } as Odeca,
  glava: { kosa: "rep", bojaKose: P.kosaSmedja, seed: 4 } as GlavaCfg,
};
export const STANAR = {
  odeca: { tip: "muski", kosulja: P.oker, pantalone: P.teget, prsluk: P.zelenaTamna } as Odeca,
  glava: { kosa: "kacket", brkovi: true, bojaKose: P.kosaSeda, seed: 3 } as GlavaCfg,
};
export const MLADI_STANAR = {
  odeca: { tip: "muski", kosulja: P.zelenaPrigusena, pantalone: P.teget } as Odeca,
  glava: { kosa: "mlad", bojaKose: P.kosaTamna, seed: 7 } as GlavaCfg,
};
export const BAKA = {
  odeca: { tip: "haljina", haljina: P.plava, dzemper: P.pekmez } as Odeca,
  glava: { kosa: "marama", bojaKose: P.ajvar, seed: 9 } as GlavaCfg,
};
export const DEVOJCICA = {
  odeca: { tip: "suknja", bluza: P.oker, suknja: P.ajvar } as Odeca,
  glava: { kosa: "devojcica", bojaKose: P.kosaRida, seed: 6 } as GlavaCfg,
};

// ── Kasa i dinari ────────────────────────────────────────────────────────
/** Limena kasa sa natpisom ZGRADA; dno na (0,0). `otvor` 0–1 podiže poklopac. */
export const Kasa: React.FC<{ s?: number; otvor?: number; pun?: number }> = ({ s = 1, otvor = 0, pun = 0 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={4} rx={150} ry={16} fill={P.senka} opacity={0.2} />
    <Oblik d={kutija(-130, -150, 260, 150, 12)} boja="#5E7F8C" debljina={4.5} tekstura={0.3} />
    <path d="M-130,-118 L130,-118" stroke={P.mastilo} strokeWidth={2.5} opacity={0.45} />
    <Oblik d={kutija(-82, -98, 164, 56, 6)} boja={P.belo} debljina={3} tekstura={0.1} />
    <text x={0} y={-58} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.mastilo} letterSpacing={3}>
      ZGRADA
    </text>
    <Oblik d={elipsa(0, -18, 14, 10)} boja={P.oker} debljina={3} tekstura={0} />
    {pun > 0 && (
      <g opacity={Math.min(1, otvor * 2)}>
        {[-70, -20, 34, 80].map((x, i) => (
          <g key={i} transform={`translate(${x} ${-150 - pun * 18}) rotate(${i * 9 - 14})`}>
            <Novcanica s={0.42} />
          </g>
        ))}
      </g>
    )}
    <g transform={`translate(-130 -150) rotate(${-otvor * 62})`}>
      <Oblik d={kutija(0, -26, 260, 30, 8)} boja="#6E909C" debljina={4.5} tekstura={0.25} />
      <Oblik d={kutija(110, -40, 40, 16, 6)} boja={P.mastiloSvetlo} debljina={3} tekstura={0} />
    </g>
  </g>
);

/** Dinarska novčanica (opšta, bez stvarnog izgleda); sredina u (0,0). */
export const Novcanica: React.FC<{ s?: number; iznos?: string }> = ({ s = 1, iznos = "1000" }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-130, -62, 260, 124, 6)} boja="#C9B98A" debljina={3.5} tekstura={0.35} />
    <rect x={-116} y={-48} width={232} height={96} rx={4} fill="none" stroke={P.drvoTamno} strokeWidth={2} opacity={0.5} />
    <Oblik d={elipsa(-56, 0, 34, 38)} boja="#B3A070" debljina={2.5} tekstura={0} />
    <text x={58} y={-6} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} fill={P.drvoTamno}>
      {iznos}
    </text>
    <text x={58} y={26} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={15} fill={P.drvoTamno} letterSpacing={2}>
      DINARA
    </text>
  </g>
);

export const Kovanica: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={elipsa(0, 0, 26, 26)} boja="#C9A44A" debljina={3.5} tekstura={0.2} />
    <circle r={17} fill="none" stroke={P.drvoTamno} strokeWidth={2} opacity={0.5} />
    <text y={8} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={22} fill={P.drvoTamno}>
      20
    </text>
  </g>
);

// ── Sveska kase ──────────────────────────────────────────────────────────
export type Stavka = { tekst: string; iznos: string };
export const UPLATE: Stavka[] = [
  { tekst: "stan 1", iznos: "2.000" },
  { tekst: "stan 4", iznos: "2.000" },
  { tekst: "stan 7", iznos: "2.000" },
];
export const TROSKOVI: Stavka[] = [
  { tekst: "sijalica u ulazu", iznos: "450" },
  { tekst: "čišćenje stepen.", iznos: "1.500" },
  { tekst: "brava podruma", iznos: "900" },
];

/**
 * Otvorena sveska na kockice, sredina hrpta u (0,0). Leva strana „uplate“, desna „troškovi“.
 * `pisanje` 0–1 za svaki red (3 uplate pa 3 troška), `zbir` 0–1 ispisuje red „ostalo u kasi“,
 * `isticanje` [indeks reda, 0–1] podvlači red (prst koji proverava).
 */
export const SveskaKase: React.FC<{
  w?: number;
  h?: number;
  zaglavlje?: number;
  pisanje?: number[];
  zbir?: number;
  isticanje?: [number, number][];
  dodatniRed?: number;
}> = ({ w = 760, h = 500, zaglavlje = 1, pisanje = [1, 1, 1, 1, 1, 1], zbir = 0, isticanje = [], dodatniRed = 0 }) => {
  const x0 = -w / 2;
  const y0 = -h / 2;
  const kockica = 26;
  const red0 = y0 + 132;
  const korak = 74;
  const strana = (lista: Stavka[], desno: boolean, pocetak: number) =>
    lista.map((st, i) => {
      const p = pisanje[pocetak + i] ?? 0;
      if (p <= 0) return null;
      const xL = desno ? 28 : x0 + 34;
      const xR = desno ? -x0 - 30 : -26;
      const y = red0 + i * korak;
      const ist = isticanje.find(([k]) => k === pocetak + i)?.[1] ?? 0;
      const tekst = st.tekst.slice(0, Math.ceil(st.tekst.length * Math.min(1, p * 1.6)));
      return (
        <g key={i}>
          {ist > 0 && <rect x={xL - 10} y={y - 44} width={(xR - xL + 20) * ist} height={58} rx={10} fill={P.zlatna} opacity={0.38} />}
          <text x={xL} y={y} fontFamily={RUKOPIS} fontWeight={700} fontSize={42} fill={P.mastilo}>
            {tekst}
          </text>
          {p > 0.62 && (
            <text x={xR} y={y} textAnchor="end" fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={desno ? P.ajvarTamni : P.zelena700} opacity={Math.min(1, (p - 0.62) * 4)}>
              {st.iznos}
            </text>
          )}
        </g>
      );
    });
  return (
    <g>
      <Oblik d={kutija(x0 + 14, y0 + 20, w, h, 14)} boja={P.senka} ivica={false} opacity={0.3} tekstura={0} />
      <Oblik d={kutija(x0 - 12, y0 - 8, w + 24, h + 20, 14)} boja="#3F5F7A" debljina={4.5} tekstura={0.3} />
      <Oblik d={`M${x0},${y0} C${x0 + w * 0.2},${y0 - 12} -26,${y0 - 6} 0,${y0 + 8} L0,${y0 + h} C-26,${y0 + h - 10} ${x0 + w * 0.2},${y0 + h - 16} ${x0},${y0 + h}Z`} boja={P.belo} debljina={3.5} tekstura={0.12} />
      <Oblik d={`M${-x0},${y0} C${-x0 - w * 0.2},${y0 - 12} 26,${y0 - 6} 0,${y0 + 8} L0,${y0 + h} C26,${y0 + h - 10} ${-x0 - w * 0.2},${y0 + h - 16} ${-x0},${y0 + h}Z`} boja={P.belo} debljina={3.5} tekstura={0.12} />
      {/* kockice */}
      <g opacity={0.22}>
        {Array.from({ length: Math.floor(w / kockica) - 1 }, (_, i) => (
          <line key={`v${i}`} x1={x0 + (i + 1) * kockica} y1={y0 + 16} x2={x0 + (i + 1) * kockica} y2={y0 + h - 10} stroke={P.plava} strokeWidth={1.5} />
        ))}
        {Array.from({ length: Math.floor(h / kockica) - 1 }, (_, i) => (
          <line key={`h${i}`} x1={x0 + 8} y1={y0 + 14 + (i + 1) * kockica} x2={-x0 - 8} y2={y0 + 14 + (i + 1) * kockica} stroke={P.plava} strokeWidth={1.5} />
        ))}
      </g>
      <line x1={0} y1={y0 + 8} x2={0} y2={y0 + h} stroke={P.mastilo} strokeWidth={3} opacity={0.5} />
      <g opacity={zaglavlje}>
        <text x={x0 + w / 4} y={y0 + 66} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.zelena700} letterSpacing={3}>
          UPLATE
        </text>
        <text x={-x0 - w / 4} y={y0 + 66} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.ajvarTamni} letterSpacing={3}>
          TROŠKOVI
        </text>
        <line x1={x0 + 30} y1={y0 + 84} x2={-30} y2={y0 + 84} stroke={P.zelena700} strokeWidth={3} opacity={0.6} />
        <line x1={30} y1={y0 + 84} x2={-x0 - 30} y2={y0 + 84} stroke={P.ajvarTamni} strokeWidth={3} opacity={0.6} />
      </g>
      {strana(UPLATE, false, 0)}
      {strana(TROSKOVI, true, 3)}
      {dodatniRed > 0 && (
        <text x={34} y={red0 + 3 * korak} fontFamily={RUKOPIS} fontWeight={700} fontSize={42} fill={P.mastilo} opacity={Math.min(1, dodatniRed * 2)}>
          {"metla i krpe".slice(0, Math.ceil(12 * Math.min(1, dodatniRed * 1.5)))}
          {dodatniRed > 0.66 ? "      300" : ""}
        </text>
      )}
      {zbir > 0 && (
        <g>
          <Linija d={`M${x0 + 40},${y0 + h - 82} L${-x0 - 40},${y0 + h - 82}`} debljina={4} napredak={Math.min(1, zbir * 2)} />
          <text x={0} y={y0 + h - 30} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={46} fill={P.mastilo} opacity={Math.max(0, zbir * 2 - 1)}>
            ostalo u kasi: {dodatniRed > 0 ? "2.850" : "3.150"}
          </text>
        </g>
      )}
    </g>
  );
};

// ── Komoda sa fiokom ─────────────────────────────────────────────────────
/** Komoda (dno u 0,0), `fioka` 0–1 koliko je gornja fioka izvučena; sadržaj fioke se prosleđuje. */
export const Komoda: React.FC<{ fioka?: number; uFioci?: React.ReactNode }> = ({ fioka = 0, uFioci }) => (
  <g>
    <ellipse cx={0} cy={6} rx={240} ry={18} fill={P.senka} opacity={0.2} />
    <Oblik d={kutija(-220, -420, 440, 420, 10)} boja={P.drvo} debljina={4.5} tekstura={0.35} />
    <Oblik d={kutija(-236, -440, 472, 30, 8)} boja={P.drvoTamno} debljina={4} tekstura={0.3} />
    {[1, 2].map((i) => (
      <g key={i}>
        <Oblik d={kutija(-196, -400 + i * 130, 392, 110, 6)} boja={P.drvoSvetlo} debljina={3.5} tekstura={0.3} />
        <Oblik d={kutija(-30, -356 + i * 130, 60, 16, 6)} boja={P.drvoTamno} debljina={3} tekstura={0} />
      </g>
    ))}
    {/* gornja fioka: izvlači se ka gledaocu (malo naniže i veća) */}
    <g transform={`translate(0 ${fioka * 70}) scale(${1 + fioka * 0.08})`}>
      {fioka > 0.05 && (
        <g>
          <Oblik d={`M-196,-400 L196,-400 L214,${-400 - fioka * 60} L-214,${-400 - fioka * 60}Z`} boja="#4A2E1C" debljina={3.5} tekstura={0} />
          <g transform={`translate(0 ${-400 - fioka * 34})`}>{uFioci}</g>
        </g>
      )}
      <Oblik d={kutija(-196, -400, 392, 110, 6)} boja={P.drvoSvetlo} debljina={3.5} tekstura={0.3} />
      <Oblik d={kutija(-30, -356, 60, 16, 6)} boja={P.drvoTamno} debljina={3} tekstura={0} />
    </g>
  </g>
);

/** Zatvorena sveska (korice), sredina u (0,0). */
export const ZatvorenaSveska: React.FC<{ s?: number; natpis?: string }> = ({ s = 1, natpis = "KASA" }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-150, -100, 300, 200, 12)} boja="#3F5F7A" debljina={4.5} tekstura={0.3} />
    <Oblik d={kutija(-90, -50, 180, 64, 6)} boja={P.belo} debljina={3} tekstura={0.1} />
    <text x={0} y={-6} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.mastilo}>
      {natpis}
    </text>
  </g>
);

// ── Ulaz zgrade ──────────────────────────────────────────────────────────
/**
 * Ulaz stambene zgrade iz šezdesetih: zid sa uljanom bojom do pola, sandučići, staklena ulazna vrata,
 * sijalica. Pod (teraco) od y=1250. `svetlo` 0–1 pali sijalicu.
 */
export const Ulaz: React.FC<{ svetlo?: number; bezSanducica?: boolean }> = ({ svetlo = 0.4, bezSanducica }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={1500} fill="#EFE3C4" />
    <rect x={-200} y={-200} width={1480} height={1500} fill="url(#gvasP)" opacity={0.28} style={{ mixBlendMode: "multiply" }} />
    {/* uljana boja do pola zida */}
    <rect x={-200} y={760} width={1480} height={500} fill="#8FAE9A" />
    <rect x={-200} y={760} width={1480} height={500} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
    <path d="M-200,760 L1280,760" stroke={P.zelenaTamna} strokeWidth={8} />
    {/* ulazna vrata levo */}
    <Oblik d={kutija(-60, 420, 300, 830, 6)} boja="#9AA7A5" debljina={5} tekstura={0.25} />
    <Oblik d={kutija(-30, 460, 240, 360, 4)} boja="#CFE1E2" debljina={4} tekstura={0.12} />
    <Oblik d={kutija(-30, 850, 240, 360, 4)} boja="#CFE1E2" debljina={4} tekstura={0.12} />
    <path d="M10,480 L80,800" stroke="#fff" strokeWidth={10} opacity={0.5} />
    <Oblik d={kutija(200, 820, 24, 90, 8)} boja={P.mastiloSvetlo} debljina={3} tekstura={0} />
    {/* sijalica */}
    <line x1={560} y1={-200} x2={560} y2={140} stroke={P.mastilo} strokeWidth={4} />
    <circle cx={560} cy={170} r={150 + svetlo * 80} fill="url(#toplaSvetlost)" opacity={svetlo} />
    <Oblik d={elipsa(560, 168, 28, 34)} boja={svetlo > 0.5 ? "#FFE9A8" : "#E9E2CC"} debljina={3.5} tekstura={0} />
    <Oblik d={kutija(546, 124, 28, 22, 4)} boja={P.mastiloSvetlo} debljina={3} tekstura={0} />
    {/* sandučići */}
    {!bezSanducica && (
      <g transform="translate(330 860)">
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`translate(${(i % 3) * 112} ${Math.floor(i / 3) * 96})`}>
            <Oblik d={kutija(0, 0, 104, 88, 4)} boja="#B9A27A" debljina={3.5} tekstura={0.3} />
            <rect x={14} y={14} width={76} height={10} rx={4} fill={P.mastilo} opacity={0.6} />
            <text x={52} y={66} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} fill={P.mastilo} opacity={0.7}>
              {i + 1}
            </text>
          </g>
        ))}
      </g>
    )}
    {/* pod: teraco */}
    <rect x={-200} y={1250} width={1480} height={900} fill="#B8AE9C" />
    <rect x={-200} y={1250} width={1480} height={900} fill="url(#gvasP)" opacity={0.45} style={{ mixBlendMode: "multiply" }} />
    {Array.from({ length: 60 }, (_, i) => (
      <circle key={i} cx={(i * 197) % 1400 - 160} cy={1270 + ((i * 89) % 600)} r={3 + (i % 3)} fill={i % 2 ? "#8C826F" : "#E8E0CF"} opacity={0.6} />
    ))}
    <path d="M-200,1250 L1280,1250" stroke={P.mastilo} strokeWidth={4} opacity={0.6} />
  </g>
);

/** Plutana oglasna tabla; gornja leva tačka okvira u (0,0), w×h. Sadržaj (sveska) se prosleđuje. */
export const OglasnaTabla: React.FC<{ w?: number; h?: number; svetlo?: number; children?: React.ReactNode; natpis?: boolean }> = ({ w = 560, h = 420, svetlo = 0, children, natpis = true }) => (
  <g>
    <Oblik d={kutija(10, 16, w, h, 10)} boja={P.senka} ivica={false} opacity={0.3} tekstura={0} />
    <Oblik d={kutija(0, 0, w, h, 10)} boja={P.drvoTamno} debljina={4.5} tekstura={0.3} />
    <Oblik d={kutija(18, 18, w - 36, h - 36, 4)} boja="#C69A62" debljina={3} tekstura={0.55} />
    {Array.from({ length: 40 }, (_, i) => (
      <circle key={i} cx={30 + ((i * 131) % (w - 60))} cy={30 + ((i * 71) % (h - 60))} r={2.5} fill={P.drvoTamno} opacity={0.35} />
    ))}
    {natpis && (
      <g>
        <Oblik d={kutija(w / 2 - 150, -58, 300, 50, 6)} boja={P.belo} debljina={3.5} tekstura={0.1} />
        <text x={w / 2} y={-22} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={26} fill={P.mastilo} letterSpacing={3}>
          OGLASNA TABLA
        </text>
      </g>
    )}
    {/* cedulja o čišćenju stepeništa, gore desno */}
    <g transform={`translate(${w - 120} 86) rotate(4)`}>
      <Oblik d={kutija(-80, -50, 160, 112, 4)} boja="#F6E9A8" debljina={3} tekstura={0.15} />
      <text x={0} y={-14} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={25} fill={P.mastilo}>
        čišćenje
      </text>
      <text x={0} y={14} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={25} fill={P.mastilo}>
        stepeništa
      </text>
      <text x={0} y={44} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={25} fill={P.ajvar}>
        subota
      </text>
      <circle cx={0} cy={-40} r={7} fill={P.ajvar} stroke={P.mastilo} strokeWidth={2} />
    </g>
    {children}
    {svetlo > 0 && <rect x={0} y={0} width={w} height={h} rx={10} fill="#FFE9A8" opacity={0.18 * svetlo} />}
  </g>
);

/** Rajsnegla (pribadača) sa okruglom glavom. */
export const Rajsnegla: React.FC<{ boja?: string }> = ({ boja = P.ajvar }) => (
  <g>
    <ellipse cx={3} cy={5} rx={13} ry={9} fill={P.senka} opacity={0.3} />
    <circle r={12} fill={boja} stroke={P.mastilo} strokeWidth={3} />
    <circle cx={-4} cy={-4} r={4} fill="#fff" opacity={0.6} />
  </g>
);

// ── Upitnik ──────────────────────────────────────────────────────────────
/** Upitnik isečen iz papira, sredina u (0,0). */
export const Upitnik: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = P.belo }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-34,-40 C-34,-80 34,-84 36,-42 C38,-14 8,-6 6,18 L-12,18 C-14,-14 16,-22 14,-42 C12,-60 -14,-58 -14,-40Z" boja={boja} debljina={4} tekstura={0.2} />
    <Oblik d={elipsa(-3, 44, 13, 13)} boja={boja} debljina={4} tekstura={0.2} />
  </g>
);

// ── Telefon sa stranicom Sistem ──────────────────────────────────────────
export type RedSistema = { vreme: string; od: string; ka: string; iznos: string };
export const REDOVI_SISTEMA: RedSistema[] = [
  { vreme: "09:12", od: "Milica", ka: "Stevan", iznos: "300" },
  { vreme: "09:40", od: "Zoran", ka: "Jovana", iznos: "1.200" },
  { vreme: "10:05", od: "Vesna", ka: "Milan", iznos: "450" },
  { vreme: "10:31", od: "Ana", ka: "Lazar", iznos: "800" },
  { vreme: "11:02", od: "Marija", ka: "Zoran", iznos: "250" },
  { vreme: "11:18", od: "Stevan", ka: "Ana", iznos: "600" },
];

/** Telefon (tamni okvir), sredina u (0,0), ekran 400×780. */
export const VelikiTelefon: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-224, -420, 448, 840, 52)} boja="#2D2A28" debljina={5} tekstura={0.1} />
    <rect x={-200} y={-390} width={400} height={780} rx={26} fill={P.belo} stroke={P.mastilo} strokeWidth={2} />
    <rect x={-40} y={-408} width={80} height={9} rx={4} fill="#555" />
    <g>{children}</g>
  </g>
);

/**
 * Ekran: stranica Sistem, tabela zapisa (Vreme · Davalac · Primalac · Iznos).
 * `redova` koliko je redova upisano (može decimalno: poslednji red klizi), `isticanje` [red, 0–1],
 * `zeleno` 0–1 zeleni znak uz svaki red (proveren, sve u redu).
 */
export const EkranSistem: React.FC<{ redova: number; isticanje?: [number, number]; zeleno?: number; novi?: number }> = ({ redova, isticanje, zeleno = 0, novi = 0 }) => {
  const y0 = -170;
  const korak = 78;
  return (
    <g>
      <rect x={-200} y={-390} width={400} height={88} rx={26} fill={P.zelena700} />
      <rect x={-200} y={-340} width={400} height={38} fill={P.zelena700} />
      <text x={-172} y={-326} fontFamily={SANS} fontWeight={900} fontSize={36} fill="#fff" letterSpacing={1}>
        KOLO
      </text>
      <text x={172} y={-326} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={26} fill={P.zelena100}>
        Sistem
      </text>
      <text x={-176} y={-262} fontFamily={SANS} fontWeight={800} fontSize={27} fill={P.mastilo}>
        Poslednji zapisi
      </text>
      {/* zaglavlje tabele */}
      <rect x={-186} y={-236} width={372} height={46} rx={8} fill={P.zelena100} />
      {[
        ["Vreme", -176, "start"],
        ["Davalac", -96, "start"],
        ["Primalac", 14, "start"],
        ["Iznos", 176, "end"],
      ].map(([t, x, a]) => (
        <text key={t as string} x={x as number} y={-205} textAnchor={a as "start" | "end"} fontFamily={SANS} fontWeight={800} fontSize={19} fill={P.zelena900}>
          {t}
        </text>
      ))}
      <clipPath id="ekranSistemClip">
        <rect x={-200} y={-188} width={400} height={570} />
      </clipPath>
      <g clipPath="url(#ekranSistemClip)">
        {REDOVI_SISTEMA.map((r, i) => {
          const p = Math.max(0, Math.min(1, redova - i));
          if (p <= 0) return null;
          const y = y0 + i * korak + (1 - p) * 60;
          const ist = isticanje && isticanje[0] === i ? isticanje[1] : 0;
          return (
            <g key={i} opacity={Math.min(1, p * 1.6)}>
              {(i === REDOVI_SISTEMA.length - 1 && novi > 0) && <rect x={-190} y={y - 40} width={380} height={68} rx={10} fill={P.zelenaSvetla} opacity={0.35 * novi} />}
              {ist > 0 && <rect x={-190} y={y - 40} width={380 * ist} height={68} rx={10} fill={P.zlatna} opacity={0.42} />}
              <text x={-176} y={y} fontFamily={SANS} fontWeight={600} fontSize={20} fill={P.mastiloSvetlo}>
                {r.vreme}
              </text>
              <text x={-96} y={y} fontFamily={SANS} fontWeight={700} fontSize={21} fill={P.mastilo}>
                {r.od}
              </text>
              <text x={14} y={y} fontFamily={SANS} fontWeight={700} fontSize={21} fill={P.mastilo}>
                {r.ka}
              </text>
              <text x={176 - (zeleno > 0 ? 30 * Math.min(1, zeleno * 2) : 0)} y={y} textAnchor="end" fontFamily={SANS} fontWeight={900} fontSize={22} fill={P.zelena700}>
                {r.iznos}
              </text>
              {zeleno > 0 && (
                <g transform={`translate(170 ${y - 8}) scale(${Math.min(1, Math.max(0, zeleno * 6 - i * 0.6))})`}>
                  <circle r={13} fill={P.zelena500} />
                  <path d="M-6,0 L-1,5 L7,-5" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
              <line x1={-186} y1={y + 24} x2={186} y2={y + 24} stroke={P.mastilo} strokeWidth={1.5} opacity={0.15} />
            </g>
          );
        })}
      </g>
    </g>
  );
};

/** Šaka koja drži telefon (vidi se nadlanica), dolazi odozdo; vrh šake u (0,0). */
export const SakaSaTelefonom: React.FC<{ rukav?: string; koza?: string }> = ({ rukav = P.zelenaPrigusena, koza = P.koza }) => (
  <g>
    <Oblik d="M-120,520 C-130,380 -110,300 -90,250 L90,250 C110,300 130,380 120,520Z" boja={rukav} debljina={4.5} tekstura={0.3} />
    <Oblik d="M-110,270 C-140,170 -150,90 -120,40 C-90,0 90,0 120,40 C150,90 140,170 110,270Z" boja={koza} debljina={4} tekstura={0.15} />
  </g>
);

/** Kažiprst (vrh prsta u 0,0), pruža se odozdo. */
export const Prst: React.FC<{ koza?: string; rukav?: string; rot?: number }> = ({ koza = P.koza, rukav = P.roze, rot = 0 }) => (
  <g transform={`rotate(${rot})`}>
    <Oblik d="M-60,420 C-70,300 -64,240 -54,200 L54,200 C64,240 70,300 60,420Z" boja={rukav} debljina={4} tekstura={0.3} />
    <Oblik d="M-56,210 C-70,150 -60,110 -30,96 L-22,10 C-20,-10 20,-10 22,10 L26,96 C60,104 70,150 56,210Z" boja={koza} debljina={4} tekstura={0.12} />
    <path d="M-12,4 C-8,-4 8,-4 12,4" fill="none" stroke={P.mastilo} strokeWidth={2.5} opacity={0.5} />
  </g>
);

/** Zatvorena knjiga PRAVILA, sredina u (0,0). */
export const KnjigaPravila: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-130, -170, 260, 340, 12)} boja={P.zelena900} debljina={4.5} tekstura={0.3} />
    <Oblik d={kutija(-130, -170, 34, 340, 8)} boja={P.zelena700} debljina={3.5} tekstura={0.3} />
    <rect x={-80} y={-110} width={190} height={2} fill={P.zlatna} />
    <rect x={-80} y={-40} width={190} height={2} fill={P.zlatna} />
    <text x={15} y={-62} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.zlatna} letterSpacing={3}>
      PRAVILA
    </text>
    <Oblik d={kutija(122, -160, 14, 326, 4)} boja={P.krem} debljina={2.5} tekstura={0} />
  </g>
);

/** Lupa; sredina stakla u (0,0). */
export const Lupa: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Linija d="M66,66 L170,170" debljina={30} boja={P.drvoTamno} />
    <circle r={92} fill="#E6F2F2" opacity={0.25} />
    <circle r={92} fill="none" stroke={P.mastilo} strokeWidth={14} />
    <circle r={92} fill="none" stroke="#9AA7A5" strokeWidth={8} />
    <path d="M-50,-40 C-36,-62 -10,-70 10,-66" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
  </g>
);
