"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

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
  TRANSFER: "bg-kolo-bg text-kolo-muted",
  EMISIJA_VERIFIKACIJA: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_PREPORUKA: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_DONACIJA: "bg-kolo-gold-100 text-kolo-gold-600",
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
  drugiId: string | null;
  createdAt: string;
};

type Filter = "sve" | "primljeno" | "poslato" | "emisije";

interface Props {
  balance: number;
  pseudonim: string;
  memberHash: string;
  transakcije: Transakcija[];
  platiPseudonim?: string;
  prefillIznos?: string;
  prefillOpis?: string;
}

export default function NovcanikKlijent({ balance, pseudonim, memberHash, transakcije, platiPseudonim, prefillIznos, prefillOpis }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("sve");
  const [showSend, setShowSend] = useState(!!platiPseudonim);
  const [showQR, setShowQR] = useState(false);

  const filtered = transakcije.filter((t) => {
    if (filter === "primljeno") return t.primio && t.type === "TRANSFER";
    if (filter === "poslato") return !t.primio && t.type === "TRANSFER";
    if (filter === "emisije") return t.type !== "TRANSFER";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Balans kartica */}
      <div className="bg-gradient-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-sm text-white/70 mb-1">Vaše stanje</p>
        <p className="text-4xl font-bold font-mono tracking-tight">{balance.toLocaleString("sr-RS")}</p>
        <p className="text-lg text-white/70 mt-0.5">POEN</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowSend(true)}
            className="px-6 py-3 bg-white text-kolo-green-700 text-base font-semibold rounded-xl hover:bg-kolo-green-100 transition-colors"
          >
            Pošalji POEN
          </button>
          <button
            onClick={() => setShowQR(true)}
            className="px-6 py-3 bg-white/20 text-white text-base font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
          >
            Moj QR
          </button>
        </div>
      </div>

      {/* Forma za slanje */}
      {showSend && (
        <SendForma
          onClose={() => setShowSend(false)}
          onSuccess={() => { setShowSend(false); router.refresh(); }}
          initialPseudonim={platiPseudonim}
          initialIznos={prefillIznos}
          initialOpis={prefillOpis}
        />
      )}

      {/* QR modal */}
      {showQR && (
        <QRModal pseudonim={pseudonim} memberHash={memberHash} onClose={() => setShowQR(false)} />
      )}

      {/* Istorija transakcija */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-kolo-muted">Istorija transakcija</h2>
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
                  ? "bg-kolo-green-700 text-white"
                  : "bg-white border border-kolo-border text-kolo-muted hover:text-kolo-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
            Nema transakcija u ovoj kategoriji.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
            {filtered.map((t, i) => (
              <div
                key={t.id}
                className={`px-4 py-3 flex justify-between items-start ${i < filtered.length - 1 ? "border-b border-kolo-border" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${TIP_BOJA[t.type] ?? "bg-kolo-bg text-kolo-muted"}`}>
                      {TIP_LABELA[t.type] ?? t.type}
                    </span>
                    {t.drugiId ? (
                      <a href={`/profil/${t.drugiId}`} className="text-xs text-kolo-green-700 hover:underline truncate">
                        {t.drugiPseudonim}
                      </a>
                    ) : (
                      <span className="text-xs text-kolo-muted truncate">{t.drugiPseudonim}</span>
                    )}
                  </div>
                  {t.description && (
                    <p className="text-xs text-kolo-muted mt-0.5 truncate">{t.description}</p>
                  )}
                  <p className="text-xs text-kolo-border mt-0.5">
                    {new Date(t.createdAt).toLocaleString("sr-RS", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className={`ml-4 text-sm font-bold shrink-0 ${t.primio ? "text-kolo-green-700" : "text-red-500"}`}>
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

function SendForma({ onClose, onSuccess, initialPseudonim, initialIznos, initialOpis }: { onClose: () => void; onSuccess: () => void; initialPseudonim?: string; initialIznos?: string; initialOpis?: string }) {
  const [pseudonim, setPseudonim] = useState(initialPseudonim ?? "");
  const [amount, setAmount] = useState(initialIznos ?? "");
  const [description, setDescription] = useState(initialOpis ?? "");
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
      setSugestije((data as { pseudonim: string }[]).map((u) => u.pseudonim));
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
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonim: pseudonim.trim(), amount: iznos, description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška pri slanju."); return; }
      onSuccess();
    } catch {
      setError("Greška pri slanju. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-kolo-muted">Pošalji POEN</h2>
        <button onClick={onClose} className="text-kolo-muted hover:text-kolo-muted text-xl leading-none">×</button>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="relative" ref={wrapperRef}>
          <label className="block text-sm font-medium text-kolo-muted mb-1">Pseudonim primaoca</label>
          <input
            type="text"
            value={pseudonim}
            onChange={(e) => handlePseudonimChange(e.target.value)}
            onFocus={() => pseudonim.length >= 2 && setShowSugestije(true)}
            placeholder="npr. MilanPetrovic"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
          {showSugestije && sugestije.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg overflow-hidden">
              {sugestije.map((ps) => (
                <li key={ps}>
                  <button
                    type="button"
                    onMouseDown={() => odaberi(ps)}
                    className="w-full text-left px-4 py-2.5 text-sm text-kolo-muted hover:bg-kolo-green-100 hover:text-kolo-green-700 transition-colors"
                  >
                    {ps}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">Iznos (POEN)</label>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">
            Opis <span className="text-kolo-muted font-normal">(opciono)</span>
          </label>
          <input
            type="text"
            maxLength={100}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Za šta šaljete..."
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
        </div>
        {error && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium hover:bg-kolo-border transition-colors"
          >
            Otkaži
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
          >
            {loading ? "Šaljem..." : "Pošalji"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── QR modal ──────────────────────────────────────────────────────────────────

function QRModal({ pseudonim, memberHash, onClose }: { pseudonim: string; memberHash: string; onClose: () => void }) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://kolo.rs";
  const [iznos, setIznos] = useState("");
  const [opis, setOpis] = useState("");

  function buildQrValue() {
    if (memberHash) {
      const params = new URLSearchParams();
      if (iznos && parseInt(iznos) > 0) params.set("amount", iznos);
      if (opis.trim()) params.set("opis", opis.trim());
      const qs = params.toString();
      return `${baseUrl}/m/${memberHash}${qs ? `?${qs}` : ""}`;
    } else {
      const params = new URLSearchParams({ plati: pseudonim });
      if (iznos && parseInt(iznos) > 0) params.set("iznos", iznos);
      if (opis.trim()) params.set("description", opis.trim());
      return `${baseUrl}/novcanik?${params.toString()}`;
    }
  }

  const qrValue = buildQrValue();

  function kopiraj() {
    navigator.clipboard.writeText(qrValue).catch(() => {});
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 space-y-4 text-center">
        <h3 className="text-base font-semibold text-kolo-text">Moj QR za prijem</h3>
        <p className="text-sm text-kolo-muted">
          Pokažite ovaj kod da biste primili POEN. Skenirajte telefonom.
        </p>

        <div className="space-y-2 text-left">
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">Iznos POEN <span className="text-kolo-border font-normal">(opciono)</span></label>
            <input
              type="number"
              min={1}
              step={1}
              value={iznos}
              onChange={(e) => setIznos(e.target.value)}
              placeholder="npr. 500"
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">Opis <span className="text-kolo-border font-normal">(opciono)</span></label>
            <input
              type="text"
              maxLength={100}
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              placeholder="npr. Za kafu"
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-center p-4 bg-white rounded-xl border border-kolo-border">
          <QRCodeSVG
            value={qrValue}
            size={180}
            fgColor="#1B6B3A"
            bgColor="#FFFFFF"
            level="M"
          />
        </div>
        <p className="text-sm font-semibold text-kolo-green-700 font-mono">{pseudonim}</p>
        <div className="flex gap-2">
          <button
            onClick={kopiraj}
            className="flex-1 py-2.5 rounded-xl border border-kolo-border text-kolo-muted text-sm font-medium hover:bg-kolo-bg transition-colors"
          >
            Kopiraj link
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
}
