// Scene 8–12: ista svrha i zajednička mana. 8) žito, so i školjke na polici; svako se prima u
// razmeni za krčag, platno, ribu; 9) ispod sve tri stvari pukne polica (mana); 10) merač vrednosti
// pada dok gomila školjki raste; 11) suša: prazna vreća, grnčarka i tkalja nemaju čime da razmene;
// 12) brodovi dovezu školjke, gomila na obali raste, merač vrednosti padne.
import React from "react";
import { interpolate, random } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Linija, Oblik, Pop, kutija, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { kad } from "../vreme";
import { Amole, Brod, D, GRNCAR, Klas, Krcag, Merac, More, NeboTlo, NizSkoljki, Platno, PraznaVreca, Riba, Skoljka, Sunce, TKALJA, TRGOVAC, Vreca } from "../drevno";
import { Strelica } from "./zajednicko";

const X3 = [220, 540, 860];

/** Polica sa tri stvari (žito, so, školjke); `pukla` 0–1 crta pukotinu, `ljulja` njiše stvari. */
export const Polica: React.FC<{ y: number; pukla?: number; ljulja?: number; f: number }> = ({ y, pukla = 0, ljulja = 0, f }) => {
  const nj = Math.sin(f * 0.7) * 6 * ljulja;
  return (
    <g>
      <Oblik d={kutija(60, y, 960, 36, 6)} boja={P.drvo} debljina={4} />
      <Oblik d={`M110,${y + 36} L140,${y + 120} L170,${y + 36}Z`} boja={P.drvoTamno} debljina={3} />
      <Oblik d={`M910,${y + 36} L940,${y + 120} L970,${y + 36}Z`} boja={P.drvoTamno} debljina={3} />
      {pukla > 0 && (
        <g>
          <Linija d={`M70,${y - 30} L170,${y + 60} L250,${y - 20} L350,${y + 70} L440,${y - 10} L540,${y + 80} L640,${y - 10} L730,${y + 70} L830,${y - 20} L920,${y + 60} L1010,${y - 30}`} boja={P.mastilo} debljina={20} napredak={pukla} />
          <Linija d={`M70,${y - 30} L170,${y + 60} L250,${y - 20} L350,${y + 70} L440,${y - 10} L540,${y + 80} L640,${y - 10} L730,${y + 70} L830,${y - 20} L920,${y + 60} L1010,${y - 30}`} boja={P.ajvar} debljina={11} napredak={pukla} />
        </g>
      )}
      <g transform={`translate(${X3[0]} ${y}) rotate(${nj})`}>
        <Vreca s={0.62} />
      </g>
      <g transform={`translate(${X3[1]} ${y - 20}) rotate(${-nj})`}>
        <Amole s={1.2} />
        <g transform="translate(0 -40)">
          <Amole s={1.2} />
        </g>
      </g>
      <g transform={`translate(${X3[2]} ${y - 70}) rotate(${nj})`}>
        <NizSkoljki n={6} s={1.1} />
      </g>
    </g>
  );
};

// ── Scena 8 — „Sva ova sredstva imala su istu svrhu: da ih ljudi prime u razmeni.“ ──
export const Scena8: React.FC = () => {
  const f = useF();
  const kSvr = kad(8, "svrhu:");
  const kPri = kad(8, "prime");
  const kRaz = kad(8, "razmeni.");
  const roba = [<Krcag key="k" s={0.8} />, <Platno key="p" s={0.9} />, <Riba key="r" s={1} />];
  return (
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill="#EAD9B2" />
        <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <Polica y={560} f={f} />
      {/* svaka stvar se prima u razmeni za nešto drugo */}
      {X3.map((x, i) => {
        const t = napredak(f, kPri - 4 + i * 5, 14);
        return (
          <g key={i}>
            <Pop at={kSvr + i * 6} x={x} y={1080}>
              <g transform={i === 0 ? "translate(0 60)" : ""}>{roba[i]}</g>
            </Pop>
            <Strelica x1={x - 40} y1={680} x2={x - 40} y2={960} luk={0} napredak={t} boja={P.zelena700} debljina={7} />
            <Strelica x1={x + 40} y1={960} x2={x + 40} y2={680} luk={0} napredak={napredak(f, kRaz - 6 + i * 4, 12)} boja={P.zelena700} debljina={7} />
          </g>
        );
      })}
    </Kadar>
  );
};

