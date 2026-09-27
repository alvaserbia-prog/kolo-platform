// Scene videa „Poznaješ li nekoga u KOLU?“ (naiva). Animacije se kače na izgovorene reči.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Boja, Cvet, DrvoN, Kadar, Kamera, KucaN, Livada, N, Nebo, OgradaN, Pop, elipsa, kutija, mesaj, napredak, useF, usePop } from "./naiva";
import { DRAGAN, JOVANA, Lutka, SOFIJA, VERA } from "./lutke";
import { Cepanica, EkranKod, EkranOglas, EkranPotvrde, Panj, Sekira, Soljica, TelefonN, Upitnik, ZapisN, ZeleniKrug, ZnakUVencu } from "./stvari";
import { kad, trajanjeF } from "./vreme";
import { OBLO, SANS } from "../fontovi";

const govor = (f: number, od: number, n: number) => (f >= od && f < od + n ? Math.abs(Math.sin((f - od) * 0.5)) * 0.8 : 0);
const MaliTelefon: React.FC<{ s?: number }> = ({ s = 0.26 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-160} y={-310} width={320} height={620} rx={46} fill={N.plava} stroke={N.kontura} strokeWidth={6} />
    <rect x={-134} y={-272} width={268} height={544} rx={18} fill="#FFFDF7" />
    <rect x={-134} y={-272} width={268} height={62} rx={18} fill={N.zelena} />
  </g>
);

// ── 1 ── Ne poznaješ nikoga u KOLU? Nije problem.
export const Scena1: React.FC = () => {
  const f = useF();
  const kNije = kad(1, "Nije");
  const vedro = napredak(f, kNije, 10);
  const cese = f < kNije ? Math.sin(f * 0.6) * 10 : 0;
  const z = interpolate(f, [0, trajanjeF(1)], [1.05, 1.12]);
  return (
    <Kadar>
      <Kamera y={980} z={z}>
        <Nebo f={f} />
        <DrvoN x={940} y={1180} s={1.2} seed="d1" />
        <KucaN x={290} y={1170} s={1.25} />
        <OgradaN x0={560} x1={1100} y={1180} h={150} />
        <Livada y={1160} h={800} seed="l1" f={f} />
        <Lutka
          x={620}
          y={1420}
          s={1.35}
          {...DRAGAN}
          izraz={vedro > 0.5 ? "srecna" : "zamisljena"}
          pogled={vedro > 0.5 ? [0, 0] : [-0.6, 0.6]}
          dr={vedro > 0.5 ? [30, 20] : [170, 34 + cese]}
          lr={[30, 70]}
          drziL={<MaliTelefon />}
          drziLRot={-10}
        />
      </Kamera>
      {[
        [420, 560, 0],
        [620, 470, 6],
        [800, 580, 12],
      ].map(([x, y, d], i) =>
        f < kNije + 4 ? (
          <Pop key={i} at={4 + d} x={x} y={y + Math.sin((f + i * 20) / 12) * 10}>
            <Upitnik s={1 - vedro} boja={[N.plava, N.crvena, N.ljubicasta][i]} />
          </Pop>
        ) : null,
      )}
    </Kadar>
  );
};

/** Slika u ramu (za podeljen ekran). */
const Slika: React.FC<{ x: number; y: number; w: number; h: number; id: string; natpis: string; children: React.ReactNode; tamnije?: number }> = ({ x, y, w, h, id, natpis, children, tamnije = 0 }) => (
  <g>
    <defs>
      <clipPath id={`sl${id}`}>
        <rect x={x} y={y} width={w} height={h} rx={8} />
      </clipPath>
    </defs>
    <rect x={x - 18} y={y - 18} width={w + 36} height={h + 36} rx={14} fill={N.zuta} stroke={N.kontura} strokeWidth={4} filter="url(#nMekoSenka)" />
    <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={10} fill="none" stroke={N.crvena} strokeWidth={4} strokeDasharray="12 8" />
    <g clipPath={`url(#sl${id})`}>
      {children}
      {tamnije > 0 && <rect x={x} y={y} width={w} height={h} fill="#1B2F6B" opacity={tamnije} />}
    </g>
    <rect x={x + w / 2 - 170} y={y + h + 28} width={340} height={64} rx={32} fill={N.bela} stroke={N.kontura} strokeWidth={3} />
    <text x={x + w / 2} y={y + h + 72} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={34} fill={N.plava}>
      {natpis}
    </text>
  </g>
);

