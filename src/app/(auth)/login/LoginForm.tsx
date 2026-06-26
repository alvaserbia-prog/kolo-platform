"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PrikaziLozinkuDugme from "@/components/PrikaziLozinkuDugme";

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prikaziLozinku, setPrikaziLozinku] = useState(false);
  const [error, setError] = useState("");
  // Kad je prijava odbijena (pogrešan email/lozinka ili nepostojeći nalog),
  // pored poruke pokazujemo upadljiv poziv na registraciju. NE razdvajamo
  // „nema naloga" od „pogrešna lozinka" (sprečava user enumeration).
  const [prikaziRegistraciju, setPrikaziRegistraciju] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPrikaziRegistraciju(false);

    if (!email.trim()) { setError(t("greska_email_obavezan")); return; }
    if (!email.includes("@")) { setError(t("greska_email_neispravan")); return; }
    if (!password) { setError(t("greska_lozinka_obavezna")); return; }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || !res.ok || res.error) {
        setError(t("greska_pogresni_podaci"));
        setPrikaziRegistraciju(true);
      } else {
        router.push(callbackUrl ?? "/dashboard");
        router.refresh();
      }
    } catch {
      setError(t("greska_prijava"));
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

        {registered && (
          <div className="mb-5 text-sm text-kolo-green-700 bg-kolo-green-100 rounded-xl px-4 py-3">
            {t("nalog_kreiran")}
          </div>
        )}

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
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">
              {t("lozinka")}
            </label>
            <div className="relative">
              <input
                type={prikaziLozinku ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
                placeholder={t("placeholder_lozinka")}
                suppressHydrationWarning
              />
              <PrikaziLozinkuDugme
                prikazan={prikaziLozinku}
                onToggle={() => setPrikaziLozinku((v) => !v)}
                prikaziLabel={t("prikazi_lozinku")}
                sakrijLabel={t("sakrij_lozinku")}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">
              <p>{error}</p>
              {prikaziRegistraciju && (
                <Link
                  href="/registracija"
                  className="mt-2 inline-flex items-center gap-1 font-semibold text-kolo-green-700 hover:underline"
                >
                  {t("greska_registruj_cta")} →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
            suppressHydrationWarning
          >
            {loading ? t("dugme_loading") : t("dugme")}
          </button>

          <p className="text-center text-sm">
            <Link href="/zaboravljena-lozinka" className="text-kolo-muted hover:text-kolo-green-700 hover:underline">
              {t("zaboravljena_lozinka")}
            </Link>
          </p>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-kolo-border" />
            </div>
            <span className="relative bg-white px-3 text-xs text-kolo-muted">ili</span>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/oauth/dovrsi" })}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-kolo-border text-sm font-medium text-kolo-text hover:bg-kolo-bg transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
              {t("dugme_google")}
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-kolo-muted">
          {t("nema_naloga")}{" "}
          <Link href="/registracija" className="text-kolo-green-700 font-medium hover:underline">
            {t("registrujte_se")}
          </Link>
        </p>
      </div>
    </div>
  );
}
