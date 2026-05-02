import type { Metadata } from "next";
import FaqStranica from "@/components/FaqStranica";

export const metadata: Metadata = {
  title: "Često postavljana pitanja — KOLO",
  description:
    "Odgovori na najčešća pitanja o KOLO sistemu — POEN-u, ZRNU, Krugovima, Programima, Pijaci, sporovima, privatnosti i izlasku iz sistema.",
};

export default function CestoPostavljenaPitanjaPage() {
  return (
    <div className="space-y-6 py-6">
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