// ── 2 ── Jovana poznaje komšinicu Veru, koja je već u KOLU. Jovana joj pokaže svoj kod,
//        Vera je potvrdi i Jovana je unutra.
export const Scena2: React.FC = () => {
  const f = useF();
  const kPokaze = kad(2, "pokaže");
  const kVera = kad(2, "Vera");
  const kUnutra = kad(2, "unutra");
  const ulaz = napredak(f, 0, 18, Easing.out(Easing.back(1.3)));
  const podize = napredak(f, kPokaze - 4, 10);
  const vera = napredak(f, kVera - 2, 10);
  const krug = napredak(f, kUnutra - 6, 16);
  return (
    <Kadar>
      <rect x={0} y={0} width={1080} height={1920} fill="#FDF3DA" />
      {Array.from({ length: 30 }, (_, i) => (
        <Cvet key={i} x={60 + (i % 6) * 190} y={380 + Math.floor(i / 6) * 260 + (i % 2) * 60} s={1.3} boja={[N.roze, N.zuta, N.plavaSvetla][i % 3]} f={f} />
      ))}
      <g transform={`translate(0 ${(1 - ulaz) * 900})`}>
        <Slika x={48} y={380} w={470} h={860} id="lev" natpis="Poznaje nekoga">
          <Nebo f={f} sunce={[430, 470]} />
          <OgradaN x0={40} x1={560} y={1100} h={140} />
          <Livada y={1080} h={300} seed="l2" f={f} gusto={0.6} />
          <ZeleniKrug x={170} y={1180} s={0.75} p={krug} visina={520} />
          <Lutka x={170} y={1180} s={0.85} {...JOVANA} izraz={krug > 0.5 ? "srecna" : "osmeh"} pogled={[1, 0]} dr={[mesaj(-14, 130, podize), mesaj(-10, 30, podize)]} drziD={podize > 0.2 ? <MaliTelefon s={0.3} /> : undefined} />
          <Lutka x={400} y={1150} s={0.8} {...VERA} izraz="srecna" pogled={[-1, 0]} lr={[mesaj(14, -130, vera), mesaj(10, -30, vera)]} drziL={vera > 0.2 ? <MaliTelefon s={0.28} /> : undefined} />
          {vera > 0.6 && krug < 0.5 && <path d="M330,780 L260,800" stroke={N.zelena} strokeWidth={8} strokeDasharray="14 10" />}
        </Slika>
        <Slika x={562} y={380} w={470} h={860} id="des" natpis="Ne poznaje nikoga" tamnije={0.18}>
          <Nebo f={f} sunce={null} />
          <DrvoN x={940} y={1080} s={0.8} seed="d2" />
          <Livada y={1080} h={300} seed="l3" f={f} gusto={0.6} />
          <Lutka x={790} y={1180} s={0.85} {...DRAGAN} izraz="zamisljena" pogled={[0, 0.6]} lr={[30, 70]} drziL={<MaliTelefon s={0.3} />} />
          <g transform={`translate(890 ${700 + Math.sin(f / 14) * 8})`}>
            <Upitnik s={0.9} />
          </g>
        </Slika>
      </g>
    </Kadar>
  );
};

// ── 3 ── Dragan ne poznaje nikoga, zato prvo postavi oglas. Cepa drva. Javi mu se Sofija iz susedne ulice.
const SlikaDrva: React.FC = () => (
  <g>
    {[-60, -20, 20, 60].map((x, i) => (
      <g key={x} transform={`translate(${x} ${40 - (i % 2) * 10})`}>
        <Cepanica s={0.6} />
      </g>
    ))}
    <g transform="translate(40 50) rotate(20)">
      <Sekira />
    </g>
  </g>
);

