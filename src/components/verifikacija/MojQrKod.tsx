"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import UspehKartica from "@/components/UspehKartica";

// qrcode.react (deljen chunk sa html5-qrcode, ~361KB) — lenjo: QR se crta tek kad
// korisnik generiše kod, pa ne ulazi u početni bundle verifikacije.
const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), {
  ssr: false,
});

type Token = {
  token: string;
  brojCifara: string;
  expiresAt: string;
};

type MojIndeks = {
  tip: string;
  indeks: number;
  brojVerifikacijaObavljenih: number;
};

/**
 * Generiše token za verifikaciju i prikazuje QR + 6-cifren broj + countdown (2 sata).
 * Polluje moj-indeks endpoint i pokazuje obaveštenje kad se verifikacija desi.
 */
function formatPreostalo(sekundi: number): string {
  const h = Math.floor(sekundi / 3600);
  const m = Math.floor((sekundi % 3600) / 60);
  const s = sekundi % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}
export default function MojQrKod() {
  const t = useTranslations("verifikacija");
  const router = useRouter();
  // `update()` forsira refetch JWT-a iz baze (auth.ts preskače 5-min interval na
  // "update" trigger) — bez ovoga bi tek verifikovan korisnik do 5 min i dalje
  // bio "neverifikovan" (nema postavljanja oglasa) dok se ne izloguje/uloguje.
  const { update: osveziSesiju } = useSession();
  const osveziRef = useRef<Promise<unknown> | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  const [preostalo, setPreostalo] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obavestenje, setObavestenje] = useState<string | null>(null);
  const [indeksPriUspehu, setIndeksPriUspehu] = useState<number | null>(null);
  const tikerRef = useRef<NodeJS.Timeout | null>(null);
  const pollerRef = useRef<NodeJS.Timeout | null>(null);
  const pocetniRef = useRef<MojIndeks | null>(null);

  async function generisi() {
    setLoading(true);
    setError(null);
    setObavestenje(null);
    try {
      const res = await fetch("/api/verifikacija/token", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("greska_opsta"));
        setLoading(false);
        return;
      }
      setToken(data);
      // Snimi početni indeks da bismo detektovali promenu
      const indeksRes = await fetch("/api/verifikacija/moj-indeks");
      if (indeksRes.ok) {
        pocetniRef.current = await indeksRes.json();
      }
    } catch {
      setError(t("greska_mreza"));
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

  // Polling: kad se indeks ili tip promeni → verifikacija se desila
  useEffect(() => {
    if (!token || obavestenje) return;
    pollerRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/verifikacija/moj-indeks");
        if (!res.ok) return;
        const sada: MojIndeks = await res.json();
        const pocetak = pocetniRef.current;
        if (
          pocetak &&
          (sada.tip !== pocetak.tip || sada.indeks > pocetak.indeks)
        ) {
          setIndeksPriUspehu(sada.indeks);
          setObavestenje("uspeh");
          if (pollerRef.current) clearInterval(pollerRef.current);
          // Odmah upiši nov verified status u sesiju (JWT cookie) i osveži
          // serverske komponente (sidebar, gejtovi) — korisnik ne mora re-login.
          osveziRef.current = osveziSesiju()
            .then(() => router.refresh())
            .catch(() => {});
        }
      } catch {
        // ignoriši mrežne greške u pollingu
      }
    }, 2000);
    return () => {
      if (pollerRef.current) clearInterval(pollerRef.current);
    };
  }, [token, obavestenje, router, osveziSesiju]);

  const istekao = preostalo === 0 && token !== null && !obavestenje;
  const formatBroj = token
    ? `${token.brojCifara.slice(0, 3)} ${token.brojCifara.slice(3)}`
    : null;

  if (obavestenje) {
    return (
      <UspehKartica
        naslov={t("qr_uspeh_naslov")}
        opis={
          <>
            {t("qr_uspeh_opis", { indeks: indeksPriUspehu ?? 10 })}
          </>
        }
        dugmeTekst={t("qr_uspeh_dugme")}
        onDugme={async () => {
          // Sačekaj da osvežena sesija stigne u cookie pre navigacije — inače bi
          // munjevit klik odveo na Pijacu sa još starim (neverifikovanim) JWT-om.
          if (osveziRef.current) await osveziRef.current;
          router.push("/pijaca");
        }}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-4">
        {t("qr_naslov")}
      </div>

      {!token && (
        <>
          <p className="text-sm text-kolo-muted mb-3">
            {t("qr_uputstvo")}
          </p>
          <button
            onClick={generisi}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900 disabled:opacity-50"
          >
            {loading ? t("qr_generisem") : t("qr_generisi")}
          </button>
        </>
      )}

      {token && !istekao && (
        <div className="space-y-3">
          <div className="text-sm text-kolo-muted">
            {t("qr_vazi_jos")} <span className="font-mono font-semibold">{formatPreostalo(preostalo)}</span>
          </div>
          <div className="flex justify-center bg-white p-4 rounded-xl border border-kolo-border">
            <QRCodeSVG value={token.token} size={200} />
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-kolo-muted">{t("qr_ili_broj")}</div>
            <div className="text-3xl font-mono font-bold tracking-wider mt-1">{formatBroj}</div>
          </div>
        </div>
      )}

      {istekao && (
        <div className="space-y-3">
          <div className="text-sm text-kolo-danger">{t("qr_istekao")}</div>
          <button
            onClick={generisi}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900 disabled:opacity-50"
          >
            {loading ? t("qr_generisem") : t("qr_obnovi")}
          </button>
        </div>
      )}

      {error && <div className="mt-3 text-sm text-kolo-danger">{error}</div>}
    </div>
  );
}
