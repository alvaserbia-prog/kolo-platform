"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  procitajPristanak,
  type Pristanak,
} from "@/lib/cookieConsent";

/**
 * Učitava analitičke trekere trećih lica (Google Analytics, Microsoft Clarity)
 * ISKLJUČIVO ako je korisnik dao pristanak na kolačiće (čl. 7 Politike privatnosti).
 *
 * Dok pristanak nije „prihvaceno", ništa se ne renderuje — nijedan treker se ne
 * učitava, nijedan kolačić trećih lica se ne postavlja. Promena pristanka
 * (preko `CookieConsent` bannera) odmah aktivira/deaktivira učitavanje.
 *
 * Vercel Analytics se NE učitava ovde — on je bez kolačića (cookieless, agregatni)
 * i učitava se zasebno u layout-u.
 */
export function Analitika({ clarityId }: { clarityId?: string }) {
  const [pristanak, setPristanak] = useState<Pristanak | null>(null);

  useEffect(() => {
    setPristanak(procitajPristanak());
    const handler = (e: Event) => {
      setPristanak((e as CustomEvent<Pristanak>).detail);
    };
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  if (pristanak !== "prihvaceno") return null;

  return (
    <>
      {/* lazyOnload: analitika se učitava tek u idle vremenu posle load-a, da ne
          otima glavnu nit tokom hidracije/LCP-a (smanjuje Total Blocking Time). */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-JY214NWCDK"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JY214NWCDK', { anonymize_ip: true });
        `}
      </Script>
      {clarityId && (
        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      )}
    </>
  );
}
