"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

export default function RegistracijaPage() {
  const router = useRouter();
  const t = useTranslations("registracija");
  const [form, setForm] = useState({ email: "", pseudonim: "", password: "", passwordConfirm: "", referralCode: "" });

  // Auto-popuni referral iz cookie ili localStorage (postavljeno pri kliknu na /m/{hash})
  useEffect(() => {
    if (typeof document === "undefined") return;
    // Pokušaj localStorage
    const lsRef = localStorage.getItem("kolo_ref");
    if (lsRef) {
      // Treba da pronađemo pseudonim za ovaj hash
      fetch(`/api/m/${lsRef}/pseudonim`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.referralCode) {
            setForm((f) => ({ ...f, referralCode: data.referralCode }));
          }
        })
        .catch(() => {});
      return;
    }
    // Pokušaj cookie
    const match = document.cookie.match(/(?:^|;\s*)kolo_ref=([^;]+)/);
    if (match) {
      fetch(`/api/m/${match[1]}/pseudonim`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.referralCode) {
            setForm((f) => ({ ...f, referralCode: data.referralCode }));
          }
        })
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      body: JSON.stringify({ email: form.email, pseudonim: form.pseudonim, password: form.password, referralCode: form.referralCode || undefined }),
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
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-8">
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

          {/* Referral */}
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">
              {t("referral_kod")} <span className="text-kolo-muted font-normal">{t("opciono")}</span>
            </label>
            <input type="text" value={form.referralCode} onChange={(e) => set("referralCode", e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors bg-kolo-bg font-mono"
              placeholder={t("placeholder_referral")} suppressHydrationWarning />
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

        <p className="mt-5 text-center text-sm text-kolo-muted">
          {t("vec_imate_nalog")}{" "}
          <Link href="/login" className="text-kolo-green-700 font-medium hover:underline">{t("prijavite_se")}</Link>
        </p>
      </div>
    </div>
  );
}
