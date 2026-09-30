// Scena 3 — „Onda na Pijaci postaviš svoj prvi oglas, recimo: domaći med. Jedna fotografija
// i mesto, a po želji i broj telefona. Iznos u POENIMA određuješ sam."
// Ekran Pijace sa tuđim oglasima, prst pritisne „+ Novi oglas", obrazac se popunjava
// deo po deo (naslov, fotografija sa blicem, mesto, telefon po želji, iznos koji raste),
// a na „sam." prst pritisne „Objavi oglas" i ekran kaže „Tvoj oglas je postavljen".
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, napredak, pravougaonik } from "../papir";
import { Kljuc, Korpa, Pita, Igla } from "../likovi";
import { Tegla } from "../prica";
import { Cioda, Dugme, EKRAN, Kvacica, Polje, Prst, Talas, Telefon, TiLik, otkucano } from "../ekran";
import { SANS, RUKOPIS } from "../fontovi";
import { kad } from "../vreme";
import { TEL, TI_UGAO } from "./raspored";
import { TiOznaka } from "./Scena2";
import { Iks, LicnaKarta } from "../ekran";
import { Pecat } from "../selo";

const TUDJI: { el: (s: string) => React.ReactNode; naslov: string; boja: string }[] = [
  { el: (s) => <Pita seed={s} />, naslov: "Burek", boja: "#FCE7D2" },
  { el: (s) => <Kljuc seed={s} />, naslov: "Popravke", boja: "#E4EEF4" },
  { el: (s) => <Korpa seed={s} paradajza={5} />, naslov: "Paradajz", boja: "#F2F6E4" },
  { el: (s) => <Igla seed={s} />, naslov: "Šivenje", boja: "#F8E4EE" },
];

