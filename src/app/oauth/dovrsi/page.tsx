"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OAuthDovrsiPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [pseudonim, setPseudonim] = useState("");
  const [pseudonimStatus, setPseudonimStatus] = useState<"idle" | "checking" | "slobodan" | "zauzet">("idle");
  const [uslovi, setUslovi] = useState(false);
  const [privatnost, setPrivatnost] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Redirect ako nalog nije oauthPending
  useEffect(() => {
    if (session && !session.user.oauthPending) {
      router.replace("/sistem");
    }
  }, [session, router]);

  // Live provera pseudonima
  useEffect(() => {
    const p = pseudonim.trim();
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
  }, [pseudonim]);

  const canSubmit = !loading && uslovi && privatnost && pseudonimStatus === "slobodan";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pseudonim.trim().length < 3) { setError("Pseudonim mora imati najmanje 3 karaktera."); return; }
    if (pseudonimStatus === "zauzet") { setError("Ovaj pseudonim je zauzet."); return; }
    if (!uslovi || !privatnost) { setError("Morate prihvatiti uslove i politiku privatnosti."); return; }

    setLoading(true);
    const res = await fetch("/api/oauth/dovrsi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudonim: pseudonim.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Greška. Pokušajte ponovo."); return; }

    // Osveži sesiju da se oauthPending postavi na false
    await update();
    try { sessionStorage.setItem("kolo-welcome", "1"); } catch { /* nedostupan */ }
    router.push("/dobrodosli");
  }

  // Čekanje na sesiju ILI redirect (ako je nalog već dovršen, prikaži loading dok se redirektuje)
  if (!session || !session.user.oauthPending) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-8 text-center text-kolo-muted text-sm">
          Učitavanje...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-8">
        <div className="mb-7">
          <h1 className="text-xl font-bold text-kolo-text">Još jedan korak</h1>
          <p className="mt-1 text-sm text-kolo-muted">Izaberite pseudonim za vaš KOLO nalog</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4" suppressHydrationWarning>
          {/* Pseudonim */}
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">Pseudonim *</label>
            <div className="relative">
              <input
                type="text"
                autoComplete="username"
                maxLength={30}
                value={pseudonim}
                onChange={(e) => setPseudonim(e.target.value)}
                className={`w-full px-4 py-3 pr-9 rounded-xl border text-sm outline-none transition-colors ${
                  pseudonimStatus === "zauzet" ? "border-red-400 focus:border-red-500"
                  : pseudonimStatus === "slobodan" ? "border-kolo-green-500 focus:border-kolo-green-700"
                  : "border-kolo-border focus:border-kolo-green-700"
                }`}
                placeholder="VasePseudonim"
                suppressHydrationWarning
              />
              {pseudonimStatus === "checking" && <span className="absolute right-3 top-3.5 text-xs text-kolo-muted">...</span>}
              {pseudonimStatus === "slobodan" && <span className="absolute right-3 top-3 text-kolo-green-700">✓</span>}
              {pseudonimStatus === "zauzet" && <span className="absolute right-3 top-3 text-red-500">✕</span>}
            </div>
            {pseudonimStatus === "zauzet" && <p className="mt-1 text-xs text-red-500">Ovaj pseudonim je zauzet</p>}
            {pseudonimStatus !== "zauzet" && <p className="mt-1 text-xs text-kolo-muted">Javno vidljiv, ne prikazuje pravo ime</p>}
          </div>

          {/* Checkbox-ovi */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={uslovi} onChange={(e) => setUslovi(e.target.checked)}
                className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
              <span className="text-xs text-kolo-muted">
                Prihvatam <a href="/uslovi" target="_blank" className="text-kolo-green-700 underline">Uslove korišćenja</a>
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={privatnost} onChange={(e) => setPrivatnost(e.target.checked)}
                className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
              <span className="text-xs text-kolo-muted">
                Prihvatam <a href="/privatnost" target="_blank" className="text-kolo-green-700 underline">Politiku privatnosti</a>
              </span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors disabled:opacity-50"
            suppressHydrationWarning
          >
            {loading ? "Čuvanje..." : "Završi registraciju"}
          </button>
        </form>
      </div>
    </div>
  );
}
