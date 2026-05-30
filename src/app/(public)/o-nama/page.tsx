import type { Metadata } from "next";
import Link from "next/link";
import FaqAkordeon from "@/components/FaqAkordeon";
import { poBrojevima } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "O nama — KOLO Fondacija",
  description:
    "Nikola Šarić, lekar iz Sombora, petnaest godina gradi sistem razmene rada i dobara bez posrednika. Priča o KOLO-u, Fondaciji i pozivu na učešće.",
};

function DokumentRed({ naziv, href, zivo = false }: { naziv: string; href: string; zivo?: boolean }) {
  const eksterni = href.startsWith("http");
  return (
    <a
      href={href}
      target={eksterni ? "_blank" : undefined}
      rel={eksterni ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-kolo-green-100 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-kolo-gold-100 flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D99520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <span className="text-sm text-kolo-text group-hover:text-kolo-green-700 transition-colors font-medium flex-1">
        {naziv}
      </span>
      {zivo && (
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-kolo-green-700 bg-kolo-green-100 px-2 py-0.5 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-kolo-green-700 animate-pulse" />
          uživo
        </span>
      )}
    </a>
  );
}

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
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-[520px]">
              Lekar iz Sombora koji već petnaest godina gradi sistem razmene rada i dobara bez posrednika.
              Ovo je priča o tome i poziv da ovaj sistem gradimo zajedno.
            </p>
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
            sistem u kome živimo. Ali, svaki dan na poslu gledam ljude kojima bi taj sistem trebalo da
            pomogne, a ne može — poljoprivrednike, penzionere, majke, bolesne ljude koji bi još mnogo
            toga mogli da pruže. Duboko verujem da svako ima svoje mesto u zajednici i nešto čime može
            da joj doprinese. Samo im treba infrastruktura — alat i ljudi iza njega.<span className="text-kolo-green-700 font-bold ml-0.5">&ldquo;</span>
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
              I da u suštini cilj sistema nije zdravlje nego kontinuirano lečenje. Ista logika
              oblikuje sve ostale sisteme — proizvodnju hrane, ekonomiju, tržište rada. Završio sam
              medicinu jer sam zaključio da se sistem lakše menja iznutra.
            </p>
            <p>
              Paralelno sa medicinom, godinama sam izučavao kako zajednice širom sveta razmenjuju rad i
              dobra bez novca kao posrednika — takozvane komplementarne ekonomske sisteme. U martu 2014.
              bio sam gost emisije <em>Na rubu znanosti</em> kod Krešimira Mišaka na HRT, u epizodi o
              lokalnim i alternativnim valutama, i predstavio ALVU — tadašnju formu projekta. Krajem juna
              2016. proveo sam nedelju dana na Pelionu u Grčkoj, na radionici{" "}
              <em>Innovation in Exchange and Finance</em> koju je vodio Thomas Greco — autor knjige{" "}
              <em>The End of Money and the Future of Civilization</em> i jedan od najznačajnijih svetskih
              teoretičara komplementarnih valuta. U grupi je između ostalih bio i tim iz Volosa, koji je
              već četiri godine vodio Volos TEM — grčku lokalnu mrežu razmene gde preko 800 ljudi razmenjuje
              hranu, usluge i zanatske proizvode na posebnim pijacama, beležeći vrednost umesto da je
              plaćaju gotovinom. Organizovao sam više tribina na ovu temu — u Stanišiću, Somboru, Novom
              Sadu i Beogradu.
            </p>
            <p>
              Ideja je kroz godine menjala ime i formu — ALVA (2012), Tranziciona alternativa (2013–14),
              Alva Fondacija (2016–17) — i sazrela u ono što je danas KOLO. Sada, nakon petnaest godina,
              imamo spreman pravni okvir, platformu i strukturu koja je postavljena tako da vremenom radi
              sve nezavisnije od bilo kog pojedinca — uključujući i osnivača.
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
                  { r1: "Pravno", r2: "priznanje", aktivan: false },
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
                  { r1: "Pravno", r2: "priznanje", aktivan: false },
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
            KOLO se priprema za prvo otvaranje
          </h3>
          <p className="text-kolo-muted leading-relaxed mb-8 text-body" style={{ lineHeight: "1.7" }}>
            Završavaju se poslednji koraci pred otvaranje sistema prvim korisnicima.
          </p>

          <div className="space-y-5">
            {[
              {
                naslov: "Registracija Fondacije",
                tekst: "KOLO Fondacija je osnovana kao pravno lice sa sedištem u Somboru; u toku je upis u Agenciju za privredne registre.",
              },
              {
                naslov: "Platforma",
                tekst: "Platforma je u završnoj fazi razvoja, pred prvo otvaranje za verifikovane korisnike.",
              },
              {
                naslov: "Pravna i ekonomska verifikacija sistema",
                tekst: "Dokumentaciju su nezavisno pregledali ekonomisti i pravnici, koji ne vide problem sa ovakvim modelom razmene ni sa ovakvom fondacijom. Provera nije ukazala na bitne pravne ni strukturne nedostatke.",
              },
              {
                naslov: "Komunikacija sa regulatorima",
                tekst: "Sva dokumentacija sistema otvoreno je dostupna svakome ko želi da je pregleda — od pravnika i ekonomista do nadležnih organa. KOLO ne mora da traži dozvolu da postoji jer počiva na postojećim zakonima i pravu građana na slobodno udruživanje i razmenu. Sistem se pokreće otvoreno, a svako može sam da proveri kako i na čemu stoji.",
              },
              {
                naslov: "Tim",
                tekst: "Tim danas čine Upravni odbor Fondacije i spoljni konsultanti. Nakon otvaranja sistema formira se uži krug saradnika koji će zajedno proveriti sistem u praksi i postaviti temelje zajednice. Posle otvaranja, doprinos svakog verifikovanog korisnika — bilo da je to razvoj softvera, prevođenje i pisanje, organizacija okupljanja, mentorstvo, ili pomoć drugima u zajednici — biva prepoznat kroz Program evidencije doprinosa.",
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
            Bilo da imaš pet minuta, znanje, sredstva ili poznanstvo — postoji način da pomogneš.
          </p>
        </div>

        {/* Istaknut kanal — najširi poziv (puna širina, prvi po redu) */}
        <div className="bg-kolo-green-100 rounded-2xl p-6 md:p-8 border-2 border-kolo-green-700 flex flex-col md:flex-row md:items-center gap-5 md:gap-7">
          {/* Ikona — krug ljudi (KOLO = krug) */}
          <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center text-kolo-green-700 mx-auto md:mx-0">
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
              <circle cx="20" cy="13" r="4" fill="currentColor" opacity="0.85" />
              <circle cx="27" cy="26" r="4" fill="currentColor" opacity="0.85" />
              <circle cx="13" cy="26" r="4" fill="currentColor" opacity="0.85" />
              <line x1="20" y1="17" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="23.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="16.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-kolo-green-900 text-xl leading-snug mb-2" style={{ letterSpacing: "-0.01em" }}>
              Budi među prvima u svom kraju
            </h3>
            <p className="text-sm md:text-base text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
              Najvažniji doprinos ne traži ni firmu ni posebno znanje. Dovoljno je da se uključiš i pozoveš
              ljude koje poznaješ — komšije, prijatelje, rođake. Svaki novi krug u jednom mestu počinje od
              nekoliko ljudi koji veruju jedni drugima. Ako želiš da KOLO zaživi tamo gde ti živiš, počni od
              sebe i svog kruga.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/registracija"
              className="block text-center px-7 py-4 bg-kolo-green-700 text-white font-bold rounded-xl hover:bg-kolo-green-900 transition-colors text-base whitespace-nowrap"
            >
              Registruj se besplatno →
            </Link>
          </div>
        </div>

        {/* Primarne kartice (3) */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              naslov: "Rani pristup i verifikacija",
              tekst: "Ako želiš da znaš kad sistem bude otvoren — registruj se za rani pristup. Prvi verifikovani korisnici postavljaju temelje zajednice, i njihov se rad u toj ranoj fazi posebno prepoznaje kroz Program evidencije doprinosa.",
              cta: "Registruj se besplatno →",
              ctaHref: "/registracija",
              ctaIsLink: true,
            },
            {
              naslov: "Postani pokrovitelj",
              tekst: "Ako vodiš firmu ili imaš mogućnost da podržiš razvoj, tvoja donacija Fondaciji pokriva troškove održavanja platforme i rada sistema. Pokrovitelji su javno navedeni, a nivoi doprinosa su transparentno definisani u Pravilniku.",
              cta: "Piši nam → kontakt@ekolo.rs",
              ctaHref: "mailto:kontakt@ekolo.rs",
              ctaIsLink: false,
            },
            {
              naslov: "Pomozi razvoju",
              tekst: "Ako si programer, dizajner ili radiš u nekoj drugoj IT oblasti i možeš da pomogneš razvoju platforme — javi se.",
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
                tekst: "Pisci, novinari, urednici, video-producenti, dizajneri. Posebna potreba: ljudi koji mogu da prevedu složene koncepte u jasan jezik za različite publike (poljoprivrednici, penzioneri, mladi).",
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
                tekst: "Ako nemaš firmu ali želiš da podržiš sistem, i fizička lica mogu biti donatori — taj se doprinos beleži na poseban način, definisan Pravilnikom.",
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
              tekst: "Fondacija je pravni instrument sistema — pravno lice koje prima donacije i sponzorstva u robi, uslugama i novcu. Ona pokriva operativne troškove platforme, drži infrastrukturu i zastupa KOLO pred zajednicom i državom.",
            },
            {
              naslov: "Sedište i registracija",
              tekst: "KOLO Fondacija je osnovana sa sedištem u Somboru (Šetalište 16). U toku je upis u Agenciju za privredne registre.",
            },
            {
              naslov: "Organi",
              tekst: "Upravni odbor i Direktor. Upravni odbor donosi strateške odluke. Direktor vodi operativu. Aktivacijom Gornjeg Kola Fondacija prelazi u servisnu i izvršnu ulogu — primenjuje odluke i upućuje obrazložene odgovore na preporuke Gornjeg Kola.",
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
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Dokumenti (v3.7.0)</p>
            <div className="space-y-2">
              {/* Ključni dokumenti — uvek vidljivi */}
              {[
                { naziv: "Whitepaper", href: "/whitepaper" },
                { naziv: "Statut KOLO Fondacije", href: "/statut" },
                { naziv: "Pravilnik o KOLO sistemu", href: "/pravilnik/kolo-sistem" },
              ].map((dok) => (
                <DokumentRed key={dok.naziv} naziv={dok.naziv} href={dok.href} />
              ))}

              {/* Posebni pravilnici — sklopivo */}
              <details className="group/sek border border-kolo-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-2 p-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-kolo-bg transition-colors">
                  <span className="text-sm font-semibold text-kolo-text">Posebni pravilnici</span>
                  <span className="flex items-center gap-2 text-kolo-muted">
                    <span className="text-[11px]">5 dokumenata</span>
                    <svg className="transition-transform group-open/sek:rotate-90" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-1 pb-1.5 space-y-1">
                  {[
                    { naziv: "Pravilnik o hijerarhiji akata", href: "/pravilnik/hijerarhija" },
                    { naziv: "Pravilnik o dokazu stvarnosti", href: "/pravilnik/dokaz-stvarnosti" },
                    { naziv: "Pravilnik o pokroviteljstvu i donacijama", href: "/pravilnik/pokroviteljstvo-donacije" },
                    { naziv: "Pravilnik o operativnom doprinosu", href: "/pravilnik/operativni" },
                    { naziv: "Pravilnik o osnivačkom doprinosu", href: "/pravilnik/osnivacki" },
                  ].map((dok) => (
                    <DokumentRed key={dok.naziv} naziv={dok.naziv} href={dok.href} />
                  ))}
                </div>
              </details>

              {/* Pravni i korisnički dokumenti — sklopivo */}
              <details className="group/sek border border-kolo-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-2 p-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-kolo-bg transition-colors">
                  <span className="text-sm font-semibold text-kolo-text">Pravni i korisnički dokumenti</span>
                  <span className="flex items-center gap-2 text-kolo-muted">
                    <span className="text-[11px]">5 dokumenata</span>
                    <svg className="transition-transform group-open/sek:rotate-90" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-1 pb-1.5 space-y-1">
                  {[
                    { naziv: "Uslovi korišćenja", href: "/uslovi" },
                    { naziv: "Izjava o prihvatanju rizika", href: "/rizici" },
                    { naziv: "Politika privatnosti", href: "/privatnost" },
                    { naziv: "Procena uticaja na zaštitu podataka (DPIA)", href: "/dpia" },
                    { naziv: "Registar radnji obrade", href: "/radnje-obrade" },
                  ].map((dok) => (
                    <DokumentRed key={dok.naziv} naziv={dok.naziv} href={dok.href} />
                  ))}
                </div>
              </details>

              {/* Uživo — stanje kanala osnivačkog doprinosa */}
              <DokumentRed naziv="Osnivački doprinos — stanje kanala" href="/osnivacki-doprinos" zivo />
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
                  <p className="text-sm font-medium text-kolo-text">KOLO Fondacija, Šetalište 16, Sombor</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-kolo-bg rounded-xl">
              <p className="text-sm text-kolo-muted leading-relaxed text-body">
                Za sva pitanja koja nisu pokrivena u sekciji čestih pitanja, možete nam se obratiti direktno na navedenu adresu.
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
          Postoji sistem i postoji krug ljudi koji se upravo formira.
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
        <p className="text-xs text-white/40 mb-6">Rani pristup · Pred otvaranje · Fondacija u registraciji</p>
        <p className="text-white/40 text-xs">
          Softver: AGPL-3.0 · Sadržaj: CC BY-SA 4.0 · Zajedničko dobro i licence
        </p>
      </section>

    </div>
  );
}
