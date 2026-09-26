// Scena 2 — puna kuća (sećanje, topli tonovi). Mlađa Milica meša ajvar u velikom loncu;
// na „Njena porodica“ kamera klizne udesno do dugog stola: muž i troje dece posežu za ajvarom.
// Na „ajvar, turšija, pekmez, sokovi“ tegle uskaču u prvi plan, na „Po bakinom receptu“
// uleti list iz bakine sveske, na „bez konzervansa“ se udari pečat.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { RUKOPIS, NASLOV } from "../fontovi";
import { Hrapavo, Kadar, Kamera, Linija, Oblik, Pop, kutija, napredak, useF, usePop } from "../alat";
import { Kuhinja } from "../pozadine";
import { Hleb, Lonac, Paprika, Sporet, Sto, Tanjir, Tegla } from "../predmeti";
import { CERKA, Lik, MILICA, MUZ, SIN } from "../likovi";
import { kad } from "../vreme";

const MLADA = { ...MILICA, glava: { ...MILICA.glava, bojaKose: P.kosaSmedja, izraz: "srecna" as const } };

export const Secanje: React.FC<{ jacina?: number }> = ({ jacina = 1 }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#F2A94E" opacity={0.22 * jacina} style={{ mixBlendMode: "soft-light" }} />
    <rect x={0} y={0} width={1080} height={1920} fill="#FFE6B0" opacity={0.12 * jacina} style={{ mixBlendMode: "screen" }} />
    <radialGradient id="secVinjeta" cx="50%" cy="45%" r="70%">
      <stop offset="0.6" stopColor="#6B4420" stopOpacity="0" />
      <stop offset="1" stopColor="#6B4420" stopOpacity={0.45 * jacina} />
    </radialGradient>
    <rect x={0} y={0} width={1080} height={1920} fill="url(#secVinjeta)" />
  </g>
);

const Porodica: React.FC<{ f: number; poseg: number }> = ({ f, poseg }) => (
  <g>
    {/* zid trpezarije: slike na zidu, kredenac */}
    <g transform="translate(1700 520)">
      <Oblik d={kutija(-80, -100, 160, 200, 6)} boja={P.drvo} />
      <Oblik d={kutija(-64, -84, 128, 168, 4)} boja="#E8D9B8" />
      <circle cx={-14} cy={-10} r={26} fill={P.kosaSmedja} opacity={0.5} />
      <circle cx={22} cy={0} r={22} fill={P.kosaSeda} opacity={0.6} />
    </g>
    <g transform="translate(2150 480)">
      <Oblik d={kutija(-70, -70, 140, 140, 70)} boja={P.drvo} />
      <Oblik d={kutija(-56, -56, 112, 112, 56)} boja="#E8D9B8" />
      <path d="M-30,20 C-20,-20 20,-20 30,20" stroke={P.zelenaTamna} strokeWidth={6} fill="none" />
    </g>
    {/* ukućani iza stola */}
    <Lik x={1600} y={1330} s={0.95} {...MUZ} glava={{ ...MUZ.glava, bojaKose: P.kosaSedaTamna, izraz: "srecna" }} lr={[20, 20]} dr={[40 + poseg * 30, 40 - poseg * 10]} />
    <Lik x={1850} y={1260} s={0.8} {...SIN} glava={{ ...SIN.glava, izraz: "osmeh", pogled: [0.6, 0.4] }} lr={[10, 20]} dr={[30 + poseg * 45, 30]} />
    <Lik x={2060} y={1250} s={0.78} {...CERKA} glava={{ ...CERKA.glava, izraz: "srecna" }} lr={[-40 - poseg * 30, -30]} dr={[-10, -10]} />
    <Lik x={2260} y={1180} s={0.62} {...SIN} glava={{ ...SIN.glava, bojaKose: P.kosaRida, izraz: "srecna", seed: 9 }} lr={[-50 - poseg * 50, -30]} dr={[20, 10]} />
    {/* sto */}
    <g transform="translate(1940 1140)">
      <Sto w={980} h={300} />
      <g transform="translate(-300 0)">
        <Tanjir hrana />
      </g>
      <g transform="translate(-110 4)">
        <Tanjir hrana />
      </g>
      <g transform="translate(110 2)">
        <Tanjir hrana />
      </g>
      <g transform="translate(300 4)">
        <Tanjir hrana />
      </g>
      <g transform={`translate(0 -4) rotate(${Math.sin(f / 9) * 1.5})`}>
        <Tegla vrsta="ajvar" natpis="ajvar" s={0.9} />
      </g>
      <g transform="translate(-200 0)">
        <Hleb />
      </g>
      <g transform="translate(200 -2)">
        <Tegla vrsta="tursija" s={0.75} />
      </g>
    </g>
  </g>
);

const RED: { rec: string; vrsta: "ajvar" | "tursija" | "pekmez" | "sok"; natpis: string; flasa?: boolean }[] = [
  { rec: "ajvar", vrsta: "ajvar", natpis: "ajvar" },
  { rec: "turšija", vrsta: "tursija", natpis: "turšija" },
  { rec: "pekmez", vrsta: "pekmez", natpis: "pekmez" },
  { rec: "sokovi", vrsta: "sok", natpis: "sok", flasa: true },
];

