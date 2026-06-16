"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useTranslations } from "next-intl";
import PageOpis from "@/components/PageOpis";
import Pseudonim from "@/components/Pseudonim";


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
  const t = useTranslations("novcanik");
  const [filter, setFilter] = useState<Filter>("sve");
  const [showSend, setShowSend] = useState(!!platiPseudonim);
  const [showQR, setShowQR] = useState(false);

  const filtered = transakcije.filter((tx) => {
    if (filter === "primljeno") return tx.primio && tx.type === "TRANSFER";
    if (filter === "poslato") return !tx.primio && tx.type === "TRANSFER";
    if (filter === "emisije") return tx.type !== "TRANSFER";
    return true;
  });

  return (
    <div className="space-y-6">
      <PageOpis>
        {t("opis_stranice")}
      </PageOpis>

      {/* Balans kartica — upola uža, poravnata desno */}
      <div className="bg-gradient-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-6 text-white shadow-lg lg:w-1/2 lg:ml-auto">
        <p className="text-sm text-white/70 mb-1">{t("vase_stanje")}</p>
        <p className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">{balance.toLocaleString("sr-RS")}</p>
        <p className="text-lg text-white/70 mt-0.5">POEN</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowSend(true)}
            className="px-5 py-2 bg-white text-kolo-green-700 text-sm font-semibold rounded-xl hover:bg-kolo-green-100 transition-colors"
          >
            {t("posalji_poen")}
          </button>
          <button
            onClick={() => setShowQR(true)}
            className="px-5 py-2 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
          >
            {t("moj_qr")}
          </button>
        </div>
      </div>

      {/* Forma za upis POEN-a */}
      {showSend && (
        <SendForma
          onClose={() => setShowSend(false)}
          onSuccess={() => { setShowSend(false); window.dispatchEvent(new Event("balans-updated")); router.refresh(); }}
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
          <h2 className="text-base font-semibold text-kolo-muted">{t("istorija_transakcija")}</h2>
        </div>

        {/* Filteri */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {([
            ["sve", t("filter_sve")],
            ["primljeno", t("filter_primljeno")],
            ["poslato", t("filter_poslato")],
            ["emisije", t("filter_emisije")],
          ] as [Filter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
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
          transakcije.length === 0 ? (
            // Sasvim nov korisnik — bez ijedne transakcije: navedi ga šta dalje
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center space-y-2">
              <p className="text-sm font-medium text-kolo-text">{t("prazno_naslov")}</p>
              <p className="text-sm text-kolo-muted max-w-md mx-auto">
                {t("prazno_opis")}
              </p>
              <a href="/tabla-jemstva" className="inline-block mt-1 text-sm font-semibold text-kolo-green-700 hover:underline">
                {t("prazno_verif_link")}
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
              {t("nema_tx_kategorija")}
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
            {/* Zaglavlje tabele — desktop */}
            <div className="hidden sm:grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 px-4 py-2 border-b border-kolo-border bg-kolo-bg">
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_vreme")}</span>
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_posiljac")}</span>
              <span />
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_primalac")}</span>
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide text-right">{t("col_iznos")}</span>
            </div>
            {filtered.map((t, i) => (
              <div
                key={t.id}
                className={`px-4 py-2.5 ${i < filtered.length - 1 ? "border-b border-kolo-border" : ""}`}
              >
                {/* Desktop prikaz */}
                <div className="hidden sm:grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 items-center">
                  {/* Vreme */}
                  <p className="text-sm text-kolo-muted leading-tight">
                    {new Date(t.createdAt).toLocaleString("sr-RS", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  {/* Pošiljalac */}
                  <div className="min-w-0">
                    {t.primio ? (
                      t.drugiId ? (
                        <a href={`/profil/${t.drugiId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
                          <Pseudonim>{t.drugiPseudonim}</Pseudonim>
                        </a>
                      ) : (
                        <span className="text-base text-kolo-muted truncate block"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
                      )
                    ) : (
                      <span className="text-base text-kolo-text font-medium truncate block"><Pseudonim>{pseudonim}</Pseudonim></span>
                    )}
                  </div>
                  {/* Strelica */}
                  <span className="text-base font-bold text-kolo-muted text-center leading-none">→</span>
                  {/* Primalac */}
                  <div className="min-w-0">
                    {t.primio ? (
                      <span className="text-base text-kolo-text font-medium truncate block"><Pseudonim>{pseudonim}</Pseudonim></span>
                    ) : (
                      t.drugiId ? (
                        <a href={`/profil/${t.drugiId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
                          <Pseudonim>{t.drugiPseudonim}</Pseudonim>
                        </a>
                      ) : (
                        <span className="text-base text-kolo-muted truncate block"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
                      )
                    )}
                  </div>
                  {/* Iznos */}
                  <span className={`text-base font-bold text-right ${t.primio ? "text-kolo-green-700" : "text-red-500"}`}>
                    {t.primio ? "+" : "−"}{t.amount.toLocaleString("sr-RS")}
                  </span>
                </div>
                {/* Desktop opis */}
                {t.description && (
                  <p className="hidden sm:block mt-0.5 text-xs text-kolo-muted/70 pl-[9.75rem] truncate">{t.description}</p>
                )}

                {/* Mobilna kompaktna kartica */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm min-w-0">
                        {t.primio ? (
                          t.drugiId ? (
                            <a href={`/profil/${t.drugiId}`} className="text-kolo-green-700 hover:underline truncate">
                              <Pseudonim>{t.drugiPseudonim}</Pseudonim>
                            </a>
                          ) : (
                            <span className="text-kolo-muted truncate"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
                          )
                        ) : (
                          <span className="text-kolo-text font-medium truncate"><Pseudonim>{pseudonim}</Pseudonim></span>
                        )}
                        <span className="text-kolo-muted shrink-0">→</span>
                        {t.primio ? (
                          <span className="text-kolo-text font-medium truncate"><Pseudonim>{pseudonim}</Pseudonim></span>
                        ) : (
                          t.drugiId ? (
                            <a href={`/profil/${t.drugiId}`} className="text-kolo-green-700 hover:underline truncate">
                              <Pseudonim>{t.drugiPseudonim}</Pseudonim>
                            </a>
                          ) : (
                            <span className="text-kolo-muted truncate"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
                          )
                        )}
                      </div>
                      <p className="text-xs text-kolo-muted mt-0.5">
                        {new Date(t.createdAt).toLocaleString("sr-RS", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className={`text-sm font-bold text-right shrink-0 ${t.primio ? "text-kolo-green-700" : "text-red-500"}`}>
                      {t.primio ? "+" : "−"}{t.amount.toLocaleString("sr-RS")}
                    </span>
                  </div>
                  {t.description && (
                    <p className="mt-1 text-xs text-kolo-muted/70 truncate">{t.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Forma za upis POEN-a ──────────────────────────────────────────────────────

function SendForma({ onClose, onSuccess, initialPseudonim, initialIznos, initialOpis }: { onClose: () => void; onSuccess: () => void; initialPseudonim?: string; initialIznos?: string; initialOpis?: string }) {
  const t = useTranslations("novcanik");
  const tc = useTranslations("common");
  const [pseudonim, setPseudonim] = useState(initialPseudonim ?? "");
  const [amount, setAmount] = useState(initialIznos ?? "");
  const [description, setDescription] = useState(initialOpis ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sugestije, setSugestije] = useState<string[]>([]);
  const [showSugestije, setShowSugestije] = useState(false);
  const [aktivniIndex, setAktivniIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

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
    setAktivniIndex(-1);
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
    setAktivniIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSugestije || sugestije.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const novi = Math.min(aktivniIndex + 1, sugestije.length - 1);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const novi = Math.max(aktivniIndex - 1, 0);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (aktivniIndex >= 0 && aktivniIndex < sugestije.length) {
        e.preventDefault();
        odaberi(sugestije[aktivniIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSugestije(false);
      setAktivniIndex(-1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!pseudonim.trim()) { setError(t("send_greska_pseudonim")); return; }
    const iznos = parseInt(amount, 10);
    if (!amount || isNaN(iznos) || iznos <= 0) { setError(t("send_greska_iznos")); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudonim: pseudonim.trim(), amount: iznos, description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t("send_greska")); return; }
      onSuccess();
    } catch {
      setError(t("send_greska"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-kolo-muted">{t("send_naslov")}</h2>
        <button onClick={onClose} className="text-kolo-muted hover:text-kolo-muted text-xl leading-none">×</button>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="relative" ref={wrapperRef}>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("send_pseudonim")}</label>
          <input
            type="text"
            value={pseudonim}
            onChange={(e) => handlePseudonimChange(e.target.value)}
            onFocus={() => pseudonim.length >= 2 && setShowSugestije(true)}
            onKeyDown={handleKeyDown}
            placeholder={t("send_pseudonim_placeholder")}
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
          {showSugestije && sugestije.length > 0 && (
            <ul ref={listaRef} className="absolute z-20 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg overflow-hidden">
              {sugestije.map((ps, i) => (
                <li key={ps}>
                  <button
                    type="button"
                    onMouseDown={() => odaberi(ps)}
                    onMouseEnter={() => setAktivniIndex(i)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      i === aktivniIndex
                        ? "bg-kolo-green-100 text-kolo-green-800"
                        : "text-kolo-muted hover:bg-kolo-green-50 hover:text-kolo-green-700"
                    }`}
                  >
                    {ps}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("send_iznos")}</label>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("send_iznos_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">
            {t("send_opis")} <span className="text-kolo-muted font-normal">({tc("opciono")})</span>
          </label>
          <input
            type="text"
            maxLength={100}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("send_opis_placeholder")}
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
            {tc("otkazi")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
          >
            {loading ? t("send_dugme_loading") : t("send_dugme")}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── QR modal ──────────────────────────────────────────────────────────────────

function QRModal({ pseudonim, memberHash, onClose }: { pseudonim: string; memberHash: string; onClose: () => void }) {
  const t = useTranslations("novcanik");
  const tc = useTranslations("common");
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://ekolo.rs";
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
        <h3 className="text-base font-semibold text-kolo-text">{t("qr_naslov")}</h3>
        <p className="text-sm text-kolo-muted">{t("qr_opis")}</p>

        <div className="space-y-2 text-left">
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{t("qr_iznos")} <span className="text-kolo-border font-normal">({tc("opciono")})</span></label>
            <input
              type="number"
              min={1}
              step={1}
              value={iznos}
              onChange={(e) => setIznos(e.target.value)}
              placeholder={t("qr_placeholder_iznos")}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{tc("opis")} <span className="text-kolo-border font-normal">({tc("opciono")})</span></label>
            <input
              type="text"
              maxLength={100}
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              placeholder={t("qr_placeholder_opis")}
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
        <p className="text-sm font-semibold text-kolo-green-700 font-mono"><Pseudonim>{pseudonim}</Pseudonim></p>
        <div className="flex gap-2">
          <button
            onClick={kopiraj}
            className="flex-1 py-2.5 rounded-xl border border-kolo-border text-kolo-muted text-sm font-medium hover:bg-kolo-bg transition-colors"
          >
            {t("qr_kopiraj")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors"
          >
            {tc("zatvori")}
          </button>
        </div>
      </div>
    </div>
  );
}
