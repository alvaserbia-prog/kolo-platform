// Scene 10–17 (preokret i rešenje): Đurika na stočnoj pijaci, oglas na KOLU, zapis u KOLU, šta Đurika
// dobija, dinari ostaju u kući, Savina jaja, tele, poziv. POEN je samo reč u knjizi evidencije.
import React from "react";
import { interpolate, staticFile } from "remotion";
import { Boja, Kadar, Kamera, N, Pop, kutija, mesaj, napredak, useF } from "./naiva";
import { Lutka, SAVA, DJURIKA, MLADA_ZENA, PENZIONER, KOMSIJA, KOMSINICA, MOMAK1, MOMAK2, VETERINAR, ELEKTRICAR, CERKA, ZENA } from "./lutke";
import { Kokoska, Krava, Tele } from "./zivotinje";
import { Auto, Djeram, Dud, Kanal, Kuca, Letve, Pejzaz, Stala } from "./salas";
import { Fioka, Kljuc, Knjiga, KorpaJaja, KantaMleka, Kotao, Medaljon, Prikolica, Pumpa, Sir, Stetoskop, TablaMesta, Telefon, Viljuska } from "./stvari";
import { Gajba, Karta, StalaUnutra } from "./okolina";
import { Pretopi } from "./scene1";
import { kad, trajanjeF } from "./vreme";
import { OBLO } from "./fontovi";

const k = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Zapis u KOLU u gornjem delu kadra: upisuje se red po red na zadate frejmove. */
const ZapisGore: React.FC<{ redovi: string[]; kada: number[]; istaknut?: number; y?: number; s?: number }> = ({ redovi, kada, istaknut, y = 330, s = 0.72 }) => {
  const f = useF();
  const n = kada.filter((t) => f >= t).length;
  if (n === 0) return null;
  return (
    <Pop at={kada[0]} x={540} y={y}>
      <Knjiga x={0} y={0} s={s} redovi={redovi} n={n} istaknut={istaknut ?? n - 1} />
    </Pop>
  );
};

// ── 10: Na stočnoj pijaci sreo je Đuriku iz Bezdana. Đurika je svoje krave zadržao. ──────────────
export const Scena10: React.FC = () => {
  const f = useF();
  const dj = kad(10, "đuriku");
  const zad = kad(10, "zadržao");
  const ulaz = napredak(f, dj - 30, 40);
  const med = napredak(f, zad - 10, 18);
  return (
    <Kadar>
      <Pejzaz sezona="jesen" />
      <rect x={-200} y={1000} width={1480} height={1000} fill="#B9A57A" />
      <Letve x0={-40} x1={1120} y={1080} h={100} />
      <Krava x={120} y={1060} s={0.4} seed={41} />
      <Krava x={420} y={1065} s={0.4} seed={42} smer={-1} />
      <Krava x={900} y={1060} s={0.4} seed={43} />
      <Lutka {...KOMSIJA} x={640} y={1090} s={0.4} izraz="mirna" />
      <Lutka {...PENZIONER} x={1000} y={1090} s={0.38} izraz="mirna" />
      {/* Sava sa svoje dve krave */}
      <Krava x={230} y={1300} s={0.52} seed={3} />
      <Lutka {...SAVA} x={420} y={1330} s={0.58} izraz={f > dj + 10 ? "iznenadjena" : "zamisljena"} dr={[-40, -40]} pogled={[1, 0]}
        drziD={<path d="M0,0 C-30,30 -80,20 -140,0" stroke="#8A6A3A" strokeWidth={6} fill="none" />} />
      {/* Đurika ulazi sa desna, bez stoke, sa korpom sira, vedar */}
      <Lutka {...DJURIKA} x={mesaj(1250, 760, ulaz)} y={1330} s={0.58} izraz="srecna" hod={ulaz < 1 ? f / 4 : undefined} pogled={[-1, 0]}
        lr={[30, 40]} drziL={<g transform="translate(-10 20)"><Boja d="M-46,0 L46,0 L36,40 L-36,40Z" boja="#C08A4A" /><Sir x={0} y={2} s={0.5} /></g>} />
      {med > 0 && (
        <g opacity={med}>
          <Medaljon x={640} y={560} r={230} id="dj" skala={0.6 + 0.4 * med}>
            <g transform="translate(-540 -1000) scale(1)">
              <Pejzaz sezona="leto" horizont={820} sunce={false} oblaci={false} />
              <Kuca x={430} y={1000} s={0.55} />
              <Kanal y={1110} />
              <Krava x={700} y={1060} s={0.45} seed={44} />
              <Krava x={520} y={1080} s={0.42} seed={45} smer={-1} />
            </g>
          </Medaljon>
          <g transform="translate(640 850)">
            <rect x={-130} y={-36} width={260} height={64} rx={32} fill={N.crvena} stroke={N.kontura} strokeWidth={3} />
            <text x={0} y={10} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={40} fill={N.bela}>
              Bezdan
            </text>
          </g>
        </g>
      )}
    </Kadar>
  );
};

