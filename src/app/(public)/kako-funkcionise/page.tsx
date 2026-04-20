import Link from "next/link";
import type { Metadata } from "next";
import FaqAkordeon from "@/components/FaqAkordeon";

export const metadata: Metadata = {
  title: "Kako funkcioniše KOLO — detaljna pravila sistema",
  description:
    "Pet koraka do članstva, sedam načina sticanja POEN-a, tri institucije, pravna priroda transakcija i sve što trebaš znati o KOLO sistemu.",
};

const koraci = [
  {
    br: "1",
    naslov: "Registracija",
    opis: "Email, pseudonim, lozinka. Pravo ime nigde ne piše — ostatak zajednice vidi samo pseudonim.",
    detalj: "~2 minuta",
  },
  {
    br: "2",
    naslov: "Osnovni pregled",
    opis: "Vidiš javnu evidenciju transakcija i Pijacu. Ne možeš slati POEN, kupovati ni kontaktirati prodavca.",
    detalj: "bez verifikacije",
  },
  {
    br: "3",
    naslov: "Verifikacija",
    opis: "Lično u zadruzi ili upload lične karte. Jedan čovek, jedan nalog. Admin odobrava.",
    detalj: "1.000 POEN bonus",
    istaknut: true,
  },
  {
    br: "4",
    naslov: "Doprinos i razmena",
    opis: "Pijaca, programi podrške, direktna razmena sa članovima. Nudiš ono što znaš i radiš.",
    detalj: "pun pristup",
  },
  {
    br: "5",
    naslov: "Glas u sistemu",
    opis: "ZRNO ti daje pravo glasa o odlukama zajednice. Kvadratni koren štiti od koncentracije moći.",
    detalj: "demokratski glas",
  },
];

