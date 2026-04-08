"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OsnivanjeForma() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [osnivaci, setOsnivaci] = useState<{ id: string; pseudonim: string }[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [sugestije, setSugestije] = useState<{ id: string; pseudonim: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSugestije([]);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(val: string) {
    setSearchQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSugestije([]); return; }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/korisnici/pretraga?q=${encodeURIComponent(val.trim())}`);
      const data = await res.json();
      // Filtriraj već dodane
      const dodatiIds = new Set(osnivaci.map((o) => o.id));
      const filtered = (data.rezultati as string[])
        .filter((ps: string) => !dodatiIds.has(ps))
        .map((ps: string) => ({ id: ps, pseudonim: ps }));
      setSugestije(filtered);
    }, 250);
  }

  function dodajOsnivaoca(ps: string) {
    if (osnivaci.find((o) => o.pseudonim === ps)) return;
    if (osnivaci.length >= 9) return; // max 9 + inicijator = 10
    setOsnivaci((prev) => [...prev, { id: ps, pseudonim: ps }]);
    setSearchQ("");
    setSugestije([]);
  }

  function ukloniOsnivaoca(ps: string) {
    setOsnivaci((prev) => prev.filter((o) => o.pseudonim !== ps));
  }

  const canSubmit = name.trim().length >= 3 && osnivaci.length >= 4;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await fetch("/api/zadruge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          location: location.trim(),
          osnivaci: osnivaci.map((o) => o.pseudonim),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      router.push("/zajednica");
    } catch {
      setError("Greška pri slanju. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/zajednica" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Zadruge</Link>
        <h1 className="text-2xl font-semibold text-gray-900">Osnivanje zadruge</h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700">
        Potrebno je najmanje <strong>5 verifikovanih članova</strong> (vi + 4 osnivača). Admin UO odobrava osnivanje.
        Po odobrenju zadruga dobija <strong>50.000 POEN</strong> (Čl. 37).
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-white rounded-2xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Naziv zadruge *</label>
          <input type="text" maxLength={80} value={name} onChange={(e) => setName(e.target.value)}
            placeholder="npr. Zadruga Sunce"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Opis <span className="text-gray-400 font-normal">(opciono)</span></label>
          <textarea rows={3} maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Kratki opis ciljeva i delatnosti zadruge..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 resize-none transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sedište <span className="text-gray-400 font-normal">(opciono)</span></label>
          <input type="text" maxLength={60} value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="npr. Novi Sad"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Osnivači * <span className="text-gray-400 font-normal">({osnivaci.length + 1}/min 5 — vi ste prvi)</span>
          </label>

          {/* Dodati osnivači */}
          {osnivaci.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {osnivaci.map((o) => (
                <div key={o.pseudonim} className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm text-green-800 font-medium">{o.pseudonim}</span>
                  <button type="button" onClick={() => ukloniOsnivaoca(o.pseudonim)}
                    className="text-green-400 hover:text-green-700 text-sm leading-none">×</button>
                </div>
              ))}
            </div>
          )}

          {/* Pretraga */}
          <div className="relative" ref={searchRef}>
            <input type="text" value={searchQ} onChange={(e) => handleSearch(e.target.value)}
              placeholder="Pretraži po pseudonimu..."
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors" />
            {sugestije.length > 0 && (
              <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {sugestije.map((s) => (
                  <li key={s.pseudonim}>
                    <button type="button" onMouseDown={() => dodajOsnivaoca(s.pseudonim)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      {s.pseudonim}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        <button type="submit" disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-50">
          {loading ? "Šaljem zahtev..." : "Pošalji zahtev za osnivanje"}
        </button>
      </form>
    </div>
  );
}
