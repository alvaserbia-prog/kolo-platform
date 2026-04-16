import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/kolo-icon.png";
import PublicHeader from "@/components/PublicHeader";
import { prisma } from "@/lib/prisma";

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

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const pijacaOglasi = await getPijacaPreview();

  return (
    <div className="min-h-screen bg-kolo-bg">

      <PublicHeader />

      <div className="max-w-[932px] mx-auto px-6 py-8 space-y-6 pb-20">

        {/* ── SEKCIJA 1 — HERO ─────────────────────────────────────── */}
        <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-[1fr_360px] gap-10 items-center">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                Probudimo zajednicu
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-7">
                kroz razmenu rada, dobara i znanja<br />po našim pravilima.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/kako-funkcionise"
                  className="px-6 py-3 bg-kolo-gold-600 text-white font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors text-sm">
                  Kako funkcioniše →
                </Link>
                <Link href="/registracija"
                  className="px-6 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Priključi se
                </Link>
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

        {/* INFO KARTICE */}
        <section className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl card-shadow p-5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-kolo-gold-100 flex items-center justify-center text-kolo-gold-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-kolo-gold-600 leading-snug">Rani pristup<br /><span className="font-normal text-kolo-muted">Alpha faza</span></p>
          </div>
          <div className="bg-white rounded-2xl card-shadow p-5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-kolo-green-700 leading-snug">Fondacija<br /><span className="font-normal text-kolo-muted">u Somboru</span></p>
          </div>
          <div className="bg-white rounded-2xl card-shadow p-5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-kolo-green-700 leading-snug">Registracija<br /><span className="font-normal text-kolo-muted">besplatna</span></p>
          </div>
        </section>

        {/* ── SEKCIJA 2 — TRI STUBA ────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              broj: "01",
              naslov: "Zajednica",
              tekst: "Pre tržišta, pre banaka, pre država, postojala je zajednica. Ljudi su razmenjivali rad, hranu i znanje zato što su jedni drugima bili potrebni.",
              naglasak: "KOLO vraća ono što je oduvek radilo na način koji odgovara 21. veku.",
            },
            {
              broj: "02",
              naslov: "Doprinos",
              tekst: "Zajednica radi samo ako postoji evidencija ko šta daje. Bez toga, dobronamerni ljudi sagore, a mešetari ostaju neprimećeni.",
              naglasak: "KOLO beleži tvoj doprinos i to postaje osnova za sve što dobijaš nazad.",
            },
            {
              broj: "03",
              naslov: "Transparentnost",
              tekst: "Sve je otvoreno: pravila, računi, odluke, dokumenta. Svako ima slobodan uvid u sve što sistem radi u svakom trenutku.",
              naglasak: "Transparentnost nije prazno obećanje, već strukturno svojstvo.",
            },
          ].map((kartica) => (
            <div
              key={kartica.naslov}
              className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-4 border-t-4 border-kolo-green-700 relative overflow-hidden items-center text-center"
            >

              <h3 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
                {kartica.naslov}
              </h3>
              <div className="space-y-2">
                <p className="text-kolo-muted leading-relaxed text-base">{kartica.tekst}</p>
                <p className="text-kolo-green-900 font-medium leading-relaxed text-base">{kartica.naglasak}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── SEKCIJA 3 — PROBLEM KOJI SVI OSEĆAMO ────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Problem koji svi osećamo
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3 items-center text-center">
              <p className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>Ne znamo šta jedemo.</p>
              <div className="space-y-2">
                <p className="text-sm text-kolo-muted leading-relaxed">
                  Kupujemo hranu koja je putovala hiljade kilometara, dok neko iz naše zajednice proizvodi baš to — med, jaja, sir, voće, povrće.
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
                  Komšija je majstor, njegova žena kuva i može da pričuva decu. Neko treći zna da okreči, da popravi krov, da drži časove.
                </p>
                <p className="text-sm text-kolo-green-900 font-medium leading-relaxed">Svima nam to svakodnevno treba — ali ne postoji mesto gde se ljudi sreću.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 4 — KOLO TI DAJE ALTERNATIVU ────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8 border-l-4 border-kolo-green-700">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            KOLO ti daje alternativu
          </div>
          <p className="text-kolo-green-900 leading-relaxed mb-7">
            KOLO je mreža korisnika i lokalnih zadruga u kojoj se rad, dobra i znanje razmenjuju kroz POEN. POEN je interna evidencija doprinosa sistemu, ne novac i ne digitalna imovina. Ne postoji van KOLO sistema i ne menja se za dinare unutar njega.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-kolo-bg rounded-xl p-4 text-center">
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">KOLO Fondacija</p>
              <p className="text-sm text-kolo-text leading-relaxed">
                Pravni subjekt sa sedištem u Somboru. Prima donacije u dinarima, pokriva operativne troškove sistema, zastupa KOLO pred zajednicom i državom. Fondacija ne emituje POEN i ne raspolaže njime.
              </p>
            </div>
            <div className="bg-kolo-bg rounded-xl p-4 text-center">
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">KOLO Banka</p>
              <p className="text-sm text-kolo-text leading-relaxed">
                Softverski protokol u vlasništvu Fondacije. Nema pravni subjektivitet, ne prima dinare. Emituje POEN i vodi evidenciju računa članova po pravilima koja su unapred određena, javno dostupna i ista za sve.
              </p>
            </div>
            <div className="bg-kolo-bg rounded-xl p-4 text-center">
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">KOLO Zadruge</p>
              <p className="text-sm text-kolo-text leading-relaxed">
                Lokalne zadruge su srce KOLO mreže. Registrovane su kao pravna lica i svaka radi autonomno u svom gradu ili kraju. Zadruga okuplja članove iz iste sredine, organizuje razmenu i pokreće zajedničke projekte.
              </p>
            </div>
          </div>

        </section>

        {/* ── SEKCIJA 5 — ZA KOGA JE KOLO ─────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Za koga je KOLO?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                ikona: "🌱",
                naslov: "Farmeri i mali proizvođači",
                opis: "Direktan pristup potrošačima i olakšana distribucija domaćih proizvoda bez posrednika i provizije — vrednovanje tvojih proizvoda srazmerno uloženom radu.",
              },
              {
                ikona: "🔧",
                naslov: "Zanatlije i majstori",
                opis: "Novi kanal za pristup klijentima i besplatno oglašavanje svojih usluga u lokalnoj mreži uz mogućnost javne preporuke — da cela zajednica vidi koliko vrediš.",
              },
              {
                ikona: "👴",
                naslov: "Penzioneri sa znanjem",
                opis: "Razmena znanja i usluga za stvari koje ti realno trebaju — domaći proizvodi, lokalne usluge. Iskustvo konačno ima konkretnu vrednost, ne samo sentimentalnu.",
              },
              {
                ikona: "🏠",
                naslov: "Domaćice",
                opis: "Prodaja domaćih proizvoda (zimnica, pečeno, ručni rad) i razmena usluga sa komšinicama — kućni rad postaje izvor stvarnih sredstava.",
              },
              {
                ikona: "👩‍👧",
                naslov: "Majke i roditelji",
                opis: "Pomoć u svakodnevnim aktivnostima, čuvanje dece, nabavka zdrave hrane — zajednica koja roditeljstvo tretira kao posao, ne kao prirodnu obavezu.",
              },
              {
                ikona: "🎓",
                naslov: "Mladi",
                opis: "Neformalni rad, prvi klijenti i prostor za razvoj u tvom kraju — razlog da ostaneš nije samo plata, nego i okruženje na koje možeš da utičeš.",
              },
              {
                ikona: "💼",
                naslov: "Nezaposleni",
                opis: "Prostor da pokreneš svoju aktivnost u lokalnoj mreži ili da se angažuješ na poslovima unutar zajednice — dostojanstvo i sigurnost za tebe i porodicu.",
              },
              {
                ikona: "🤝",
                naslov: "Postojeće zadruge i udruženja",
                opis: "Već ste organizovani, već imate ljude i strukturu. Ekonomski sloj otvara nove mogućnosti za vašu organizaciju kao i za svakog pojedinog člana.",
              },
              {
                ikona: "🏘️",
                naslov: "Lokalpatriotе",
                opis: "Sva vrednost koju razmeniš sa drugima ostaje u zajednici. Svaka obavljena transakcija je doprinos poboljšanju ekonomske slike tvog mesta.",
              },
            ].map((seg) => (
              <div key={seg.naslov} className="bg-white rounded-2xl card-shadow p-4 flex flex-col gap-2">
                <span className="text-2xl">{seg.ikona}</span>
                <p className="font-semibold text-kolo-text text-sm leading-snug">{seg.naslov}</p>
                <p className="text-xs text-kolo-muted leading-relaxed">{seg.opis}</p>
              </div>
            ))}
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
                opis: "Besplatno, za manje od minut. Biraš pseudonim — u javnom delu sistema niko ne vidi tvoje pravo ime.",
              },
              {
                br: "2",
                naslov: "Verifikuješ se",
                opis: "Slanjem dokumenta ili uživo u nekoj od zadruga. Time potvrđuješ da si stvarna osoba i dobijaš 1.000 POEN kao priznanje za pridruživanje.",
              },
              {
                br: "3",
                naslov: "Doprinosiš i koristiš",
                opis: "Razmenjuješ robu i usluge sa ostalim korisnicima, pozivaš ljude koje poznaješ, učestvuješ u programima zadruge. Svaki doprinos se beleži u POEN-ima.",
              },
              {
                br: "4",
                naslov: "Odlučuješ",
                opis: "Poenima stičeš ZRNO, upravljačku jedinicu i time ulaziš u krug onih koji direktno upravljaju algoritmima i sistemom.",
              },
            ].map((k, i, arr) => (
              <div key={k.br} className={`flex gap-5 items-start pt-4 ${i < arr.length - 1 ? "border-b border-kolo-border pb-4" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-kolo-green-900 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {k.br}
                </div>
                <div>
                  <p className="font-semibold text-kolo-text text-sm mb-1">{k.naslov}</p>
                  <p className="text-sm text-kolo-muted leading-relaxed">{k.opis}</p>
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

        {/* ── SEKCIJA 8 — KAKO DO POEN ─────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Kako do POEN?
          </h2>
          <div className="space-y-3">
            {[
              {
                br: "1",
                naslov: "Razmena sa drugim članom",
                badge: "P2P, 1:1",
                badgeCls: "bg-kolo-green-100 text-kolo-green-700",
                opis: "Direktno slanje POEN-a između članova, bez provizije. Banka nije posrednik — samo evidentira. Ovo je osnovna forma razmene u KOLO sistemu.",
                highlight: true,
              },
              {
                br: "2",
                naslov: "Preporuke",
                badge: "po tabeli",
                badgeCls: "bg-kolo-green-100 text-kolo-green-700",
                opis: "Za svaku osobu kojoj si preporučio KOLO i koja se verifikuje — dobijaš POEN nagradu po tabeli iz Pravilnika.",
                highlight: false,
              },
              {
                br: "3",
                naslov: "Donacija Fondaciji",
                badge: "18 nivoa",
                badgeCls: "bg-kolo-gold-100 text-kolo-gold-600",
                opis: "Donacija u dinarima Fondaciji i emisija POEN-a su dva odvojena akta. Svaki nivo donacije nosi viši faktor POEN bonusa (od 1,00× do 5,00×). Prag ulaska: 2.000 RSD.",
                highlight: false,
              },
              {
                br: "4",
                naslov: "Pokroviteljstvo",
                badge: "firme, od 10.000 RSD",
                badgeCls: "bg-kolo-gold-100 text-kolo-gold-600",
                opis: "Firma postaje pokrovitelj. 10.000 RSD donacije = 20.000 POEN za vlasnika naloga. Sedam nivoa prema visini podrške, po Prilogu 2 Pravilnika.",
                highlight: false,
              },
            ].map((item) => (
              <div key={item.br} className={`bg-white rounded-2xl card-shadow p-4 flex items-start gap-4 ${item.highlight ? "border-l-4 border-kolo-green-700" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-kolo-green-900 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {item.br}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-kolo-text text-sm">{item.naslov}</p>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${item.badgeCls}`}>{item.badge}</span>
                  </div>
                  <p className="text-sm text-kolo-muted leading-relaxed">{item.opis}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-kolo-muted px-1">
            Postoje još tri načina (Zapošljavanje, Programi podrške, verifikacioni bonus).{" "}
            <Link href="/kako-funkcionise" className="text-kolo-green-700 hover:text-kolo-green-900 font-medium transition-colors">
              Detaljno objašnjenje →
            </Link>
          </p>
        </section>

        {/* ── SEKCIJA 9 — PRIMER IZ PRAKSE ─────────────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Primer iz prakse
          </div>
          <p className="text-kolo-green-900 leading-relaxed mb-4">
            Ana ponudi med na platformi. Milan ga vidi, kontaktira je, preuzima tegle i šalje joj <strong>8.000 POEN</strong>. Direktna razmena, bez posrednika, između dvoje ljudi koji žive u istom gradu i nikad se nisu upoznali.
          </p>
          <p className="text-kolo-muted leading-relaxed mb-4">
            Sledeće nedelje Ani pukne bojler. Na platformi pronalazi Lazara, vodoinstalatera iz susedne ulice. On dolazi, popravlja, Ana mu šalje <strong>4.000 POEN</strong>.
          </p>
          <p className="text-kolo-muted leading-relaxed">
            Banka je upisala dve stavke u evidenciji. Fondacija nije uključena ni u jedan događaj. Bez provizije, bez posrednika.{" "}
            <strong className="text-kolo-text">Troje komšija koji bi se mimoišli bez reči — konačno su se upoznali.</strong>
          </p>
        </section>

        {/* ── SEKCIJA 10 — PIJACA PREVIEW ──────────────────────────── */}
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

        {/* ── SEKCIJA 11 — KO STOJI IZA KOLA ──────────────────────── */}
        <section className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="grid md:grid-cols-[2fr_3fr]">
            {/* Levo — foto placeholder */}
            <div className="bg-kolo-green-900 flex items-center justify-center min-h-[220px] p-8">
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            {/* Desno — tekst */}
            <div className="p-6 md:p-8">
              <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                Ko stoji iza KOLA
              </div>
              <p className="text-kolo-text leading-relaxed mb-4 text-sm">
                <strong>Nikola Šarić</strong>, lekar iz Sombora. Ideja za KOLO razvijala se 14 godina kroz tri prethodne iteracije — svaka pala na nešto: pravni okvir, tehnička nedovršenost, ili zavisnost od jedne osobe.
              </p>
              <p className="text-kolo-muted text-sm leading-relaxed mb-5">
                Fondacija se osniva u Somboru. Dokumentacija je proaktivno podneta poreskom inspektoru. Od NBS, Poreske uprave i nadležnih ministarstava zatražena su zvanična mišljenja — svaki odgovor biće javno objavljen.
              </p>
              <blockquote className="border-l-4 border-kolo-green-700 pl-4 text-sm text-kolo-muted italic leading-relaxed mb-5">
                „Nisam želeo da pokrenem pre nego što pravni okvir bude čvrst, pre nego što platforma bude sposobna da nosi prve članove, i pre nego što budem siguran da sistem ne zavisi od mene. Svaki prethodni pokušaj je pao na jednu od te tri stvari. Ovaj ne sme."
              </blockquote>
              <Link href="/o-nama" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
                Pročitaj celu priču →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 12 — POTPUNA TRANSPARENTNOST ─────────────────── */}
        <section id="transparentnost" className="space-y-3">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Potpuna transparentnost
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Strukturalni dokaz */}
            <div className="bg-white rounded-2xl card-shadow p-5">
              <div className="w-8 h-8 rounded-xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <p className="font-semibold text-kolo-text text-sm mb-2">Strukturalni dokaz</p>
              <p className="text-xs text-kolo-muted leading-relaxed">
                Zbir svih POEN računa u sistemu uvek je nula. Ovo je matematičko svojstvo, ne obećanje. Sistem ne zavisi od priliva novog novca — svaki POEN koji postoji evidentiran je kao obaveza Banke prema zajednici.
              </p>
            </div>
            {/* Pravni dokaz */}
            <div className="bg-white rounded-2xl card-shadow p-5">
              <div className="w-8 h-8 rounded-xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p className="font-semibold text-kolo-text text-sm mb-2">Pravni okvir</p>
              <p className="text-xs text-kolo-muted leading-relaxed">
                POEN nije zakonsko sredstvo plaćanja, nije kriptovaluta, nije trampa u pravnom smislu. Donacije Fondaciji i emisija POEN-a su dva potpuno odvojena akta. Nije digitalna imovina u smislu važećeg zakona.
              </p>
            </div>
            {/* Proaktivna transparentnost */}
            <div className="bg-white rounded-2xl card-shadow p-5">
              <div className="w-8 h-8 rounded-xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <p className="font-semibold text-kolo-text text-sm mb-2">Proaktivnost pred regulatorom</p>
              <p className="text-xs text-kolo-muted leading-relaxed">
                NBS, Poreska uprava i nadležna ministarstva kontaktirana su pre lansiranja. Svaki zvanični odgovor biće javno objavljen na ovoj stranici, bez izmena.
              </p>
            </div>
          </div>
          {/* Javni dokumenti */}
          <div className="bg-kolo-bg rounded-2xl p-4 flex flex-wrap gap-3">
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide self-center mr-1">Javni dokumenti:</span>
            {[
              { naziv: "Pravilnik", href: "#" },
              { naziv: "Statut Fondacije", href: "#" },
              { naziv: "Politika privatnosti", href: "/privatnost" },
              { naziv: "Uslovi korišćenja", href: "/uslovi" },
            ].map((d) => (
              <Link
                key={d.naziv}
                href={d.href}
                className="text-xs font-medium text-kolo-green-700 hover:text-kolo-green-900 bg-white rounded-lg px-3 py-1.5 card-shadow transition-colors"
              >
                {d.naziv}
              </Link>
            ))}
          </div>
        </section>

        {/* ── SEKCIJA 13 — FAQ ──────────────────────────────────────── */}
        <section id="faq" className="space-y-3">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Često postavljana pitanja
          </h2>
          {[
            {
              p: "Da li KOLO zamenjuje dinar?",
              o: "Ne. KOLO je komplement postojećoj ekonomiji — unutrašnji sistem evidencije razmene unutar zajednice. Dinari i POEN ne prelaze iste institucionalne granice. Nema planova ni namere da KOLO zameni zvanično platno sredstvo.",
            },
            {
              p: "Šta ako hoću da izađem?",
              o: "Slobodan si da napustiš sistem u svakom trenutku. Možeš anonimizovati nalog — tvoji podaci se brišu, transakcioni zapisi ostaju sa pseudonimom koji više ni na koga ne pokazuje. POEN koji poseduješ ostaje evidentiran ili se vraća Banci.",
            },
            {
              p: "Šta ako se posvađam sa drugim članom oko razmene?",
              o: "U sistemu postoji mehanizam prigovora. Svaki član može podneti prigovor, koji admin razmatra i odgovara u roku od 30 dana. Odluka je javna i evidentirana. Sistem ne može prinuditi nikoga da pruži uslugu — ali može evidentirati ko se ne ponaša u skladu sa pravilima.",
            },
            {
              p: "Može li firma da bude član?",
              o: "Firma ne može biti direktni član, ali može biti pokrovitelj. To znači da firma u dinarima daje podršku Fondaciji, a njen vlasnik — kao verifikovani član — dobija POEN bonus. Svi pokrovitelji su javno navedeni na stranici pokrovitelja.",
            },
            {
              p: "Ko kontroliše KOLO?",
              o: "Pravni subjekt je Fondacija, čiji rad je podložan reviziji i nadzoru nadležnih organa. Softverski protokol (Banka) radi po matematičkim pravilima koja su javno dostupna i nepromenjiva bez glasanja zajednice. Odluke donosi zajednica kroz ZRNO glasanje.",
            },
            {
              p: "Može li dete da bude član?",
              o: "Ne. Verifikacija zahteva lični dokument — što znači punoletnos ili roditeljski pristanak uz pratnju. Sistem trenutno ne podržava maloletne korisnike.",
            },
            {
              p: "Da li POEN ističe?",
              o: "Trenutno ne. U budućim verzijama moguće je uvođenje demurrage mehanizma (negativne kamate) koji bi podsticao cirkulaciju POEN-a umesto akumulacije, ali to bi bila odluka zajednice kroz glasanje, ne unilateralna odluka Fondacije.",
            },
            {
              p: "Kako se štiti moja privatnost?",
              o: "U javnom delu sistema vidljivi su samo pseudonimi — niko ne može povezati pseudonim sa tvojim pravim imenom osim admina. Sve transakcije su evidentirane pod pseudonimom. Politika privatnosti je javna i dostupna u celosti.",
            },
          ].map((faq) => (
            <details key={faq.p} className="bg-white rounded-2xl card-shadow group">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-kolo-text hover:text-kolo-green-700 transition-colors select-none text-sm">
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

        {/* ── SEKCIJA 14 — GDE SMO SADA ────────────────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="inline-block bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Gde smo sada
          </div>
          <p className="text-sm text-kolo-muted mb-6 leading-relaxed">
            Pre-alfa faza. Platforma je funkcionalna, KOLO Fondacija je u procesu registracije u Somboru.
          </p>
          {/* Roadmap */}
          <div className="relative">
            <div className="flex items-center gap-0">
              {[
                { naziv: "Prvih sto članova", aktivan: true },
                { naziv: "Lokalne zadruge", aktivan: false },
                { naziv: "Međugradska mreža", aktivan: false },
                { naziv: "Samoupravljanje", aktivan: false },
                { naziv: "Puna zrelost", aktivan: false },
              ].map((faza, i, arr) => (
                <div key={faza.naziv} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${faza.aktivan ? "bg-kolo-green-700 border-kolo-green-700" : "bg-white border-kolo-border"}`} />
                    <p className={`text-xs leading-tight text-center max-w-[80px] ${faza.aktivan ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {faza.naziv}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="h-0.5 bg-kolo-border flex-1 mb-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 15 — CTA ─────────────────────────────────────── */}
        <section className="bg-kolo-green-700 rounded-2xl p-6 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
            Pridruži se ili prati razvoj
          </h2>
          <p className="text-white/70 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
            Prva grupa članova se trenutno formira. Registracija je besplatna i traje manje od dva minuta.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/registracija"
              className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
            >
              Registruj se →
            </Link>
            <a
              href="https://viber.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              Prati razvoj ↗
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-white/15 space-y-1.5">
            <p className="text-xs text-white/60">Transparentno i zajedno. Pravila su javna, a odluke zajedničke.</p>
            <p className="text-xs text-white/60">Sebičnost stvara solidarnost. Sistem radi za članove, ne od članova.</p>
          </div>
        </section>

        {/* ŠTA KOLO NIJE */}
        <section id="sta-kolo-nije" className="bg-white rounded-2xl card-shadow p-5">
          <h2 className="text-lg font-bold text-kolo-green-900 mb-2">Šta KOLO nije</h2>
          <p className="text-sm text-kolo-muted mb-5">Pre nego što nastaviš — jasno da znaš šta KOLO nije.</p>
          <div className="space-y-4">
            {[
              {
                naslov: "Nije piramidalna šema",
                opis: "Nema nivoa ispod tebe. Nema provizije od tuđih doprinosa. Sistem je zero-sum — svaki POEN koji postoji evidentiran je kao obaveza.",
              },
              {
                naslov: "Nije kriptovaluta",
                opis: "POEN nije token, ne trguje se ni na kakvoj berzi, nema tržišnu cenu. POEN je interna evidencija doprinosa unutar zajednice.",
              },
              {
                naslov: "Ne obećava brzu zaradu",
                opis: "KOLO nudi održiv sistem razmene između ljudi koji se međusobno poznaju. Vrednost je u mreži — ne u spekulaciji.",
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

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-kolo-border bg-white">
        <div className="max-w-[932px] mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src={logoImg} alt="KOLO" width={28} height={19} style={{ height: "auto" }} />
                <span className="font-bold text-kolo-green-900">KOLO</span>
              </div>
              <p className="text-sm text-kolo-muted leading-relaxed mb-2">
                Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajednici.
              </p>
              <p className="text-xs text-kolo-muted">Sombor, Srbija · Rana faza</p>
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
                <li><Link href="/pokrovitelji" className="hover:text-kolo-green-700 transition-colors">Pokrovitelji</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">Informacije</p>
              <ul className="space-y-2 text-sm text-kolo-muted">
                <li><Link href="/o-nama" className="hover:text-kolo-green-700 transition-colors">O Fondaciji</Link></li>
                <li><Link href="/o-nama" className="hover:text-kolo-green-700 transition-colors">Ko stoji iza KOLA</Link></li>
                <li><a href="#faq" className="hover:text-kolo-green-700 transition-colors">FAQ</a></li>
                <li><a href="mailto:kontakt@ekolo.rs" className="hover:text-kolo-green-700 transition-colors">Kontakt</a></li>
                <li><Link href="/uslovi" className="hover:text-kolo-green-700 transition-colors">Uslovi korišćenja</Link></li>
                <li><Link href="/privatnost" className="hover:text-kolo-green-700 transition-colors">Politika privatnosti</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-kolo-border pt-5 text-xs text-kolo-muted text-center">
            © 2026 KOLO Fondacija · Sombor, Srbija · Rana faza · ekolo.rs
          </div>
        </div>
      </footer>

    </div>
  );
}
