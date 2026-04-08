"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const TIP_LABELA: Record<string, string> = {
  TRANSFER: "Transfer",
  EMISIJA_VERIFIKACIJA: "Verifikacija",
  EMISIJA_PREPORUKA: "Preporuka",
  EMISIJA_DONACIJA: "Donacija",
  EMISIJA_POKROVITELJ: "Pokrovitelj",
  EMISIJA_ZADRUGA_OSNIVANJE: "Osnivanje zadruge",
  EMISIJA_ZADRUGA_BONUS: "Bonus zadruge",
  EMISIJA_PROGRAM: "Program",
};

const TIP_BOJA: Record<string, string> = {
  TRANSFER: "bg-gray-100 text-gray-600",
  EMISIJA_VERIFIKACIJA: "bg-green-50 text-green-700",
  EMISIJA_PREPORUKA: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_DONACIJA: "bg-amber-50 text-amber-700",
  EMISIJA_POKROVITELJ: "bg-kolo-gold-100 text-kolo-gold-600",
  EMISIJA_ZADRUGA_OSNIVANJE: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_ZADRUGA_BONUS: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_PROGRAM: "bg-kolo-green-100 text-kolo-green-700",
};

type Transakcija = {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  primio: boolean;
  drugiPseudonim: string;
  createdAt: string;
};

type Filter = "sve" | "primljeno" | "poslato" | "emisije";

interface Props {
  balance: number;
  pseudonim: string;
  transakcije: Transakcija[];
}

export default function NovcanikKlijent({ balance, pseudonim, transakcije }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("sve");
  const [showSend, setShowSend] = useState(false);

  const filtered = transakcije.filter((t) => {
    if (filter === "primljeno") return t.primio && t.type === "TRANSFER";
    if (filter === "poslato") return !t.primio && t.type === "TRANSFER";
    if (filter === "emisije") return t.type !== "TRANSFER";
    return true;
  });

  return (
    <div className="max-w-xl space-y-6">
      {/* Balans kartica */}
      <div className="bg-gradient-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-sm text-green-200 mb-1">Vaše stanje</p>
        <p className="text-4xl font-bold font-mono tracking-tight">{balance.toLocaleString("sr-RS")}</p>
        <p className="text-lg text-green-300 mt-0.5">POEN</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowSend(true)}
            className="px-5 py-2 bg-white text-green-700 text-sm font-semibold rounded-xl hover:bg-green-50 transition-colors"
          >
            Pošalji POEN
          </button>
        </div>
      </div>

      {/* Forma za slanje */}
      {showSend && (
        <SendForma
          onClose={() => setShowSend(false)}
          onSuccess={() => { setShowSend(false); router.refresh(); }}
        />
      )}

      {/* Istorija transakcija */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-gray-700">Istorija transakcija</h2>
        </div>

        {/* Filteri */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {([
            ["sve", "Sve"],
            ["primljeno", "Primljeno"],
            ["poslato", "Poslato"],
            ["emisije", "Emisije"],
          ] as [Filter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === key
                  ? "bg-green-700 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">
            Nema transakcija u ovoj kategoriji.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {filtered.map((t, i) => (
              <div
                key={t.id}
                className={`px-4 py-3 flex justify-between items-start ${i < filtered.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${TIP_BOJA[t.type] ?? "bg-gray-100 text-gray-600"}`}>
                      {TIP_LABELA[t.type] ?? t.type}
                    </span>
                    <span className="text-xs text-gray-400 truncate">{t.drugiPseudonim}</span>
                  </div>
                  {t.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{t.description}</p>
                  )}
                  <p className="text-xs text-gray-300 mt-0.5">
                    {new Date(t.createdAt).toLocaleString("sr-RS", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className={`ml-4 text-sm font-bold shrink-0 ${t.primio ? "text-green-700" : "text-red-500"}`}>
                  {t.primio ? "+" : "−"}{t.amount.toLocaleString("sr-RS")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Forma za slanje ────────────────────────────────────────────────────────────

function SendForma({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [pseudonim, setPseudonim] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sugestije, setSugestije] = useState<string[]>([]);
  const [showSugestije, setShowSugestije] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSugestije(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePseudonimChange(val: string) {
    setPseudonim(val);
    setShowSugestije(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSugestije([]); return; }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/korisnici/pretraga?q=${encodeURIComponent(val.trim())}`);
      const data = await res.json();
      setSugestije(data.rezultati ?? []);
    }, 250);
  }

  function odaberi(ps: string) {
    setPseudonim(ps);
    setSugestije([]);
    setShowSugestije(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!pseudonim.trim()) { setError("Unesite pseudonim primaoca."); return; }
    const iznos = parseInt(amount, 10);
    if (!amount || isNaN(iznos) || iznos <= 0) { setError("Iznos mora biti pozitivan ceo broj."); return; }

    setLoading(true);
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudonim: pseudonim.trim(), amount: iznos, description: description.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Greška pri slanju."); return; }
    onSuccess();
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-700">Pošalji POEN</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="relative" ref={wrapperRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pseudonim primaoca</label>
          <input
            type="text"
            value={pseudonim}
            onChange={(e) => handlePseudonimChange(e.target.value)}
            onFocus={() => pseudonim.length >= 2 && setShowSugestije(true)}
            placeholder="npr. MilanPetrovic"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
          />
          {showSugestije && sugestije.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {sugestije.map((ps) => (
                <li key={ps}>
                  <button
                    type="button"
                    onMouseDown={() => odaberi(ps)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    {ps}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Iznos (POEN)</label>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opis <span className="text-gray-400 font-normal">(opciono)</span>
          </label>
          <input
            type="text"
            maxLength={100}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Za šta šaljete..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Otkaži
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Šaljem..." : "Pošalji"}
          </button>
        </div>
      </form>
    </div>
  );
}