export const Scena3: React.FC = () => {
  const f = useF();
  const kPostavi = kad(3, "postavi");
  const kOglas = kad(3, "oglas");
  const kCepa = kad(3, "Cepa");
  const kJavi = kad(3, "Javi");
  const kSofija = kad(3, "Sofija");
  const siri = napredak(f, 0, 16);
  const telefon = usePop(kPostavi - 12, 120, 12);
  const slova = interpolate(f, [kPostavi, kOglas], [0, 11], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const poruka = usePop(kJavi, 150, 11);
  const kuca = napredak(f, kSofija - 6, 16);
  const x0 = mesaj(562, 0, siri);
  const w = mesaj(470, 1080, siri);
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#FDF3DA" />
      <defs>
        <clipPath id="s3clip">
          <rect x={x0} y={mesaj(380, 0, siri)} width={w} height={mesaj(860, 1920, siri)} />
        </clipPath>
      </defs>
      <g clipPath="url(#s3clip)">
        <Nebo f={f} sunce={[180, 520]} />
        <g transform={`translate(${mesaj(1300, 860, kuca)} 0)`}>
          <KucaN x={0} y={1120} s={0.9} zid="#FCE6C8" prozorLik={<Lutka x={0} y={170} s={0.36} {...SOFIJA} dr={[150 + Math.sin(f * 0.4) * 20, 20]} izraz="srecna" />} />
        </g>
        <Livada y={1110} h={850} seed="l4" f={f} />
        <Lutka x={mesaj(790, 300, siri)} y={1450} s={mesaj(0.85, 1.3, siri)} {...DRAGAN} izraz={f > kJavi ? "srecna" : "osmeh"} pogled={[1, 0]} lr={[30, 70]} dr={[60, 40]} />
      </g>
      {f >= kPostavi - 12 && (
        <g transform={`translate(700 ${820 + (1 - telefon) * 300}) scale(${telefon}) rotate(${(1 - telefon) * 8})`}>
          <TelefonN s={1.12}>
            <EkranOglas naslov="Cepam drva" slova={slova} slika={<SlikaDrva />} objavljeno={napredak(f, kOglas - 2, 14)} kursor={f < kOglas && Math.floor(f / 8) % 2 === 0} />
          </TelefonN>
          {f >= kJavi && (
            <g transform={`translate(-60 ${-360}) scale(${poruka})`} filter="url(#nMekoSenka)">
              <Boja d={kutija(-230, -70, 460, 140, 34)} boja={N.bela} debljina={3} />
              <path d="M40,68 L70,110 L90,66Z" fill={N.bela} stroke={N.kontura} strokeWidth={3} />
              <circle cx={-180} cy={0} r={38} fill={N.ljubicasta} stroke={N.kontura} strokeWidth={3} />
              <text x={-180} y={14} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={40} fill="#fff">
                S
              </text>
              <text x={-126} y={-14} fontFamily={SANS} fontWeight={900} fontSize={28} fill={N.kontura}>
                Sofija
              </text>
              <text x={-126} y={26} fontFamily={SANS} fontWeight={700} fontSize={25} fill="#5b5146">
                Dobar dan! Treba mi…
              </text>
            </g>
          )}
        </g>
      )}
      {f >= kCepa - 2 && f < kJavi + 6 && (
        <Pop at={kCepa - 2} x={330} y={620}>
          <Boja d={elipsa(0, 0, 150)} boja={N.bela} debljina={4} />
          <g transform="translate(0 70) scale(1.2)">
            <Panj />
            <g transform={`translate(0 -80) rotate(${Math.sin(f * 0.5) * 30 - 10})`}>
              <g transform="translate(-10 0)">
                <Sekira />
              </g>
            </g>
          </g>
        </Pop>
      )}
    </Kadar>
  );
};

