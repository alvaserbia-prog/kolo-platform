// Scene 13–16: KOLO. 13) školjka skače iz ruke u ruku (novac kruži), pa je precrtana: POEN ne kruži;
// 14) knjiga zapisa: ko je šta dao; 15) Milica daje teglu ajvara komšinici i tek tada se upiše red;
// 16) „Imaš nešto da ponudiš?“: Milica, telefon sa prvim oglasom, znak KOLO i ekolo.rs.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { NASLOV, RUKOPIS, SANS, SERIF } from "../fontovi";
import { Hrapavo, Kadar, Linija, Oblik, Pop, kutija, mesaj, napredak, useF, usePop } from "../alat";
import { KOMSIJA, KOMSINICA, Lik, MILICA, MLADIC1, MUZ } from "../likovi";
import { Hleb, Telefon, EkranOglas, Tegla } from "../predmeti";
import { Kuce, Ulica } from "../pozadine";
import { Zastavice } from "../kolo";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { KnjigaZapisa, Krcag, Skoljka } from "../drevno";

const Toplo: React.FC = () => (
  <Hrapavo>
    <Ulica nebo="#F1C98A" />
    <circle cx={540} cy={560} r={520} fill="url(#toplaSvetlost)" />
    <Kuce y={900} s={0.45} n={7} x0={-120} razmak={220} svetlo={0.6} />
    <Zastavice x0={-40} x1={1120} y={420} ugib={70} n={14} />
  </Hrapavo>
);

