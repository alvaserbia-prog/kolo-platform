// Video 3 „Potvrda nosi odgovornost“ u papirnom kolažu (kao „Čiji si ti“ i prvi videi serije).
// Tekst od 01.10.2026 (snimak My_recording_61) govori o PRINCIPIMA potvrde, bez bunara:
// pitanje → šta potvrda znači → zašto je osnov poverenja → pravilo → posledice → granica
// odgovornosti → zaključak. Animacije se kače na izgovorene reči (uz prednost iz plana).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../v1k/paleta";
import { Crta, Defs, Isecak, Pop, Pt, krugTacke, napredak, pravougaonik, usePop } from "../v1k/papir";
import { Etiketa, GlavaCfg, Kuca, Osoba, Upitnik } from "../v1k/likovi";
import { Govor, Kapija, Pecat, Srce } from "../v1k/selo";
import { Kolo, LogoZnak, OSOBE } from "../v1k/kolo";
import { Tegla } from "../v1k/prica";
import { EkranPotvrde } from "../v1/stvari";
import { kad } from "../v3/vreme";
import { RUKOPIS, SANS } from "../fontovi";

type L = { boja: string; glava: GlavaCfg };
const BAKA: L = { boja: P.slezova, glava: { frizura: "marama", naocare: true } };
const DOMACIN: L = { boja: P.zelena700, glava: { frizura: "cela", kosa: P.kosaSeda, brkovi: true } };
const SNAJA: L = { boja: P.korala, glava: { frizura: "rep", kosa: P.kosaSmedja } };
const MOMAK: L = { boja: P.nebo, glava: { frizura: "kratka", kosa: P.kosaSmedja } };
const KOMSIJA: L = { boja: P.narandza, glava: { frizura: "kapa", brkovi: true, koza: P.koza2 } };
const DRUG: L = { boja: P.more, glava: { frizura: "kratka", kosa: P.kosaTamna } };
const LJUDI: L[] = [BAKA, MOMAK, SNAJA, DOMACIN, KOMSIJA, DRUG];

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);

