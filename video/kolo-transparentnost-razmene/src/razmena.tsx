// Novi predmeti videa 20 „Kako da sprečimo krađu?“: ekrani KOLA (spisak članova sa stanjem, spisak razmena,
// račun drugog člana), lična sveska stanara (zatvorena ili otvorena), kartica računa, prozor sa zavesama,
// fotelja (položaj) i ruka u tamnom rukavu. POEN je samo broj u redu, nikad novčić.
// Pseudonimi su likovi ranijih videa (Milica, Zoran, Jovana, Đura) i uloga „Direktor“ iz videa 19, ne stvarni članovi.
import React from "react";
import { P } from "./paleta";
import { RUKOPIS, SANS } from "./fontovi";
import { Oblik, elipsa, kutija } from "./alat";

const hiljade = (n: number) => Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ── Ekran KOLA (unutar VelikiTelefon: ekran -200..200 × -390..390) ─────────
export type RedEkrana = { levo: string; sredina?: string; iznos: number; znak?: boolean; protokol?: boolean };

/**
 * Opšti ekran: zelena traka KOLO, naslov (sa slovom u krugu), opciono stanje, pa redovi.
 * `redova` koliko je redova upisano (decimalno: poslednji klizi), `isticanje` [red, 0–1],
 * `zeleno` 0–1 zelene kvačice redom, `potvrden` 0–1 značka „potvrđen“ u traci.
 */
export const Ekran: React.FC<{
  naslov: string;
  podnaslov: string;
  stanje?: number;
  redovi: RedEkrana[];
  redova?: number;
  isticanje?: [number, number];
  zeleno?: number;
  potvrden?: number;
  bezZnaka?: boolean;
  id: string;
}> = ({ naslov, podnaslov, stanje, redovi, redova = 99, isticanje, zeleno = 0, potvrden = 0, bezZnaka, id }) => {
  const y0 = stanje === undefined ? -200 : -150;
  const korak = 74;
  return (
    <g>
      <rect x={-200} y={-390} width={400} height={88} rx={26} fill={P.zelena700} />
      <rect x={-200} y={-340} width={400} height={38} fill={P.zelena700} />
      <text x={-172} y={-326} fontFamily={SANS} fontWeight={900} fontSize={36} fill="#fff" letterSpacing={1}>
        KOLO
      </text>
      {potvrden > 0 && (
        <g transform={`translate(110 -338) scale(${potvrden})`}>
          <rect x={-74} y={-20} width={148} height={38} rx={19} fill={P.zelena100} />
          <circle cx={-50} cy={-1} r={12} fill={P.zelena500} />
          <path d="M-56,-1 L-51,4 L-44,-6" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <text x={-30} y={7} fontFamily={SANS} fontWeight={800} fontSize={20} fill={P.zelena900}>
            potvrđen
          </text>
        </g>
      )}
      {!bezZnaka && (
        <g>
          <circle cx={-148} cy={-252} r={30} fill={P.zelena100} stroke={P.zelena700} strokeWidth={3} />
          <text x={-148} y={-242} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={28} fill={P.zelena700}>
            {naslov[0]}
          </text>
        </g>
      )}
      <text x={bezZnaka ? -176 : -104} y={-258} fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.mastilo}>
        {naslov}
      </text>
      <text x={bezZnaka ? -176 : -104} y={-228} fontFamily={SANS} fontWeight={600} fontSize={19} fill={P.mastiloSvetlo}>
        {podnaslov}
      </text>
      {stanje !== undefined && (
        <g>
          <rect x={-186} y={-208} width={372} height={50} rx={10} fill={P.zelena100} />
          <text x={-172} y={-175} fontFamily={SANS} fontWeight={700} fontSize={21} fill={P.zelena900}>
            Stanje
          </text>
          <text x={172} y={-173} textAnchor="end" fontFamily={SANS} fontWeight={900} fontSize={28} fill={P.zelena700}>
            {hiljade(stanje)} POEN
          </text>
        </g>
      )}
      <clipPath id={`ekranClip-${id}`}>
        <rect x={-200} y={y0 - 4} width={400} height={390 - y0 + 4} />
      </clipPath>
      <g clipPath={`url(#ekranClip-${id})`}>
        {redovi.map((r, i) => {
          const p = Math.max(0, Math.min(1, redova - i));
          if (p <= 0) return null;
          const y = y0 + i * korak + 34 + (1 - p) * 60;
          const ist = isticanje && isticanje[0] === i ? isticanje[1] : 0;
          const kv = Math.min(1, Math.max(0, zeleno * redovi.length * 1.2 - i));
          return (
            <g key={i} opacity={Math.min(1, p * 1.6)}>
              {ist > 0 && <rect x={-190} y={y - 40} width={380 * ist} height={66} rx={10} fill={P.zlatna} opacity={0.42} />}
              {r.protokol ? (
                <g>
                  <rect x={-180} y={y - 26} width={112} height={34} rx={17} fill={P.zelena700} />
                  <text x={-124} y={y - 2} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} fill="#fff">
                    Protokol
                  </text>
                </g>
              ) : (
                <text x={-178} y={y - 2} fontFamily={SANS} fontWeight={800} fontSize={r.levo.length > 14 ? 18 : 21} fill={P.mastilo}>
                  {r.levo}
                </text>
              )}
              {r.sredina && (
                <text x={-178} y={y + 20} fontFamily={SANS} fontWeight={600} fontSize={15} fill={P.mastiloSvetlo}>
                  {r.sredina}
                </text>
              )}
              <text
                x={176 - (kv > 0 ? 34 * kv : 0)}
                y={y - 2}
                textAnchor="end"
                fontFamily={SANS}
                fontWeight={900}
                fontSize={22}
                fill={r.znak === false ? P.mastilo : r.iznos >= 0 ? P.zelena700 : P.ajvarTamni}
              >
                {r.znak === false ? "" : r.iznos >= 0 ? "+" : "−"}
                {hiljade(r.iznos)}
              </text>
              {kv > 0 && (
                <g transform={`translate(170 ${y - 10}) scale(${kv})`}>
                  <circle r={13} fill={P.zelena500} />
                  <path d="M-6,0 L-1,5 L7,-5" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
              <line x1={-186} y1={y + 30} x2={186} y2={y + 30} stroke={P.mastilo} strokeWidth={1.5} opacity={0.15} />
            </g>
          );
        })}
      </g>
    </g>
  );
};

