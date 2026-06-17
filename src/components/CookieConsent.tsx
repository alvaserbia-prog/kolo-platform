"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { procitajPristanak, sacuvajPristanak } from "@/lib/cookieConsent";

/**
 * Banner za pristanak na analitičke kolačiće (Politika privatnosti čl. 7).
 *
 * Prikazuje se samo dok korisnik nije odlučio. Odluka „Prihvati" omogućava
 * učitavanje analitike (Google Analytics, Microsoft Clarity) preko `Analitika`
 * komponente; „Odbij" trajno sprečava njihovo učitavanje. Neophodni (sesijski)
 * kolačići rade nezavisno od ovog izbora.
 */
export function CookieConsent() {
  const [vidljiv, setVidljiv] = useState(false);

  useEffect(() => {
    setVidljiv(procitajPristanak() === null);
  }, []);

  if (!vidljiv) return null;

  function odluci(p: "prihvaceno" | "odbijeno") {
    sacuvajPristanak(p);
    setVidljiv(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Pristanak na kolačiće"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-kolo-border bg-white shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <p className="text-sm text-kolo-text leading-relaxed flex-1">
          Koristimo neophodne kolačiće za rad platforme. Uz tvoj pristanak
          koristimo i analitičke kolačiće (Google Analytics, Microsoft Clarity)
          da bismo razumeli korišćenje i poboljšali sajt. Možeš ih prihvatiti ili
          odbiti — sajt radi i bez njih.{" "}
          <Link href="/privatnost" className="text-kolo-green-700 hover:underline whitespace-nowrap">
            Politika privatnosti
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => odluci("odbijeno")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-kolo-green-900 border border-kolo-border hover:bg-kolo-green-100 transition-colors"
          >
            Odbij
          </button>
          <button
            type="button"
            onClick={() => odluci("prihvaceno")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-kolo-green-700 hover:bg-kolo-green-900 transition-colors"
          >
            Prihvati
          </button>
        </div>
      </div>
    </div>
  );
}
