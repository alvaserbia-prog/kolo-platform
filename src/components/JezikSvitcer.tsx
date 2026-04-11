"use client";

import { useLocale } from "next-intl";

const jezici = [
  { kod: "sr", fi: "rs", naziv: "Srpski" },
  { kod: "en", fi: "gb", naziv: "English" },
  { kod: "hu", fi: "hu", naziv: "Magyar" },
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
          title={j.naziv}
          className={`p-1 rounded transition-all ${
            trenutniJezik === j.kod
              ? "ring-2 ring-kolo-green-700 opacity-100"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <span className={`fi fi-${j.fi}`} style={{ width: 20, height: 15, display: "inline-block", borderRadius: 2 }} />
        </button>
      ))}
    </div>
  );
}
