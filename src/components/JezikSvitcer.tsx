"use client";

import { useLocale } from "next-intl";

const jezici = [
  { kod: "sr", zastava: "/flags/rs.svg", naziv: "Srpski" },
  { kod: "en", zastava: "/flags/gb.svg", naziv: "English" },
  { kod: "hu", zastava: "/flags/hu.svg", naziv: "Magyar" },
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
          className={`p-0.5 rounded transition-all ${
            trenutniJezik === j.kod
              ? "ring-2 ring-kolo-green-700 opacity-100"
              : "opacity-40 hover:opacity-100"
          }`}
        >
          <img
            src={j.zastava}
            alt={j.naziv}
            width={20}
            height={15}
            style={{ borderRadius: 2, display: "block" }}
          />
        </button>
      ))}
    </div>
  );
}
