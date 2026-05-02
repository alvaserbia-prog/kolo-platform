import Link from "next/link";
import type { Metadata } from "next";
import FaqAkordeon from "@/components/FaqAkordeon";
import { poBrojevima } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Kako funkcioniše KOLO — detaljna pravila sistema",
  description:
    "KOLO je društvena mreža za ekonomsku razmenu. Postani korisnik, sedam načina sticanja POEN-a, arhitektura sistema, pravna priroda transakcija i sve što trebaš znati o sistemu.",
};

const koraci = [
  {
    br: "1",
    naslov: "Registracija",
    opis: "Email, pseudonim, lozinka.",
    detalj: "~ minut",
  },
  {
    br: "2",
    naslov: "Osnovni pregled",
    opis: "Vidiš javnu evidenciju transakcija i oglase na Pijaci. Možeš primati i slati POEN, ali ne možeš postavljati oglase niti kontaktirati prodavce.",
    detalj: "bez verifikacije",
  },
  {
    br: "3",
    naslov: "Verifikacija",
    opis: "Upload lične karte i podataka. Jedan čovek — jedan nalog. Admin proverava i odobrava identitet.",
    detalj: "1.000 POEN bonus",
    istaknut: true,
  },
  {
    br: "4",
    naslov: "Razmena i doprinos",
    opis: "Pun pristup mreži: postavljaš oglase na Pijaci, prijavljuješ se na Programe Protokola i razmenjuješ POEN sa članovima.",
    detalj: "pun pristup",
  },
  {
    br: "5",
    naslov: "Glas u sistemu",
    opis: "ZRNO ti daje pravo glasa u Gornjem Kolu koje odlučuje o svim sistemskim pitanjima. Kvadratno glasanje štiti zajednicu od koncentracije moći.",
    detalj: "demokratski glas",
  },
];

const nacinSticanja = [
  {
    br: "1",
    naslov: "Razmena sa korisnikom",
    opis: "Daješ robu ili uslugu drugom korisniku platforme — on ti šalje POEN na račun, a Protokol beleži transakciju.",
    iznos: "slobodan iznos",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "2",
    naslov: "Verifikacija",
    opis: "Tvoje poverenje u sistem se vrednuje. Čim admin odobri tvoj identitet, Protokol automatski emituje 1.000 POEN za tvoj doprinos.",
    iznos: "1.000 POEN",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "3",
    naslov: "Preporuke",
    opis: "Pozoveš nekoga u KOLO. Kad se registruje tvojim pozivnim kodom i verifikuje identitet, dobijaš nagradu u POEN-ima — iznos raste sa brojem dotadašnjih preporuka, od 1.000 do 10.000 POEN.",
    iznos: "1.000–10.000 POEN",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "4",
    naslov: "Donacija Fondaciji",
    opis: "Doniraš novac Fondaciji. Protokol ti emituje POEN po kursu koji raste sa tvojim ukupnim doprinosom — kroz 18 nivoa, od 1,00× za početne donacije do 5,00× za najveće donatore.",
    iznos: "18 nivoa",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
  },
  {
    br: "5",
    naslov: "Pokroviteljstvo",
    opis: "Pravno lice (firma, udruženje) potpisuje sa Fondacijom ugovor o donaciji ili sponzorstvu — u novcu ili robi. Vlasnik, ako je verifikovan korisnik platforme, dobija bonus POEN po posebnoj tabeli sa 7 nivoa.",
    iznos: "prag 10.000 RSD",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
  },
  {
    br: "6",
    naslov: "Evidencija Doprinosa",
    opis: "Doprinos zajedničkom dobru evidentira se kroz međusobno potvrđivanje — drugi verifikovani korisnici potvrđuju tvoju aktivnost.",
    iznos: "operativni program",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "7",
    naslov: "Socijalni programi",
    opis: "Verifikovani korisnici sa odobrenim statusom — Podrška Majkama, Podrška Starijima, Posebna Briga, Školovanje — primaju POEN na dnevnom nivou.",
    iznos: "dnevna emisija",
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

      {/* ── S3: SEDAM NAČINA STICANJA POEN-a ───────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
            Evidencija doprinosa
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Sedam načina sticanja POEN-a
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
              Stiče se doprinosom pojedinačnom korisniku ili zajedničkom dobru, koji se evidentira kroz <strong className="text-kolo-text">Protokol</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          {nacinSticanja.map((n, i) => {
            const startClass = i === 3 ? "md:col-start-2" : i === 5 ? "md:col-start-2" : "";
            return (
              <div
                key={n.br}
                className={`bg-white rounded-2xl card-shadow p-5 flex flex-col gap-3 md:col-span-2 ${startClass}`}
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
                <p className="text-sm text-kolo-muted leading-relaxed">{n.opis}</p>
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
                  "Prospektivan pristup budućim dobrima u zajedničkom dobru",
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
              <ul className="space-y-1.5">
                {[
                  "Zakonsko sredstvo plaćanja",
                  "Elektronski novac (Zakon o platnim uslugama)",
                  "Digitalna imovina (Zakon o digitalnoj imovini)",
                  "Kriptovaluta ni stablecoin",
                  "Potraživanje prema Fondaciji",
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
              <p className="text-sm text-kolo-muted leading-relaxed">
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
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">Kako se stiče</p>
              <ul className="space-y-1.5">
                {[
                  "ZRNO stičeš od KOLO Protokola za POEN.",
                  "Kurs ZRNA raste sa povećanjem Opticaja POEN-a.",
                  "ZRNO čuva vrednost tvog doprinosa sistemu.",
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
                  "Aktivno ZRNO daje glas u Gornjem Kolu",
                  "Broj glasova = kvadratni koren aktivnog ZRNA",
                  "√100 ZRNA = 10 glasova (ne 100)",
                  "Delegiraš glas drugom verifikovanom članu",
                  "Vraćaš ga Protokolu po tekućem kursu.",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-kolo-gold-600 mt-0.5 shrink-0">◆</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-kolo-gold-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-kolo-gold-600 mb-1">Zaštita od plutokratije</p>
              <p className="text-sm text-kolo-muted leading-relaxed">
                Kvadratni koren znači da niko sa puno ZRNA ne može jednostavno nadglasati ostale. Ko ima 10.000 ZRNA — ima 100 glasova, ne 10.000. Sistem nagrađuje širu participaciju, ne akumulaciju.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ── S6: FAQ AKORDEON ───────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            Operativna pitanja
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            Najčešća pitanja
          </h2>
        </div>
        <FaqAkordeon pitanja={poBrojevima([21, 31, 36])} />
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
        <div className="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          Sve si pročitao/la
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Pravila su jasna. Sad je na tebi.
        </h2>
        <p className="text-white/70 text-base mb-7 max-w-md mx-auto leading-relaxed">
          Registracija je besplatna. Verifikacijom dobijaš 1.000 POEN startnog kapitala.
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
        </div>
      </section>

    </div>
  );
}
