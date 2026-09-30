// Elementi videa „Registracija i prvi oglas": papirni telefon sa ekranom sajta, polja obrasca,
// prst koji kucka, štoperica, lična karta koja ne treba, lupa Fondacije, kartica oglasa, „ti".
// Sve je papirni isečak kao u videima 2 i 3; crta se oko (0,0).
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, Pt, drhtaviPut, krugTacke, pravougaonik, useBoil } from "./papir";
import { Osoba } from "./likovi";
import type { OsobaCfg } from "./kolo";
import { RUKOPIS, SANS } from "./fontovi";
import { Tegla } from "./prica";

// ── „ti": isti lik kao u videu 2 (zelen, smeđa kosa) ─────────────────────
export const TI: OsobaCfg = { boja: P.trava, glava: { frizura: "kratka", kosa: P.kosaSmedja } };

/** Isprekidana silueta „ti"; popuna 0–1 je pretapa u pravog lika. */
export const TiLik: React.FC<{ seed: string; popuna: number; osmeh?: number }> = ({ seed, popuna, osmeh = 1 }) => {
  const glava = krugTacke(0, -34, 46, 16);
  return (
    <g>
      {popuna < 1 && (
        <g opacity={1 - popuna}>
          <Crta pts={[...glava, glava[0]]} seed={`${seed}-sg`} boja={P.zelena700} debljina={5} isprekidana />
          <Crta pts={[[-54, 120], [-60, 96], [-38, 0], [38, 0], [60, 96], [54, 120]]} seed={`${seed}-st`} boja={P.zelena700} debljina={5} isprekidana />
        </g>
      )}
      {popuna > 0 && (
        <g opacity={Math.min(1, popuna * 2)} transform={`scale(${(0.85 + 0.15 * popuna).toFixed(3)})`}>
          <Osoba seed={`${seed}-o`} boja={TI.boja} glava={{ ...TI.glava, osmeh }} />
        </g>
      )}
    </g>
  );
};

// ── Kucanje: deo teksta koji je „otkucan" do frejma f ─────────────────────
export const otkucano = (tekst: string, f: number, od: number, znakovaUFrejmu = 0.7) =>
  f < od ? "" : tekst.slice(0, Math.min(tekst.length, Math.floor((f - od) * znakovaUFrejmu) + 1));

/** Treptući kursor (vidi se pola vremena). */
export const Kursor: React.FC<{ x: number; y: number; h?: number; boja?: string }> = ({ x, y, h = 44, boja = P.zelena700 }) => {
  const f = useCurrentFrame();
  if (Math.floor(f / 8) % 2) return null;
  return <rect x={x} y={y - h * 0.8} width={5} height={h} fill={boja} />;
};

// ── Telefon ──────────────────────────────────────────────────────────────
export const TEL_W = 600;
export const TEL_H = 1060;
export const EKRAN = { x: -TEL_W / 2 + 26, y: -TEL_H / 2 + 70, w: TEL_W - 52, h: TEL_H - 130 };

/** Papirni telefon; `adresa` je tekst u adresnoj traci, deca se crtaju na ekranu (odsečena). */
export const Telefon: React.FC<{ seed: string; adresa?: string; kursor?: boolean; children?: React.ReactNode }> = ({ seed, adresa, kursor, children }) => {
  const id = `ekran-${seed}`;
  const { x, y, w, h } = EKRAN;
  return (
    <g>
      <Isecak pts={pravougaonik(-TEL_W / 2, -TEL_H / 2, TEL_W, TEL_H)} boja="#2E2B27" seed={`${seed}-t`} amp={2.6} korak={28} />
      {/* zvučnik i kamera */}
      <Isecak pts={pravougaonik(-60, -TEL_H / 2 + 26, 120, 16)} boja="#5b5750" seed={`${seed}-zv`} senka="bez" amp={0.8} korak={12} />
      <circle cx={90} cy={-TEL_H / 2 + 34} r={9} fill="#5b5750" />
      <Isecak pts={pravougaonik(x, y, w, h)} boja={P.pozadina} seed={`${seed}-e`} senka="bez" amp={1.4} />
      <clipPath id={id}>
        <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={6} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {children}
        {adresa !== undefined && (
          <g>
            <rect x={x} y={y} width={w} height={96} fill={P.zelena900} />
            <Isecak pts={pravougaonik(x + 22, y + 18, w - 44, 60)} boja={P.belo} seed={`${seed}-adr`} senka="bez" amp={1} korak={16} />
            {/* katanac */}
            <rect x={x + 44} y={y + 44} width={20} height={16} rx={3} fill={P.zelena700} />
            <path d={`M${x + 48},${y + 44} v-6 a6,6 0 0 1 12,0 v6`} fill="none" stroke={P.zelena700} strokeWidth={3.5} />
            <text x={x + 80} y={y + 60} fontFamily={SANS} fontWeight={700} fontSize={34} fill={P.tekst}>
              {adresa}
            </text>
            {kursor && <Kursor x={x + 84 + adresa.length * 18.6} y={y + 60} h={36} />}
          </g>
        )}
      </g>
      {/* dugme ispod ekrana */}
      <Isecak pts={pravougaonik(-70, TEL_H / 2 - 44, 140, 16)} boja="#5b5750" seed={`${seed}-du`} senka="bez" amp={0.8} korak={12} />
    </g>
  );
};

