"use client";

import { useLocale } from "next-intl";

// Dva pisma istog jezika. Pošto su oba "srpski", razlikujemo ih tekstualnom
// oznakom ("Lat" / "Ћир") umesto iste zastave — jasnije korisniku.
const pisma = [
  { kod: "sr", oznaka: "Lat", naziv: "Srpski — latinica" },
  { kod: "sr-Cyrl", oznaka: "Ћир", naziv: "Српски — ћирилица" },
];

function promeniJezik(kod: string) {
  document.cookie = `NEXT_LOCALE=${kod}; path=/; max-age=31536000; SameSite=Lax`;
  window.location.reload();
}

export default function JezikSvitcer() {
  const trenutni = useLocale();

  return (
    // data-no-cyr: oznake pisama se NE transliterišu (treba da ostanu "Lat"/"Ћир").
    <div data-no-cyr className="flex items-center gap-1">
      {pisma.map((p) => (
        <button
          key={p.kod}
          onClick={() => promeniJezik(p.kod)}
          title={p.naziv}
          aria-label={p.naziv}
          aria-pressed={trenutni === p.kod}
          suppressHydrationWarning
          className={`px-1.5 py-0.5 rounded text-xs font-semibold leading-none transition-all ${
            trenutni === p.kod
              ? "bg-kolo-green-700 text-white opacity-100"
              : "text-kolo-muted opacity-50 hover:opacity-100"
          }`}
        >
          {p.oznaka}
        </button>
      ))}
    </div>
  );
}
