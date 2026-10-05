// Scene 1–9 (tuga, sećanje, prolazak, melanholija, opet tuga, odluka). Animacije se kače na izgovorene
// reči (kad), boju scene (tuga = isprana) daje Video.tsx.
import React from "react";
import { interpolate } from "remotion";
import { Boja, Cvet, Kadar, Kamera, N, Pop, elipsa, kutija, mesaj, napredak, useF } from "./naiva";
import { Lutka, OTAC, SAVA, SAVA_MLAD, ZENA, CERKA, SIN, KOMSIJA, KOMSINICA, MLADA_ZENA, PENZIONER } from "./lutke";
import { Krava, Ovca, Svinja } from "./zivotinje";
import { Autobus, Djeram, Dud, Kamion, Klupa, Kuca, Letve, Pejzaz, Stala } from "./salas";
import { Kanister, KantaMleka, Kofer, Kotao, Racun, Sir, Tetrapak, Vaga, Vreca, Zdela, Cisterna, Viljuska } from "./stvari";
import { Kuhinja, PolicaRadnje, StalaUnutra, Tezga, Zupanija } from "./okolina";
import { kad, trajanjeF } from "./vreme";

const k = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Dva kadra u jednoj sceni: drugi se pretapa preko prvog od frejma `od` za `traje` frejmova. */
export const Pretopi: React.FC<{ od: number; traje?: number; prvi: React.ReactNode; drugi: React.ReactNode }> = ({ od, traje = 12, prvi, drugi }) => {
  const f = useF();
  const p = napredak(f, od, traje);
  return (
    <>
      {p < 1 && <g>{prvi}</g>}
      {p > 0 && <g opacity={p}>{drugi}</g>}
    </>
  );
};

/** Sedeća poza: lik se seče iznad sedišta, pa klupa ispred njega pokriva noge. */
const Sedi: React.FC<{ id: string; sediste: number; children: React.ReactNode }> = ({ id, sediste, children }) => (
  <g>
    <defs>
      <clipPath id={`sedi-${id}`}>
        <rect x={-500} y={-500} width={2500} height={sediste + 500} />
      </clipPath>
    </defs>
    <g clipPath={`url(#sedi-${id})`}>{children}</g>
  </g>
);

// ── 1: Jutros je Sava prodao poslednje dve krave. Štala je prvi put prazna. ─────────────────────
export const Scena1: React.FC = () => {
  const f = useF();
  const voz = napredak(f, 0, 240, (t) => t);
  const kamionX = mesaj(760, -560, voz);
  const stala = kad(1, "štala");
  return (
    <Kadar>
      <Pretopi
        od={stala - 14}
        prvi={
          <Kamera z={mesaj(1.0, 1.08, napredak(f, 0, 150))} y={980}>
            <Pejzaz sezona="jesen" doba="jutro" sunce={false} />
            <Dud x={130} y={1000} s={0.8} sezona="jesen" />
            <Kuca x={330} y={1010} s={0.62} />
            <Stala x={820} y={1010} s={0.7} otvorena={1} />
            <path d="M-100,1150 C300,1110 700,1130 1180,1100 L1180,1180 C700,1200 300,1180 -100,1220Z" fill="#B9A57A" stroke={N.kontura} strokeWidth={2} />
            <Kamion
              x={kamionX}
              y={1170}
              s={0.62}
              tocak={-f * 6}
              teret={
                <>
                  <Krava x={20} y={0} s={0.42} seed={1} zvono={false} />
                  <Krava x={190} y={0} s={0.42} seed={2} zvono={false} />
                </>
              }
            />
            <Letve x0={560} x1={1100} y={1300} h={110} />
            <Lutka {...SAVA} x={760} y={1290} s={0.62} izraz="zamisljena" lr={[20, 20]} dr={[-40, -50]} pogled={[-1, 0]}
              drziD={<path d="M0,0 C20,40 -10,80 10,130" stroke="#8A6A3A" strokeWidth={6} fill="none" />} />
            {/* magla */}
            <rect x={-100} y={700} width={1300} height={500} fill="#F4F1EA" opacity={0.35} />
          </Kamera>
        }
        drugi={
          <Kamera z={mesaj(1.0, 1.06, napredak(f, stala, 100))} y={900}>
            <StalaUnutra />
          </Kamera>
        }
      />
    </Kadar>
  );
};