/** Spisak članova sa stanjem (vide ga potvrđeni članovi). */
export const CLANOVI: RedEkrana[] = [
  { levo: "Milica", sredina: "potvrđen član", iznos: 2400, znak: false },
  { levo: "Zoran", sredina: "potvrđen član", iznos: 1800, znak: false },
  { levo: "Direktor", sredina: "potvrđen član", iznos: 3100, znak: false },
  { levo: "Jovana", sredina: "potvrđen član", iznos: 1200, znak: false },
  { levo: "Đura", sredina: "potvrđen član", iznos: 2050, znak: false },
  { levo: "Baka Rada", sredina: "potvrđen član", iznos: 900, znak: false },
];

/** Obavljene razmene: ko je kome prepisao POEN i za šta (osnov iz razmene). */
export const RAZMENE: RedEkrana[] = [
  { levo: "Zoran → Milica", sredina: "tegla zimnice", iznos: 300, znak: false },
  { levo: "Milica → Zoran", sredina: "popravka utičnice", iznos: 500, znak: false },
  { levo: "Jovana → Đura", sredina: "kosidba", iznos: 400, znak: false },
  { levo: "Direktor → Jovana", sredina: "čuvanje dece", iznos: 600, znak: false },
  { levo: "Đura → Baka Rada", sredina: "pletene čarape", iznos: 250, znak: false },
  { levo: "Baka Rada → Milica", sredina: "pekmez od šljiva", iznos: 200, znak: false },
];

/** Račun drugog člana (Milica): šta je dala zajednici, po razmenama. */
export const RACUN_MILICE: RedEkrana[] = [
  { levo: "Zoran", sredina: "tegla zimnice", iznos: 300 },
  { levo: "Baka Rada", sredina: "pekmez od šljiva", iznos: 200 },
  { levo: "Jovana", sredina: "ajvar", iznos: 350 },
  { levo: "Đura", sredina: "kiseli krastavci", iznos: 250 },
  { levo: "Zoran", sredina: "popravka utičnice", iznos: -500 },
];

// ── Lična sveska stanara ────────────────────────────────────────────────
/**
 * Mala sveska stanara: zatvorena (korice sa natpisom) ili otvorena (dve strane sa redovima). `otvor` 0–1
 * okreće korice; sredina u (0,0), širina zatvorene 240.
 */