const Lik: React.FC<{ l: L; x: number; y: number; s: number; seed: string; osmeh?: number }> = ({ l, x, y, s, seed, osmeh = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Osoba seed={seed} boja={l.boja} glava={{ ...l.glava, osmeh }} />
  </g>
);

const Telefon: React.FC<{ seed: string; children?: React.ReactNode }> = ({ seed, children }) => (
  <g>
    <Isecak pts={pravougaonik(-160, -310, 320, 620)} boja="#2b3a2f" seed={`${seed}-t`} amp={2} />
    <rect x={-134} y={-272} width={268} height={544} rx={18} fill="#FFFDF7" />
    {children}
  </g>
);

/** Neznanac: siva papirna silueta sa upitnikom umesto lica. */
const Neznanac: React.FC<{ seed: string; s?: number; opacity?: number }> = ({ seed, s = 1, opacity = 1 }) => (
  <g transform={`scale(${s})`} opacity={opacity}>
    <Isecak pts={[[-44, 0], [44, 0], [66, 110], [-66, 110]]} boja="#8C877E" seed={`${seed}-t`} />
    <Isecak pts={krugTacke(0, -40, 44, 14)} boja="#A7A298" seed={`${seed}-g`} />
    <text x={0} y={-18} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={70} fill="#fff">
      ?
    </text>
  </g>
);

/** Zelena kvačica u krugu (potvrđen član). */
const Kvacica: React.FC<{ seed: string; r?: number }> = ({ seed, r = 30 }) => (
  <g>
    <Isecak pts={krugTacke(0, 0, r, 14)} boja={P.zelena500} seed={`${seed}-k`} senka="mala" />
    <path d={`M${-r * 0.45},0 L${-r * 0.1},${r * 0.35} L${r * 0.5},${-r * 0.35}`} stroke="#fff" strokeWidth={r * 0.22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

// ── 1 ── Kad nekoga potvrdiš u KOLU, šta to zapravo znači?
export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const kPotvrdis = kad(1, "potvrdiš");
  const kZnaci = kad(1, "znači");
  const tel = usePop(0);
  return (
    <Svg>
      <g transform={`translate(540 860) scale(${tel * 1.25})`}>
        <Telefon seed="s1-tel">
          <EkranPotvrde pseudonim="vera.iz.ulice" kvacica={f >= kPotvrdis - 4 ? 1 : 0} pritisak={napredak(f, kPotvrdis + 2, 8)} gotovo={f >= kPotvrdis + 12 ? 1 : 0} />
        </Telefon>
      </g>
      <Pop at={kZnaci - 4} x={850} y={480} rot={8}>
        <Upitnik seed="s1-up" velicina={1.1} boja={P.zelena700} />
      </Pop>
    </Svg>
  );
};

// ── 2 ── To znači: ovog čoveka lično poznajem.
export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const kOvog = kad(2, "ovog");
  const kLicno = kad(2, "lično");
  return (
    <Svg>
      <Lik l={SNAJA} x={330} y={830} s={2.1} seed="s2-a" />
      <Pop at={kOvog - 4} x={760} y={830} skala={1}>
        <g transform="scale(2.1)">
          <Osoba seed="s2-b" boja={MOMAK.boja} glava={{ ...MOMAK.glava, osmeh: 1 }} />
        </g>
      </Pop>
      <Pop at={kLicno - 4} x={420} y={520}>
        <Govor seed="s2-g" tekst="„Lično ga poznajem.“" velicina={60} rep={-1} />
      </Pop>
      <Pop at={kLicno + 8} x={545} y={940}>
        <Srce seed="s2-sr" r={52} />
      </Pop>
      {f >= kLicno + 14 && (
        <Pop at={kLicno + 14} x={860} y={780}>
          <Kvacica seed="s2-kv" r={44} />
        </Pop>
      )}
    </Svg>
  );
};

// ── 3 ── U KOLU razmenjuješ i sa ljudima koje prvi put vidiš. Kako znaš ko je sa druge strane?
//        Po potvrdi. Potvrda je osnov poverenja.
export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const kRazmenjujes = kad(3, "razmenjuješ");
  const kDruge = kad(3, "druge");
  const kPo = kad(3, "Po");
  const kPotvrda = kad(3, "Potvrda");
  const kOsnov = kad(3, "osnov");
  const smena = napredak(f, kPotvrda - 8, 14);
  const temelj = usePop(kPotvrda - 2);
  const kucaY = interpolate(napredak(f, kOsnov - 10, 14, Easing.out(Easing.bounce)), [0, 1], [-500, 0]);
  return (
    <Svg>
      {smena < 1 && (
        <g opacity={1 - smena}>
          {/* tezga: dve strane stola, razmena tegle */}
          <Isecak pts={pravougaonik(180, 1000, 720, 46)} boja="#C99B62" seed="s3-sto" />
          <Isecak pts={pravougaonik(200, 1046, 30, 160)} boja="#8A5A34" seed="s3-n1" senka="mala" />
          <Isecak pts={pravougaonik(850, 1046, 30, 160)} boja="#8A5A34" seed="s3-n2" senka="mala" />
          <Lik l={BAKA} x={280} y={820} s={1.9} seed="s3-ja" />
          <g transform="translate(800 820) scale(1.9)">{f < kPo + 6 ? <Neznanac seed="s3-on" /> : <Osoba seed="s3-on2" boja={DRUG.boja} glava={{ ...DRUG.glava, osmeh: 1 }} />}</g>
          <Pop at={kRazmenjujes} x={540 + Math.sin(f / 10) * 60} y={950}>
            <g transform="scale(1.2)">
              <Tegla seed="s3-tegla" />
            </g>
          </Pop>
          {f >= kDruge - 4 && f < kPo + 6 && (
            <Pop at={kDruge - 4} x={800} y={540}>
              <Upitnik seed="s3-up" velicina={0.9} boja={P.korala} />
            </Pop>
          )}
          <g transform="translate(820 600) rotate(-8)">
            <Pecat seed="s3-pec" tekst="POTVRĐEN" t={napredak(f, kPo + 4, 10, Easing.out(Easing.cubic))} boja={P.zelena700} velicina={52} />
          </g>
        </g>
      )}
      {smena > 0 && (
        <g opacity={smena}>
          {/* temelj „potvrda“, na njega se spušta kuća „poverenje“ */}
          <g transform={`translate(540 1180) scale(${temelj})`}>
            <Isecak pts={pravougaonik(-330, -70, 660, 140)} boja="#B9B2A5" seed="s3-tem" amp={2} />
            {[-240, -80, 80, 240].map((x, i) => (
              <Isecak key={i} pts={krugTacke(x, 0, 60, 10, 36)} boja={i % 2 ? "#D2CBBE" : "#A39B8D"} seed={`s3-k${i}`} senka="mala" />
            ))}
            <g transform="translate(0 6) rotate(-2)">
              <Etiketa seed="s3-et" tekst="potvrda" velicina={60} boja={P.zelena700} />
            </g>
          </g>
          {f >= kOsnov - 10 && (
            <g transform={`translate(540 ${1110 + kucaY})`}>
              <Kuca seed="s3-kuca" fasada={P.sunce} sirina={480} visina={320} />
              <g transform="translate(0 -170) rotate(-3)">
                <Etiketa seed="s3-et2" tekst="poverenje" velicina={62} />
              </g>
            </g>
          )}
        </g>
      )}
    </Svg>
  );
};

