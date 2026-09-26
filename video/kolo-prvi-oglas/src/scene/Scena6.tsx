// Scena 6 — „Šta ti imaš da ponudiš? Med, popravku, čas matematike, pomoć u bašti?
// Uđi na ekolo.rs i postavi svoj prvi oglas. Treba ti dva minuta."
// Prazna isprekidana kartica „Tvoj prvi oglas" sa kursorom; oko nje uskaču primeri na
// izgovorenu reč. Na „ekolo.rs" slova sajta. Na „postavi" primeri uleću u karticu, ona
// postane puna i prst pritisne „Objavi oglas". Na „dva minuta" štoperica pokaže 2:00.
// Na završnom akordu: kolo sa „ti" u njemu i kartica sa pozivom.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, napredak, pravougaonik, usePop } from "../papir";
import { Etiketa } from "../likovi";
import { Kolo, LogoZnak } from "../kolo";
import { Iskre, OSOBE_KOLA, Tegla } from "../prica";
import { KutijaAlata } from "../prica";
import { Basta, Dugme, Konfete, Kursor, Prst, Stoperica, TI, Tabla, Talas } from "../ekran";
import { SANS, RUKOPIS } from "../fontovi";
import { kad, scena, FPS } from "../vreme";

const SLOVA = "ekolo.rs".split("");
const KARTA = { x: 540, y: 820 };
/** Završni akord muzike (75,0 s) u lokalnim frejmovima scene. */
const AKORD = Math.round(75.0 * FPS) - scena(6).odF;

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const sta = kad(6, "Šta");
  const med = kad(6, "Med,");
  const popravku = kad(6, "popravku,");
  const matematike = kad(6, "čas");
  const basti = kad(6, "pomoć");
  const udji = kad(6, "Uđi");
  const ekolo = kad(6, "ekolo.rs");
  const postavi = kad(6, "postavi");
  const oglas = kad(6, "oglas.");
  const treba = kad(6, "Treba");
  const minuta = kad(6, "minuta.");

  const PRIMERI = [
    { at: med, x: 185, y: 560, s: 0.95, el: (s: string) => <Tegla seed={s} />, ime: "med" },
    { at: popravku, x: 895, y: 560, s: 1.0, el: (s: string) => <KutijaAlata seed={s} />, ime: "popravka" },
    { at: matematike, x: 190, y: 1100, s: 0.92, el: (s: string) => <Tabla seed={s} />, ime: "čas matematike" },
    { at: basti, x: 890, y: 1100, s: 1.0, el: (s: string) => <Basta seed={s} />, ime: "bašta" },
  ];

  const upad = (i: number) => napredak(f, postavi - 4 + i * 3, 14, Easing.in(Easing.cubic));
  const puna = napredak(f, postavi + 8, 12, Easing.out(Easing.cubic));
  const tap = oglas + 2;
  const objavljeno = f >= tap + 4;
  const sat = usePop(treba - 4, 150);
  const satSek = interpolate(f, [treba, minuta + 6], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const kraj = napredak(f, AKORD - 16, 16, Easing.in(Easing.cubic));
  const cta = usePop(AKORD, 150);
  const koloPojava = [0, 1, 2, 3, 4].map((i) => AKORD - 10 + i * 3);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />

      {kraj < 1 && (
        <g transform={`translate(0 ${kraj * 1300})`} opacity={1 - kraj}>
          {/* kartica „Tvoj prvi oglas" */}
          <Pop at={sta - 4} x={KARTA.x} y={KARTA.y} skala={1.2} njihanje={0.8}>
            {puna > 0 && <Isecak pts={pravougaonik(-180, -220, 360, 440)} boja={P.belo} seed="s6-kp" amp={1.6} opacity={puna} />}
            <Crta pts={[[-180, -220], [180, -220], [180, 220], [-180, 220], [-180, -220]]} seed="s6-kc" boja={P.zelena700} debljina={6} isprekidana opacity={1 - puna} />
            <Crta pts={[[-160, -200], [160, -200], [160, 20], [-160, 20], [-160, -200]]} seed="s6-kcs" boja={P.siva} debljina={4} isprekidana opacity={1 - puna} />
            {puna > 0 && <Isecak pts={pravougaonik(-160, -200, 320, 220)} boja={P.zlatna100} seed="s6-kps" senka="bez" amp={1} opacity={puna} />}
            {puna <= 0 ? (
              <text x={0} y={-50} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={150} fill={P.zlatna400}>
                ?
              </text>
            ) : (
              <g opacity={puna}>
                {[0, 1, 2, 3].map((i) => (
                  <g key={i} transform={`translate(${-80 + (i % 2) * 160} ${-150 + Math.floor(i / 2) * 110}) scale(${[0.36, 0.36, 0.34, 0.4][i]})`}>
                    {PRIMERI[i].el(`s6-u${i}`)}
                  </g>
                ))}
              </g>
            )}
            <text x={-156} y={78} fontFamily={SANS} fontWeight={800} fontSize={42} fill={P.tekst}>
              Tvoj prvi oglas
            </text>
            {!objavljeno && <Kursor x={146} y={80} h={42} />}
            <g transform="translate(0 160)">
              {objavljeno ? (
                <g transform="rotate(-4)">
                  <Etiketa seed="s6-obj" tekst="objavljen!" velicina={56} boja={P.belo} pozadina={P.zelena500} />
                </g>
              ) : (
                <Dugme seed="s6-dug" tekst="Objavi oglas" w={300} h={84} velicina={40} pritisak={napredak(f, tap - 3, 3) - napredak(f, tap + 3, 4)} />
              )}
            </g>
          </Pop>
          <Talas x={KARTA.x} y={KARTA.y + 160 * 1.2} t={napredak(f, tap, 16)} />
          <Konfete seed="s6-konf" x={KARTA.x} y={KARTA.y} t={napredak(f, tap + 4, 44, Easing.out(Easing.quad))} n={24} r={520} />

          {/* primeri: uskaču na reč, na „postavi" uleću u karticu */}
          {PRIMERI.map((p, i) => {
            const u = upad(i);
            if (u >= 1) return null;
            const x = interpolate(u, [0, 1], [p.x, KARTA.x]);
            const y = interpolate(u, [0, 1], [p.y, KARTA.y - 100]);
            return (
              <g key={i} transform={`translate(${x - p.x} ${y - p.y})`} opacity={1 - u * 0.6}>
                <Pop at={p.at - 3} x={p.x} y={p.y} skala={p.s * (1 - u * 0.6)} njihanje={4} faza={i}>
                  {p.el(`s6-p${i}`)}
                  <g transform={`translate(0 ${i < 2 ? 150 : 170}) rotate(${i % 2 ? 3 : -3})`}>
                    <Etiketa seed={`s6-e${i}`} tekst={p.ime} velicina={58} boja={P.zelena900} />
                  </g>
                </Pop>
              </g>
            );
          })}

          {/* dva minuta */}
          {sat > 0 && (
            <g transform={`translate(880 1070) rotate(${(1 - sat) * -20 + 6}) scale(${(sat * 1.05).toFixed(4)})`}>
              <Stoperica seed="s6-sat" sek={satSek} r={92} />
            </g>
          )}
        </g>
      )}
      <Prst seed="s6-prst" dodiri={[[tap, KARTA.x, KARTA.y + 160 * 1.2]]} />

      {/* ekolo.rs — svako slovo svoj isečak; ostaje do kraja */}
      {SLOVA.map((c, i) => {
        const sirine = SLOVA.map((z) => (z === "." ? 58 : 112));
        const ukupno = sirine.reduce((a, b) => a + b, 0);
        const x = 540 - ukupno / 2 + sirine.slice(0, i).reduce((a, b) => a + b, 0) + sirine[i] / 2;
        const tacka = c === ".";
        return (
          <Pop key={i} at={ekolo - 3 + i * 2} x={x} y={300} rot={(i % 2 ? 4 : -4) + (i % 3) - 1} njihanje={1.5} faza={i}>
            {!tacka && <Isecak pts={pravougaonik(-53, -92, 106, 144)} boja={P.belo} seed={`s6-l${i}`} amp={2} />}
            <text x={0} y={34} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={132} fill={tacka ? P.zlatna600 : P.zelena700}>
              {c}
            </text>
          </Pop>
        );
      })}

      {/* završetak: kolo sa „ti" u njemu, KOLO znak i poziv */}
      {f >= AKORD - 12 && (
        <g>
          <Pop at={AKORD - 6} x={540} y={600} skala={0.62} njihanje={1.5}>
            <LogoZnak seed="s6-logo" r={110} />
          </Pop>
          <Kolo
            seed="s6-kolo"
            geo={{ cx: 540, cy: 900, rx: 330, ry: 110, ugao: 200, skala: 1.05, n: 5 }}
            pojava={koloPojava}
            ruke={AKORD + 4}
            osobe={[...OSOBE_KOLA.slice(0, 2), TI, ...OSOBE_KOLA.slice(2)]}
            istaknuti={{ 2: Math.max(0, 1 - (f - AKORD - 10) / 40) }}
          />
          {f >= AKORD + 4 && f < AKORD + 40 && <Iskre seed="s6-isk" x={540} y={820} t={napredak(f, AKORD + 4, 34)} r={480} n={12} />}
        </g>
      )}
      {cta > 0 && (
        <g transform={`translate(540 1400) rotate(${-2 + (1 - cta) * -8}) scale(${cta.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-450, -120, 900, 262)} boja={P.zelena700} seed="s6-cta" amp={3} />
          <text x={0} y={-22} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={88} fill={P.belo}>
            ekolo.rs
          </text>
          <text x={0} y={54} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={66} fill={P.zlatna400}>
            postavi svoj prvi oglas
          </text>
          <text x={0} y={112} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={36} fill={P.zelena100}>
            registracija oko minut · bez dokumenata
          </text>
        </g>
      )}
    </svg>
  );
};
