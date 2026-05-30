import Link from "next/link";
import type { Metadata } from "next";
import FaqAkordeon from "@/components/FaqAkordeon";
import { poBrojevima } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Kako funkcioniše KOLO — detaljna pravila sistema",
  description:
    "KOLO je društvena mreža za ekonomsku razmenu. Postani korisnik, šest načina upisa POEN-a, arhitektura sistema, pravna priroda transakcija i sve što trebaš znati o sistemu.",
};

const koraci = [
  {
    br: "1",
    naslov: "Registracija",
    opis: "Email, pseudonim, lozinka. U celom interfejsu te predstavlja isključivo pseudonim — pravo ime nije obavezno, niti sistem vodi evidenciju koja pseudonim povezuje sa tvojim identitetom. Registracija je besplatna i ne obavezuje te ni na šta.",
    detalj: "~ minut",
  },
  {
    br: "2",
    naslov: "Osnovni pregled",
    opis: "Vidiš javnu evidenciju razmena i oglase na Pijaci, ali još ne možeš postavljati oglase niti kontaktirati prodavce.",
    detalj: "bez verifikacije",
  },
  {
    br: "3",
    naslov: "Verifikacija kroz lanac jemstva",
    opis: "Verifikovani korisnik koji te lično poznaje potvrđuje, uživo, da si stvarna osoba. KOLO to obezbeđuje tehnički, bez prikupljanja ijednog dokumenta. Svaka potvrda te dodatno učvršćuje kao stvarnog korisnika mreže — i za svaku ti Protokol upisuje 1.000 POEN.",
    detalj: "+10% indeks · 1.000 POEN",
    istaknut: true,
  },
  {
    br: "4",
    naslov: "Razmena i doprinos",
    opis: "Pun pristup mreži: postavljaš oglase na Pijaci, razmenjuješ sa drugim korisnicima, doprinosiš sistemu i prijavljuješ se za Socijalne programe. Kad si i sam jednom potvrđen, i ti možeš da uvedeš i potvrdiš ljude koje lično poznaješ.",
    detalj: "pun pristup",
  },
  {
    br: "5",
    naslov: "Glas u sistemu",
    opis: "ZRNO ti daje pravo glasa u Gornjem Kolu — telu koje odlučuje o pravilima koja važe za sve. Glasovi se računaju po kvadratnom korenu, pa niko sa mnogo ZRNA ne može sam da nadglasa zajednicu.",
    detalj: "demokratski glas",
  },
];

