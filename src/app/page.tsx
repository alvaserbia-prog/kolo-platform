import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import FaqAkordeon from "@/components/FaqAkordeon";
import { poBrojevima } from "@/lib/faq-data";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "KOLO — Sistem uzajamnosti koji gradiš sa svojom zajednicom",
  description:
    "KOLO je sistem evidencije doprinosa zajedničkom dobru. POEN beleži šta si dao zajednici. ZRNO ti daje glas u odlukama koje sistem oblikuju.",
  openGraph: {
    title: "KOLO — Sistem uzajamnosti koji gradiš sa svojom zajednicom",
    description: "KOLO je sistem uzajamnosti kroz mrežu lokalnih krugova. Članstvo je besplatno.",
    locale: "sr_RS",
    type: "website",
  },
};

async function getPijacaPreview() {
  try {
    const listings = await prisma.marketplaceListing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        location: true,
        createdAt: true,
        images: true,
        seller: { select: { pseudonim: true } },
      },
    });

    // Uzmi jedan oglas iz svake kategorije (prvih 6 različitih), onda dopuni najnovijim
    const seen = new Set<string>();
    const result = [];
    for (const l of listings) {
      if (!seen.has(l.category) && result.length < 6) {
        seen.add(l.category);
        result.push(l);
      }
    }
    // Dopuni ako ima manje od 6 različitih kategorija
    if (result.length < 6) {
      for (const l of listings) {
        if (result.length >= 6) break;
        if (!result.find((r) => r.id === l.id)) result.push(l);
      }
    }
    return result;
  } catch {
    return [];
  }
}

