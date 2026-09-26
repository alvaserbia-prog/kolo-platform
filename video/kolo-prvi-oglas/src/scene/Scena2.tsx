// Scena 2 — „Na ekolo.rs klikneš „Pridruži se". Izabereš pseudonim, upišeš mejl i lozinku.
// Za minut si unutra, bez podataka iz lične karte."
// Telefon: u adresnu traku se otkuca ekolo.rs, prst pritisne „Pridruži se", obrazac
// „Pridruživanje" se popunjava. Na „unutra" (udar u muzici) ekran kaže „Unutra si!",
// silueta „ti" dobije boje i oznaku „nov član". Lična karta uleti i bude precrtana.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Defs, Isecak, Pop, napredak, pravougaonik, usePop } from "../papir";
import { Etiketa } from "../likovi";
import { LogoZnak } from "../kolo";
import { Pecat } from "../selo";
import { Dugme, EKRAN, Iks, Konfete, Kvacica, LicnaKarta, Polje, Prst, Talas, Telefon, TiLik, otkucano } from "../ekran";
import { SANS, RUKOPIS } from "../fontovi";
import { kad } from "../vreme";
import { TEL, TI_UGAO } from "./raspored";

const PSEUDONIM = "TvojPseudonim";
const MEJL = "tvoj@email.com";
const LOZINKA = "••••••••";

/** Oznaka statusa ispod lika „ti" (deli se sa scenama 3 i 4). */
export const TiOznaka: React.FC<{ seed: string; tekst: string; zelena?: boolean }> = ({ seed, tekst, zelena }) => (
  <g transform="translate(0 176) rotate(-3)">
    <Etiketa seed={seed} tekst={tekst} velicina={50} boja={zelena ? P.belo : P.zelena900} pozadina={zelena ? P.zelena700 : P.belo} />
  </g>
);

