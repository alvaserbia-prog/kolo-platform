"use client";

import { useLocale } from "next-intl";

const jezici = [
  { kod: "sr", zastava: "🇷🇸", naziv: "SR" },
  { kod: "en", zastava: "🇬🇧", naziv: "EN" },
  { kod: "hu", zastava: "🇭🇺", naziv: "HU" },
];

function promeniJezik(kod: string) {
  document.cookie = `NEXT_LOCALE=${kod}; path=/; max-age=31536000; SameSite=Lax`;
  window.location.reload();
}

export default function JezikSvitcer() {
  const trenutniJezik = useLocale();

  return (
    <div className="flex items-center gap-1">
      {jezici.map((j) => (
        <button
          key={j.kod}
          onClick={() => promeniJezik(j.kod)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            trenutniJezik === j.kod
              ? "bg-kolo-green-100 text-kolo-green-700"
              : "text-kolo-muted hover:text-kolo-green-700 hover:bg-kolo-green-100"
          }`}
          title={j.naziv}
        >
          <span>{j.zastava}</span>
          <span>{j.naziv}</span>
        </button>
      ))}
    </div>
  );
}
