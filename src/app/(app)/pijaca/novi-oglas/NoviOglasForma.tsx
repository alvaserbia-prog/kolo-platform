"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LokacijaSearch from "@/components/LokacijaSearch";

// DB enum values — never change these (they are stored in the database)
const KATEGORIJE_VREDNOSTI = ["Hrana", "Usluge", "Zanati", "Elektronika", "Odeća", "Ostalo"] as const;

// Map a DB category value to its i18n key suffix
function kategorijaKljuc(kat: string): string {
  const map: Record<string, string> = {
    "Hrana": "Hrana",
    "Usluge": "Usluge",
    "Zanati": "Zanati",
    "Elektronika": "Elektronika",
    "Odeća": "Odeca",
    "Ostalo": "Ostalo",
  };
  return map[kat] ?? "Ostalo";
}

const MAX_IMAGES = 5;

export default function NoviOglasForma({ defaultLocation = "" }: { defaultLocation?: string }) {
  const t = useTranslations("pijaca");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [phone, setPhone] = useState("");
  const [slike, setSlike] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uspeh, setUspeh] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const combined = [...slike, ...files].slice(0, MAX_IMAGES);
    for (const f of combined) {
      if (f.size > 5 * 1024 * 1024) { setError(t("slika_prevelika")); return; }
    }
    setSlike(combined);
    setError("");
  }

  function ukloniSliku(i: number) {
    setSlike((prev) => prev.filter((_, idx) => idx !== i));
  }

  const canSubmit = title.trim().length >= 3 && Number(price) > 0 && category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const priceNum = Math.floor(Number(price));
    if (isNaN(priceNum) || priceNum <= 0) { setError(t("cena_greska_unos")); return; }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("price", String(priceNum));
      fd.append("category", category);
      fd.append("location", location.trim());
      fd.append("phone", phone.trim());
      slike.forEach((f, i) => fd.append(`slika_${i}`, f));

      const res = await fetch("/api/pijaca", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? t("greska_objavljivanje")); return; }
      // Potvrda + redirect na Pijacu (ne direktno na detalj oglasa).
      setUspeh(true);
      setTimeout(() => router.push("/pijaca"), 1800);
    } catch {
      setError(t("greska_slanje"));
    } finally {
      setLoading(false);
    }
  }

  if (uspeh) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-full bg-kolo-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-kolo-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="kolo-naslov">{t("uspeh_naslov")}</h1>
        <p className="text-sm text-kolo-muted">{t("uspeh_opis")}</p>
        <button
          onClick={() => router.push("/pijaca")}
          className="px-6 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors"
        >
          {t("uspeh_dugme")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-kolo-muted hover:text-kolo-muted transition-colors">
          {t("nazad")}
        </button>
        <h1 className="kolo-naslov">{t("novi_oglas_naslov")}</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Naslov */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("naslov_required")}</label>
          <input
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("naslov_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
        </div>

        {/* Opis */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("opis_label")}</label>
          <textarea
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("opis_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none transition-colors"
          />
        </div>

        {/* Cena */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("cena_required")}</label>
          <input
            type="number"
            min={1}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="500"
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm font-mono outline-none focus:border-kolo-green-500 transition-colors"
          />
        </div>

        {/* Kategorija */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">{t("kategorija_label")}</label>
          <div className="flex flex-wrap gap-2">
            {KATEGORIJE_VREDNOSTI.map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setCategory(kat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  category === kat
                    ? "bg-kolo-green-700 text-white"
                    : "bg-white border border-kolo-border text-kolo-muted hover:border-kolo-muted"
                }`}
              >
                {t(`kategorija_${kategorijaKljuc(kat)}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Lokacija */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("lokacija_label")} <span className="text-kolo-muted font-normal">{t("lokacija_opciono")}</span>
          </label>
          <LokacijaSearch value={location} onChange={setLocation} placeholder={t("lokacija_placeholder")} />
        </div>

        {/* Kontakt telefon */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("kontakt_telefon")} <span className="text-kolo-muted font-normal">{t("lokacija_opciono")}</span>
          </label>
          <input
            type="tel"
            maxLength={20}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("kontakt_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
        </div>

        {/* Slike */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            {t("slike_label")} <span className="text-kolo-muted font-normal">{t("slike_do", { max: MAX_IMAGES })}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {slike.map((f, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl border border-kolo-border overflow-hidden bg-kolo-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => ukloniSliku(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {slike.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-kolo-border flex flex-col items-center justify-center text-kolo-muted hover:border-kolo-muted transition-colors text-xl"
              >
                +
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </div>

        {error && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
        >
          {loading ? t("objavljivanje") : t("objavi_oglas")}
        </button>
      </form>
    </div>
  );
}