// ── Scena 9 — „Ali su imala jednu zajedničku manu.“ ───────────────────────────────
export const Scena9: React.FC = () => {
  const f = useF();
  const kZaj = kad(9, "zajedničku");
  const kMan = kad(9, "manu.");
  const pukla = napredak(f, kZaj + 6, 22);
  const mrak = interpolate(f, [kZaj - 6, kMan + 6], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill="#EAD9B2" />
        <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <rect width={1080} height={1920} fill="#3A2A1D" opacity={mrak} />
      <circle cx={540} cy={700} r={560} fill="url(#toplaSvetlost)" opacity={mrak * 2} />
      <g transform="translate(0 260)">
        <Polica y={600} pukla={pukla} ljulja={pukla} f={f} />
      </g>
    </Kadar>
  );
};

// ── Scena 10 — „Njihova vrednost je zavisila od toga koliko ih ima.“ ──────────────
/** Gomila od `n` školjki (dno u 0,0). */
const GomilaSkoljki: React.FC<{ n: number; w?: number; seed?: string }> = ({ n, w = 300, seed = "s" }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const red = Math.floor(Math.sqrt(i * 2.2));
      const t = random(`${seed}${i}`) * 2 - 1;
      const sir = w * Math.max(0.15, 1 - red * 0.11);
      return (
        <g key={i} transform={`translate(${(t * sir).toFixed(1)} ${(-20 - red * 22 - random(`${seed}y${i}`) * 10).toFixed(1)})`}>
          <Skoljka s={0.55} rot={random(`${seed}r${i}`) * 180} ledja={i % 3 === 0} />
        </g>
      );
    })}
  </g>
);

export const Scena10: React.FC = () => {
  const f = useF();
  const kVr = kad(10, "vrednost");
  const kKol = kad(10, "koliko");
  const kIma = kad(10, "ima.");
  const raste = napredak(f, kKol - 4, kIma - kKol + 18);
  const n = Math.round(1 + raste * 90);
  const nivo = interpolate(raste, [0, 1], [0.92, 0.14]);
  return (
    <Kadar>
      <Hrapavo>
        <rect width={1080} height={1920} fill="#EAD9B2" />
        <Oblik d={kutija(-40, 1100, 1160, 300, 0)} boja={P.drvoSvetlo} tekstura={0.3} />
      </Hrapavo>
      <Pop at={kVr - 4} x={830} y={1090}>
        <Merac nivo={nivo} h={720} crveno={raste > 0.6 ? 1 : 0} />
      </Pop>
      <g transform="translate(380 1150)">
        {raste <= 0 ? (
          <g transform="translate(0 -160)">
            <circle r={150} fill="url(#toplaSvetlost)" />
            <Oblik d={kutija(-110, 60, 220, 50, 20)} boja={P.ajvar} debljina={3.5} />
            <Skoljka s={2.2} rot={-15} />
          </g>
        ) : (
          <GomilaSkoljki n={n} w={300} />
        )}
      </g>
      {raste > 0.25 && (
        <Strelica x1={830} y1={360} x2={830} y2={720} luk={0} napredak={napredak(f, kKol + 6, 16)} boja={P.ajvar} debljina={10} />
      )}
    </Kadar>
  );
};

