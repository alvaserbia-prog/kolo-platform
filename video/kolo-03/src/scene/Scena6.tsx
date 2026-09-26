// Scena 6 — „Komšijska sveska našeg kraja je otvorena. Pridruži se besplatno na ekolo.rs"
// Sveska se vrati na sredinu; nad njom „naš kraj" (Županija i kuće). Na „otvorena" se
// pojavi prazan red „Ti → … · tvoj prvi zapis" i olovka čeka. Na „Pridruži se" sveska se
// zatvori (korice sa KOLO znakom), komšije izvire iza nje, pa ekolo.rs i poziv.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Defs, Isecak, Pop, napredak, pravougaonik, usePop } from "../papir";
import { Etiketa, Kuca, Osoba } from "../likovi";
import { LogoZnak } from "../kolo";
import { DefsNalepnica, Iskre, LIKOVI, LikId, Slika } from "../prica";
import { KOMSIJE, KomsijaId } from "../selo";
import { Olovka, Sveska, X_REDA, yReda } from "../sveska";
import { ANA_LAZAR, MILAN_ANA, SECANJE } from "../zapisi";
import { SV4 } from "./Scena4";
import { SANS, RUKOPIS } from "../fontovi";
import { kad, glasF, scena } from "../vreme";

const SV6 = { x: 540, y: 930, s: 1 };
const SLOVA = "ekolo.rs".split("");
const GLAVE: { id: LikId | KomsijaId; x: number }[] = [
  { id: "jova", x: 150 },
  { id: "ana", x: 330 },
  { id: "lazar", x: 750 },
  { id: "stana", x: 930 },
  { id: "milan", x: 540 },
];

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const nasesg = kad(6, "našeg");
  const otvorena = kad(6, "otvorena.");
  const pridruzi = kad(6, "Pridruži");
  const besplatno = kad(6, "besplatno");
  const na = kad(6, "na");
  const ekolo = kad(6, "ekolo.rs");
  const krajGlasa = glasF(6, scena(6).glasDo - scena(6).glasOd);

  const pomak = napredak(f, 0, 18);
  const svX = interpolate(pomak, [0, 1], [SV4.x, SV6.x]);
  const svY = interpolate(pomak, [0, 1], [SV4.y, SV6.y]);
  const svS = interpolate(pomak, [0, 1], [SV4.s, SV6.s]);
  const prazan = napredak(f, otvorena - 2, 16);
  const zatvaranje = napredak(f, pridruzi - 2, 20, Easing.inOut(Easing.cubic));
  const krajOde = napredak(f, pridruzi - 6, 12);
  const cta = usePop(krajGlasa + 4, 150);

  const redovi = [
    ...SECANJE.map((r) => ({ ...r, zig: 1 })),
    { ...MILAN_ANA, zig: 1 },
    { ...ANA_LAZAR, zig: 1, marker: 1 - napredak(f, 0, 12) },
  ];
  const olovkaY = SV6.y + yReda(redovi.length) - 8 + Math.sin(f / 4) * 10;

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <DefsNalepnica />
      {/* naš kraj — iznad sveske */}
      {krajOde < 1 && (
        <g opacity={1 - krajOde}>
          <Pop at={nasesg - 3} x={540} y={515} skala={1}>
            <Slika ime="zupanija" sirina={560} seed="s6-zup" />
          </Pop>
          <Pop at={nasesg + 1} x={120} y={520} skala={0.62}>
            <Kuca seed="s6-k1" fasada={P.sunce} krov={P.korala} kapci={P.zelena700} />
          </Pop>
          <Pop at={nasesg + 4} x={960} y={520} skala={0.62}>
            <Kuca seed="s6-k2" fasada="#D5E7F2" krov={P.korala600} kapci={P.nebo} />
          </Pop>
        </g>
      )}

      {/* komšije izviruju iza zatvorene sveske */}
      {GLAVE.map((g, i) => {
        const t = napredak(f, na - 6 + i * 3, 14, Easing.out(Easing.back(1.6)));
        if (t <= 0) return null;
        const cfg = g.id in LIKOVI ? LIKOVI[g.id as LikId] : KOMSIJE[g.id as KomsijaId];
        const skok = Math.max(0, Math.sin((f + i * 9) / 6)) * 8;
        return (
          <g key={g.id} transform={`translate(${g.x} ${interpolate(t, [0, 1], [700, 555]) - skok}) scale(1.05)`}>
            <Osoba seed={`s6-g${g.id}`} boja={cfg.boja} glava={cfg.glava} />
          </g>
        );
      })}

      <g transform={`translate(${svX} ${svY}) scale(${svS})`}>
        <Sveska seed="sv" redovi={redovi} prazan={prazan} zatvaranje={zatvaranje} />
        {zatvaranje < 0.5 && (
          <g transform="translate(355 -262) rotate(8) scale(0.42)">
            <LogoZnak seed="s3-logo" r={110} />
          </g>
        )}
      </g>
      {prazan > 0 && zatvaranje < 0.3 && (
        <g transform={`translate(${SV6.x + X_REDA + 715} ${olovkaY})`} opacity={1 - zatvaranje / 0.3}>
          <Olovka seed="s6-olovka" />
        </g>
      )}
      {zatvaranje >= 1 && f < pridruzi + 50 && <Iskre seed="s6-isk" x={540} y={930} t={napredak(f, pridruzi + 18, 30)} r={520} n={12} />}
      <Pop at={besplatno - 2} x={820} y={1220} rot={8} njihanje={2}>
        <Etiketa seed="s6-bespl" tekst="besplatno" velicina={62} boja={P.zelena900} pozadina={P.zlatna400} />
      </Pop>

      {/* ekolo.rs — svako slovo svoj isečak */}
      {SLOVA.map((c, i) => {
        const sirine = SLOVA.map((z) => (z === "." ? 58 : 112));
        const ukupno = sirine.reduce((a, b) => a + b, 0);
        const x = 540 - ukupno / 2 + sirine.slice(0, i).reduce((a, b) => a + b, 0) + sirine[i] / 2;
        const tacka = c === ".";
        return (
          <Pop key={i} at={ekolo - 3 + i * 2} x={x} y={330} rot={(i % 2 ? 4 : -4) + (i % 3) - 1} njihanje={1.5} faza={i}>
            {!tacka && <Isecak pts={pravougaonik(-53, -92, 106, 144)} boja={P.belo} seed={`s6-l${i}`} amp={2} />}
            <text x={0} y={34} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={132} fill={tacka ? P.zlatna600 : P.zelena700}>
              {c}
            </text>
          </Pop>
        );
      })}

      {/* poziv posle poslednje reči (titlovi su tada skinuti) */}
      {cta > 0 && (
        <g transform={`translate(540 1500) rotate(${-2 + (1 - cta) * -8}) scale(${cta.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-440, -110, 880, 250)} boja={P.zelena700} seed="s6-cta" amp={3} />
          <text x={0} y={-16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={84} fill={P.belo}>
            ekolo.rs
          </text>
          <text x={0} y={56} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={P.zlatna400}>
            postavi svoj prvi oglas
          </text>
          <text x={0} y={112} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={34} fill={P.zelena100}>
            besplatno · registracija oko minut
          </text>
        </g>
      )}
    </svg>
  );
};
