import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama — KOLO Fondacija",
  description:
    "Nikola Šarić, lekar iz Sombora, 14 godina gradi sistem uzajamnosti. Priča o KOLO-u, Fondaciji i tome zašto ovo postoji.",
};

export default function ONamaPage() {
  return (
    <div className="space-y-6 pb-12">

      {/* ── SEKCIJA 1 — HERO (bez fotografije) ───────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-[580px]">
          <div className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            KOLO Fondacija · Sombor
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
            Nikola Šarić
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8">
            Lekar iz Sombora koji 14 godina gradi sistem uzajamnosti.<br />
            Ovo je priča o tome i o Fondaciji koja ga danas nosi.
          </p>
          {/* Mini-sadržaj */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/50">
            <a href="#prica" className="hover:text-white/80 transition-colors">Priča</a>
            <span className="text-white/20">·</span>
            <a href="#sira-slika" className="hover:text-white/80 transition-colors">Šira slika</a>
            <span className="text-white/20">·</span>
            <a href="#fondacija" className="hover:text-white/80 transition-colors">Fondacija</a>
            <span className="text-white/20">·</span>
            <a href="#dokumenti" className="hover:text-white/80 transition-colors">Javno i dostupno</a>
          </div>
        </div>
      </section>

      {/* ── SEKCIJA 2 — PRIČA ─────────────────────────────────────── */}
      <section id="prica" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[660px] mx-auto">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Priča
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-8" style={{ letterSpacing: "-0.02em" }}>
            Zašto ovo postoji
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed" style={{ lineHeight: "1.75" }}>
            <p>
              Nikola je lekar. To je profesija koja ga svakodnevno vodi u kuće ljudi koje formalna ekonomija
              ne vidi — starijih osoba sa penzijom koja ne pokriva lekove, samohranih majki koje rade više
              poslova a nijedan nije prijavljen, zanatlija koji znaju sve osim kako da dođu do kupca. Ideja
              za KOLO nije došla iz ekonomskog fakulteta. Došla je iz svakodnevnog kontakta sa ljudima
              kojima je sistem rekao da ne postoje.
            </p>
            <p>
              Prvi pokušaj bio je ALVA — skica alternativne valute, 2012. godine. Intuicija bez strukture,
              koncept koji nije mogao da izdrži prvu ozbiljnu proveru pravnog okvira ni tehničku realizaciju.
              Druga iteracija, 2013–14, bio je pokušaj razrade kroz udruženje Tranziciona alternativa —
              sistem je počeo da se gradi, ali platformu nismo uspeli da dovedemo do upotrebljivog stanja.
              Treća, 2016–17, bila je Alva Fondacija u Stanišiću, sa pravom platformom i pravim korisnicima —
              ali koncept je za većinu bio presložen, a interfejs previše komplikovan da bi se sistem održao
              bez stalnog objašnjavanja.
            </p>
            <p className="text-kolo-muted">
              Četrnaest godina nije slika upornosti. To je vreme koje je bilo potrebno da tri stvari budu
              rešene istovremeno: pravni okvir koji može da stoji pred inspektorom, platforma koja može da
              nosi prve članove bez rušenja, i struktura koja nastavlja da radi ako jednog dana Nikola ne
              bude tu.
            </p>
            <p className="text-kolo-muted">
              KOLO danas postoji kao platforma u ranoj fazi i kao Fondacija u postupku registracije u
              Somboru. Dokumentacija je proaktivno podneta poreskom inspektoru. Od Narodne banke Srbije,
              Poreske uprave i nadležnih ministarstava zatražena su zvanična mišljenja — svaki odgovor biće
              javno objavljen. Veštačka inteligencija je, poslednjih godinu dana, postala alat koji je
              konačno omogućio da se ogroman dokumentacioni okvir iznese do kraja — Pravilnik, Statut,
              Politika privatnosti, Uslovi korišćenja, operativni materijali. Nikola više nije sam. Tim se
              proširuje, prve zadruge se pripremaju. Ovo je trenutak pre prvih članova — i to je, posle
              14 godina, velika stvar.
            </p>
          </div>
        </div>
      </section>

      {/* ── SEKCIJA 3 — CITAT ─────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-[680px] mx-auto">
          <div className="text-kolo-gold-400 font-serif text-6xl leading-none mb-4" style={{ fontFamily: "Georgia, serif" }}>&ldquo;</div>
          <blockquote className="text-lg md:text-xl leading-relaxed text-white/90 mb-6" style={{ lineHeight: "1.7" }}>
            Lekar sam petnaest godina. Svaki dan gledam ljude kojima sistem kaže da ne postoje —
            penzionerku koja zna sve o travama, komšiju koji može da okreči ceo stan za dva dana,
            farmera čiji je med bolji od svega u prodavnici. Svi oni postoje. Samo im treba mesto
            gde to ne treba da dokazuju.
          </blockquote>
          <p className="text-sm text-white/50 font-medium">— Nikola Šarić</p>
        </div>
      </section>

      {/* ── SEKCIJA 4 — ŠIRA SLIKA ───────────────────────────────── */}
      <section id="sira-slika" className="space-y-4">

        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Šira slika
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
            Ne izmišljamo toplu vodu
          </h2>
          <p className="text-kolo-muted leading-relaxed max-w-[660px]" style={{ lineHeight: "1.7" }}>
            Ideja da zajednica može da organizuje sopstvenu razmenu — da evidentira doprinos svojih članova
            i uspostavi jedinicu koja nije novac ali radi posao novca u zatvorenom krugu — nije nova. Nije
            ni egzotična. Decenijama postoje dokumentovane mreže, u različitim zemljama i pod različitim
            okolnostima, u kojima ljudi razmenjuju rad, dobra i znanje kroz sopstvene sisteme evidencije.
            Evropska unija od 2021. godine socijalnu ekonomiju formalno prepoznaje kao strateški sektor.
            KOLO ulazi u taj tok.
          </p>
        </div>

        {/* Tri kartice */}
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
          Tri primera koja vredi znati
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              naziv: "LETS",
              meta: "od 1983. · 1.500+ mreža u 39 zemalja",
              tekst: "Michael Linton je 1983. u malom gradu u Kanadi pokrenuo prvu Local Exchange Trading System — lokalnu mrežu u kojoj članovi razmenjuju usluge koristeći sopstvenu jedinicu evidencije. Za četrdeset godina model se proširio po svetu. Tipična LETS mreža okuplja pedesetak do dvestotinak ljudi, zbir svih računa uvek je nula, a jedinica se ne menja u nacionalnu valutu.",
              zakljucak: "Mreža lokalnog okupljanja oko sopstvene jedinice evidencije je proveren model — ne 5 godina, ne 10, nego četrdeset godina u 39 zemalja. KOLO ne izmišlja strukturu — adaptira je za srpski kontekst.",
            },
            {
              naziv: "Sardex",
              meta: "Sardinija · od 2010. · 3.200 članova, 43M€ prometa",
              tekst: "Osnovan 2010. kao odgovor na dužničku krizu. Četvoro mladih Sardinjana, bez ekonomskog obrazovanja, pokrenulo je mrežu uzajamnog kredita za lokalne učesnike. Do 2018. dostigli su 3.200 članova i 43 miliona evra prometa. Sistem radi na istom principu kao KOLO — svaki član startuje na nuli, zbir svih računa je uvek nula, nema kamate. Evropska komisija ih je uključila u DigiPay4Growth. Model je repliciran u osam regija.",
              zakljucak: "Lokalni tim, bez velike investicije i bez državne podrške, uspeo je za nepunih deset godina da izgradi mrežu koja radi. Potrebni su struktura, istrajnost i uvid u problem sopstvene sredine.",
            },
            {
              naziv: "Fureai Kippu",
              meta: "Japan · od kasnih 1980-ih · 5.000+ učesničkih tačaka",
              tekst: "Japanski sistem razmene zasnovan na vremenu i brizi za starije. Članovi koji pomažu starijim ljudima — kroz kućnu negu, pratnju, kuvanje — beleže odrađene sate i mogu ih iskoristiti za sebe ili preneti članu porodice u drugom delu zemlje. Vlada Japana ga je formalno prepoznala kao deo nacionalne politike brige o starijim ljudima.",
              zakljucak: "Sistem evidencije doprinosa može postati infrastruktura brige o osetljivim grupama. Programi podrške u KOLO sistemu — majkama, starijima, školovanju — idu po toj logici.",
            },
          ].map((primer) => (
            <div key={primer.naziv} className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-4">
              <div>
                <p className="font-bold text-kolo-green-900 text-lg mb-1" style={{ letterSpacing: "-0.01em" }}>
                  {primer.naziv}
                </p>
                <p className="text-xs text-kolo-muted font-medium">{primer.meta}</p>
              </div>
              <p className="text-sm text-kolo-muted leading-relaxed flex-1">{primer.tekst}</p>
              <div className="bg-kolo-green-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-kolo-green-700 leading-relaxed">
                  {primer.zakljucak}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* EU kontekst */}
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Šta Evropska unija kaže
          </div>
          <p className="text-kolo-muted leading-relaxed mb-8 max-w-[580px]">
            Socijalna ekonomija u Evropi nije marginalna niša — deo je formalnog privrednog okvira.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { broj: "2,8M", opis: "organizacija socijalne ekonomije u EU" },
              { broj: "13,6M", opis: "zaposlenih u sektoru" },
              { broj: "10%", opis: "svih preduzeća u Uniji" },
            ].map((stat) => (
              <div key={stat.broj} className="text-center">
                <p className="text-4xl font-bold text-kolo-green-700 mb-2" style={{ letterSpacing: "-0.02em" }}>
                  {stat.broj}
                </p>
                <p className="text-xs text-kolo-muted leading-relaxed">{stat.opis}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-kolo-muted leading-relaxed max-w-[660px]" style={{ lineHeight: "1.7" }}>
            U decembru 2021. Evropska komisija je usvojila Akcioni plan za socijalnu ekonomiju — dokument
            sa 38 konkretnih mera za period do 2030. U junu 2023. Savet EU doneo je Preporuku o uslovima
            za razvoj socijalne ekonomije, pozivajući države članice da usvoje nacionalne strategije.
            Srbija nije članica Unije, ali je u procesu pristupanja — i okvir koji KOLO gradi direktno se
            usklađuje sa tim pravcem.
          </p>
        </div>

        {/* Gde je tu KOLO */}
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10 border-l-4 border-kolo-green-700">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Gde je tu KOLO
          </div>
          <p className="text-kolo-text leading-relaxed max-w-[660px]" style={{ lineHeight: "1.75" }}>
            KOLO nije kopija ni jedne od navedenih mreža, i razlike su stvarne — KOLO koristi zadružnu
            strukturu kao okosnicu lokalnog okupljanja, uvodi ZRNO kao odvojenu jedinicu glasa sa
            kvadratnim korenom kao zaštitom od koncentracije moći, i pravnu prirodu svake transakcije
            definiše kao donaciju dobra ili usluge mreži, ne kao prodaju ili trampu. Ali fundamentalno
            pripadamo istoj familiji — sistemi evidencije razmene među ljudima, koji rade komplementarno
            sa zvaničnom valutom, i koji rade za članove umesto da ih koriste. Ono što smo 14 godina
            radili nije eksperimentisanje. To je adaptacija proverene kategorije sistema u srpski pravni
            i društveni kontekst — sa svim posebnostima koje taj kontekst zahteva.
          </p>
        </div>

      </section>

      {/* ── SEKCIJA 5 — FONDACIJA ────────────────────────────────── */}
      <section id="fondacija" className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="p-8 md:p-10 border-b border-kolo-border">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                Fondacija
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
                KOLO Fondacija
              </h2>
            </div>
            {/* Placeholder za SVG znak */}
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Tri figure u krug */}
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3"/>
                <circle cx="20" cy="13" r="4" fill="currentColor" opacity="0.7"/>
                <circle cx="27" cy="26" r="4" fill="currentColor" opacity="0.7"/>
                <circle cx="13" cy="26" r="4" fill="currentColor" opacity="0.7"/>
                {/* Klas - centralna linija */}
                <line x1="20" y1="17" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="23.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="16.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              </svg>
            </div>
          </div>
          <p className="text-kolo-muted mt-4 leading-relaxed max-w-[580px]" style={{ lineHeight: "1.7" }}>
            Fondacija je pravni subjekt sistema. Prima dinare, pokriva operativne troškove, zastupa
            KOLO pred zajednicom i državom. Ne emituje POEN i ne raspolaže njime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-kolo-border">
          {[
            {
              naslov: "Sedište i registracija",
              tekst: "Sombor, Šetalište 14. Fondacija je u postupku registracije u Agenciji za privredne registre. Trenutno je pravno registrovana pod ranijim imenom Alva Fondacija (matični broj 28830360, sedište Stanišić) — postupak promene naziva u KOLO Fondaciju i preseljenja u Sombor aktivno je u toku.",
            },
            {
              naslov: "Organi",
              tekst: "Upravni odbor i Direktor. Upravni odbor donosi strateške odluke. Direktor vodi operativu. U kasnijoj fazi razvoja, kada donacije premaše operativne troškove, aktivira se Gornje Kolo — skupština verifikovanih članova koja glasa kroz ZRNO. Tada Fondacija postaje izvršni organ skupštine. Taj prelazak je strukturni mehanizam, ne obećanje.",
            },
            {
              naslov: "Znak",
              tekst: "Tri ljudske figure raspoređene u krug, sa rukama koje formiraju prsten. U središtu klas pšenice. Znak je definisan Statutom KOLO Fondacije, članom 5, i ne može se menjati bez odluke Upravnog odbora.",
            },
          ].map((stub) => (
            <div key={stub.naslov} className="p-6 md:p-8">
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-3">{stub.naslov}</p>
              <p className="text-sm text-kolo-text leading-relaxed" style={{ lineHeight: "1.7" }}>{stub.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEKCIJA 6 — JAVNO I DOSTUPNO ─────────────────────────── */}
      <section id="dokumenti" className="bg-white rounded-2xl card-shadow p-8 md:p-10">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          Javno i dostupno
        </div>
        <h2 className="text-2xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
          Sva pravila, sva dokumenta, svaki kontakt.
        </h2>
        <p className="text-kolo-muted mb-8">Ništa se ne krije za kasnije.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Levo — dokumenti */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Dokumenti</p>
            <div className="space-y-2">
              {[
                { naziv: "Pravilnik o KOLO sistemu (v11) + Prilozi", href: "#" },
                { naziv: "Statut KOLO Fondacije (v2)", href: "#" },
                { naziv: "Politika privatnosti (v4)", href: "/privatnost" },
                { naziv: "Uslovi korišćenja (v4)", href: "/uslovi" },
              ].map((dok) => (
                <a
                  key={dok.naziv}
                  href={dok.href}
                  target={dok.href.startsWith("http") ? "_blank" : undefined}
                  rel={dok.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-kolo-green-100 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-kolo-gold-100 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D99520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <span className="text-sm text-kolo-text group-hover:text-kolo-green-700 transition-colors font-medium">
                    {dok.naziv}
                  </span>
                </a>
              ))}
            </div>
            <p className="text-xs text-kolo-muted mt-4 px-1 leading-relaxed">
              Dokumenti su u PDF formatu. Svaka nova verzija zamenjuje prethodnu, a istorija izmena je zabeležena u samom dokumentu.
            </p>
          </div>

          {/* Desno — kontakt */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Kontakt</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-kolo-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B6B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-kolo-muted mb-1">Email</p>
                  <a href="mailto:kontakt@ekolo.rs" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
                    kontakt@ekolo.rs
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-kolo-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B6B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-kolo-muted mb-1">Adresa</p>
                  <p className="text-sm font-medium text-kolo-text">KOLO Fondacija, Šetalište 14, Sombor</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-kolo-bg rounded-xl">
              <p className="text-sm text-kolo-muted leading-relaxed">
                <strong className="text-kolo-text">Pitanja, prigovori, predlozi</strong> — pišite direktno.
                Odgovaramo lično, ne automatski.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEKCIJA 7 — CTA ──────────────────────────────────────── */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 md:p-10 text-center text-white">
        <p className="text-white/70 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
          Nema reklama, nema pretplate, nema skrivenih nagodbi.<br />
          Ima sistem i ima zajednica koja se upravo formira.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Link
            href="/registracija"
            className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
          >
            Registruj se besplatno →
          </Link>
          <Link
            href="/kako-funkcionise"
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            Kako funkcioniše
          </Link>
        </div>
        <p className="text-xs text-white/40">Rani pristup · Alpha faza · Fondacija u registraciji</p>
      </section>

    </div>
  );
}
