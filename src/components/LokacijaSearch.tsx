"use client";

import { useState, useRef, useEffect } from "react";
import { NASELJA_SRBIJE } from "@/lib/naselja-srbije";

function normalizuj(s: string): string {
  return s
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/[š]/g, "s")
    .replace(/[ž]/g, "z")
    .replace(/[đ]/g, "d");
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LokacijaSearch({ value, onChange, placeholder = "npr. Novi Sad", className = "" }: Props) {
  const [query, setQuery] = useState(value);
  const [sugestije, setSugestije] = useState<string[]>([]);
  const [showSugestije, setShowSugestije] = useState(false);
  const [aktivniIndex, setAktivniIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSugestije(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInput(val: string) {
    setQuery(val);
    onChange(val);
    setAktivniIndex(-1);
    if (val.trim().length < 2) {
      setSugestije([]);
      setShowSugestije(false);
      return;
    }
    const q = normalizuj(val.trim());
    const rezultati = NASELJA_SRBIJE.filter((n) =>
      normalizuj(n).startsWith(q) ||
      normalizuj(n).includes(q)
    ).slice(0, 10);
    setSugestije(rezultati);
    setShowSugestije(true);
  }

  function odaberi(naziv: string) {
    setQuery(naziv);
    onChange(naziv);
    setSugestije([]);
    setShowSugestije(false);
    setAktivniIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSugestije || sugestije.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const novi = Math.min(aktivniIndex + 1, sugestije.length - 1);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const novi = Math.max(aktivniIndex - 1, 0);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (aktivniIndex >= 0 && aktivniIndex < sugestije.length) {
        e.preventDefault();
        odaberi(sugestije[aktivniIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSugestije(false);
      setAktivniIndex(-1);
    }
  }

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => {
          if (query.trim().length >= 2) {
            const q = normalizuj(query.trim());
            setSugestije(NASELJA_SRBIJE.filter((n) => normalizuj(n).includes(q)).slice(0, 10));
            setShowSugestije(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showSugestije && sugestije.length > 0}
        className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 transition-colors"
      />
      {showSugestije && sugestije.length > 0 && (
        <ul ref={listaRef} className="absolute z-20 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg overflow-y-auto max-h-60">
          {sugestije.map((naziv, i) => (
            <li key={naziv}>
              <button
                type="button"
                onMouseDown={() => odaberi(naziv)}
                onMouseEnter={() => setAktivniIndex(i)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  i === aktivniIndex
                    ? "bg-kolo-green-100 text-kolo-green-800"
                    : "text-kolo-muted hover:bg-kolo-green-50 hover:text-kolo-green-700"
                }`}
              >
                {naziv}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
