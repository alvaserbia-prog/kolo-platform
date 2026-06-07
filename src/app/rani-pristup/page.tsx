import type { Metadata } from "next";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import RaniPristupForma from "@/components/RaniPristupForma";

export const metadata: Metadata = {
  title: "Rani pristup — KOLO",
  description: "Unos pristupnog koda za rane prihvatioce dok se platforma priprema za pokretanje.",
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
              Ulaz za rane prihvatioce
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              Platforma se još priprema za pokretanje. Ako imaš pristupni kod,
              unesi ga ovde da otključaš prijavu i registraciju pre zvaničnog starta.
            </p>

            <RaniPristupForma />

            <p className="mt-6 text-sm">
              <Link href="/uskoro" className="text-white/60 hover:text-white hover:underline">
                ← Nazad
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
