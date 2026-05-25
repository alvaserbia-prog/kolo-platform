import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";

export const metadata: Metadata = {
  title: "Uskoro — KOLO",
  description: "KOLO platforma se priprema za pokretanje. Prijava i registracija biće dostupne uskoro.",
};

export default function UskoroPage() {
  return (
    <div className="min-h-screen bg-kolo-bg">
      <PublicHeader />

      <div className="max-w-[932px] mx-auto px-6 py-8 pb-20">
        <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/30 rounded-full text-xs font-medium text-white/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-kolo-gold-400" />
            U pripremi
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            Uskoro počinjemo
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Prijava i registracija su privremeno onemogućene dok platformu
            pripremamo za pokretanje. U međuvremenu možeš da razgledaš kako
            sistem funkcioniše.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kako-funkcionise"
              className="px-6 py-3 bg-kolo-gold-600 text-white font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors text-sm"
            >
              Kako funkcioniše →
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              Nazad na početnu
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
