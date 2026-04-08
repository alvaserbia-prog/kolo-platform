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
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    onChange(val); // keep parent in sync with raw input too
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
  }

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => query.trim().length >= 2 && setSugestije(
          NASELJA_SRBIJE.filter((n) => normalizuj(n).includes(normalizuj(query))).slice(0, 10)
        ) && setShowSugestije(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-600 transition-colors"
      />
      {showSugestije && sugestije.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {sugestije.map((naziv) => (
            <li key={naziv}>
              <button
                type="button"
                onMouseDown={() => odaberi(naziv)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-kolo-green-50 hover:text-kolo-green-700 transition-colors"
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