// ── 4 ── Zato potvrđuješ samo one koje lično poznaješ.
export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const kSamo = kad(4, "samo");
  const kLicno = kad(4, "lično");
  const bledi = napredak(f, kLicno - 4, 16);
  const mesta: [number, number][] = [
    [230, 640], [540, 560], [850, 640], [230, 1000], [540, 1080], [850, 1000],
  ];
  const poznati = [0, 2, 4, 5];
  return (
    <Svg>
      <g transform="translate(540 820)">
        <Lik l={DOMACIN} x={0} y={-80} s={2.0} seed="s4-ja" />
      </g>
      {mesta.map(([x, y], i) => {
        const poznat = poznati.includes(i);
        return (
          <Pop key={i} at={kSamo - 6 + i * 3} x={x} y={y}>
            {poznat ? (
              <g>
                <g transform="scale(1.25)">
                  <Osoba seed={`s4-o${i}`} boja={LJUDI[i].boja} glava={{ ...LJUDI[i].glava, osmeh: 1 }} />
                </g>
                {f >= kLicno + 2 + i * 2 && (
                  <g transform="translate(70 -40)">
                    <Kvacica seed={`s4-kv${i}`} r={30} />
                  </g>
                )}
              </g>
            ) : (
              <Neznanac seed={`s4-n${i}`} s={1.25} opacity={1 - bledi * 0.7} />
            )}
          </Pop>
        );
      })}
      {poznati.map((i) => (
        <Crta key={i} pts={[[540, 820], [mesta[i][0], mesta[i][1] + 40]]} seed={`s4-v${i}`} boja={P.zelena500} debljina={7} napredak={napredak(f, kLicno + i * 2, 12)} isprekidana />
      ))}
    </Svg>
  );
};

// ── 5 ── Potvrda nekoga koga ne znaš otvara vrata zloupotrebi i može da ostavi posledice na ceo
//        sistem. Zato nemoj to da radiš.
const MREZA: Pt[] = [
  [200, 560], [540, 500], [880, 560], [300, 860], [640, 820], [920, 920], [180, 1150], [520, 1140], [860, 1220],
];
const VEZE_M: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8]];

