"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LokacijaSearch from "@/components/LokacijaSearch";
import CenaUnos from "@/components/CenaUnos";
import { parsirajCenu, type CenaTip } from "@/lib/cena-oglas";

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
const MAX_SIZE = 5 * 1024 * 1024;
// Najveća dimenzija (px) na koju smanjujemo sliku pre uploada. Fotografije sa
// telefona su često 4000×3000 i 4–12MB — bez ovoga bi premašile limit od 5MB.
const MAX_DIM = 1600;

// Smanji i kompresuj sliku u browseru (canvas → JPEG). Vraća original ako
// kompresija nije moguća (npr. nepodržan format). Time fotografije sa telefona
// pouzdano stanu ispod limita, a upload je brži na mobilnom internetu.
async function kompresujSliku(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      bitmap = await createImageBitmap(file);
    }
    let { width, height } = bitmap;
    if (width > MAX_DIM || height > MAX_DIM) {
      const scale = Math.min(MAX_DIM / width, MAX_DIM / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) { bitmap.close?.(); return file; }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.82)
    );
    if (!blob || blob.size >= file.size) return file;
    const naziv = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], naziv, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function NoviOglasForma({ defaultLocation = "" }: { defaultLocation?: string }) {
  const t = useTranslations("pijaca");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cenaTip, setCenaTip] = useState<CenaTip>("FIKSNA");
  const [price, setPrice] = useState("");
  const [cenaDo, setCenaDo] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [phone, setPhone] = useState("");
  const [slike, setSlike] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [obrada, setObrada] = useState(false);
  const [error, setError] = useState("");
  const [uspeh, setUspeh] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const izabrane = Array.from(e.target.files ?? []);
    // Reset vrednosti inputa: na mobilnom ponovni izbor iste slike inače ne okine onChange.
    e.target.value = "";
    if (izabrane.length === 0) return;

    const slobodno = MAX_IMAGES - slike.length;
    if (slobodno <= 0) return;

    setObrada(true);
    setError("");
    try {
      const obradjene = await Promise.all(izabrane.slice(0, slobodno).map(kompresujSliku));
      const validne = obradjene.filter((f) => f.size <= MAX_SIZE);
      if (validne.length < obradjene.length) setError(t("slika_prevelika"));
      if (validne.length > 0) setSlike((prev) => [...prev, ...validne].slice(0, MAX_IMAGES));
    } finally {
      setObrada(false);
    }
  }

  function ukloniSliku(i: number) {
    setSlike((prev) => prev.filter((_, idx) => idx !== i));
  }

  const cena = parsirajCenu(cenaTip, price, cenaDo);
  const canSubmit = title.trim().length >= 3 && cena.ok && category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (!cena.ok) { setError(cena.error ?? t("cena_greska_unos")); return; }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("cenaTip", cenaTip);
      fd.append("price", price);
      fd.append("cenaDo", cenaDo);
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
        <CenaUnos
          cenaTip={cenaTip}
          setCenaTip={setCenaTip}
          price={price}
          setPrice={setPrice}
          cenaDo={cenaDo}
          setCenaDo={setCenaDo}
          t={t}
        />

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
                disabled={obrada}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-kolo-border flex flex-col items-center justify-center text-kolo-muted hover:border-kolo-muted transition-colors text-xl disabled:opacity-50"
              >
                {obrada ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                  </svg>
                ) : (
                  "+"
                )}
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
          disabled={!canSubmit || loading || obrada}
          className="w-full py-3.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
        >
          {loading ? t("objavljivanje") : t("objavi_oglas")}
        </button>
      </form>
    </div>
  );
}