const nacinSticanja = [
  {
    br: "1",
    naslov: "Razmena sa članom",
    opis: "Prodaješ uslugu ili robu drugom članu — on ti šalje POEN direktno. Prenos je 1:1, bez provizije, Banka nije posrednik.",
    iznos: "slobodan iznos",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "2",
    naslov: "Verifikacija",
    opis: "Čim admin odobri tvoj identitet, Banka ti automatski emituje nagradu. Jednokratno, ne ponavlja se.",
    iznos: "1.000 POEN",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "3",
    naslov: "Preporuke",
    opis: "Pozoveš nekoga u KOLO, on se registruje i verifikuje koristeći tvoj pozivni kod — dobijaš nagradu po tabeli.",
    iznos: "po tabeli",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "4",
    naslov: "Donacija Fondaciji",
    opis: "Doniraš Fondaciji u dinarima — ona emituje POEN na tvoj račun po tabeli od 18 nivoa (kurs raste od 1,00× do 5,00×). Prag: 2.000 RSD.",
    iznos: "18 nivoa",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
  },
  {
    br: "5",
    naslov: "Pokroviteljstvo",
    opis: "Registruješ pravno lice kao pokrovitelja KOLO-a. Svaki doprinos firme nosi bonus POEN vlasniku po fiksnoj tabeli 7 nivoa.",
    iznos: "prag 10.000 RSD",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
  },
  {
    br: "6",
    naslov: "Zapošljavanje",
    opis: "Fondacija i zadruge objavljuju radne oglase. Ako si verifikovan/a i odobren/a za posao, beleže se sati rada — emisija sledi.",
    iznos: "1.000–2.500 POEN/sat",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
  {
    br: "7",
    naslov: "Programi podrške",
    opis: "Za zadrugare koji su odobreni za neki od programa Banke — zapošljavanje, majke, stariji, školovanje, posebna briga — emisija je dnevna.",
    iznos: "dnevna emisija",
    boja: "bg-kolo-green-100 text-kolo-green-700",
  },
];

const institucije = [
  {
    naziv: "KOLO Fondacija",
    inicijal: "F",
    boja: "bg-kolo-green-100 text-kolo-green-700",
    border: "border-kolo-green-200",
    tekst:
      "Pravni subjekt sistema. Prima dinare od donatora i pokrovitelja, pokriva operativne troškove platforme. Ne emituje POEN i ne raspolaže njime — to je ključna granica koja odvaja novac od evidencije doprinosa.",
    uloga: "Prima RSD · Pravni subjekt",
  },
  {
    naziv: "KOLO Banka",
    inicijal: "B",
    boja: "bg-kolo-gold-100 text-kolo-gold-600",
    border: "border-kolo-gold-200",
    tekst:
      "Softverski protokol — nema pravni subjektivitet. Emituje POEN isključivo kroz odobrene programe (verifikacija, preporuke, donacije, zapošljavanje...). Zbir svih POEN-a u sistemu uvek je nula: Banka ide u minus pri svakoj emisiji.",
    uloga: "Emituje POEN · Softverski protokol",
  },
  {
    naziv: "Lokalne zadruge",
    inicijal: "Z",
    boja: "bg-kolo-green-100 text-kolo-green-700",
    border: "border-kolo-green-200",
    tekst:
      "Pravna lica po Zakonu o zadrugama, potpuno autonomna. Svaka zadruga odlučuje o sopstvenim programima i projektima. Zadruge su spona između Fondacije i članova — ali ni Fondacija ni Banka ne mogu im nalagati odluke.",
    uloga: "Okuplja članove · Autonomna pravna lica",
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

      {/* ── S2: PET KORAKA ─────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl card-shadow p-8">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          Korisnički put
        </div>
        <h2 className="text-2xl font-bold text-kolo-green-900 mb-8" style={{ letterSpacing: "-0.02em" }}>
          Pet koraka do aktivnog članstva
        </h2>

        {/* Desktop: horizontalno sa konektorima */}
        <div className="hidden md:flex items-start gap-0">
          {koraci.map((k, i) => (
            <div key={k.br} className="flex items-start flex-1">
              <div className={`flex-1 rounded-2xl p-4 border-2 ${k.istaknut ? "border-kolo-gold-400 bg-kolo-gold-100/40" : "border-kolo-border bg-kolo-bg"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold mb-3 ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                  {k.br}
                </div>
                <p className="font-semibold text-kolo-text text-sm mb-1">{k.naslov}</p>
                <p className="text-xs text-kolo-muted leading-relaxed mb-2">{k.opis}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                  {k.detalj}
                </span>
              </div>
              {i < koraci.length - 1 && (
                <div className="flex items-center mt-4 px-1.5 shrink-0">
                  <div className="w-4 h-0.5 bg-kolo-border" />
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="text-kolo-border">
                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobilni: vertikalno */}
        <div className="md:hidden space-y-3">
          {koraci.map((k) => (
            <div key={k.br} className={`flex gap-4 rounded-2xl p-4 border-2 ${k.istaknut ? "border-kolo-gold-400 bg-kolo-gold-100/40" : "border-kolo-border bg-kolo-bg"}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.br}
              </div>
              <div>
                <p className="font-semibold text-kolo-text text-sm mb-0.5">{k.naslov}</p>
                <p className="text-xs text-kolo-muted leading-relaxed mb-1.5">{k.opis}</p>
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
            POEN se ne kupuje za dinare. Stiče se radom, doprinosom i podrškom zajednici.
          </p>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3">
          {nacinSticanja.map((n) => (
            <div key={n.br} className="bg-white rounded-2xl card-shadow p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${n.boja}`}>
                  {n.br}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-kolo-text text-sm">{n.naslov}</p>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${n.boja}`}>
                    {n.iznos}
                  </span>
                </div>
              </div>
              <p className="text-xs text-kolo-muted leading-relaxed">{n.opis}</p>
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
          <p className="text-xs text-kolo-muted leading-relaxed">
            <strong className="text-kolo-text">Dnevni limit emisije Banke</strong> — KOLO Banka može da emituje maksimalno 10% dnevnog opticaja. Opticaj je apsolutna vrednost minusa Banke. Limit štiti sistem od inflacije.
          </p>
        </div>
      </section>

      {/* ── S4: TRI INSTITUCIJE ────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            Arhitektura sistema
          </div>
          <h2 className="text-2xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
            Tri institucije
          </h2>
          <p className="text-kolo-muted text-sm max-w-xl">
            Dinari i POEN nikad ne prelaze istu institucionalnu granicu u istom smeru.
          </p>
        </div>

        {/* SVG dijagram */}
        <div className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="relative overflow-x-auto">
            <svg viewBox="0 0 720 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto" style={{ minWidth: "320px" }}>
              {/* Fondacija */}
              <rect x="10" y="60" width="180" height="80" rx="14" fill="#F0F9F4" stroke="#B3DFC5" strokeWidth="1.5"/>
              <text x="100" y="94" textAnchor="middle" fill="#1B6B3A" fontSize="11" fontWeight="700">KOLO Fondacija</text>
              <text x="100" y="112" textAnchor="middle" fill="#4B7A5E" fontSize="9.5">Prima RSD</text>
              <text x="100" y="127" textAnchor="middle" fill="#4B7A5E" fontSize="9.5">Pravni subjekt</text>

              {/* Strelica Fondacija → Banka */}
              <path d="M192 100 L258 100" stroke="#B3DFC5" strokeWidth="1.5" strokeDasharray="4 3"/>
              <polygon points="258,96 266,100 258,104" fill="#B3DFC5"/>
              <text x="229" y="94" textAnchor="middle" fill="#4B7A5E" fontSize="8.5">odobrava emisiju</text>

              {/* Banka (centar) */}
              <rect x="268" y="50" width="184" height="100" rx="14" fill="#FFFBEB" stroke="#F0C060" strokeWidth="1.5"/>
              <text x="360" y="88" textAnchor="middle" fill="#92600A" fontSize="11" fontWeight="700">KOLO Banka</text>
              <text x="360" y="106" textAnchor="middle" fill="#A07020" fontSize="9.5">Emituje POEN</text>
              <text x="360" y="121" textAnchor="middle" fill="#A07020" fontSize="9.5">Softverski protokol</text>
              <text x="360" y="136" textAnchor="middle" fill="#A07020" fontSize="9.5">Zero-sum</text>

              {/* Strelica Banka → Zadruge */}
              <path d="M454 100 L520 100" stroke="#B3DFC5" strokeWidth="1.5" strokeDasharray="4 3"/>
              <polygon points="520,96 528,100 520,104" fill="#B3DFC5"/>
              <text x="487" y="94" textAnchor="middle" fill="#4B7A5E" fontSize="8.5">distribuira POEN</text>

              {/* Zadruge */}
              <rect x="530" y="60" width="180" height="80" rx="14" fill="#F0F9F4" stroke="#B3DFC5" strokeWidth="1.5"/>
              <text x="620" y="94" textAnchor="middle" fill="#1B6B3A" fontSize="11" fontWeight="700">Lokalne zadruge</text>
              <text x="620" y="112" textAnchor="middle" fill="#4B7A5E" fontSize="9.5">Okuplja članove</text>
              <text x="620" y="127" textAnchor="middle" fill="#4B7A5E" fontSize="9.5">Autonomna</text>

              {/* RSD oznaka ulevo od Fondacije */}
              <rect x="10" y="12" width="72" height="26" rx="8" fill="#1B6B3A"/>
              <text x="46" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">RSD ulazi</text>
              <path d="M46 38 L46 58" stroke="#1B6B3A" strokeWidth="1.5"/>
              <polygon points="42,58 46,65 50,58" fill="#1B6B3A"/>

              {/* POEN oznaka iznad Banke */}
              <rect x="296" y="8" width="128" height="26" rx="8" fill="#D99520"/>
              <text x="360" y="26" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">POEN se emituje ovde</text>
              <path d="M360 34 L360 48" stroke="#D99520" strokeWidth="1.5"/>
              <polygon points="356,48 360,55 364,48" fill="#D99520"/>
            </svg>
          </div>
        </div>

        {/* Tri kartice ispod dijagrama */}
        <div className="grid md:grid-cols-3 gap-4">
          {institucije.map((inst) => (
            <div key={inst.naziv} className={`bg-white rounded-2xl card-shadow p-6 border-t-4 ${inst.border}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-4 ${inst.boja}`}>
                {inst.inicijal}
              </div>
              <p className="font-bold text-kolo-green-900 mb-1">{inst.naziv}</p>
              <p className={`text-xs font-semibold mb-3 ${inst.boja.split(" ")[1]}`}>{inst.uloga}</p>
              <p className="text-sm text-kolo-muted leading-relaxed">{inst.tekst}</p>
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
                tekst: "Kada daješ uslugu ili robu u KOLO mreži, ne prodaješ je — doniraš je mreži. POEN koji primaš nije cena. POEN je evidencija doprinosa, beleška da si dao/la zajednici. Bez cene nema prodaje, bez prodaje nema PDV-a.",
              },
              {
                naslov: "Zašto razmena nije trampa",
                tekst: "Trampa je istovremena razmena dobara između dve strane. U KOLO sistemu ne postoji istovremena razmena — postoje dva odvojena akta: tvoja donacija mreži i emisija POEN-a kao evidencija. Ovi akti nisu ni vremenski ni pravno vezani jedan za drugi.",
              },
              {
                naslov: "Princip dva odvojena akta",
                tekst: "Akt 1: doniraš robu ili uslugu Fondaciji (ili zajednici). Akt 2: KOLO Banka emituje POEN na tvoj račun kao potvrdu da je zajednica zabeležila tvoj doprinos. Ova dva akta su pravno nezavisna — što znači da POEN nije naknada za uslugu i ne podleže poreskim propisima koji regulišu naknadu.",
              },
              {
                naslov: "Praktična implikacija",
                tekst: "Nema PDV-a. Nema fiskalnog računa. Nema obaveze prijavljivanja prihoda po osnovu POEN-a. Fondacija je dokumentaciju proaktivno podnela Poreskoj upravi i NBS, i javno će objaviti svaki zvanični odgovor.",
              },
            ].map((tacka) => (
              <div key={tacka.naslov} className="flex gap-4">
                <div className="w-1.5 rounded-full bg-kolo-green-200 shrink-0 self-stretch" />
                <div>
                  <p className="font-semibold text-kolo-text mb-1">{tacka.naslov}</p>
                  <p className="text-sm text-kolo-muted leading-relaxed" style={{ lineHeight: "1.75" }}>
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
                <p className="text-xs text-kolo-muted">Jedinica doprinosa</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-2">Šta jeste</p>
              <ul className="space-y-1.5">
                {[
                  "Evidencija koliko si doprineo/la zajednici",
                  "Cel broj — nema decimala ni centi",
                  "Prenos 1:1 bez provizije između članova",
                  "Ne ističe — tvoj doprinos se pamti trajno",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-sm text-kolo-muted">
                    <span className="text-kolo-green-700 mt-0.5 shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-2">Šta nije</p>
              <ul className="space-y-1.5">
                {[
                  "Zakonsko sredstvo plaćanja",
                  "Elektronski novac (Zakon o platnim uslugama)",
                  "Digitalna imovina (Zakon o digitalnoj imovini)",
                  "Kriptovaluta ni stablecoin",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-sm text-kolo-muted">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-kolo-green-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-kolo-green-700 mb-1">Zero-sum princip</p>
              <p className="text-xs text-kolo-muted leading-relaxed">
                Zbir svih POEN-a u sistemu — tvoj, zadruge, Banke — uvek je tačno nula. Banka ide u minus svaki put kad emituje. Niko ne može stvoriti POEN iz vazduha.
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
                <p className="text-xs text-kolo-muted">Upravljačka jedinica</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-2">Kako se stiče</p>
              <p className="text-sm text-kolo-muted leading-relaxed">
                ZRNO kupuješ od KOLO Banke u zamenu za POEN. Kurs raste sa svakom donacijom Fondaciji — rani članovi plaćaju manje POEN po ZRNU nego kasniji. Prodaješ ga nazad Banci po tekućem kursu.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-2">Kako se koristi</p>
              <ul className="space-y-1.5">
                {[
                  "Zaključavaš ZRNO da bi glasao/la",
                  "Glasačka moć = kvadratni koren zaključanog ZRNA",
                  "√100 ZRNA = 10 glasova (ne 100)",
                  "Delegiraš glas drugom verifikovanom članu",
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-sm text-kolo-muted">
                    <span className="text-kolo-gold-600 mt-0.5 shrink-0">◆</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-kolo-gold-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-kolo-gold-600 mb-1">Zaštita od plutokratije</p>
              <p className="text-xs text-kolo-muted leading-relaxed">
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
        <FaqAkordeon />
      </section>

      {/* ── S8: CTA ────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 md:p-10 text-center text-white">
        <div className="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          Sve si pročitao/la
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
          Pravila su jasna. Sad je na tebi.
        </h2>
        <p className="text-white/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
          Registracija je besplatna. Verifikacijom dobijaš 1.000 POEN startnog kapitala.
          Pijaca je dostupna odmah — i bez registracije.
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