const Recept: React.FC<{ f: number; kBez: number }> = ({ f, kBez }) => {
  const pecat = usePop(kBez + 4, 260, 8);
  return (
    <g>
      <Oblik d="M-300,-250 L300,-262 L312,250 L-292,262Z" boja="#F4E6C4" debljina={4} tekstura={0.35} />
      {[-160, -100, -40, 20, 80, 140, 200].map((yy) => (
        <line key={yy} x1={-260} y1={yy} x2={270} y2={yy - 6} stroke={P.plava} strokeWidth={2} opacity={0.35} />
      ))}
      <line x1={-220} y1={-240} x2={-210} y2={250} stroke={P.ajvar} strokeWidth={2} opacity={0.5} />
      <text x={20} y={-190} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={66} fill={P.mastilo} transform="rotate(-1.2)">
        Bakin ajvar
      </text>
      {["paprike babure", "patlidžan", "ulje, so, malo šećera", "peći, ljuštiti, mešati…"].map((t, i) => (
        <text key={t} x={-190} y={-116 + i * 60} fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.mastiloSvetlo} transform="rotate(-1.2)">
          {t}
        </text>
      ))}
      <g transform="translate(200 120) rotate(20)">
        <Paprika s={0.8} />
      </g>
      {f >= kBez + 4 && (
        <g transform={`translate(-40 170) rotate(-10) scale(${1.6 - 0.6 * pecat})`} opacity={Math.min(1, pecat * 2) * 0.9}>
          <rect x={-230} y={-48} width={460} height={96} rx={12} fill="none" stroke={P.ajvar} strokeWidth={7} />
          <text x={0} y={16} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontStyle="italic" fontSize={50} fill={P.ajvar}>
            bez konzervansa
          </text>
        </g>
      )}
    </g>
  );
};

export const Scena2: React.FC = () => {
  const f = useF();
  const kNjena = kad(2, "Njena");
  const kPo = kad(2, "Po");
  const kBez = kad(2, "bez");
  const pan = napredak(f, kNjena - 10, 30, Easing.inOut(Easing.cubic));
  const cx = interpolate(pan, [0, 1], [430, 1940]) + interpolate(f, [0, kNjena], [0, 40], { extrapolateRight: "clamp" });
  const z = interpolate(pan, [0, 1], [1.45, 1.22]) + interpolate(f, [kNjena + 20, kPo], [0, 0.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(pan, [0, 1], [1010, 1000]);
  const poseg = napredak(f, kad(2, "uživala") - 4, 24);
  const recept = usePop(kPo - 6, 120, 13);
  const odlaziRed = napredak(f, kPo - 10, 14);
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={cx} y={cy} z={z}>
          <Kuhinja sezona="leto" />
          {/* šporet i lonac */}
          <g transform="translate(250 1300)">
            <Sporet />
            <g transform="translate(0 -330)">
              <Lonac s={0.9} para mesanje={f / 45} />
            </g>
          </g>
          <g transform="translate(610 1080)">
            <Oblik d="M-100,0 C-110,-60 110,-60 100,0 C90,20 -90,20 -100,0Z" boja={P.drvoSvetlo} />
            {[-60, -20, 20, 60, -40, 0, 40].map((xx, i) => (
              <g key={i} transform={`translate(${xx} ${i < 4 ? -20 : -50}) rotate(${xx})`}>
                <Paprika s={0.5} />
              </g>
            ))}
          </g>
          <Lik
            x={470}
            y={1330}
            s={1.05}
            {...MLADA}
            lr={[-58 + Math.sin(f / 7) * 12, -40]}
            dr={[20, 40]}
            glavaNagib={-6}
          />
          <Porodica f={f} poseg={poseg} />
        </Kamera>
      </Hrapavo>
      {/* tegle u prvom planu */}
      <g opacity={1 - odlaziRed} transform={`translate(0 ${odlaziRed * 60})`}>
        <Oblik d={kutija(150, 1236, 780, 30, 6)} boja={P.drvo} />
        {RED.map((r, i) => (
          <Pop key={r.rec} at={kad(2, r.rec) - 2} x={240 + i * 200} y={1240} rot={i % 2 ? 4 : -4}>
            <Tegla vrsta={r.vrsta} natpis={r.flasa ? undefined : r.natpis} flasa={r.flasa} s={1.25} />
          </Pop>
        ))}
      </g>
      {f >= kPo - 6 && (
        <g transform={`translate(540 ${interpolate(recept, [0, 1], [1500, 850])}) rotate(${interpolate(recept, [0, 1], [14, -3])}) scale(${0.8 + 0.2 * recept})`}>
          <Recept f={f} kBez={kBez} />
        </g>
      )}
      <Secanje />
      <Linija d="M0,0" />
    </Kadar>
  );
};
