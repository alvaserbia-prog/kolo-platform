// Scena 4 — „Zato KOLO nagrađuje korake kojima raste. Prvi oglas. Potvrdu nekoga koga poznaješ.
// Dovođenje novih članova.“
// Sveska zapisa sa znakom KOLO na koricama. Na „nagrađuje“ se korice otvore; na svaki korak se u
// svesci ispiše red (sličica, rukopis) i udari zeleni pečat. POEN se ne crta kao novac, samo kao zapis.
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { P } from "../paleta";
import { NASLOV, RUKOPIS, SANS } from "../fontovi";
import { Hrapavo, Kadar, Oblik, elipsa, kutija, napredak, useF, usePop } from "../alat";
import { Tegla } from "../predmeti";
import { ZnakKolo } from "./Scena2";
import { kad } from "../vreme";

const X0 = 150;
const X1 = 930;
const Y0 = 480;
const Y1 = 1300;

const Qr: React.FC = () => (
  <g>
    <rect x={-44} y={-44} width={88} height={88} fill="#fff" stroke={P.mastilo} strokeWidth={3} />
    {Array.from({ length: 7 }, (_, i) =>
      Array.from({ length: 7 }, (_, j) => {
        const ugao = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4);
        if (!ugao && random(`qr${i}-${j}`) < 0.5) return null;
        return <rect key={`${i}-${j}`} x={-38 + i * 11} y={-38 + j * 11} width={11} height={11} fill={P.mastilo} />;
      }),
    )}
  </g>
);

const MaloKolo: React.FC<{ p: number }> = ({ p }) => (
  <g>
    <ellipse rx={40} ry={16} cy={10} fill="none" stroke={P.mastiloSvetlo} strokeWidth={3} />
    {Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 40} cy={10 + Math.sin(a) * 16 - 14} r={9} fill={P.oker} stroke={P.mastilo} strokeWidth={2.5} />;
    })}
    <circle cx={interpolate(p, [0, 1], [70, 0])} cy={interpolate(p, [0, 1], [-30, 12])} r={10} fill={P.zelena500} stroke={P.zelena900} strokeWidth={3} />
  </g>
);

const MaliTelefon: React.FC = () => (
  <g>
    <Oblik d={kutija(-30, -52, 60, 104, 10)} boja="#2D2A28" debljina={3} tekstura={0.1} />
    <rect x={-24} y={-44} width={48} height={88} rx={5} fill={P.belo} />
    <rect x={-24} y={-44} width={48} height={14} rx={5} fill={P.zelena700} />
    <g transform="translate(0 16)">
      <Tegla vrsta="ajvar" s={0.3} />
    </g>
  </g>
);

const Pecat: React.FC<{ p: number }> = ({ p }) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.5, 1], [1.8, 0.92, 1]);
  return (
    <g transform={`scale(${s}) rotate(-12)`} opacity={Math.min(1, p * 2) * 0.9}>
      <circle r={52} fill="none" stroke={P.zelena700} strokeWidth={6} />
      <circle r={42} fill="none" stroke={P.zelena700} strokeWidth={2.5} />
      <path d="M-22,2 L-6,18 L24,-16" fill="none" stroke={P.zelena700} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <text y={-26} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={11} fill={P.zelena700} letterSpacing={2}>
        KOLO
      </text>
      <text y={38} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={11} fill={P.zelena700} letterSpacing={1.5}>
        UPISANO
      </text>
    </g>
  );
};

const Red: React.FC<{ y: number; f: number; at: number; ikona: React.ReactNode; tekst: string }> = ({ y, f, at, ikona, tekst }) => {
  const pojava = usePop(at, 160, 11);
  const pisanje = napredak(f, at + 4, 22, Easing.linear);
  const pecat = napredak(f, at + 20, 8, Easing.out(Easing.cubic));
  if (f < at) return null;
  return (
    <g>
      <g transform={`translate(${X0 + 100} ${y}) scale(${pojava})`}>
        <Oblik d={elipsa(0, 0, 66, 66)} boja={P.krem} debljina={4} />
        {ikona}
      </g>
      <defs>
        <clipPath id={`pis${y}`}>
          <rect x={X0 + 190} y={y - 60} width={480 * pisanje} height={120} />
        </clipPath>
      </defs>
      <text x={X0 + 190} y={y + 14} clipPath={`url(#pis${y})`} fontFamily={RUKOPIS} fontWeight={700} fontSize={50} fill={P.mastilo}>
        {tekst}
      </text>
      {/* pero koje piše */}
      {pisanje > 0 && pisanje < 1 && (
        <g transform={`translate(${X0 + 190 + 470 * pisanje} ${y + 6 + Math.sin(f * 1.7) * 5}) rotate(35)`}>
          <path d="M0,0 L-6,-18 L6,-18Z" fill={P.mastilo} />
          <Oblik d="M-6,-18 C-14,-70 -4,-120 18,-150 C20,-110 14,-60 6,-18Z" boja={P.belo} debljina={3} tekstura={0} />
        </g>
      )}
      <g transform={`translate(${X1 - 90} ${y})`}>
        <Pecat p={pecat} />
      </g>
    </g>
  );
};