// ── Delovi ekrana ────────────────────────────────────────────────────────
/** Polje obrasca: oznaka iznad, beli okvir, tekst (SANS, kao na sajtu). */
export const Polje: React.FC<{
  seed: string;
  x: number;
  y: number;
  w: number;
  oznaka: string;
  tekst: string;
  aktivno?: boolean;
  placeholder?: string;
  visina?: number;
  children?: React.ReactNode;
}> = ({ seed, x, y, w, oznaka, tekst, aktivno, placeholder, visina = 82, children }) => (
  <g>
    <text x={x + 4} y={y - 14} fontFamily={SANS} fontWeight={700} fontSize={30} fill={P.siva}>
      {oznaka}
    </text>
    <Isecak
      pts={pravougaonik(x, y, w, visina)}
      boja={P.belo}
      seed={`${seed}-p`}
      senka="mala"
      amp={1.2}
      korak={18}
      ivica={aktivno ? P.zelena500 : P.ivica}
      ivicaDebljina={aktivno ? 5 : 3}
    />
    {tekst ? (
      <text x={x + 22} y={y + visina / 2 + 14} fontFamily={SANS} fontWeight={700} fontSize={40} fill={P.tekst} xmlSpace="preserve">
        {tekst}
      </text>
    ) : (
      placeholder && (
        <text x={x + 22} y={y + visina / 2 + 14} fontFamily={SANS} fontWeight={400} fontSize={38} fill="#B3AFA6">
          {placeholder}
        </text>
      )
    )}
    {aktivno && <Kursor x={x + 26 + tekst.length * 21.5} y={y + visina / 2 + 16} h={42} />}
    {children}
  </g>
);

/** Zeleno dugme sajta; pritisak 0–1 ga utisne. */
export const Dugme: React.FC<{ seed: string; tekst: string; w: number; h?: number; pritisak?: number; boja?: string; velicina?: number }> = ({
  seed,
  tekst,
  w,
  h = 100,
  pritisak = 0,
  boja = P.zelena700,
  velicina = 44,
}) => (
  <g transform={`scale(${(1 - 0.07 * pritisak).toFixed(3)})`}>
    <Isecak pts={pravougaonik(-w / 2, -h / 2, w, h)} boja={boja} seed={`${seed}-d`} amp={1.8} korak={24} senka={pritisak > 0.5 ? "mala" : "velika"} />
    <text x={0} y={velicina * 0.36} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={velicina} fill={P.belo}>
      {tekst}
    </text>
  </g>
);

/** Talas dodira (t 0–1) oko tačke dodira. */
export const Talas: React.FC<{ x: number; y: number; t: number; boja?: string }> = ({ x, y, t, boja = P.zlatna400 }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <g opacity={1 - t}>
      <circle cx={x} cy={y} r={30 + t * 110} fill="none" stroke={boja} strokeWidth={10 * (1 - t) + 2} />
      <circle cx={x} cy={y} r={14 + t * 60} fill="none" stroke={boja} strokeWidth={6 * (1 - t) + 1} />
    </g>
  );
};

/** Kvačica (✓) koja se iscrtava. */
export const Kvacica: React.FC<{ seed: string; t: number; boja?: string; velicina?: number; debljina?: number }> = ({ seed, t, boja = P.zelena500, velicina = 1, debljina = 12 }) => (
  <g transform={`scale(${velicina})`}>
    <Crta pts={[[-26, 2], [-8, 22], [28, -22]]} seed={`${seed}-kv`} boja={boja} debljina={debljina} napredak={t} korak={12} amp={0.8} />
  </g>
);

