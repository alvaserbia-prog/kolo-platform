"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  // Naslov oglasa — koristi se kao tekst pri deljenju
  naslov: string;
}

// Dugme za deljenje oglasa na društvenim mrežama.
// Pregled oglasa je javan svim posetiocima (Pravilnik čl. 16), pa je deljenje
// javnog URL-a oglasa primereno. Ne prosleđuje se nikakav lični/kontakt podatak —
// deli se samo javna adresa stranice oglasa.
export default function PodeliOglas({ naslov }: Props) {
  const t = useTranslations("pijaca");
  const [open, setOpen] = useState(false);
  const [kopirano, setKopirano] = useState(false);
  const [url, setUrl] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // URL se čita na klijentu (kanonska adresa /pijaca/[id]).
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  // Zatvori meni na klik van komponente.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function handleClick() {
    // Native Web Share API (mobilni / podržani browseri).
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: naslov, url });
        return;
      } catch {
        // Korisnik je otkazao ili nije podržano — pad na meni.
      }
    }
    setOpen((v) => !v);
  }

  async function kopirajLink() {
    try {
      await navigator.clipboard.writeText(url);
      setKopirano(true);
      setTimeout(() => setKopirano(false), 2000);
    } catch {
      // ignore
    }
  }

  const encUrl = encodeURIComponent(url);
  const encTekst = encodeURIComponent(naslov);

  const mreze = [
    {
      naziv: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      boja: "#1877F2",
      ikona: (
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      ),
    },
    {
      naziv: "X",
      href: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTekst}`,
      boja: "#000000",
      ikona: (
        <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.2 22H2l7.6-8.7L1.6 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z" />
      ),
    },
    {
      naziv: "WhatsApp",
      href: `https://wa.me/?text=${encTekst}%20${encUrl}`,
      boja: "#25D366",
      ikona: (
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.18-1.36a9.93 9.93 0 0 0 4.86 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.84 14.24c-.25.7-1.44 1.34-1.98 1.4-.53.06-1.02.27-3.43-.72-2.9-1.2-4.75-4.17-4.9-4.37-.14-.2-1.18-1.57-1.18-3s.75-2.12 1.02-2.42c.27-.3.58-.37.78-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.25.6.84 2.07.91 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.37 1.46.3.15.47.12.65-.07.18-.2.74-.86.94-1.16.2-.3.4-.25.66-.15.27.1 1.7.8 2 .95.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
      ),
    },
    {
      naziv: "Viber",
      href: `viber://forward?text=${encTekst}%20${encUrl}`,
      boja: "#7360F2",
      ikona: (
        <path d="M12 2C7.6 2 3.3 2.7 2.5 6.9c-.3 1.5-.3 4.4 0 6 .8 4.1 4 4.7 8.6 4.8l-.1 2.4c0 .5.6.9 1 .5l2.5-2.5c.2-.2.3-.4.7-.4 3.5-.3 5.6-1.4 6.2-4.8.3-1.5.3-4.4 0-6C20.7 2.7 16.4 2 12 2Zm.3 3.4c2.8 0 5.1 2 5.2 5 0 .2-.2.4-.4.4s-.4-.2-.4-.4c-.1-2.5-1.9-4.1-4.4-4.2-.2 0-.4-.2-.4-.4s.2-.4.4-.4Zm-3.7.9c.2-.1.5 0 .6.2l.7 1.2c.2.3.1.6-.1.8l-.4.3c-.2.1-.2.3-.1.5.4.9 1.3 1.8 2.2 2.2.2.1.4 0 .5-.1l.3-.4c.2-.2.5-.3.8-.1l1.2.7c.3.2.4.5.2.7-.6 1-1.7 1.2-2.7.8-1.9-.7-3.6-2.4-4.3-4.3-.3-1 0-2.1.8-2.7Zm3.8.5c2 .1 3 1.1 3.1 3 0 .2-.1.4-.3.4-.2 0-.4-.1-.4-.3-.1-1.5-.8-2.2-2.4-2.3-.2 0-.4-.2-.3-.4 0-.2.1-.3.3-.4Zm.1 1.3c.9.1 1.4.5 1.5 1.4 0 .2-.1.4-.3.4-.2 0-.4-.1-.4-.3-.1-.5-.3-.8-.9-.8-.2 0-.4-.2-.3-.4 0-.2.2-.4.4-.3Z" />
      ),
    },
    {
      naziv: "Telegram",
      href: `https://t.me/share/url?url=${encUrl}&text=${encTekst}`,
      boja: "#26A5E4",
      ikona: (
        <path d="M21.95 4.27 18.6 20.1c-.25 1.1-.9 1.38-1.84.86l-5.1-3.76-2.46 2.37c-.27.27-.5.5-1.02.5l.37-5.2 9.46-8.55c.41-.36-.09-.57-.64-.2L5.9 13.1l-5.04-1.58c-1.1-.34-1.12-1.1.23-1.62l19.7-7.6c.92-.34 1.72.2 1.42 1.6Z" />
      ),
    },
  ];

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={t("podeli")}
        className="inline-flex items-center gap-1.5 text-sm text-kolo-muted hover:text-kolo-green-700 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
        </svg>
        {t("podeli")}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-kolo-border bg-white p-3 shadow-lg">
          <p className="px-1 pb-2 text-xs font-semibold text-kolo-muted">{t("podeli_naslov")}</p>
          <div className="flex flex-wrap gap-2">
            {mreze.map((m) => (
              <a
                key={m.naziv}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                aria-label={m.naziv}
                title={m.naziv}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: m.boja }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  {m.ikona}
                </svg>
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={kopirajLink}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-kolo-bg py-2.5 text-sm font-semibold text-kolo-muted transition-colors hover:bg-kolo-border"
          >
            {kopirano ? t("podeli_kopirano") : t("podeli_kopiraj")}
          </button>
        </div>
      )}
    </div>
  );
}