export const LicnaSveska: React.FC<{ natpis: string; otvor?: number; boja?: string; isticanje?: number; redovi?: [string, string][] }> = ({
  natpis,
  otvor = 0,
  boja = "#7A5A3A",
  isticanje = 0,
  redovi = [
    ["uplata", "2.000"],
    ["prepis", "300"],
    ["razmena", "250"],
  ],
}) => {
  const o = Math.max(0, Math.min(1, otvor));
  return (
    <g>
      <ellipse cx={8} cy={92} rx={140} ry={14} fill={P.senka} opacity={0.2} />
      {o > 0.5 ? (
        <g transform={`scale(${(o - 0.5) * 2} 1)`}>
          <Oblik d={kutija(-250, -86, 500, 178, 10)} boja={boja} debljina={4} tekstura={0.3} />
          <Oblik d={kutija(-238, -78, 236, 160, 6)} boja={P.belo} debljina={3} tekstura={0.1} />
          <Oblik d={kutija(2, -78, 236, 160, 6)} boja={P.belo} debljina={3} tekstura={0.1} />
          <line x1={0} y1={-78} x2={0} y2={82} stroke={P.mastilo} strokeWidth={3} opacity={0.5} />
          <text x={-120} y={-40} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={36} fill={P.mastilo}>
            {natpis}
          </text>
          {isticanje > 0 && <rect x={6} y={-64 + 0} width={228 * isticanje} height={150} rx={8} fill={P.zlatna} opacity={0.3} />}
          {redovi.map(([a, b], i) => (
            <g key={i}>
              <text x={16} y={-34 + i * 46} fontFamily={RUKOPIS} fontWeight={700} fontSize={30} fill={P.mastilo}>
                {a}
              </text>
              <text x={226} y={-34 + i * 46} textAnchor="end" fontFamily={RUKOPIS} fontWeight={700} fontSize={30} fill={P.zelena700}>
                {b}
              </text>
            </g>
          ))}
          <path d="M-220,0 L-24,0 M-220,36 L-24,36" stroke={P.plava} strokeWidth={2} opacity={0.3} />
        </g>
      ) : (
        <g transform={`scale(${1 - o * 2} 1)`}>
          <Oblik d={kutija(-120, -86, 240, 178, 10)} boja={boja} debljina={4} tekstura={0.3} />
          <Oblik d={kutija(-76, -40, 152, 60, 6)} boja={P.belo} debljina={3} tekstura={0.1} />
          <text x={0} y={2} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={36} fill={P.mastilo}>
            {natpis}
          </text>
        </g>
      )}
    </g>
  );
};

// ── Kartica računa (za scenu „pravila važe jednako za sve“) ─────────────
export const KarticaRacuna: React.FC<{ ime: string; kv?: number }> = ({ ime, kv = 0 }) => (
  <g>
    <Oblik d={kutija(-110, -150, 220, 300, 18)} boja={P.belo} debljina={4} tekstura={0.1} />
    <rect x={-104} y={-144} width={208} height={46} rx={14} fill={P.zelena700} />
    <text x={0} y={-112} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={24} fill="#fff">
      KOLO
    </text>
    <circle cx={0} cy={-52} r={30} fill={P.zelena100} stroke={P.zelena700} strokeWidth={3} />
    <text x={0} y={-42} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={28} fill={P.zelena700}>
      {ime[0]}
    </text>
    <text x={0} y={8} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={ime.length > 7 ? 24 : 28} fill={P.mastilo}>
      {ime}
    </text>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={-84} y={32 + i * 34} width={110} height={12} rx={6} fill={P.mastilo} opacity={0.18} />
        <rect x={44} y={32 + i * 34} width={40} height={12} rx={6} fill={P.zelena500} opacity={0.6} />
      </g>
    ))}
    {kv > 0 && (
      <g transform={`translate(84 -126) scale(${kv})`}>
        <circle r={26} fill={P.zelena500} stroke="#fff" strokeWidth={4} />
        <path d="M-11,0 L-3,8 L12,-9" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </g>
);

// ── Fotelja (položaj) ────────────────────────────────────────────────────
/** Visoka fotelja sa naslonom, dno sedišta na (0,0). */
export const Fotelja: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-170,-40 C-180,-300 -150,-560 -110,-600 C-60,-640 60,-640 110,-600 C150,-560 180,-300 170,-40Z" boja="#6E2A30" debljina={5} tekstura={0.35} />
    <Oblik d="M-130,-80 C-136,-300 -112,-520 -80,-556 C-40,-586 40,-586 80,-556 C112,-520 136,-300 130,-80Z" boja="#84343A" debljina={3} tekstura={0.3} />
    {[-60, 0, 60].map((x) => [-460, -340, -220].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={7} fill={P.zlatna} stroke={P.mastilo} strokeWidth={2} />))}
    <Oblik d={kutija(-200, -90, 400, 100, 30)} boja="#6E2A30" debljina={5} tekstura={0.35} />
    <Oblik d={kutija(-230, -200, 70, 210, 26)} boja="#5C2228" debljina={4} tekstura={0.3} />
    <Oblik d={kutija(160, -200, 70, 210, 26)} boja="#5C2228" debljina={4} tekstura={0.3} />
  </g>
);