export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const ekolo = kad(2, "ekolo.rs");
  const klik = kad(2, "„Pridruži");
  const izaberes = kad(2, "Izabereš");
  const pseudonim = kad(2, "pseudonim,");
  const mejl = kad(2, "mejl");
  const lozinku = kad(2, "lozinku.");
  const za = kad(2, "Za");
  const unutra = kad(2, "unutra,");
  const bez = kad(2, "bez");
  const licne = kad(2, "lične");
  const karte = kad(2, "karte.");

  const { x: ex, y: ey, w: ew } = EKRAN;
  const adresa = otkucano("ekolo.rs", f, ekolo - 2, 0.5);
  const tapDugme = klik + 2;
  const tapUslovi = lozinku + 14;
  const tapPridruzi = za - 4;
  // ekran A (naslovna) → B (obrazac) → C (unutra si)
  const uB = napredak(f, klik + 10, 14, Easing.inOut(Easing.cubic));
  const uC = napredak(f, unutra - 6, 12, Easing.inOut(Easing.cubic));
  const popuna = napredak(f, unutra - 2, 10, Easing.out(Easing.back(1.6)));
  const karta = usePop(bez - 4, 140);
  const iks = napredak(f, licne - 4, 16, Easing.linear);
  const pecat = napredak(f, karte - 2, 8, Easing.out(Easing.cubic));

  const polje = (koje: "p" | "m" | "l") =>
    koje === "p" ? f >= izaberes && f < mejl - 4 : koje === "m" ? f >= mejl - 4 && f < lozinku - 2 : f >= lozinku - 2 && f < tapUslovi;

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <g transform={`translate(${TEL.x} ${TEL.y})`}>
        <Telefon seed="tel" adresa={adresa} kursor={f < klik}>
          {/* A: naslovna ekolo.rs */}
          {uB < 1 && adresa.length > 0 && (
            <g transform={`translate(${-uB * ew} 0)`}>
              <Pop at={ekolo + 10} x={0} y={-150} skala={1}>
                <LogoZnak seed="s2-logo" r={110} />
              </Pop>
              <Pop at={ekolo + 14} x={0} y={60}>
                <text x={0} y={0} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={96} fill={P.zelena700} letterSpacing={4}>
                  KOLO
                </text>
                <text x={0} y={62} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={50} fill={P.siva}>
                  razmena među komšijama
                </text>
              </Pop>
              <Pop at={ekolo + 20} x={0} y={260}>
                <Dugme seed="s2-dugme-a" tekst="Pridruži se" w={400} h={110} velicina={52} pritisak={napredak(f, tapDugme - 3, 3) - napredak(f, tapDugme + 3, 4)} />
              </Pop>
              <Talas x={0} y={260} t={napredak(f, tapDugme, 16, Easing.out(Easing.cubic))} />
            </g>
          )}
          {/* B: obrazac „Pridruživanje" */}
          {uB > 0 && uC < 1 && (
            <g transform={`translate(${(1 - uB) * ew - uC * ew} 0)`}>
              <text x={ex + 34} y={-270} fontFamily={SANS} fontWeight={900} fontSize={58} fill={P.tekst}>
                Pridruživanje
              </text>
              <Polje seed="s2-ps" x={ex + 30} y={-190} w={ew - 60} oznaka="Pseudonim" tekst={otkucano(PSEUDONIM, f, pseudonim - 4, 0.8)} placeholder="TvojPseudonim" aktivno={polje("p")} />
              {f > pseudonim + 16 && (
                <g transform={`translate(${ex + ew - 70} -149)`}>
                  <Kvacica seed="s2-kv-ps" t={napredak(f, pseudonim + 16, 8)} velicina={0.9} />
                </g>
              )}
              <Polje seed="s2-ml" x={ex + 30} y={-40} w={ew - 60} oznaka="Email" tekst={otkucano(MEJL, f, mejl - 2, 0.9)} placeholder="tvoj@email.com" aktivno={polje("m")} />
              <Polje seed="s2-lz" x={ex + 30} y={110} w={ew - 60} oznaka="Lozinka" tekst={otkucano(LOZINKA, f, lozinku - 2, 0.6)} placeholder="••••••••" aktivno={polje("l")} />
              {/* prihvatanje Uslova */}
              <g transform={`translate(${ex + 30} 238)`}>
                <Isecak pts={pravougaonik(0, 0, 44, 44)} boja={P.belo} seed="s2-cb" senka="mala" amp={1} korak={12} ivica={P.ivica} ivicaDebljina={3} />
                {f >= tapUslovi && (
                  <g transform="translate(22 22) scale(0.8)">
                    <Kvacica seed="s2-cbk" t={napredak(f, tapUslovi, 6)} boja={P.zelena700} />
                  </g>
                )}
                <text x={60} y={34} fontFamily={SANS} fontWeight={600} fontSize={30} fill={P.siva}>
                  Prihvatam Uslove korišćenja
                </text>
              </g>
              <g transform="translate(0 380)">
                <Dugme seed="s2-dugme-b" tekst="Pridruži se" w={ew - 60} h={96} pritisak={napredak(f, tapPridruzi - 3, 3) - napredak(f, tapPridruzi + 3, 4)} />
              </g>
              <Talas x={0} y={380} t={napredak(f, tapPridruzi, 16, Easing.out(Easing.cubic))} />
            </g>
          )}
          {/* C: unutra si */}
          {uC > 0 && (
            <g transform={`translate(${(1 - uC) * ew} 0)`}>
              <Pop at={unutra - 2} x={0} y={-90} skala={1.1}>
                <Isecak pts={[[-100, -100], [100, -100], [100, 100], [-100, 100]].map(([x, y]) => [x * 0.95, y * 0.95] as [number, number])} boja={P.zelena100} seed="s2-okv" senka="bez" amp={6} korak={40} />
                <Kvacica seed="s2-kvc" t={napredak(f, unutra, 10)} velicina={3.2} debljina={8} boja={P.zelena700} />
              </Pop>
              <Pop at={unutra + 2} x={0} y={110}>
                <text x={0} y={0} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={84} fill={P.zelena700}>
                  Unutra si!
                </text>
                <text x={0} y={70} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={50} fill={P.siva}>
                  nalog je spreman
                </text>
              </Pop>
            </g>
          )}
        </Telefon>
        <Konfete seed="s2-konf" x={0} y={-100} t={napredak(f, unutra, 44, Easing.out(Easing.quad))} n={22} r={460} />
      </g>

      {/* prst */}
      <Prst
        seed="s2-prst"
        dodiri={[
          [tapDugme, TEL.x, TEL.y + 260],
          [pseudonim - 8, TEL.x - 60, TEL.y - 150],
          [mejl - 6, TEL.x - 60, TEL.y],
          [lozinku - 4, TEL.x - 60, TEL.y + 150],
          [tapUslovi, TEL.x - 250, TEL.y + 260],
          [tapPridruzi, TEL.x, TEL.y + 380],
        ]}
      />

      {/* „ti" u uglu: dobija boje na „unutra" */}
      <g transform={`translate(${TI_UGAO.x} ${TI_UGAO.y}) scale(${TI_UGAO.s})`}>
        <g transform={`scale(${(1 + Math.max(0, Math.sin(Math.PI * napredak(f, unutra - 2, 14, Easing.linear))) * 0.18).toFixed(3)})`}>
          <TiLik seed="s1-ti" popuna={popuna} />
        </g>
        {f < unutra ? (
          <g transform="translate(0 176) rotate(-3)">
            <Etiketa seed="s1-ti-e" tekst="ti" velicina={62} boja={P.zelena900} />
          </g>
        ) : (
          <Pop at={unutra} x={0} y={0}>
            <TiOznaka seed="s2-nov" tekst="nov član" />
          </Pop>
        )}
      </g>

      {/* lična karta — ne treba */}
      {karta > 0 && (
        <g transform={`translate(${interpolate(karta, [0, 1], [1400, 780])} ${1050}) rotate(${interpolate(karta, [0, 1], [30, 8])})`}>
          <LicnaKarta seed="s2-lk" />
          <Iks seed="s2-iks" t={iks} w={190} h={120} />
          <g transform="translate(-10 190) rotate(-8)">
            <Pecat seed="s2-pecat" tekst="NE TREBA" t={pecat} velicina={54} />
          </g>
        </g>
      )}
    </svg>
  );
};
