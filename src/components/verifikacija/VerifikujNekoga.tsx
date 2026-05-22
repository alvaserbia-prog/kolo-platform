"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Forma za izvršavanje verifikacije.
 * MVP: unos 6-cifrenog broja ili full token-a (kamera/QR skener — kasnije).
 */
export default function VerifikujNekoga({ mozeDaVerifikuje }: { mozeDaVerifikuje: boolean }) {
  const router = useRouter();
  const [tokenIliBroj, setTokenIliBroj] = useState("");
  const [potvrdjeno, setPotvrdjeno] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uspeh, setUspeh] = useState<string | null>(null);

  if (!mozeDaVerifikuje) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="text-sm uppercase tracking-wide text-black/55 font-semibold mb-2">
          Verifikuj nekoga
        </div>
        <p className="text-sm text-black/70">
          Nemaš pravo da verifikuješ druge. Razlog: nisi verifikovan, indeks ti je ispod 10%,
          ili nemaš slobodan slot (pričekaj nadzor).
        </p>
      </div>
    );
  }

  async function posaji(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUspeh(null);
    if (!potvrdjeno) {
      setError("Moraš potvrditi fizičko prisustvo.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/verifikacija", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: tokenIliBroj.trim(), potvrdaPrisustva: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Greška");
        return;
      }
      setUspeh(`Verifikacija evidentirana: @${data.verifikovaniPseudonim} (indeks +10%)`);
      setTokenIliBroj("");
      setPotvrdjeno(false);
      router.refresh();
    } catch {
      setError("Mreža nije dostupna");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-black/55 font-semibold mb-3">
        Verifikuj nekoga
      </div>
      <p className="text-sm text-black/70 mb-3">
        Reci osobi da otvori KOLO → Verifikacija → &quot;Pokaži kod&quot;. Unesi 6-cifren broj
        koji ti diktira (ili pun token iz QR-a).
      </p>
      <form onSubmit={posaji} className="space-y-3">
        <input
          type="text"
          inputMode="numeric"
          value={tokenIliBroj}
          onChange={(e) => setTokenIliBroj(e.target.value)}
          placeholder="384729 ili pun token"
          className="w-full px-3 py-2 rounded-xl border border-black/15 text-base font-mono tracking-wider"
          required
        />
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={potvrdjeno}
            onChange={(e) => setPotvrdjeno(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Potvrđujem da poznajem ovu osobu lično i da sam u njenom fizičkom prisustvu
            (čl. 5 Pravilnika o dokazu stvarnosti).
          </span>
        </label>
        <button
          type="submit"
          disabled={loading || !potvrdjeno || tokenIliBroj.trim().length < 6}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/85 disabled:opacity-50"
        >
          {loading ? "Šaljem..." : "Potvrdi verifikaciju"}
        </button>
        {error && <div className="text-sm text-red-700">{error}</div>}
        {uspeh && <div className="text-sm text-emerald-700">{uspeh}</div>}
      </form>
    </div>
  );
}