// ── Ruka sa ispruženim kažiprstom (vrh prsta u 0,0), rukav je boje lika „ti" ──
export const Ruka: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={[[-60, 300], [-70, 150], [-60, 95], [60, 95], [75, 150], [70, 300]]} boja={P.trava} seed={`${seed}-r`} />
    <Isecak
      pts={[[-18, 0], [18, 0], [22, 70], [60, 60], [80, 80], [82, 120], [70, 160], [-60, 160], [-70, 110], [-60, 80], [-24, 78]]}
      boja={P.koza}
      seed={`${seed}-s`}
      korak={14}
    />
    <Crta pts={[[22, 95], [60, 92]]} seed={`${seed}-p1`} boja={P.koza2} debljina={4} />
    <Crta pts={[[25, 122], [66, 120]]} seed={`${seed}-p2`} boja={P.koza2} debljina={4} />
  </g>
);

/**
 * Prst koji kucka: niz dodira [frejm, x, y]. Između dodira klizi, pred dodir se spusti,
 * posle se odigne. Ulazi odozdo desno i tamo se vraća posle poslednjeg dodira.
 */
export const Prst: React.FC<{ seed: string; dodiri: [number, number, number][]; izlaz?: number; ulaz?: [number, number] }> = ({ seed, dodiri, izlaz = 18, ulaz = [1000, 1900] }) => {
  const f = useCurrentFrame();
  if (!dodiri.length) return null;
  const prvi = dodiri[0][0];
  const zadnji = dodiri[dodiri.length - 1][0];
  if (f < prvi - 16 || f > zadnji + izlaz) return null;
  const glatko = (t: number) => t * t * (3 - 2 * t);
  let x = ulaz[0];
  let y = ulaz[1];
  if (f < prvi) {
    const t = glatko(Math.max(0, (f - (prvi - 16)) / 12));
    x = ulaz[0] + (dodiri[0][1] - ulaz[0]) * t;
    y = ulaz[1] + (dodiri[0][2] - ulaz[1]) * t;
  } else if (f >= zadnji) {
    const t = glatko(Math.min(1, (f - zadnji - 4) / (izlaz - 4)));
    const [, zx, zy] = dodiri[dodiri.length - 1];
    x = zx + (ulaz[0] - zx) * Math.max(0, t);
    y = zy + (ulaz[1] - zy) * Math.max(0, t);
  } else {
    const i = dodiri.findIndex((d, k) => f >= d[0] && f < (dodiri[k + 1]?.[0] ?? Infinity));
    const [a, ax, ay] = dodiri[i];
    const [b, bx, by] = dodiri[i + 1];
    const t = glatko(Math.min(1, Math.max(0, (f - a - 3) / Math.max(4, Math.min(14, b - a - 6)))));
    x = ax + (bx - ax) * t;
    y = ay + (by - ay) * t;
  }
  // blizu dodira prst je spušten (malo manji i niže)
  const najblizi = Math.min(...dodiri.map((d) => Math.abs(f - d[0])));
  const spusten = najblizi < 3 ? 1 : najblizi < 6 ? 0.5 : 0;
  return (
    <g transform={`translate(${x} ${y + spusten * 8}) rotate(-16) scale(${(1 - spusten * 0.06).toFixed(3)})`}>
      <Ruka seed={seed} />
    </g>
  );
};

