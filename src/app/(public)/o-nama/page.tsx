import type { Metadata } from "next";
import Link from "next/link";
import FaqAkordeon from "@/components/FaqAkordeon";
import { poBrojevima } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "O nama — KOLO Fondacija",
  description:
    "Nikola Šarić, lekar iz Sombora, 14 godina gradi sistem uzajamnosti. Priča o KOLO-u, Fondaciji i pozivu na učešće.",
};

export default function ONamaPage() {
  return (
    <div className="space-y-6 pb-12">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-8 md:gap-12">
          <div className="max-w-[580px]">
            <div className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              KOLO Fondacija · Sombor
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
              Nikola Šarić
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-[520px]">
              Lekar iz Sombora koji četrnaest godina gradi sistem razmene bez novca.
              Ovo je priča o tome i poziv da ovaj sistem gradimo zajedno.
            </p>
            {/* Mini-sadržaj */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/50">
              <a href="#prica" className="hover:text-white/80 transition-colors">Priča</a>
              <span className="text-white/20">·</span>
              <a href="#sta-radimo-sada" className="hover:text-white/80 transition-colors">Status sistema</a>
              <span className="text-white/20">·</span>
              <a href="#kako-se-ukljucujes" className="hover:text-white/80 transition-colors">Kako se uključuješ</a>
              <span className="text-white/20">·</span>
              <a href="#fondacija" className="hover:text-white/80 transition-colors">Fondacija</a>
              <span className="text-white/20">·</span>
              <a href="#dokumenti" className="hover:text-white/80 transition-colors">Dokumenti</a>
            </div>
          </div>
          <div className="shrink-0 mx-auto md:ml-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nikola-saric.png"
              alt="Nikola Šarić"
              width={176}
              height={176}
              className="rounded-full object-cover ring-4 ring-white/10 shadow-xl"
              style={{ width: "144px", height: "144px", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── CITAT ─────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-100 rounded-2xl p-6 md:p-8 border-l-4 border-kolo-green-700">
        <div className="max-w-[680px] mx-auto">
          <blockquote
            className="text-base md:text-lg text-kolo-text mb-4 text-body"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            <span className="text-kolo-green-700 font-bold mr-0.5">&bdquo;</span>Kao lekaru poziv mi je da pomažem ljudima. Smatram da je iz istog razloga osmišljen i
            sistem u kome živimo. Ali, svaki dan gledam ljude kojima bi taj sistem trebalo da pomogne,
            ali ne može — poljoprivrednike, penzionere, nezaposlene, mlade. Duboko verujem da svi oni
            imaju svoje mesto u zajednici i mogu da joj doprinesu na svoj način. Samo im treba
            infrastruktura.<span className="text-kolo-green-700 font-bold ml-0.5">&ldquo;</span>
          </blockquote>
          <p className="text-sm text-kolo-muted font-medium text-center">— Nikola Šarić</p>
        </div>
      </section>

      {/* ── ŠTA NAS JE DOVELO OVDE ────────────────────────────────── */}
      <section id="prica" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[660px] mx-auto">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Priča
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-8" style={{ letterSpacing: "-0.02em" }}>
            Šta nas je dovelo ovde
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              Prva sumnja u sistem došla je još na medicinskom fakultetu. Tada sam video da nauka koju
              učim nije neutralna i da postoje skriveni interesi koji struku usmeravaju prema profitu.
              I da u krajnjoj biti cilj sistema nije zdravlje nego kontinuirano lečenje. Ista logika
              oblikuje sve ostale sisteme — proizvodnju hrane, ekonomiju, tržište rada. Završio sam
              medicinu jer sam zaključio da se sistem lakše menja iznutra.
            </p>
            <p>
              Paralelno sa medicinom, godinama sam se obrazovao u oblasti komplementarnih ekonomskih sistema.
              U martu 2014. bio sam gost emisije <em>Na rubu znanosti</em> kod Krešimira Mišaka na HRT, u
              epizodi o lokalnim i alternativnim valutama i predstavio ALVU — tadašnju formu projekta.
              Krajem juna 2016. proveo sam nedelju dana na Pelionu u Grčkoj, na radionici{" "}
              <em>Innovation in Exchange and Finance</em> koju je vodio Thomas Greco — autor knjige{" "}
              <em>The End of Money and the Future of Civilization</em> i jedan od najznačajnijih svetskih
              teoretičara komplementarnih valuta. U grupi je između ostalih bio i tim iz Volosa koji je već
              četiri godine vodio Volos TEM, jednu od grčkih lokalnih mreža razmene. Organizovao sam više
              tribina na ovu temu — u Stanišiću, Somboru, Novom Sadu i Beogradu.
            </p>
            <p>
              Ideja je tokom vremena prošla kroz nekoliko formi: ALVA (2012), Tranziciona alternativa
              (2013–14), Alva Fondacija (2016–17), i sada KOLO. Sada nakon četrnaest godina imamo spreman
              pravni okvir, platformu kao i strukturu koja može da radi nezavisno od bilo koga.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATUS SISTEMA · MAJ 2026 ─────────────────────────────── */}
      <section id="sta-radimo-sada" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="inline-block bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              Status sistema
            </div>
            <span className="text-xs text-kolo-muted font-medium tracking-wide">Maj 2026.</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            Gde smo sada
          </h2>
          <p className="text-kolo-muted leading-relaxed mb-8 text-body" style={{ lineHeight: "1.7" }}>
            Sistem se gradi po fazama. Trenutno smo u pripremnoj fazi pred otvaranje platforme prvim verifikovanim korisnicima.
          </p>

          {/* Timeline */}
          <div className="relative mb-10 pb-8 border-b border-kolo-border">
            {/* Mobilni — vertikalni redosled */}
            <div className="md:hidden relative">
              <div
                className="absolute w-0.5 bg-kolo-border"
                style={{ top: "0.5rem", bottom: "0.5rem", left: "6px" }}
              />
              <div className="flex flex-col gap-3">
                {[
                  { r1: "Pripremna", r2: "faza", aktivan: true },
                  { r1: "Testiranje", r2: "platforme", aktivan: false },
                  { r1: "Prvih sto", r2: "korisnika", aktivan: false },
                  { r1: "Potpuno aktivan", r2: "sistem", aktivan: false },
                  { r1: "Međugradska", r2: "mreža", aktivan: false },
                  { r1: "Državna", r2: "regulacija", aktivan: false },
                  { r1: "Puna", r2: "zrelost", aktivan: false },
                ].map((faza) => (
                  <div key={faza.r1 + faza.r2} className="relative flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 relative z-10 shrink-0 ${faza.aktivan ? "bg-kolo-green-700 border-kolo-green-700" : "bg-white border-kolo-border"}`} />
                    <p className={`text-sm leading-tight ${faza.aktivan ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {faza.r1} {faza.r2}
                      {faza.aktivan && (
                        <span className="ml-2 text-[11px] font-bold text-kolo-green-700">← tu smo</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop — horizontalni redosled */}
            <div className="hidden md:block relative pt-5">
              <div
                className="absolute h-0.5 bg-kolo-border"
                style={{ top: "calc(1.25rem + 6px)", left: "7.14%", right: "7.14%" }}
              />
              <div className="relative grid grid-cols-7">
                {[
                  { r1: "Pripremna", r2: "faza", aktivan: true },
                  { r1: "Testiranje", r2: "platforme", aktivan: false },
                  { r1: "Prvih sto", r2: "korisnika", aktivan: false },
                  { r1: "Potpuno aktivan", r2: "sistem", aktivan: false },
                  { r1: "Međugradska", r2: "mreža", aktivan: false },
                  { r1: "Državna", r2: "regulacija", aktivan: false },
                  { r1: "Puna", r2: "zrelost", aktivan: false },
                ].map((faza) => (
                  <div key={faza.r1 + faza.r2} className="relative flex flex-col items-center gap-1.5 px-1">
                    {faza.aktivan && (
                      <span className="absolute -top-5 text-[10px] font-bold text-kolo-green-700 whitespace-nowrap">
                        tu smo
                      </span>
                    )}
                    <div className={`w-3.5 h-3.5 rounded-full border-2 relative z-10 ${faza.aktivan ? "bg-kolo-green-700 border-kolo-green-700" : "bg-white border-kolo-border"}`} />
                    <p className={`text-[11px] leading-tight text-center ${faza.aktivan ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {faza.r1}<br />{faza.r2}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            KOLO se priprema za beta fazu
          </h3>
          <p className="text-kolo-muted leading-relaxed mb-8 text-body" style={{ lineHeight: "1.7" }}>
            Završavaju se poslednji koraci pred otvaranje sistema prvim korisnicima.
          </p>

          <div className="space-y-5">
            {[
              {
                naslov: "Registracija Fondacije",
                tekst: "U toku je postupak promene naziva (iz Alva Fondacije u KOLO Fondaciju), preseljenja sedišta u Sombor i usvajanja novih akata u Agenciji za privredne registre.",
              },
              {
                naslov: "Platforma",
                tekst: "Završne pripreme za beta fazu. Razvoj je u poslednjem segmentu pre nego što platforma bude otvorena za prve verifikovane korisnike.",
              },
              {
                naslov: "Pravna i ekonomska verifikacija sistema",
                tekst: "Dokumentacioni okvir KOLO sistema — Pravilnik, Statut, Politika privatnosti, Uslovi korišćenja — predat je sudskim veštacima i advokatima na nezavisnu proveru. Provera nije ukazala na bitne pravne ni strukturne nedostatke. Sa eksternim konsultantima u toku je finalna provera računovodstvene logike sistema. Rezime se očekuje.",
              },
              {
                naslov: "Komunikacija sa regulatorima",
                tekst: "Dokumentacija je proaktivno dostupna nadležnim organima. Po pokretanju sistema, od Narodne banke Srbije, Poreske uprave i nadležnih ministarstava biće formalno zatraženo zvanično mišljenje. Kad odgovori stignu, biće javno objavljeni.",
              },
              {
                naslov: "Tim",
                tekst: "Upravni odbor Fondacije i spoljni konsultanti. U beta fazi formira se uži krug saradnika koji će zajedno proveriti sistem u praksi i postaviti temelje zajednice. Posle beta faze, doprinos svakog verifikovanog korisnika — kroz razvoj softvera, prevođenje, kreiranje sadržaja, organizaciju aktivnosti, mentorstvo, moderaciju — biva prepoznat kroz Program evidencije doprinosa.",
              },
            ].map((stavka) => (
              <div key={stavka.naslov} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-kolo-green-700 mt-2.5 shrink-0" />
                <div>
                  <p className="font-semibold text-kolo-text mb-1">{stavka.naslov}</p>
                  <p className="text-sm text-kolo-muted leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                    {stavka.tekst}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-kolo-border">
            <p className="text-sm font-medium text-kolo-green-900 italic text-center" style={{ lineHeight: "1.7" }}>
              Cilj svih ovih koraka je da Fondacija što pre prestane da bude centar sistema.
            </p>
          </div>
        </div>
      </section>

      {/* ── KAKO SE UKLJUČUJEŠ ─────────────────────────────────────── */}
      <section id="kako-se-ukljucujes" className="space-y-5">
        {/* Uvod */}
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Kako se uključuješ
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            Sistem se gradi kroz različite oblike doprinosa
          </h2>
          <p className="text-kolo-muted leading-relaxed max-w-[680px] text-body" style={{ lineHeight: "1.7" }}>
            Bilo da imaš pet minuta, ekspertizu, sredstva ili kontakt — postoji kanal kroz koji možeš da doprineseš sistemu.
          </p>
        </div>

        {/* Primarne kartice (3) */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              naslov: "Rani pristup i verifikacija",
              tekst: "Ako želiš da znaš kad sistem bude otvoren — registruj se za rani pristup. Prvi verifikovani korisnici postavljaju temelje zajednice i njihov rad u beta fazi posebno se prepoznaje kroz Program evidencije doprinosa.",
              cta: "Registruj se besplatno →",
              ctaHref: "/registracija",
              ctaIsLink: true,
            },
            {
              naslov: "Postani pokrovitelj",
              tekst: "Ako vodiš firmu ili imaš sredstva da podržiš razvoj, donacija Fondaciji direktno omogućava operativnu održivost sistema. Pokrovitelji su javno navedeni, a nivoi doprinosa su transparentno definisani u Pravilniku.",
              cta: "Piši nam → kontakt@ekolo.rs",
              ctaHref: "mailto:kontakt@ekolo.rs",
              ctaIsLink: false,
            },
            {
              naslov: "Pomozi razvoju",
              tekst: "Ako si programer, dizajner ili druge IT struke što može da pomogne razvoju naše platforme i sistema uopšte — javi se.",
              cta: "Piši nam → kontakt@ekolo.rs",
              ctaHref: "mailto:kontakt@ekolo.rs",
              ctaIsLink: false,
            },
          ].map((k) => (
            <div
              key={k.naslov}
              className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-3 border-t-4 border-kolo-green-700"
            >
              <h3 className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {k.naslov}
              </h3>
              <p className="text-sm text-kolo-muted leading-relaxed flex-1 text-body" style={{ lineHeight: "1.65" }}>
                {k.tekst}
              </p>
              {k.ctaIsLink ? (
                <Link href={k.ctaHref} className="text-sm font-semibold text-kolo-green-700 hover:text-kolo-green-900 transition-colors mt-2">
                  {k.cta}
                </Link>
              ) : (
                <a href={k.ctaHref} className="text-sm font-semibold text-kolo-green-700 hover:text-kolo-green-900 transition-colors mt-2">
                  {k.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Sekundarne kartice — specifične ekspertize i drugi oblici */}
        <div className="pt-2">
          <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-3 px-1">
            Specifične ekspertize i drugi oblici
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                naslov: "Komunikacija i sadržaj",
                tekst: "Pisci, novinari, urednici, video-producenti, dizajneri. Posebna potreba: ljudi koji mogu da prevedu složene koncepte u jasan jezik za različite publike (farmeri, penzioneri, mladi).",
              },
              {
                naslov: "Medijski i akademski kontakti",
                tekst: "Novinari koji bi pisali o sistemu, urednici otvoreni za teme komplementarnih ekonomija, akademici (ekonomisti, pravnici, sociolozi, antropolozi). Kritika iznutra jača sistem koliko i podrška.",
              },
              {
                naslov: "Upravljanje i operativa",
                tekst: "Iskustvo u vođenju preduzeća, NVO ili većih organizacija. Fondaciji je potrebno operativno upravljanje, koordinacija između Upravnog odbora i izvršnih funkcija, izgradnja unutrašnjih procesa.",
              },
              {
                naslov: "Pravna i računovodstvena ekspertiza",
                tekst: "Pravnici sa interesom za zadružno pravo, fondacijsko pravo i pitanja digitalnih platformi, kao i računovođe sa iskustvom u neprofitnom sektoru.",
              },
              {
                naslov: "Strukovne i institucionalne veze",
                tekst: "Kontakti u zadrugarstvu, asocijacijama proizvođača, sindikatima, civilnom sektoru, lokalnim samoupravama — sve to ubrzava širenje sistema u zajednicama gde ima najviše smisla.",
              },
              {
                naslov: "Prostor i događaji",
                tekst: "Ako možeš da obezbediš prostor za tribinu, prezentaciju ili manji skup u svom gradu — Sombor i okolina su prvi krug, ali svaki grad u Srbiji i regionu je dobrodošao.",
              },
              {
                naslov: "Lična donacija",
                tekst: "Ako nemaš firmu ali imaš mogućnost i želju da podržiš sistem direktno, fizička lica takođe mogu biti donatori čiji se doprinos evidentira na poseban način.",
              },
              {
                naslov: "Ostali oblici doprinosa",
                tekst: "Sistem se gradi i kroz oblike doprinosa koji još nisu predviđeni. Ako vidiš način da pomogneš koji nije gore — javi se, razgovaraćemo.",
              },
            ].map((k) => (
              <div key={k.naslov} className="bg-white rounded-2xl card-shadow p-5 flex flex-col gap-2">
                <p className="font-semibold text-kolo-text text-sm leading-snug">{k.naslov}</p>
                <p className="text-xs text-kolo-muted leading-relaxed text-body" style={{ lineHeight: "1.6" }}>
                  {k.tekst}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Zatvarajući kontakt blok */}
        <div className="bg-kolo-green-100 rounded-2xl p-5 text-center">
          <p className="text-sm text-kolo-green-900 leading-relaxed">
            Za sva pitanja, pišite na{" "}
            <a href="mailto:kontakt@ekolo.rs" className="font-semibold text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
              kontakt@ekolo.rs
            </a>
          </p>
        </div>
      </section>

      {/* ── KOLO FONDACIJA ────────────────────────────────────────── */}
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
            {/* Znak — tri figure u krugu sa klasom */}
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3"/>
                <circle cx="20" cy="13" r="4" fill="currentColor" opacity="0.7"/>
                <circle cx="27" cy="26" r="4" fill="currentColor" opacity="0.7"/>
                <circle cx="13" cy="26" r="4" fill="currentColor" opacity="0.7"/>
                <line x1="20" y1="17" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="23.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="16.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-kolo-border">
          {[
            {
              naslov: "",
              tekst: "Fondacija je pravni instrument sistema — pravno lice koje prima donacije i sponzorstva u robi, uslugama i novcu, pokriva operativne troškove platforme, drži infrastrukturu i zastupa KOLO pred zajednicom i državom.",
            },
            {
              naslov: "Sedište i registracija",
              tekst: "Sombor, Šetalište 14. Trenutno je pravno registrovana pod ranijim imenom Alva Fondacija (matični broj 28830360, sedište Stanišić).",
            },
            {
              naslov: "Organi",
              tekst: "Upravni odbor i Direktor. Upravni odbor donosi strateške odluke. Direktor vodi operativu. Aktivacijom Gornjeg Kola Fondacija postaje njegov izvršni organ.",
            },
          ].map((stub, idx) => (
            <div key={stub.naslov || `card-${idx}`} className="p-6 md:p-8">
              {stub.naslov && (
                <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-3">{stub.naslov}</p>
              )}
              <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>{stub.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JAVNO I DOSTUPNO ──────────────────────────────────────── */}
      <section id="dokumenti" className="bg-white rounded-2xl card-shadow p-8 md:p-10">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          Javno i dostupno
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Levo — dokumenti */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Dokumenti</p>
            <div className="space-y-2">
              {[
                { naziv: "Pravilnik o KOLO sistemu (v3.7.0) + Prilozi", href: "/pravilnik" },
                { naziv: "Statut KOLO Fondacije (v3.7.0)", href: "/statut" },
                { naziv: "Politika privatnosti (v3.7.0)", href: "/privatnost" },
                { naziv: "Uslovi korišćenja (v3.7.0)", href: "/uslovi" },
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
              <p className="text-sm text-kolo-muted leading-relaxed text-body">
                Za sva pitanja koja nisu pokrivena u FAQ sekciji, možete nam se obratiti direktno na navedenu adresu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ TIZER ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            Pitanja o Fondaciji
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Često postavljana pitanja
          </h2>
        </div>
        <FaqAkordeon pitanja={poBrojevima([26, 27, 30])} />
        <div className="text-center pt-2">
          <Link
            href="/cesto-postavljena-pitanja"
            className="inline-flex items-center gap-2 text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors"
          >
            Vidi sva pitanja
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 md:p-10 text-center text-white">
        <p className="text-white/70 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
          Nema reklama, nema pretplate, nema skrivenih nagodbi.<br />
          Ima sistem i ima krug koji se upravo formira.
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
        <p className="text-xs text-white/40">Rani pristup · Beta · Fondacija u registraciji</p>
      </section>

    </div>
  );
}
