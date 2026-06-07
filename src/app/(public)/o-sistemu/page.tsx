import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import FaqAkordeon from "@/components/FaqAkordeon";
import { getFaqPoBrojevima } from "@/lib/faq-data";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = pageMetadata({
  title: "O sistemu — KOLO",
  description:
    "KOLO beleži ono čime doprinosimo zajednici — rad, dobra i znanje — i čuva to kao zajedničko dobro, u okviru socijalne i solidarne ekonomije.",
  path: "/o-sistemu",
});

const sistemi = [
  {
    naziv: "WIR",
    podnaslov: "Švajcarska · od 1934.",
    opis: "Najstariji aktivni sistem ove kategorije. Osnovan u jeku velike depresije, kao mreža uzajamnog kredita između preduzeća — svaki član startuje na nuli, zaduženje se vraća prodajom drugim članovima, WIR frank se ne menja u švajcarski frank. Sistem je preživeo tri velike svetske krize i danas radi između desetina hiljada švajcarskih malih i srednjih preduzeća.",
    pokazao:
      "Sistem uzajamnog kredita bez kamate može da preživi devedeset godina i da bude kontracikličan — kada formalna ekonomija slabi, trgovina u WIR-u raste.",
  },
  {
    naziv: "LETS",
    podnaslov: "Kanada · od 1983. · 39 zemalja",
    opis: "Michael Linton je 1983. u malom gradu na ostrvu Vankuver pokrenuo prvu Local Exchange Trading System — lokalnu mrežu u kojoj članovi razmenjuju rad, robu i usluge sopstvenom jedinicom evidencije, bez veze sa nacionalnom valutom. Tipična LETS mreža okuplja desetine do nekoliko stotina ljudi, zbir svih računa je uvek nula. Za četrdeset godina, model se proširio po svetu.",
    pokazao:
      "Lokalna mreža sa sopstvenom jedinicom evidencije ne mora da bude tehnološki napredna da bi radila — i može da traje kroz generacije.",
  },
  {
    naziv: "Sardex",
    podnaslov: "Sardinija, Italija · od 2010.",
    opis: "Osnovan 2010. kao odgovor na dužničku krizu koja je teško pogodila Sardiniju. Četvoro mladih Sardinjana, bez ekonomskog obrazovanja ali sa jasnim uvidom u problem sopstvene sredine, pokrenulo je mrežu uzajamnog kredita između lokalnih preduzeća. Svaki član startuje na nuli, zbir svih računa je uvek nula, nema kamate. Evropska komisija ih je uključila u DigiPay4Growth program.",
    pokazao:
      "Lokalni tim, bez velike investicije i bez direktne državne podrške, može za desetak godina da izgradi održivu mrežu — ako ima istrajnost, strukturu i uvid u stvarne probleme sredine.",
  },
  {
    naziv: "Fureai Kippu",
    podnaslov: "Japan · od 1990-ih",
    opis: "Japanski sistem razmene zasnovan na vremenu i brizi za starije. Članovi koji pomažu starijim ljudima — kroz kućnu negu, pratnju, kuvanje — beleže odrađene sate, mogu ih iskoristiti za sebe ili preneti članu porodice u drugom delu zemlje koji se brine o njihovom roditelju. Razvio se u stotine organizacija sa oko sto hiljada korisnika širom Japana, i godinama radio paralelno sa državnim sistemom nege.",
    pokazao:
      "Sistem evidencije doprinosa može postati infrastruktura brige o osetljivim grupama društva. Prepoznavanje rada brige kao ekonomski merljivog ne degradira njegov ljudski karakter — naprotiv, čini ga vidljivim i prenosivim.",
  },
];

