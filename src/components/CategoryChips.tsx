"use client";

import { useTranslations } from "next-intl";
import { KATEGORIJE, kategorijaKljuc } from "@/lib/kategorije";

// Čipovi kategorija Pijace — jedna komponenta, dva moda:
//  - "multi"  → višestruki izbor (filter na Pijaci, praćene kategorije u profilu)
//  - "single" → radio ponašanje (forma za objavu oglasa)
// Svih 13 kategorija je stalno vidljivo u flex-wrap rasporedu. Veličina čipa
// prati dugmad prekidača Ponude|Potražnja (px-4 py-1.5, zahtev vlasnika).
// `counts` (samo filter): prikazuje broj u čipu; kategorija sa 0 oglasa je
// prigušena, ali i dalje klikabilna.

export interface LeadingChip {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface Props {
  mode: "multi" | "single";
  selected: string[];
  onChange: (next: string[]) => void;
  counts?: Record<string, number>;
  // Poseban čip ispred kategorija (npr. „Samo praćene" na Pijaci).
  leadingChip?: LeadingChip;
}

export default function CategoryChips({ mode, selected, onChange, counts, leadingChip }: Props) {
  const t = useTranslations("pijaca");

  function toggle(slug: string) {
    if (mode === "single") {
      // Radio ponašanje: uvek tačno jedna izabrana; ponovni klik ne poništava.
      onChange([slug]);
      return;
    }
    onChange(
      selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5" role={mode === "single" ? "radiogroup" : "group"}>
      {leadingChip && (
        <button
          type="button"
          onClick={leadingChip.onClick}
          aria-pressed={leadingChip.active}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            leadingChip.active
              ? "bg-kolo-green-700 text-white"
              : "bg-white border border-kolo-gold-600/40 text-kolo-gold-600 hover:border-kolo-gold-600"
          }`}
        >
          {leadingChip.label}
        </button>
      )}
      {KATEGORIJE.map((slug) => {
        const aktivna = selected.includes(slug);
        const broj = counts?.[slug] ?? 0;
        const prigusena = counts !== undefined && broj === 0 && !aktivna;
        return (
          <button
            key={slug}
            type="button"
            onClick={() => toggle(slug)}
            role={mode === "single" ? "radio" : undefined}
            aria-checked={mode === "single" ? aktivna : undefined}
            aria-pressed={mode === "multi" ? aktivna : undefined}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              aktivna
                ? "bg-kolo-green-700 text-white"
                : `bg-white border border-kolo-border text-kolo-text hover:border-kolo-green-700 ${
                    prigusena ? "opacity-50" : ""
                  }`
            }`}
          >
            {t(`kategorija_${kategorijaKljuc(slug)}`)}
            {counts !== undefined && <span className="opacity-70"> ({broj})</span>}
          </button>
        );
      })}
    </div>
  );
}
