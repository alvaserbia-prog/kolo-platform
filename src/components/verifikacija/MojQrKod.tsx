"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Token = {
  token: string;
  brojCifara: string;
  expiresAt: string;
};

/**
 * Generiše token za verifikaciju i prikazuje QR + 6-cifren broj + countdown 60s.
 */
export default function MojQrKod() {
  const [token, setToken] = useState<Token | null>(null);
  const [preostalo, setPreostalo] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tikerRef = useRef<NodeJS.Timeout | null>(null);

  async function generisi() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verifikacija/token", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Greška");
        setLoading(false);
        return;
      }
      setToken(data);
    } catch {
      setError("Mreža nije dostupna");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    const exp = new Date(token.expiresAt).getTime();
    const update = () => setPreostalo(Math.max(0, Math.ceil((exp - Date.now()) / 1000)));
    update();
    tikerRef.current = setInterval(update, 1000);
    return () => {
      if (tikerRef.current) clearInterval(tikerRef.current);
    };
  }, [token]);

  const istekao = preostalo === 0 && token !== null;
  const formatBroj = token
    ? `${token.brojCifara.slice(0, 3)} ${token.brojCifara.slice(3)}`
    : null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-black/55 font-semibold mb-4">
        Pokaži kod za verifikaciju
      </div>

      {!token && (
        <>
          <p className="text-sm text-black/70 mb-3">
            Daj nekome ko može da te verifikuje da skenira QR ili da unese 6-cifren broj.
            Kod važi 60 sekundi.
          </p>
          <button
            onClick={generisi}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/85 disabled:opacity-50"
          >
            {loading ? "Generišem..." : "Generiši kod"}
          </button>
        </>
      )}

      {token && !istekao && (
        <div className="space-y-3">
          <div className="text-sm text-black/70">
            Kod važi još: <span className="font-mono font-semibold">{preostalo}s</span>
          </div>
          <div className="flex justify-center bg-white p-4 rounded-xl border border-black/5">
            <QRCodeSVG value={token.token} size={200} />
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-black/55">ili broj</div>
            <div className="text-3xl font-mono font-bold tracking-wider mt-1">{formatBroj}</div>
          </div>
        </div>
      )}

      {istekao && (
        <div className="space-y-3">
          <div className="text-sm text-red-700">Kod je istekao.</div>
          <button
            onClick={generisi}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/85 disabled:opacity-50"
          >
            {loading ? "Generišem..." : "Obnovi kod"}
          </button>
        </div>
      )}

      {error && <div className="mt-3 text-sm text-red-700">{error}</div>}
    </div>
  );
}
