import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import RaniPristupForma from "@/components/RaniPristupForma";

export const metadata: Metadata = {
  title: "Rani pristup — KOLO",
  description: "Unesi pristupni kod da otključaš prijavu i registraciju pre zvaničnog pokretanja.",
  robots: { index: false, follow: false },
};

export default function RaniPristupPage() {
  return (
    <div className="min-h-screen bg-kolo-bg">
      <PublicHeader />

      <div className="max-w-[932px] mx-auto px-6 py-8 pb-20">
        <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/30 rounded-full text-xs font-medium text-white/80 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-kolo-gold-400" />
              Rani pristup
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
              Uđi sa pristupnim kodom
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              Platforma se još priprema za javno pokretanje. Ako si dobio/la
              pristupni kod, unesi ga ovde da otključaš prijavu i registraciju.
              Bez koda — u međuvremenu pogledaj kako sistem funkcioniše.
            </p>

            <RaniPristupForma />

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 justify-center text-sm">
              <Link
                href="/kako-funkcionise"
                className="text-white/80 hover:text-white hover:underline"
              >
                Kako funkcioniše →
              </Link>
              <Link
                href="/"
                className="text-white/60 hover:text-white hover:underline"
              >
                Nazad na početnu
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