// ── Štoperica (rukom crtana) ─────────────────────────────────────────────
export const Stoperica: React.FC<{ seed: string; sek: number; r?: number; natpis?: string }> = ({ seed, sek, r = 88, natpis }) => {
  const b = useBoil();
  const ugao = ((sek % 60) / 60) * 360;
  const m = Math.floor(sek / 60);
  const s = Math.floor(sek % 60);
  const tekst = natpis ?? `${m}:${String(s).padStart(2, "0")}`;
  const kazaljka: Pt = [Math.sin((ugao * Math.PI) / 180) * r * 0.72, -Math.cos((ugao * Math.PI) / 180) * r * 0.72];
  const luk = Math.min(1, sek / 60);
  return (
    <g>
      <Isecak pts={pravougaonik(-22, -r - 44, 44, 34)} boja={P.korala} seed={`${seed}-dg`} amp={1} korak={12} />
      <Isecak pts={pravougaonik(-12, -r - 16, 24, 20)} boja="#5b5750" seed={`${seed}-vr`} senka="bez" amp={0.8} korak={10} />
      <Isecak pts={krugTacke(0, 0, r + 14, 22)} boja={P.zlatna400} seed={`${seed}-o`} amp={2} />
      <Isecak pts={krugTacke(0, 0, r, 22)} boja={P.belo} seed={`${seed}-l`} senka="bez" amp={1.4} />
      {/* protekli deo minuta (zelena kriška) */}
      {luk > 0 && luk < 1 && (
        <path
          d={`M0,0 L0,${-r * 0.9} A${r * 0.9},${r * 0.9} 0 ${luk > 0.5 ? 1 : 0} 1 ${Math.sin(luk * 2 * Math.PI) * r * 0.9},${-Math.cos(luk * 2 * Math.PI) * r * 0.9} Z`}
          fill={P.zelena100}
        />
      )}
      {luk >= 1 && <circle cx={0} cy={0} r={r * 0.9} fill={P.zelena100} />}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const d1 = r * (i % 3 ? 0.8 : 0.7);
        return (
          <line key={i} x1={Math.sin(a) * d1} y1={-Math.cos(a) * d1} x2={Math.sin(a) * r * 0.9} y2={-Math.cos(a) * r * 0.9} stroke={P.tekst} strokeWidth={i % 3 ? 3 : 6} strokeLinecap="round" />
        );
      })}
      <path d={drhtaviPut([[0, 0], kazaljka], `${seed}-k-${b}`, 0.8, 20, false)} stroke={P.korala600} strokeWidth={8} strokeLinecap="round" fill="none" />
      <circle cx={0} cy={0} r={10} fill={P.korala600} />
      <g transform={`translate(0 ${r + 62}) rotate(-3)`}>
        <Isecak pts={pravougaonik(-78, -40, 156, 68)} boja={P.zelena700} seed={`${seed}-e`} senka="mala" amp={1.4} korak={16} />
        <text x={0} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill={P.belo}>
          {tekst}
        </text>
      </g>
    </g>
  );
};

// ── Lična karta (uopštena, bez grba i stvarnog izgleda) ──────────────────
export const LicnaKarta: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(-200, -125, 400, 250)} boja="#CFE0EA" seed={`${seed}-k`} amp={1.8} />
    <Isecak pts={pravougaonik(-200, -125, 400, 54)} boja="#9CB9CC" seed={`${seed}-z`} senka="bez" amp={1.2} />
    <text x={-178} y={-86} fontFamily={SANS} fontWeight={900} fontSize={30} fill="#2F4B5E" letterSpacing={2}>
      LIČNA KARTA
    </text>
    <Isecak pts={pravougaonik(-176, -52, 120, 150)} boja="#E9F1F5" seed={`${seed}-f`} senka="bez" amp={1} />
    <g transform="translate(-116 40) scale(0.62)">
      <Isecak pts={krugTacke(0, -46, 34, 14)} boja="#9CB9CC" seed={`${seed}-fg`} senka="bez" amp={1} />
      <Isecak pts={[[-50, 60], [-42, 0], [42, 0], [50, 60]]} boja="#9CB9CC" seed={`${seed}-ft`} senka="bez" amp={1} />
    </g>
    {[-36, 4, 44, 84].map((y, i) => (
      <Crta key={i} pts={[[-30, y], [170 - i * 30, y]]} seed={`${seed}-l${i}`} boja="#7C98AC" debljina={9} amp={0.6} />
    ))}
  </g>
);

/** Crveni iks preko nečega (t 0–1 iscrtava obe crte). */
export const Iks: React.FC<{ seed: string; t: number; w?: number; h?: number }> = ({ seed, t, w = 220, h = 150 }) => (
  <g>
    <Crta pts={[[-w, -h], [w, h]]} seed={`${seed}-1`} boja={P.korala600} debljina={20} napredak={Math.min(1, t * 2)} korak={40} />
    <Crta pts={[[w, -h], [-w, h]]} seed={`${seed}-2`} boja={P.korala600} debljina={20} napredak={Math.max(0, t * 2 - 1)} korak={40} />
  </g>
);

// ── Lupa ─────────────────────────────────────────────────────────────────
export const Lupa: React.FC<{ seed: string }> = ({ seed }) => {
  const k = krugTacke(0, 0, 78, 22);
  return (
    <g>
      <Isecak pts={[[48, 50], [66, 34], [150, 118], [132, 136]]} boja="#8A5A34" seed={`${seed}-d`} />
      <circle cx={0} cy={0} r={74} fill="#DDF1F7" opacity={0.45} />
      <Crta pts={[...k, k[0]]} seed={`${seed}-o`} boja="#5b5750" debljina={16} />
      <Crta pts={[[-40, -30], [-20, -50]]} seed={`${seed}-s`} boja={P.belo} debljina={9} opacity={0.9} />
    </g>
  );
};

