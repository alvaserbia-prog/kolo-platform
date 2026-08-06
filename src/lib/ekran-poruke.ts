/**
 * Tekstovi sistemskih ekrana (pad sistema, održavanje, 404).
 *
 * NAMERNO ODVOJENO OD `next-intl`: ovi ekrani se prikazuju upravo onda kada
 * aplikacija NE radi (npr. baza je nedostupna, pa `RootLayout` pukne pre nego
 * što stigne da postavi `NextIntlClientProvider`). Zato ovde nema ni jednog
 * `useTranslations`/`getTranslations` poziva — tekst mora da postoji i kad od
 * aplikacije ne radi ništa osim React-a.
 */

/** Isti spisak kao `src/i18n/routing.ts` — kad se tamo doda jezik, dodati i ovde. */
export type EkranJezik = "sr" | "sr-Cyrl" | "en" | "ru";

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
};

const JEZICI: EkranJezik[] = ["sr", "sr-Cyrl", "en", "ru"];

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

/** `lang` atribut za `<html>` na ekranima koji sami renderuju dokument. */
export function htmlLang(jezik: EkranJezik): string {
  if (jezik === "en") return "en";
  if (jezik === "ru") return "ru";
  return "sr";
}
