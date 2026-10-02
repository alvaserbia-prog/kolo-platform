// Scena 2 — „Ove jeseni je čula za ekolo.rs, učlanila se i na Pijaci stavila teglu.
// Na ovoj pijaci ne dobija dinare, nego ono što joj treba, u razmeni.“
// Telefon sa ekolo.rs; na „učlanila“ dugme se pritisne. Na „Pijaci“ telefon odleti, a kamera se spusti
// na maketu pijace: Radina kartica sleti na tezgu i na njoj pečat BEZ POTVRDE. Na „dinare“ novčanica
// odleti iz kadra; na „treba“ iznad tezge iskoče oblačići sa onim što njoj treba.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { SANS } from "../fontovi";
import { Kamera, Lik, RADA, iso, napredak, useF, usePop } from "../iso";
import { Sijalica, SvetPijace, tezga } from "../svet";
import { Dodir, Dugme, Telefon } from "../telefon";
import { kad, trajanjeF } from "../vreme";

const Novcanica = () => (
  <g>
    <rect x={-70} y={-36} width={140} height={72} rx={6} fill={P.dinar} stroke={P.dinarTamni} strokeWidth={3} />
    <circle cx={-30} cy={0} r={20} fill="none" stroke={P.dinarTamni} strokeWidth={3} />
    <text x={30} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={26} fill={P.dinarTamni}>DIN</text>
  </g>
);

const Oblacic: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g>
    <circle r={58} fill="#fff" stroke={P.mastilo} strokeWidth={4} />
    <path d="M-14,52 L0,80 L14,52 Z" fill="#fff" stroke={P.mastilo} strokeWidth={4} strokeLinejoin="round" />
    <circle r={52} fill="#fff" />
    {children}
  </g>
);

const Hleb = () => (
  <g>
    <path d="M-36,10 Q-40,-26 0,-28 Q40,-26 36,10 Z" fill="#E0A458" stroke="#8A5A2B" strokeWidth={3} />
    <path d="M-18,-18 l8,10 M0,-22 l8,10 M18,-18 l8,10" stroke="#8A5A2B" strokeWidth={3} />
  </g>
);

const Makaze = () => (
  <g>
    <circle cx={-16} cy={16} r={12} fill="none" stroke={P.crvena} strokeWidth={6} />
    <circle cx={16} cy={16} r={12} fill="none" stroke={P.crvena} strokeWidth={6} />
    <path d="M-8,6 L22,-34 M8,6 L-22,-34" stroke={P.mastilo} strokeWidth={6} strokeLinecap="round" />
  </g>
);

export const Scena2: React.FC = () => {
  const f = useF();
  const fClan = kad(2, "učlanila");
  const fPijaci = kad(2, "pijaci");
  const fTeglu = kad(2, "teglu");
  const fDinare = kad(2, "dinare");
  const fTreba = kad(2, "treba");
  const kraj = trajanjeF(2);
  const odlet = napredak(f, fPijaci - 6, fPijaci + 12);
  const pad = napredak(f, fPijaci - 2, fPijaci + 26);
  const r = tezga("rada");
  const [rx, ry] = iso(r.x + 85, r.y + 50, 100);
  const kamX = interpolate(pad, [0, 1], [rx, rx]) + interpolate(f, [fPijaci, kraj], [0, -30], { extrapolateLeft: "clamp" });
  const zum = interpolate(pad, [0, 1], [0.55, 1.3]);
  const pecat = napredak(f, fTeglu + 2, fTeglu + 10);
  const novcanica = napredak(f, fDinare - 4, fDinare + 22);
  const zelje = [usePop(fTreba), usePop(fTreba + 5), usePop(fTreba + 10)];
  const pritisak = Math.sin(Math.PI * napredak(f, fClan, fClan + 8, (x) => x));
  const clan = f > fClan + 4;
  const telPop = usePop(0);
  return (
    <g>
      <rect width={1080} height={1920} fill={P.nebo} />
      {f >= fPijaci - 10 && (
        <g opacity={napredak(f, fPijaci - 10, fPijaci + 4)}>
          <Kamera x={kamX} y={ry + 60} z={zum} cy={760}>
            <SvetPijace pecatRada={pecat} kartice vidljive={(id) => (id === "rada" ? 1 : 1)} />
            <g transform={`translate(${iso(r.x + 250, r.y + 20).join(",")})`}>
              <Lik {...RADA} s={1.2} okrenut={-1} />
            </g>
          </Kamera>
        </g>
      )}
      {/* telefon */}
      {odlet < 1 && (
        <g transform={`translate(${540 + odlet * 700},${760 - odlet * 300}) rotate(${odlet * 30}) scale(${telPop * (1 - odlet * 0.5)})`}>
          <Telefon s={1.25}>
            <text x={0} y={-150} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={P.mastilo}>Pijaca</text>
            <text x={0} y={-100} textAnchor="middle" fontFamily={SANS} fontWeight={500} fontSize={24} fill={P.mastiloSvetlo}>Nudiš ono što imaš.</text>
            <text x={0} y={-70} textAnchor="middle" fontFamily={SANS} fontWeight={500} fontSize={24} fill={P.mastiloSvetlo}>Dobiješ ono što ti treba.</text>
            {clan ? (
              <g>
                <circle cx={0} cy={60} r={50} fill={P.zelena500} />
                <path d="M-22,60 l14,16 l30,-34" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <text x={0} y={160} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={P.zelena700}>Dobro došla, Rada!</text>
              </g>
            ) : (
              <Dugme tekst="Učlani se" y={60} pritisak={pritisak} />
            )}
            <Dodir x={0} y={60} p={napredak(f, fClan - 2, fClan + 12, (x) => x)} />
          </Telefon>
        </g>
      )}
      {/* dinar odlazi, dolazi ono što joj treba */}
      {novcanica > 0 && novcanica < 1 && (
        <g transform={`translate(${540 + novcanica * 700},${560 - novcanica * 260}) rotate(${novcanica * 50})`} opacity={1 - novcanica * 0.6}>
          <Novcanica />
          <path d="M-90,-50 L90,50 M90,-50 L-90,50" stroke={P.crvena} strokeWidth={10} strokeLinecap="round" opacity={napredak(f, fDinare - 4, fDinare + 2)} />
        </g>
      )}
      {[<Sijalica key="s" s={0.95} svetli={1} />, <Hleb key="h" />, <Makaze key="m" />].map((x, i) =>
        zelje[i] > 0 ? (
          <g key={i} transform={`translate(${270 + i * 270},${360 + (i % 2) * 50}) scale(${1.25 * zelje[i]})`}>
            <Oblacic>
              <g transform={i === 0 ? "translate(0,30)" : ""}>{x}</g>
            </Oblacic>
          </g>
        ) : null,
      )}
    </g>
  );
};
