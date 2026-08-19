"use client";

/**
 * Potvrda imejl adrese koju je maloletni korisnik upisao — preko linka iz poruke,
 * bez prijave.
 *
 * Potvrda se izvršava tek na klik (POST), ne na otvaranje stranice: klijenti za
 * poštu ponekad unapred učitavaju linkove, pa bi se adresa potvrdila bez ijednog
 * ljudskog klika. Isti razlog kao kod odjave sa obaveštenja.
 */

import { useState, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PotvrdiEmailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const t = useTranslations("potvrdiEmail");

  const [stanje, setStanje] = useState<"pocetno" | "salje" | "gotovo" | "greska">("pocetno");
  const [poruka, setPoruka] = useState<string | null>(null);

  async function potvrdi() {
    setStanje("salje");
    try {
      const res = await fetch("/api/profil/email/potvrdi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setPoruka(data?.error ?? t("greska"));
        setStanje("greska");
        return;
      }
      setStanje("gotovo");
    } catch {
      setPoruka(t("greska"));
      setStanje("greska");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kolo-text">{t("naslov")}</h1>
          <p className="mt-1 text-base text-kolo-muted">
            {stanje === "gotovo" ? t("podnaslov_gotovo") : t("podnaslov")}
          </p>
        </div>

        {stanje === "gotovo" ? (
          <div>
            <div className="mb-5 text-sm text-kolo-green-700 bg-kolo-green-100 rounded-xl px-4 py-3">
              {t("uspesno")}
            </div>
            <p className="text-sm text-kolo-muted mb-5">{t("cemu_sluzi")}</p>
            <Link
              href="/pocetna"
              className="block w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold text-center hover:bg-kolo-green-900 transition-colors"
            >
              {t("na_pocetnu")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-kolo-muted">{t("objasnjenje")}</p>
            <p className="text-sm text-kolo-muted">{t("nisi_ti")}</p>

            {stanje === "greska" && (
              <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">
                {poruka ?? t("greska")}
              </p>
            )}

            <button
              type="button"
              onClick={potvrdi}
              disabled={stanje === "salje"}
              className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
            >
              {stanje === "salje" ? t("dugme_loading") : t("dugme")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