// ── 4 ── Dragan joj iscepa drva, ona mu prepiše POENE. On joj pokaže svoj kod i ona ga potvrdi.
export const Scena4: React.FC = () => {
  const f = useF();
  const kOna = kad(4, "ona");
  const kPrepise = kad(4, "prepiše");
  const kOn = kad(4, "On");
  const kPotvrdi = kad(4, "potvrdi");
  const cepa = f < kOna;
  const faza = (f % 18) / 18;
  const udarac = cepa ? Math.sin(faza * Math.PI * 2) : 0;
  const zapis = usePop(kPrepise, 140, 11);
  const kod = napredak(f, kOn - 4, 12);
  const krug = napredak(f, kPotvrdi - 4, 18);
  const brojCepanica = Math.min(6, Math.floor(f / 18));
  return (
    <Kadar>
      <Nebo f={f} sunce={[880, 500]} />
      <KucaN x={880} y={1130} s={0.9} zid="#FCE6C8" />
      <OgradaN x0={-20} x1={560} y={1140} h={140} />
      <Livada y={1120} h={850} seed="l5" f={f} gusto={0.7} />
      {/* gomila cepanica raste */}
      {Array.from({ length: brojCepanica }, (_, i) => (
        <g key={i} transform={`translate(${150 + (i % 3) * 52} ${1400 - Math.floor(i / 3) * 70})`}>
          <Cepanica s={0.8} />
        </g>
      ))}
      <g transform="translate(380 1420)">
        <Panj />
      </g>
      <ZeleniKrug x={420} y={1440} s={1.05} p={krug} />
      <Lutka
        x={420}
        y={1440}
        s={1.15}
        {...DRAGAN}
        izraz={krug > 0.5 ? "srecna" : "osmeh"}
        pogled={[0.6, 0]}
        dr={cepa ? [mesaj(170, 60, (udarac + 1) / 2), 10] : [mesaj(-14, 100, kod), mesaj(-10, 30, kod)]}
        drziD={cepa ? <Sekira /> : kod > 0.2 ? <MaliTelefon s={0.3} /> : undefined}
        drziDRot={cepa ? 180 : 0}
      />
      <Lutka
        x={800}
        y={1450}
        s={1.1}
        {...SOFIJA}
        izraz="srecna"
        pogled={[-1, 0]}
        lr={f >= kOn ? [mesaj(14, -110, kod), mesaj(10, -30, kod)] : [20, 90]}
        drziL={f >= kOn ? (kod > 0.2 ? <MaliTelefon s={0.3} /> : undefined) : <Soljica />}
      />
      {f >= kPrepise && f < kOn + 4 && (
        <g transform={`translate(540 640) scale(${zapis})`}>
          <ZapisN od="Sofija" ka="Dragan" />
        </g>
      )}
      {f >= kOn + 10 && (
        <Pop at={kOn + 10} x={540} y={720}>
          <g transform="translate(-200 0)">
            <TelefonN s={0.78}>
              <EkranKod pseudonim="dragan.cepa" />
            </TelefonN>
          </g>
          <g transform="translate(200 0)">
            <TelefonN s={0.78}>
              <EkranPotvrde pseudonim="dragan.cepa" kvacica={f >= kPotvrdi - 12 ? 1 : 0} pritisak={napredak(f, kPotvrdi - 4, 8)} gotovo={f >= kPotvrdi + 4 ? 1 : 0} />
            </TelefonN>
          </g>
        </Pop>
      )}
    </Kadar>
  );
};

// ── 5 ── Jedne poznaješ od ranije, druge upoznaš kroz razmenu. I tako postaješ deo KOLA.
export const Scena5: React.FC = () => {
  const f = useF();
  const kJedne = kad(5, "Jedne");
  const kDruge = kad(5, "druge");
  const kI = kad(5, "I");
  const levi = napredak(f, kJedne - 6, 20, Easing.out(Easing.cubic));
  const desni = napredak(f, kDruge - 6, 20, Easing.out(Easing.cubic));
  const kolo = napredak(f, kI - 4, 18);
  const ugao = Math.max(0, f - kI) * 1.4;
  const likovi = [JOVANA, VERA, SOFIJA, DRAGAN];
  const pocetni: [number, number][] = [
    [mesaj(-200, 250, levi), 1460],
    [mesaj(-60, 430, levi), 1460],
    [mesaj(1260, 650, desni), 1460],
    [mesaj(1400, 830, desni), 1460],
  ];
  const pozicije = likovi.map((_, i) => {
    const a = ((ugao + i * 90 + 200) * Math.PI) / 180;
    const kx = 540 + Math.cos(a) * 280;
    const ky = 1380 + Math.sin(a) * 90;
    return [mesaj(pocetni[i][0], kx, kolo), mesaj(pocetni[i][1], ky, kolo), Math.sin(a)] as [number, number, number];
  });
  const red = [0, 1, 2, 3].sort((a, b) => pozicije[a][1] - pozicije[b][1]);
  return (
    <Kadar>
      <Nebo f={f} sunce={[540, 560]} />
      <DrvoN x={110} y={1150} s={1.1} seed="d5" />
      <DrvoN x={980} y={1150} s={1.1} seed="d6" plod={N.zuta} />
      <Livada y={1130} h={850} seed="l6" f={f} />
      <ellipse cx={540} cy={1380} rx={300 * kolo} ry={96 * kolo} fill={N.zelenaSvetla} opacity={0.35 * kolo} filter="url(#nSjaj)" />
      {red.map((i) => {
        const [x, y] = pozicije[i];
        const hod = kolo > 0 ? f / 3 + i : levi < 1 && i < 2 ? f / 3 : desni < 1 && i >= 2 ? f / 3 : undefined;
        return <Lutka key={i} x={x} y={y} s={0.95 * (0.9 + 0.1 * (y - 1290) / 180)} {...likovi[i]} izraz="srecna" lr={kolo > 0.5 ? [-80, 0] : [14, 10]} dr={kolo > 0.5 ? [80, 0] : [-14, -10]} hod={hod} />;
      })}
      {kolo > 0 &&
        Array.from({ length: 16 }, (_, i) => {
          const t = Math.max(0, f - kI) / 30;
          return <Cvet key={i} x={140 + ((i * 53) % 800)} y={500 + ((t * 160 + i * 97) % 700)} s={1.6} boja={[N.crvena, N.zuta, N.bela, N.roze][i % 4]} f={f} />;
        })}
    </Kadar>
  );
};

