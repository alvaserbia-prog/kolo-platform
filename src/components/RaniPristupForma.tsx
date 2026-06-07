"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RaniPristupForma() {
  const router = useRouter();
  const [kod, setKod] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!kod.trim()) {
      setError("Unesi pristupni kod.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rani-pristup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kod: kod.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Pristup nije moguć.");
        return;
      }

      // Otključano — vodi na prijavu (callback nazad na početnu posle login-a).
      router.push("/login");
      router.refresh();
    } catch {
      setError("Greška u komunikaciji sa serverom. Pokušaj ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1.5">
          Pristupni kod
        </label>
        <input
          type="text"
          value={kod}
          onChange={(e) => setKod(e.target.value)}
          autoComplete="off"
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/40 text-sm outline-none focus:border-kolo-gold-400 transition-colors"
          placeholder="Unesi kod koji si dobio/la"
        />
      </div>

      {error && (
        <p className="text-sm text-white bg-kolo-danger/80 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-kolo-gold-600 text-white text-sm font-semibold hover:bg-kolo-gold-400 transition-colors disabled:opacity-60"
      >
        {loading ? "Provera…" : "Uđi"}
      </button>
    </form>
  );
}