// ── 11: mleko više ne daje otkupljivaču, pravi sir; oglas na KOLU; ljudi dolaze kod njega ─────────
export const Scena11: React.FC = () => {
  const f = useF();
  const post = kad(11, "postavio");
  const kolu = kad(11, "kolu");
  const ljudi = kad(11, "ljudi");
  const tel = napredak(f, post - 10, 14);
  return (
    <Kadar>
      <Pretopi
        od={ljudi - 10}
        prvi={
          <g>
            <rect x={-200} y={-200} width={1480} height={2400} fill="#F2E6C8" />
            <Boja d={kutija(80, 300, 300, 260, 8)} boja={N.neboSvetlo} />
            <path d="M230,300 L230,560 M80,430 L380,430" stroke={N.bela} strokeWidth={12} />
            <rect x={-200} y={1250} width={1480} height={800} fill="#C8A06A" />
            <Kotao x={360} y={1250} s={1.1} mleko />
            <Lutka {...DJURIKA} x={640} y={1300} s={0.62} izraz="srecna" lr={[110, 40]} pogled={[-1, 0]} />
            {/* kalupi sira na polici */}
            <Boja d={kutija(700, 640, 340, 20, 4)} boja={N.drvo} />
            <Sir x={760} y={640} s={0.6} />
            <Sir x={880} y={640} s={0.6} />
            <Sir x={990} y={640} s={0.55} />
            {tel > 0 && (
              <g opacity={tel} transform={`translate(${mesaj(540, 540, tel)} ${mesaj(1100, 760, tel)}) scale(${0.6 + 0.4 * tel})`}>
                <Telefon x={0} y={0} s={1.15} naslov="Domaći sir i mleko" mesto="Bezdan" objavljen={f >= kolu ? 1 : 0}
                  slika={<g><Sir x={-40} y={60} s={0.9} /><KantaMleka x={70} y={70} s={0.6} /></g>} />
              </g>
            )}
          </g>
        }
        drugi={
          <g>
            <Pejzaz sezona="leto" />
            <Kuca x={300} y={990} s={0.58} />
            <Kanal y={1030} />
            <Letve x0={520} x1={1080} y={1320} h={120} />
            <Lutka {...DJURIKA} x={640} y={1320} s={0.58} izraz="srecna" pogled={[-1, 0]} />
            {[
              { cfg: MLADA_ZENA, x: 120, d: 0 },
              { cfg: PENZIONER, x: 270, d: 8 },
              { cfg: ZENA, x: 420, d: 16 },
            ].map(({ cfg, x, d }) => {
              const p = napredak(f, ljudi + d, 40);
              return <Lutka key={x} {...cfg} x={mesaj(x - 400, x, p)} y={1330} s={0.54} izraz="osmeh" hod={p < 1 ? f / 4 : undefined} pogled={[1, 0]} />;
            })}
          </g>
        }
      />
    </Kadar>
  );
};

// ── 12: Za sir i mleko prepišu mu POENE. Tim POENIMA Đurika dobija ono što mu treba. ─────────────
export const Scena12: React.FC = () => {
  const f = useF();
  const prep = kad(12, "prepišu");
  const tim = kad(12, "tim");
  return (
    <Kadar>
      <Pejzaz sezona="leto" />
      <Kuca x={820} y={990} s={0.5} />
      <Letve x0={-40} x1={1100} y={1320} h={110} />
      <Lutka {...DJURIKA} x={680} y={1330} s={0.6} izraz="srecna" pogled={[-1, 0]} lr={[-60, -30]} />
      <Lutka {...MLADA_ZENA} x={330} y={1330} s={0.56} izraz="srecna" pogled={[1, 0]} dr={[-70, -30]} drziD={<Sir x={0} y={10} s={0.5} />} />
      <Lutka {...PENZIONER} x={130} y={1340} s={0.52} izraz="osmeh" pogled={[1, 0]} drziD={<KantaMleka x={0} y={60} s={0.4} />} />
      <ZapisGore redovi={["Jelica → Đurika · POEN", "Đorđe → Đurika · POEN", "Ana → Đurika · POEN"]} kada={[prep, prep + 26, tim - 6]} />
    </Kadar>
  );
};

