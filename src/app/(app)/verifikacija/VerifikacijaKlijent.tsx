"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

  if (request?.status === "PENDING") {
    return <PendingEkran createdAt={request.createdAt} />;
  }

  return (
    <VerifikacijaForma
      rejected={request?.status === "REJECTED" ? request.rejectionReason : null}
      onSuccess={() => router.refresh()}
    />
  );
}

// ── Kompresija slike na klijentu ──────────────────────────────────────────────

async function kompresujSliku(file: File, maxSizeKB = 800): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      const MAX_DIM = 1600;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
        else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          if (blob.size <= maxSizeKB * 1024 || quality <= 0.3) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            quality -= 0.1;
            tryCompress();
          }
        }, "image/jpeg", quality);
      };
      tryCompress();
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// ── Forma za unos JMBG i upload LK fotografija ────────────────────────────────

function VerifikacijaForma({
  rejected,
  onSuccess,
}: {
  rejected: string | null | undefined;
  onSuccess: () => void;
}) {
  const t = useTranslations("verifikacija");
  const [jmbg, setJmbg] = useState("");
  const [jmbgError, setJmbgError] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [pristanak, setPristanak] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleJmbg(val: string) {
    const clean = val.replace(/\D/g, "").slice(0, 13);
    setJmbg(clean);
    if (clean.length > 0 && clean.length < 13) setJmbgError(t("jmbg_greska"));
    else setJmbgError("");
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: File | null) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) { setter(null); return; }
    const compressed = await kompresujSliku(file);
    setter(compressed);
  }

  const canSubmit = jmbg.length === 13 && !jmbgError && idFront && idBack && pristanak;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("jmbg", jmbg);
      fd.append("pristanak", "true");
      fd.append("idFront", idFront!);
      fd.append("idBack", idBack!);

      const res = await fetch("/api/verifikacija", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t("greska_slanje")); return; }
      onSuccess();
    } catch {
      setError(t("greska_slanje"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="kolo-naslov">{t("naslov")}</h1>
        <p className="mt-1 text-sm text-kolo-muted">
          {t("podnaslov", { iznos: "1.000 POEN" })}
        </p>
      </div>

      {rejected && (
        <div className="bg-kolo-danger-light border border-kolo-danger/20 rounded-2xl p-4">
          <p className="text-sm font-semibold text-kolo-danger mb-1">{t("odbijen_naslov")}</p>
          <p className="text-sm text-red-500">{rejected}</p>
          <p className="text-xs text-kolo-danger mt-2">{t("odbijen_ispravite")}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* JMBG */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("jmbg")}</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder={t("jmbg_placeholder")}
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
            <p className="mt-1 text-xs text-kolo-green-700">{t("jmbg_ispravan")}</p>
          )}
          <p className="mt-1 text-xs text-kolo-muted">
            Verifikacija se obavlja uvođenjem JMBG-a i fotografijama lične karte. Vaši podaci neće biti deljeni sa trećim stranama.
          </p>
        </div>

        {/* Fotografija prednje strane LK */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("prednja_strana")}
          </label>
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            idFront ? "border-kolo-green-500 bg-kolo-green-100/30" : "border-kolo-border hover:border-kolo-green-500"
          }`}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e, setIdFront)}
            />
            {idFront ? (
              <span className="text-sm text-kolo-green-700 font-medium">{idFront.name}</span>
            ) : (
              <span className="text-sm text-kolo-muted">{t("foto_napomena")}</span>
            )}
          </label>
        </div>

        {/* Fotografija zadnje strane LK */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("zadnja_strana")}
          </label>
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            idBack ? "border-kolo-green-500 bg-kolo-green-100/30" : "border-kolo-border hover:border-kolo-green-500"
          }`}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e, setIdBack)}
            />
            {idBack ? (
              <span className="text-sm text-kolo-green-700 font-medium">{idBack.name}</span>
            ) : (
              <span className="text-sm text-kolo-muted">{t("foto_napomena")}</span>
            )}
          </label>
        </div>

        {/* Pristanak za obradu podataka */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={pristanak}
            onChange={(e) => setPristanak(e.target.checked)}
            className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0"
          />
          <span className="text-xs text-kolo-muted">
            Dajem izričit pristanak za obradu JMBG podataka i fotografija lične karte u svrhu verifikacije identiteta, u skladu sa{" "}
            <Link href="/privatnost" target="_blank" className="text-kolo-green-700 underline">
              Politikom privatnosti
            </Link>
            .
          </span>
        </label>

        {error && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
        >
          {loading ? t("dugme_loading") : t("dugme")}
        </button>
      </form>

      <p className="text-center text-sm text-kolo-muted">
        <Link href="/dashboard" className="hover:text-kolo-muted transition-colors">
          {t("preskoci")}
        </Link>
      </p>
    </div>
  );
}

// ── Ekran čekanja ──────────────────────────────────────────────────────────────

function PendingEkran({ createdAt }: { createdAt: string }) {
  const t = useTranslations("verifikacija");
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-kolo-gold-100 flex items-center justify-center mx-auto mb-5 text-4xl">
          ⏰
        </div>
        <h2 className="text-xl font-bold text-kolo-text mb-2">{t("pending_naslov")}</h2>
        <p className="text-sm text-kolo-muted mb-1">{t("pending_opis")}</p>
        <p className="text-xs text-kolo-muted mb-6">{t("pending_vreme")}</p>
        <div className="bg-kolo-bg rounded-xl px-4 py-3 text-xs text-kolo-muted mb-6">
          {t("pending_poslato")} {new Date(createdAt).toLocaleDateString("sr-RS", {
            day: "2-digit", month: "long", year: "numeric",
          })}
        </div>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
        >
          {t("na_pocetnu")}
        </Link>
      </div>
    </div>
  );
}
