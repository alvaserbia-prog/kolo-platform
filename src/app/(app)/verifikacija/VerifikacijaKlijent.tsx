"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Kompresuje sliku na max 1200px, JPEG 80% — tipično <200KB
async function kompresujSliku(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Kompresija nije uspela")), "image/jpeg", 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Učitavanje slike nije uspelo")); };
    img.src = url;
  });
}

type VerStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Props {
  request: {
    status: VerStatus;
    rejectionReason: string | null;
    createdAt: string;
  } | null;
}

export default function VerifikacijaKlijent({ request }: Props) {
  const router = useRouter();

  // Ako je na čekanju — prikaži pending ekran
  if (request?.status === "PENDING") {
    return <PendingEkran createdAt={request.createdAt} />;
  }

  // Forma (nova ili ponovni pokušaj posle odbijanja)
  return (
    <VerifikacijaForma
      rejected={request?.status === "REJECTED" ? request.rejectionReason : null}
      onSuccess={() => router.refresh()}
    />
  );
}

// ── Forma za upload ────────────────────────────────────────────────────────────

function VerifikacijaForma({
  rejected,
  onSuccess,
}: {
  rejected: string | null | undefined;
  onSuccess: () => void;
}) {
  const [jmbg, setJmbg] = useState("");
  const [jmbgError, setJmbgError] = useState("");
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  function handleJmbg(val: string) {
    const clean = val.replace(/\D/g, "").slice(0, 13);
    setJmbg(clean);
    if (clean.length > 0 && clean.length < 13) setJmbgError("JMBG mora imati 13 cifara");
    else setJmbgError("");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Fotografija je prevelika (max 5MB)."); return; }
    if (side === "front") setFront(file);
    else setBack(file);
    setError("");
  }

  const canSubmit = front && back && jmbg.length === 13 && !jmbgError;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(""); setLoading(true);

    try {
      const [frontBlob, backBlob] = await Promise.all([
        kompresujSliku(front!),
        kompresujSliku(back!),
      ]);

      const fd = new FormData();
      fd.append("jmbg", jmbg);
      fd.append("front", new File([frontBlob], "front.jpg", { type: "image/jpeg" }));
      fd.append("back", new File([backBlob], "back.jpg", { type: "image/jpeg" }));

      const res = await fetch("/api/verifikacija", { method: "POST", body: fd });
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
    <div className="max-w-md mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-kolo-text">Verifikacija identiteta</h1>
        <p className="mt-1 text-sm text-kolo-muted">
          Verifikacijom dobijate pristup celom sistemu i bonus od{" "}
          <span className="font-semibold text-kolo-green-700">1.000 POEN</span>.
        </p>
      </div>

      {rejected && (
        <div className="bg-kolo-danger-light border border-kolo-danger/20 rounded-2xl p-4">
          <p className="text-sm font-semibold text-kolo-danger mb-1">Zahtev je odbijen</p>
          <p className="text-sm text-red-500">{rejected}</p>
          <p className="text-xs text-kolo-danger mt-2">Ispravite navedeni problem i pošaljite ponovo.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Upload fotografija */}
        <div>
          <p className="text-sm font-semibold text-kolo-muted mb-3">Fotografija lične karte</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Prednja strana", file: front, ref: frontRef, side: "front" as const },
              { label: "Zadnja strana", file: back, ref: backRef, side: "back" as const },
            ].map(({ label, file, ref, side }) => (
              <button
                key={side}
                type="button"
                onClick={() => ref.current?.click()}
                className={`p-5 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-colors ${
                  file
                    ? "border-kolo-green-500 bg-kolo-green-100"
                    : "border-kolo-border bg-white hover:border-kolo-muted"
                }`}
              >
                {file ? (
                  <>
                    <span className="text-xl">✓</span>
                    <span className="text-xs font-medium text-kolo-green-700 text-center truncate w-full">{file.name}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">📷</span>
                    <span className="text-xs text-kolo-muted text-center">{label}</span>
                  </>
                )}
              </button>
            ))}
          </div>
          <input ref={frontRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "front")} />
          <input ref={backRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "back")} />
          <p className="mt-2 text-xs text-kolo-muted">JPG, PNG ili WebP. Maksimalno 5MB po fotografiji.</p>
        </div>

        {/* JMBG */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">JMBG</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="13 cifara"
            value={jmbg}
            onChange={(e) => handleJmbg(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-center text-lg font-mono tracking-widest outline-none transition-colors ${
              jmbgError
                ? "border-red-400 focus:border-red-500"
                : jmbg.length === 13
                ? "border-kolo-green-500 focus:border-kolo-green-500"
                : "border-kolo-border focus:border-kolo-green-500"
            }`}
          />
          {jmbgError && <p className="mt-1 text-xs text-red-500">{jmbgError}</p>}
          {jmbg.length === 13 && !jmbgError && (
            <p className="mt-1 text-xs text-kolo-green-700">✓ Format ispravan</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
        >
          {loading ? "Šaljem..." : "Pošalji na verifikaciju"}
        </button>
      </form>

      <p className="text-center text-sm text-kolo-muted">
        <Link href="/dashboard" className="hover:text-kolo-muted transition-colors">
          Preskoči za sada →
        </Link>
      </p>
    </div>
  );
}

// ── Ekran čekanja ──────────────────────────────────────────────────────────────

function PendingEkran({ createdAt }: { createdAt: string }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-kolo-gold-100 flex items-center justify-center mx-auto mb-5 text-4xl">
          ⏰
        </div>
        <h2 className="text-xl font-bold text-kolo-text mb-2">Zahtev je poslat</h2>
        <p className="text-sm text-kolo-muted mb-1">Dokumentacija je primljena i čeka pregled.</p>
        <p className="text-xs text-kolo-muted mb-6">Obično traje 1–3 radna dana.</p>
        <div className="bg-kolo-bg rounded-xl px-4 py-3 text-xs text-kolo-muted mb-6">
          Poslato: {new Date(createdAt).toLocaleDateString("sr-RS", {
            day: "2-digit", month: "long", year: "numeric",
          })}
        </div>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
        >
          Na početnu
        </Link>
      </div>
    </div>
  );
}