export default async function OSistemuPage() {
  const locale = await getLocale();
  const faqPitanja = getFaqPoBrojevima([1, 4, 28], locale);

  return (
    <div className="space-y-6 pb-12">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-[680px]">
          <div className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Konceptualni okvir
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            O sistemu
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-[600px]">
            KOLO beleži ono čime doprinosimo zajednici — rad, dobra i znanje — i čuva to kao zajedničko dobro.
          </p>
        </div>
      </section>

      {/* ── KOLO ZAJEDNIČKO DOBRO ──────────────────────────────────── */}
      <section id="zajednicko-dobro" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            KOLO Zajedničko dobro
          </h2>

          <blockquote
            className="italic text-kolo-muted leading-relaxed text-base md:text-lg mb-8 text-center"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            „Zrno po zrno — pogača, kamen po kamen — palača."
            <span className="block not-italic text-sm text-kolo-muted/70 mt-3">— narodna poslovica</span>
          </blockquote>

          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              Sve što prolazi kroz KOLO — rad, znanje, dobra, vreme, poznanstva, infrastruktura koju Fondacija održava — ostavlja trag u zajednici: jača mrežu, znanje i poverenje koji svima ostaju na raspolaganju. Gradi je. Čini je sposobnijom da brine o sebi.
            </p>
            <p>
              To zovemo <strong className="text-kolo-green-900">zajedničkim dobrom KOLA</strong>. Niko nije njegov vlasnik. Svi su učesnici. Što više daješ, to ti se više i vraća — kroz priznanje i pristup zajedničkom dobru.
            </p>
            <p>
              <strong className="text-kolo-green-900">POEN</strong> je mera tvog doprinosa zajedničkom dobru i pristup onome što kroz njega prolazi. Priznanje da si doneo nešto — i osnova da koristiš ono što su drugi doneli.
            </p>
          </div>
        </div>
      </section>

      {/* ── ARHITEKTURA SISTEMA ────────────────────────────────────── */}
      <section id="arhitektura" className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-kolo-green-900 text-center" style={{ letterSpacing: "-0.02em" }}>
          Arhitektura sistema
        </h2>

        <div className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="relative overflow-x-auto">
            <svg
              viewBox="0 0 720 740"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-3xl mx-auto"
              style={{ minWidth: "320px" }}
            >
              <defs>
                <marker
                  id="arrow-green"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#1B6B3A" />
                </marker>
                <marker
                  id="arrow-gold"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#A07020" />
                </marker>
              </defs>

              {/* VRH: ZAJEDNIČKO DOBRO */}
              <rect x="40" y="10" width="640" height="110" rx="14" fill="#1B6B3A" />
              <text x="360" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" letterSpacing="3">
                ZAJEDNIČKO DOBRO
              </text>
              <text x="360" y="80" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">
                Mreža, znanje, pravila i evidencija
              </text>
              <text x="360" y="100" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">
                koju Fondacija čuva u ime svih učesnika
              </text>

              <path d="M360 158 L360 130" stroke="#1B6B3A" strokeWidth="2" />
              <polygon points="354,130 360,120 366,130" fill="#1B6B3A" />
              <text x="378" y="150" fill="#4B7A5E" fontSize="13" fontStyle="italic">
                grade i čuvaju
              </text>

              {/* SREDINA: KOLO ZAJEDNICA */}
              <text x="360" y="190" textAnchor="middle" fill="#1B6B3A" fontSize="16" fontWeight="700" letterSpacing="3">
                KOLO ZAJEDNICA
              </text>
              <text x="360" y="212" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                svi korisnici sistema
              </text>

              <rect
                x="20"
                y="225"
                width="680"
                height="315"
                rx="16"
                fill="#F0F9F4"
                stroke="#B3DFC5"
                strokeWidth="1.8"
                strokeDasharray="6 4"
              />

              <circle cx="360" cy="285" r="48" fill="#FFFBEB" stroke="#F0C060" strokeWidth="2.5" />
              <text x="360" y="281" textAnchor="middle" fill="#92600A" fontSize="13" fontWeight="700">
                GORNJE
              </text>
              <text x="360" y="299" textAnchor="middle" fill="#92600A" fontSize="13" fontWeight="700">
                KOLO
              </text>
              <text x="360" y="354" textAnchor="middle" fill="#A07020" fontSize="12" fontStyle="italic">
                upravljačko telo
              </text>

              <path d="M360 415 L360 335" stroke="#F0C060" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.65" />

              <text x="360" y="392" textAnchor="middle" fill="#4B7A5E" fontSize="13" fontWeight="700" letterSpacing="2">
                ČLANOVI
              </text>
              <g transform="translate(282, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(322, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(362, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(402, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(442, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>

              <text x="360" y="505" textAnchor="middle" fill="#4B7A5E" fontSize="12" fontStyle="italic">
                svi korisnici zajedno čine KOLO Zajednicu
              </text>
              <text x="360" y="525" textAnchor="middle" fill="#4B7A5E" fontSize="12" fontStyle="italic">
                nosioci ZRNA odlučuju kroz Gornje Kolo
              </text>

              <path
                d="M187 595 L265 540"
                stroke="#1B6B3A"
                strokeWidth="2"
                strokeDasharray="6 3"
                markerEnd="url(#arrow-green)"
              />
              <path
                d="M532 595 L455 540"
                stroke="#A07020"
                strokeWidth="2"
                strokeDasharray="6 3"
                markerEnd="url(#arrow-gold)"
              />

              {/* DNO: FONDACIJA + PROTOKOL */}
              <rect x="20" y="595" width="335" height="135" rx="14" fill="#F0F9F4" stroke="#B3DFC5" strokeWidth="1.8" />
              <text x="187" y="628" textAnchor="middle" fill="#1B6B3A" fontSize="16" fontWeight="700">
                KOLO FONDACIJA
              </text>
              <text x="187" y="650" textAnchor="middle" fill="#4B7A5E" fontSize="13" fontWeight="600">
                pravna osnova
              </text>
              <line x1="60" y1="662" x2="314" y2="662" stroke="#B3DFC5" strokeWidth="1" />
              <text x="187" y="682" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                · pravno lice (fondacija)
              </text>
              <text x="187" y="700" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                · prima donacije (novac, roba, usluge)
              </text>
              <text x="187" y="718" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                · drži infrastrukturu
              </text>

              <rect x="365" y="595" width="335" height="135" rx="14" fill="#FFFBEB" stroke="#F0C060" strokeWidth="1.8" />
              <text x="532" y="628" textAnchor="middle" fill="#92600A" fontSize="16" fontWeight="700">
                KOLO PROTOKOL
              </text>
              <text x="532" y="650" textAnchor="middle" fill="#A07020" fontSize="13" fontWeight="600">
                tehnička osnova
              </text>
              <line x1="405" y1="662" x2="660" y2="662" stroke="#F0C060" strokeWidth="1" />
              <text x="532" y="682" textAnchor="middle" fill="#A07020" fontSize="12">
                · softverski mehanizam (AGPL-3.0)
              </text>
              <text x="532" y="700" textAnchor="middle" fill="#A07020" fontSize="12">
                · upisuje POEN, vodi ZRNO
              </text>
              <text x="532" y="718" textAnchor="middle" fill="#A07020" fontSize="12">
                · zero-sum invarijanta
              </text>
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              naslov: "KOLO Fondacija",
              podnaslov: "Pravni instrument",
              tekst: "Pravno lice sa sedištem u Somboru. Prima donacije i sponzorstva u dinarima, robi i uslugama. Pokriva operativne troškove sistema, drži infrastrukturu i zastupa KOLO pred zajednicom i državom.",
              boja: "border-kolo-green-700",
            },
            {
              naslov: "KOLO Protokol",
              podnaslov: "Tehnički instrument",
              tekst: "Softverski mehanizam — deo zajedničkog dobra, otvoren pod AGPL-3.0; Fondacija ga održava i pokreće, ali nije njegov vlasnik. Upisuje POEN i vodi evidenciju računa po pravilima koja su unapred određena, javno dostupna i ista za sve. Pri svakom upisu POEN-a, Protokol upisuje isti iznos sebi u minus — zato zbir svih računa uvek ostaje nula.",
              boja: "border-kolo-gold-400",
            },
            {
              naslov: "Gornje Kolo",
              podnaslov: "Upravljačka forma članstva",
              tekst: "Upravno telo svih nosilaca ZRNA; sastav se menja sa svakim obračunskim periodom. Odlučuje kvadratnim glasanjem — glasačka moć jednaka je celobrojnoj vrednosti kvadratnog korena iz broja aktivnih ZRNA (ko ima 100 aktivnih ZRNA, ima 10 glasova), čime se sprečava koncentracija moći.",
              boja: "border-kolo-gold-400",
            },
            {
              naslov: "Korisnici",
              podnaslov: "Učesnici sistema",
              tekst: "Ljudi koji čine KOLO Zajednicu — svi koji pristanu na pravila po kojima ona funkcioniše. Svojim radom, dobrima i znanjem doprinose zajedničkom dobru i za to dobijaju POEN, a kroz njega i pristup onome što su drugi doneli. Oni koji nose ZRNO učestvuju i u odlučivanju kroz Gornje Kolo.",
              boja: "border-kolo-green-700",
            },
          ].map((k) => (
            <div
              key={k.naslov}
              className={`bg-white rounded-2xl card-shadow p-6 md:p-7 flex flex-col gap-3 border-t-4 ${k.boja}`}
            >
              <div>
                <h3 className="text-xl font-bold text-kolo-green-900 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                  {k.naslov}
                </h3>
                <p className="text-xs font-semibold tracking-widest text-kolo-muted uppercase mt-1">
                  {k.podnaslov}
                </p>
              </div>
              <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                {k.tekst}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ── NE IZMIŠLJAMO TOPLU VODU ──────────────────────────────── */}
      <section id="topla-voda" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
              Ne izmišljamo toplu vodu
            </div>
          </div>
          <blockquote
            className="italic text-kolo-muted leading-relaxed text-base md:text-lg mb-6 text-center max-w-[620px] mx-auto"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            „Moralni test svake vlasti jeste kako postupa prema onima koji su u osvit života — deci; onima u sumrak života — starima; i onima u senci života — bolesnima, siromašnima i nemoćnima."
            <span className="block not-italic text-sm text-kolo-muted/70 mt-3">— Hjubert Hamfri</span>
          </blockquote>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            Pilot eksperiment solidarne ekonomije u Srbiji
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              Ideja da zajednica može da organizuje sopstvenu razmenu — da evidentira doprinos svojih
              članova i uspostavi sopstvenu jedinicu evidencije, koja nije novac ali omogućava razmenu
              u zatvorenom krugu — nije nova. Nije ni egzotična. Decenijama u različitim zemljama postoje
              dokumentovane mreže, u kojima ljudi razmenjuju rad, dobra i znanje kroz sopstvene sisteme
              evidencije.
            </p>
            <p>
              <strong className="text-kolo-green-900">Solidarna ekonomija</strong> je međunarodno priznata
              oblast — od zadruga i fondacija do uzajamnih društava — u kojoj organizacije rade zbog
              društvene svrhe, odlučuju demokratski i vraćaju vrednost u zajednicu. Formalno je priznata
              od strane Međunarodne organizacije rada, Generalne skupštine Ujedinjenih nacija, Saveta i
              Komisije Evropske unije, i OECD-a.
            </p>
            <p>
              KOLO ulazi u taj tok kao <strong className="text-kolo-green-900">otvoreni društveni eksperiment</strong> —
              sistem koji se ne predstavlja kao gotov proizvod, već kao okvir koji se gradi kroz učešće,
              učenje i revidiranje pravila kroz demokratske procedure. Istovremeno je{" "}
              <strong className="text-kolo-green-900">pilot model</strong> — konkretna realizacija
              međunarodnog okvira solidarne ekonomije u srpskom pravnom i društvenom kontekstu,
              prilagođena domaćim zakonima i potrebama.
            </p>
          </div>
        </div>
      </section>

      {/* ── POSTOJEĆI SISTEMI ─────────────────────────────────────── */}
      <section id="sistemi" className="space-y-5">
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="text-center mb-4">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
              Postojeći sistemi
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3 text-center" style={{ letterSpacing: "-0.02em" }}>
            Sistemi koji rade — već decenijama
          </h2>
          <p className="text-kolo-muted leading-relaxed max-w-[680px] mx-auto text-center" style={{ lineHeight: "1.7" }}>
            Četiri mreže iz različitih delova sveta. Različite zemlje, različiti konteksti — ali ista
            familija sistema. KOLO pripada toj familiji, sa svojim posebnostima.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {sistemi.map((s) => (
            <div
              key={s.naziv}
              className="bg-white rounded-2xl card-shadow p-6 md:p-7 flex flex-col gap-4 border-t-4 border-kolo-green-700"
            >
              <div>
                <h3 className="text-2xl font-bold text-kolo-green-900 leading-tight" style={{ letterSpacing: "-0.02em" }}>
                  {s.naziv}
                </h3>
                <p className="text-xs font-semibold tracking-widest text-kolo-muted uppercase mt-1.5">
                  {s.podnaslov}
                </p>
              </div>
              <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                {s.opis}
              </p>
              <div className="pt-3 border-t border-kolo-border mt-auto">
                <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-1.5">
                  Šta je pokazao
                </p>
                <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.65" }}>
                  {s.pokazao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KOLO U TOJ FAMILIJI ───────────────────────────────────── */}
      <section id="kolo-familija" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              Gde je tu KOLO
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            Ista familija, sa svojim posebnostima
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              KOLO nije kopija nijedne od navedenih mreža. Za razliku od tih mreža — koje su pre svega
              valute za razmenu — KOLO razdvaja doprinos od glasa:{" "}
              <strong className="text-kolo-green-900">POEN</strong> beleži šta si dao, a{" "}
              <strong className="text-kolo-green-900">ZRNO</strong> nosi glas u odlučivanju, uz kvadratno
              glasanje kao zaštitu da niko ne preuzme moć. Uz to, razmena i njena evidencija su pravno
              odvojene — pa POEN nikad nije plaćanje — a podrška ranjivim grupama (majke, stariji, đaci)
              ugrađena je u sam sistem.
            </p>
            <p>
              Ali fundamentalno, KOLO pripada istoj familiji — sistemi evidencije razmene među
              pojedincima, koji rade komplementarno sa zvaničnom valutom, i koji rade za korisnike
              umesto da ih koriste.
            </p>
          </div>
        </div>
      </section>

      {/* ── MEĐUNARODNI OKVIR ─────────────────────────────────────── */}
      <section id="okvir" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              Međunarodni okvir
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3 text-center" style={{ letterSpacing: "-0.02em" }}>
            Globalni i evropski tok u koji KOLO ulazi
          </h2>
          <p className="text-kolo-muted leading-relaxed mb-8 text-body" style={{ lineHeight: "1.7" }}>
            U poslednje četiri godine solidarna ekonomija je postala formalno priznat sektor — i u UN
            sistemu i u pravnom okviru Evropske unije.
          </p>

          <div className="space-y-5">
            {[
              {
                naslov: "MOR — Rezolucija o solidarnoj ekonomiji",
                godina: "Jun 2022.",
                tekst: "Prva međunarodno usvojena definicija solidarne ekonomije — konsenzus vlada, poslodavaca i radnika iz 187 država. Njena četiri principa: dobrovoljna saradnja, demokratsko upravljanje, autonomija i primat ljudi nad kapitalom.",
              },
              {
                naslov: "UN Generalna skupština — Rezolucija A/RES/77/281",
                godina: "April 2023.",
                tekst: "Prva rezolucija UN o solidarnoj ekonomiji u istoriji; poziva države da za nju razviju pravne okvire.",
              },
              {
                naslov: "EU — Akcioni plan za socijalnu ekonomiju (SEAP)",
                godina: "Decembar 2021.",
                tekst: "Okvir EU do 2030. godine, sa preko šezdeset akcija. Imenuje digitalne platformske zadruge i tehnologiju za opšte dobro (tech for good) kao prepoznate modele — terminološka legitimacija pristupa kakav KOLO predstavlja.",
              },
              {
                naslov: "EU — Preporuka Saveta",
                godina: "Novembar 2023.",
                tekst: "Razrada Akcionog plana; poziva države da usvoje nacionalne strategije. Među prioritetima imenuje i lokalne kratke lance hrane — pravac u kome se KOLO kreće.",
              },
            ].map((stavka) => (
              <div key={stavka.naslov} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-kolo-green-700 mt-2.5 shrink-0" />
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
                    <p className="font-semibold text-kolo-text leading-snug">{stavka.naslov}</p>
                    <span className="text-xs text-kolo-muted font-medium tracking-wide whitespace-nowrap">
                      {stavka.godina}
                    </span>
                  </div>
                  <p className="text-sm text-kolo-muted leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                    {stavka.tekst}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-kolo-border">
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-3">
              Pristupni proces Srbije
            </p>
            <p className="text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
              Srbija pristupa EU, pa pravac Unije postaje i pravac Srbije — formalno kroz{" "}
              <strong className="text-kolo-green-900">poglavlja 19 i 22</strong>, ali pre svega kroz
              konkretne projekte koji se kreću u istom smeru ne čekajući direktive. KOLO je jedan od njih.
            </p>
          </div>
        </div>
      </section>

      {/* ── ZAŠTO SAD I OVDE ──────────────────────────────────────── */}
      <section id="zasto-sad" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              Zašto sad i ovde
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            Trenutak je posebno povoljan
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              Solidarna ekonomija je sada formalno priznat sektor, a Srbija
              je u procesu pristupanja Evropskoj uniji.
            </p>
            <p>
              Unutar srpskog konteksta, <strong className="text-kolo-green-900">Sombor</strong> je
              idealan za pilot projekat. Vojvođanska Bačka ima jednu od najdužih tradicija zadrugarstva
              na svetu — treća zadruga ikada osnovana je 1846. u Bačkom Petrovcu, samo dve godine posle
              prve u Engleskoj. Poljoprivredne zadruge, salašarska ekonomija — to je živo sećanje koje
              stariji ljudi u somborskim selima pamte iz prve ruke. KOLO aktivira oblik organizovanja
              koji je u ovim krajevima istorijski normalan.
            </p>
            <p>
              Sombor je dovoljno velik da efekti mreže budu merljivi, a dovoljno mali da se vide bez
              statističkog šuma. Urbano jezgro opasano salašima i selima omogućava da pilot u jednom
              potezu obuhvati zanatliju, penzionera, domaćicu, mladu majku i poljoprivrednika — sve tipove
              korisnika koje sistem mora da izdrži. Ako solidarni ekonomski sistem ima šta da ponudi, mora
              to prvo da ponudi mestu kakvo je Sombor.
            </p>
          </div>
        </div>
      </section>

      {/* ── MARGARET MID CITAT ────────────────────────────────────── */}
      <section className="bg-kolo-green-100 rounded-2xl p-6 md:p-10 border-l-4 border-kolo-green-700">
        <div className="max-w-[680px] mx-auto">
          <blockquote
            className="text-base md:text-lg text-kolo-text mb-4 text-body"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            <span className="text-kolo-green-700 font-bold mr-0.5">&bdquo;</span>
            Nikada ne sumnjaj da mala grupa promišljenih, posvećenih ljudi može da promeni svet — to je,
            zapravo, jedino što ga je ikada menjalo.
            <span className="text-kolo-green-700 font-bold ml-0.5">&ldquo;</span>
          </blockquote>
          <p className="text-sm text-kolo-muted font-medium text-center">— Margaret Mid</p>
        </div>
      </section>

      {/* ── FAQ TIZER ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            Strukturni koncepti
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Često postavljana pitanja
          </h2>
        </div>
        <FaqAkordeon pitanja={faqPitanja} />
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
          Sad kad znaš odakle dolazi sistem,<br />
          pogledaj kako radi i ko stoji iza njega.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Link
            href="/kako-funkcionise"
            className="px-7 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
          >
            Kako KOLO funkcioniše →
          </Link>
          <Link
            href="/o-nama"
            className="px-7 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            Ko stoji iza KOLA →
          </Link>
          <Link
            href="/registracija"
            className="px-7 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            Pridruži se →
          </Link>
        </div>
        <p className="text-white/40 text-xs">
          Softver: AGPL-3.0 · Sadržaj: CC BY-SA 4.0 · Zajedničko dobro i licence
        </p>
      </section>

    </div>
  );
}