// ── Scena 11 — „Kad žetva podbaci, žita nema, i ljudi nemaju čime da razmene ono što imaju da ponude.“ ──
export const Scena11: React.FC = () => {
  const f = useF();
  const kPod = kad(11, "podbaci,");
  const kNema = kad(11, "nema,");
  const kLj = kad(11, "ljudi");
  const kPon = kad(11, "ponude.");
  const uveo = napredak(f, kPod - 6, 20);
  const ljudi = napredak(f, kLj - 10, 14);
  const pitanje = napredak(f, kPon - 10, 10);
  return (
    <Kadar>
      <Hrapavo>
        <NeboTlo nebo="#F2D59A" tlo="#C9A56A" horizont={780} />
        <Sunce x={800} y={300} r={95} boja="#F0A63C" zraci={f * 0.4} />
        {/* ispucala zemlja */}
        {Array.from({ length: 14 }, (_, i) => (
          <Linija key={i} d={`M${(i * 83) % 1080},${820 + ((i * 47) % 400)} l${30 + (i % 3) * 20},${16} l${-10},${30} l${40},${10}`} debljina={3} opacity={0.45} />
        ))}
      </Hrapavo>
      <g opacity={1 - ljudi * 0.55}>
        {Array.from({ length: 18 }, (_, i) => (
          <g key={i} transform={`translate(${-20 + i * 64 + ((i * 17) % 20)} ${800 + (i % 3) * 18})`}>
            <Klas h={160 + ((i * 41) % 40)} uveo={uveo} nagib={((i * 29) % 14) - 7} />
          </g>
        ))}
      </g>
      <Pop at={kNema - 4} x={540} y={1010}>
        <PraznaVreca s={1.1} />
      </Pop>
      {ljudi > 0 && (
        <g opacity={ljudi}>
          <Lik x={200} y={1300} s={0.82} {...GRNCAR} glava={{ ...GRNCAR.glava, izraz: pitanje > 0.5 ? "tuzna" : "zamisljena", pogled: [5, 0] }} dr={[70, 30]} lr={[10, 10]} />
          <g transform="translate(330 1040)">
            <Krcag s={0.7} />
          </g>
          <Lik x={880} y={1300} s={0.82} okreni {...TKALJA} glava={{ ...TKALJA.glava, izraz: pitanje > 0.5 ? "tuzna" : "zamisljena", pogled: [5, 0] }} dr={[70, 30]} lr={[10, 10]} />
          <g transform="translate(750 990)">
            <Platno s={0.8} />
          </g>
        </g>
      )}
      {pitanje > 0 && (
        <g>
          {[240, 840].map((x, i) => (
            <Pop key={x} at={kPon - 10 + i * 4} x={x} y={560}>
              <text textAnchor="middle" fontFamily="'Playfair Display', serif" fontWeight={900} fontSize={170} fill={P.ajvar}>
                ?
              </text>
            </Pop>
          ))}
        </g>
      )}
    </Kadar>
  );
};

// ── Scena 12 — „Kad su trgovci brodovima dovezli velike količine školjki, njihova vrednost je drastično pala.“ ──
export const Scena12: React.FC = () => {
  const f = useF();
  const kBr = kad(12, "brodovima");
  const kDov = kad(12, "dovezli");
  const kKol = kad(12, "količine");
  const kVr = kad(12, "vrednost");
  const kPala = kad(12, "pala.");
  const brod = napredak(f, kBr - 20, kDov - kBr + 16);
  const gomila = napredak(f, kDov, kVr - kDov);
  const pad = napredak(f, kPala - 14, 16);
  const merac = napredak(f, kVr - 8, 12);
  return (
    <Kadar>
      <Hrapavo>
        <NeboTlo nebo="#BFD4D6" tlo={D.pesak} horizont={760} />
        <Sunce x={180} y={250} r={60} zraci={f * 0.3} />
      </Hrapavo>
      <More y={760} f={f} />
      <Hrapavo>
        <Oblik d="M-200,1080 C100,1000 400,1020 700,1060 C900,1080 1100,1060 1280,1040 L1280,1400 L-200,1400Z" boja={D.pesak} />
      </Hrapavo>
      <g transform={`translate(${mesaj(1400, 760, brod)} ${1000 + Math.sin(f * 0.12) * 6}) rotate(${Math.sin(f * 0.1) * 1.5})`}>
        <Brod s={0.62} />
      </g>
      {f >= kDov - 6 && (
        <g transform={`translate(${mesaj(1000, 560, napredak(f, kDov - 6, 14))} 1290)`}>
          <Lik x={0} y={0} s={0.8} okreni {...TRGOVAC} glava={{ ...TRGOVAC.glava, izraz: "osmeh", pogled: [5, 0] }} dr={[60, 40]} lr={[40, 40]} />
        </g>
      )}
      {/* gomila školjki na obali */}
      <g transform="translate(250 1250)">
        <GomilaSkoljki n={Math.round(gomila * 120)} w={240} seed="obala" />
      </g>
      {f >= kKol && gomila < 1 && (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`translate(${520 - ((f * 9 + i * 40) % 260)} ${1060 + ((f * 4 + i * 23) % 120)})`}>
              <Skoljka s={0.5} rot={i * 40 + f * 4} />
            </g>
          ))}
        </g>
      )}
      {merac > 0 && (
        <g transform={`translate(930 ${1200}) scale(${0.55 * merac})`}>
          <Merac nivo={interpolate(pad, [0, 1], [0.9, 0.06])} h={720} crveno={pad > 0.4 ? 1 : 0} />
        </g>
      )}
      {pad > 0.3 && <Strelica x1={820} y1={620} x2={820} y2={900} luk={0} napredak={napredak(f, kPala - 6, 12)} boja={P.ajvar} debljina={10} />}
    </Kadar>
  );
};
