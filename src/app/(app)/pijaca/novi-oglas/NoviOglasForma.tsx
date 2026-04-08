"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const KATEGORIJE = ["Hrana", "Usluge", "Zanati", "Elektronika", "Odeća", "Ostalo"];
const MAX_IMAGES = 5;

export default function NoviOglasForma() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [slike, setSlike] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const combined = [...slike, ...files].slice(0, MAX_IMAGES);
    for (const f of combined) {
      if (f.size > 5 * 1024 * 1024) { setError("Slika je prevelika (max 5MB)."); return; }
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
    if (isNaN(priceNum) || priceNum <= 0) { setError("Unesite ispravnu cenu."); return; }

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

      if (!res.ok) { setError(data.error ?? "Greška pri objavljivanju."); return; }
      router.push(`/pijaca/${data.id}`);
    } catch {
      setError("Greška pri slanju. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Nazad
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Novi oglas</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Naslov */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Naslov *</label>
          <input
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="npr. Domaći med — lipa"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
          />
        </div>

        {/* Opis */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Opis</label>
          <textarea
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opišite šta nudite..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 resize-none transition-colors"
          />
        </div>

        {/* Cena */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cena (POEN) *</label>
          <input
            type="number"
            min={1}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="500"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono outline-none focus:border-green-600 transition-colors"
          />
        </div>

        {/* Kategorija */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kategorija *</label>
          <div className="flex flex-wrap gap-2">
            {KATEGORIJE.map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setCategory(kat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  category === kat
                    ? "bg-green-700 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* Lokacija */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lokacija <span className="text-gray-400 font-normal">(opciono)</span></label>
          <input
            type="text"
            maxLength={60}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="npr. Novi Sad"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
          />
        </div>

        {/* Kontakt telefon */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kontakt telefon <span className="text-gray-400 font-normal">(opciono)</span></label>
          <input
            type="tel"
            maxLength={20}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="npr. 064 123 4567"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
          />
        </div>

        {/* Slike */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Slike <span className="text-gray-400 font-normal">(do {MAX_IMAGES}, opciono)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {slike.map((f, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
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
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors text-xl"
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
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Objavljivanje..." : "Objavi oglas"}
        </button>
      </form>
    </div>
  );
}
