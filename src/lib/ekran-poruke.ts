/**
 * Tekstovi sistemskih ekrana (pad sistema, održavanje, 404).
 *
 * NAMERNO ODVOJENO OD `next-intl`: ovi ekrani se prikazuju upravo onda kada
 * aplikacija NE radi (npr. baza je nedostupna, pa `RootLayout` pukne pre nego
 * što stigne da postavi `NextIntlClientProvider`). Zato ovde nema ni jednog
 * `useTranslations`/`getTranslations` poziva — tekst mora da postoji i kad od
 * aplikacije ne radi ništa osim React-a.
 */

/**
 * Isti spisak kao `src/i18n/routing.ts` — kad se tamo doda jezik, dodati i ovde.
 *
 * 🔴 Nedostajanje jezika se NE vidi kao greška, nego kao srpski tekst: `routing.ts`
 * je od 2026-08-06 imao `hr` i `hu`, a ovaj tip ih nije imao, pa je
 * `normalizujJezik()` oba vraćao na "sr" i Hrvat i Mađar su na ekranu pada
 * sistema i na 404 stranici dobijali srpski. Brana je
 * `__tests__/sistemski-ekrani.test.ts` — poredi ovaj spisak sa `routing.ts`.
 *
 * Register je NAMERNO formalan („Molimo vas", „Vaši zapisi"), kao u srpskom
 * originalu ovih ekrana i u en/ru prevodu — ostatak sajta govori na „ti", ali
 * ovo su obaveštenja o stanju sistema, ne razgovor sa korisnikom.
 */
export type EkranJezik = "sr" | "sr-Cyrl" | "en" | "ru" | "hr" | "hu";

export type EkranTekst = {
  oznaka: string;
  naslov: string;
  telo: string;
  dopuna: string;
  dugme: string;
  pocetna: string;
};

type Skup = Record<EkranJezik, EkranTekst>;

/** Pad sistema — neplanirani prekid (greška u renderu, baza nedostupna…). */
export const PAD_SISTEMA: Skup = {
  sr: {
    oznaka: "Radovi u toku",
    naslov: "Radimo na sistemu",
    telo: "Implementacija KOLO sistema je u toku i ovaj deo trenutno nije dostupan.",
    dopuna: "Molimo vas da pogledate ponovo malo kasnije. Vaši zapisi su bezbedni.",
    dugme: "Pokušaj ponovo",
    pocetna: "Na početnu",
  },
  "sr-Cyrl": {
    oznaka: "Радови у току",
    naslov: "Радимо на систему",
    telo: "Имплементација КОЛО система је у току и овај део тренутно није доступан.",
    dopuna: "Молимо вас да погледате поново мало касније. Ваши записи су безбедни.",
    dugme: "Покушај поново",
    pocetna: "На почетну",
  },
  en: {
    oznaka: "Work in progress",
    naslov: "We are working on the system",
    telo: "Implementation of the KOLO system is under way and this part is temporarily unavailable.",
    dopuna: "Please check back a little later. Your records are safe.",
    dugme: "Try again",
    pocetna: "Home page",
  },
  ru: {
    oznaka: "Идут работы",
    naslov: "Мы работаем над системой",
    telo: "Внедрение системы KOLO продолжается, и этот раздел временно недоступен.",
    dopuna: "Пожалуйста, загляните немного позже. Ваши записи в безопасности.",
    dugme: "Попробовать снова",
    pocetna: "На главную",
  },
  hr: {
    oznaka: "Radovi u tijeku",
    naslov: "Radimo na sustavu",
    telo: "Implementacija KOLO sustava je u tijeku i ovaj dio trenutno nije dostupan.",
    dopuna: "Molimo vas da pogledate ponovno malo kasnije. Vaši zapisi su sigurni.",
    dugme: "Pokušaj ponovno",
    pocetna: "Na početnu",
  },
  hu: {
    oznaka: "Munkálatok folyamatban",
    naslov: "A rendszeren dolgozunk",
    telo: "A KOLO rendszer bevezetése folyamatban van, és ez a rész jelenleg nem érhető el.",
    dopuna: "Kérjük, nézzen vissza kicsit később. A bejegyzései biztonságban vannak.",
    dugme: "Próbálja újra",
    pocetna: "Főoldal",
  },
};

/**
 * Planirano održavanje — uključuje se ručno (env `ODRZAVANJE`).
 *
 * `dugme` je prazno namerno: ovaj ekran je serverska stranica, nema `reset()`
 * granice greške da se zakači na dugme. „Na početnu" ionako radi kao osvežavanje
 * — ponovo traži stranicu i propušta korisnika čim se održavanje isključi.
 */
