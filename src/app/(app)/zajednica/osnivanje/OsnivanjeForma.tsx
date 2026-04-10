"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LokacijaSearch from "@/components/LokacijaSearch";

function generisiIme(location: string) {
  return location.trim() ? `KOLO Zadruga ${location.trim()}` : "";
}

interface Props {
  userLocation: string | null;
}

export default function OsnivanjeForma({ userLocation }: Props) {
  const router = useRouter();
  const [location, setLocation] = useState(userLocation ?? "");
  const [name, setName] = useState(generisiIme(userLocation ?? ""));
  const [nameEdited, setNameEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [osnivaci, setOsnivaci] = useState<{ id: string; pseudonim: string }[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [sugestije, setSugestije] = useState<{ id: string; pseudonim: string }[]>([]);
  const [aktivniIndex, setAktivniIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const sugestijeRef = useRef<HTMLUListElement>(null);

  // Auto-generisi ime kad se lokacija promeni (osim ako je korisnik već ručno izmenio)
  useEffect(() => {
    if (!nameEdited) {
      setName(generisiIme(location));
    }
  }, [location, nameEdited]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSugestije([]);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(val: string) {
    setSearchQ(val);
    setAktivniIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setSugestije([]); return; }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/korisnici/pretraga?q=${encodeURIComponent(val.trim())}`);
      const data: { id: string; pseudonim: string }[] = await res.json();
      const dodatiPseudonimi = new Set(osnivaci.map((o) => o.pseudonim));
      const filtered = data.filter((u) => !dodatiPseudonimi.has(u.pseudonim));
      setSugestije(filtered);
    }, 250);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (sugestije.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAktivniIndex((prev) => {
        const next = prev < sugestije.length - 1 ? prev + 1 : 0;
        sugestijeRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAktivniIndex((prev) => {
        const next = prev > 0 ? prev - 1 : sugestije.length - 1;
        sugestijeRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (aktivniIndex >= 0 && sugestije[aktivniIndex]) {
        dodajOsnivaoca(sugestije[aktivniIndex]);
      }
    } else if (e.key === "Escape") {
      setSugestije([]);
      setAktivniIndex(-1);
    }
  }

  function dodajOsnivaoca(u: { id: string; pseudonim: string }) {
    if (osnivaci.find((o) => o.pseudonim === u.pseudonim)) return;
    if (osnivaci.length >= 9) return;
    setOsnivaci((prev) => [...prev, { id: u.id, pseudonim: u.pseudonim }]);
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/zajednica" className="text-kolo-muted hover:text-kolo-muted text-sm transition-colors">← Zadruge</Link>
        <h1 className="text-2xl font-semibold text-kolo-text">Osnivanje zadruge</h1>
      </div>

      <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-2xl px-4 py-3 text-sm text-kolo-gold-600">
        Potrebno je najmanje <strong>5 verifikovanih članova</strong> (vi + 4 osnivača). Admin UO odobrava osnivanje.
        Po odobrenju zadruga dobija <strong>50.000 POEN</strong> (Čl. 37).
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-white rounded-2xl border border-kolo-border p-6">

        {/* Sedište */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            Sedište <span className="text-kolo-muted font-normal">(mesto osnivanja)</span>
          </label>
          <LokacijaSearch
            value={location}
            onChange={(val) => setLocation(val)}
            placeholder="npr. Sombor"
          />
          {!userLocation && (
            <p className="text-xs text-kolo-muted mt-1.5">
              Možeš podesiti default lokaciju u{" "}
              <Link href="/profil" className="text-kolo-green-700 hover:underline">profilu</Link>.
            </p>
          )}
        </div>

        {/* Naziv */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">Naziv zadruge *</label>
          <input
            type="text"
            maxLength={80}
            value={name}
            onChange={(e) => { setName(e.target.value); setNameEdited(true); }}
            placeholder="npr. KOLO Zadruga Sombor"
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
          />
          {!nameEdited && location && (
            <p className="text-xs text-kolo-muted mt-1.5">Naziv je automatski generisan iz sedišta.</p>
          )}
        </div>

        {/* Opis */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            Opis <span className="text-kolo-muted font-normal">(opciono)</span>
          </label>
          <textarea
            rows={3}
            maxLength={300}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kratki opis ciljeva i delatnosti zadruge..."
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none transition-colors"
          />
        </div>

        {/* Osnivači */}
        <div>
          <label className="block text-sm font-semibold text-kolo-muted mb-2">
            Osnivači * <span className="text-kolo-muted font-normal">({osnivaci.length + 1}/min 5 — vi ste prvi)</span>
          </label>

          {osnivaci.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {osnivaci.map((o) => (
                <div key={o.pseudonim} className="flex items-center gap-1.5 bg-kolo-green-100 border border-kolo-green-100 rounded-lg px-3 py-1.5">
                  <span className="text-sm text-kolo-green-900 font-medium">{o.pseudonim}</span>
                  <button type="button" onClick={() => ukloniOsnivaoca(o.pseudonim)}
                    className="text-kolo-green-500 hover:text-kolo-green-700 text-sm leading-none">×</button>
                </div>
              ))}
            </div>
          )}

          <div className="relative" ref={searchRef}>
            <input
              type="text"
              value={searchQ}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Pretraži po pseudonimu..."
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
            />
            {sugestije.length > 0 && (
              <ul ref={sugestijeRef} className="absolute z-20 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg overflow-hidden">
                {sugestije.map((s, i) => (
                  <li key={s.pseudonim}>
                    <button type="button" onMouseDown={() => dodajOsnivaoca(s)}
                      onMouseEnter={() => setAktivniIndex(i)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        i === aktivniIndex
                          ? "bg-kolo-green-100 text-kolo-green-700"
                          : "text-kolo-muted hover:bg-kolo-green-100 hover:text-kolo-green-700"
                      }`}>
                      {s.pseudonim}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
        >
          {loading ? "Šaljem zahtev..." : "Pošalji zahtev za osnivanje"}
        </button>
      </form>
    </div>
  );
}
