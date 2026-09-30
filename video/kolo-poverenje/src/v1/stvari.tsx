// Predmeti linoreza (video „Čiji si ti“): klupa, lična karta, telefon sa ekranima KOLA
// (kod i potvrda, kao na pravoj platformi), pečat, medaljon, torba, snop žita, kosa.
import React from "react";
import { random, staticFile } from "remotion";
import { L, Linija, Povrs, Srafura, elipsa, kutija, urez } from "./linorez";
import { SANS, SLAB } from "../fontovi";

export const Klupa: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Povrs d="M-236,-150 L-212,-150 L-214,0 L-240,0Z M212,-150 L236,-150 L240,0 L214,0Z" boja={L.mastilo} />
    <Povrs d={kutija(-270, -182, 540, 38, 4)} boja={L.oker} />
    <path d={urez(-250, -164, 250, -166, 3)} fill={L.mastilo} opacity={0.5} />
    <Povrs d={kutija(-250, -80, 500, 16, 3)} boja={L.mastilo} />
  </g>
);

export const LicnaKarta: React.FC<{ s?: number; siva?: number }> = ({ s = 1, siva = 0 }) => (
  <g transform={`scale(${s})`} opacity={1 - siva * 0.55}>
    <Povrs d={kutija(-150, -95, 300, 190, 14)} boja={L.papirTopli} debljina={6} />
    <Povrs d={kutija(-126, -66, 90, 116, 6)} boja={L.sivaSvetla} debljina={4} />
    <Povrs d={elipsa(-81, -24, 22, 26)} boja={L.siva} debljina={3} trunje={0} />
    <path d="M-116,48 C-110,10 -52,10 -46,48Z" fill={L.siva} />
    {[-50, -20, 10, 40].map((y, i) => (
      <path key={y} d={urez(-20, y, 120 - (i % 2) * 40, y, 4)} fill={L.mastilo} opacity={0.7} />
    ))}
    <text x={0} y={-72} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={20} fill={L.mastilo} letterSpacing={3}>
      LIČNA KARTA
    </text>
  </g>
);