// Naslovnu vidi samo gost (prijavljeni se preusmeravaju na /dashboard). Po
// gradiranoj vidljivosti (Politika čl. 6), gost vidi SAMO agregate — ne
// pojedinačne transakcije ni pseudonime. Opticaj se računa kao zbir pozitivnih
// stanja (pod zero-sum jednako apsolutnoj vrednosti minusa Protokola) — bez
// zavisnosti od ID-ja Protokol novčanika.
async function getAgregati() {
  try {
    const [brojTransakcija, brojClanova, opticajAgg] = await Promise.all([
      prisma.transaction.count(),
      prisma.user.count({ where: { verified: true } }),
      prisma.wallet.aggregate({ _sum: { balance: true }, where: { balance: { gt: 0 } } }),
    ]);
    return {
      brojTransakcija,
      brojClanova,
      opticaj: Number(opticajAgg._sum.balance ?? 0),
    };
  } catch {
    return { brojTransakcija: 0, brojClanova: 0, opticaj: 0 };
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const [pijacaOglasi, agregati] = await Promise.all([
    getPijacaPreview(),
    getAgregati(),
  ]);

  return (
    <div className="min-h-screen bg-kolo-bg">

      <PublicHeader />

      <div className="max-w-[932px] mx-auto px-6 py-8 space-y-6 pb-20">

        {/* ── SEKCIJA 1 — HERO ─────────────────────────────────────── */}
        <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-[1fr_360px] gap-10 items-center">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                Udružimo snage u svom kraju
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-7">
                kroz razmenu rada, dobara i znanja — bez posrednika.<br />Svaki doprinos se beleži. I tvoj.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/kako-funkcionise"
                  className="px-6 py-3 bg-kolo-gold-600 text-white font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors text-sm">
                  Kako to radi →
                </Link>
                <Link href="/registracija"
                  className="px-6 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Otvori nalog besplatno
                </Link>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 border border-white/30 rounded-full text-xs font-medium text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-kolo-gold-400" />
                Bez obaveza
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kolo-hero-logo.png"
                alt="KOLO"
                style={{ width: 385, height: "auto", opacity: 0.97 }}
              />
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 2 — PROBLEM KOJI SVI OSEĆAMO ────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Problem koji osećamo
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3 items-center text-center">
              <p className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>Ne znamo šta jedemo.</p>
              <div className="space-y-2">
                <p className="text-sm text-kolo-muted leading-relaxed">
                  Kupujemo hranu koja je putovala hiljade kilometara, dok neko iz našeg komšiluka proizvodi baš to — med, jaja, sir, voće, povrće.
                </p>
                <p className="text-sm text-kolo-green-900 font-medium leading-relaxed">Ono što nam treba raste pored nas, ali do nas ne stiže.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center text-center">
              <p className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>Proizvođači ne mogu do nas.</p>
              <div className="space-y-2">
                <p className="text-sm text-kolo-muted leading-relaxed">
                  Potrošnja je utabana kroz veletrgovine i lance u koje mali proizvođač ne može da uđe. Oni su zatvoreni za njega, a mi smo zatvoreni u njima.
                </p>
                <p className="text-sm text-kolo-green-900 font-medium leading-relaxed">Tražnja postoji, ponuda postoji — kanal ne postoji.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center text-center">
              <p className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>Znanja i veštine su nevidljivi.</p>
              <div className="space-y-2">
                <p className="text-sm text-kolo-muted leading-relaxed">
                  Komšija je majstor, komšinica pravi najbolji sir u kraju, njihov sin drži časove. Ali to zna samo njihova bliža okolina.
                </p>
                <p className="text-sm text-kolo-green-900 font-medium leading-relaxed">Sve to nam treba svaki dan — ali niko to ne povezuje i ne beleži.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 3 — KOLO TI DAJE ALTERNATIVU (konsolidovano) ── */}
        <section className="space-y-6 text-center">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-4 py-2 rounded-full tracking-wide uppercase">
            KOLO je odgovor koji gradimo zajedno
          </div>

          <blockquote
            className="italic text-kolo-green-900 leading-relaxed text-2xl md:text-3xl max-w-3xl mx-auto"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.5" }}
          >
            „Kad su ljudi bili žedni, iskopali su bunar.<br />
            Iz njega je pio svako, i niko više nije bio žedan.<br />
            Bunar je bio njihov — i nije bio ničiji.<br />
            KOLO je takav bunar."
          </blockquote>

          <div className="bg-white rounded-2xl card-shadow px-6 py-5 md:px-8 md:py-6 max-w-4xl mx-auto">
            <p className="text-kolo-green-900 font-bold leading-snug text-lg md:text-xl" style={{ letterSpacing: "-0.01em" }}>
              Mreža ljudi koji jedni drugima nude rad, dobra i znanje — bez posrednika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              {
                naslov: "Ljudi, a ne anonimno tržište",
                tekst: "Komšija, prijatelj, prijatelj prijatelja — ljudi koji ti mogu nešto ponuditi i kojima ti možeš nešto dati za uzvrat. KOLO ih međusobno povezuje i čini doprinose vidljivim. Ono što jedni imaju, drugima treba.",
              },
              {
                naslov: "Doprinos koji se pamti",
                tekst: "Svaki put kad nekome u mreži daš robu, uslugu ili znanje — to se beleži. Ta beleška se zove POEN — interna jedinica računa unutar mreže. Nije novac, ne menja se za dinare, ne ide na berzu. Tako se vidi šta si dao mreži — i drugi te lakše prepoznaju kad i tebi nešto zatreba.",
                istakniPoen: true,
              },
              {
                naslov: "Pravila su ista za sve",
                tekst: "Pravila sistema i način donošenja odluka su javno zapisani i dostupni svima. Pravila se ne menjaju u korist pojedinca — menjaju se samo zajednički i po istom postupku za sve. Zajedničkim resursima upravlja sama zajednica, ne neko sa strane.",
              },
            ].map((kartica) => (
              <div
                key={kartica.naslov}
                className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-3 border-t-4 border-kolo-green-700"
              >
                <h3 className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>
                  {kartica.naslov}
                </h3>
                <p className="text-sm text-kolo-text leading-relaxed">
                  {kartica.istakniPoen ? (
                    <>
                      Svaki put kad nekome u mreži daš robu, uslugu ili znanje — to se beleži. Ta beleška se zove <strong className="text-kolo-green-900">POEN</strong> — interna jedinica računa unutar mreže. Nije novac, ne menja se za dinare, ne ide na berzu. Tako se vidi šta si dao mreži — i drugi te lakše prepoznaju kad i tebi nešto zatreba.
                    </>
                  ) : (
                    kartica.tekst
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/kako-funkcionise" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
              Detaljno kako to radi →
            </Link>
          </div>
        </section>

        {/* ── SEKCIJA 4 — ZA KOGA JE KOLO ─────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Za koga je KOLO?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                ikona: "🌱",
                naslov: "Poljoprivrednici i lokalni proizvođači",
                opis: "Tvoji domaći proizvodi direktno do ljudi koji ih traže — bez otkupljivača, bez provizije.",
                poenta: "Svaki tvoj trud se beleži i vidi — ništa ne nestaje u tuđem džepu.",
              },
              {
                ikona: "🔧",
                naslov: "Zanatlije i majstori",
                opis: "Ljudi u tvom kraju vide šta radiš i mogu te preporučiti — na osnovu stvarnog iskustva, bez provizije.",
                poenta: "Manje praznog hoda, više posla od ljudi kojima treba i koji znaju šta je dobar rad.",
              },
              {
                ikona: "👴👵",
                naslov: "Penzioneri sa znanjem",
                opis: "Znaš da popravljaš, savetuješ, predaješ — razmeni to za domaće proizvode ili usluge koje ti trebaju, sa ljudima koje poznaje neko od tvojih.",
                poenta: "Tvoje iskustvo postaje vidljivo i traženo.",
              },
              {
                ikona: "🏠",
                naslov: "Domaća proizvodnja i ručni rad",
                opis: "Ponudi zimnice, peciva i ručni rad u svom kraju — i razmeni sa komšinicama za ono što tebi treba.",
                poenta: "Kućni rad postaje vidljiv kao doprinos zajednici.",
              },
              {
                ikona: "👩‍👧",
                naslov: "Majke i roditelji",
                opis: "Čuvanje dece, nabavka zdrave hrane, svakodnevna pomoć — od ljudi koje poznaješ ili koje poznaje neko kome veruješ.",
                poenta: "Imaš pomoć da budeš roditelj — jer smo svi tu jedni za druge.",
              },
              {
                ikona: "🌅",
                naslov: "Novi početak",
                opis: "Prvi klijenti, neformalni rad i prostor da razviješ svoje — u mreži ljudi iz tvog kraja.",
                poenta: "Dostojanstvo, razlog da ostaneš ovde i okruženje na koje možeš da utičeš.",
              },
              {
                ikona: "💻",
                naslov: "Programeri i freelanceri",
                opis: "Otvoren kod (AGPL-3.0), sadržaj pod CC BY-SA 4.0. Možeš da proveriš kako sistem radi, predložiš izmene ili doprineseš razvoju.",
                poenta: "Smislen projekat kome veruješ jer možeš da ga pročitaš.",
              },
              {
                ikona: "🤝",
                naslov: "Postojeće zadruge i udruženja",
                opis: "Već ste organizovani, već imate ljude i strukturu. KOLO dodaje evidenciju razmene i vezu sa drugim zadrugama i pojedincima.",
                poenta: "Vaši članovi dobijaju pristup celoj mreži, a zadruga — još jedan alat za rad.",
              },
              {
                ikona: "🏘️",
                naslov: "Lokalpatrioti",
                opis: "Sva vrednost koju razmeniš sa drugima ostaje u zajednici.",
                poenta: "Svakom razmenom u tvom naselju stvaraš uslove koji su bolji za sve.",
              },
            ].map((seg) => (
              <div key={seg.naslov} className="bg-white rounded-2xl card-shadow p-4 flex flex-col gap-2">
                <span className="text-2xl">{seg.ikona}</span>
                <p className="font-semibold text-kolo-text text-sm leading-snug">{seg.naslov}</p>
                <p className="text-xs text-kolo-muted leading-relaxed">{seg.opis}</p>
                <p className="text-xs font-medium text-kolo-green-700 leading-relaxed mt-auto ml-auto text-right text-balance whitespace-pre-line max-w-[70%]">{seg.poenta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEKCIJA 5 — PRIMER IZ PRAKSE ─────────────────────────── */}
        <section className="space-y-4">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
            Primer iz prakse
          </div>

          {/* 4 stubca povezana strelicama po hronologiji */}
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {/* Stubac 1 — Ana i med */}
            <div className="bg-white rounded-2xl card-shadow p-5 flex-1 flex flex-col gap-3 items-center text-center">
              <span className="w-14 h-14 rounded-full bg-kolo-green-100 text-kolo-green-700 inline-flex items-center justify-center text-2xl font-bold">1</span>
              <p className="text-kolo-text leading-relaxed text-sm">
                Ana razmeni 5 tegli meda sa Milanom za <strong>4.000 POEN</strong>.
              </p>
            </div>
            {/* Strelica 1 → 2 */}
            <div className="flex items-center justify-center text-kolo-muted shrink-0">
              <svg className="w-6 h-6 rotate-90 md:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            {/* Stubac 2 — Veš mašina */}
            <div className="bg-white rounded-2xl card-shadow p-5 flex-1 flex flex-col gap-3 items-center text-center">
              <span className="w-14 h-14 rounded-full bg-kolo-green-100 text-kolo-green-700 inline-flex items-center justify-center text-2xl font-bold">2</span>
              <p className="text-kolo-text leading-relaxed text-sm">
                Ani se pokvari veš mašina. Lazar je popravi za <strong>4.000 POEN</strong>.
              </p>
            </div>
            {/* Strelica 2 → 3 */}
            <div className="flex items-center justify-center text-kolo-muted shrink-0">
              <svg className="w-6 h-6 rotate-90 md:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            {/* Stubac 3 — Marija i hleb */}
            <div className="bg-white rounded-2xl card-shadow p-5 flex-1 flex flex-col gap-3 items-center text-center">
              <span className="w-14 h-14 rounded-full bg-kolo-green-100 text-kolo-green-700 inline-flex items-center justify-center text-2xl font-bold">3</span>
              <p className="text-kolo-text leading-relaxed text-sm">
                Lazar razmeni <strong>500 POEN</strong> za domaći hleb koji Marija peče u svojoj kuhinji.
              </p>
            </div>
            {/* Strelica 3 → 4 */}
            <div className="flex items-center justify-center text-kolo-muted shrink-0">
              <svg className="w-6 h-6 rotate-90 md:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            {/* Stubac 4 — Stefan i pribori */}
            <div className="bg-white rounded-2xl card-shadow p-5 flex-1 flex flex-col gap-3 items-center text-center">
              <span className="w-14 h-14 rounded-full bg-kolo-green-100 text-kolo-green-700 inline-flex items-center justify-center text-2xl font-bold">4</span>
              <p className="text-kolo-text leading-relaxed text-sm">
                Marija ga uputi na Stefana, koji rezbari drvene kuhinjske pribore.
              </p>
            </div>
          </div>

          {/* Suptilan most ka zaključku — izvan stubaca */}
          <p className="text-center text-sm text-kolo-muted italic">
            … i krug se nastavlja.
          </p>

          <div className="flex items-center gap-3 bg-kolo-green-100 border-l-4 border-kolo-green-700 rounded-xl p-4 w-fit mx-auto">
            <span className="shrink-0 w-7 h-7 rounded-full bg-kolo-green-700 text-white inline-flex items-center justify-center font-bold text-base">!</span>
            <div className="text-sm text-kolo-text leading-relaxed space-y-1">
              <p><strong className="text-kolo-green-900">POEN nije novac</strong> — to je zapis o tome koliko je ko doprineo zajednici.</p>
              <p>Med, popravka i hleb iz primera su stvarni; POEN samo beleži razmenu.</p>
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 6 — KAKO FUNKCIONIŠE UKRATKO ────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Kako funkcioniše, ukratko
          </div>
          <div className="space-y-0">
            {[
              {
                br: "1",
                naslov: "Registruješ se",
                opis: "Besplatno, za manje od minut. Biraš pseudonim umesto pravog imena i prihvataš Uslove korišćenja — za registraciju ti nisu neophodni dokumenti. Odmah dobijaš pristup javnom delu KOLA, a pun pristup otključavaš kada se potvrdi da si stvaran čovek.",
              },
              {
                br: "2",
                naslov: "Verifikuješ se",
                opis: "Verifikovani korisnik koji te lično poznaje potvrđuje tvoju stvarnost na osnovu tog poznavanja. Tako i sam postaješ verifikovani korisnik, sa svim funkcijama sistema na raspolaganju. Protokol tada automatski upiše 1.000 POEN tebi i 1.000 POEN korisniku koji te je potvrdio — kao priznanje da ste oboje u lancu jemstva.",
              },
              {
                br: "3",
                naslov: "Doprinosiš i koristiš",
                opis: "Razmenjuješ robu i usluge, pozivaš ljude koje poznaješ, uključuješ se u zajednicu i, ako želiš, doniraš Fondaciji. Svaki tvoj doprinos ostaje zabeležen i vidljiv u POEN-ima.",
              },
            ].map((k, i, arr) => (
              <div key={k.br} className={`flex gap-5 items-start pt-4 ${i < arr.length - 1 ? "border-b border-kolo-border pb-4" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-kolo-green-900 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {k.br}
                </div>
                <div>
                  <p className="font-semibold text-kolo-text text-sm mb-1">{k.naslov}</p>
                  <p className="text-sm text-kolo-muted leading-relaxed text-body">{k.opis}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-kolo-border">
            <Link href="/kako-funkcionise" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
              Detaljno objašnjenje →
            </Link>
          </div>
        </section>

        {/* ── SEKCIJA 7 — PIJACA PREVIEW ──────────────────────────── */}
        {pijacaOglasi.length >= 3 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
                Šta se trenutno razmenjuje
              </h2>
              <Link href="/pijaca" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
                Pogledaj celu Pijacu →
              </Link>
            </div>
            {pijacaOglasi.length < 6 && (
              <p className="text-xs text-kolo-muted">
                Sistem je u ranoj fazi — ovo su prvi oglasi.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pijacaOglasi.map((oglas) => (
                <Link
                  key={oglas.id}
                  href={`/pijaca/${oglas.id}`}
                  className="bg-white rounded-2xl card-shadow overflow-hidden hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Slika */}
                  <div className="w-full h-44 bg-kolo-bg overflow-hidden">
                    {oglas.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/pijaca/slika/${oglas.id}/0`}
                        alt={oglas.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-kolo-muted/30">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4 flex items-start justify-between gap-2">
                    <p className="font-semibold text-kolo-text text-sm leading-snug group-hover:text-kolo-green-700 transition-colors line-clamp-2">
                      {oglas.title}
                    </p>
                    <span className="text-sm font-bold text-kolo-green-700 shrink-0 whitespace-nowrap">
                      {oglas.price.toLocaleString("sr-RS")} P
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── SEKCIJA 8 — ŽIVI AGREGATI SISTEMA (samo ako ima ≥10 transakcija) ────────────── */}
        {agregati.brojTransakcija >= 10 && (
          <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
            <h2 className="text-xl font-bold text-kolo-green-900 mb-5 text-center" style={{ letterSpacing: "-0.02em" }}>
              Sistem je živ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-kolo-bg rounded-xl py-5">
                <div className="text-2xl md:text-3xl font-bold text-kolo-green-700 tabular-nums">
                  {agregati.brojClanova.toLocaleString("sr-RS")}
                </div>
                <div className="text-xs text-kolo-muted mt-1">verifikovanih članova</div>
              </div>
              <div className="bg-kolo-bg rounded-xl py-5">
                <div className="text-2xl md:text-3xl font-bold text-kolo-green-700 tabular-nums">
                  {agregati.brojTransakcija.toLocaleString("sr-RS")}
                </div>
                <div className="text-xs text-kolo-muted mt-1">ažuriranja evidencije</div>
              </div>
              <div className="bg-kolo-bg rounded-xl py-5">
                <div className="text-2xl md:text-3xl font-bold text-kolo-green-700 tabular-nums">
                  {agregati.opticaj.toLocaleString("sr-RS")}
                </div>
                <div className="text-xs text-kolo-muted mt-1">POEN u opticaju</div>
              </div>
            </div>
            <p className="text-xs text-kolo-muted mt-5 text-center">
              Pojedinačne zapise evidencije vide verifikovani članovi platforme.
            </p>
          </section>
        )}

        {/* ── SEKCIJA 9 — KO STOJI IZA KOLA ──────────────────────── */}
        <section className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="grid md:grid-cols-[2fr_3fr]">
            {/* Levo — slika u krugu, tekst iznad i ispod */}
            <div className="bg-kolo-green-900 p-8 flex flex-col items-center justify-center text-center gap-5">
              {/* Tekst iznad fotografije */}
              <span className="inline-block bg-white/10 text-white/80 text-[11px] font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
                Ko stoji iza KOLA
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nikola-saric-mantil.png"
                alt="Nikola Šarić"
                className="w-36 h-36 rounded-full object-cover object-top ring-4 ring-white/10 shadow-xl"
              />
              {/* Tekst ispod fotografije */}
              <div>
                <p className="text-white font-bold text-lg leading-tight">Nikola Šarić</p>
                <p className="text-white/70 text-sm mt-1 leading-snug">
                  Lekar iz Sombora · petnaest godina gradi sistem razmene bez novca
                </p>
              </div>
            </div>
            {/* Desno — tekst */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <p className="text-kolo-text leading-relaxed mb-3 text-sm text-body">
Petnaest godina proučava kako zajednice širom sveta — od Švajcarske i Italije do Kanade i Japana — razmenjuju rad i dobra bez novca.
              </p>
              <p className="text-kolo-muted text-sm leading-relaxed mb-5 text-body">
                KOLO je naša verzija socijalne i solidarne ekonomije — kad se ljudi sami organizuju da brinu jedni o drugima — koju su i Ujedinjene nacije i Evropska unija priznale, prilagođena srpskim zakonima.
              </p>
              <blockquote className="border-l-4 border-kolo-green-700 pl-4 text-sm text-kolo-muted italic leading-relaxed mb-5 text-body">
                „Svaki dan u ordinaciji vidim ljude kojima sistem treba da pomogne, ali ne može. Svako ima svoje mesto u društvu i nešto čime može da doprinese. Samo im treba infrastruktura — alat i zajednica iza njega."
              </blockquote>
              <Link href="/o-nama" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
                Cela priča →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 10 — FAQ TIZER ───────────────────────────────── */}
        <section id="faq" className="space-y-3">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Često postavljana pitanja
          </h2>
          <FaqAkordeon pitanja={poBrojevima([1, 2, 40])} />
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

        {/* ── SEKCIJA 11 — CTA ─────────────────────────────────────── */}
        <section className="bg-kolo-green-700 rounded-2xl p-6 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
            Pridruži se — ili prati kako sistem raste
          </h2>
          <p className="text-white/70 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
            Upravo se okuplja prva grupa članova. Registracija je besplatna i traje manje od dva minuta.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/registracija"
              className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
            >
              Registruj se →
            </Link>
            <a
              href="mailto:kontakt@ekolo.rs?subject=Prati%20razvoj%20KOLO%20sistema"
              className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              Prati razvoj →
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="text-xs text-white/60">Ono što koristi tebi, koristi i tvojoj zajednici.</p>
          </div>
        </section>

      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <PublicFooter />

    </div>
  );
}
