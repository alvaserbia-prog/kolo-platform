"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dinamički import — html5-qrcode koristi DOM i ne sme da se izvršava na serveru
const QrSkener = dynamic(() => import("./QrSkener"), { ssr: false });

type Mod = "izbor" | "skener" | "broj";

/**
 * Forma za izvršavanje verifikacije.
 * Korisnik bira između skeniranja kamerom ili ručnog unosa 6-cifrenog broja.
 */
export default function VerifikujNekoga({ mozeDaVerifikuje }: { mozeDaVerifikuje: boolean }) {
  const router = useRouter();
  const [mod, setMod] = useState<Mod>("izbor");
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
    const ocisceno = tokenIliBroj.replace(/\s+/g, "");
    setLoading(true);
    try {
      const res = await fetch("/api/verifikacija", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: ocisceno, potvrdaPrisustva: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Greška");
        return;
      }
      setUspeh(`Verifikacija evidentirana: @${data.verifikovaniPseudonim} (indeks +10%)`);
      setTokenIliBroj("");
      setPotvrdjeno(false);
      setMod("izbor");
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

      {mod === "izbor" && (
        <>
          <p className="text-sm text-black/70 mb-3">
            Reci osobi da otvori KOLO → Verifikacija → &quot;Generiši kod&quot;. Izaberi način:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMod("skener")}
              className="px-4 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/85"
            >
              Skeniraj QR kamerom
            </button>
            <button
              type="button"
              onClick={() => setMod("broj")}
              className="px-4 py-3 rounded-xl bg-black/5 hover:bg-black/10 text-sm font-medium"
            >
              Unesi 6-cifren broj
            </button>
          </div>
          {uspeh && <div className="mt-3 text-sm text-emerald-700">{uspeh}</div>}
        </>
      )}

      {mod === "skener" && (
        <>
          <QrSkener
            onDetektovan={(token) => {
              setTokenIliBroj(token);
              setMod("broj"); // posle skena prelazimo na potvrdni ekran
            }}
            onZatvori={() => setMod("izbor")}
          />
        </>
      )}

      {mod === "broj" && (
        <form onSubmit={posaji} className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            value={tokenIliBroj}
            onChange={(e) => setTokenIliBroj(e.target.value)}
            placeholder="384 729 ili pun token"
            className="w-full px-3 py-2 rounded-xl border border-black/15 text-base font-mono tracking-wider"
            autoFocus
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
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !potvrdjeno || tokenIliBroj.trim().length < 6}
              className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/85 disabled:opacity-50"
            >
              {loading ? "Šaljem..." : "Potvrdi verifikaciju"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMod("izbor");
                setError(null);
              }}
              className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-sm font-medium"
            >
              Nazad
            </button>
          </div>
          {error && <div className="text-sm text-red-700">{error}</div>}
        </form>
      )}
    </div>
  );
}