// ── 2: A nekada je na Savinom salašu bilo svega: krave, svinje, ovce. ───────────────────────────
export const Scena2: React.FC = () => {
  const f = useF();
  return (
    <Kadar>
      <Kamera z={mesaj(1.05, 1.0, napredak(f, 0, 200))} y={980}>
        <Pejzaz sezona="leto" />
        <Dud x={120} y={980} s={0.85} sezona="leto" />
        <Kuca x={360} y={990} s={0.6} />
        <Stala x={830} y={990} s={0.66} otvorena={0.6} />
        <Djeram x={600} y={1010} s={0.55} />
        {Array.from({ length: 14 }, (_, i) => (
          <Cvet key={i} x={40 + i * 76} y={1560 + (i % 3) * 60} s={1.2} boja={[N.crvena, N.zuta, N.bela, N.roze][i % 4]} f={f} />
        ))}
        <Pop at={kad(2, "krave")} x={250} y={1250}>
          <Krava x={0} y={0} s={0.62} seed={3} />
        </Pop>
        <Pop at={kad(2, "krave") + 6} x={640} y={1270}>
          <Krava x={0} y={0} s={0.62} seed={4} smer={-1} />
        </Pop>
        <Pop at={kad(2, "svinje")} x={140} y={1320}>
          <Svinja x={0} y={0} s={0.55} seed={5} />
        </Pop>
        <Pop at={kad(2, "svinje") + 5} x={420} y={1330}>
          <Svinja x={0} y={0} s={0.5} seed={6} smer={-1} />
        </Pop>
        <Pop at={kad(2, "ovce")} x={850} y={1320}>
          <Ovca x={0} y={0} s={0.55} seed={7} smer={-1} />
        </Pop>
        <Pop at={kad(2, "ovce") + 5} x={990} y={1300}>
          <Ovca x={0} y={0} s={0.5} seed={8} smer={-1} />
        </Pop>
      </Kamera>
    </Kadar>
  );
};