export const ODRZAVANJE: Skup = {
  sr: {
    oznaka: "Radovi u toku",
    naslov: "Radovi na sistemu su u toku",
    telo: "Trenutno radimo na implementaciji i unapređenju KOLO sistema, pa platforma nakratko nije dostupna.",
    dopuna: "Molimo vas da pogledate ponovo malo kasnije. Vaši zapisi su bezbedni.",
    dugme: "",
    pocetna: "Na početnu",
  },
  "sr-Cyrl": {
    oznaka: "Радови у току",
    naslov: "Радови на систему су у току",
    telo: "Тренутно радимо на имплементацији и унапређењу КОЛО система, па платформа накратко није доступна.",
    dopuna: "Молимо вас да погледате поново мало касније. Ваши записи су безбедни.",
    dugme: "",
    pocetna: "На почетну",
  },
  en: {
    oznaka: "Work in progress",
    naslov: "The system is under maintenance",
    telo: "We are implementing and improving the KOLO system, so the platform is briefly unavailable.",
    dopuna: "Please check back a little later. Your records are safe.",
    dugme: "",
    pocetna: "Home page",
  },
  ru: {
    oznaka: "Идут работы",
    naslov: "Ведутся технические работы",
    telo: "Сейчас мы внедряем и улучшаем систему KOLO, поэтому платформа ненадолго недоступна.",
    dopuna: "Пожалуйста, загляните немного позже. Ваши записи в безопасности.",
    dugme: "",
    pocetna: "На главную",
  },
  hr: {
    oznaka: "Radovi u tijeku",
    naslov: "Radovi na sustavu su u tijeku",
    telo: "Trenutno radimo na implementaciji i poboljšanju KOLO sustava, pa platforma nakratko nije dostupna.",
    dopuna: "Molimo vas da pogledate ponovno malo kasnije. Vaši zapisi su sigurni.",
    dugme: "",
    pocetna: "Na početnu",
  },
  hu: {
    oznaka: "Munkálatok folyamatban",
    naslov: "Rendszerkarbantartás folyamatban",
    telo: "Éppen a KOLO rendszer bevezetésén és fejlesztésén dolgozunk, ezért a platform rövid ideig nem érhető el.",
    dopuna: "Kérjük, nézzen vissza kicsit később. A bejegyzései biztonságban vannak.",
    dugme: "",
    pocetna: "Főoldal",
  },
};

/** 404 — stranica ne postoji. Nije pad sistema, pa i poruka mora da bude druga. */
export const NEMA_STRANICE: Skup = {
  sr: {
    oznaka: "Stranica ne postoji",
    naslov: "Ova stranica nije pronađena",
    telo: "Adresa koju ste otvorili ne postoji ili je u međuvremenu promenjena.",
    dopuna: "Sistem radi normalno — vratite se na početnu i nastavite odatle.",
    dugme: "",
    pocetna: "Na početnu",
  },
  "sr-Cyrl": {
    oznaka: "Страница не постоји",
    naslov: "Ова страница није пронађена",
    telo: "Адреса коју сте отворили не постоји или је у међувремену промењена.",
    dopuna: "Систем ради нормално — вратите се на почетну и наставите одатле.",
    dugme: "",
    pocetna: "На почетну",
  },
  en: {
    oznaka: "Page not found",
    naslov: "This page could not be found",
    telo: "The address you opened does not exist or has changed in the meantime.",
    dopuna: "The system is running normally — go back to the home page and continue from there.",
    dugme: "",
    pocetna: "Home page",
  },
  ru: {
    oznaka: "Страница не найдена",
    naslov: "Эта страница не найдена",
    telo: "Открытый вами адрес не существует или был изменён.",
    dopuna: "Система работает нормально — вернитесь на главную и продолжите оттуда.",
    dugme: "",
    pocetna: "На главную",
  },
  hr: {
    oznaka: "Stranica ne postoji",
    naslov: "Ova stranica nije pronađena",
    telo: "Adresa koju ste otvorili ne postoji ili je u međuvremenu promijenjena.",
    dopuna: "Sustav radi normalno — vratite se na početnu i nastavite odatle.",
    dugme: "",
    pocetna: "Na početnu",
  },
  hu: {
    oznaka: "Az oldal nem létezik",
    naslov: "Ez az oldal nem található",
    telo: "A megnyitott cím nem létezik, vagy időközben megváltozott.",
    dopuna: "A rendszer megfelelően működik — térjen vissza a főoldalra, és folytassa onnan.",
    dugme: "",
    pocetna: "Főoldal",
  },
};

export const JEZICI: EkranJezik[] = ["sr", "sr-Cyrl", "en", "ru", "hr", "hu"];

export function normalizujJezik(vrednost: string | undefined | null): EkranJezik {
  return JEZICI.includes(vrednost as EkranJezik) ? (vrednost as EkranJezik) : "sr";
}

/**
 * Jezik iz `NEXT_LOCALE` kolačića — čita se direktno iz `document.cookie` jer
 * `next-intl` provider na ovim ekranima ne postoji. Van pretraživača vraća "sr".
 */
export function jezikIzKolacica(): EkranJezik {
  if (typeof document === "undefined") return "sr";
  const par = document.cookie
    .split("; ")
    .find((c) => c.startsWith("NEXT_LOCALE="));
  return normalizujJezik(par?.slice("NEXT_LOCALE=".length));
}

/**
 * `lang` atribut za `<html>` na ekranima koji sami renderuju dokument.
 *
 * „sr-Cyrl" ide na „sr" namerno: pismo se ne prijavljuje čitaču ekrana kao
 * poseban jezik, a ćirilica je transliteracija istog teksta.
 */
export function htmlLang(jezik: EkranJezik): string {
  if (jezik === "sr" || jezik === "sr-Cyrl") return "sr";
  return jezik;
}