// ── 13: momci oko sena; veterinar; električar popravi pumpu; neko ga poveze do doktora u Sombor ─────
export const Scena13: React.FC = () => {
  const f = useF();
  const vet = kad(13, "veterinar");
  const el = kad(13, "električar");
  const neko = kad(13, "neko");
  const Red: React.FC<{ tekst: string; at: number }> = ({ tekst, at }) => <ZapisGore redovi={[tekst]} kada={[at]} />;
  return (
    <Kadar>
      <Pretopi
        od={neko - 8}
        prvi={
          <Pretopi
            od={el - 8}
            prvi={
              <Pretopi
                od={vet - 8}
                prvi={
                  <g>
                    <Pejzaz sezona="leto" />
                    <Prikolica x={560} y={1250} s={1.0} seno={mesaj(0.4, 1, napredak(f, 0, vet - 10))} />
                    <Lutka {...MOMAK1} x={250} y={1320} s={0.55} izraz="srecna" dr={[150, 20 + Math.sin(f / 6) * 20]} drziD={<Viljuska s={0.7} />} drziDRot={180} />
                    <Lutka {...MOMAK2} x={900} y={1320} s={0.55} izraz="srecna" lr={[-150, -20 - Math.sin(f / 6) * 20]} drziL={<Viljuska s={0.7} />} drziLRot={180} />
                    <Lutka {...DJURIKA} x={720} y={1340} s={0.5} izraz="srecna" />
                    <Red tekst="Đurika → Marko · POEN" at={8} />
                  </g>
                }
                drugi={
                  <g>
                    <Pejzaz sezona="leto" />
                    <Stala x={820} y={1000} s={0.6} otvorena={1} />
                    <Krava x={520} y={1260} s={0.6} seed={44} />
                    <Lutka {...VETERINAR} x={780} y={1320} s={0.56} izraz="osmeh" lr={[-80, -20]} drziL={<Stetoskop s={0.8} />} pogled={[-1, 0]} />
                    <Lutka {...DJURIKA} x={220} y={1330} s={0.54} izraz="srecna" pogled={[1, 0]} />
                    <Red tekst="Đurika → Jovan · POEN" at={vet + 6} />
                  </g>
                }
              />
            }
            drugi={
              <g>
                <Pejzaz sezona="leto" />
                <Djeram x={260} y={1060} s={0.6} />
                <Pumpa x={600} y={1260} s={1.1} radi={f > el + 40} />
                <Lutka {...ELEKTRICAR} x={820} y={1320} s={0.56} izraz="osmeh" lr={[-70, -40]} drziL={<Kljuc s={0.9} />} pogled={[-1, 0]} />
                <Lutka {...DJURIKA} x={330} y={1330} s={0.52} izraz="srecna" pogled={[1, 0]} />
                <Red tekst="Đurika → Mika · POEN" at={el + 6} />
              </g>
            }
          />
        }
        drugi={
          <g>
            <Pejzaz sezona="leto" />
            <path d="M-100,1150 L1180,1150 L1180,1300 L-100,1300Z" fill="#8A8A8A" />
            <TablaMesta x={800} y={1160} s={0.9} ime="Sombor" />
            <Auto x={mesaj(-200, 620, napredak(f, neko - 4, 60))} y={1260} s={0.9} tocak={f * 6}
              putnici={<g><circle cx={-20} cy={-160} r={22} fill={N.koza} stroke={N.kontura} strokeWidth={2} /><circle cx={60} cy={-160} r={22} fill={N.koza} stroke={N.kontura} strokeWidth={2} /></g>} />
            <Red tekst="Đurika → Pera · POEN" at={neko + 6} />
          </g>
        }
      />
    </Kadar>
  );
};

// ── 14: Za sve to je ranije davao dinare. Sada su mu ostali u kući. ─────────────────────────────
export const Scena14: React.FC = () => {
  const f = useF();
  const sada = kad(14, "sada");
  const otv = interpolate(f, [sada - 4, sada + 10], [0, 1], k);
  return (
    <Kadar>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#F2E6C8" />
      <rect x={-200} y={1250} width={1480} height={800} fill="#C8A06A" />
      <Fioka x={430} y={1260} s={0.9} otvorena={otv} />
      <Lutka {...DJURIKA} x={830} y={1300} s={0.62} izraz={f > sada + 8 ? "srecna" : "osmeh"} lr={[-60, -30]} pogled={[-1, 0]} />
    </Kadar>
  );
};

