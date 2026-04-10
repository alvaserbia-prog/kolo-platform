import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";
import PublicHeader from "@/components/PublicHeader";

export const metadata: Metadata = {
  title: "KOLO — Ekonomija koju gradiš sa svojom zajednicom",
  description:
    "KOLO je sistem u kome tvoj doprinos ima vrednost. POEN beleži šta si dao zajednici. ZRNO ti daje glas u odlukama koje je oblikuju.",
  openGraph: {
    title: "KOLO — Ekonomija koju gradiš sa svojom zajednicom",
    description: "KOLO je sistem uzajamnosti kroz mrežu lokalnih zadruga. Članstvo je besplatno.",
    locale: "sr_RS",
    type: "website",
  },
};

async function ucitajStatistike() {
  const [clanovi, banka] = await Promise.all([
    prisma.user.count({ where: { verified: true } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
  ]);
  return { clanovi, opticaj: banka ? Math.abs(banka.balance) : 0 };
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const { clanovi, opticaj } = await ucitajStatistike();

  return (
    <div className="min-h-screen bg-kolo-bg">

      <PublicHeader />

      {/* ── SADRŽAJ ────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 pb-20">

        {/* HERO */}
        <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-[1fr_220px] gap-10 items-center">
            <div className="max-w-lg">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
                Ekonomija koju gradiš{" "}
                <span className="text-kolo-gold-400">sa svojom zajednicom</span>
              </h1>
              <p className="text-white/70 leading-relaxed mb-7">
                KOLO je sistem u kome tvoj doprinos ima vrednost. POEN beleži šta si dao zajednici.
                ZRNO ti daje glas u odlukama koje je oblikuju.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/registracija"
                  className="px-6 py-3 bg-kolo-gold-600 text-white font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors text-sm">
                  Pridruži se
                </Link>
                <Link href="/kako-funkcionise"
                  className="px-6 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Kako funkcioniše
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kolo-hero-logo.png"
                alt="KOLO"
                style={{ width: 190, height: "auto", opacity: 0.97 }}
              />
            </div>
          </div>
        </section>

        {/* STATISTIKE */}
        <section className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl card-shadow p-5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p className="text-2xl font-bold text-kolo-text leading-none">{clanovi.toLocaleString("sr-RS")}</p>
            <p className="text-sm text-kolo-muted leading-tight">verifikovanih članova</p>
          </div>

          <div className="bg-white rounded-2xl card-shadow p-5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-kolo-gold-100 flex items-center justify-center text-kolo-gold-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <p className="text-2xl font-bold text-kolo-text leading-none">{opticaj.toLocaleString("sr-RS")}</p>
            <p className="text-sm text-kolo-muted leading-tight">POEN u opticaju</p>
          </div>

          <div className="bg-white rounded-2xl card-shadow p-5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p className="text-sm font-bold text-kolo-green-700 leading-none">Alpha</p>
            <p className="text-sm text-kolo-muted leading-tight">faza razvoja</p>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="bg-white rounded-2xl card-shadow p-7">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Problem
          </div>
          <p className="text-kolo-green-900 text-lg font-semibold leading-relaxed mb-4">
            Tegla meda u marketu košta 800 dinara. Tegla meda od komšije košta isto 800 dinara.
            Ista cena, drugačiji med i potpuno drugačija stvar. U jednom slučaju tvoj novac odlazi u lanac
            koji završava van tvog grada, tvoje zemlje, tvog vidokruga. U drugom ostaje između tebe i čoveka
            koga poznaješ.
          </p>
          <p className="text-kolo-muted leading-relaxed">
            Ekonomska pravila donosi neko drugi. Ti ih poštuješ, prilagođavaš im se, snosiš njihove posledice —
            ali nemaš nijedan način da na njih utičeš. Bez obzira na to da li si zaposlen, nezaposlen,
            penzioner ili preduzetnik — nisi za stolom gde se odlučuje.
          </p>
        </section>

        {/* ALTERNATIVA */}
        <section className="bg-white rounded-2xl card-shadow p-7 border-l-4 border-kolo-green-700">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            KOLO ti daje alternativu
          </div>
          <p className="text-kolo-green-900 text-lg leading-relaxed">
            U KOLO sistemu tvoj doprinos ima konkretnu vrednost — za ono što radiš dobijaš POEN,
            a POEN trošiš na ono što ti treba. Kroz ZRNO učestvuješ u odlučivanju — koji projekti
            se pokreću, kako se resursi koriste, kuda sistem ide. Pravila su javna. Odluke su zajedničke.
            Sistem radi za članove, ne od članova.
          </p>
        </section>

        {/* KAKO FUNKCIONIŠE + KAKO DO POEN — bok uz bok */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* KAKO FUNKCIONIŠE */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
              Kako KOLO funkcioniše?
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B6B3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ),
                  iconBg: "bg-kolo-green-100",
                  title: "Doprinesi zajednici",
                  opis: "Verifikuj identitet, preporuči nove članove, doniraj Fondaciji — svaki doprinos nosi POEN nagradu.",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B6B3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  ),
                  iconBg: "bg-kolo-green-100",
                  title: "Trguj i razmenjuj",
                  opis: "Na Pijaci prodaješ robu i usluge za POEN i kupuješ od drugih članova. Direktna razmena, bez provizije.",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ),
                  iconBg: "bg-kolo-gold-100",
                  title: "Upravljaj sistemom",
                  opis: "ZRNO je glasačka jedinica. Zaključavanjem ZRNA dobijaš glas u odlukama koje oblikuju KOLO.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl card-shadow p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-kolo-text text-sm">{item.title}</p>
                    <p className="text-sm text-kolo-muted mt-1 leading-relaxed">{item.opis}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* KAKO DO POEN */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
              Kako do POEN?
            </h2>
            <div className="space-y-3">
              {[
                {
                  ikona: "✓",
                  iconBg: "bg-kolo-green-100 text-kolo-green-700",
                  title: "Verifikacija",
                  badge: "1.000 POEN",
                  badgeCls: "bg-kolo-green-100 text-kolo-green-700",
                  opis: "Jednokratna nagrada za svaki novi verifikovani nalog.",
                },
                {
                  ikona: "→",
                  iconBg: "bg-kolo-green-100 text-kolo-green-700",
                  title: "Preporuke",
                  badge: "do 15.000 POEN",
                  badgeCls: "bg-kolo-green-100 text-kolo-green-700",
                  opis: "Za svaku osobu kojoj si preporučio KOLO i koja se verifikuje — 10 nivoa nagrade.",
                },
                {
                  ikona: "♥",
                  iconBg: "bg-kolo-gold-100 text-kolo-gold-600",
                  title: "Donacije",
                  badge: "kurs raste",
                  badgeCls: "bg-kolo-gold-100 text-kolo-gold-600",
                  opis: "Svaka donacija Fondaciji povećava kurs POEN/RSD. Donatori dobijaju POEN srazmerno donaciji.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl card-shadow p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center font-bold text-base shrink-0`}>
                    {item.ikona}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-kolo-text text-sm">{item.title}</p>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${item.badgeCls}`}>{item.badge}</span>
                    </div>
                    <p className="text-sm text-kolo-muted mt-1 leading-relaxed">{item.opis}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* MIKRO PRIMER */}
        <section className="bg-white rounded-2xl card-shadow p-7">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Primer iz prakse
          </div>
          <p className="text-kolo-green-900 leading-relaxed mb-3">
            Ana ima pčelinjak i napravi 10 tegli meda. Milan iz iste zajednice joj plati{" "}
            <strong>8.000 POEN</strong> i odnese med kući. Ana je svoj rad razmenila direktno,
            bez provizije, bez posrednika, sa čovekom koga poznaje.
          </p>
          <p className="text-kolo-muted leading-relaxed">
            POEN koji je zaradila može da potroši na povrće od Jovane, popravku bojlera od Marka,
            ili da zaključa ZRNO i dobije pravo glasa u zajednici.{" "}
            <strong className="text-kolo-text">Isti rad, ista vrednost — ali ostaje u krugu ljudi koji se međusobno znaju.</strong>
          </p>
        </section>

        {/* TRANSPARENTNOST + ŠTA KOLO NIJE — bok uz bok */}
        <div className="grid md:grid-cols-2 gap-4">
          <section id="transparentnost" className="bg-white rounded-2xl card-shadow p-7">
            <h2 className="text-lg font-bold text-kolo-green-900 mb-2">Potpuna transparentnost</h2>
            <p className="text-sm text-kolo-muted mb-5">
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
                  <span className="text-sm text-kolo-text">{t}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="sta-kolo-nije" className="bg-white rounded-2xl card-shadow p-7">
            <h2 className="text-lg font-bold text-kolo-green-900 mb-2">Šta KOLO nije</h2>
            <p className="text-sm text-kolo-muted mb-5">Pre nego što nastaviš — jasno da znaš šta KOLO nije.</p>
            <div className="space-y-4">
              {[
                {
                  naslov: "Nije piramidalna šema",
                  opis: "Nema nivoa ispod tebe. Nema provizije od tuđih doprinosa.",
                },
                {
                  naslov: "Nije kriptovaluta",
                  opis: "POEN nije token, ne trguje se na berzama. POEN je interna evidencija doprinosa.",
                },
                {
                  naslov: "Ne obećava brzu zaradu",
                  opis: "KOLO nudi održiv sistem razmene između ljudi koji se međusobno poznaju.",
                },
              ].map((s) => (
                <div key={s.naslov} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-kolo-danger-light flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-kolo-text">{s.naslov}</p>
                    <p className="text-sm text-kolo-muted mt-0.5 leading-relaxed">{s.opis}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FAQ */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Često postavljana pitanja
          </h2>
          {[
            { p: "Da li KOLO zamenjuje dinar?", o: "Ne. KOLO je komplement postojećoj ekonomiji za razmenu unutar zajednice, ne zamena zvaničnom platnom sredstvu." },
            { p: "Šta se dešava ako želim da izađem iz sistema?", o: "Možeš izaći u svakom trenutku. POEN i ZRNO koje poseduješ ostaju evidentirani. Napuštanjem zadruge ne gubiš ništa što si stekao." },
            { p: "Ko kontroliše KOLO Banku?", o: "Banka je softverski protokol koji radi po javnim pravilima. Niko je ne kontroliše individualno. U kasnijoj fazi, odluke donosi Gornje Kolo kroz glasanje ZRNOM." },
            { p: "Da li plaćam porez na POEN?", o: "POEN je interna evidencija doprinosa, ne zakonsko sredstvo plaćanja. Pravna pitanja se razmatraju sa stručnjacima kako sistem raste. Alpha faza služi i tome." },
          ].map((faq) => (
            <details key={faq.p} className="bg-white rounded-2xl card-shadow group">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-kolo-text hover:text-kolo-green-700 transition-colors select-none">
                {faq.p}
                <span className="ml-4 shrink-0 text-kolo-muted group-open:rotate-180 transition-transform duration-200">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-5 text-sm text-kolo-muted leading-relaxed border-t border-kolo-border pt-3">
                {faq.o}
              </div>
            </details>
          ))}
        </section>

        {/* CTA */}
        <section className="bg-kolo-green-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
            Prva grupa članova se trenutno formira
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Postani deo zajednice koja gradi alternativni sistem razmene — transparentno, jednostavno i zajedno.
          </p>
          <Link href="/registracija"
            className="inline-block px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm">
            Registruj se besplatno →
          </Link>
          <p className="mt-4 text-xs text-white/70">
            Članstvo je besplatno. Verifikacijom dobijaš 1.000 POEN bonusa.
          </p>
        </section>

      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-kolo-border bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src={logoImg} alt="KOLO" width={28} height={19} style={{ height: "auto" }} />
                <span className="font-bold text-kolo-green-900">KOLO</span>
              </div>
              <p className="text-sm text-kolo-muted leading-relaxed">
                Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajednici.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Sistem</p>
              <ul className="space-y-2 text-sm text-kolo-muted">
                <li><Link href="/kako-funkcionise" className="hover:text-kolo-green-700 transition-colors">Kako funkcioniše</Link></li>
                <li><a href="#transparentnost" className="hover:text-kolo-green-700 transition-colors">Transparentnost</a></li>
                <li><a href="#" className="hover:text-kolo-green-700 transition-colors">Pravilnik</a></li>
                <li><a href="#sta-kolo-nije" className="hover:text-kolo-green-700 transition-colors">Šta KOLO nije</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Zajednica</p>
              <ul className="space-y-2 text-sm text-kolo-muted">
                <li><Link href="/pijaca" className="hover:text-kolo-green-700 transition-colors">Pijaca</Link></li>
                <li><Link href="/kako-funkcionise" className="hover:text-kolo-green-700 transition-colors">Zadruge</Link></li>
                <li><Link href="/kako-funkcionise" className="hover:text-kolo-green-700 transition-colors">Programi</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Informacije</p>
              <ul className="space-y-2 text-sm text-kolo-muted">
                <li><a href="#" className="hover:text-kolo-green-700 transition-colors">O Fondaciji</a></li>
                <li><a href="#" className="hover:text-kolo-green-700 transition-colors">Kontakt</a></li>
                <li><a href="#faq" className="hover:text-kolo-green-700 transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-kolo-border pt-6 text-xs text-kolo-muted text-center">
            © 2026 KOLO · Alternativni ekonomski sistem · Alfa faza
          </div>
        </div>
      </footer>

    </div>
  );
}
