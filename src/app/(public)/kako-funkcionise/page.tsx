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
    naslov: "Program Evidencije Doprinosa",
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

const institucije = [
  {
    naziv: "Krugovi",
    inicijal: "K",
    boja: "bg-kolo-green-100 text-kolo-green-700",
    border: "border-kolo-green-200",
    tekst:
      "Lokalne operativne grupe od najmanje 5 verifikovanih korisnika okupljenih oko zajedničkog interesa koji može biti posao, zabava, umetnost, aktivnost. Svaki Krug donosi sopstvena interna pravila.",
    uloga: "Ljudi · Sredina sistema",
  },
  {
    naziv: "Gornje Kolo",
    inicijal: "G",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
    border: "border-kolo-gold-200",
    tekst:
      "Upravljačko telo sistema. Skupština verifikovanih članova koja odlučuje o svim parametrima sistema kroz glasanje ZRNOM. Aktivira se kada opticaj POENA dostigne 1.000.000. Glasačka snaga se računa po kvadratnom korenu — zaštita od koncentracije moći.",
    uloga: "Upravljačko telo · Glasanje ZRNOM",
  },
  {
    naziv: "KOLO Fondacija",
    inicijal: "F",
    boja: "bg-kolo-green-100 text-kolo-green-700",
    border: "border-kolo-green-200",
    tekst:
      "Pravni instrument sistema. Pravno lice koje prima donacije i sponzorstva u robi, uslugama i novcu, od kojih pokriva operativne troškove platforme, održava infrastrukturu i finansira kolektivne nabavke.",
    uloga: "Pravna osnova · Prima RSD",
  },
  {
    naziv: "KOLO Protokol",
    inicijal: "P",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
    border: "border-kolo-gold-200",
    tekst:
      "Tehnički instrument sistema. Softverski protokol, račun sistema koji ide u minus pri svakoj emisiji. Emituje POEN isključivo kroz odobrene mehanizme platforme i programe (verifikacija, preporuke, donacije, pokroviteljstvo, PED, socijalni programi, projekti).",
    uloga: "Tehnička osnova · Emituje POEN",
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
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
          Kako funkcioniše KOLO?
        </h1>
        <p className="text-white/70 max-w-xl leading-relaxed">
          Svako pravilo razloženo. Ako ti je dovoljan pregled,{" "}
          <Link href="/" className="text-kolo-gold-400 hover:text-kolo-gold-300 underline underline-offset-2 transition-colors">
            vrati se na početnu
          </Link>{" "}
          — ovde je sve.
        </p>
      </section>

      {/* ── S2: POSTANI KORISNIK ───────────────────────────────────── */}
      <section className="bg-white rounded-2xl card-shadow p-8">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          Postani korisnik
        </div>

        {/* Desktop: olimpijski raspored 3 + 2 */}
        <div className="hidden md:grid md:grid-cols-6 gap-3">
          {koraci.map((k, i) => (
            <div
              key={k.br}
              className={`md:col-span-2 ${i === 3 ? "md:col-start-2" : ""} rounded-2xl p-5 border-2 ${k.istaknut ? "border-kolo-gold-400 bg-kolo-gold-100/40" : "border-kolo-border bg-kolo-bg"}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold mb-3 ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.br}
              </div>
              <p className="font-semibold text-kolo-text text-base mb-1.5">{k.naslov}</p>
              <p className="text-sm text-kolo-muted leading-relaxed mb-3">{k.opis}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
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
      <section className="space-y-4">
        <div>
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            Evidencija doprinosa
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
            Sedam načina sticanja POEN-a
          </h2>
          <p className="text-kolo-muted text-sm max-w-xl">
            POEN se ne kupuje za dinare. Stiče se doprinosom pojedinačnom korisniku ili zajedničkom dobru, koji se evidentira kroz Protokol.
          </p>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3">
          {nacinSticanja.map((n) => (
            <div key={n.br} className="bg-white rounded-2xl card-shadow p-5 flex flex-col gap-3">
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
          ))}
        </div>

        <div className="bg-kolo-bg rounded-2xl p-4 flex gap-3 items-start">
          <div className="w-5 h-5 rounded-full bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5 4V5.5M5 6.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm text-kolo-muted leading-relaxed">
            <strong className="text-kolo-text">Dnevni limit emisije Protokola</strong> — KOLO Protokol može da emituje maksimalno 10% dnevnog opticaja kroz Socijalne programe i Program Evidencije Doprinosa. Mehanizmi platforme (verifikacija, preporuke, donacije, pokroviteljstvo) i Projekti ne ulaze u ovaj limit. Opticaj je apsolutna vrednost minusa Protokola. Limit štiti sistem od inflacije.
          </p>
        </div>
      </section>

      {/* ── S4: ARHITEKTURA SISTEMA ───────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-kolo-green-900 text-center" style={{ letterSpacing: "-0.02em" }}>
          Arhitektura sistema
        </h2>

        {/* SVG dijagram — vertikalna hijerarhija */}
        <div className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="relative overflow-x-auto">
            <svg
              viewBox="0 0 720 740"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-3xl mx-auto"
              style={{ minWidth: "320px" }}
            >
              {/* Definicije markera (strelica vrhova) */}
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

              {/* ====== VRH: ZAJEDNIČKO DOBRO ====== */}
              <rect x="40" y="10" width="640" height="110" rx="14" fill="#1B6B3A" />
              <text x="360" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" letterSpacing="3">
                ZAJEDNIČKO DOBRO
              </text>
              <text x="360" y="80" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">
                Mreža, znanje i infrastruktura
              </text>
              <text x="360" y="100" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">
                kojom upravlja zajednica koja ih koristi
              </text>

              {/* Strelica naviše: Zajednica → Dobro */}
              <path d="M360 158 L360 130" stroke="#1B6B3A" strokeWidth="2" />
              <polygon points="354,130 360,120 366,130" fill="#1B6B3A" />
              <text x="378" y="150" fill="#4B7A5E" fontSize="13" fontStyle="italic">
                grade i čuvaju
              </text>

              {/* ====== SREDINA: KOLO ZAJEDNICA ====== */}
              {/* Naslov i podtekst — IZNAD okvira (jer su naziv skupa, ne deo skupa) */}
              <text x="360" y="190" textAnchor="middle" fill="#1B6B3A" fontSize="16" fontWeight="700" letterSpacing="3">
                KOLO ZAJEDNICA
              </text>
              <text x="360" y="212" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                svi korisnici sistema
              </text>

              {/* Okvir Zajednice */}
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

              {/* Gornje Kolo — malo iznad članova */}
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

              {/* Tanka linija — članovi glasaju kroz ZRNO ka Gornjem Kolu */}
              <path d="M360 415 L360 335" stroke="#F0C060" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.65" />

              {/* "Krug" naslov LEVI — IZNAD kruga */}
              <text x="120" y="355" textAnchor="middle" fill="#1B6B3A" fontSize="14" fontWeight="700">
                Krug
              </text>
              {/* Krug levo */}
              <circle
                cx="120"
                cy="430"
                r="55"
                fill="white"
                stroke="#1B6B3A"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              {/* tri člana u krugu levo */}
              <g transform="translate(95, 430)">
                <circle cx="0" cy="-4" r="7" fill="#1B6B3A" />
                <path d="M -11 14 Q -11 2 0 2 Q 11 2 11 14 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(120, 455)">
                <circle cx="0" cy="-4" r="7" fill="#1B6B3A" />
                <path d="M -11 14 Q -11 2 0 2 Q 11 2 11 14 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(145, 430)">
                <circle cx="0" cy="-4" r="7" fill="#1B6B3A" />
                <path d="M -11 14 Q -11 2 0 2 Q 11 2 11 14 Z" fill="#1B6B3A" />
              </g>

              {/* "Krug" naslov DESNI — IZNAD kruga */}
              <text x="600" y="355" textAnchor="middle" fill="#1B6B3A" fontSize="14" fontWeight="700">
                Krug
              </text>
              {/* Krug desno */}
              <circle
                cx="600"
                cy="430"
                r="55"
                fill="white"
                stroke="#1B6B3A"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              {/* tri člana u krugu desno */}
              <g transform="translate(575, 430)">
                <circle cx="0" cy="-4" r="7" fill="#1B6B3A" />
                <path d="M -11 14 Q -11 2 0 2 Q 11 2 11 14 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(600, 455)">
                <circle cx="0" cy="-4" r="7" fill="#1B6B3A" />
                <path d="M -11 14 Q -11 2 0 2 Q 11 2 11 14 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(625, 430)">
                <circle cx="0" cy="-4" r="7" fill="#1B6B3A" />
                <path d="M -11 14 Q -11 2 0 2 Q 11 2 11 14 Z" fill="#1B6B3A" />
              </g>

              {/* Centralni članovi (između dva Kruga) */}
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

              {/* Napomena ispod sredine — u dva reda */}
              <text x="360" y="505" textAnchor="middle" fill="#4B7A5E" fontSize="12" fontStyle="italic">
                članovi se okupljaju u Krugove
              </text>
              <text x="360" y="525" textAnchor="middle" fill="#4B7A5E" fontSize="12" fontStyle="italic">
                zajedno biraju i upravljaju kroz Gornje Kolo
              </text>

              {/* Ukose strelice: od sredine Fondacije i Protokola ka donjoj ivici Zajednice */}
              {/* Strelica od sredine Fondacije ukoso gore-desno */}
              <path
                d="M187 595 L265 540"
                stroke="#1B6B3A"
                strokeWidth="2"
                strokeDasharray="6 3"
                markerEnd="url(#arrow-green)"
              />

              {/* Strelica od sredine Protokola ukoso gore-levo */}
              <path
                d="M532 595 L455 540"
                stroke="#A07020"
                strokeWidth="2"
                strokeDasharray="6 3"
                markerEnd="url(#arrow-gold)"
              />

              {/* ====== DNO: FONDACIJA + PROTOKOL ====== */}
              {/* Fondacija */}
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
                · prima RSD donacije
              </text>
              <text x="187" y="718" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                · drži infrastrukturu
              </text>

              {/* Protokol */}
              <rect x="365" y="595" width="335" height="135" rx="14" fill="#FFFBEB" stroke="#F0C060" strokeWidth="1.8" />
              <text x="532" y="628" textAnchor="middle" fill="#92600A" fontSize="16" fontWeight="700">
                KOLO PROTOKOL
              </text>
              <text x="532" y="650" textAnchor="middle" fill="#A07020" fontSize="13" fontWeight="600">
                tehnička osnova
              </text>
              <line x1="405" y1="662" x2="660" y2="662" stroke="#F0C060" strokeWidth="1" />
              <text x="532" y="682" textAnchor="middle" fill="#A07020" fontSize="12">
                · softverski protokol
              </text>
              <text x="532" y="700" textAnchor="middle" fill="#A07020" fontSize="12">
                · emituje POEN, vodi ZRNO
              </text>
              <text x="532" y="718" textAnchor="middle" fill="#A07020" fontSize="12">
                · zero-sum invarijanta
              </text>
            </svg>
          </div>
        </div>

        {/* Četiri kartice ispod dijagrama (2×2): gore — Krugovi, Gornje Kolo (sredina sistema); dole — Fondacija, Protokol (osnova) */}
        <div className="grid md:grid-cols-2 gap-4">
          {institucije.map((inst) => (
            <div key={inst.naziv} className={`bg-white rounded-2xl card-shadow p-6 border-t-4 ${inst.border}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base mb-4 ${inst.boja}`}>
                {inst.inicijal}
              </div>
              <p className="font-bold text-kolo-green-900 mb-1 text-lg">{inst.naziv}</p>
              <p className={`text-sm font-semibold mb-3 ${inst.boja.split(" ")[1]}`}>{inst.uloga}</p>
              <p className="text-base text-kolo-muted leading-relaxed">{inst.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── S5: PRAVNA PRIRODA TRANSAKCIJA ─────────────────────────── */}
      <section className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[660px] mx-auto">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Član 4 prostim jezikom
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900 mb-8" style={{ letterSpacing: "-0.02em" }}>
            Pravna priroda transakcija
          </h2>

          <div className="space-y-6">
            {[
              {
                naslov: "Zašto razmena nije prodaja",
                tekst: "Kada daješ uslugu ili robu u KOLO mreži, ne prodaješ je — doprinosiš zajedničkom dobru. POEN koji primaš nije cena. POEN je jedinica evidencije doprinosa zajedničkom dobru, beleška da si dao/la zajednici. Bez cene nema prodaje, bez prodaje nema PDV-a.",
              },
              {
                naslov: "Zašto razmena nije trampa",
                tekst: "Trampa je istovremena razmena dobara između dve strane. U KOLO sistemu ne postoji istovremena razmena — postoje dva odvojena akta: tvoj doprinos zajedničkom dobru i emisija POEN-a kao evidencija. Ovi akti nisu ni vremenski ni pravno vezani jedan za drugi.",
              },
              {
                naslov: "Princip dva odvojena akta",
                tekst: "Akt 1: doprinosiš zajedničkom dobru — uslugom, robom, vremenom ili novcem. Akt 2: KOLO Protokol emituje POEN na tvoj račun kao evidenciju tog doprinosa. Ova dva akta su pravno nezavisna — POEN nije naknada za uslugu, već prospektivan pristup budućim dobrima u zajedničkom dobru, bez kvantifikovane vrednosti i izvršnog dejstva.",
              },
              {
                naslov: "Praktična implikacija",
                tekst: "Nema PDV-a. Nema fiskalnog računa. Nema obaveze prijavljivanja prihoda po osnovu POEN-a. Korisnik nema potraživanje prema Fondaciji za emisijom POEN-a. Fondacija je dokumentaciju proaktivno podnela Poreskoj upravi i NBS, i javno će objaviti svaki zvanični odgovor.",
              },
            ].map((tacka) => (
              <div key={tacka.naslov} className="flex gap-4">
                <div className="w-1.5 rounded-full bg-kolo-green-200 shrink-0 self-stretch" />
                <div>
                  <p className="font-semibold text-kolo-text mb-1 text-base">{tacka.naslov}</p>
                  <p className="text-base text-kolo-muted leading-relaxed" style={{ lineHeight: "1.75" }}>
                    {tacka.tekst}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S6: POEN I ZRNO ────────────────────────────────────────── */}
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
                  "Cel broj — nema decimala ni centi",
                  "Prenos 1:1 bez provizije između članova",
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
                  "Bez kvantifikovane vrednosti, roka dospeća, izvršnog dejstva",
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
                Zbir svih POEN-a u sistemu — tvoj, Krugova, Protokola — uvek je tačno nula. Protokol ide u minus svaki put kad emituje. Niko ne može stvoriti POEN iz vazduha.
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
              <p className="text-base text-kolo-muted leading-relaxed">
                ZRNO kupuješ od KOLO Protokola u zamenu za POEN. Kurs raste sa svakom donacijom Fondaciji — rani članovi plaćaju manje POEN po ZRNU nego kasniji. Prodaješ ga nazad Protokolu po tekućem kursu.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">Kako se koristi</p>
              <ul className="space-y-1.5">
                {[
                  "Zaključavaš ZRNO da bi glasao/la u Gornjem Kolu",
                  "Glasačka moć = kvadratni koren zaključanog ZRNA",
                  "√100 ZRNA = 10 glasova (ne 100)",
                  "Delegiraš glas drugom verifikovanom članu",
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

      {/* ── S7: FAQ AKORDEON ───────────────────────────────────────── */}
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

      {/* ── S8: CTA ────────────────────────────────────────────────── */}
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
