"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LokacijaSearch from "@/components/LokacijaSearch";

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

export default function RegistracijaPage() {
  const router = useRouter();
  const t = useTranslations("registracija");
  const [form, setForm] = useState({ email: "", pseudonim: "", password: "", passwordConfirm: "" });
  const [mesto, setMesto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pseudonimStatus, setPseudonimStatus] = useState<"idle" | "checking" | "slobodan" | "zauzet">("idle");
  const [uslovi, setUslovi] = useState(false);
  const [privatnost, setPrivatnost] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Live provera pseudonima
  useEffect(() => {
    const p = form.pseudonim.trim();
    if (p.length < 3) { setPseudonimStatus("idle"); return; }
    setPseudonimStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(`/api/provjeri-pseudonim?p=${encodeURIComponent(p)}`, { signal: controller.signal });
        const data = await res.json();
        setPseudonimStatus(data.slobodan ? "slobodan" : "zauzet");
      } catch {
        setPseudonimStatus("idle");
      } finally {
        clearTimeout(timer);
      }
    }, 400);
  }, [form.pseudonim]);

  const lozinkaJacina = jacina(form.password, t);
  const canSubmit = !loading && uslovi && privatnost && pseudonimStatus !== "zauzet" && pseudonimStatus !== "checking";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.email.includes("@")) { setError(t("greska_email")); return; }
    if (form.pseudonim.trim().length < 3) { setError(t("greska_pseudonim_duljina")); return; }
    if (pseudonimStatus === "zauzet") { setError(t("greska_pseudonim_zauzet")); return; }
    if (form.password.length < 8) { setError(t("greska_lozinka_duljina")); return; }
    if (form.password !== form.passwordConfirm) { setError(t("greska_lozinke_poklapaju")); return; }
    if (!uslovi || !privatnost) { setError(t("greska_uslovi")); return; }

    setLoading(true);
    const res = await fetch("/api/registracija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, pseudonim: form.pseudonim, password: form.password, location: mesto.trim() || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? t("greska_registracija")); return; }

    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    if (result?.error) { router.push("/login?registered=1"); return; }
    router.push("/verifikacija");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="mb-7">
          <h1 className="text-xl font-bold text-kolo-text">{t("naslov")}</h1>
          <p className="mt-1 text-sm text-kolo-muted">{t("podnaslov")}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("email")} *</label>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
              placeholder="vas@email.com" suppressHydrationWarning />
          </div>

          {/* Pseudonim */}
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("pseudonim")} *</label>
            <div className="relative">
              <input type="text" autoComplete="username" maxLength={30} value={form.pseudonim} onChange={(e) => set("pseudonim", e.target.value)}
                className={`w-full px-4 py-3 pr-9 rounded-xl border text-sm outline-none transition-colors ${
                  pseudonimStatus === "zauzet" ? "border-red-400 focus:border-red-500"
                  : pseudonimStatus === "slobodan" ? "border-kolo-green-500 focus:border-kolo-green-700"
                  : "border-kolo-border focus:border-kolo-green-700"
                }`}
                placeholder={t("placeholder_pseudonim")} suppressHydrationWarning />
              {pseudonimStatus === "checking" && <span className="absolute right-3 top-3.5 text-xs text-kolo-muted">{t("pseudonim_provera")}</span>}
              {pseudonimStatus === "slobodan" && <span className="absolute right-3 top-3 text-kolo-green-700">✓</span>}
              {pseudonimStatus === "zauzet" && <span className="absolute right-3 top-3 text-red-500">✕</span>}
            </div>
            {pseudonimStatus === "zauzet" && <p className="mt-1 text-xs text-red-500">{t("pseudonim_zauzet")}</p>}
            {pseudonimStatus !== "zauzet" && <p className="mt-1 text-xs text-kolo-muted">{t("pseudonim_slobodan_opis")}</p>}
          </div>

          {/* Lozinka */}
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("lozinka")} *</label>
            <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg"
              placeholder={t("placeholder_lozinka")} suppressHydrationWarning />
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(n => (
                    <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= lozinkaJacina.nivo ? lozinkaJacina.boja : "bg-kolo-border"}`} />
                  ))}
                </div>
                <p className={`text-xs ${lozinkaJacina.nivo <= 1 ? "text-red-500" : lozinkaJacina.nivo <= 2 ? "text-kolo-gold-600" : "text-kolo-green-700"}`}>
                  {lozinkaJacina.tekst}
                </p>
              </div>
            )}
          </div>

          {/* Potvrda */}
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("potvrda_lozinke")} *</label>
            <input type="password" autoComplete="new-password" value={form.passwordConfirm} onChange={(e) => set("passwordConfirm", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                form.passwordConfirm && form.password !== form.passwordConfirm ? "border-red-400" : "border-kolo-border focus:border-kolo-green-700"
              }`}
              placeholder={t("placeholder_lozinka")} suppressHydrationWarning />
            {form.passwordConfirm && form.password !== form.passwordConfirm && (
              <p className="mt-1 text-xs text-red-500">{t("lozinke_ne_poklapaju")}</p>
            )}
          </div>

          {/* Mesto (opciono) */}
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">
              {t("mesto")} <span className="text-kolo-muted font-normal">{t("opciono")}</span>
            </label>
            <LokacijaSearch value={mesto} onChange={setMesto} />
            <p className="mt-1 text-xs text-kolo-muted">{t("mesto_opis")}</p>
          </div>

          {/* Checkbox-ovi */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={uslovi} onChange={(e) => setUslovi(e.target.checked)}
                className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
              <span className="text-xs text-kolo-muted">
                {t("uslovi")} <Link href="/uslovi" target="_blank" className="text-kolo-green-700 underline">{t("uslovi_link")}</Link>
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={privatnost} onChange={(e) => setPrivatnost(e.target.checked)}
                className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
              <span className="text-xs text-kolo-muted">
                {t("uslovi")} <Link href="/privatnost" target="_blank" className="text-kolo-green-700 underline">{t("privatnost_link")}</Link>
              </span>
            </label>
          </div>

          {error && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={!canSubmit}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors disabled:opacity-50"
            suppressHydrationWarning>
            {loading ? t("dugme_loading") : t("dugme")}
          </button>
        </form>

        <div className="mt-5">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-kolo-border" />
            </div>
            <span className="relative bg-white px-3 text-xs text-kolo-muted">ili se registruj sa</span>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/oauth/dovrsi" })}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-kolo-border text-sm font-medium text-kolo-text hover:bg-kolo-bg transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
              Registruj se sa Google
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-kolo-muted">
          {t("vec_imate_nalog")}{" "}
          <Link href="/login" className="text-kolo-green-700 font-medium hover:underline">{t("prijavite_se")}</Link>
        </p>
      </div>
    </div>
  );
}
