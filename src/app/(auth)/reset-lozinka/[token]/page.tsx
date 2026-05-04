"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

function jacina(p: string, t: (k: string) => string): { nivo: number; tekst: string; boja: string } {
  if (p.length === 0) return { nivo: 0, tekst: "", boja: "" };
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { nivo: 1, tekst: t("lozinka_slaba"), boja: "bg-kolo-danger-light0" };
  if (score <= 2) return { nivo: 2, tekst: t("lozinka_srednja"), boja: "bg-kolo-gold-400" };
  if (score <= 3) return { nivo: 3, tekst: t("lozinka_dobra"), boja: "bg-kolo-green-500" };
  return { nivo: 4, tekst: t("lozinka_jaka"), boja: "bg-kolo-green-700" };
}

export default function ResetLozinkaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const t = useTranslations("resetLozinka");
  const tReg = useTranslations("registracija");

  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking");
  const [novaLozinka, setNovaLozinka] = useState("");
  const [potvrda, setPotvrda] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uspesno, setUspesno] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reset-lozinka?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setTokenStatus(data.valid ? "valid" : "invalid");
      })
      .catch(() => {
        if (!cancelled) setTokenStatus("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const lozinkaJacina = jacina(novaLozinka, tReg);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (novaLozinka.length < 8) {
      setError(t("greska_lozinka_kratka"));
      return;
    }
    if (novaLozinka !== potvrda) {
      setError(t("greska_lozinke_ne_poklapaju"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-lozinka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaLozinka }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t("greska_zahtev"));
        return;
      }
      setUspesno(true);
      setTimeout(() => router.push("/login"), 2500);
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

        {tokenStatus === "checking" && (
          <p className="text-sm text-kolo-muted text-center py-4">{t("provera_linka")}</p>
        )}

        {tokenStatus === "invalid" && (
          <div>
            <div className="mb-5 text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">
              {t("link_nevazeci")}
            </div>
            <Link
              href="/zaboravljena-lozinka"
              className="block w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold text-center hover:bg-kolo-green-900 transition-colors"
            >
              {t("trazi_novi_link")}
            </Link>
          </div>
        )}

        {tokenStatus === "valid" && uspesno && (
          <div>
            <div className="mb-5 text-sm text-kolo-green-700 bg-kolo-green-100 rounded-xl px-4 py-3">
              {t("uspesno_promenjena")}
            </div>
            <p className="text-sm text-kolo-muted text-center">{t("preusmeravanje")}</p>
          </div>
        )}

        {tokenStatus === "valid" && !uspesno && (
          <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-sm font-medium text-kolo-text mb-1.5">
                {t("nova_lozinka")}
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={novaLozinka}
                onChange={(e) => setNovaLozinka(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
                placeholder={t("placeholder_lozinka")}
                suppressHydrationWarning
              />
              {novaLozinka.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          n <= lozinkaJacina.nivo ? lozinkaJacina.boja : "bg-kolo-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${
                      lozinkaJacina.nivo <= 1
                        ? "text-red-500"
                        : lozinkaJacina.nivo <= 2
                        ? "text-kolo-gold-600"
                        : "text-kolo-green-700"
                    }`}
                  >
                    {lozinkaJacina.tekst}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-kolo-text mb-1.5">
                {t("potvrda")}
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={potvrda}
                onChange={(e) => setPotvrda(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  potvrda && novaLozinka !== potvrda
                    ? "border-red-400"
                    : "border-kolo-border focus:border-kolo-green-700"
                }`}
                placeholder={t("placeholder_lozinka")}
                suppressHydrationWarning
              />
              {potvrda && novaLozinka !== potvrda && (
                <p className="mt-1 text-xs text-red-500">{t("greska_lozinke_ne_poklapaju")}</p>
              )}
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
          </form>
        )}
      </div>
    </div>
  );
}
