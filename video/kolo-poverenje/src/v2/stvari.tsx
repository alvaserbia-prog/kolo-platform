// Predmeti naive: telefon u šarenoj futroli, ekran oglasa, zeleni krug potvrde, sekira, panj,
// cepanice, šoljica kafe, zapis u KOLU, upitnik. Ekrani platforme su isti kao u prvom videu.
import React from "react";
import { staticFile } from "remotion";
import { Boja, Cvet, N, elipsa, kutija } from "./naiva";
import { OBLO, SANS } from "../fontovi";

export { EkranKod, EkranPotvrde } from "../v1/stvari";

export const TelefonN: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`} filter="url(#nMekoSenka)">
    <Boja d={kutija(-160, -310, 320, 620, 46)} boja={N.plava} debljina={4} />
    {[
      [-140, -290],
      [140, -290],
      [-140, 290],
      [140, 290],
    ].map(([x, y], i) => (
      <Cvet key={i} x={x} y={y} s={1.1} boja={i % 2 ? N.zuta : N.crvena} />
    ))}
    <rect x={-134} y={-272} width={268} height={544} rx={18} fill="#FFFDF7" stroke={N.kontura} strokeWidth={2} />
    <g>{children}</g>
  </g>
);

const Zaglavlje: React.FC<{ naslov: string }> = ({ naslov }) => (
  <g>
    <rect x={-134} y={-272} width={268} height={62} rx={18} fill={N.zelena} />
    <rect x={-134} y={-240} width={268} height={30} fill={N.zelena} />
    <text x={-112} y={-230} fontFamily={SANS} fontWeight={900} fontSize={27} fill="#fff">
      KOLO
    </text>
    <text x={112} y={-230} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={19} fill="#DDEFE2">
      {naslov}
    </text>
  </g>
);

/** Ekran novog oglasa na Pijaci: naslov se kuca, slika, dugme „Objavi oglas“. */
export const EkranOglas: React.FC<{ naslov: string; slova: number; slika?: React.ReactNode; objavljeno: number; prazno?: boolean; kursor?: boolean }> = ({ naslov, slova, slika, objavljeno, prazno, kursor }) => (
  <g>
    <Zaglavlje naslov="Pijaca" />
    <text x={-112} y={-176} fontFamily={SANS} fontWeight={800} fontSize={22} fill={N.kontura}>
      Novi oglas
    </text>
    <rect x={-112} y={-160} width={224} height={150} rx={10} fill={prazno ? "#F1ECE0" : "#E8F4DA"} stroke="#cfc6b3" strokeWidth={2} strokeDasharray={prazno ? "8 6" : undefined} />
    {prazno ? (
      <text x={0} y={-76} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={18} fill="#9a917f">
        + dodaj sliku
      </text>
    ) : (
      <g transform="translate(0 -84)">{slika}</g>
    )}
    <rect x={-112} y={4} width={224} height={62} rx={8} fill="#fff" stroke="#d5cfc4" strokeWidth={2} />
    <text x={-100} y={44} fontFamily={SANS} fontWeight={800} fontSize={21} fill={prazno && slova <= 0 ? "#9a917f" : N.kontura}>
      {prazno && slova <= 0 ? "Šta nudiš?" : naslov.slice(0, Math.max(0, Math.floor(slova)))}
      {kursor ? <tspan fill={N.zelena}>|</tspan> : null}
    </text>
    <text x={-100} y={104} fontFamily={SANS} fontWeight={700} fontSize={17} fill="#7d7466">
      ● {prazno ? "tvoje mesto" : "Sombor"}
    </text>
    <g transform={`translate(0 196) scale(${1 - 0.08 * Math.sin(Math.min(1, objavljeno * 3) * Math.PI)})`}>
      <rect x={-104} y={-30} width={208} height={60} rx={30} fill={objavljeno > 0.3 ? "#135C32" : N.zelena} />
      <text x={0} y={9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill="#fff">
        {objavljeno > 0.3 ? "✓ Objavljeno" : "Objavi oglas"}
      </text>
    </g>
  </g>
);

/** Zeleni krug potvrde: prsten oko stopala, sjaj i značka sa kvačicom iznad glave. */
export const ZeleniKrug: React.FC<{ x: number; y: number; s?: number; p: number; visina?: number }> = ({ x, y, s = 1, p, visina = 560 }) =>
  p <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-visina / 2} rx={170 * p} ry={visina * 0.6 * p} fill={N.zelenaSvetla} opacity={0.35 * p} filter="url(#nSjaj)" />
      <ellipse cx={0} cy={0} rx={130} ry={30} fill="none" stroke={N.zelena} strokeWidth={10} opacity={p} strokeDasharray={`${p * 520} 999`} />
      <g transform={`translate(80 ${-visina - 20}) scale(${Math.min(1, p * 1.3)})`}>
        <circle r={34} fill={N.zelena} stroke={N.bela} strokeWidth={5} />
        <path d="M-15,0 L-4,11 L16,-11" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );

export const Upitnik: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = N.plava }) => (
  <g transform={`scale(${s})`}>
    <circle r={46} fill={N.bela} stroke={N.kontura} strokeWidth={3} />
    <text y={24} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={68} fill={boja}>
      ?
    </text>
  </g>
);

export const Sekira: React.FC = () => (
  <g>
    <Boja d="M-8,0 L8,0 L10,-170 L-6,-170Z" boja={N.drvo} />
    <Boja d="M4,-176 C40,-190 70,-180 76,-150 C60,-150 40,-146 10,-140Z" boja="#B9C1C7" />
  </g>
);

export const Panj: React.FC = () => (
  <g>
    <Boja d="M-80,0 L-70,-80 L70,-80 L80,0Z" boja={N.drvo} />
    <Boja d={elipsa(0, -80, 70, 20)} boja="#D9A66B" />
    <path d="M-40,-80 a40,11 0 1,0 80,0 a40,11 0 1,0 -80,0" fill="none" stroke={N.drvo} strokeWidth={2} />
  </g>
);

export const Cepanica: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Boja d="M-24,0 L-24,-90 L24,-90 L24,0Z" boja={N.drvo} />
    <Boja d={elipsa(0, -90, 24, 8)} boja="#D9A66B" />
  </g>
);

export const Soljica: React.FC = () => (
  <g>
    <Boja d="M-24,-40 L24,-40 L20,0 L-20,0Z" boja={N.bela} />
    <path d="M24,-30 C40,-30 40,-10 22,-10" fill="none" stroke={N.kontura} strokeWidth={4} />
    <path d="M-10,-50 C-16,-66 0,-72 -6,-88 M8,-50 C2,-66 18,-72 12,-88" fill="none" stroke="#fff" strokeWidth={3} opacity={0.8} />
    <rect x={-20} y={-30} width={40} height={6} fill={N.crvena} />
  </g>
);

export const ZapisN: React.FC<{ od: string; ka: string }> = ({ od, ka }) => (
  <g filter="url(#nMekoSenka)">
    <Boja d={kutija(-260, -110, 520, 220, 26)} boja={N.bela} debljina={4} />
    <rect x={-244} y={-96} width={488} height={192} rx={18} fill="none" stroke={N.zelena} strokeWidth={3} strokeDasharray="10 8" />
    <text x={0} y={-50} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={24} fill={N.zelena} letterSpacing={3}>
      ZAPIS U KOLU
    </text>
    <text x={0} y={10} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={50} fill={N.kontura}>
      {od} → {ka}
    </text>
    <text x={0} y={64} textAnchor="middle" fontFamily={OBLO} fontWeight={600} fontSize={34} fill={N.zelena}>
      POENI, kako su se dogovorili
    </text>
  </g>
);

/** Znak KOLO u venčiću od cveća. */
export const ZnakUVencu: React.FC<{ vel?: number; f?: number }> = ({ vel = 320, f = 0 }) => (
  <g>
    {Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2;
      const r = vel * 0.72;
      return <Cvet key={i} x={Math.cos(a) * r} y={Math.sin(a) * r} s={2.4} boja={[N.crvena, N.zuta, N.bela, N.roze][i % 4]} f={f} />;
    })}
    <defs>
      <clipPath id="znakN">
        <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} rx={vel * 0.2} />
      </clipPath>
    </defs>
    <g clipPath="url(#znakN)" filter="url(#nMekoSenka)">
      <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} fill="#0F3D20" />
      <image href={staticFile("kolo-hero-logo.png")} x={-vel / 2} y={-vel / 2 - vel * 0.025} width={vel} height={vel * 1.05} />
    </g>
    <rect x={-vel / 2} y={-vel / 2} width={vel} height={vel} rx={vel * 0.2} fill="none" stroke={N.zuta} strokeWidth={10} />
  </g>
);