// ── 15: Sava nema krave; kokoške i jaja; oglas na KOLU; ljudi dolaze po jaja i prepisuju mu POENE ───
export const Scena15: React.FC = () => {
  const f = useF();
  const ali = kad(15, "ali");
  const jaja = kad(15, "jaja");
  const post = kad(15, "postavio");
  const kolu = kad(15, "kolu");
  const ljudi = kad(15, "ljudi");
  const prep = kad(15, "prepisivali");
  const kokoske: [number, number, string][] = [
    [140, 1300, N.bela],
    [260, 1330, "#C8743A"],
    [380, 1310, N.bela],
    [640, 1320, "#C8743A"],
    [760, 1300, N.bela],
    [880, 1330, "#E8D8B8"],
    [990, 1310, "#C8743A"],
  ];
  return (
    <Kadar>
      <Pretopi
        od={ljudi - 10}
        prvi={
          <Pretopi
            od={post - 10}
            prvi={
              <Kamera z={mesaj(1.0, 1.05, napredak(f, 0, post))} y={1000}>
                <Pejzaz sezona="jesen" />
                <Kuca x={300} y={980} s={0.55} />
                <Stala x={820} y={990} s={0.62} otvorena={1} />
                <Djeram x={560} y={1010} s={0.5} />
                {kokoske.map(([x, y, b], i) => (
                  <Pop key={i} at={ali + 10 + i * 3} x={x} y={y}>
                    <Kokoska x={0} y={0} s={0.9} seed={50 + i} boja={b} smer={i % 2 ? -1 : 1} kljuca />
                  </Pop>
                ))}
                <Lutka {...SAVA} x={500} y={1330} s={0.6} izraz={f > jaja ? "osmeh" : "zamisljena"} dr={[-60, -40]}
                  drziD={f > jaja - 6 ? <KorpaJaja x={20} y={70} s={0.7} /> : undefined} />
              </Kamera>
            }
            drugi={
              <g>
                <rect x={-200} y={-200} width={1480} height={2400} fill="#EDE3CC" />
                <rect x={-200} y={1250} width={1480} height={800} fill="#B88A5A" />
                <Telefon x={540} y={760} s={1.25} naslov="Domaća jaja sa salaša" mesto="kod Sombora" objavljen={f >= kolu ? 1 : 0}
                  slika={<KorpaJaja x={0} y={90} s={0.85} />} />
              </g>
            }
          />
        }
        drugi={
          <g>
            <Pejzaz sezona="jesen" />
            <Kuca x={820} y={990} s={0.5} />
            <Letve x0={-40} x1={1100} y={1320} h={110} />
            <Lutka {...SAVA} x={700} y={1330} s={0.6} izraz="srecna" pogled={[-1, 0]} lr={[-70, -30]} drziL={<KorpaJaja x={-10} y={70} s={0.6} />} />
            {[
              { cfg: KOMSINICA, x: 380, d: 0 },
              { cfg: CERKA, x: 220, d: 8 },
              { cfg: KOMSIJA, x: 70, d: 16 },
            ].map(({ cfg, x, d }) => {
              const p = napredak(f, ljudi + d, 36);
              return <Lutka key={x} {...cfg} x={mesaj(x - 400, x, p)} y={1330} s={0.54} izraz="osmeh" hod={p < 1 ? f / 4 : undefined} pogled={[1, 0]} />;
            })}
            <ZapisGore redovi={["Ana → Sava · POEN", "Mira → Sava · POEN", "Joca → Sava · POEN"]} kada={[prep, prep + 10, prep + 20]} />
          </g>
        }
      />
    </Kadar>
  );
};

