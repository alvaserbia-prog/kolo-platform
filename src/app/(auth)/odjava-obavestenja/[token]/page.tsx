"use client";

/**
 * Odjava sa email obaveštenja preko linka iz podnožja mejla — bez prijave.
 *
 * Odjava se izvršava tek na klik (POST), ne na otvaranje stranice: klijenti za
 * poštu ponekad unapred učitavaju linkove, pa bi automatska odjava isključila
 * mejlove korisniku koji ih i dalje želi.
 */

import { useState, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function OdjavaObavestenjaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const t = useTranslations("odjavaObavestenja");

  const [stanje, setStanje] = useState<"pocetno" | "salje" | "odjavljen" | "greska">("pocetno");

  async function odjavi() {
    setStanje("salje");
    try {
      const res = await fetch("/api/email/odjava", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setStanje(res.ok ? "odjavljen" : "greska");
    } catch {
      setStanje("greska");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kolo-text">{t("naslov")}</h1>
          <p className="mt-1 text-base text-kolo-muted">
            {stanje === "odjavljen" ? t("podnaslov_gotovo") : t("podnaslov")}
          </p>
        </div>

        {stanje === "odjavljen" ? (
          <div>
            <div className="mb-5 text-sm text-kolo-green-700 bg-kolo-green-100 rounded-xl px-4 py-3">
              {t("uspesno")}
            </div>
            <p className="text-sm text-kolo-muted mb-5">{t("ponovo_uputstvo")}</p>
            <Link
              href="/profil"
              className="block w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold text-center hover:bg-kolo-green-900 transition-colors"
            >
              {t("na_profil")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-kolo-muted">{t("objasnjenje")}</p>
            <p className="text-sm text-kolo-muted">{t("napomena_lozinka")}</p>

            {stanje === "greska" && (
              <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">
                {t("greska")}
              </p>
            )}

            <button
              type="button"
              onClick={odjavi}
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
