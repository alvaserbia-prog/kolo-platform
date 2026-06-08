"use client";

import { useLocale } from "next-intl";

// Jezik/pismo se bira preko cookie-a (NEXT_LOCALE) + osvežavanja — bez URL prefiksa
// (projekat koristi ravno stablo ruta; request.ts чita cookie i učitava prevode,
// a ćirilica se izvodi transliteracijom iz "sr").
const jezici = [
  { kod: "sr", oznaka: "Lat", naziv: "Srpski — latinica" },
  { kod: "sr-Cyrl", oznaka: "Ћир", naziv: "Српски — ћирилица" },
  { kod: "en", oznaka: "EN", naziv: "English" },
];

function promeniJezik(kod: string) {
  document.cookie = `NEXT_LOCALE=${kod}; path=/; max-age=31536000; SameSite=Lax`;
  // Prijavljenom korisniku trajno upiši izbor (notifikacije/email); gostu no-op.
  fetch("/api/profil/jezik", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jezik: kod }),
  }).catch(() => {});
  window.location.reload();
}

export default function JezikSvitcer() {
  const trenutni = useLocale();

  return (
    // data-no-cyr: oznake jezika se NE transliterišu (treba da ostanu "Lat"/"Ћир"/"EN"/"HU").
    <div data-no-cyr className="flex items-center gap-1">
      {jezici.map((j) => (
        <button
          key={j.kod}
          onClick={() => promeniJezik(j.kod)}
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