// ── 16: Na proleće Đurika mu je doveo tele. Sava mu je prepisao POENE od jaja. Štala nije prazna. ────
export const Scena16: React.FC = () => {
  const f = useF();
  const dj = kad(16, "đurika");
  const prep = kad(16, "prepisao");
  const stala = kad(16, "štala");
  const ulaz = napredak(f, dj - 10, 60);
  return (
    <Kadar>
      <Pretopi
        od={stala - 14}
        prvi={
          <g>
            <Pejzaz sezona="prolece" />
            <Dud x={140} y={990} s={0.85} sezona="prolece" />
            <Kuca x={430} y={990} s={0.55} />
            <Stala x={860} y={990} s={0.6} otvorena={1} />
            {Array.from({ length: 6 }, (_, i) => (
              <Kokoska key={i} x={100 + i * 90} y={1480 + (i % 2) * 30} s={0.6} seed={60 + i} boja={i % 2 ? "#C8743A" : N.bela} kljuca />
            ))}
            <Lutka {...SAVA} x={260} y={1330} s={0.6} izraz="srecna" pogled={[1, 0]} />
            <Lutka {...DJURIKA} x={mesaj(1200, 760, ulaz)} y={1330} s={0.58} izraz="srecna" hod={ulaz < 1 ? f / 4 : undefined} pogled={[-1, 0]}
              lr={[-50, -30]} drziL={<path d="M0,0 C-40,20 -80,30 -120,40" stroke="#8A6A3A" strokeWidth={6} fill="none" />} />
            <Tele x={mesaj(1060, 560, ulaz)} y={1330} s={0.75} seed={70} smer={-1} hod={ulaz < 1 ? f / 3 : 0} />
            <ZapisGore redovi={["Sava → Đurika · POEN"]} kada={[prep]} />
          </g>
        }
        drugi={
          <Kamera z={mesaj(1.06, 1.0, napredak(f, stala, 90))} y={950}>
            <StalaUnutra toplo={1}>
              <Tele x={540} y={1250} s={0.85} seed={70} />
            </StalaUnutra>
          </Kamera>
        }
      />
    </Kadar>
  );
};

// ── 17: Imaš višak iz dvorišta, iz štale, iz bašte? Neko u tvom kraju ga traži. Postavi oglas na ekolo.rs ─
export const Scena17: React.FC = () => {
  const f = useF();
  const neko = kad(17, "neko");
  const postavi = kad(17, "postavi");
  const mreza = napredak(f, neko, 70);
  const kartica = napredak(f, postavi - 6, 18);
  return (
    <Kadar z={1}>
      <Pretopi
        od={postavi - 8}
        prvi={
          <Pretopi
            od={neko - 10}
            prvi={
              <g>
                <rect x={-200} y={-200} width={1480} height={2400} fill={N.bela} />
                <Pop at={kad(17, "dvorišta")} x={540} y={330}>
                  <Medaljon x={0} y={0} r={190} id="m1">
                    <rect x={-200} y={-200} width={400} height={400} fill="#BFE3F5" />
                    <rect x={-200} y={40} width={400} height={200} fill={N.trava} />
                    <KorpaJaja x={0} y={120} s={1.1} />
                  </Medaljon>
                </Pop>
                <Pop at={kad(17, "štale")} x={290} y={800}>
                  <Medaljon x={0} y={0} r={190} id="m2">
                    <rect x={-200} y={-200} width={400} height={400} fill="#C9A85A" />
                    <KantaMleka x={-40} y={130} s={1.1} />
                    <Sir x={80} y={130} s={0.9} />
                  </Medaljon>
                </Pop>
                <Pop at={kad(17, "bašte")} x={790} y={800}>
                  <Medaljon x={0} y={0} r={190} id="m3">
                    <rect x={-200} y={-200} width={400} height={400} fill="#BFE3F5" />
                    <rect x={-200} y={60} width={400} height={200} fill={N.travaSvetla} />
                    <Gajba x={0} y={130} s={1.2} />
                  </Medaljon>
                </Pop>
              </g>
            }
            drugi={<Karta mreza={mreza} />}
          />
        }
        drugi={
          <g>
            <rect x={-200} y={-200} width={1480} height={2400} fill={N.bela} />
            <g opacity={kartica} transform={`translate(540 600) scale(${0.8 + 0.2 * kartica}) translate(-540 -600)`}>
              <image href={staticFile("kolo-hero-logo.png")} x={340} y={300} width={400} height={419} />
              <text x={540} y={880} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={130} fill={N.zelena}>
                ekolo.rs
              </text>
            </g>
            <Lutka {...SAVA} x={230} y={1330} s={0.68} izraz="srecna" lr={[-150, -20]} />
            <Lutka {...DJURIKA} x={850} y={1330} s={0.68} izraz="srecna" dr={[150, 20]} />
            <Tele x={540} y={1330} s={0.85} seed={70} />
          </g>
        }
      />
    </Kadar>
  );
};