export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const kVrata = kad(5, "vrata");
  const kZlo = kad(5, "zloupotrebi");
  const kPosledice = kad(5, "posledice");
  const kSistem = kad(5, "sistem");
  const kZato = kad(5, "Zato");
  const otvor = napredak(f, kVrata - 2, 14);
  const ulaz = napredak(f, kVrata + 6, 26, Easing.inOut(Easing.quad));
  const mreza = napredak(f, kPosledice - 10, 14);
  const ne = napredak(f, kZato - 2, 10, Easing.out(Easing.cubic));
  return (
    <Svg>
      {mreza < 1 && (
        <g opacity={1 - mreza}>
          <g transform="translate(540 1200)">
            <Kapija seed="s5-kap" sirina={420} visina={330} />
          </g>
          {/* vratnice se otvaraju */}
          <g transform={`translate(${540 + 420 * 0.16} 1200) scale(${1 - otvor * 0.85} 1)`}>
            <Isecak pts={[[0, 0], [0, -330 * 0.72], [420 * 0.16, -330 * 0.86], [420 * 0.34 - 6, -330 * 0.72], [420 * 0.34 - 6, 0]]} boja={P.zelena700} seed="s5-vr" amp={1.2} />
          </g>
          {f >= kVrata && (
            <g transform={`translate(${interpolate(ulaz, [0, 1], [700, 560])} ${1010 - ulaz * 40})`}>
              <Neznanac seed="s5-n" s={1.6} />
            </g>
          )}
          {f >= kZlo - 2 && (
            <Pop at={kZlo - 2} x={540} y={600} rot={-4}>
              <Etiketa seed="s5-e" tekst="zloupotreba" boja={P.korala600} velicina={76} />
            </Pop>
          )}
        </g>
      )}
      {mreza > 0 && (
        <g opacity={mreza}>
          {VEZE_M.map(([a, b], i) => {
            const pukla = napredak(f, kSistem - 6 + i * 2, 8);
            return (
              <g key={i}>
                <Crta pts={[MREZA[a], MREZA[b]]} seed={`s5-m${i}`} boja={pukla > 0.5 ? P.korala : P.zelena500} debljina={8} isprekidana={pukla > 0.5} opacity={1 - pukla * 0.3} />
              </g>
            );
          })}
          {MREZA.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y - 70})`}>
              {i === 4 ? (
                <Neznanac seed="s5-nm" s={0.95} />
              ) : (
                <g transform="scale(0.95)">
                  <Osoba seed={`s5-o${i}`} boja={LJUDI[i % 6].boja} glava={{ ...LJUDI[i % 6].glava, osmeh: f >= kSistem ? 0 : 1 }} />
                </g>
              )}
            </g>
          ))}
          {ne > 0 && (
            <g transform={`translate(540 760) scale(${1 + (1 - ne) * 0.8})`} opacity={Math.min(1, ne * 1.5)}>
              <Isecak pts={krugTacke(0, 0, 230, 24)} boja={P.belo} seed="s5-ne-o" />
              <Crta pts={[[-120, -120], [120, 120]]} seed="s5-x1" boja={P.korala600} debljina={34} />
              <Crta pts={[[120, -120], [-120, 120]]} seed="s5-x2" boja={P.korala600} debljina={34} />
            </g>
          )}
        </g>
      )}
    </Svg>
  );
};

// ── 6 ── I ono najbitnije: ako nekoga potvrdiš, ne odgovaraš za sve što će on posle da radi.
//        Odgovaraš samo za to da je on stvarna osoba i da ga poznaješ.
const Kartica: React.FC<{ seed: string; boja: string; tekstBoja: string; naslov: string[]; tekst: string[] }> = ({ seed, boja, tekstBoja, naslov, tekst }) => (
  <g>
    <Isecak pts={pravougaonik(-240, -340, 480, 680)} boja={boja} seed={`${seed}-k`} amp={2} />
    {naslov.map((r, i) => (
      <text key={i} x={0} y={-210 + i * 68} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={58} fill={tekstBoja}>
        {r}
      </text>
    ))}
    <Crta pts={[[-170, -100], [170, -100]]} seed={`${seed}-c`} boja={tekstBoja} debljina={4} opacity={0.5} />
    {tekst.map((r, i) => (
      <text key={i} x={0} y={-10 + i * 74} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={tekstBoja}>
        {r}
      </text>
    ))}
  </g>
);

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const kNajbitnije = kad(6, "najbitnije");
  const kNe = kad(6, "ne");
  const kOdgovaras = kad(6, "Odgovaraš", 2);
  const kPoznajes = kad(6, "poznaješ");
  const desno = napredak(f, kOdgovaras - 4, 14);
  const naslov = usePop(kNajbitnije - 6);
  return (
    <Svg>
      {f < kNe - 4 && (
        <g transform={`translate(540 860) rotate(-3) scale(${naslov})`}>
          <Isecak pts={pravougaonik(-380, -110, 760, 220)} boja={P.zlatna400} seed="s6-nb" amp={3} />
          <text y={30} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={104} fill={P.zelena900}>
            ono najbitnije
          </text>
        </g>
      )}
      <g opacity={1 - desno * 0.35}>
        <Pop at={kNe - 4} x={290} y={840} rot={-4}>
          <Kartica seed="s6-a" boja={P.belo} tekstBoja={P.siva} naslov={["NE", "ODGOVARAŠ"]} tekst={["za sve što", "će on posle", "da radi"]} />
        </Pop>
      </g>
      <Pop at={kOdgovaras - 4} x={790} y={840} rot={3}>
        <Kartica seed="s6-b" boja={P.zelena700} tekstBoja="#fff" naslov={["ODGOVARAŠ", "samo za to:"]} tekst={["da je stvarna", "osoba i da", "ga poznaješ"]} />
      </Pop>
      <g transform="translate(790 1250) rotate(-6)">
        <Pecat seed="s6-p" tekst="ZNAM GA" t={napredak(f, kPoznajes + 2, 10, Easing.out(Easing.cubic))} boja={P.zelena700} velicina={56} />
      </g>
    </Svg>
  );
};

// ── 7 ── Potvrđivanjem samo onih koje lično znamo čuvamo poverenje, a sa njim i smisao celog KOLA. ekolo.rs
export const Scena7: React.FC = () => {
  const f = useCurrentFrame();
  const kCuvamo = kad(7, "čuvamo");
  const kKola = kad(7, "KOLA");
  const kEkolo = kad(7, "ekolo.rs");
  const kraj = napredak(f, kKola - 6, 14);
  const adresa = usePop(kEkolo - 3);
  const dugme = usePop(kEkolo + 8);
  return (
    <Svg>
      {kraj < 1 && (
        <g opacity={1 - kraj}>
          {VEZE_M.map(([a, b], i) => (
            <Crta key={i} pts={[MREZA[a], MREZA[b]]} seed={`s7-m${i}`} boja={P.zelena500} debljina={8} napredak={napredak(f, i * 3, 14)} />
          ))}
          {MREZA.map(([x, y], i) => (
            <Pop key={i} at={i * 2} x={x} y={y - 70}>
              <g transform="scale(0.95)">
                <Osoba seed={`s7-o${i}`} boja={LJUDI[(i + 2) % 6].boja} glava={{ ...LJUDI[(i + 2) % 6].glava, osmeh: 1 }} />
              </g>
              {f >= kCuvamo + i * 2 && (
                <g transform="translate(60 -30)">
                  <Kvacica seed={`s7-kv${i}`} r={24} />
                </g>
              )}
            </Pop>
          ))}
        </g>
      )}
      {kraj > 0 && (
        <g opacity={kraj}>
          <Kolo seed="kolo7" geo={{ cx: 540, cy: 1060, rx: 360, ry: 110, ugao: (f - kKola) * 1.2, skala: 1.0, n: 8 }} pojava={OSOBE.map((_, i) => kKola - 6 + i * 2)} ruke={kKola + 8} />
          <g transform="translate(540 640)">
            <LogoZnak seed="logo7" r={170} />
          </g>
          <g transform={`translate(540 1200) scale(${adresa})`}>
            <text textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={120} fill={P.zelena700} letterSpacing={-2}>
              ekolo.rs
            </text>
          </g>
          <g transform={`translate(540 1290) scale(${dugme})`}>
            <Isecak pts={pravougaonik(-300, -46, 600, 92)} boja={P.zelena700} seed="dugme7" />
            <text y={18} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={46} fill="#fff">
              Potvrdi one koje znaš
            </text>
          </g>
        </g>
      )}
    </Svg>
  );
};

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6, Scena7];
