"use client";

import { useLocale } from "next-intl";

// Jezik/pismo se bira preko cookie-a (NEXT_LOCALE) + osvežavanja — bez URL prefiksa
// (projekat koristi ravno stablo ruta; request.ts чita cookie i učitava prevode,
// a ćirilica se izvodi transliteracijom iz "sr").
const jezici = [
  { kod: "sr", ikona: "/flags/rs.svg", naziv: "Srpski — latinica" },
  { kod: "sr-Cyrl", ikona: "/flags/rs-grb.svg", naziv: "Српски — ћирилица" },
  { kod: "en", ikona: "/flags/gb.svg", naziv: "English" },
  { kod: "hr", ikona: "/flags/hr.svg", naziv: "Hrvatski" },
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
    <div className="flex items-center gap-1.5">
      {jezici.map((j) => (
        <button
          key={j.kod}
          onClick={() => promeniJezik(j.kod)}
          title={j.naziv}
          aria-label={j.naziv}
          aria-pressed={trenutni === j.kod}
          suppressHydrationWarning
          className={`rounded-md p-0.5 transition-all ${
            trenutni === j.kod
              ? "ring-2 ring-white/90 opacity-100"
              : "opacity-45 hover:opacity-90"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={j.ikona}
            alt={j.naziv}
            width={24}
            height={18}
            className="block h-[18px] w-auto rounded-[3px]"
          />
        </button>
      ))}
    </div>
  );
}