// ── 3: mleko u mlekaru; Božić; radili su svi ─────────────────────────────────────────────────
export const Scena3: React.FC = () => {
  const f = useF();
  const bozic = kad(3, "za");
  const radili = kad(3, "radili");
  const ljudi: [number, typeof OTAC, string, number][] = [
    [215, OTAC, "otac", 0],
    [345, ZENA, "žena", 0],
    [615, CERKA, "deca", 0],
    [700, SIN, "deca", 6],
    [795, KOMSIJA, "komšije", 0],
    [890, KOMSINICA, "komšije", 6],
  ];
  return (
    <Kadar>
      <Pretopi
        od={radili - 10}
        prvi={
          <Pretopi
            od={bozic - 8}
            prvi={
              <g>
                <Pejzaz sezona="leto" doba="jutro" />
                <Kuca x={250} y={990} s={0.55} />
                <path d="M-100,1180 C300,1150 700,1170 1180,1140 L1180,1240 C700,1260 300,1240 -100,1280Z" fill="#D9C48A" stroke={N.kontura} strokeWidth={2} />
                <g transform={`translate(${mesaj(200, 760, napredak(f, 0, bozic, (t) => t))} 0)`}>
                  <Lutka {...SAVA_MLAD} x={0} y={1250} s={0.6} hod={f / 4} dr={[60, 20]} lr={[60, 20]} />
                  <g transform="translate(130 1240)">
                    <Boja d="M-80,-20 L120,-20 L100,-110 L-60,-110Z" boja={N.drvo} />
                    <Boja d={elipsa(-40, 0, 26)} boja="#2A2A2A" />
                    <KantaMleka x={-10} y={-110} s={0.55} />
                    <KantaMleka x={50} y={-110} s={0.55} />
                  </g>
                </g>
              </g>
            }
            drugi={
              <g>
                <Pejzaz sezona="zima" sneg sunce={false} />
                <Kuca x={300} y={990} s={0.6} sneg svetlo />
                <Stala x={860} y={1000} s={0.6} sneg />
                <Kotao x={560} y={1260} s={0.8} />
                <Lutka {...SAVA_MLAD} x={370} y={1290} s={0.55} izraz="srecna" dr={[60, 30]} />
                <Lutka {...OTAC} x={760} y={1290} s={0.55} izraz="srecna" lr={[-50, -20]} pogled={[-1, 0]} />
                <Lutka {...SIN} x={860} y={1300} s={0.42} izraz="srecna" />
              </g>
            }
          />
        }
        drugi={
          <g>
            <Pejzaz sezona="leto" />
            <Stala x={540} y={990} s={0.6} otvorena={1} />
            <path d="M-100,1000 L1180,1000 L1180,1400 L-100,1400Z" fill="#E9C24A" opacity={0.5} />
            <Lutka {...SAVA_MLAD} x={480} y={1270} s={0.55} izraz="srecna" dr={[150, 10]} drziD={<Viljuska s={0.7} />} drziDRot={180} />
            {ljudi.map(([x, cfg, rec, zak], i) => (
              <Pop key={i} at={kad(3, rec) + zak} x={x} y={1290}>
                <Lutka {...cfg} x={0} y={0} s={cfg === CERKA || cfg === SIN ? 0.42 : 0.52} izraz="srecna" lr={[30, 20]} dr={[-30, -20]} />
              </Pop>
            ))}
          </g>
        }
      />
    </Kadar>
  );
};

