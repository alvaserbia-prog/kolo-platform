import type { Metadata } from "next";
import FaqAkordeon from "@/components/FaqAkordeon";

export const metadata: Metadata = {
  title: "Često postavljana pitanja — KOLO",
  description:
    "Odgovori na najčešća pitanja o KOLO sistemu, POEN-u, ZRNU, Krugovima, sporovima, izlasku iz sistema i pravnim aspektima platforme.",
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
        <p className="text-base text-kolo-muted mt-2 leading-relaxed">
          Odgovori na najčešća pitanja o KOLO sistemu — POEN-u, ZRNU, Krugovima
          i pravnim aspektima platforme.
        </p>
      </div>
      <FaqAkordeon />
    </div>
  );
}