// ── Scena 13 — „POEN ne kruži od čoveka do čoveka kao novac.“ ─────────────────────
const RED = [MUZ, KOMSINICA, KOMSIJA, MLADIC1];
const RX = [150, 410, 670, 930];
export const Scena13: React.FC = () => {
  const f = useF();
  const kOd = kad(13, "od");
  const kNov = kad(13, "novac.");
  // školjka skače od prvog do poslednjeg, tri skoka do „novac“
  const t = interpolate(f, [kOd - 16, kNov - 2], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = Math.min(2, Math.floor(t));
  const u = t - k;
  const sx = mesaj(RX[k] + 60, RX[k + 1] - 60, u);
  const sy = 830 - Math.sin(u * Math.PI) * 170;
  const x = napredak(f, kNov - 2, 10);
  const sivo = interpolate(f, [kNov - 2, kNov + 10], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Kadar>
      <Toplo />
      {RED.map((p, i) => (
        <Lik key={i} x={RX[i]} y={1300} s={0.66} okreni={i % 2 === 1} {...p} glava={{ ...p.glava, izraz: "osmeh", pogled: [i % 2 ? -4 : 4, -2] }} dr={[80, 30]} lr={[-60, -30]} />
      ))}
      {/* putanja: lukovi od ruke do ruke */}
      {[0, 1, 2].map((i) => (
        <Linija key={i} d={`M${RX[i] + 60},830 Q${(RX[i] + RX[i + 1]) / 2},640 ${RX[i + 1] - 60},830`} boja={P.mastilo} debljina={4} napredak={Math.min(1, Math.max(0, t - i))} opacity={0.5} />
      ))}
      <g transform={`translate(${sx} ${sy}) rotate(${t * 220})`}>
        <Skoljka s={1.1} />
      </g>
      <rect width={1080} height={1920} fill="#EAD9B2" opacity={sivo} />
      {x > 0 && (
        <g>
          <Linija d="M180,560 L900,1060" boja={P.ajvar} debljina={22} napredak={x} />
          <Linija d="M900,560 L180,1060" boja={P.ajvar} debljina={22} napredak={napredak(f, kNov + 4, 10)} />
        </g>
      )}
    </Kadar>
  );
};

// ── Scena 14 — „POEN je zapis o tome ko je šta dao.“ ─────────────────────────────
const REDOVI = [
  { ko: "Milica", sta: "dala teglu ajvara" },
  { ko: "Zoran", sta: "popravio struju" },
  { ko: "Ana", sta: "čuvala decu" },
  { ko: "Petar", sta: "pozajmio bušilicu" },
  { ko: "Vesna", sta: "ispekla hleb" },
  { ko: "Lazar", sta: "pokosio travu" },
];
export const Scena14: React.FC = () => {
  const f = useF();
  const kZap = kad(14, "zapis");
  const kDao = kad(14, "dao.");
  const knjiga = usePop(-2, 150, 12);
  const korak = (kDao + 20 - kZap) / REDOVI.length;
  return (
    <Kadar>
      <Toplo />
      <rect width={1080} height={1920} fill="#F3E3BC" opacity={0.55} />
      <g transform={`translate(540 760) scale(${0.62 + 0.4 * knjiga}) rotate(${(1 - knjiga) * -6})`}>
        <KnjigaZapisa redovi={REDOVI} napredak={REDOVI.map((_, i) => napredak(f, kZap - 4 + i * korak, korak * 1.1))} />
      </g>
    </Kadar>
  );
};

// ── Scena 15 — „Taj zapis nastaje tek kad neko nešto da.“ ─────────────────────────
export const Scena15: React.FC = () => {
  const f = useF();
  const kNes = kad(15, "nešto");
  const kDa = kad(15, "da.");
  const t = napredak(f, kNes - 10, kDa - kNes + 12);
  const upis = napredak(f, kDa + 2, 22);
  const kursor = Math.floor(f / 10) % 2 === 0 && upis === 0;
  const tx = mesaj(330, 720, t);
  const ty = mesaj(870, 870, t) - Math.sin(t * Math.PI) * 120;
  const od = "Milica → Ana";
  const sta = "tegla ajvara";
  return (
    <Kadar>
      <Toplo />
      <Lik x={220} y={1300} s={0.88} {...MILICA} glava={{ ...MILICA.glava, izraz: "srecna", pogled: [5, 0] }} dr={[mesaj(80, 40, t), 30]} lr={[10, 10]} />
      <Lik x={860} y={1300} s={0.88} okreni {...KOMSINICA} glava={{ ...KOMSINICA.glava, izraz: t > 0.8 ? "srecna" : "osmeh", pogled: [5, 0] }} dr={[mesaj(40, 80, t), 30]} lr={[10, 10]} />
      <g transform={`translate(${tx} ${ty})`}>
        <Tegla vrsta="ajvar" s={1.1} />
      </g>
      {/* list zapisa: prazan dok se ne da, pa se upiše red */}
      <g transform="translate(540 330)">
        <Oblik d={kutija(-330, -130, 660, 270, 14)} boja={P.belo} debljina={4} tekstura={0.18} />
        <text x={-296} y={-80} fontFamily={SANS} fontWeight={900} fontSize={28} fill={P.zelena700} letterSpacing={4}>
          ZAPIS U KOLU
        </text>
        <line x1={-300} y1={-62} x2={300} y2={-62} stroke={P.zelena700} strokeWidth={2} opacity={0.5} />
        <text x={-296} y={0} fontFamily={SERIF} fontWeight={700} fontSize={50} fill={P.mastilo}>
          {od.slice(0, Math.ceil(od.length * Math.min(1, upis * 2)))}
          {kursor ? "|" : ""}
        </text>
        <text x={-296} y={84} fontFamily={RUKOPIS} fontWeight={700} fontSize={58} fill={P.zelena700}>
          {upis > 0.5 ? sta.slice(0, Math.ceil(sta.length * Math.min(1, (upis - 0.5) * 2))) : ""}
        </text>
      </g>
    </Kadar>
  );
};

// ── Scena 16 — „Imaš nešto da ponudiš? Postavi svoj prvi oglas na ekolo.rs.“ ─────────
export const Scena16: React.FC = () => {
  const f = useF();
  const kIm = kad(16, "Imaš");
  const kPost = kad(16, "Postavi");
  const kOgl = kad(16, "oglas");
  const kAdr = kad(16, "ekolo.rs.");
  const tel = usePop(kPost - 6, 150, 11);
  const kraj = napredak(f, kAdr - 6, 14);
  const znak = usePop(kAdr - 4, 120, 11);
  const adresa = usePop(kAdr + 2, 150, 10);
  const misli = [<Tegla key="t" vrsta="ajvar" s={0.75} />, <g key="h" transform="scale(0.8)"><Hleb /></g>, <Krcag key="k" s={0.55} />];
  return (
    <Kadar>
      <Toplo />
      <g opacity={1 - kraj}>
        <Lik x={240} y={1300} s={0.92} {...MILICA} glava={{ ...MILICA.glava, izraz: f >= kPost ? "srecna" : "zamisljena", pogled: [4, -3] }} dr={f >= kPost ? [60, 50] : [150, 40]} lr={[10, 10]} />
        {/* misli: šta imam da ponudim */}
        {f < kPost &&
          misli.map((m, i) => (
            <Pop key={i} at={kIm + i * 6} x={360 + i * 200} y={420 - (i % 2) * 60}>
              <Oblik d="M-90,0 C-100,-60 -40,-100 0,-90 C50,-110 110,-60 96,0 C110,60 50,100 0,90 C-50,104 -104,60 -90,0Z" boja={P.belo} debljina={4} tekstura={0.1} />
              <g transform="translate(0 40)">{m}</g>
            </Pop>
          ))}
        {f < kPost && (
          <g opacity={0.8}>
            <circle cx={300} cy={620} r={14} fill={P.belo} stroke={P.mastilo} strokeWidth={3} />
            <circle cx={330} cy={560} r={20} fill={P.belo} stroke={P.mastilo} strokeWidth={3} />
          </g>
        )}
        {f >= kPost - 6 && (
          <g transform={`translate(700 760) scale(${tel * 1.25}) rotate(${(1 - tel) * 12 + 4})`}>
            <Telefon>
              <EkranOglas faza={napredak(f, kPost, 10)} slovaNaslova={interpolate(f, [kPost + 4, kOgl], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} objavljen={napredak(f, kOgl + 6, 14)} />
            </Telefon>
          </g>
        )}
      </g>
      {kraj > 0 && (
        <g>
          <rect width={1080} height={1920} fill="#EFE2C2" opacity={kraj * 0.85} />
          <g transform="translate(540 520)">
            {Array.from({ length: 18 }, (_, i) => (
              <path key={i} d="M0,-260 L22,-560 L-22,-560Z" fill={P.zlatna} opacity={0.45 * kraj} transform={`rotate(${i * 20 + f * 0.4})`} />
            ))}
            <circle r={420} fill="url(#toplaSvetlost)" opacity={kraj} />
            <g transform={`scale(${znak * 0.72}) rotate(${(1 - znak) * -20})`}>
              <ZnakKolo id="znak16" />
            </g>
          </g>
          <g transform={`translate(540 940) scale(${adresa})`}>
            <Hrapavo lokalno>
              <text textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={160} fill={P.zelena700} letterSpacing={-2}>
                ekolo.rs
              </text>
            </Hrapavo>
          </g>
        </g>
      )}
    </Kadar>
  );
};
