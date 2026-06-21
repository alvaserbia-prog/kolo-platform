import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { sesija } from "@/lib/sesija";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import CirilicaProvider from "@/components/CirilicaProvider";
import { Analitika } from "@/components/Analitika";
import { CookieConsent } from "@/components/CookieConsent";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  IS_PRODUCTION,
  absoluteUrl,
  OG_LOCALE,
  hreflangAlternates,
} from "@/lib/seo";

// Podrazumevani font za latiničke korisnike. "latin-ext" pokriva srpske
// dijakritike (č, ć, š, ž, đ); ćirilica NIJE ovde da ne bi opterećivala
// kritičnu putanju (LCP) — ogromna većina koristi latinicu.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Ćirilica se učitava LENJO — koristi se samo kad je locale "sr-Cyrl".
// `preload: false` znači da latinički korisnici nikad ne preuzimaju ovaj fajl.
// Sadrži sva 3 subseta (jedna koherentna familija pokriva i latinicu i
// ćirilicu) da next/font fallback ne bi "ukrao" ćirilične glifove. Deli isti
// `--font-inter` var jer se primenjuje međusobno isključivo sa `inter`.
const interCirilica = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});

// Mono nije above-the-fold LCP tekst — ne preload-uje se da ne troši kritičnu putanju.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "KOLO — Sistem uzajamnosti zasnovan na doprinosu zajednici",
      template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    // Van produkcije (test/preview) NE indeksirati — sprečava da *.vercel.app
    // kanibalizuje ekolo.rs kao duplikat sadržaja.
    robots: IS_PRODUCTION
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: { canonical: "/", languages: hreflangAlternates("/") },
    verification: {
      google: "ZOi4durEtkkCiW-gVwphcJZu55zu4Q5UxRyl8Q88BdM",
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? "sr_RS",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: "KOLO — Sistem uzajamnosti zasnovan na doprinosu zajednici",
      description: SITE_DESCRIPTION,
      // og:image obezbeđuje opengraph-image.tsx (dinamička 1200×630) — ne dupliramo ovde.
    },
    twitter: {
      card: "summary_large_image",
      title: "KOLO — Sistem uzajamnosti zasnovan na doprinosu zajednici",
      description: SITE_DESCRIPTION,
    },
    icons: {
      icon: "/kolo-icon.png",
      apple: "/kolo-icon.png",
    },
  };
}

/** Organization strukturirani podaci (JSON-LD) — pomaže Google Knowledge panelu. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KOLO",
  url: SITE_URL,
  logo: absoluteUrl("/kolo-logo.png"),
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await sesija();

  // Klijentski i18n payload: NextIntlClientProvider serijalizuje poruke u HTML i
  // šalje ih klijentu na SVAKOJ stranici. Ceo set je ~118KB; ovi namespace-ovi se
  // koriste ISKLJUČIVO u serverskim komponentama (preko `getTranslations`) — javne
  // sadržajne stranice (pravni akti, landing, „o sistemu"…). Izbacujemo ih iz
  // klijentskog providera (~40KB manje) bez uticaja na server render (server čita
  // pun set nezavisno od ovog prop-a). Denylist (ne allowlist): nov namespace se
  // podrazumevano UKLJUČUJE → nema rizika od regresije kad se doda klijentski tekst.
  // VAŽNO: namespace dodati ovde tek pošto se potvrdi da ga NE koristi nijedna
  // klijentska komponenta (`useTranslations`).
  const SERVER_ONLY_NS = new Set([
    "pravne", "landing", "oSistemu", "kakoFunkcionise", "kakoFunkcionisePage",
    "zajednickoDobroPage", "osnivackiDoprinosPage", "pokroviteljPage", "zaposljavnje",
  ]);
  const clientMessages = Object.fromEntries(
    Object.entries(messages).filter(([ns]) => !SERVER_ONLY_NS.has(ns)),
  );

  // Ćirilični korisnici dobijaju Inter sa ćirilicom (lenjo, bez preload-a);
  // svi ostali podrazumevani latinički Inter.
  const fontInter = locale === "sr-Cyrl" ? interCirilica : inter;

  return (
    <html lang={locale} className={`${fontInter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full antialiased">
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider messages={clientMessages}>
          <CirilicaProvider />
          <Providers session={session}>{children}</Providers>
        </NextIntlClientProvider>
        {/* Vercel Analytics — bez kolačića (cookieless, agregatno), ne zahteva pristanak. */}
        <Analytics />
        {/* Google Analytics — učitava se SAMO uz pristanak (čl. 7 Politike). */}
        <Analitika />
        <CookieConsent />
      </body>
    </html>
  );
}