// ── 4: Petkom na pijacu u Sombor; ljudi su tražili baš njegov sir. ────────────────────────────
export const Scena4: React.FC = () => {
  const f = useF();
  const bas = kad(4, "baš");
  const pokazuje = napredak(f, bas - 6, 10);
  return (
    <Kadar>
      <Kamera z={mesaj(1.0, 1.06, napredak(f, 0, trajanjeF(4)))} y={980}>
        <rect x={-200} y={-200} width={1480} height={1000} fill={N.neboSvetlo} />
        <Zupanija x={540} y={900} s={0.95} />
        <rect x={-200} y={900} width={1480} height={1200} fill="#D8CCB4" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${-100 + i * 110},900 L${-200 + i * 140},1700`} stroke="#BFB29A" strokeWidth={3} />
        ))}
        <Lutka {...SAVA_MLAD} x={430} y={1150} s={0.55} izraz={f > bas ? "srecna" : "osmeh"} />
        <Lutka {...ZENA} x={600} y={1150} s={0.52} izraz="osmeh" />
        <Tezga x={520} y={1260} s={0.85}>
          <Sir x={-150} y={0} s={0.9} />
          <Sir x={-20} y={0} s={0.8} kriska />
          <Zdela x={110} y={0} s={0.9} />
          <Zdela x={210} y={0} s={0.75} />
        </Tezga>
        <Lutka {...MLADA_ZENA} x={290} y={1330} s={0.56} izraz="srecna" lr={[14, 10]} dr={[mesaj(-14, -100, pokazuje), mesaj(-10, -20, pokazuje)]} pogled={[1, 0]} />
        <Lutka {...PENZIONER} x={190} y={1340} s={0.52} izraz="osmeh" pogled={[1, 0]} />
        <Lutka {...KOMSINICA} x={850} y={1330} s={0.54} izraz="osmeh" pogled={[-1, 0]} />
      </Kamera>
    </Kadar>
  );
};

// ── 5: otac ne može da radi; deca odlaze; salaši opusteli; prodaje ovce, svinje; ostale krave ─────
export const Scena5: React.FC = () => {
  const f = useF();
  const deca = kad(5, "deca");
  const komsije = kad(5, "komšije");
  const sava = kad(5, "sava");
  const ovce = kad(5, "ovce");
  const svinje = kad(5, "svinje");
  return (
    <Kadar>
      <Pretopi
        od={sava - 12}
        prvi={
          <Pretopi
            od={komsije - 10}
            prvi={
              <Pretopi
                od={deca - 10}
                prvi={
                  <g>
                    <Pejzaz sezona="jesen" />
                    <Kuca x={540} y={1010} s={0.8} />
                    <Lutka {...OTAC} x={440} y={1300} s={0.62} izraz="mirna" lr={[24, 30]} drziL={<path d="M0,0 L-10,160" stroke={N.drvoTamno} strokeWidth={10} strokeLinecap="round" />} nagib={-4} />
                    <Klupa x={540} y={1310} s={1.1} />
                  </g>
                }
                drugi={
                  <g>
                    <Pejzaz sezona="jesen" />
                    <path d="M-100,1150 L1180,1150 L1180,1300 L-100,1300Z" fill="#8A8A8A" />
                    <Autobus x={mesaj(560, -500, napredak(f, deca + 20, 120, (t) => t * t))} y={1240} s={0.8} tocak={-f * 5} />
                    {f < deca + 24 && (
                      <>
                        <Lutka {...CERKA} x={380} y={1260} s={0.5} izraz="mirna" drziD={<Kofer s={1} boja={N.crvena} />} />
                        <Lutka {...SIN} x={520} y={1260} s={0.5} izraz="mirna" drziD={<Kofer s={1} />} />
                      </>
                    )}
                    <Lutka {...SAVA} x={860} y={1330} s={0.56} izraz="zamisljena" lr={[-150, -10]} pogled={[-1, 0]} />
                  </g>
                }
              />
            }
            drugi={
              <g>
                <Pejzaz sezona="jesen" sunce={false} />
                <Kuca x={300} y={1000} s={0.55} zapusten />
                <Kuca x={820} y={1000} s={0.5} zapusten />
                {Array.from({ length: 10 }, (_, i) => (
                  <path key={i} d={`M${100 + i * 90},1060 l-10,-40 m20,40 l6,-50`} stroke="#8A7A4A" strokeWidth={5} />
                ))}
                <Lutka {...KOMSIJA} x={300} y={1300} s={0.52} izraz="mirna" nagib={-8} drziL={<path d="M0,0 L-10,160" stroke={N.drvoTamno} strokeWidth={10} strokeLinecap="round" />} />
                <Lutka {...KOMSINICA} x={460} y={1300} s={0.5} izraz="mirna" nagib={-6} />
              </g>
            }
          />
        }
        drugi={
          <g>
            <Pejzaz sezona="jesen" sunce={false} />
            <Kuca x={300} y={980} s={0.56} />
            <Stala x={820} y={990} s={0.62} otvorena={1} />
            <Letve x0={40} x1={1040} y={1330} h={90} />
            {/* ovce izlaze na „ovce“, svinje na „svinje“, ostaju dve krave */}
            {[0, 1, 2].map((i) => {
              const p = napredak(f, ovce + i * 6, 70, (t) => t);
              return p < 1 ? <Ovca key={i} x={mesaj(560 + i * 120, 1300, p)} y={1290 + i * 10} s={0.45} seed={20 + i} hod={p * 30} opacity={1 - p * 0.3} /> : null;
            })}
            {[0, 1].map((i) => {
              const p = napredak(f, svinje + i * 6, 70, (t) => t);
              return p < 1 ? <Svinja key={`s${i}`} x={mesaj(300 + i * 140, -300, p)} y={1300} s={0.45} seed={30 + i} smer={-1} /> : null;
            })}
            <Krava x={600} y={1240} s={0.55} seed={3} />
            <Krava x={880} y={1250} s={0.55} seed={4} smer={-1} />
            <Lutka {...SAVA} x={240} y={1320} s={0.56} izraz="zamisljena" pogled={[1, 0]} />
          </g>
        }
      />
    </Kadar>
  );
};

// ── 6: sam radi; uveče na klupi gleda štalu koja je nekada bila puna ────────────────────────────
export const Scena6: React.FC = () => {
  const f = useF();
  const sviF = kad(6, "svi");
  const uvece = kad(6, "uveče");
  const puna = kad(6, "puna");
  const duhovi = interpolate(f, [sviF - 6, sviF + 6, uvece - 16, uvece - 4], [0, 0.32, 0.32, 0], k);
  const duhStoke = interpolate(f, [puna - 8, puna + 6, puna + 40], [0, 0.4, 0], k);
  return (
    <Kadar>
      <Pretopi
        od={uvece - 10}
        prvi={
          <g>
            <Pejzaz sezona="jesen" sunce={false} />
            <Stala x={760} y={1000} s={0.64} otvorena={1} />
            <Lutka {...SAVA} x={430} y={1300} s={0.6} izraz="mirna" dr={[150, 10]} drziD={<Viljuska s={0.7} />} drziDRot={180} hod={Math.sin(f / 10) * 0.3} />
            <g opacity={duhovi}>
              <Lutka {...OTAC} x={180} y={1300} s={0.52} izraz="srecna" />
              <Lutka {...ZENA} x={620} y={1300} s={0.5} izraz="srecna" />
              <Lutka {...SIN} x={900} y={1310} s={0.42} izraz="srecna" />
              <Lutka {...CERKA} x={1000} y={1310} s={0.42} izraz="srecna" />
            </g>
          </g>
        }
        drugi={
          <g>
            <Pejzaz sezona="jesen" doba="vece" />
            <Stala x={700} y={1060} s={0.75} otvorena={1} />
            <g opacity={duhStoke} transform="translate(700 1060) scale(0.75)">
              <Krava x={-40} y={0} s={0.55} seed={9} />
              <Ovca x={60} y={0} s={0.4} seed={10} />
            </g>
            <Sedi id="s6" sediste={1240}>
              <Lutka {...SAVA} x={340} y={1390} s={0.62} izraz="zamisljena" pogled={[1, 0]} glavaNagib={-6} />
            </Sedi>
            <Klupa x={340} y={1330} s={1.2} />
          </g>
        }
      />
    </Kadar>
  );
};

// ── 7: hrana za stoku, struja, nafta — sve skuplje; mleko sve jeftinije ──────────────────────────
export const Scena7: React.FC = () => {
  const f = useF();
  const skuplje = kad(7, "skuplje");
  const jeft = kad(7, "jeftinije");
  const rast = mesaj(1, 1.3, napredak(f, skuplje - 4, 16));
  const pad = mesaj(1, 0.55, napredak(f, jeft - 2, 18));
  const Strelica: React.FC<{ x: number; y: number; gore: boolean; at: number }> = ({ x, y, gore, at }) => (
    <Pop at={at} x={x} y={y}>
      <Boja d={gore ? "M0,-90 L40,-30 L16,-30 L16,40 L-16,40 L-16,-30 L-40,-30Z" : "M0,90 L40,30 L16,30 L16,-40 L-16,-40 L-16,30 L-40,30Z"} boja={gore ? N.crvena : N.plava} />
    </Pop>
  );
  return (
    <Kadar>
      <Kuhinja />
      <Pop at={kad(7, "hrana")} x={300} y={1160}>
        <g transform={`scale(${rast})`}><Vreca x={0} y={0} s={1.35} /></g>
      </Pop>
      <Pop at={kad(7, "struja")} x={470} y={1160}>
        <g transform={`scale(${rast})`}><Racun x={0} y={0} s={1.35} /></g>
      </Pop>
      <Pop at={kad(7, "nafta")} x={640} y={1160}>
        <g transform={`scale(${rast})`}><Kanister x={0} y={0} s={1.35} /></g>
      </Pop>
      {[300, 470, 640].map((x, i) => (
        <Strelica key={x} x={x} y={820} gore at={skuplje + i * 3} />
      ))}
      <Pop at={kad(7, "mleko")} x={840} y={1160}>
        <g transform={`scale(${pad})`}><KantaMleka x={0} y={0} s={1.6} /></g>
      </Pop>
      <Strelica x={840} y={860} gore={false} at={jeft} />
    </Kadar>
  );
};

// ── 8: u radnji mleko tri puta skuplje nego što otkupljivač daje njemu; „ne isplati mi se“ ────────
export const Scena8: React.FC = () => {
  const f = useF();
  const otk = kad(8, "otkupljivač", 2);
  const ne = kad(8, "ne");
  const slegne = napredak(f, ne - 4, 10);
  const nagib = interpolate(f, [kad(8, "tri"), kad(8, "tri") + 10, kad(8, "tri") + 30], [-14, 4, 0], k);
  return (
    <Kadar>
      <Pretopi
        od={otk - 12}
        prvi={
          <g>
            <PolicaRadnje />
            <Pop at={kad(8, "mleko") - 6} x={540} y={1250}>
              <Vaga x={0} y={0} s={1.2} nagib={nagib}
                levo={<Tetrapak x={0} y={0} s={0.9} />}
                desno={<g><KantaMleka x={-50} y={0} s={0.45} /><KantaMleka x={0} y={0} s={0.45} /><KantaMleka x={50} y={0} s={0.45} /></g>} />
            </Pop>
          </g>
        }
        drugi={
          <g>
            <Pejzaz sezona="jesen" sunce={false} />
            <Kuca x={260} y={990} s={0.55} />
            <Cisterna x={720} y={1180} s={0.7} />
            <Lutka odeca={{ tip: "muskarac", kosulja: "#5A7AA0", pantalone: "#3A3A44" }} kosa="kratka" bojaKose="#3A2A1A" seed={21}
              x={560} y={1310} s={0.58} izraz="mirna"
              lr={[mesaj(14, -60, slegne), mesaj(10, -80, slegne)]} dr={[mesaj(-14, 60, slegne), mesaj(-10, 80, slegne)]} />
            <Lutka {...SAVA} x={300} y={1320} s={0.6} izraz="zamisljena" pogled={[1, 0]} />
            <KantaMleka x={420} y={1320} s={0.6} />
          </g>
        }
      />
    </Kadar>
  );
};

// ── 9: I Sava je odlučio da proda i poslednje krave. (noć u štali) ─────────────────────────────
export const Scena9: React.FC = () => {
  const f = useF();
  return (
    <Kadar>
      <Kamera z={mesaj(1.0, 1.12, napredak(f, 0, trajanjeF(9)))} y={1050}>
        <StalaUnutra noc>
          <Krava x={330} y={1250} s={0.6} seed={3} />
          <Krava x={760} y={1260} s={0.6} seed={4} smer={-1} />
          <Lutka {...SAVA} x={540} y={1290} s={0.62} izraz="zamisljena" glavaNagib={-8} lr={[60, 30]} dr={[-60, -30]} />
        </StalaUnutra>
        {/* fenjer */}
        <defs>
          <radialGradient id="fenjer">
            <stop offset="0" stopColor="#FFD27A" stopOpacity="0.35" />
            <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={540} cy={640} r={420} fill="url(#fenjer)" />
        <Boja d={kutija(520, 610, 40, 56, 6)} boja="#FFD27A" />
      </Kamera>
    </Kadar>
  );
};
