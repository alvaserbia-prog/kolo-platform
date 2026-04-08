import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/kolo-logo.png";

export const metadata: Metadata = {
  title: "KOLO — Ekonomija koju gradiš sa svojom zajednicom",
  description:
    "KOLO je sistem u kome tvoj doprinos ima vrednost. POEN beleži šta si dao zajednici. ZRNO ti daje glas u odlukama koje je oblikuju.",
  openGraph: {
    title: "KOLO — Ekonomija koju gradiš sa svojom zajednicom",
    description:
      "KOLO je sistem uzajamnosti kroz mrežu lokalnih zadruga. Članstvo je besplatno.",
    locale: "sr_RS",
    type: "website",
  },
};

// ── Live statistike (lako za kasniji refresh) ─────────────────────────────────

async function ucitajStatistike() {
  const [clanovi, banka] = await Promise.all([
    prisma.user.count({ where: { verified: true } }),
    prisma.wallet.findUnique({
      where: { id: "banka-singleton" },
      select: { balance: true },
    }),
  ]);
  return {
    clanovi,
    opticaj: banka ? Math.abs(banka.balance) : 0,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const { clanovi, opticaj } = await ucitajStatistike();

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-kolo-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src={logoImg} alt="KOLO" width={36} height={25} style={{ height: "auto" }} />
            <span className="font-bold text-kolo-green-900 text-lg tracking-tight">KOLO</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/kako-funkcionise" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">Kako funkcioniše</Link>
            <a href="#transparentnost" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">Transparentnost</a>
            <a href="#sta-kolo-nije" className="text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors">Šta KOLO nije</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
              Prijavi se
            </Link>
            <Link href="/registracija"
              className="px-4 py-2 bg-kolo-gold-600 text-white text-sm font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors">
              Pridruži se
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Tekst */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
                Ekonomija koju gradiš{" "}
                <span className="text-kolo-gold-400">sa svojom zajednicom</span>
              </h1>
              <p className="text-green-200 text-lg leading-relaxed mb-8 max-w-lg">
                KOLO je sistem u kome tvoj doprinos ima vrednost. POEN beleži šta si
                dao zajednici. ZRNO ti daje glas u odlukama koje je oblikuju.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/registracija"
                  className="px-7 py-3.5 bg-kolo-gold-600 text-white font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors text-sm">
                  Pridruži se
                </Link>
                <Link href="/kako-funkcionise"
                  className="px-7 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Kako funkcioniše
                </Link>
              </div>

              {/* Alpha statistike */}
              <div className="mt-10 flex flex-wrap gap-3">
                <StatChip label="Alpha faza" />
                <StatChip label={`${clanovi.toLocaleString("sr-RS")} verifikovanih članova`} />
                <StatChip label={`${opticaj.toLocaleString("sr-RS")} POEN u opticaju`} />
              </div>
            </div>

            {/* Ilustracija — KOLO logo */}
            <div className="flex items-center justify-center">
              <Image
                src={logoImg}
                alt="KOLO zajednica"
                width={360}
                height={245}
                style={{ height: "auto", filter: "brightness(0) invert(1)" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ────────────────────────────────────────────────── */}
      <section className="dotted-bg bg-kolo-bg">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <span className="text-xs font-bold tracking-widest text-kolo-green-700 uppercase">Problem</span>
          <p className="mt-4 text-xl md:text-2xl font-semibold text-kolo-green-900 leading-relaxed">
            Tegla meda u marketu košta 800 dinara. Tegla meda od komšije košta isto 800 dinara.
            Ista cena, drugačiji med i potpuno drugačija stvar. U jednom slučaju tvoj novac odlazi u lanac
            koji završava van tvog grada, tvoje zemlje, tvog vidokruga. U drugom ostaje između tebe i čoveka
            koga poznaješ.
          </p>
          <p className="mt-6 text-kolo-muted text-base leading-relaxed">
            Ekonomska pravila donosi neko drugi. Ti ih poštuješ, prilagođavaš im se, snosiš njihove posledice —
            ali nemaš nijedan način da na njih utičeš. Bez obzira na to da li si zaposlen, nezaposlen,
            penzioner ili preduzetnik — nisi za stolom gde se odlučuje.
          </p>
        </div>
      </section>

      {/* ── ALTERNATIVA ────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="border-l-4 border-kolo-green-700 pl-6">
            <span className="text-xs font-bold tracking-widest text-kolo-green-700 uppercase">KOLO ti daje alternativu</span>
            <p className="mt-4 text-lg md:text-xl text-kolo-green-900 leading-relaxed">
              U KOLO sistemu tvoj doprinos ima konkretnu vrednost — za ono što radiš dobijaš POEN,
              a POEN trošiš na ono što ti treba. Kroz ZRNO učestvuješ u odlučivanju — koji projekti
              se pokreću, kako se resursi koriste, kuda sistem ide. Pravila su javna. Odluke su zajedničke.
              Sistem radi za članove, ne od članova.
            </p>
          </div>
        </div>
      </section>

      {/* ── KAKO FUNKCIONIŠE ───────────────────────────────────────── */}
      <section className="dotted-bg bg-kolo-bg">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-kolo-green-900 text-center mb-12" style={{ letterSpacing: "-0.02em" }}>
            Kako KOLO funkcioniše?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <KarticaKoraka
              broj="01"
              naslov="Doprinesi zajednici"
              stavke={[
                "Verifikacijom identiteta zarađuješ 1.000 POEN",
                "Preporukama novih članova dobijate nagrade",
                "Donacijama Fondaciji povećavaš vrednost sistema",
              ]}
            />
            <KarticaKoraka
              broj="02"
              naslov="Trguj i razmenjuj"
              stavke={[
                "Na Pijaci prodaješ robu i usluge za POEN",
                "Kupuješ od drugih članova — bez provizije",
                "Direktna razmena bez posrednika",
              ]}
            />
            <KarticaKoraka
              broj="03"
              naslov="Upravljaj sistemom"
              stavke={[
                "Kupi ZRNO od Banke za POEN",
                "Zaključaj ZRNO i dobij pravo glasa",
                "Predlaži i glasaj o pravcima razvoja",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── PROGRAMI ───────────────────────────────────────────────── */}
      <section className="bg-kolo-gold-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
              Programi Banke
            </h2>
            <p className="text-kolo-muted text-sm max-w-lg mx-auto">
              KOLO Banka emituje POEN kroz programe koji nagrađuju doprinos zajednici.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KarticaPrograma
              ikona="✓"
              naslov="Verifikacija"
              opis="1.000 POEN jednokratno za svaki novi verifikovani nalog."
            />
            <KarticaPrograma
              ikona="→"
              naslov="Preporuke"
              opis="Od 1.000 do 15.000 POEN po preporučenom članu, po tabeli nagrada."
            />
            <KarticaPrograma
              ikona="♥"
              naslov="Donacije"
              opis="Kurs POEN/RSD raste sa kumulativnom donacijom Fondaciji — 7 nivoa."
            />
            <KarticaPrograma
              ikona="🏡"
              naslov="Programi podrške"
              opis="Dnevna emisija za majke, starije, osobe sa posebnim potrebama i školovanje."
              locked
            />
          </div>
        </div>
      </section>

      {/* ── MIKRO PRIMER ───────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="bg-kolo-green-100 rounded-2xl p-8 border border-kolo-green-500/20">
            <span className="text-xs font-bold tracking-widest text-kolo-green-700 uppercase">Primer iz prakse</span>
            <p className="mt-4 text-kolo-green-900 leading-relaxed">
              Ana ima pčelinjak i napravi 10 tegli meda. Milan iz iste zajednice joj plati{" "}
              <strong>8.000 POEN</strong> i odnese med kući. Ana je svoj rad razmenila direktno,
              bez provizije, bez posrednika, sa čovekom koga poznaje.
            </p>
            <p className="mt-3 text-kolo-green-900 leading-relaxed">
              POEN koji je zaradila može da potroši na povrće od Jovane, popravku bojlera od Marka,
              ili da zaključa ZRNO i dobije pravo glasa u zajednici.{" "}
              <strong>Isti rad, ista vrednost — ali ostaje u krugu ljudi koji se međusobno znaju.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENTNOST ────────────────────────────────────────── */}
      <section id="transparentnost" className="dotted-bg bg-kolo-bg">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            Potpuna transparentnost
          </h2>
          <p className="text-kolo-muted mb-8">
            Svako može u svakom trenutku da proveri stanje sistema.
          </p>
          <div className="space-y-3">
            {[
              "Tačan balans svakog računa u svakom trenutku",
              "Kompletna istorija svih transakcija",
              "Sva pravila sistema su javna i dostupna u Pravilniku",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-kolo-green-700 flex items-center justify-center shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-kolo-text">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ŠTA KOLO NIJE ──────────────────────────────────────────── */}
      <section id="sta-kolo-nije" className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
              Šta KOLO nije
            </h2>
            <p className="text-kolo-muted max-w-lg mx-auto">
              Pre nego što nastaviš — jasno da znaš šta KOLO nije.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                naslov: "Nije piramidalna šema",
                opis: "Nema nivoa ispod tebe. Nema provizije od tuđih doprinosa. Nema &bdquo;investicije&ldquo; koja se množi.",
              },
              {
                naslov: "Nije kriptovaluta",
                opis: "POEN nije token, ne trguje se na berzama, nema špekulativnu vrednost. POEN je interna evidencija doprinosa.",
              },
              {
                naslov: "Ne obećava brzu zaradu",
                opis: "KOLO nudi održiv sistem razmene između ljudi koji se međusobno poznaju — ne get-rich-quick shemu.",
              },
            ].map((s) => (
              <div key={s.naslov} className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 2l6 6M8 2l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-red-700 text-sm">{s.naslov}</p>
                </div>
                <p className="text-sm text-red-600 leading-relaxed">{s.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="dotted-bg bg-kolo-bg">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-kolo-green-900 mb-8" style={{ letterSpacing: "-0.02em" }}>
            Često postavljana pitanja
          </h2>
          <div className="space-y-3">
            {[
              {
                p: "Da li KOLO zamenjuje dinar?",
                o: "Ne. KOLO je komplement postojećoj ekonomiji za razmenu unutar zajednice, ne zamena zvaničnom platnom sredstvu.",
              },
              {
                p: "Šta se dešava ako želim da izađem iz sistema?",
                o: "Možeš izaći u svakom trenutku. POEN i ZRNO koje poseduješ ostaju evidentirani. Napuštanjem zadruge ne gubiš ništa što si stekao.",
              },
              {
                p: "Ko kontroliše KOLO Banku?",
                o: "Banka je softverski protokol koji radi po javnim pravilima iz Pravilnika. Niko je ne kontroliše individualno. U kasnijoj fazi, odluke donosi Gornje Kolo kroz glasanje ZRNOM.",
              },
              {
                p: "Da li plaćam porez na POEN?",
                o: "POEN je interna evidencija doprinosa, ne zakonsko sredstvo plaćanja. Pravna pitanja se razmatraju sa stručnjacima kako sistem raste. Alpha faza služi i tome.",
              },
            ].map((faq) => (
              <details key={faq.p} className="bg-white rounded-2xl card-shadow group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-kolo-text hover:text-kolo-green-700 transition-colors">
                  {faq.p}
                  <span className="ml-4 shrink-0 text-kolo-muted group-open:rotate-180 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-5 text-kolo-muted text-sm leading-relaxed">
                  {faq.o}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── VELIKI CITAT ───────────────────────────────────────────── */}
      <section className="bg-kolo-bg border-t border-kolo-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-lg text-kolo-muted mb-6">Ekonomija može da radi i za tebe.</p>
          <p className="text-3xl md:text-4xl font-bold text-kolo-green-900 leading-tight" style={{ letterSpacing: "-0.02em" }}>
            KOLO je sistem u kome{" "}
            <span className="text-kolo-gold-600">tvoj doprinos</span> ima vrednost,{" "}
            <span className="text-kolo-gold-600">tvoj glas</span> ima težinu, i{" "}
            <span className="text-kolo-gold-600">tvoja zajednica</span> zadržava ono što stvori.
          </p>
        </div>
      </section>

      {/* ── ZAVRŠNI CTA ────────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 text-white">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-3">Prva grupa članova se trenutno formira</h2>
          <p className="text-green-200 text-sm mb-8">
            Postani deo zajednice koja gradi alternativni sistem razmene — transparentno, jednostavno i zajedno.
          </p>
          <Link href="/registracija"
            className="inline-block px-8 py-4 bg-kolo-gold-600 text-white font-bold rounded-xl hover:bg-kolo-gold-400 transition-colors">
            Registruj se besplatno →
          </Link>
          <p className="mt-4 text-xs text-green-300">
            Članstvo je besplatno. Verifikacijom dobijaš 1.000 POEN bonusa.
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-kolo-green-900 border-t border-white/10 text-green-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src={logoImg} alt="KOLO" width={28} height={19} style={{ height: "auto", filter: "brightness(0) invert(1)" }} />
                <span className="font-bold text-white">KOLO</span>
              </div>
              <p className="text-sm text-green-300 leading-relaxed">
                Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajednici.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-green-400 uppercase mb-4">Sistem</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/kako-funkcionise" className="hover:text-white transition-colors">Kako funkcioniše</Link></li>
                <li><a href="#transparentnost" className="hover:text-white transition-colors">Transparentnost</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pravilnik {/* TODO: /pravilnik */}</a></li>
                <li><a href="#sta-kolo-nije" className="hover:text-white transition-colors">Šta KOLO nije</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-green-400 uppercase mb-4">Zajednica</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pijaca" className="hover:text-white transition-colors">Pijaca</Link></li>
                <li><Link href="/kako-funkcionise#zadruge" className="hover:text-white transition-colors">Zadruge</Link></li>
                <li><Link href="/kako-funkcionise#programi" className="hover:text-white transition-colors">Programi</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-green-400 uppercase mb-4">Informacije</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">O Fondaciji {/* TODO */}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt {/* TODO */}</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-xs text-green-400 text-center">
            © 2026 KOLO · Alternativni ekonomski sistem · Alfa faza
          </div>
        </div>
      </footer>

    </div>
  );
}

// ── Pomoćne komponente ────────────────────────────────────────────────────────

function StatChip({ label }: { label: string }) {
  return (
    <span className="inline-block bg-white/10 border border-white/20 text-green-100 text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
    </span>
  );
}

function KarticaKoraka({ broj, naslov, stavke }: { broj: string; naslov: string; stavke: string[] }) {
  return (
    <div className="bg-white rounded-2xl card-shadow-md p-6">
      <div className="w-11 h-11 rounded-full bg-kolo-gold-600 text-white flex items-center justify-center font-bold text-sm mb-4">
        {broj}
      </div>
      <h3 className="font-bold text-kolo-green-900 mb-4">{naslov}</h3>
      <ul className="space-y-2.5">
        {stavke.map((s) => (
          <li key={s} className="flex items-start gap-2.5 text-sm text-kolo-muted">
            <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="7" fill="#E8F5EC"/>
              <path d="M4 7l2 2 4-4" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function KarticaPrograma({ ikona, naslov, opis, locked }: { ikona: string; naslov: string; opis: string; locked?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl card-shadow p-5 ${locked ? "opacity-60" : ""}`}>
      <div className="w-10 h-10 rounded-xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center text-lg mb-3 font-bold">
        {locked ? "🔒" : ikona}
      </div>
      <p className="font-semibold text-kolo-text text-sm mb-1">{naslov}</p>
      <p className="text-xs text-kolo-muted leading-relaxed">{opis}</p>
    </div>
  );
}
