"use client";

/**
 * /dobrodosli — vodič kroz KOLO za nove korisnike.
 * Prikazuje se jednom, odmah posle registracije (umesto direktnog bacanja na QR),
 * a kasnije je uvek dostupan iz "?" u headeru (tada ceo vodič od početka).
 *
 * Ekrani su definisani u messages/ pod "dobrodosli" (ključevi ekranN_*),
 * pa se tekst menja bez diranja ove komponente. Dodavanje/uklanjanje ekrana =
 * izmena niza EKRANI ispod + odgovarajući ključevi u messages.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import GdeSeNalazi, { type Gde } from "@/components/dobrodosli/GdeSeNalazi";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";

/** Akciona veza ekrana: dugme + crtež koji pokazuje gde ta stranica stoji u
 *  navigaciji (vidi GdeSeNalazi). Ekran može imati više akcija (korak 6). */
type Akcija = { href: string; ctaKey: string; gde: Gde };

/** Konfiguracija ekrana: ključevi pasusa u messages + akcione veze.
 *
 *  Pasusi se navode POIMENCE, ne brojem, da bi neki mogao da bude uslovan —
 *  pasus o deci na poslednjem ekranu postoji samo dok Modul Deca radi. Dok je
 *  ovde stajao broj pasusa, uslovan pasus bi tražio i menjanje brojeva ključeva.
 *
 *  Redosled prati stvarni put novog člana: objava ponude (koju sme odmah,
 *  bez ijedne potvrde) pa tek onda potvrda. Raniji vodič je imao sedam ekrana
 *  i dva „puta" kroz koja je svako prolazio linearno, pa je isto pitanje
 *  postavljao dvaput — na prvom i na poslednjem ekranu. */
const EKRANI: { key: string; pasusi: string[]; akcije?: Akcija[] }[] = [
  // šta je KOLO i šta je POEN — jedini ekran bez radnje
  { key: "ekran1", pasusi: ["ekran1_p1", "ekran1_p2"] },
  // prvi potez: objava ponude. Ide PRE potvrde, jer je to danas glavni put
  // (čl. 16 st. 5 i čl. 40a) i jer isti redosled obećava Početna.
  {
    key: "ekran2",
    pasusi: ["ekran2_p1", "ekran2_p2"],
    akcije: [
      { href: "/pijaca/novi-oglas", ctaKey: "ekran2_cta", gde: { vrsta: "meni", stavka: "pijaca" } },
    ],
  },
  // drugi potez: potvrda. Oba puta (poznaje / ne poznaje nikoga) stoje na
  // JEDNOM ekranu — ranije su bila dva ekrana kroz koja je svako prolazio.
  {
    key: "ekran3",
    pasusi: ["ekran3_p1", "ekran3_p2", "ekran3_p3", "ekran3_p4"],
    akcije: [
      {
        href: "/verifikacija",
        ctaKey: "ekran3_cta",
        gde: { vrsta: "meni", stavka: "verifikacija", grupa: "grupa_poverenje" },
      },
    ],
  },
  // profil, gde je šta, i (dok modul radi) nalog za dete
  {
    key: "ekran4",
    pasusi: ["ekran4_p1", "ekran4_p2", ...(MODUL_DECA_AKTIVAN ? ["ekran4_p3"] : [])],
    akcije: [
      { href: "/pijaca", ctaKey: "ekran4_cta_pijaca", gde: { vrsta: "meni", stavka: "pijaca" } },
      { href: "/profil", ctaKey: "ekran4_cta_profil", gde: { vrsta: "profil" } },
    ],
  },
];

/** sessionStorage ključ za korak na koji se korisnik vraća posle CTA odlaska. */
const KLJUC_KORAK = "kolo-dobrodosli-korak";

