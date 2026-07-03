"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";
import UspehKartica from "@/components/UspehKartica";

// qrcode.react se deli sa html5-qrcode u isti veliki chunk (~361KB). Učitava se
// LENJO — QR se prikazuje tek kad korisnik otvori karticu za upis POEN-a, pa ne
// opterećuje početni bundle Novčanika.
const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), {
  ssr: false,
});

// Skener kamere (html5-qrcode ~200KB) — učitava se LENJO, tek kad kupac otvori
// skener za plaćanje. Deli isti chunk sa skenerom u verifikaciji.
const QrSkener = dynamic(() => import("@/components/verifikacija/QrSkener"), {
  ssr: false,
});

interface Props {
  balance: number;
  pseudonim: string;
  memberHash: string;
  zrnoSlobodno: number;
  zrnoKurs: number;
  platiPseudonim?: string;
  prefillIznos?: string;
  prefillOpis?: string;
}

export default function NovcanikKartice({ balance, pseudonim, memberHash, zrnoSlobodno, zrnoKurs, platiPseudonim, prefillIznos, prefillOpis }: Props) {
  const router = useRouter();
  const t = useTranslations("novcanik");
  const [showSend, setShowSend] = useState(!!platiPseudonim);
  const [showQR, setShowQR] = useState(false);
  const [showSkener, setShowSkener] = useState(false);

  return (
    <>
      {/* Gornje kartice: balans (ZRNO kartica privremeno sklonjena dok ZRNO ne bude aktuelno) */}
      <div className="grid grid-cols-1 gap-6 items-stretch">
        {/* ZRNO kartica PRIVREMENO SKLONJENA — vratiti kad ZRNO postane aktuelno.
            Tada vratiti i `lg:grid-cols-2` na grid iznad.
        <div className="bg-white rounded-2xl border border-kolo-border p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="text-left min-w-0">
            <p className="text-4xl sm:text-5xl font-bold text-kolo-text tabular-nums break-words">
              {zrnoSlobodno.toLocaleString("sr-RS")}
            </p>
            <p className="text-lg text-kolo-muted mt-0.5">ZRNO</p>
          </div>

          <div className="text-center min-w-0">
            <p className="text-xs text-kolo-muted">{t("zrno_koeficijent_label")}</p>
            <p className="text-base font-semibold text-kolo-text tabular-nums">
              {zrnoKurs.toLocaleString("sr-RS")}
            </p>
            <p className="text-[10px] text-kolo-muted">POEN/ZRNO</p>
          </div>

          <Link
            href="/zrno"
            className="shrink-0 px-5 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-800 transition-colors"
          >
            {t("zrno_otpis_dugme")}
          </Link>
        </div>
        */}

        {/* DESNO — balans kartica: dugmad levo (jedno ispod drugog), stanje veliko desno */}
        <div className="bg-gradient-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between gap-4">
          {/* LEVO — dugmad jedno ispod drugog */}
          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={() => setShowSend(true)}
              className="px-5 py-2 bg-white text-kolo-green-700 text-sm font-semibold rounded-xl hover:bg-kolo-green-100 transition-colors"
            >
              {t("posalji_poen")}
            </button>
            <button
              onClick={() => setShowSkener(true)}
              className="px-5 py-2 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
            >
              {t("skeniraj_dugme")}
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="px-5 py-2 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
            >
              {t("moj_qr")}
            </button>
          </div>

          {/* DESNO — stanje veliko */}
          <div className="text-right min-w-0">
            <p className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums break-words">
              {balance.toLocaleString("sr-RS")}
            </p>
            <p className="text-lg text-white/70 mt-0.5">POEN</p>
          </div>
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

      {/* Skener za plaćanje (kupac skenira QR prodavca) */}
      {showSkener && (
        <SkenerModal onClose={() => setShowSkener(false)} />
      )}
    </>
  );
}

// ── Skener modal (kupac skenira QR prodavca i plaća) ──────────────────────────

function SkenerModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("novcanik");
  const router = useRouter();
  const [greska, setGreska] = useState("");

  function handleDetektovan(tekst: string) {
    setGreska("");
    // QR prodavca kodira URL: .../m/<hash>?amount=..&opis=..  ili
    // .../novcanik?plati=<pseudonim>&iznos=..&description=..
    // Kupac skenira → vodimo ga kroz isti tok plaćanja (formu za upis POEN-a).
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://ekolo.rs";
    let putanja: string | null = null;
    try {
      const url = new URL(tekst.trim(), baseUrl);
      if (url.pathname.startsWith("/m/") || url.pathname.startsWith("/novcanik")) {
        putanja = url.pathname + url.search;
      }
    } catch {
      // nije validan URL
    }
    if (!putanja) {
      setGreska(t("skener_greska_qr"));
      return;
    }
    onClose();
    router.push(putanja);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-kolo-text">{t("skener_naslov")}</h3>
          <button onClick={onClose} className="text-kolo-muted hover:text-kolo-text text-xl leading-none">×</button>
        </div>
        <p className="text-sm text-kolo-muted">{t("skener_opis")}</p>
        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
        )}
        <QrSkener
          onDetektovan={handleDetektovan}
          onZatvori={onClose}
          uputstvo={t("skener_uputstvo")}
        />
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
  const [uspeh, setUspeh] = useState<{ iznos: number; pseudonim: string } | null>(null);
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
      setUspeh({ iznos, pseudonim: pseudonim.trim() });
    } catch {
      setError(t("send_greska"));
    } finally {
      setLoading(false);
    }
  }

  if (uspeh) {
    return (
      <UspehKartica
        naslov={t("send_uspeh_naslov")}
        opis={t("send_uspeh_opis", { iznos: uspeh.iznos.toLocaleString("sr-RS"), pseudonim: uspeh.pseudonim })}
        dugmeTekst={t("send_uspeh_dugme")}
        onDugme={onSuccess}
      />
    );
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
