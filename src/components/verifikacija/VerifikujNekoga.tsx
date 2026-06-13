"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Pseudonim from "@/components/Pseudonim";

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
      <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
        <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-2">
          Verifikuj nekoga
        </div>
        <p className="text-sm text-kolo-muted">
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
      setError("Moraš potvrditi lično poznavanje i odgovornost.");
      return;
    }
    const ocisceno = tokenIliBroj.replace(/\s+/g, "");
    setLoading(true);
    try {
      const res = await fetch("/api/verifikacija", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: ocisceno, potvrdaPoznavanja: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Greška");
        return;
      }
      setUspeh(data.verifikovaniPseudonim);
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
    <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-3">
        Verifikuj nekoga
      </div>

      {mod === "izbor" && (
        <>
          <p className="text-sm text-kolo-muted mb-3">
            Reci osobi da otvori KOLO → Verifikacija → &quot;Generiši kod&quot;. Izaberi način:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMod("skener")}
              className="px-4 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900"
            >
              Skeniraj QR kamerom
            </button>
            <button
              type="button"
              onClick={() => setMod("broj")}
              className="px-4 py-3 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
            >
              Unesi 6-cifren broj
            </button>
          </div>
          {uspeh && <div className="mt-3 text-sm text-kolo-green-700">Verifikacija evidentirana: @<Pseudonim>{uspeh}</Pseudonim> (indeks +10%)</div>}
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
            className="w-full px-3 py-2 rounded-xl border border-kolo-border text-base font-mono tracking-wider outline-none focus:border-kolo-green-500 transition-colors"
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
              Potvrđujem da ovu osobu poznajem lično i da svojom odgovornošću jemčim za
              njenu stvarnost, jedinstvenost i kontinuitet (čl. 5 Pravilnika o dokazu
              stvarnosti).
            </span>
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !potvrdjeno || tokenIliBroj.trim().length < 6}
              className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900 disabled:opacity-50"
            >
              {loading ? "Šaljem..." : "Potvrdi verifikaciju"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMod("izbor");
                setError(null);
              }}
              className="px-4 py-2 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
            >
              Nazad
            </button>
          </div>
          {error && <div className="text-sm text-kolo-danger">{error}</div>}
        </form>
      )}
    </div>
  );
}
