import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import CirilicaProvider from "@/components/CirilicaProvider";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  IS_PRODUCTION,
  absoluteUrl,
  OG_LOCALE,
  hreflangAlternates,
} from "@/lib/seo";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const inter = Inter({
  variable: "--font-inter",
  // "cyrillic" je obavezan da ćirilični tekst koristi isti font (Inter), a ne
  // sistemski fallback — inače bi ćirilica izgledala vizuelno neujednačeno.
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full antialiased">
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <CirilicaProvider />
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JY214NWCDK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JY214NWCDK');
          `}
        </Script>
        {CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