// ── 6 ── Pridruži se besplatno i postavi prvi oglas. Neko iz tvog kraja će ti se javiti. ekolo.rs
export const Scena6: React.FC = () => {
  const f = useF();
  const kPostavi = kad(6, "postavi");
  const kNeko = kad(6, "Neko");
  const kEkolo = kad(6, "ekolo.rs");
  const kraj = napredak(f, kEkolo - 12, 14);
  const telefon = usePop(0, 120, 12);
  const adresa = usePop(kEkolo - 2, 160, 11);
  const dugme = usePop(kEkolo + 8, 160, 11);
  const kuce: [number, number][] = [
    [170, 620],
    [900, 620],
    [150, 1060],
    [930, 1080],
    [540, 1250],
  ];
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#FDF3DA" />
      {Array.from({ length: 24 }, (_, i) => (
        <Cvet key={i} x={60 + (i % 6) * 190} y={380 + Math.floor(i / 6) * 300 + (i % 2) * 70} s={1.2} boja={[N.roze, N.zuta, N.plavaSvetla][i % 3]} f={f} />
      ))}
      {kraj < 1 && (
        <g opacity={1 - kraj}>
          {kuce.map(([x, y], i) => (
            <Pop key={i} at={kNeko + i * 4} x={x} y={y}>
              <KucaN x={0} y={0} s={0.34} />
              <g transform={`translate(40 -170) scale(${Math.min(1, Math.max(0, (f - kNeko - i * 4 - 8) / 8))})`}>
                <Boja d={kutija(-44, -34, 88, 60, 18)} boja={N.bela} debljina={3} />
                <path d="M-10,24 L-20,44 L6,26Z" fill={N.bela} stroke={N.kontura} strokeWidth={3} />
                <text y={10} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={30} fill={N.zelena}>
                  …
                </text>
              </g>
            </Pop>
          ))}
          <g transform={`translate(540 ${880 + (1 - telefon) * 400}) scale(${1.15 * telefon})`}>
            <TelefonN>
              <EkranOglas naslov="" slova={0} objavljeno={0} prazno kursor={Math.floor(f / 12) % 2 === 0 && f >= kPostavi} />
            </TelefonN>
          </g>
        </g>
      )}
      {kraj > 0 && (
        <g opacity={kraj}>
          <Livada y={1450} h={500} seed="l7" f={f} gusto={0.5} />
          <g transform="translate(540 760)">
            <ZnakUVencu vel={330} f={f} />
          </g>
          <g transform={`translate(540 1175) scale(${adresa})`}>
            <text textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={150} fill={N.zelena} stroke={N.bela} strokeWidth={10} paintOrder="stroke">
              ekolo.rs
            </text>
          </g>
          <g transform={`translate(540 1290) scale(${dugme})`} filter="url(#nMekoSenka)">
            <rect x={-300} y={-52} width={600} height={104} rx={52} fill={N.crvena} stroke={N.kontura} strokeWidth={4} />
            <rect x={-288} y={-40} width={576} height={80} rx={40} fill="none" stroke={N.zuta} strokeWidth={4} strokeDasharray="10 8" />
            <text y={18} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={52} fill={N.bela}>
              Postavi prvi oglas
            </text>
          </g>
        </g>
      )}
    </Kadar>
  );
};

export const SCENE = [Scena1, Scena2, Scena3, Scena4, Scena5, Scena6];
