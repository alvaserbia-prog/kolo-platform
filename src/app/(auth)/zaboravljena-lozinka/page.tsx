"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ZaboravljenaLozinkaPage() {
  const t = useTranslations("zaboravljenaLozinka");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [poslato, setPoslato] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t("greska_email_obavezan"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("greska_email_neispravan"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/zaboravljena-lozinka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? t("greska_zahtev"));
        return;
      }
      setPoslato(true);
    } catch {
      setError(t("greska_zahtev"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-kolo-text">{t("naslov")}</h1>
          <p className="mt-1 text-base text-kolo-muted">{t("podnaslov")}</p>
        </div>

        {poslato ? (
          <div>
            <div className="mb-5 text-sm text-kolo-green-700 bg-kolo-green-100 rounded-xl px-4 py-3">
              {t("poslato_poruka")}
            </div>
            <p className="text-sm text-kolo-muted mb-5">{t("poslato_napomena")}</p>
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl border border-kolo-border text-sm font-medium text-kolo-text text-center hover:bg-kolo-bg transition-colors"
            >
              {t("nazad_na_login")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-sm font-medium text-kolo-text mb-1.5">
                {t("email")}
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
                placeholder={t("placeholder_email")}
                suppressHydrationWarning
              />
            </div>

            {error && (
              <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
              suppressHydrationWarning
            >
              {loading ? t("dugme_loading") : t("dugme")}
            </button>

            <p className="text-center text-sm text-kolo-muted">
              <Link href="/login" className="text-kolo-green-700 font-medium hover:underline">
                {t("nazad_na_login")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
