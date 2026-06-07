"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

// Jezik/pismo se sada bira preko URL prefiksa (next-intl navigacija):
//  - "sr"      → bez prefiksa (default)
//  - "sr-Cyrl" → /sr-Cyrl/…  (ćirilica, transliteracija iz sr)
//  - "en"      → /en/…
//  - "hu"      → /hu/…
const jezici = [
  { kod: "sr", oznaka: "Lat", naziv: "Srpski — latinica" },
  { kod: "sr-Cyrl", oznaka: "Ћир", naziv: "Српски — ћирилица" },
  { kod: "en", oznaka: "EN", naziv: "English" },
  { kod: "hu", oznaka: "HU", naziv: "Magyar" },
];

export default function JezikSvitcer() {
  const trenutni = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function promeniJezik(kod: string) {
    if (kod === trenutni) return;
    // Zadrži izabrani jezik i za buduće posete (cookie koji next-intl чita).
    document.cookie = `NEXT_LOCALE=${kod}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      // pathname je bez prefiksa; router dodaje odgovarajući prefiks za `locale`.
      router.replace(pathname, { locale: kod });
    });
  }

  return (
    // data-no-cyr: oznake jezika se NE transliterišu (treba da ostanu "Lat"/"Ћир"/"EN"/"HU").
    <div data-no-cyr className="flex items-center gap-1">
      {jezici.map((j) => (
        <button
          key={j.kod}
          onClick={() => promeniJezik(j.kod)}
          disabled={isPending}
          title={j.naziv}
          aria-label={j.naziv}
          aria-pressed={trenutni === j.kod}
          suppressHydrationWarning
          className={`px-1.5 py-0.5 rounded text-xs font-semibold leading-none transition-all ${
            trenutni === j.kod
              ? "bg-kolo-green-700 text-white opacity-100"
              : "text-kolo-muted opacity-50 hover:opacity-100"
          }`}
        >
          {j.oznaka}
        </button>
      ))}
    </div>
  );
}
