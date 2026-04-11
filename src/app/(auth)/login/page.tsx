"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

function LoginForm() {
  const router = useRouter();
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

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
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-8">
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
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
              placeholder={t("placeholder_lozinka")}
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
        </form>

        <p className="mt-6 text-center text-sm text-kolo-muted">
          {t("nema_naloga")}{" "}
          <Link href="/registracija" className="text-kolo-green-700 font-medium hover:underline">
            {t("registrujte_se")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
