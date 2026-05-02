import type { Metadata } from "next";
import Link from "next/link";
import FaqAkordeon from "@/components/FaqAkordeon";
import { poBrojevima } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "O sistemu — KOLO",
  description:
    "KOLO je otvoreni društveni eksperiment uzajamne razmene doprinosa zajedničkom dobru, u okviru socijalne i solidarne ekonomije.",
};

const sistemi = [
  {
    naziv: "WIR",
    podnaslov: "Švajcarska · od 1934.",
    opis: "Najstariji aktivni sistem ove kategorije. Osnovan u jeku velike depresije, kao mreža uzajamnog kredita između preduzeća — svaki član startuje na nuli, zaduženje se vraća prodajom drugim članovima, WIR frank se ne menja u švajcarski frank. Sistem je preživeo tri velike svetske krize i danas radi između desetina hiljada švajcarskih malih i srednjih preduzeća.",
    pokazao:
      "Sistem uzajamnog kredita bez kamate i bez veze sa nacionalnom valutom može da preživi devedeset godina i da bude kontracikličan — kada formalna ekonomija slabi, trgovina u WIR-u raste.",
    uzima: "Princip uzajamnog kredita, zbira-nula i nekonvertibilnosti u nacionalnu valutu.",
    drugacije: "WIR je B2B mreža; KOLO je primarno P2P, sa firmama kao pokroviteljima.",
  },
  {
    naziv: "LETS",
    podnaslov: "Kanada · od 1983. · 39 zemalja",
    opis: "Michael Linton je 1983. u malom gradu na ostrvu Vankuver pokrenuo prvu Local Exchange Trading System — lokalnu mrežu u kojoj članovi razmenjuju rad, robu i usluge sopstvenom jedinicom evidencije, bez veze sa nacionalnom valutom. Tipična LETS mreža okuplja desetine do nekoliko stotina ljudi, zbir svih računa je uvek nula. Za četrdeset godina, model se proširio po svetu.",
    pokazao:
      "Lokalna mreža sa sopstvenom jedinicom evidencije ne mora da bude tehnološki napredna da bi radila — i može da traje kroz generacije.",
    uzima: "P2P logika i lokalna autonomija.",
    drugacije:
      "LETS se oslanja samo na lokalni krug; KOLO uvodi mogućnost povezivanja Krugova kroz Protokol i dodaje upravljački sloj (ZRNO) koji LETS nikada nije razvio.",
  },
  {
    naziv: "Sardex",
    podnaslov: "Sardinija, Italija · od 2010.",
    opis: "Osnovan 2010. kao odgovor na dužničku krizu koja je teško pogodila Sardiniju. Četvoro mladih Sardinjana, bez ekonomskog obrazovanja ali sa jasnim uvidom u problem sopstvene sredine, pokrenulo je mrežu uzajamnog kredita između lokalnih preduzeća. Svaki član startuje na nuli, zbir svih računa je uvek nula, nema kamate. Evropska komisija ih je uključila u DigiPay4Growth program.",
    pokazao:
      "Lokalni tim, bez velike investicije i bez direktne državne podrške, može za desetak godina da izgradi održivu mrežu — ako ima istrajnost, strukturu i uvid u stvarne probleme sredine.",
    uzima: "Princip uzajamnog kredita između članova bez kamate.",
    drugacije: "Sardex je B2B; KOLO je P2P, sa programima podrške ranjivim grupama ugrađenim u arhitekturu.",
  },
  {
    naziv: "Fureai Kippu",
    podnaslov: "Japan · od kasnih 1980-ih",
    opis: "Japanski sistem razmene zasnovan na vremenu i brizi za starije. Članovi koji pomažu starijim ljudima — kroz kućnu negu, pratnju, kuvanje — beleže odrađene sate, mogu ih iskoristiti za sebe ili preneti članu porodice u drugom delu zemlje koji se brine o njihovom roditelju. Vlada Japana ga je formalno prepoznala kao deo nacionalne politike brige o starijim ljudima.",
    pokazao:
      "Sistem evidencije doprinosa može postati infrastruktura brige o osetljivim grupama društva. Prepoznavanje rada brige kao ekonomski merljivog ne degradira njegov ljudski karakter — naprotiv, čini ga vidljivim i prenosivim.",
    uzima: "Programi Podrška Starijima, Podrška Majkama, Posebna Briga, Školovanje.",
    drugacije: "Fureai Kippu meri vreme; KOLO meri doprinos u njegovoj raznovrsnosti — vreme, znanje, robu, novac — kroz jedinstvenu jedinicu (POEN).",
  },
];