const nacinUpisa = [
  {
    br: "1",
    naslov: "Dokaz stvarnosti",
    opis: "Kad te verifikovani korisnik koji te lično poznaje potvrdi u lancu jemstva, Protokol automatski upisuje 1.000 POEN tebi i 1.000 POEN verifikatoru — a kad verifikacija podleže nadzoru, i 500 POEN nadzorniku. Ulazak u sistem je istovremeno doprinos sistemu.",
    iznos: "1.000 / 1.000 / 500",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "2",
    naslov: "Donacija Fondaciji",
    opis: "Doniraš novac Fondaciji. Protokol upisuje POEN po koeficijentu koji blago raste sa tvojim ukupnim doprinosom — na primer 1,5× na 100.000 dinara. POEN iz donacije ne daje vlasništvo, ne pretvara se u novac i ne kupuje glasove: glas zavisi od ZRNA, a glasanje je kvadratno, pa veći donator ne može da nadglasa zajednicu.",
    iznos: "11 nivoa · do 2,00×",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
  },
  {
    br: "3",
    naslov: "Pokroviteljstvo",
    opis: "Pravno lice (firma, udruženje) potpisuje sa Fondacijom ugovor o donaciji u novcu, robi ili uslugama. Pokrovitelj ne prima POEN; vlasnik koji je verifikovan korisnik dobija bonus po posebnoj tabeli sa 7 nivoa.",
    iznos: "7 nivoa · prag 10.000 RSD",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
  },
  {
    br: "4",
    naslov: "Operativni doprinos",
    opis: "Konkretan rad za zajednicu evidentira se kroz međusobno potvrđivanje — drugi verifikovani korisnici potvrđuju tvoju aktivnost.",
    iznos: "po obavljenom poslu",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "5",
    naslov: "Osnivački doprinos",
    opis: "Priznanje za rad uložen pre nego što je sistem uopšte postojao — ograničeno i iznosom i tempom. Evidentira se u koracima od 20.000 POEN-a, najviše jedan po svakih 100.000 POEN-a u sistemu, pa se ne može ubrzati. Kanal se trajno zatvara kad osnivački doprinos dostigne gornju granicu od 2.400.000 POEN-a.",
    iznos: "do 2.400.000 POEN-a",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "6",
    naslov: "Socijalni programi",
    opis: "Za majke i staratelje, starije, posebnu brigu i školovanje predviđeni su programi u kojima odobreni korisnici dobijaju POEN svakog dana.",
    iznos: "dnevna evidencija",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
];

export default function KakoFunkcionisePage() {
  return (
    <div className="space-y-6 pb-12">

      {/* ── S1: MINI-HERO ──────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl px-8 py-10 text-white">
        <div className="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          Detaljna verzija
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
          Kako funkcioniše KOLO?
        </h1>
        <p className="text-white/70 text-base md:text-lg">
          Uputstvo za korišćenje
        </p>
      </section>

      {/* ── S2: POSTANI KORISNIK ───────────────────────────────────── */}
      <section className="bg-white rounded-2xl card-shadow p-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
            Postani korisnik
          </div>
        </div>

        {/* Desktop: olimpijski raspored 3 + 2 */}
        <div className="hidden md:grid md:grid-cols-6 gap-3">
          {koraci.map((k, i) => (
            <div
              key={k.br}
              className={`md:col-span-2 ${i === 3 ? "md:col-start-2" : ""} rounded-2xl p-5 border-2 flex flex-col ${k.istaknut ? "border-kolo-gold-400 bg-kolo-gold-100/40" : "border-kolo-border bg-kolo-bg"}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold mb-3 ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.br}
              </div>
              <p className="font-semibold text-kolo-text text-base mb-1.5">{k.naslov}</p>
              <p className="text-sm text-kolo-muted leading-relaxed mb-3">{k.opis}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-auto self-end ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.detalj}
              </span>
            </div>
          ))}
        </div>

        {/* Mobilni: vertikalno */}
        <div className="md:hidden space-y-3">
          {koraci.map((k) => (
            <div key={k.br} className={`flex gap-4 rounded-2xl p-5 border-2 ${k.istaknut ? "border-kolo-gold-400 bg-kolo-gold-100/40" : "border-kolo-border bg-kolo-bg"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.br}
              </div>
              <div>
                <p className="font-semibold text-kolo-text text-base mb-1">{k.naslov}</p>
                <p className="text-sm text-kolo-muted leading-relaxed mb-2">{k.opis}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                  {k.detalj}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── S3: ŠEST MEHANIZAMA UPISIVANJA POEN-a ──────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
            Evidencija doprinosa
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Šest kanala kroz koje Protokol upisuje POEN
          </h2>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl card-shadow p-4 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-kolo-danger-light flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M7 3.5v4M7 9.5v0.6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <p className="text-sm text-kolo-text leading-relaxed">
              POEN se <strong className="text-kolo-text">ne kupuje za dinare</strong>.
            </p>
          </div>
          <div className="bg-white rounded-xl card-shadow p-4 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-kolo-danger-light flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M7 3.5v4M7 9.5v0.6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <p className="text-sm text-kolo-text leading-relaxed">
              Upisuje se isključivo kroz šest kanala doprinosa — <strong className="text-kolo-text">Protokol</strong> ih beleži automatski, isto za sve, bez izuzetaka.
            </p>
          </div>
          <div className="bg-white rounded-xl card-shadow p-4 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-kolo-green-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#1B6B3A" strokeWidth="1.5"/>
                <path d="M4 7l2 2 4-4" stroke="#1B6B3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="text-sm text-kolo-text leading-relaxed">
              Kad razmenjuješ s nekim, POEN samo prelazi od jednog do drugog: postojeći zapisi se <strong className="text-kolo-text">preraspodeljuju</strong>, ništa novo se ne stvara.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          {nacinUpisa.map((n) => {
            return (
              <div
                key={n.br}
                className="bg-white rounded-2xl card-shadow p-5 flex flex-col gap-3 md:col-span-2"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${n.boja}`}>
                    {n.br}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-kolo-text text-base mb-1">{n.naslov}</p>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${n.boja}`}>
                      {n.iznos}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-kolo-muted leading-relaxed text-body">{n.opis}</p>
              </div>
            );
          })}
        </div>

      </section>


      {/* ── S4: POEN I ZRNO ────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
          Dve interne jedinice
        </div>
        <div className="grid md:grid-cols-2 gap-4">

          {/* POEN */}
          <div className="bg-white rounded-2xl card-shadow p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center font-bold text-lg">
                P
              </div>
              <div>
                <p className="font-bold text-kolo-green-900 text-lg">POEN</p>
                <p className="text-sm text-kolo-muted">Jedinica evidencije doprinosa</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">Šta jeste</p>
              <ul className="space-y-1.5">
                {[
                  "Evidencija doprinosa zajedničkom dobru",
                  "Ne ističe — tvoj doprinos se pamti trajno",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-kolo-green-700 mt-0.5 shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">Šta nije</p>
              <p className="text-sm text-kolo-muted leading-relaxed mb-2 text-body">
                Ukratko: POEN nije novac i njime se ne može trgovati. Ispod su zakonski razlozi zašto.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Zakonsko sredstvo plaćanja",
                  "Elektronski novac (Zakon o platnim uslugama)",
                  "Digitalna imovina (Zakon o digitalnoj imovini)",
                  "Finansijski instrument ni investiciona šema (Zakon o tržištu kapitala)",
                  "Kriptovaluta ni stablecoin",
                  "Potraživanje prema Fondaciji ni imovinsko pravo korisnika",
                  "Nema nosioca — postoji isključivo kao zapis u evidenciji",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-kolo-green-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-kolo-green-700 mb-1">Zero-sum princip</p>
              <p className="text-sm text-kolo-muted leading-relaxed text-body">
                Zbir svih POEN-a u sistemu — svih korisnika i Protokola — uvek je tačno nula. Protokol ide u minus svaki put kad emituje. Niko ne može stvoriti POEN iz vazduha.
              </p>
            </div>
          </div>

          {/* ZRNO */}
          <div className="bg-white rounded-2xl card-shadow p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-kolo-gold-100 text-kolo-gold-600 flex items-center justify-center font-bold text-lg">
                Z
              </div>
              <div>
                <p className="font-bold text-kolo-green-900 text-lg">ZRNO</p>
                <p className="text-sm text-kolo-muted">Upravljačka jedinica</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">Kako se upisuje</p>
              <ul className="space-y-1.5">
                {[
                  "ZRNO se upisuje u tvoj zapis u zamenu za POEN; ne može se prenositi između korisnika.",
                  "Ukupna količina ZRNA je fiksna — 1.000.000.",
                  "Obračunski koeficijent raste sa povećanjem opticaja POEN-a.",
                  "ZRNO beleži tvoj položaj u sistemu.",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-kolo-gold-600 mt-0.5 shrink-0">◆</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">Kako se koristi</p>
              <ul className="space-y-1.5">
                {[
                  "Slobodno ZRNO se može otpisati Protokolu po tekućem obračunskom koeficijentu.",
                  "Aktivno ZRNO daje glas u Gornjem Kolu, ali se ne može otpisati dok je aktivno.",
                  "Broj glasova = kvadratni koren aktivnog ZRNA (√100 ZRNA = 10 glasova, ne 100).",
                  "Glasove (ne ZRNO) možeš delegirati drugom nosiocu ZRNA.",
                  "ZRNO se ne troši glasanjem.",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-kolo-gold-600 mt-0.5 shrink-0">◆</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-kolo-gold-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-kolo-gold-600 mb-1">Obračunski koeficijent nije kurs</p>
              <p className="text-sm text-kolo-muted leading-relaxed text-body">
                Obračunski koeficijent je administrativna veličina — odnos broja evidentiranih POEN-a i raspoloživih ZRNA. Nije cena, nije tržišni kurs i ne izražava vrednost ZRNA van sistema. Kvadratni koren u glasanju znači da niko sa puno ZRNA ne može jednostavno nadglasati ostale — sistem nagrađuje širu participaciju, ne akumulaciju.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ── S6: FAQ AKORDEON ───────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            Operativna pitanja
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Najčešća pitanja
          </h2>
        </div>
        <FaqAkordeon pitanja={poBrojevima([4, 16, 5])} />
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

      {/* ── S7: CTA ────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 md:p-10 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Sve si pročitao
        </h2>
        <p className="text-white/70 text-base mb-7 max-w-md mx-auto leading-relaxed">
          Pravila su jasna. Registracija je besplatna. Verifikacija te uvodi u lanac jemstva — Protokol automatski upisuje 1.000 POEN tebi i 1.000 POEN verifikatoru.
          Javna evidencija i oglasi na Pijaci dostupni su i bez registracije.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/registracija"
            className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
          >
            Registruj se besplatno →
          </Link>
          <Link
            href="/pijaca"
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            Pogledaj Pijacu
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            Nazad na početnu
          </Link>
        </div>
        <p className="text-white/40 text-xs mt-7">
          Softver: AGPL-3.0 · Sadržaj: CC BY-SA 4.0 · Zajedničko dobro i licence
        </p>
      </section>

    </div>
  );
}