export default function DobrodosliPage() {
  const t = useTranslations("dobrodosli");
  const router = useRouter();
  const [korak, setKorak] = useState(0);
  const [prviPut, setPrviPut] = useState(false);

  // Jednokratni flag iz registracije/OAuth-a: ako postoji, ovo je prvi prolaz
  // (gornje dugme = "Preskoči" → /sistem). Inače je vodič otvoren iz "?"
  // (gornje dugme = "Zatvori" → nazad). Flag čistimo čim ga pročitamo.
  //
  // Uz to vraćamo korak na koji se čovek vratio: CTA dugmad vode van vodiča
  // (npr. na tablu jemstva), a povratak je do sada uvek počinjao od ekrana 1 —
  // ko izađe da pogleda pa se vrati, morao je ponovo da proklikta ceo vodič.
  // Korak upisuje `idiNa` pri odlasku, ovde ga trošimo (pročitaj pa obriši),
  // tako da vodič otvoren iz "?" i dalje kreće od početka.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("kolo-welcome")) {
        setPrviPut(true);
        sessionStorage.removeItem("kolo-welcome");
      }
      const sacuvan = sessionStorage.getItem(KLJUC_KORAK);
      if (sacuvan !== null) {
        sessionStorage.removeItem(KLJUC_KORAK);
        const n = Number(sacuvan);
        if (Number.isInteger(n) && n >= 0 && n < EKRANI.length) setKorak(n);
      }
    } catch {
      /* nedostupan */
    }
    // Zabeleži da je vodič viđen — time prestaje automatsko vođenje ovamo pri
    // prijavi (`User.vodicVidjenAt`). Upis ide pri otvaranju, ne na izlasku: ko
    // zatvori prozor na trećem ekranu, vodič JE video, a i nijedan izlaz iz
    // vodiča ne bi mogao da promakne. Ruta piše samo kad je polje prazno, pa
    // otvaranje iz „?" ne pomera zabeleženi trenutak. Pad se ćutke prelazi —
    // najgore što se dešava jeste da se vodič ponudi i pri sledećoj prijavi.
    void fetch("/api/profil/vodic", { method: "POST" }).catch(() => {});
  }, []);

  /** Odlazak sa vodiča preko CTA dugmeta — zapamti korak radi povratka. */
  function idiNa(href: string) {
    try {
      sessionStorage.setItem(KLJUC_KORAK, String(korak));
    } catch {
      /* nedostupan — u najgorem slučaju vodič kreće od početka, kao ranije */
    }
    router.push(href);
  }

  const ekran = EKRANI[korak];
  const prvi = korak === 0;
  const poslednji = korak === EKRANI.length - 1;
  const oznaka = t(`${ekran.key}_oznaka`);
  const pasusi = ekran.pasusi.map((k) => t(k));

  /**
   * Izlaz iz vodiča.
   *
   * Na prvom prolazu vodi na **Pijacu**, ne na Sistem: prvi potez novog čoveka
   * je objava oglasa (Početna, „put do učešća"), a Sistem je pregled brojeva
   * koji tek registrovanom nalogu ništa ne govori — svi su na nuli.
   * Vodič otvoren iz „?" u zaglavlju se samo zatvara, nazad odakle je otvoren.
   */
  function zatvori() {
    if (prviPut) router.push("/pijaca");
    else router.back();
  }

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Preskoči (prvi prolaz) / Zatvori (otvoreno iz "?") */}
      <div className="flex justify-end">
        <button
          onClick={zatvori}
          className="text-sm text-kolo-muted hover:text-kolo-text transition-colors"
        >
          {prviPut ? t("preskoči") : t("zatvori")}
        </button>
      </div>

      {/* Indikator koraka */}
      <div className="flex items-center justify-center gap-2">
        {EKRANI.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === korak ? "w-8 bg-kolo-green-500" : "w-2 bg-kolo-border"
            }`}
          />
        ))}
      </div>

      {/* Kartica u stilu vesti Fondacije */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-7 md:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-kolo-green-700">
          {t("korak_indikator", { broj: korak + 1, ukupno: EKRANI.length, oznaka })}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-kolo-text">{t(`${ekran.key}_naslov`)}</h1>
        <div className="mt-4 space-y-3">
          {pasusi.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-kolo-text text-body">
              {p}
            </p>
          ))}
        </div>

        {/* Akcione veze ekrana: dugme + crtež gde se stranica nalazi u navigaciji */}
        {ekran.akcije?.map((akcija) => (
          <div key={akcija.href} className="mt-5 flex flex-col items-start">
            <button
              onClick={() => idiNa(akcija.href)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-kolo-green-700 hover:underline"
            >
              {t(akcija.ctaKey)} →
            </button>
            <GdeSeNalazi gde={akcija.gde} />
          </div>
        ))}
      </div>

      {/* Navigacija */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setKorak((k) => Math.max(0, k - 1))}
          disabled={prvi}
          className="px-4 py-2 text-sm font-medium text-kolo-muted hover:text-kolo-text disabled:opacity-0 transition-colors"
        >
          {t("nazad")}
        </button>
        {!poslednji && (
          <button
            onClick={() => setKorak((k) => Math.min(EKRANI.length - 1, k + 1))}
            className="px-5 py-2.5 bg-kolo-green-700 hover:bg-kolo-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {t("dalje")}
          </button>
        )}
      </div>
    </div>
  );
}