/** Ruka u tamnom rukavu sa zlatnim dugmetom manžetne; vrh prstiju u (0,0), pruža se sdesna. */
export const TamnaRuka: React.FC<{ hvata?: number }> = ({ hvata = 0 }) => (
  <g>
    <Oblik d="M60,-50 L600,-90 L620,70 L70,50Z" boja="#26303B" debljina={4.5} tekstura={0.3} />
    <Oblik d={kutija(40, -56, 50, 110, 8)} boja="#F2EEE4" debljina={3.5} tekstura={0} />
    <circle cx={65} cy={0} r={8} fill={P.zlatna} stroke={P.mastilo} strokeWidth={2} />
    <Oblik d={`M45,-40 C10,-50 -30,-40 -50,${-20 + hvata * 10} C-60,${-4 + hvata * 14} -40,${10 + hvata * 6} -10,10 C10,30 30,40 45,40Z`} boja={P.koza} debljina={4} tekstura={0.12} />
  </g>
);

// ── Prozor sa zavesama ───────────────────────────────────────────────────
/**
 * Prozor kuće sa zavesama; sredina u (0,0), staklo 520×600. `otvor` 0–1 koliko su zavese razmaknute
 * (najviše do pola: deo privatnosti), `unutra` crtež sobe iza stakla.
 */
export const Prozor: React.FC<{ otvor?: number; unutra?: React.ReactNode }> = ({ otvor = 0, unutra }) => {
  const w = 520;
  const h = 600;
  const sir = (w / 2) * (1 - otvor * 0.55);
  return (
    <g>
      <Oblik d={kutija(-w / 2 - 40, -h / 2 - 40, w + 80, h + 80, 8)} boja={P.drvoSvetlo} debljina={5} tekstura={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#E9D9B4" />
      <clipPath id="prozorClip">
        <rect x={-w / 2} y={-h / 2} width={w} height={h} />
      </clipPath>
      <g clipPath="url(#prozorClip)">{unutra}</g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#CFE3E6" opacity={0.18} />
      {/* zavese: leva i desna, nabori */}
      {[-1, 1].map((st) => (
        <g key={st}>
          <Oblik
            d={st < 0 ? `M${-w / 2},${-h / 2} L${-w / 2 + sir},${-h / 2} C${-w / 2 + sir - 20},0 ${-w / 2 + sir + 10},${h / 4} ${-w / 2 + sir},${h / 2} L${-w / 2},${h / 2}Z` : `M${w / 2},${-h / 2} L${w / 2 - sir},${-h / 2} C${w / 2 - sir + 20},0 ${w / 2 - sir - 10},${h / 4} ${w / 2 - sir},${h / 2} L${w / 2},${h / 2}Z`}
            boja={P.krem}
            debljina={3.5}
            tekstura={0.2}
          />
          {[0.25, 0.5, 0.75].map((k) => (
            <path key={k} d={`M${st * (w / 2 - sir * k)},${-h / 2 + 10} L${st * (w / 2 - sir * k)},${h / 2 - 10}`} stroke={P.vez} strokeWidth={3} opacity={0.35} />
          ))}
        </g>
      ))}
      <Oblik d={kutija(-w / 2 - 30, -h / 2 - 70, w + 60, 34, 6)} boja={P.drvoTamno} debljina={4} tekstura={0.3} />
      <Oblik d={kutija(-w / 2 - 60, h / 2 + 30, w + 120, 36, 6)} boja={P.drvoTamno} debljina={4} tekstura={0.3} />
    </g>
  );
};

/** Mali saksija-cvet na simsu, za toplinu prozora. */
export const Muskatla: React.FC = () => (
  <g>
    <Oblik d="M-40,0 L40,0 L30,60 L-30,60Z" boja={P.crep} debljina={3.5} tekstura={0.2} />
    {[-30, 0, 28].map((x, i) => (
      <g key={i}>
        <Oblik d={elipsa(x, -26 - (i % 2) * 14, 22)} boja={P.paprika} debljina={3} tekstura={0.1} />
        <circle cx={x} cy={-26 - (i % 2) * 14} r={6} fill={P.zlatna} />
      </g>
    ))}
  </g>
);