// ── Kartica oglasa (kao na Pijaci) ───────────────────────────────────────
export const OglasKartica: React.FC<{
  seed: string;
  naslov?: string;
  mesto?: string;
  iznos?: string;
  slika?: React.ReactNode;
  pozadinaSlike?: string;
}> = ({ seed, naslov = "Domaći med", mesto = "Sombor", iznos = "500 POENA", slika, pozadinaSlike = P.zlatna100 }) => (
  <g>
    <Isecak pts={pravougaonik(-180, -220, 360, 440)} boja={P.belo} seed={`${seed}-k`} amp={1.6} />
    <Isecak pts={pravougaonik(-160, -200, 320, 220)} boja={pozadinaSlike} seed={`${seed}-s`} senka="bez" amp={1} />
    <g transform="translate(0 -84)">{slika ?? <g transform="scale(0.85)"><Tegla seed={`${seed}-t`} /></g>}</g>
    <text x={-156} y={72} fontFamily={SANS} fontWeight={800} fontSize={42} fill={P.tekst}>
      {naslov}
    </text>
    <g transform="translate(-142 112) scale(0.55)">
      <Cioda seed={`${seed}-pin`} />
    </g>
    <text x={-120} y={122} fontFamily={SANS} fontWeight={600} fontSize={30} fill={P.siva}>
      {mesto}
    </text>
    <text x={-156} y={178} fontFamily={SANS} fontWeight={900} fontSize={36} fill={P.zelena700}>
      {iznos}
    </text>
  </g>
);

/** Čioda kojom je oglas zakačen na mapu. */
export const Cioda: React.FC<{ seed: string; boja?: string }> = ({ seed, boja = P.korala }) => (
  <g>
    <Crta pts={[[0, 0], [6, 34]]} seed={`${seed}-i`} boja={P.siva} debljina={5} />
    <Isecak pts={krugTacke(0, -6, 22, 12)} boja={boja} seed={`${seed}-g`} senka="mala" amp={1} korak={10} />
    <circle cx={-7} cy={-13} r={6} fill={P.belo} opacity={0.7} />
  </g>
);

// ── Predmeti za poslednju scenu ──────────────────────────────────────────
/** Mala školska tabla sa „2 + 2 = 4" (čas matematike). */
export const Tabla: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(-130, -90, 260, 180)} boja="#8A5A34" seed={`${seed}-r`} />
    <Isecak pts={pravougaonik(-114, -74, 228, 148)} boja="#2F5D46" seed={`${seed}-t`} senka="bez" amp={1.2} />
    <text x={0} y={18} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={70} fill={P.belo}>
      2 + 2 = 4
    </text>
    <Isecak pts={pravougaonik(40, 60, 50, 14)} boja={P.belo} seed={`${seed}-kr`} senka="mala" amp={0.8} korak={10} />
  </g>
);

/** Motika i šargarepe (pomoć u bašti). */
export const Basta: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Crta pts={[[-90, 110], [40, -110]]} seed={`${seed}-d`} boja="#9A6A3A" debljina={16} />
    <Isecak pts={[[20, -120], [80, -96], [70, -70], [22, -90]]} boja="#8E959A" seed={`${seed}-m`} senka="mala" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-10 + i * 46} ${70 - (i % 2) * 14}) rotate(${-10 + i * 12})`}>
        <Isecak pts={[[-14, -30], [14, -30], [0, 60]]} boja={P.narandza} seed={`${seed}-s${i}`} senka="mala" amp={1} korak={10} />
        <Isecak pts={[[-12, -30], [-18, -62], [0, -40], [16, -64], [12, -30]]} boja={P.zelena500} seed={`${seed}-l${i}`} senka="bez" amp={1} korak={10} />
      </g>
    ))}
  </g>
);

/** Parče papirnih konfeta (za slavlje). */
export const Konfete: React.FC<{ seed: string; x: number; y: number; t: number; n?: number; r?: number }> = ({ seed, x, y, t, n = 18, r = 380 }) => {
  if (t <= 0 || t >= 1) return null;
  const boje = [P.zlatna400, P.korala, P.trava, P.nebo, P.roze, P.zelena500];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + (i % 3) * 0.2;
        const d = r * (0.3 + 0.7 * t) * (0.7 + ((i * 37) % 10) / 30);
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d * 0.8 + t * t * 260;
        return (
          <g key={i} transform={`translate(${px} ${py}) rotate(${i * 40 + t * 540})`} opacity={t < 0.75 ? 1 : (1 - t) / 0.25}>
            <Isecak pts={pravougaonik(-14, -8, 28, 16)} boja={boje[i % boje.length]} seed={`${seed}-${i}`} senka="bez" amp={1} korak={10} />
          </g>
        );
      })}
    </g>
  );
};
