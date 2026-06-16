"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

/**
 * Skener QR kodova preko kamere uređaja.
 * Radi na desktopu i mobilnom (Chrome, Safari, Firefox).
 * Default: zadnja kamera ("environment") — na mobilnom uobičajeno glavna.
 */
type Props = {
  onDetektovan: (token: string) => void;
  onZatvori: () => void;
};

const SKENER_REGION_ID = "kolo-qr-skener-region";

export default function QrSkener({ onDetektovan, onZatvori }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [aktivnaKamera, setAktivnaKamera] = useState<"environment" | "user">(
    "environment"
  );
  const skenerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let cancelled = false;
    const html5 = new Html5Qrcode(SKENER_REGION_ID);
    skenerRef.current = html5;

    html5
      .start(
        { facingMode: aktivnaKamera },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (cancelled) return;
          cancelled = true;
          html5
            .stop()
            .catch(() => {})
            .finally(() => onDetektovan(decodedText.trim()));
        },
        () => {
          // ignore: ovo se zove često (jednom po frame-u kad nema match-a)
        }
      )
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        if (
          msg.includes("NotAllowed") ||
          msg.includes("Permission") ||
          msg.includes("denied")
        ) {
          setError(
            "Nemam dozvolu za pristup kameri. Odobri dozvolu u podešavanjima browser-a."
          );
        } else if (msg.includes("NotFound") || msg.includes("NotReadable")) {
          setError("Kamera nije pronađena ili je zauzeta od drugog programa.");
        } else {
          setError(`Greška kamere: ${msg}`);
        }
      });

    return () => {
      cancelled = true;
      const sk = skenerRef.current;
      if (sk && sk.isScanning) {
        sk.stop().catch(() => {});
      }
    };
  }, [aktivnaKamera, onDetektovan]);

  function preokreni() {
    setAktivnaKamera((c) => (c === "environment" ? "user" : "environment"));
  }

  return (
    <div className="space-y-3">
      <div
        id={SKENER_REGION_ID}
        className="w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-black"
        style={{ aspectRatio: "1 / 1" }}
      />
      {error && (
        <div className="text-sm text-kolo-danger bg-kolo-danger-light border border-kolo-danger-light rounded-xl p-3">
          {error}
        </div>
      )}
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={preokreni}
          className="px-3 py-1.5 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
        >
          Preokreni kameru ({aktivnaKamera === "environment" ? "zadnja" : "prednja"})
        </button>
        <button
          type="button"
          onClick={onZatvori}
          className="px-3 py-1.5 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
        >
          Zatvori skener
        </button>
      </div>
      <p className="text-xs text-kolo-muted text-center">
        Usmeri kameru ka QR kodu osobe koju verifikuješ.
      </p>
    </div>
  );
}
