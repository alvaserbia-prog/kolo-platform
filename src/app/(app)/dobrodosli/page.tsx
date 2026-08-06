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

/** Akciona veza ekrana: dugme + crtež koji pokazuje gde ta stranica stoji u
 *  navigaciji (vidi GdeSeNalazi). Ekran može imati više akcija (korak 6). */
type Akcija = { href: string; ctaKey: string; gde: Gde };

/** Konfiguracija ekrana: ključ u messages + akcione veze.
 *  finalni ekran nosi dve glavne CTA dugmadi (verifikacija / tabla jemstva).
 *
 *  Redosled je namerno akcioni, ne opisni: novi korisnik ima tačno jedan
 *  zadatak (da ga neko potvrdi), pa dva puta do potvrde idu odmah na ekranima
 *  2 i 3 — teorija (POEN, Pijaca, profil) tek posle. */
const EKRANI: { key: string; pasusi: number; akcije?: Akcija[]; finalni?: boolean }[] = [
  // dobrodošlica + šta je zadatak + gde je uopšte meni
  { key: "ekran1", pasusi: 4 },
  // Put A — poznaje nekog (QR/kod)
  {
    key: "ekran2",
    pasusi: 3,
    akcije: [
      {
        href: "/verifikacija",
        ctaKey: "ekran2_cta",
        gde: { vrsta: "meni", stavka: "verifikacija", grupa: "grupa_poverenje" },
      },
    ],
  },
  // Put B — kartica prepoznavanja
  {
    key: "ekran3",
    pasusi: 4,
    akcije: [
      {
        href: "/tabla-jemstva",
        ctaKey: "ekran3_cta",
        gde: { vrsta: "meni", stavka: "tabla_jemstva", grupa: "grupa_poverenje" },
      },
    ],
  },
  // šta se otključava potvrdom
  { key: "ekran4", pasusi: 3 },
  // POEN
  {
    key: "ekran5",
    pasusi: 3,
    akcije: [{ href: "/novcanik", ctaKey: "ekran5_cta", gde: { vrsta: "meni", stavka: "novcanik" } }],
  },
  // dok čeka potvrdu: profil (van menija — preko profilne slike) + Pijaca
  {
    key: "ekran6",
    pasusi: 5,
    akcije: [
      { href: "/profil", ctaKey: "ekran6_cta_profil", gde: { vrsta: "profil" } },
      { href: "/pijaca", ctaKey: "ekran6_cta_pijaca", gde: { vrsta: "meni", stavka: "pijaca" } },
    ],
  },
  // uradi jednu stvar sada
  { key: "ekran7", pasusi: 3, finalni: true },
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
  const pasusi = Array.from({ length: ekran.pasusi }, (_, i) => t(`${ekran.key}_p${i + 1}`));

  function zatvori() {
    if (prviPut) router.push("/sistem");
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
        {!ekran.finalni &&
          ekran.akcije?.map((akcija) => (
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

        {/* Završni CTA-ovi na poslednjem ekranu */}
        {ekran.finalni && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => idiNa("/verifikacija")}
              className="flex-1 px-4 py-3 bg-kolo-green-700 hover:bg-kolo-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t("cta_poznajem")}
            </button>
            <button
              onClick={() => idiNa("/tabla-jemstva")}
              className="flex-1 px-4 py-3 bg-white border border-kolo-green-700 text-kolo-green-700 hover:bg-kolo-green-100 text-sm font-semibold rounded-xl transition-colors"
            >
              {t("cta_ne_poznajem")}
            </button>
          </div>
        )}
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