/** Telefon linoreza: crno telo, ekran boje papira. Ekran je 264×540, centar (0,0). */
export const Telefon: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`}>
    <Povrs d={kutija(-156, -306, 312, 612, 42)} boja={L.mastilo} />
    <rect x={-134} y={-272} width={268} height={544} rx={18} fill="#F7F1E3" />
    <rect x={-30} y={-294} width={60} height={9} rx={4} fill={L.mastiloMeko} />
    <g>{children}</g>
  </g>
);

const Zaglavlje: React.FC<{ naslov: string }> = ({ naslov }) => (
  <g>
    <rect x={-134} y={-272} width={268} height={62} rx={18} fill={L.zelena} />
    <rect x={-134} y={-240} width={268} height={30} fill={L.zelena} />
    <text x={-112} y={-230} fontFamily={SANS} fontWeight={900} fontSize={27} fill="#fff" letterSpacing={1}>
      KOLO
    </text>
    <text x={112} y={-230} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={19} fill={L.zelenaBleda}>
      {naslov}
    </text>
  </g>
);

/** QR kod (nasumičan, ali sa tri oznake za poravnanje kao pravi). */
export const QR: React.FC<{ vel?: number; seed?: string }> = ({ vel = 190, seed = "qr" }) => {
  const n = 21;
  const k = vel / n;
  const kv: React.ReactNode[] = [];
  const oznaka = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (oznaka(r, c)) continue;
      if (random(`${seed}${r}-${c}`) > 0.52) kv.push(<rect key={`${r}-${c}`} x={c * k} y={r * k} width={k + 0.5} height={k + 0.5} fill={L.mastilo} />);
    }
  const Oz: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <g transform={`translate(${x * k} ${y * k})`}>
      <rect width={7 * k} height={7 * k} fill={L.mastilo} />
      <rect x={k} y={k} width={5 * k} height={5 * k} fill="#fff" />
      <rect x={2 * k} y={2 * k} width={3 * k} height={3 * k} fill={L.mastilo} />
    </g>
  );
  return (
    <g transform={`translate(${-vel / 2} ${-vel / 2})`}>
      <rect x={-10} y={-10} width={vel + 20} height={vel + 20} fill="#fff" />
      {kv}
      <Oz x={0} y={0} />
      <Oz x={n - 7} y={0} />
      <Oz x={0} y={n - 7} />
    </g>
  );
};

/** Ekran „Pokaži kod“ (onaj koga potvrđuju). */
export const EkranKod: React.FC<{ pseudonim: string }> = ({ pseudonim }) => (
  <g>
    <Zaglavlje naslov="Potvrde" />
    <text x={0} y={-168} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} fill={L.mastilo}>
      Pokaži svoj kod
    </text>
    <g transform="translate(0 -20)">
      <QR vel={188} seed={pseudonim} />
    </g>
    <text x={0} y={122} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} fill={L.mastilo} letterSpacing={4}>
      384 729
    </text>
    <text x={0} y={170} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={19} fill={L.mastiloMeko}>
      {pseudonim}
    </text>
    <text x={0} y={206} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={16} fill={L.siva}>
      Daj nekome ko te poznaje
    </text>
    <text x={0} y={228} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={16} fill={L.siva}>
      da skenira kod
    </text>
  </g>
);

/** Ekran potvrde (onaj ko potvrđuje): kvačica i dugme, kao na platformi. */
export const EkranPotvrde: React.FC<{ pseudonim: string; kvacica: number; pritisak: number; gotovo: number }> = ({ pseudonim, kvacica, pritisak, gotovo }) => (
  <g>
    <Zaglavlje naslov="Potvrde" />
    <text x={-112} y={-172} fontFamily={SANS} fontWeight={800} fontSize={21} fill={L.mastilo}>
      Potvrdi nekoga
    </text>
    <text x={-112} y={-146} fontFamily={SANS} fontWeight={800} fontSize={21} fill={L.mastilo}>
      koga poznaješ
    </text>
    <rect x={-112} y={-122} width={224} height={96} rx={12} fill="#fff" stroke={L.sivaSvetla} strokeWidth={3} />
    <circle cx={-68} cy={-74} r={28} fill={L.oker} stroke={L.mastilo} strokeWidth={3} />
    <text x={-68} y={-64} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={26} fill={L.mastilo}>
      {pseudonim[0].toUpperCase()}
    </text>
    <text x={-30} y={-80} fontFamily={SANS} fontWeight={800} fontSize={17} fill={L.mastilo}>
      {pseudonim}
    </text>
    <text x={-30} y={-54} fontFamily={SANS} fontWeight={700} fontSize={14} fill={L.siva}>
      kod skeniran ✓
    </text>
    {/* kvačica */}
    <rect x={-112} y={-6} width={30} height={30} rx={6} fill={kvacica > 0.5 ? L.zelena : "#fff"} stroke={L.mastilo} strokeWidth={3} />
    {kvacica > 0.5 && <path d="M-105,9 L-98,17 L-88,1" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
    <foreignObject x={-74} y={-10} width={188} height={110}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, lineHeight: 1.25, color: L.mastilo }}>Potvrđujem da ovu osobu poznajem lično</div>
    </foreignObject>
    <g transform={`translate(0 ${150}) scale(${1 - 0.07 * Math.sin(Math.min(1, pritisak) * Math.PI)})`}>
      <rect x={-112} y={-32} width={224} height={64} rx={32} fill={gotovo > 0.5 ? L.zelenaTamna : L.zelena} />
      <text x={0} y={9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill="#fff">
        {gotovo > 0.5 ? "✓ Potvrda upisana" : "Potvrdi ovu osobu"}
      </text>
    </g>
  </g>
);

/** Pečat: okrugao, sa slovima u krugu (mastilo ili zelena KOLA). */
export const Pecat: React.FC<{ tekst: string; gore?: string; boja?: string; s?: number }> = ({ tekst, gore = "KOLO", boja = L.zelena, s = 1 }) => (
  <g transform={`scale(${s})`} opacity={0.92}>
    <circle r={120} fill="none" stroke={boja} strokeWidth={12} />
    <circle r={98} fill="none" stroke={boja} strokeWidth={4} />
    <path d="M-40,-4 L-10,26 L46,-34" fill="none" stroke={boja} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <path id="pecatLuk" d="M-80,0 A80,80 0 0,1 80,0" />
    </defs>
    <text fontFamily={SLAB} fontSize={30} fill={boja} letterSpacing={4}>
      <textPath href="#pecatLuk" startOffset="50%" textAnchor="middle">
        {gore}
      </textPath>
    </text>
    <text y={84} textAnchor="middle" fontFamily={SLAB} fontSize={24} fill={boja} letterSpacing={2}>
      {tekst}
    </text>
    <rect x={-140} y={-140} width={280} height={280} fill="url(#trunje)" opacity={0.6} />
  </g>
);

/** Okrugao medaljon (urezan okvir), unutra proizvoljan crtež u prostoru r×r. */
export const Medaljon: React.FC<{ r: number; children: React.ReactNode; id: string; pozadina?: string }> = ({ r, children, id, pozadina = L.papir }) => (
  <g>
    <defs>
      <clipPath id={`med${id}`}>
        <circle r={r} />
      </clipPath>
    </defs>
    <circle r={r + 16} fill={L.mastilo} />
    <circle r={r} fill={pozadina} />
    <g clipPath={`url(#med${id})`}>{children}</g>
    {Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return <path key={i} d={urez(Math.cos(a) * (r + 4), Math.sin(a) * (r + 4), Math.cos(a + 0.18) * (r + 4), Math.sin(a + 0.18) * (r + 4), 3)} fill={L.papir} opacity={0.8} />;
    })}
  </g>
);

