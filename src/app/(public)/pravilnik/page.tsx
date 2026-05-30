import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pravilnici KOLO sistema — KOLO",
  description: "Indeks pravilnika KOLO sistema, verzija 3.7.0",
};

const PRAVILNICI = [
  {
    slug: "kolo-sistem",
    naziv: "Pravilnik o KOLO sistemu",
    opis: "Osnovni akt sistema (12 glava, 82 člana). Uređuje POEN, ZRNO, obračunski koeficijent, dokaz stvarnosti, kanale evidentiranja doprinosa, module i upravljanje.",
  },
  {
    slug: "hijerarhija",
    naziv: "Pravilnik o hijerarhiji akata",
    opis: "Uređuje odnose između opštih akata Fondacije i platformskih akata, postupak donošenja i izmena.",
  },
  {
    slug: "dokaz-stvarnosti",
    naziv: "Pravilnik o dokazu stvarnosti",
    opis: "Operativna mehanika verifikacije korisnika kroz lanac jemstva: indeks stvarnosti, verifikacioni kapacitet, anti-cirkularno pravilo.",
  },
  {
    slug: "pokroviteljstvo-donacije",
    naziv: "Pravilnik o pokroviteljstvu i donacijama",
    opis: "Nivoi donacija fizičkih lica (11 nivoa, koeficijent 1,00–2,00) i nivoi pokroviteljstva pravnih lica (7 nivoa, prag 10.000 RSD).",
  },
  {
    slug: "operativni",
    naziv: "Pravilnik o operativnom doprinosu",
    opis: "Mehanika operativnog programa — međusobno potvrđivanje doprinosa verifikovanih korisnika.",
  },
  {
    slug: "osnivacki",
    naziv: "Pravilnik o osnivačkom doprinosu",
    opis: "Naknadno evidentiranje rada obavljenog pre otvaranja platforme. Gornja granica 2.400.000 POEN-a; kanal se trajno zatvara.",
  },
] as const;

export default function PravilniciIndex() {
  return (
    <div className="max-w-[800px] mx-auto pb-16">

      <div className="mb-8">
        <p className="text-xs text-kolo-muted mb-1">Pravni dokumenti</p>
        <h1 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          Pravilnici KOLO sistema
        </h1>
        <p className="text-sm text-kolo-muted mt-2">Verzija 3.7.0 · 16.05.2026.</p>
        <div className="mt-4 flex gap-3 text-sm flex-wrap">
          <span className="text-kolo-muted">Vidite i:</span>
          <Link href="/statut" className="text-kolo-green-700 hover:underline">Statut Fondacije</Link>
          <Link href="/privatnost" className="text-kolo-green-700 hover:underline">Politika privatnosti</Link>
          <Link href="/uslovi" className="text-kolo-green-700 hover:underline">Uslovi korišćenja</Link>
          <Link href="/whitepaper" className="text-kolo-green-700 hover:underline">Whitepaper</Link>
        </div>
      </div>

      <div className="space-y-3">
        {PRAVILNICI.map((p) => (
          <Link
            key={p.slug}
            href={`/pravilnik/${p.slug}`}
            className="block bg-white rounded-2xl card-shadow p-5 hover:shadow-md transition-shadow border-t-4 border-kolo-green-700"
          >
            <h2 className="font-bold text-kolo-green-900 text-lg leading-snug mb-2" style={{ letterSpacing: "-0.01em" }}>
              {p.naziv}
            </h2>
            <p className="text-sm text-kolo-muted leading-relaxed">
              {p.opis}
            </p>
            <p className="text-sm font-medium text-kolo-green-700 mt-3">Otvori dokument →</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-kolo-border flex flex-wrap gap-4 text-sm text-kolo-muted">
        <Link href="/" className="hover:text-kolo-green-700 transition-colors">
          Nazad na početnu
        </Link>
      </div>
    </div>
  );
}
