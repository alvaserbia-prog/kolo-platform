"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import logoImg from "@/assets/kolo-logo.png";
import Link from "next/link";

function jacina(p: string): { nivo: number; tekst: string; boja: string } {
  if (p.length === 0) return { nivo: 0, tekst: "", boja: "" };
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { nivo: 1, tekst: "Slaba", boja: "bg-red-500" };
  if (score <= 2) return { nivo: 2, tekst: "Srednja", boja: "bg-kolo-gold-400" };
  if (score <= 3) return { nivo: 3, tekst: "Dobra", boja: "bg-kolo-green-500" };
  return { nivo: 4, tekst: "Jaka", boja: "bg-kolo-green-700" };
}

export default function RegistracijaPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", pseudonim: "", password: "", passwordConfirm: "", referralCode: "" });
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

  const lozinkaJacina = jacina(form.password);
  const canSubmit = !loading && uslovi && privatnost && pseudonimStatus !== "zauzet" && pseudonimStatus !== "checking";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.email.includes("@")) { setError("Unesite ispravnu email adresu."); return; }
    if (form.pseudonim.trim().length < 3) { setError("Pseudonim mora imati najmanje 3 karaktera."); return; }
    if (pseudonimStatus === "zauzet") { setError("Ovaj pseudonim je zauzet."); return; }
    if (form.password.length < 8) { setError("Lozinka mora imati najmanje 8 karaktera."); return; }
    if (form.password !== form.passwordConfirm) { setError("Lozinke se ne poklapaju."); return; }
    if (!uslovi || !privatnost) { setError("Morate prihvatiti uslove i politiku privatnosti."); return; }

    setLoading(true);
    const res = await fetch("/api/registracija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, pseudonim: form.pseudonim, password: form.password, referralCode: form.referralCode || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Greška pri registraciji."); return; }

    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    if (result?.error) { router.push("/login?registered=1"); return; }
    router.push("/verifikacija");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6 flex flex-col items-center">
          <Image src={logoImg} alt="KOLO" width={160} height={109} style={{ height: "auto" }} priority />
          <p className="mt-2 text-sm text-gray-500">Registracija novog člana</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-700 transition-colors"
              placeholder="vas@email.com" suppressHydrationWarning />
          </div>

          {/* Pseudonim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pseudonim *</label>
            <div className="relative">
              <input type="text" autoComplete="username" maxLength={30} value={form.pseudonim} onChange={(e) => set("pseudonim", e.target.value)}
                className={`w-full px-4 py-3 pr-9 rounded-xl border text-sm outline-none transition-colors ${
                  pseudonimStatus === "zauzet" ? "border-red-400 focus:border-red-500"
                  : pseudonimStatus === "slobodan" ? "border-kolo-green-500 focus:border-kolo-green-700"
                  : "border-gray-200 focus:border-kolo-green-700"
                }`}
                placeholder="VasePseudonim" suppressHydrationWarning />
              {pseudonimStatus === "checking" && <span className="absolute right-3 top-3.5 text-xs text-gray-400">...</span>}
              {pseudonimStatus === "slobodan" && <span className="absolute right-3 top-3 text-kolo-green-700">✓</span>}
              {pseudonimStatus === "zauzet" && <span className="absolute right-3 top-3 text-red-500">✕</span>}
            </div>
            {pseudonimStatus === "zauzet" && <p className="mt-1 text-xs text-red-500">Ovaj pseudonim je zauzet</p>}
            {pseudonimStatus !== "zauzet" && <p className="mt-1 text-xs text-gray-400">Javno vidljiv, ne prikazuje pravo ime</p>}
          </div>

          {/* Lozinka */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka *</label>
            <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-700 transition-colors"
              placeholder="••••••••" suppressHydrationWarning />
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(n => (
                    <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= lozinkaJacina.nivo ? lozinkaJacina.boja : "bg-gray-100"}`} />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Potvrda lozinke *</label>
            <input type="password" autoComplete="new-password" value={form.passwordConfirm} onChange={(e) => set("passwordConfirm", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                form.passwordConfirm && form.password !== form.passwordConfirm ? "border-red-400" : "border-gray-200 focus:border-kolo-green-700"
              }`}
              placeholder="••••••••" suppressHydrationWarning />
            {form.passwordConfirm && form.password !== form.passwordConfirm && (
              <p className="mt-1 text-xs text-red-500">Lozinke se ne poklapaju</p>
            )}
          </div>

          {/* Referral */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referral kod <span className="text-gray-400 font-normal">(opciono)</span></label>
            <input type="text" value={form.referralCode} onChange={(e) => set("referralCode", e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-700 transition-colors font-mono"
              placeholder="ABCD1234" suppressHydrationWarning />
          </div>

          {/* Checkbox-ovi */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={uslovi} onChange={(e) => setUslovi(e.target.checked)}
                className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
              <span className="text-xs text-gray-600">
                Prihvatam <Link href="/uslovi" target="_blank" className="text-kolo-green-700 underline">Uslove korišćenja</Link>
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={privatnost} onChange={(e) => setPrivatnost(e.target.checked)}
                className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
              <span className="text-xs text-gray-600">
                Prihvatam <Link href="/privatnost" target="_blank" className="text-kolo-green-700 underline">Politiku privatnosti</Link>
              </span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={!canSubmit}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors disabled:opacity-50"
            suppressHydrationWarning>
            {loading ? "Registracija..." : "Registruj se"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Već imate nalog?{" "}
          <Link href="/login" className="text-kolo-green-700 font-medium hover:underline">Prijavite se</Link>
        </p>
      </div>
    </div>
  );
}