export const Torba: React.FC = () => (
  <g>
    <Linija d="M0,0 L40,-40" debljina={8} />
    <Povrs d="M20,-40 C0,-40 -10,40 10,70 C30,90 90,90 100,60 C110,20 90,-40 60,-40Z" boja={L.crvena} />
    <path d={`${urez(30, 0, 80, 0, 4)} ${urez(26, 30, 90, 30, 4)}`} fill={L.papir} opacity={0.8} />
  </g>
);

export const Snop: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Povrs d="M-40,0 L-20,-120 L20,-120 L40,0Z" boja={L.oker} />
    {Array.from({ length: 7 }, (_, i) => (
      <path key={i} d={urez(-30 + i * 10, -120, -44 + i * 14, -190 - (i % 2) * 14, 5)} fill={L.oker} stroke={L.mastilo} strokeWidth={3} />
    ))}
    <rect x={-30} y={-78} width={60} height={14} fill={L.crvena} />
    <path d={`${urez(-26, -30, -10, -110, 3)} ${urez(10, -110, 24, -30, 3)}`} fill={L.mastilo} opacity={0.6} />
  </g>
);

export const Kosa: React.FC = () => (
  <g>
    <Linija d="M0,0 L0,-260" debljina={10} />
    <Linija d="M0,-160 L-26,-170" debljina={8} />
    <path d="M0,-260 C60,-280 130,-260 170,-220 C120,-240 60,-246 0,-240Z" fill={L.sivaSvetla} stroke={L.mastilo} strokeWidth={4} />
  </g>
);

/** Znak KOLO (logo sa platforme) u urezanom okviru. */
export const ZnakKolo: React.FC<{ vel?: number }> = ({ vel = 300 }) => (
  <g>
    <defs>
      <clipPath id="znakKoloClip">
        <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} rx={vel * 0.18} />
      </clipPath>
    </defs>
    <rect x={-vel / 2 + 14} y={-vel / 2 + 14} width={vel} height={vel} rx={vel * 0.18} fill={L.mastilo} />
    <g clipPath="url(#znakKoloClip)">
      <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} fill="#0F3D20" />
      <image href={staticFile("kolo-hero-logo.png")} x={-vel / 2} y={-vel / 2 - vel * 0.025} width={vel} height={vel * 1.05} />
    </g>
    <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} rx={vel * 0.18} fill="none" stroke={L.mastilo} strokeWidth={8} />
  </g>
);

/** Precrtano: dva crvena ureza preko predmeta. */
export const Precrtano: React.FC<{ w: number; h: number; napredak: number }> = ({ w, h, napredak: p }) => (
  <g>
    {p > 0 && <path d={urez(-w / 2, -h / 2, -w / 2 + w * Math.min(1, p * 2), -h / 2 + h * Math.min(1, p * 2), 14)} fill={L.crvena} />}
    {p > 0.5 && <path d={urez(w / 2, -h / 2, w / 2 - w * Math.min(1, (p - 0.5) * 2), -h / 2 + h * Math.min(1, (p - 0.5) * 2), 14)} fill={L.crvena} />}
  </g>
);

export { Srafura };