export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const postavis = kad(3, "postaviš");
  const svoj = kad(3, "svoj");
  const domaci = kad(3, "domaći");
  const foto = kad(3, "fotografija");
  const mesto = kad(3, "mesto,");
  const zelji = kad(3, "želji");
  const telefona = kad(3, "telefona.");
  const iznos = kad(3, "Iznos");
  const odredjujes = kad(3, "određuješ");
  const sam = kad(3, "sam.");

  const { x: ex, w: ew } = EKRAN;
  const X = ex + 30;
  const W = ew - 60;
  const tapNovi = postavis + 4;
  const uForma = napredak(f, tapNovi + 6, 14, Easing.inOut(Easing.cubic));
  const tapObjavi = sam + 2;
  const uGotovo = napredak(f, tapObjavi + 8, 12, Easing.inOut(Easing.cubic));
  const blic = napredak(f, foto + 4, 10, Easing.linear);
  const slika = napredak(f, foto + 8, 14, Easing.out(Easing.back(1.4)));
  const broj = Math.round(interpolate(napredak(f, odredjujes - 4, 24, Easing.out(Easing.cubic)), [0, 1], [0, 500]) / 50) * 50;
  const aktivno = (od: number, dok: number) => f >= od && f < dok;

  // lična karta iz scene 2 odlazi
  const kartaOde = napredak(f, 0, 16, Easing.in(Easing.cubic));

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {kartaOde < 1 && (
        <g transform={`translate(${780 + kartaOde * 700} ${1050 - kartaOde * 200}) rotate(${8 + kartaOde * 40})`}>
          <LicnaKarta seed="s2-lk" />
          <Iks seed="s2-iks" t={1} w={190} h={120} />
          <g transform="translate(-10 190) rotate(-8)">
            <Pecat seed="s2-pecat" tekst="NE TREBA" t={1} velicina={54} />
          </g>
        </g>
      )}
      <g transform={`translate(${TEL.x} ${TEL.y})`}>
        <Telefon seed="tel" adresa="ekolo.rs/pijaca">
          {/* Pijaca */}
          {uForma < 1 && (
            <g transform={`translate(${-uForma * ew} 0)`}>
              <text x={X + 4} y={-290} fontFamily={SANS} fontWeight={900} fontSize={60} fill={P.tekst}>
                Pijaca
              </text>
              <g transform={`translate(${X + W - 110} -310)`}>
                <Dugme seed="s3-novi" tekst="+ Novi oglas" w={230} h={70} velicina={32} pritisak={napredak(f, tapNovi - 3, 3) - napredak(f, tapNovi + 3, 4)} />
              </g>
              <Talas x={X + W - 110} y={-310} t={napredak(f, tapNovi, 14)} />
              {TUDJI.map((o, i) => {
                const cx = X + (i % 2) * (W / 2 + 8) + W / 4 - 4;
                const cy = -120 + Math.floor(i / 2) * 330;
                return (
                  <Pop key={i} at={-20 + i * 3} x={cx} y={cy}>
                    <Isecak pts={pravougaonik(-116, -120, 232, 300)} boja={P.belo} seed={`s3-t${i}`} senka="mala" amp={1.2} korak={18} />
                    <Isecak pts={pravougaonik(-104, -108, 208, 170)} boja={o.boja} seed={`s3-ts${i}`} senka="bez" amp={1} />
                    <g transform="translate(0 -24) scale(0.5)">{o.el(`s3-tp${i}`)}</g>
                    <text x={-100} y={112} fontFamily={SANS} fontWeight={800} fontSize={34} fill={P.tekst}>
                      {o.naslov}
                    </text>
                    <rect x={-100} y={132} width={120} height={12} rx={6} fill={P.ivica} />
                  </Pop>
                );
              })}
            </g>
          )}
          {/* obrazac „Novi oglas" */}
          {uForma > 0 && uGotovo < 1 && (
            <g transform={`translate(${(1 - uForma) * ew - uGotovo * ew} 0)`}>
              <text x={X + 4} y={-300} fontFamily={SANS} fontWeight={900} fontSize={54} fill={P.tekst}>
                Novi oglas
              </text>
              <Polje seed="s3-nas" x={X} y={-230} w={W} visina={74} oznaka="Naslov" tekst={otkucano("Domaći med", f, domaci - 2, 0.6)} placeholder="npr. Domaći med, lipa" aktivno={aktivno(svoj + 20, foto - 6)} />
              {/* fotografija */}
              <text x={X + 4} y={-112} fontFamily={SANS} fontWeight={700} fontSize={30} fill={P.siva}>
                Slike
              </text>
              <g transform={`translate(${X} -96)`}>
                <Crta pts={[[0, 0], [190, 0], [190, 150], [0, 150], [0, 0]]} seed="s3-slot" boja={P.siva} debljina={4} isprekidana />
                {slika <= 0 && (
                  <text x={95} y={96} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={70} fill="#C9C4BA">
                    +
                  </text>
                )}
                {slika > 0 && (
                  <g transform={`translate(95 75) rotate(${(1 - slika) * -25 - 4}) scale(${Math.min(1.2, slika).toFixed(3)})`}>
                    <Isecak pts={pravougaonik(-92, -80, 184, 176)} boja={P.belo} seed="s3-pol" senka="mala" amp={1.2} korak={16} />
                    <Isecak pts={pravougaonik(-80, -68, 160, 124)} boja={P.zlatna100} seed="s3-pols" senka="bez" amp={1} />
                    <g transform="translate(0 -4) scale(0.5)">
                      <Tegla seed="s3-tegla" />
                    </g>
                  </g>
                )}
              </g>
              {slika > 0.5 && (
                <text x={X + 214} y={-6} fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.zelena700}>
                  1 fotografija
                </text>
              )}
              <Polje seed="s3-mes" x={X} y={100} w={W} visina={74} oznaka="Mesto" tekst={f >= mesto ? "     " + otkucano("Sombor", f, mesto, 0.5) : ""} aktivno={aktivno(mesto - 4, zelji)}>
                {f >= mesto && (
                  <g transform={`translate(${X + 34} 128) scale(0.7)`}>
                    <Cioda seed="s3-cioda" />
                  </g>
                )}
              </Polje>
              <Polje
                seed="s3-tel"
                x={X}
                y={228}
                w={W}
                visina={74}
                oznaka="Telefon (po želji)"
                tekst={otkucano("06x xxx xxxx", f, telefona - 4, 0.7)}
                placeholder="po želji"
                aktivno={aktivno(telefona - 8, iznos - 6)}
              />
              <Polje
                seed="s3-izn"
                x={X}
                y={356}
                w={W * 0.62}
                visina={74}
                oznaka="Iznos"
                tekst={f >= odredjujes - 4 ? `${broj} POENA` : ""}
                placeholder="koliko POENA?"
                aktivno={aktivno(iznos - 4, tapObjavi - 6)}
              />
              <g transform={`translate(${X + W * 0.83} 393)`}>
                <Dugme seed="s3-obj" tekst="Objavi" w={W * 0.32} h={74} velicina={34} pritisak={napredak(f, tapObjavi - 3, 3) - napredak(f, tapObjavi + 3, 4)} />
              </g>
              <Talas x={X + W * 0.83} y={393} t={napredak(f, tapObjavi, 14)} />
            </g>
          )}
          {/* postavljen */}
          {uGotovo > 0 && (
            <g transform={`translate(${(1 - uGotovo) * ew} 0)`}>
              <Pop at={tapObjavi + 10} x={0} y={-60}>
                <Isecak pts={pravougaonik(-190, -250, 380, 440)} boja={P.belo} seed="s3-ok" amp={1.6} />
                <Isecak pts={pravougaonik(-170, -230, 340, 220)} boja={P.zlatna100} seed="s3-oks" senka="bez" amp={1} />
                <g transform="translate(0 -118) scale(0.85)">
                  <Tegla seed="s3-okt" />
                </g>
                <text x={-166} y={50} fontFamily={SANS} fontWeight={800} fontSize={44} fill={P.tekst}>
                  Domaći med
                </text>
                <text x={-166} y={100} fontFamily={SANS} fontWeight={600} fontSize={30} fill={P.siva}>
                  Sombor
                </text>
                <text x={-166} y={156} fontFamily={SANS} fontWeight={900} fontSize={36} fill={P.zelena700}>
                  500 POENA
                </text>
              </Pop>
              <Pop at={tapObjavi + 14} x={0} y={260}>
                <text x={0} y={-10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={46} fill={P.zelena700}>
                  Tvoj oglas je
                </text>
                <text x={0} y={46} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={46} fill={P.zelena700}>
                  postavljen
                </text>
                <g transform="translate(0 116)">
                  <Kvacica seed="s3-kv" t={napredak(f, tapObjavi + 16, 10)} velicina={1.4} />
                </g>
              </Pop>
            </g>
          )}
          {/* blic fotoaparata */}
          {blic > 0 && blic < 1 && <rect x={EKRAN.x} y={EKRAN.y} width={EKRAN.w} height={EKRAN.h} fill="#fff" opacity={(1 - blic) * 0.9} />}
        </Telefon>
      </g>

      <Prst
        seed="s3-prst"
        dodiri={[
          [tapNovi, TEL.x + X + W - 110, TEL.y - 310],
          [svoj + 24, TEL.x + X + 200, TEL.y - 193],
          [foto + 2, TEL.x + X + 95, TEL.y - 20],
          [mesto - 4, TEL.x + X + 250, TEL.y + 137],
          [telefona - 8, TEL.x + X + 250, TEL.y + 265],
          [iznos - 4, TEL.x + X + 150, TEL.y + 393],
          [tapObjavi, TEL.x + X + W * 0.83, TEL.y + 393],
        ]}
      />

      <g transform={`translate(${TI_UGAO.x} ${TI_UGAO.y}) scale(${TI_UGAO.s})`}>
        <TiLik seed="s1-ti" popuna={1} />
        <TiOznaka seed="s2-nov" tekst="nov član" />
      </g>
    </svg>
  );
};
