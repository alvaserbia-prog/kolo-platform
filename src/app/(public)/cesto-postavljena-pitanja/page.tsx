import type { Metadata } from "next";
import Script from "next/script";
import FaqStranica from "@/components/FaqStranica";
import { FAQ_SEKCIJE } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Često postavljana pitanja",
  description:
    "Odgovori na najčešća pitanja o KOLO sistemu — POEN-u, ZRNU, Krugovima, Programima, Pijaci, sporovima, privatnosti i izlasku iz sistema.",
  alternates: { canonical: "/cesto-postavljena-pitanja" },
};

/** Pretvara markdown odgovor u čist tekst za FAQPage schema (Google traži plain). */
function ocistiOdgovor(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [tekst](url) → tekst
    .replace(/[*_`#>]/g, "") // markdown markeri
    .replace(/\s+/g, " ") // višestruki razmaci/novi redovi
    .trim();
}

/** FAQPage strukturirani podaci — omogućava „rich result" akordeon u Google-u. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SEKCIJE.flatMap((sekcija) =>
    sekcija.pitanja.map((p) => ({
      "@type": "Question",
      name: p.pitanje,
      acceptedAnswer: {
        "@type": "Answer",
        text: ocistiOdgovor(p.odgovor),
      },
    })),
  ),
};

export default function CestoPostavljenaPitanjaPage() {
  return (
    <div className="space-y-6 py-6">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div>
        <h1
          className="text-3xl font-bold text-kolo-green-900 tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Često postavljana pitanja
        </h1>
        <p className="text-base text-kolo-muted mt-2 leading-relaxed max-w-2xl text-body">
          Odgovori na najčešća pitanja o KOLO sistemu. Klikni na pitanje da
          razviješ odgovor, ili pretraži po ključnoj reči.
        </p>
      </div>
      <FaqStranica />
    </div>
  );
}