export const Scena4: React.FC = () => {
  const f = useF();
  const kNagradjuje = kad(4, "nagrađuje");
  const kPrvi = kad(4, "Prvi");
  const kPotvrdu = kad(4, "Potvrdu");
  const kDovodjenje = kad(4, "Dovođenje");
  const otvaranje = napredak(f, kNagradjuje - 4, 22, Easing.inOut(Easing.cubic));
  const ulaz = napredak(f, -10, 18, Easing.out(Easing.cubic));
  const korica = Math.cos(Math.PI * otvaranje); // 1 zatvoreno, -1 otvoreno (preklopljeno ulevo)
  const mesto = napredak(f, kDovodjenje + 2, 16);
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#E4CFA2" />
      <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      {/* drveni sto */}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M-20,${i * 230 + 40} C300,${i * 230 + 20} 700,${i * 230 + 60} 1100,${i * 230 + 30}`} stroke={P.drvo} strokeWidth={3} opacity={0.25} fill="none" />
      ))}
      <g transform={`translate(0 ${(1 - ulaz) * 120})`} opacity={ulaz}>
        <Hrapavo lokalno>
          {/* senka i listovi */}
          <rect x={X0 + 10} y={Y0 + 24} width={X1 - X0} height={Y1 - Y0} rx={12} fill={P.senka} opacity={0.3} filter="url(#blur14)" />
          {[3, 2, 1].map((k) => (
            <rect key={k} x={X0 + k * 5} y={Y0 + k * 5} width={X1 - X0} height={Y1 - Y0} rx={10} fill={P.krem} stroke={P.mastiloSvetlo} strokeWidth={2} />
          ))}
          <Oblik d={kutija(X0, Y0, X1 - X0, Y1 - Y0, 10)} boja={P.belo} debljina={4} tekstura={0.18} />
          {/* linije sveske */}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={X0 + 20} x2={X1 - 20} y1={Y0 + 150 + i * 56} y2={Y0 + 150 + i * 56} stroke={P.plava} strokeWidth={1.5} opacity={0.35} />
          ))}
          <line x1={X0 + 180} x2={X0 + 180} y1={Y0 + 10} y2={Y1 - 10} stroke={P.ajvar} strokeWidth={2} opacity={0.5} />
          <text x={(X0 + X1) / 2} y={Y0 + 96} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={60} fill={P.mastilo}>
            Zapisi u KOLU
          </text>
        </Hrapavo>
        <Red y={Y0 + 250} f={f} at={kPrvi - 4} ikona={<MaliTelefon />} tekst="Vesna: domaća zimnica" />
        <Red y={Y0 + 450} f={f} at={kPotvrdu - 4} ikona={<g transform="scale(0.9)"><Qr /></g>} tekst="Milica potvrdila Vesnu" />
        <Red y={Y0 + 650} f={f} at={kDovodjenje - 4} ikona={<MaloKolo p={mesto} />} tekst="Vesna dovela komšiju" />
        {/* korice sa znakom KOLO, okreću se oko levog ruba */}
        {korica > -0.98 && (
          <g transform={`translate(${X0} 0) scale(${korica} 1) translate(${-X0} 0)`}>
            <Hrapavo lokalno>
              <Oblik d={kutija(X0 - 6, Y0 - 6, X1 - X0 + 12, Y1 - Y0 + 12, 14)} boja={korica > 0 ? P.zelena700 : "#D9C9A6"} debljina={5} tekstura={0.35} />
              {korica > 0 && (
                <>
                  <rect x={X0 + 30} y={Y0 + 30} width={X1 - X0 - 60} height={Y1 - Y0 - 60} rx={10} fill="none" stroke={P.zlatna} strokeWidth={4} strokeDasharray="14 8" />
                  <g transform={`translate(${(X0 + X1) / 2} ${Y0 + 320})`}>
                    <ZnakKolo s={0.7} id="znak4" />
                  </g>
                  <text x={(X0 + X1) / 2} y={Y0 + 620} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={64} fill={P.krem}>
                    Zapisi
                  </text>
                </>
              )}
            </Hrapavo>
          </g>
        )}
      </g>
    </Kadar>
  );
};
