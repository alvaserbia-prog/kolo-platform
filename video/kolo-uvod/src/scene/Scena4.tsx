// Scena 4 — „To je KOLO. Ponudiš ono što umeš ili imaš. Kad nekome pomogneš,
// upisuju ti se POEN-i. A kad tebi nešto zatreba, neko pomogne tebi."
// POEN nije novac: prikazan je kao kartončić-zapis sa žigom, nikad kao novčić.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Pop, Pt, napredak } from "../papir";
import { Asov, Kartoncic, Kljuc, Knjiga, Igla, Korpa, Pita, Upitnik, spring01 } from "../likovi";
import { Geo, Kolo, LogoZnak, Strelica, polozaj } from "../kolo";
import { kad } from "../vreme";

const PREDMETI = [
  (s: string) => <Asov seed={s} />,
  (s: string) => <Kljuc seed={s} />,
  (s: string) => <Korpa seed={s} paradajza={4} />,
  (s: string) => <Pita seed={s} />,
  (s: string) => <Knjiga seed={s} />,
  (s: string) => <Igla seed={s} />,
];
const POMAGAC = 0;
const PRIMA = 3;

export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const kolo = kad(4, "KOLO.");
  const ponudis = kad(4, "Ponudiš");
  const ono = kad(4, "ono");
  const kadF = kad(4, "Kad");
  const upisuju = kad(4, "upisuju");
  const poen = kad(4, "POEN-i.");
  const aKad = kad(4, "A");
  const zatreba = kad(4, "zatreba,");
  const neko = kad(4, "neko");

  // kolo se polako okreće (igra), pa uspori dok se čita kartončić
  const ugao = 60 + interpolate(f, [0, kadF, upisuju + 20, 400], [0, 22, 30, 60]);
  const geo: Geo = { cx: 540, cy: 1020, rx: 360, ry: 150, ugao, skala: 0.92, n: 6 };
  const pojava = Array.from({ length: 6 }, (_, i) => ponudis + i * 3);
  const pom = polozaj(geo, POMAGAC);
  const pri = polozaj(geo, PRIMA);
  const iznad = (p: ReturnType<typeof polozaj>, dy = 90): Pt => [p.glava[0], p.glava[1] - dy * p.s];

  const sjajPom = f >= kadF && f < aKad ? Math.min(1, (f - kadF) / 8) : f >= neko + 10 ? Math.min(1, (f - neko - 10) / 8) : 0;
  const sjajPri = f >= neko - 6 && f < neko + 20 ? 1 : 0;

  // kartončić: uskače iznad kola, posle „A kad" se skloni gore desno
  const kartP = spring01(f - upisuju);
  const skloni = napredak(f, aKad - 4, 14);
  const kx = interpolate(skloni, [0, 1], [540, 845]);
  const ky = interpolate(skloni, [0, 1], [610, 560]);
  const ks = interpolate(skloni, [0, 1], [1.25, 0.72]);
  const zig = f < poen ? 0 : spring01(f - poen);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* logo uskače odmah, a na izgovoreno „KOLO" još jednom poskoči */}
      <Pop at={3} x={540} y={300} njihanje={1.5} skala={1 + 0.14 * Math.sin(Math.PI * napredak(f, kolo - 2, 12, Easing.linear))}>
        <LogoZnak seed="s4-logo" r={150} />
      </Pop>
      {/* krug na podu */}
      <Crta
        pts={Array.from({ length: 41 }, (_, i): Pt => [540 + Math.cos((i / 40) * Math.PI * 2) * 390, 1020 + Math.sin((i / 40) * Math.PI * 2) * 170])}
        seed="s4-pod"
        boja={P.zelena500}
        debljina={6}
        napredak={napredak(f, ponudis - 8, 20)}
        opacity={0.6}
      />
      <Kolo seed="s4-kolo" geo={geo} pojava={pojava} ruke={ponudis + 18} istaknuti={{ [POMAGAC]: sjajPom, [PRIMA]: sjajPri }} />
      {/* ono što umeš ili imaš */}
      {PREDMETI.map((el, i) => {
        const p = polozaj(geo, i);
        const at = ono + i * 4;
        const nestaje = napredak(f, kadF - 6, 8, Easing.in(Easing.quad));
        if (f < at || nestaje >= 1) return null;
        const [x, y] = iznad(p, 110);
        return (
          <g key={i} opacity={1 - nestaje}>
            <Pop at={at} x={x} y={y} skala={0.4 * p.s} njihanje={4} faza={i}>
              {el(`s4-pr${i}`)}
            </Pop>
          </g>
        );
      })}
      {/* pomogneš: strelica od pomagača ka onome kome treba */}
      <Strelica a={iznad(pom, 40)} b={iznad(pri, 40)} napredak={napredak(f, kadF + 4, 18)} boja={P.zlatna600} seed="s4-str1" savij={0.3} />
      {/* kad tebi zatreba: strelica nazad */}
      <Strelica a={iznad(pri, 20)} b={iznad(pom, 20)} napredak={napredak(f, neko - 4, 18)} boja={P.zelena700} seed="s4-str2" savij={0.3} />
      {f >= zatreba && f < neko + 14 && (
        <g opacity={1 - napredak(f, neko + 4, 10)}>
          <Pop at={zatreba} x={iznad(pom, 150)[0]} y={iznad(pom, 150)[1]} skala={0.45} njihanje={4}>
            <Upitnik seed="s4-upit" boja={P.korala} />
          </Pop>
        </g>
      )}
      {/* POEN — zapis */}
      {kartP > 0 && (
        <g>
          {skloni < 0.5 && (
            <Crta pts={[[kx, ky + 110], iznad(pom, 10)]} seed="s4-veza" boja={P.zelena700} debljina={4} isprekidana napredak={napredak(f, upisuju + 4, 10)} opacity={1 - skloni * 2} />
          )}
          <g transform={`translate(${kx} ${ky}) rotate(${-3 + (1 - kartP) * -10}) scale(${(ks * kartP).toFixed(4)})`}>
            <Kartoncic seed="s4-kart" zig={zig} />
          </g>
        </g>
      )}
    </svg>
  );
};