export default function OSistemuPage() {
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
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-[600px]">
            KOLO je sistem evidencije doprinosa zajedničkom dobru.
          </p>
          {/* Mini-sadržaj */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/50">
            <a href="#zajednicko-dobro" className="hover:text-white/80 transition-colors">Zajedničko dobro</a>
            <span className="text-white/20">·</span>
            <a href="#ko-sta-radi" className="hover:text-white/80 transition-colors">Ko šta radi</a>
            <span className="text-white/20">·</span>
            <a href="#topla-voda" className="hover:text-white/80 transition-colors">Ne izmišljamo toplu vodu</a>
            <span className="text-white/20">·</span>
            <a href="#sistemi" className="hover:text-white/80 transition-colors">Provereni sistemi</a>
            <span className="text-white/20">·</span>
            <a href="#okvir" className="hover:text-white/80 transition-colors">Međunarodni okvir</a>
            <span className="text-white/20">·</span>
            <a href="#zasto-sad" className="hover:text-white/80 transition-colors">Zašto sad i ovde</a>
          </div>
        </div>
      </section>

      {/* ── ZAJEDNIČKO DOBRO KOLA ──────────────────────────────────── */}
      <section id="zajednicko-dobro" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Zajedničko dobro
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6" style={{ letterSpacing: "-0.02em" }}>
            Zajedničko dobro KOLA
          </h2>

          <blockquote
            className="border-l-4 border-kolo-green-700 pl-4 italic text-kolo-muted leading-relaxed text-base md:text-lg mb-8"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            Kad su ljudi bili žedni, iskopali su bunar.<br />
            Iz njega je pio svako, i niko više nije bio žedan.<br />
            Bunar je bio njihov — i nije bio ničiji.
          </blockquote>

          <div className="space-y-5 text-kolo-text leading-relaxed" style={{ lineHeight: "1.75" }}>
            <p>
              Sve što prolazi kroz KOLO sistem — rad članova, znanje i veštine, dobra koja idu iz ruke u ruku, vreme posvećeno drugima, mreža poznanstava i poverenja, infrastruktura koju Fondacija održava — ostaje u zajednici. Gradi je. Čini je sposobnijom da brine o sebi.
            </p>
            <p>
              To zovemo <strong className="text-kolo-green-900">zajedničkim dobrom KOLA</strong>. Niko nije njegov vlasnik. Svi su učesnici. Što više daješ, veći je tvoj udeo u njemu.
            </p>
            <p>
              <strong className="text-kolo-green-900">POEN</strong> je mera tvog doprinosa zajedničkom dobru i pristup onome što kroz njega prolazi. Priznanje da si doneo nešto — i osnova da koristiš ono što su drugi doneli.
            </p>
          </div>
        </div>
      </section>

      {/* ── KO ŠTA RADI U SISTEMU ──────────────────────────────────── */}
      <section id="ko-sta-radi" className="space-y-5">
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Ko šta radi u sistemu
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            Dva instrumenta i dve forme okupljanja članova
          </h2>
          <p className="text-kolo-muted leading-relaxed max-w-[680px]" style={{ lineHeight: "1.7" }}>
            KOLO počiva na dva instrumenta i dve forme okupljanja članova. Svaki ima jasnu ulogu i jasnu granicu — niko ne može u tuđu nadležnost.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              naslov: "KOLO Fondacija",
              podnaslov: "Pravna osnova",
              tekst: "Pravno lice sa sedištem u Somboru. Prima donacije u dinarima, robi i uslugama. Pokriva operativne troškove sistema, drži infrastrukturu i zastupa KOLO pred zajednicom i državom. Ne emituje POEN i ne raspolaže njime.",
              boja: "border-kolo-green-700",
            },
            {
              naslov: "KOLO Protokol",
              podnaslov: "Tehnička osnova",
              tekst: "Softverski protokol u vlasništvu Fondacije. Bez pravnog subjektiviteta, ne prima dinare. Emituje POEN i vodi evidenciju računa po pravilima koja su unapred određena, javno dostupna i ista za sve. Pri svakoj emisiji POEN-a, Protokol sam ide u minus — to je razlog zašto zbir svih računa u sistemu ostaje uvek nula.",
              boja: "border-kolo-gold-400",
            },
            {
              naslov: "KOLO Krugovi",
              podnaslov: "Operativna forma članstva",
              tekst: "Lokalne ili tematske grupe od najmanje pet verifikovanih korisnika, okupljene oko zajedničkog interesa — to može biti posao, mesto, zanimanje, ideja. Krug donosi sopstvena interna pravila i sam organizuje aktivnosti svojih članova. Nema pravnog subjektiviteta i ne registruje se u APR-u.",
              boja: "border-kolo-green-700",
            },
            {
              naslov: "Gornje Kolo",
              podnaslov: "Upravljačka forma članstva",
              tekst: "Skup svih korisnika koji poseduju ZRNO — jedinicu glasačke moći. Glasa kvadratnim korenom (ko ima sto ZRNA, ima deset glasova), čime se sprečava koncentracija moći. Aktivira se tek kada opticaj POEN-a u sistemu dostigne milion. Do tada Fondacija sama upravlja sistemom.",
              boja: "border-kolo-gold-400",
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
              <p className="text-sm text-kolo-text leading-relaxed" style={{ lineHeight: "1.7" }}>
                {k.tekst}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-kolo-bg rounded-xl p-4 text-center">
          <p className="text-sm text-kolo-muted leading-relaxed">
            Detalji u Pravilniku. Mehanički prikaz arhitekture i pragova{" "}
            <Link href="/kako-funkcionise" className="text-kolo-green-700 hover:underline font-medium">
              → /kako-funkcionise
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── NE IZMIŠLJAMO TOPLU VODU ──────────────────────────────── */}
      <section id="topla-voda" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Ne izmišljamo toplu vodu
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6" style={{ letterSpacing: "-0.02em" }}>
            Pilot eksperiment u dokazanoj kategoriji
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed" style={{ lineHeight: "1.75" }}>
            <p>
              Ideja da krug može da organizuje sopstvenu razmenu — da evidentira doprinos svojih članova
              i uspostavi jedinicu koja nije novac ali radi posao novca u zatvorenom krugu — nije nova.
              Nije ni egzotična. Decenijama postoje dokumentovane mreže, u različitim zemljama i pod
              različitim okolnostima, u kojima ljudi razmenjuju rad, dobra i znanje kroz sopstvene
              sisteme evidencije.
            </p>
            <p>
              <strong className="text-kolo-green-900">Solidarna ekonomija</strong> je međunarodno priznata
              kategorija ekonomske aktivnosti — sektor koji obuhvata zadruge, fondacije, uzajamna društva,
              udruženja i druge organizacije čije delovanje počiva na društvenoj svrsi, demokratskom
              upravljanju i reinvesticiji u zajednicu. Formalno je priznata od strane Međunarodne
              organizacije rada, Generalne skupštine Ujedinjenih nacija, Saveta i Komisije Evropske unije,
              i OECD-a.
            </p>
            <p>
              KOLO ulazi u taj tok kao <strong className="text-kolo-green-900">otvoreni društveni eksperiment</strong> —
              sistem koji se ne predstavlja kao gotov proizvod, već kao okvir koji se gradi kroz učešće,
              učenje i revidiranje pravila kroz demokratske procedure. Istovremeno je{" "}
              <strong className="text-kolo-green-900">pilot model</strong> — konkretna realizacija
              međunarodnog okvira solidarne ekonomije u srpskom pravnom i društvenom kontekstu, jer pre
              KOLA u Srbiji nije postojala digitalna infrastruktura ovog tipa.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROVERENI SISTEMI ─────────────────────────────────────── */}
      <section id="sistemi" className="space-y-5">
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Provereni sistemi
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            Sistemi koji rade — već decenijama
          </h2>
          <p className="text-kolo-muted leading-relaxed max-w-[680px]" style={{ lineHeight: "1.7" }}>
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
              <p className="text-sm text-kolo-text leading-relaxed" style={{ lineHeight: "1.7" }}>
                {s.opis}
              </p>
              <div className="space-y-3 pt-3 border-t border-kolo-border">
                <div>
                  <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-1.5">
                    Šta je pokazao
                  </p>
                  <p className="text-sm text-kolo-text leading-relaxed" style={{ lineHeight: "1.65" }}>
                    {s.pokazao}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-kolo-green-700 uppercase mb-1.5">
                    Šta KOLO uzima
                  </p>
                  <p className="text-sm text-kolo-text leading-relaxed" style={{ lineHeight: "1.65" }}>
                    {s.uzima}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-kolo-gold-600 uppercase mb-1.5">
                    Šta KOLO radi drugačije
                  </p>
                  <p className="text-sm text-kolo-text leading-relaxed" style={{ lineHeight: "1.65" }}>
                    {s.drugacije}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MEĐUNARODNI OKVIR ─────────────────────────────────────── */}
      <section id="okvir" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Međunarodni okvir
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            Globalni i evropski tok u koji KOLO ulazi
          </h2>
          <p className="text-kolo-muted leading-relaxed mb-8" style={{ lineHeight: "1.7" }}>
            U poslednje četiri godine, solidarna ekonomija postala je formalno priznat sektor — i u UN
            sistemu, i u pravnom okviru Evropske unije.
          </p>

          <div className="space-y-5">
            {[
              {
                naslov: "MOR — Rezolucija o pristojnom radu i solidarnoj ekonomiji",
                godina: "Jun 2022.",
                tekst: "Prva tripartitno usvojena definicija solidarne ekonomije na međunarodnom nivou. Konsenzus predstavnika vlada, poslodavaca i radnika iz sto osamdeset sedam država. Iz nje izlaze četiri ključna principa: dobrovoljna saradnja, demokratsko upravljanje, autonomija i primat ljudi nad kapitalom.",
              },
              {
                naslov: "UN Generalna skupština — Rezolucija A/RES/77/281",
                godina: "April 2023.",
                tekst: "Prva rezolucija Generalne skupštine UN o solidarnoj ekonomiji u istoriji. Preuzima MOR definiciju i poziva države da razvijaju specifične pravne okvire za organizacije socijalne i solidarne ekonomije.",
              },
              {
                naslov: "EU — Akcioni plan za socijalnu ekonomiju (SEAP)",
                godina: "Decembar 2021.",
                tekst: "Politički okvir EU za period do 2030. godine, sa trideset osam konkretnih mera. Eksplicitno imenuje digitalne platformske zadruge i Tech4good kao prepoznate modele — što je direktna terminološka legitimacija pristupa kakav KOLO predstavlja.",
              },
              {
                naslov: "EU — Preporuka Saveta o razvoju okvirnih uslova za socijalnu ekonomiju",
                godina: "Novembar 2023.",
                tekst: "Operativna razrada Akcionog plana. Države članice se pozivaju da usvoje ili ažuriraju nacionalne strategije. Eksplicitno pominje digitalne platformske zadruge i lokalne kratke lance hrane i pijace kao prioritete — direktan opis arhitekture KOLO Pijace i KOLO Krugova.",
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
                  <p className="text-sm text-kolo-muted leading-relaxed" style={{ lineHeight: "1.7" }}>
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
            <p className="text-kolo-text leading-relaxed" style={{ lineHeight: "1.75" }}>
              Srbija je u procesu pristupanja Evropskoj uniji, što znači da pravac kojim Unija ide
              postaje pravac kojem se i Srbija usklađuje — formalno, kroz pregovaračka{" "}
              <strong className="text-kolo-green-900">poglavlje 19</strong> (socijalna politika i
              zapošljavanje) i <strong className="text-kolo-green-900">poglavlje 22</strong> (regionalna
              politika), ali i suštinski, kroz konkretne projekte koji ne čekaju direktive nego se
              kreću u istom smeru. KOLO je jedan od takvih projekata.
            </p>
          </div>
        </div>
      </section>

      {/* ── ZAŠTO SAD I OVDE ──────────────────────────────────────── */}
      <section id="zasto-sad" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="inline-block bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Zašto sad i ovde
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6" style={{ letterSpacing: "-0.02em" }}>
            Trenutak je posebno povoljan
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed" style={{ lineHeight: "1.75" }}>
            <p>
              KOLO nije kopija nijedne od navedenih mreža. Razlike su stvarne —{" "}
              <strong className="text-kolo-green-900">KOLO Krug</strong> kao opciona forma lokalnog ili
              tematskog okupljanja, <strong className="text-kolo-green-900">ZRNO</strong> kao odvojena
              jedinica glasa sa kvadratnim korenom kao zaštitom od koncentracije moći, pravna priroda
              svake transakcije definisana po principu dva odvojena akta, programi podrške ranjivim
              grupama ugrađeni u arhitekturu.
            </p>
            <p>
              Ali fundamentalno, KOLO pripada istoj familiji — sistemi evidencije razmene među
              pojedincima, koji rade komplementarno sa zvaničnom valutom, i koji rade za korisnike
              umesto da ih koriste.
            </p>
            <p>
              Trenutak je posebno povoljan. UN i MOR rezolucije, Akcioni plan i Preporuka Saveta EU,
              postavili su solidarnu ekonomiju kao formalno priznat sektor. Srbija je u procesu
              pristupanja Evropskoj uniji.
            </p>
            <p>
              Ono što je u Somboru rađeno četrnaest godina nije eksperimentisanje u praznom prostoru.
              To je adaptacija proverene kategorije sistema u srpski pravni i društveni kontekst — sa
              svim posebnostima koje taj kontekst zahteva. KOLO nije izum. KOLO je odgovor — lokalan,
              srpski, sa korenima u proverenim svetskim modelima — na istu globalnu situaciju zbog
              koje je solidarna ekonomija već u međunarodnom okviru ušla u praksu kao formalan sektor,
              a ne više kao margina.
            </p>
          </div>
        </div>
      </section>

      {/* ── BUCKMINSTER FULLER CITAT ──────────────────────────────── */}
      <section className="bg-kolo-green-100 rounded-2xl p-6 md:p-10 border-l-4 border-kolo-green-700">
        <div className="max-w-[680px] mx-auto">
          <blockquote
            className="text-base md:text-lg text-kolo-text mb-4"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            <span className="text-kolo-green-700 font-bold mr-0.5">&bdquo;</span>
            Postojeću stvarnost nikada ne menjaš boreći se protiv nje. Da bi nešto promenio,
            izgradi novi model koji postojeći čini zastarelim.
            <span className="text-kolo-green-700 font-bold ml-0.5">&ldquo;</span>
          </blockquote>
          <p
            className="text-sm text-kolo-muted italic mb-4"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            „You never change things by fighting the existing reality. To change something, build a new
            model that makes the existing model obsolete."
          </p>
          <p className="text-sm text-kolo-muted font-medium">— Buckminster Fuller</p>
        </div>
      </section>

      {/* ── FAQ TIZER ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            Strukturni koncepti
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Često postavljana pitanja
          </h2>
        </div>
        <FaqAkordeon pitanja={poBrojevima([4, 11, 28])} />
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
      </section>

    </div>
  );
}
